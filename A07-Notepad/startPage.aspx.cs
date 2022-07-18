//============================================================================
/*
* FILE              : startPage.aspx.cs
* PROJECT           : PROG2001 - A07
* PROGRAMMER        : Briana Burton & Sunraj Sharma
* FIRST VERSION     : 2021-12-04
* DESCRIPTION       :
*   The file holds the funtionality of the service for the notepad site. This
*   file holds the functions that will be called in the Notepad-JQuery.js file.
*   This holds functions that will recieve a message sent by AJAX call and will
*   return a json message back to the calling function. This file holds the
*   functionality for opening the list of files, saving the text area, and 
*   saving the text area to a new file.
*/
//============================================================================

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;

namespace A07_Notepad
{
    public partial class startPage : System.Web.UI.Page
    {
        static string feedback = null;  // field which holds last feedback message

        //============================================================================
        // FUNCTION         : UsrPrintFeedback()
        // DESCRIPTION      :
        //      This function is used in order to sent back a json message containg 
        //      the last feedback message used. The function will send the string
        //      containing the feedback message after being parsed into json.
        // PARAMETERS       : string message
        // RETURNS          : none
        //============================================================================
        [WebMethod]
        public static string UsrPrintFeedback(string message)
        {
            string returnData = null;  // final JSON return value
            string fileStatus = null;  // holds the file status

            fileStatus = feedback;     //  storing feedback into variable

            // sending json back to calling function
            returnData = JsonConvert.SerializeObject(new { status = fileStatus});
            return returnData;
        }

        //============================================================================
        // FUNCTION         : UsrFileSaveAs()
        // DESCRIPTION      :
        //      This function is used to invoken the working of saveAs functionality in the notepad.
        //      The functions contains feedback messages, it checks for extensions.
        //      When user clicks saveAs, it checks for the name entered by the user.
        //      If the name is found, it saves the file in myFiles folder, if not then displays an error message 
        // PARAMETERS       : string message
        // RETURNS          : none
        //============================================================================
        [WebMethod]
        public static string UsrFileSaveAs(string message)
        {
            string returnData = null;  // final JSON return value
            string fileStatus = null;
            string fileContents = null;
            string filepath = null;

            string[] splitted = message.Split(new string[] { "|" }, 2, StringSplitOptions.None);    // add | in file names
            // store them in strings
            string fileToSave = splitted[0];
            string text = splitted[1];

            bool result;
            result = Path.HasExtension(fileToSave); 

            if (result == false)
            {
                fileStatus = "Failure";
                fileContents = "- File Must Have an Extension";
                feedback = fileStatus + " " + fileContents;
            }
            else if (fileToSave == "")
            {
                fileStatus = "Failure";
                fileContents = "- File Must Have a Name";
                feedback = fileStatus + " " + fileContents;
            }
            else if (text == "")
            {
                fileStatus = "Failure";
                fileContents = "- Text Box is Empty";
                feedback = fileStatus + " " + fileContents;
            }
            else
            {
                try
                {
                    const string folderName = "MyFiles";
                    filepath = HttpContext.Current.Server.MapPath(folderName);
                    filepath = filepath + @"\" + fileToSave;

                    if (!File.Exists(filepath))
                    {
                        // Write the string array to a new file named "WriteLines.txt".
                        using (StreamWriter outputFile = new StreamWriter(filepath))
                        {
                            outputFile.WriteLine(text);
                        }

                        fileStatus = "Success";
                        fileContents = "- File Saved";
                        feedback = fileStatus + " " + fileContents;
                    }
                    else
                    {
                        fileStatus = "Failure";
                        fileContents = "- File Already Exists";
                        feedback = fileStatus + " " + fileContents;
                    }
                }
                catch (Exception e)
                {
                    // exception occured. Store error satus
                    fileStatus = "Exception";
                    fileContents = "- Something bad happened : " + e.ToString();
                    feedback = fileStatus + " " + fileContents;
                }
            }

            // send back to user the data
            returnData = JsonConvert.SerializeObject(new { status = fileStatus, description = fileContents });
            return returnData;
        }

