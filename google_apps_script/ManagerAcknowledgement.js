/**
 * ALLO INNOWARE - MANAGER ACKNOWLEDGEMENT & GOVERNANCE MODULE
 * Captures manager review actions, extends SLA grace periods, and prevents unnecessary escalations.
 */

/**
 * Records manager review and acknowledgment for an overdue task
 */
function recordManagerAcknowledgement(taskId, managerNotes, managerEmail) {
  const masterSheet = getSheet(CONFIG.SHEET_MASTER);
  const escSheet = getSheet(CONFIG.SHEET_ESCALATION);
  if (!masterSheet) return { success: false, message: "Master sheet not found" };

  const data = masterSheet.getDataRange().getValues();
  let rowIndex = -1;
  let task = null;

  for (let i = 4; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().trim().toUpperCase() === taskId.trim().toUpperCase()) {
      rowIndex = i + 1;
      task = {
        taskId: data[i][0],
        taskName: data[i][1],
        assignedTo: data[i][2],
        employeeEmail: data[i][3],
        currentCycle: data[i][8],
        alertLevel: parseInt(data[i][16], 10) || 0
      };
      break;
    }
  }

  if (!task) {
    return { success: false, message: `Task ${taskId} not found.` };
  }

  const now = new Date();
  const nowFormatted = Utilities.formatDate(now, CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");
  const effectiveMgr = managerEmail || Session.getActiveUser().getEmail() || CONFIG.DEFAULT_MANAGER_EMAIL;
  const effectiveNotes = managerNotes || "Acknowledged and under active operational review by Operations Manager";

  // Update Task Master:
  // Col Q (17): Alert_Level -> 2 (Acknowledged)
  // Col S (19): Manager_Ack_Status -> "Acknowledged"
  // Col T (20): Manager_Ack_At -> nowFormatted
  // Col U (21): Manager_Notes -> effectiveNotes
  masterSheet.getRange(rowIndex, 17).setValue(2);
  masterSheet.getRange(rowIndex, 19).setValue("Acknowledged");
  masterSheet.getRange(rowIndex, 20).setValue(nowFormatted);
  masterSheet.getRange(rowIndex, 21).setValue(effectiveNotes);

  // Update Escalations Log
  if (escSheet) {
    const escData = escSheet.getDataRange().getValues();
    for (let j = escData.length - 1; j >= 4; j--) {
      if (escData[j][1] === taskId && escData[j][3] === task.currentCycle) {
        escSheet.getRange(j + 1, 10).setValue(`Acknowledged by ${effectiveMgr} at ${nowFormatted}`);
        escSheet.getRange(j + 1, 11).setValue("IN PROGRESS (MGR REVIEWED)");
        break;
      }
    }
  }

  // Sync Manager Dashboard Ack Station
  syncManagerDashboardView();

  return {
    success: true,
    taskId: task.taskId,
    taskName: task.taskName,
    ackTimestamp: nowFormatted,
    managerEmail: effectiveMgr
  };
}

/**
 * Handles direct checkbox interaction on Manager Dashboard sheet
 */
function handleManagerDashboardDirectAck(sheet, row) {
  const taskId = sheet.getRange(row, 1).getValue().toString().trim();
  const taskName = sheet.getRange(row, 2).getValue().toString().trim();
  const notes = sheet.getRange(row, 7).getValue().toString().trim();

  if (!taskId) return;

  const result = recordManagerAcknowledgement(taskId, notes || "Reviewed via Dashboard Console Checkbox");
  
  if (result.success) {
    sheet.getRange(row, 6).setValue("YES (Acknowledged)");
    sheet.getRange(row, 8).setValue(result.ackTimestamp);
    sheet.getRange(row, 10).setValue("Protected by Grace Period");
    SpreadsheetApp.getActiveSpreadsheet().toast(
      `Manager Review Recorded: Task ${taskId} is now acknowledged. Leadership escalation paused.`,
      "Manager Acknowledgment",
      6
    );
  }
}

/**
 * Interactive menu prompt for manager review
 */
function menuManagerAcknowledge() {
  const ui = SpreadsheetApp.getUi();
  const prompt1 = ui.prompt("Manager Review & Acknowledgment", "Enter Task ID to acknowledge (e.g. TASK-003):", ui.ButtonSet.OK_CANCEL);
  if (prompt1.getSelectedButton() !== ui.Button.OK) return;
  const taskId = prompt1.getResponseText().trim();

  const prompt2 = ui.prompt("Manager Follow-up Note", "Enter review / corrective action notes (e.g. 'Awaiting client ticket resolution'):", ui.ButtonSet.OK_CANCEL);
  if (prompt2.getSelectedButton() !== ui.Button.OK) return;
  const notes = prompt2.getResponseText().trim();

  const result = recordManagerAcknowledgement(taskId, notes);
  if (result.success) {
    ui.alert(`✅ Manager Acknowledgment Stamped!\n\nTask: ${result.taskName} (${result.taskId})\nTimestamp: ${result.ackTimestamp}\nStatus: Leadership Escalation paused for SLA grace period.`);
  } else {
    ui.alert(`Error: ${result.message}`);
  }
}

/**
 * Syncs active alerts to the Manager Dashboard
 */
function syncManagerDashboardView() {
  const mgrSheet = getSheet(CONFIG.SHEET_DASHBOARD);
  const masterSheet = getSheet(CONFIG.SHEET_MASTER);
  if (!mgrSheet || !masterSheet) return;

  const masterData = masterSheet.getDataRange().getValues();
  let ackRow = 18;

  for (let i = 4; i < masterData.length; i++) {
    const alertLevel = parseInt(masterData[i][16], 10) || 0;
    if (alertLevel >= 1) {
      mgrSheet.getRange(ackRow, 1).setValue(masterData[i][0]);  // Task ID
      mgrSheet.getRange(ackRow, 2).setValue(masterData[i][1]);  // Task Name
      mgrSheet.getRange(ackRow, 3).setValue(masterData[i][2]);  // Assigned To
      mgrSheet.getRange(ackRow, 4).setValue(masterData[i][9]);  // Due Date
      mgrSheet.getRange(ackRow, 5).setValue(masterData[i][17]); // Alert Timestamp
      mgrSheet.getRange(ackRow, 6).setValue(alertLevel >= 2 ? "YES (Acknowledged)" : "Pending Review");
      mgrSheet.getRange(ackRow, 7).setValue(masterData[i][20] || "Under review");
      mgrSheet.getRange(ackRow, 8).setValue(masterData[i][19] || "");
      mgrSheet.getRange(ackRow, 10).setValue(alertLevel >= 2 ? "Grace Active" : "Pending Ack");
      ackRow++;
      if (ackRow > 22) break;
    }
  }
}
