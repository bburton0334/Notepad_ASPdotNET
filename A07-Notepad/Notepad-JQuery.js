//============================================================================
/*
* FILE              : Notepad-JQuery.js
* PROJECT           : PROG2001 - A07
* PROGRAMMER        : Briana Burton & Sunraj Sharma
* FIRST VERSION     : 2021-12-04
* DESCRIPTION       :
*   The file holds the funtionality of the notepad site. This is where all of
*   AJAX calls, jquery, and json takes place. The functions in the file are 
*   used to send AJAX calls to the corrospionding functions and recive their
*   message in return. The AJAX calls send json messages to the function in
*   order to send a request from them. Client side will update depending on
*   returned values
*/
//============================================================================

// global variable - for use in jQuery (AJAX) calls
var jQueryXMLHttpRequest; 


//jquery activate only when ready
//does the intial call to get the file list on document ready
$(document).ready(function () {

    document.getElementById("txtFileName").disabled = true; // disabling the text file name box on startup

    // calling function to populate drop down list
    openCreateList();

    // calling function to show feedback
    printFeedback();
});


// This is called when the Save button is clicked
$(document).on('click', '#btnSave', function () {

    // calling function to deal with save functionality
    fileSave();
});


// This is called when the Save As button is clicked
$(document).on('click', '#btnSaveAs', function () {

    // calling function to deal with save as functionality
    fileSaveAs();
});


// This is called when the text box area on the page has
// been changed. It will change various things.
$(document).on("input", "#pageTextArea", function () {

    document.getElementById("txtFileName").disabled = false;    // enabling text box to type file name
    document.getElementById("btnSaveAs").disabled = false;      // enabling save as button
    document.getElementById("lblFeedback").innerHTML = "";      // resetting the feedback label
});



//============================================================================
// FUNCTION         : printFeedback()
// DESCRIPTION      :
//      This function sends an ajax call request to the function UsrPrintFeedback().
//      It will send a request and the called function, if successfull, return the
//      last used feeback status back to this function as a json message. This is
//      done so feedback can be printed to the screen during button click events.
//      this function will update the feedback label accordingly.
// PARAMETERS       : none
// RETURNS          : none
//============================================================================
function printFeedback() {

    var pageMessage = "";                       // holds data message
    var jsonData = { message: pageMessage };    // holds parameter to be sent
    var jsonString = JSON.stringify(jsonData);  // parsing to json

    // AJAX call request to function
    jQueryXMLHttpRequest = $.ajax({
        type: "POST",
        url: "startPage.aspx/UsrPrintFeedback",
        data: jsonString,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            // checking if data sent from function is not null
            if (data != null && data.d != null) {

                var response;   // holds response from function

                //parsing json into variable to be read
                response = $.parseJSON(data.d);

                // checking response is not null
                if (response.status != null && response.status != "") {

                    // updating file status for user
                    document.getElementById("lblFeedback").innerHTML = "File status : <b>" + response.status + "</b>";
                }
            }
        },
        fail: function () {

            // error: printing message to user
            document.getElementById("lblFeedback").innerHTML = "The call to the WebMethod failed!";
        }

    });
}



//============================================================================
// FUNCTION         : fileSaveAs()
// DESCRIPTION      :
//      This function sends an ajax call request to the function UsrFileSaveAs()
//      , it will pass the typed file name and the content of the text box as
//      a paramter, and if successfull, the called function will return a 
//      status message indicating that the file has been saved sucessfully.
//      This function will then update the feedback lable with the status.
// PARAMETERS       : none
// RETURNS          : none
//============================================================================
function fileSaveAs() {

    // holds the selected file name
    var fileName = document.getElementById("txtFileName");
    fileName = fileName.value;

    // holds the text box data
    var currentTextArea = document.getElementById("pageTextArea");
    currentTextArea = currentTextArea.value;

    // combining the message with a delemiter
    var combinedMessage = fileName + "|" + currentTextArea;

    // parsing value into json
    var jsonData = { message: combinedMessage };
    var jsonString = JSON.stringify(jsonData);

    // ajax call
    jQueryXMLHttpRequest = $.ajax({
        type: "POST",
        url: "startPage.aspx/UsrFileSaveAs",
        data: jsonString,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            // checking if data is null
            if (data != null && data.d != null) {

                // holds response from function
                var response;

                //parisng to json
                response = $.parseJSON(data.d);

                // updating labels based on returned values from function
                document.getElementById("lblFeedback").innerHTML = "File Save As status : <b>" + response.status + "</b>";
                document.getElementById("pageTextArea").value = response.description;
            }
        },
        fail: function () {
            // error. print error message
            document.getElementById("lblFeedback").innerHTML = "The call to the WebMethod failed!";
        }

    });
}



