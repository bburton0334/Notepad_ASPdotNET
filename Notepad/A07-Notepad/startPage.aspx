<!-- 
//============================================================================
/*
* FILE              : startPage.aspx
* PROJECT           : PROG2001 - A07
* PROGRAMMER        : Briana Burton & Sunraj Sharma
* FIRST VERSION     : 2021-12-04
* DESCRIPTION       :
*   The file holds the html aspect of the page. This is what the user sees 
*   when the page loads. It presents a textbox where the user can input
    data. It presents a save button, save as button, and dropdown menu.
    It also has a field which will update with user feedback
*/
//============================================================================
-->

<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="startPage.aspx.cs" Inherits="A07_Notepad.startPage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Notepad</title>
    <style>

    body {
        background-color: #c4c4c4;
  
    }

    .text {
        position: relative;
        text-align: center;
        text-transform: uppercase;
        font-family: verdana;
        font-size: 12em;
        font-weight: 700;
        color: #f5f5f5;
        text-shadow: 1px 1px 1px #919191,
            1px 2px 1px #919191,
            1px 3px 1px #919191,
            1px 4px 1px #919191,
            1px 5px 1px #919191,
            1px 6px 1px #919191,
            1px 7px 1px #919191,
            1px 8px 1px #919191,
            1px 9px 1px #919191,
            1px 10px 1px #919191,
        1px 18px 6px rgba(16,16,16,0.4),
        1px 22px 10px rgba(16,16,16,0.2),
        1px 25px 35px rgba(16,16,16,0.2),
        1px 30px 60px rgba(16,16,16,0.4);
    }
    </style>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type = "text/javascript" src = "Notepad-JQuery.js"></script>

</head>
<body>
    <form id="frmNotepad" runat="server">
        <div style="align-content:center; text-align:center;">
            <span class="text" style="font-size: 78px; text-align:center;">best text editor</span>
            <br /><br />
            <hr />

            <!-- this holds the table where the user will be interatcing with -->

            <asp:Table runat="server"  style="margin:0 auto">
                <asp:TableHeaderRow HorizontalAlign="Left">
                    <asp:TableHeaderCell>
                        <asp:Button ToolTip="Save project to selected file" Width="70px" name="btnSave" ID="btnSave" runat="server" Text="Save" Enabled="False" />
                    </asp:TableHeaderCell>
                    <asp:TableHeaderCell>
                        <select name="slctFileList" id="slctFileList" onchange="loadFileIntoTextBox(this);">
                            <option></option>
                        </select>
                    </asp:TableHeaderCell>
                    <asp:TableHeaderCell>
                        <asp:Button ToolTip="Save project as new file" Width="70px" name="btnSaveAs" ID="btnSaveAs" runat="server" Text="Save As" Enabled="False" />
                    </asp:TableHeaderCell>
                    <asp:TableHeaderCell>
                        <asp:TextBox ToolTip="Enter desired file name to save as" placeholder="New File Name (e.g. file.txt)" ID="txtFileName" runat="server" Width="200px"></asp:TextBox>
                    </asp:TableHeaderCell>
                    <asp:TableHeaderCell>
                        <asp:Label style="font-family: Verdana; font-size:12px;" ID="lblFeedback" runat="server" Width="320px" class="statusBarText"></asp:Label>
                    </asp:TableHeaderCell>
                </asp:TableHeaderRow>
            </asp:Table>
            <textarea id="pageTextArea" class="textbox" style="width:800px; resize:none; height:390px;"></textarea>
        </div>
    </form>
</body>
</html>
