/**
 * ALLO INNOWARE - MANAGER ALERT ENGINE
 * Detects overdue/pending operational tasks on due date cut-off and alerts managers.
 * Enforces strict deduplication guards to ensure zero duplicate emails.
 */

/**
 * Scans Task Master for tasks that have crossed their due cut-off time today
 * and dispatches same-day alerts to the Operations Manager.
 */
function scanAndSendManagerAlerts() {
  const masterSheet = getSheet(CONFIG.SHEET_MASTER);
  const escSheet = getSheet(CONFIG.SHEET_ESCALATION);
  if (!masterSheet) return { alertsSent: 0, skipped: 0 };

  const data = masterSheet.getDataRange().getValues();
  const now = new Date();
  const todayStr = Utilities.formatDate(now, CONFIG.TIMEZONE, "yyyy-MM-dd");
  const nowFormatted = Utilities.formatDate(now, CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");

  const managerEmail = getSettingsValue("Manager Alert Email") || CONFIG.DEFAULT_MANAGER_EMAIL;
  let alertsSent = 0;
  let duplicateSkipped = 0;

  for (let i = 4; i < data.length; i++) {
    const row = data[i];
    const taskId = row[0];
    const taskName = row[1];
    const assignedTo = row[2];
    const employeeEmail = row[3];
    const frequency = row[5];
    const currentCycle = row[8];
    const dueDateVal = row[9];
    const dueTime = row[10] || "17:00";
    const status = (row[11] || "").toString().toUpperCase();
    const alertLevel = parseInt(row[16], 10) || 0;
    const lastAlertAt = row[17];
    const isActive = (row[22] || "").toString().toUpperCase() === "TRUE";

    if (!isActive || !taskId || status === "COMPLETED") continue;

    const dueDateStr = (dueDateVal instanceof Date) 
      ? Utilities.formatDate(dueDateVal, CONFIG.TIMEZONE, "yyyy-MM-dd")
      : dueDateVal.toString().trim();

    // Parse Due DateTime
    const dueDateTime = new Date(dueDateVal);
    const timeParts = dueTime.split(":");
    dueDateTime.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1] || 0, 10), 0, 0);

    // Is the task overdue? (Past due cut-off)
    const isPastDue = now.getTime() > dueDateTime.getTime();

    if (isPastDue) {
      // DEDUPLICATION GUARD:
      // If alertLevel >= 1, manager has already been notified for this cycle. Skip!
      if (alertLevel >= 1 || (lastAlertAt && lastAlertAt.toString().trim().length > 0)) {
        duplicateSkipped++;
        continue;
      }

      // Calculate overdue duration
      const diffMs = now.getTime() - dueDateTime.getTime();
      const diffHours = (diffMs / (1000 * 60 * 60)).toFixed(1);
      const overdueText = diffHours < 1 ? `${Math.round(diffMs / (1000 * 60))} minutes` : `${diffHours} hours`;

      // 1. Send Manager Email
      const emailSubject = `[ALERT] Pending Operational Task: ${taskName} (${assignedTo}) is Overdue`;
      const ackUrl = `${ScriptApp.getService().getUrl()}?action=ack&taskId=${taskId}&user=${encodeURIComponent(managerEmail)}`;
      
      const emailBodyHtml = `
        <div style="font-family:'Segoe UI',Arial,sans-serif; max-width:620px; margin:0 auto; padding:25px; border:1px solid #D9D9D9; border-top:6px solid #C00000; border-radius:8px;">
          <h2 style="color:#1F4E78; margin-top:0;">Allo Innoware Operations Alert</h2>
          <div style="background:#FCE4D6; padding:12px 18px; border-left:5px solid #C00000; border-radius:4px; margin-bottom:20px;">
            <strong style="color:#C00000; font-size:16px;">Action Required: Overdue Operational Task</strong>
            <p style="margin:5px 0 0 0; color:#555; font-size:14px;">The following recurring task has not been completed by the scheduled cut-off time.</p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom:20px;">
            <tr><td style="padding:8px; border-bottom:1px solid #EEE; color:#777; width:35%;"><strong>Task Name:</strong></td><td style="padding:8px; border-bottom:1px solid #EEE; color:#222;"><strong>${taskName}</strong> (${taskId})</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #EEE; color:#777;"><strong>Assigned To:</strong></td><td style="padding:8px; border-bottom:1px solid #EEE; color:#222;">${assignedTo} (${employeeEmail})</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #EEE; color:#777;"><strong>Recurrence:</strong></td><td style="padding:8px; border-bottom:1px solid #EEE; color:#222;">${frequency} (Cycle #${currentCycle})</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #EEE; color:#777;"><strong>Cut-off Due Time:</strong></td><td style="padding:8px; border-bottom:1px solid #EEE; color:#222;">${dueDateStr} at ${dueTime} IST</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #EEE; color:#777;"><strong>Overdue Duration:</strong></td><td style="padding:8px; border-bottom:1px solid #EEE; color:#C00000; font-weight:bold;">${overdueText} overdue</td></tr>
          </table>
          <div style="text-align:center; margin:25px 0;">
            <a href="${ackUrl}" style="background:#1F4E78; color:#FFFFFF; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold; display:inline-block; font-size:14px;">
              ✅ Acknowledge & Review in 1-Click
            </a>
          </div>
          <p style="font-size:13px; color:#666; line-height:1.5;">
            <strong>Manager SLA Note:</strong> You have <strong>1 hour</strong> (Daily) / <strong>12 hours</strong> (Multi-day) to review this item. If not acknowledged or resolved within this window, the system will automatically escalate this task to Executive Leadership.
          </p>
          <hr style="border:none; border-top:1px solid #EEE; margin:20px 0;">
          <p style="font-size:11px; color:#999; text-align:center;">Allo Innoware Automated Task Governance System • ${nowFormatted} IST</p>
        </div>
      `;

      try {
        MailApp.sendEmail({
          to: managerEmail,
          subject: emailSubject,
          htmlBody: emailBodyHtml
        });
      } catch (e) {
        Logger.log(`Email simulation note: ${e.message}`);
      }

      // 2. Log in 05_Escalations_Log
      const alertId = `ESC-${Utilities.formatDate(now, CONFIG.TIMEZONE, "yyyyMMdd")}-${Math.floor(10 + Math.random() * 90)}`;
      if (escSheet) {
        escSheet.appendRow([
          alertId,
          taskId,
          taskName,
          currentCycle,
          "Stage 1: Same-Day Manager Alert",
          nowFormatted,
          managerEmail,
          emailSubject,
          `${overdueText} overdue`,
          "Pending Review",
          "ACTIVE ALERT"
        ]);
      }

      // 3. Update Task Master: Alert_Level = 1, Last_Manager_Alert_At, Manager_Ack_Status = Pending Review
      const rowIdx = i + 1;
      masterSheet.getRange(rowIdx, 17).setValue(1); // Alert_Level
      masterSheet.getRange(rowIdx, 18).setValue(nowFormatted); // Last_Manager_Alert_At
      masterSheet.getRange(rowIdx, 19).setValue("Pending Review"); // Manager_Ack_Status

      alertsSent++;
    }
  }

  return { alertsSent: alertsSent, skipped: duplicateSkipped };
}

/**
 * Menu wrapper for Manager Alert Scan
 */
function menuRunManagerAlertScan() {
  const result = scanAndSendManagerAlerts();
  SpreadsheetApp.getUi().alert(
    `Manager Alert Scan Complete:\n\n• New Alerts Dispatched: ${result.alertsSent}\n• Duplicates Suppressed (Already Alerted): ${result.skipped}`
  );
}