        //============================================================================
        // FUNCTION         : UsrFileSave()
        // DESCRIPTION      :
        //      This function is used in order append the updated data into the current file 
        //      The function checks if the file exsists and if it does, great it saves stuff,
        //      if it doesn't it shows error/
        // PARAMETERS       : string message
        // RETURNS          : none
        //============================================================================
        [WebMethod]
        public static string UsrFileSave(string message)
        {
            string returnData = null;  // final JSON return value
            string fileStatus = null;
            string fileContents = null;
            string filepath = null;

            string[] splitted = message.Split(new string[] { "|" }, 2, StringSplitOptions.None);

            string fileToSave = splitted[0];
            string text = splitted[1];

            try
            {
                const string folderName = "MyFiles";
                filepath = HttpContext.Current.Server.MapPath(folderName);
                filepath = filepath + @"\" + fileToSave;

                if (File.Exists(filepath))
                {
                    // Write the string array to a new file named "WriteLines.txt".
                    using (StreamWriter outputFile = new StreamWriter(filepath))
                    {
                        outputFile.WriteLine(text);
                    }


                    fileStatus = "Success";
                    fileContents = File.ReadAllText(filepath);
                    feedback = fileStatus;
                }
                else
                {
                    fileStatus = "Failure";
                    fileContents = "- File doesn't exist";
                    feedback = fileStatus + " " + fileContents;
                }
            }
            catch (Exception e)
            {
                // I need to return something in the JSON value to indicate the exception/hold some
                // useful information for the user ...
                fileStatus = "Exception";
                fileContents = "- Something bad happened : " + e.ToString();
                feedback = fileStatus + " " + fileContents;
            }

            returnData = JsonConvert.SerializeObject(new { status = fileStatus, description = fileContents });
            return returnData;
        }


        //============================================================================
        // FUNCTION         : CreateList()
        // DESCRIPTION      :
        //      This function is used in order to sent back a json message containg 
        //      the list of files available in the My Fil folder. 
        // PARAMETERS       : string message
        // RETURNS          : none
        //============================================================================
        [WebMethod]
        public static string CreateList(string locationToLoad)
        {
            string returnData = null;  // final JSON return value
            string fileStatus = null;
            string fileContents = null;
            string directoryPath = null;

            try
            {
                directoryPath = HttpContext.Current.Server.MapPath(locationToLoad + @"\");

                if (Directory.Exists(directoryPath))
                {
                    string[] files = new DirectoryInfo(directoryPath).GetFiles().Select(o => o.Name).ToArray();
                    string gigaString = (string.Join("|", files));

                    fileStatus = "Success";
                    fileContents = gigaString;
                }
                else
                {
                    fileStatus = "Failure";
                    fileContents = "File doesn't exist";
                }
            }
            catch (Exception e)
            {
                // I need to return something in the JSON value to indicate the exception/hold some
                // useful information for the user ...
                fileStatus = "Exception";
                fileContents = "Something bad happened : " + e.ToString();
            }
            returnData = JsonConvert.SerializeObject(new { status = fileStatus, description = fileContents });
            return returnData;
        }


        //============================================================================
        // FUNCTION         : UsrFileOptionOpen()
        // DESCRIPTION      :
        //      This function is used in order to sent back a json message containg 
        //      the last feedback message used. The function will send the string
        //      containing the feedback message after being parsed into json.
        // PARAMETERS       : string usrFileChoice
        // RETURNS          : none
        //============================================================================
        [WebMethod]
        public static string UsrFileOptionOpen(string usrFileChoice)
        {
            string returnData;  // final JSON return value
            string fileStatus;
            string fileContents;
            string filepath;

            try
            {
                filepath = HttpContext.Current.Server.MapPath("MyFiles");
                filepath = filepath + @"\" + usrFileChoice;


                if (File.Exists(filepath))
                {
                    fileStatus = "Success";
                    fileContents = File.ReadAllText(filepath);
                    feedback = fileStatus;
                }
                else if (usrFileChoice == "")
                {
                    fileStatus = "Success";
                    fileContents = "Empty Project";
                }
                else
                {
                    fileStatus = "Failure";
                    fileContents = "File doesn't exist";
                }
            }
            catch (Exception e)
            {
                // I need to return something in the JSON value to indicate the exception/hold some
                // useful information for the user ...
                fileStatus = "Exception";
                fileContents = "Something bad happened : " + e.ToString();
            }

            returnData = JsonConvert.SerializeObject(new { status = fileStatus, description = fileContents });
            return returnData;
        }
    }
}