//============================================================================
// FUNCTION         : fileSave()
// DESCRIPTION      :
//      This function sends an ajax call request to the function UsrFileSave()
//      , it will pass select file name and the content of the text box as
//      a paramter, and if successfull, the called function will return a 
//      status message indicating that the file has been saved sucessfully.
//      This function will then update the feedback lable with the status.
// PARAMETERS       : none
// RETURNS          : none
//============================================================================
function fileSave() {

    // holds the selected file name
    var currentSelect = document.getElementById("slctFileList");
    currentSelect = currentSelect.value;

    // holds the text box data typed by user
    var currentText = document.getElementById("pageTextArea");
    currentText = currentText.value;

    // combining the message into one message
    var combinedMsg = currentSelect + "|" + currentText;

    // parsing into json
    var jsonData = { message: combinedMsg };
    var jsonString = JSON.stringify(jsonData);

    //ajax call
    jQueryXMLHttpRequest = $.ajax({
        type: "POST",
        url: "startPage.aspx/UsrFileSave",
        data: jsonString,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            // checking if data is not null
            if (data != null && data.d != null) {

                // holds respose from function
                var response;

                //parisng json data
                response = $.parseJSON(data.d);

                // updating labels with data passed by function
                document.getElementById("lblFeedback").innerHTML = "File Save status : <b>" + response.status + "</b>";
                document.getElementById("pageTextArea").value = response.description;
            }
        },
        fail: function () {
            //error: signiy error to user
            document.getElementById("lblFeedback").innerHTML = "The call to the WebMethod failed!";
        }

    });
}



//============================================================================
// FUNCTION         : LoadFileIntoTextBox
// DESCRIPTION      :
//      This function sends an ajax call request to the function UsrFileOptionOpen()
//      , it will pass the select option in the dropdown list as a parameter, and if
//      successfull, the called function will return a status of success so the file
//      can be loaded into the textbox. The called function will also send back the
//      contents off the file the user has selected
// PARAMETERS       : sel (selected element in select element)
// RETURNS          : none
//============================================================================
function loadFileIntoTextBox(sel) {

    // holds the selected value from drop down list
    var usrFileOption = sel.value;

    // parisng string into json string
    var jsonData = { usrFileChoice: usrFileOption };
    var jsonString = JSON.stringify(jsonData);

    // checking if selection is not empty
    if (usrFileOption != "") {

        // ajax call
        jQueryXMLHttpRequest = $.ajax({
            type: "POST",
            url: "startPage.aspx/UsrFileOptionOpen",
            data: jsonString,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                // checking if data is not null
                if (data != null && data.d != null) {

                    // holds response from the called function
                    var response;

                    //parsing response from json to string
                    response = $.parseJSON(data.d);

                    // enabling button depeding on if selection is valid
                    if (response.description != "" || (response.description == "" && usrFileOption != "")) {

                        // enable button
                        document.getElementById("btnSave").disabled = false;
                    }
                    else {

                        // disable button
                        document.getElementById("btnSave").disabled = true;
                    }

                    // updating labels, buttons, and text area depedning on
                    // the returned data by the called function.
                    document.getElementById("txtFileName").disabled = false;
                    document.getElementById("btnSaveAs").disabled = false;
                    document.getElementById("lblFeedback").innerHTML = "File loading status : <b>" + response.status + "</b>";
                    document.getElementById("pageTextArea").value = response.description;
                }
            },
            fail: function () {

                // signify error to user in feedback
                document.getElementById("lblFeedback").innerHTML = "The call to the WebMethod failed!";
            }

        });
    }
    else {

        // diablin the save button
        document.getElementById("btnSave").disabled = true;
    }
}



//============================================================================
// FUNCTION         : openCreateList
// DESCRIPTION      :
//      This function sends an ajax call request to the function CreateList()
//      , it will pass the foldername as a prameter, and if successfull, the
//      called function will return a delimited string containing all of the
//      file names with MyFiles. This function will then append each file
//      name to the select element to the user may select the file of their
//      choice.
// PARAMETERS       : none
// RETURNS          : none
//============================================================================
function openCreateList()
{
    var folderName = "MyFiles";                     // variable which holds the folder name for the files

    var jsonData = { locationToLoad: folderName };  // variable which holds the prameter for the function
    var jsonString = JSON.stringify(jsonData);      // converts string to json

    // jQuery request. Sends request to CreatList() function
    jQueryXMLHttpRequest = $.ajax({
        type: "POST",
        url: "startPage.aspx/CreateList",
        data: jsonString,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            // checking if data returned from function is not null
            if (data != null && data.d != null) {

                var response;   // variable which holds response from function

                //parsing json data
                response = $.parseJSON(data.d);

                var delFileNames = response.description;    // variable which holds message from function
                const myArray = delFileNames.split("|");    // splitting message based on delimiter

                var select = document.getElementById("slctFileList");    // variable is the id for the select element

                // populating select element with file names
                for (var i = 0; i < myArray.length; i++) {

                    // appending the select element for each file
                    // found within the myArray variable
                    var opt = myArray[i];
                    var el = document.createElement("option");
                    el.textContent = opt;
                    el.value = opt;
                    select.appendChild(el);
                }

            }
        },
        fail: function () {

            // failure sending request. Print feedback
            document.getElementById("lblFeedback").innerHTML = "The call to the WebMethod failed!";
        }

    });
}
