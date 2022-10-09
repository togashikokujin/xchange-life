/* Harlowe file import/export code - Start */
var harlowesave = { saveFilename: $("tw-storydata").attr("name") + ".lsm" };  // Set the save filename here!
harlowesave.ifid = $("tw-storydata").attr("ifid");
harlowesave.saveName = "(Saved Game " + harlowesave.ifid +") ";
harlowesave.intervalID = 0;
harlowesave.intervalCount = 0;

// Triggers calling HarloweSaveCheck() once elements with the "harlowesave" class exist.  Gives up after 6s.
harlowesave.handler = function () {
    if ($(".harlowesave").length) {  // Look for the "harlowesave" class
        if (harlowesave.intervalID) {  // Clear running interval
            clearInterval(harlowesave.intervalID);
            harlowesave.intervalID = 0;
        }
        HarloweSaveCheck();  // Update "harlowesave" elements
    } else if (harlowesave.intervalID === 0) {  // Wait for "harlowesave" elements to appear
        harlowesave.intervalID = setInterval(harlowesave.handler, 300);
        harlowesave.intervalCount = 0;
    } else if (++harlowesave.intervalCount > 20) {  // Give up after 6s
            clearInterval(harlowesave.intervalID);
            harlowesave.intervalID = 0;
    }
};

// Adds a (setupHarlowesave:) macro you can call to set up the buttons.
Harlowe.macro("setupHarlowesave", harlowesave.handler);

// Runs a check of HTML elements every 0.3 seconds.
// setInterval(HarloweSaveCheck, 300);

/* saveData:
            Saves the game data to the browser's default save directory,
            saving the object passed to it as a JSON string wrapped inside
            a JavaScript function.
*/
function saveData (data, fname) {
    var blob = new Blob([
        "window.getData = function () { return " +
        JSON.stringify(data) + " };"], { type: "text/plain;charset=utf-8" });
    saveAs(blob, fname);
}

/* loadDialog:
            Loads the JavaScript picked from the "File Load" dialog box as
            text, strips off the JavaScript, parses the JSON content, and
            then passes it to the handler function.  The optinal "type"
            parameter should be a string file extension; defaults to ".lsm".
            *.lsm = Load/Save Module data
*/
function loadDialog (handler, type, param) {
    function loadTrigger (event) {
        var file = event.target.files[0], reader = new FileReader();
        $(reader).on("load", function (ev) {
            var target = ev.currentTarget;
            if (!target.result) {
                return;
            }
            try {
                if (target.result.indexOf('window.getData = function () { return ') === 0) {
                    handler(JSON.parse(target.result.slice(37, -3)), param);
                } else {
                    alert("Error: Invalid file.");
                }
            } catch (ex) {
                alert("Error: Unable to parse file.");
                console.log("Unable to parse file.  Error:");
                console.log(ex);
            }
        });
        // Initiate the file load.
        reader.readAsText(file);
    }

    if (type === undefined) {
        type = ".lsm";
    }
    if ($("#hidFileInputEl").length) {
        $("#hidFileInputEl").off();
        $("#hidFileInputEl").val("");
        $("#hidFileInputEl").on("change", loadTrigger);
    } else {
        $(document.body).append($(document.createElement("input")).prop({ id: "hidFileInputEl", type: "file", accept: type }).css("display", "none").on("change", loadTrigger));
    }
    $("#hidFileInputEl").trigger("click");
}

function importHandler (data, slotName) {
    // Verify IFID matches
    if (data[0].key.indexOf(harlowesave.ifid) < 0) {
        alert("Error: Unable to import file.  This is a save file for a different game.");
    } else {
        var result = true;
        if (isProperty(localStorage, slotName)) {
            // Warn that the slot already has something in it
            result = confirm("Are you sure you want to overwrite the existing save in this slot?");
        }
        if (result) {
            // Import data into save slot
            localStorage.setItem(slotName, Base64ToUnicode(data[0].data));
            alert("Success!  You can now load this save.");
            harlowesave.handler();  // Try to update "harlowesave" elements
        }
    }
}

/* HarloweSaveCheck: Checks for "harlowesave" elements and initializes, enables, or disables them, as needed. */
function HarloweSaveCheck () {
    $(".harlowesave").each(function (index, element) {
        if (!$(this).hasClass("ready")) {  // Initialize uninitialized "harlowesave" elements
            $(this).addClass("ready");
            if ($(this).hasClass("importsave")) {  // Initialize "import" elements
                $(this).prop("disabled", false);
                $(this).on("click", function (el) {
                    // Import save slot data into the slot named by the "data-slotname" attribute
                    loadDialog(importHandler, ".lsm", harlowesave.saveName + $(this).data("slotname"));
                });
            }
            if ($(this).hasClass("exportsave")) {  // Initialize "export" elements
                $(this).on("click", function (el) {
                    // Export save slot data from the slot named by the "data-slotname" attribute
                    var slotName = harlowesave.saveName + $(this).data("slotname");
                    var data = [{ key: slotName, data: UnicodeToBase64(localStorage.getItem(slotName)) }];
                    saveData(data, harlowesave.saveFilename);
                });
            }
            if ($(this).hasClass("deleteslot")) {  // Initialize "delete" elements
                $(this).on("click", function (el) {
                    // Warn about deleting save data
                    if (confirm("Are you sure you want to delete the save in this slot?")) {
                        // Delete save slot data from the slot named by the "data-slotname" attribute
                        localStorage.removeItem(harlowesave.saveName + $(this).data("slotname"));
                        harlowesave.handler();  // Try to update "harlowesave" elements
                    }
                });
            }
        }
        if ($(this).hasClass("exportsave") || $(this).hasClass("deleteslot")) {  // Update "export" and "delete" elements
            if (isProperty(localStorage, harlowesave.saveName + $(this).data("slotname"))) {
                if ($(this).prop("disabled")) {  // Enable element
                    $(this).prop("disabled", false);
                }
            } else {
                if (!$(this).prop("disabled")) {  // Disable element
                    $(this).prop("disabled", true);
                }
            }
        }
    });
}
/* Harlowe file import/export code - End */