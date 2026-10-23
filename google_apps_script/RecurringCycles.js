/**
 * ALLO INNOWARE - RECURRING CYCLE ENGINE
 * Handles recurrence calculations, working-day adjustments, cycle rollover, and audit ledger logging.
 */

/**
 * Calculates the next due date based on frequency and recurrence rules.
 * Automatically respects business day calendars (e.g. skips weekends for daily tasks).
 */
function calculateNextDueDate(frequency, frequencyDays, baseDate, isWorkingDaysOnly) {
  const d = new Date(baseDate);
  const freq = (frequency || "").toString().trim().toLowerCase();
  
  if (freq === "daily" || frequencyDays === 1) {
    d.setDate(d.getDate() + 1);
    // If working days only (Mon-Fri)
    if (isWorkingDaysOnly !== false) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 6) { // Saturday -> advance to Monday
        d.setDate(d.getDate() + 2);
      } else if (dayOfWeek === 0) { // Sunday -> advance to Monday
        d.setDate(d.getDate() + 1);
      }
    }
  } else if (freq.includes("7") || frequencyDays === 7) {
    d.setDate(d.getDate() + 7);
  } else if (freq.includes("15") || frequencyDays === 15) {
    d.setDate(d.getDate() + 15);
  } else if (freq.includes("30") || frequencyDays === 30) {
    d.setDate(d.getDate() + 30);
  } else {
    const daysToAdd = parseInt(frequencyDays, 10) || 7;
    d.setDate(d.getDate() + daysToAdd);
  }
  
  return d;
}

/**
 * Executes cycle rollover for a completed task:
 * 1. Closes current cycle
 * 2. Writes permanent record to 04_Completion_Log
 * 3. Increments cycle counter
 * 4. Recalculates new due date
 * 5. Clears alert/escalation flags for next cycle
 */
function rolloverTaskCycle(taskId, completionProof, completedByUser, completionNotes) {
  const masterSheet = getSheet(CONFIG.SHEET_MASTER);
  if (!masterSheet) throw new Error("Sheet 02_Task_Master not found");

  const data = masterSheet.getDataRange().getValues();
  let rowIndex = -1;
  let task = null;

  for (let i = 4; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().trim().toUpperCase() === taskId.trim().toUpperCase()) {
      rowIndex = i + 1; // 1-based index
      task = {
        taskId: data[i][0],
        taskName: data[i][1],
        assignedTo: data[i][2],
        employeeEmail: data[i][3],
        department: data[i][4],
        frequency: data[i][5],
        frequencyDays: data[i][6],
        expectedProof: data[i][7],
        currentCycle: parseInt(data[i][8], 10) || 1,
        currentDueDate: data[i][9],
        dueTime: data[i][10] || "18:00",
        currentStatus: data[i][11],
        alertLevel: data[i][16] || 0
      };
      break;
    }
  }

  if (!task) {
    throw new Error(`Task ID ${taskId} not found in Task Master.`);
  }

  const now = new Date();
  const nowFormatted = Utilities.formatDate(now, CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");
  const todayDateStr = Utilities.formatDate(now, CONFIG.TIMEZONE, "yyyy-MM-dd");

  // Determine SLA turnaround
  let turnaroundStatus = "ON-TIME";
  const dueDateTime = new Date(task.currentDueDate);
  const timeParts = (task.dueTime || "18:00").split(":");
  dueDateTime.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1] || 0, 10), 0, 0);

  if (now.getTime() > dueDateTime.getTime() + (15 * 60 * 1000)) { // 15 min buffer
    turnaroundStatus = "LATE";
  }

  // 1. Append to 04_Completion_Log
  const compSheet = getSheet(CONFIG.SHEET_COMPLETION);
  const logId = `LOG-${Utilities.formatDate(now, CONFIG.TIMEZONE, "yyyyMMdd")}-${Math.floor(100 + Math.random() * 900)}`;
  
  if (compSheet) {
    const formattedDueDate = (task.currentDueDate instanceof Date) 
      ? Utilities.formatDate(task.currentDueDate, CONFIG.TIMEZONE, "yyyy-MM-dd") 
      : task.currentDueDate;

    compSheet.appendRow([
      logId,
      task.taskId,
      task.taskName,
      task.currentCycle,
      task.assignedTo,
      completedByUser || task.employeeEmail,
      nowFormatted,
      formattedDueDate,
      turnaroundStatus,
      task.expectedProof,
      completionProof,
      completionNotes || "Completed via Single-Point Action Portal"
    ]);
  }

  // 2. Calculate Next Cycle Due Date
  const baseDueDate = (task.currentDueDate instanceof Date) ? task.currentDueDate : new Date(task.currentDueDate);
  const nextDueDate = calculateNextDueDate(task.frequency, task.frequencyDays, baseDueDate, true);
  const nextDueDateStr = Utilities.formatDate(nextDueDate, CONFIG.TIMEZONE, "yyyy-MM-dd");
  const newCycleNumber = task.currentCycle + 1;

  // 3. Update 02_Task_Master row
  // Col I (9): Cycle_Number -> newCycleNumber
  // Col J (10): Current_Due_Date -> nextDueDateStr
  // Col N (14): Last_Completed_Date -> nowFormatted
  // Col O (15): Last_Completed_By -> completedByUser
  // Col P (16): Last_Ticket_Proof -> completionProof
  // Col Q (17): Alert_Level -> 0
  // Col R (18): Last_Manager_Alert_At -> ""
  // Col S (19): Manager_Ack_Status -> "Not Required"
  // Col T (20): Manager_Ack_At -> ""
  // Col U (21): Manager_Notes -> ""
  // Col V (22): Leadership_Escalated_At -> ""

  masterSheet.getRange(rowIndex, 9).setValue(newCycleNumber);
  masterSheet.getRange(rowIndex, 10).setValue(nextDueDateStr);
  masterSheet.getRange(rowIndex, 14).setValue(nowFormatted);
  masterSheet.getRange(rowIndex, 15).setValue(completedByUser || task.employeeEmail);
  masterSheet.getRange(rowIndex, 16).setValue(completionProof);
  masterSheet.getRange(rowIndex, 17).setValue(0);
  masterSheet.getRange(rowIndex, 18).setValue("");
  masterSheet.getRange(rowIndex, 19).setValue("Not Required");
  masterSheet.getRange(rowIndex, 20).setValue("");
  masterSheet.getRange(rowIndex, 21).setValue("");
  masterSheet.getRange(rowIndex, 22).setValue("");

  return {
    success: true,
    taskId: task.taskId,
    taskName: task.taskName,
    completedCycle: task.currentCycle,
    newCycle: newCycleNumber,
    newDueDate: nextDueDateStr,
    turnaroundStatus: turnaroundStatus,
    logId: logId
  };
}
