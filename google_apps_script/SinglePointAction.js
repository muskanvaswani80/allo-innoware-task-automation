/**
 * ALLO INNOWARE - SINGLE-POINT EMPLOYEE ACTION HANDLER
 * Enables employees to view pending tasks and record completions from a single console.
 */

/**
 * Handles completion triggered directly by onEdit checkbox in 01_Employee_Action_Portal
 */
function handlePortalDirectCompletion(sheet, row) {
  try {
    const taskId = sheet.getRange(row, 1).getValue().toString().trim();
    const taskName = sheet.getRange(row, 2).getValue().toString().trim();
    const proofRequired = sheet.getRange(row, 8).getValue().toString().trim();
    let enteredProof = sheet.getRange(row, 9).getValue().toString().trim();
    const enteredNotes = sheet.getRange(row, 10).getValue().toString().trim();

    if (!taskId) {
      sheet.getRange(row, 11).setValue(false);
      return;
    }

    // Validation logic based on required proof
    if (proofRequired.toLowerCase().includes("ticket")) {
      if (!enteredProof || enteredProof.length < 3) {
        SpreadsheetApp.getActiveSpreadsheet().toast(
          `Validation Error: Task ${taskId} requires a valid Ticket ID. Please enter it in Column I before marking complete.`,
          "Missing Ticket ID",
          6
        );
        sheet.getRange(row, 11).setValue(false);
        return;
      }
    } else if (proofRequired.toLowerCase().includes("whatsapp")) {
      if (!enteredProof) {
        // Auto-generate standardized verification hash if employee confirmed action
        enteredProof = generateDailyWhatsAppConfirmation(taskId, "Single-Point Portal Checkbox");
        sheet.getRange(row, 9).setValue(enteredProof);
      }
    }

    const currentUser = Session.getActiveUser().getEmail() || "employee@alloinnoware.com";
    const rolloverResult = rolloverTaskCycle(taskId, enteredProof, currentUser, enteredNotes);

    // Clean up input cells for the portal
    sheet.getRange(row, 9).setValue("");
    sheet.getRange(row, 10).setValue("");
    sheet.getRange(row, 11).setValue("Completed");

    // Re-sync portal row with updated task master status
    refreshPortalView();

    SpreadsheetApp.getActiveSpreadsheet().toast(
      `✅ Success! ${taskName} (Cycle ${rolloverResult.completedCycle}) closed. Cycle ${rolloverResult.newCycle} is now tracked. Next due: ${rolloverResult.newDueDate}.`,
      "Cycle Completed",
      7
    );
  } catch (err) {
    sheet.getRange(row, 11).setValue(false);
    SpreadsheetApp.getUi().alert("Error submitting completion: " + err.message);
  }
}

/**
 * Menu item action: Submit Task Completion for the currently active row
 */
function menuSubmitTaskCompletion() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const ui = SpreadsheetApp.getUi();

  if (sheet.getName() !== CONFIG.SHEET_PORTAL) {
    ui.alert("Please switch to '01_Employee_Action_Portal' to complete tasks.");
    return;
  }

  const row = sheet.getActiveCell().getRow();
  if (row < 8) {
    ui.alert("Please click on a row containing a pending task (Row 8 or below).");
    return;
  }

  const taskId = sheet.getRange(row, 1).getValue().toString().trim();
  const taskName = sheet.getRange(row, 2).getValue().toString().trim();
  const proofType = sheet.getRange(row, 8).getValue().toString().trim();
  let enteredProof = sheet.getRange(row, 9).getValue().toString().trim();
  let enteredNotes = sheet.getRange(row, 10).getValue().toString().trim();

  if (!taskId) {
    ui.alert("No valid Task ID found in the selected row.");
    return;
  }

  // Prompt user if proof is empty
  if (!enteredProof) {
    const promptMsg = proofType.toLowerCase().includes("ticket")
      ? `Enter the Portal Ticket ID for [${taskName}]:`
      : `Enter WhatsApp Confirmation details / link for [${taskName}]:`;
    const resp = ui.prompt("Task Completion Verification", promptMsg, ui.ButtonSet.OK_CANCEL);
    if (resp.getSelectedButton() !== ui.Button.OK) return;
    enteredProof = resp.getResponseText().trim();
  }

  if (proofType.toLowerCase().includes("ticket") && (!enteredProof || enteredProof.length < 2)) {
    ui.alert("Error: A valid Ticket ID is strictly required to close this cycle.");
    return;
  }

  const currentUser = Session.getActiveUser().getEmail() || "employee@alloinnoware.com";
  const result = rolloverTaskCycle(taskId, enteredProof, currentUser, enteredNotes || "Completed via Ops Menu");

  sheet.getRange(row, 9).setValue("");
  sheet.getRange(row, 10).setValue("");
  sheet.getRange(row, 11).setValue("Completed");

  refreshPortalView();

  ui.alert(`🎉 Task Completed Successfully!\n\nTask: ${taskName} (${taskId})\nClosed Cycle: ${result.completedCycle}\nNext Active Cycle: ${result.newCycle}\nNext Due Date: ${result.newDueDate}\nProof Logged: ${enteredProof}`);
}

/**
 * Re-reads Task Master and updates the active rows on Employee Action Portal
 */
function refreshPortalView() {
  const portalSheet = getSheet(CONFIG.SHEET_PORTAL);
  const masterSheet = getSheet(CONFIG.SHEET_MASTER);
  if (!portalSheet || !masterSheet) return;

  const selectedEmployee = portalSheet.getRange("C4").getValue().toString().trim();
  const masterData = masterSheet.getDataRange().getValues();

  let targetRow = 8;
  for (let i = 4; i < masterData.length; i++) {
    const assigned = (masterData[i][2] || "").toString().trim();
    const status = (masterData[i][11] || "").toString().trim();

    // Show tasks for selected employee or all active pending if no filter
    if (!selectedEmployee || assigned === selectedEmployee || selectedEmployee === "All Employees") {
      portalSheet.getRange(targetRow, 1).setValue(masterData[i][0]);  // Task ID
      portalSheet.getRange(targetRow, 2).setValue(masterData[i][1]);  // Task Name
      portalSheet.getRange(targetRow, 3).setValue(masterData[i][5]);  // Frequency
      portalSheet.getRange(targetRow, 4).setValue(masterData[i][8]);  // Cycle #
      portalSheet.getRange(targetRow, 5).setValue(masterData[i][9]);  // Due Date
      portalSheet.getRange(targetRow, 6).setValue(masterData[i][10]); // Due Time
      portalSheet.getRange(targetRow, 7).setValue(masterData[i][11]); // Current Status
      portalSheet.getRange(targetRow, 8).setValue(masterData[i][7]);  // Required Proof
      targetRow++;
      if (targetRow > 14) break;
    }
  }
}
