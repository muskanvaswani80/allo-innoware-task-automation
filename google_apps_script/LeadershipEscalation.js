/**
 * ALLO INNOWARE - LEADERSHIP ESCALATION ENGINE
 * Automatically escalates critical operational SLA breaches to executive leadership.
 * Evaluates manager non-responsiveness and unresolved tasks past grace periods.
 */

/**
 * Scans for tasks exceeding manager response SLA or unresolved beyond extended grace periods.
 */
function scanAndEscalateToLeadership() {
  const masterSheet = getSheet(CONFIG.SHEET_MASTER);
  const escSheet = getSheet(CONFIG.SHEET_ESCALATION);
  if (!masterSheet) return { escalationsSent: 0, skipped: 0 };

  const data = masterSheet.getDataRange().getValues();
  const now = new Date();
  const nowFormatted = Utilities.formatDate(now, CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");
  const leadershipEmail = getSettingsValue("Leadership Escalation Email") || CONFIG.DEFAULT_LEADERSHIP_EMAIL;

  let escalationsSent = 0;
  let duplicatesSkipped = 0;

  for (let i = 4; i < data.length; i++) {
    const row = data[i];
    const taskId = row[0];
    const taskName = row[1];
    const assignedTo = row[2];
    const employeeEmail = row[3];
    const frequency = (row[5] || "").toString().toLowerCase();
    const currentCycle = row[8];
    const dueDateVal = row[9];
    const dueTime = row[10] || "17:00";
    const status = (row[11] || "").toString().toUpperCase();
    const alertLevel = parseInt(row[16], 10) || 0;
    const lastAlertAt = row[17];
    const ackStatus = (row[18] || "").toString();
    const ackAt = row[19];
    const managerNotes = row[20];
    const leadershipEscAt = row[21];
    const isActive = (row[22] || "").toString().toUpperCase() === "TRUE";

    if (!isActive || !taskId || status === "COMPLETED") continue;

    // DEDUPLICATION GUARD:
    // If Alert_Level is already 3 or leadership has already been notified, SKIP!
    if (alertLevel === 3 || (leadershipEscAt && leadershipEscAt.toString().trim().length > 0)) {
      duplicatesSkipped++;
      continue;
    }

    // Must have at least been alerted to manager (Alert_Level >= 1)
    if (alertLevel < 1 || !lastAlertAt) continue;

    const alertDate = new Date(lastAlertAt);
    const msSinceAlert = now.getTime() - alertDate.getTime();
    const hoursSinceAlert = msSinceAlert / (1000 * 60 * 60);

    const isDaily = frequency.includes("daily");
    
    // SLA Windows:
    // Daily tasks: Manager has 1.0 hour to review. If unresolved after 1.5 hours, escalate to leadership.
    // Multi-day tasks: Manager has 12 hours to review. If unresolved after 24 hours, escalate.
    const managerAckLimitHours = isDaily ? 1.0 : 12.0;
    const maxUnresolvedHours = isDaily ? 1.5 : 24.0;

    let shouldEscalate = false;
    let escalationReason = "";

    if (alertLevel === 1 && hoursSinceAlert >= managerAckLimitHours) {
      // Reason 1: Manager failed to acknowledge/review within SLA
      shouldEscalate = true;
      escalationReason = `Manager failed to review/acknowledge task within ${managerAckLimitHours} hr SLA window (Elapsed: ${hoursSinceAlert.toFixed(1)} hrs).`;
    } else if (alertLevel === 2 && hoursSinceAlert >= maxUnresolvedHours) {
      // Reason 2: Manager acknowledged, but the task remained unresolved past grace period
      shouldEscalate = true;
      escalationReason = `Task remained uncompleted after manager review and exceeded maximum SLA grace period of ${maxUnresolvedHours} hrs.`;
    }

    if (shouldEscalate) {
      // 1. Dispatch Leadership Escalation Email
      const emailSubject = `[URGENT LEADERSHIP ESCALATION] Operational Task SLA Breach: ${taskName} (${assignedTo})`;
      const emailBodyHtml = `
        <div style="font-family:'Segoe UI',Arial,sans-serif; max-width:620px; margin:0 auto; padding:25px; border:1px solid #D9D9D9; border-top:6px solid #7030A0; border-radius:8px;">
          <h2 style="color:#203764; margin-top:0;">Allo Innoware — Executive Leadership Escalation</h2>
          <div style="background:#EAD1DC; padding:12px 18px; border-left:5px solid #7030A0; border-radius:4px; margin-bottom:20px;">
            <strong style="color:#4C1130; font-size:16px;">CRITICAL SLA BREACH NOTIFICATION</strong>
            <p style="margin:5px 0 0 0; color:#4C1130; font-size:14px;">${escalationReason}</p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom:20px;">
            <tr><td style="padding:8px; border-bottom:1px solid #EEE; color:#777; width:35%;"><strong>Task:</strong></td><td style="padding:8px; border-bottom:1px solid #EEE; color:#222;"><strong>${taskName}</strong> (${taskId})</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #EEE; color:#777;"><strong>Assigned Employee:</strong></td><td style="padding:8px; border-bottom:1px solid #EEE; color:#222;">${assignedTo} (${employeeEmail})</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #EEE; color:#777;"><strong>Cadence:</strong></td><td style="padding:8px; border-bottom:1px solid #EEE; color:#222;">${frequency} (Cycle #${currentCycle})</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #EEE; color:#777;"><strong>First Alert Sent:</strong></td><td style="padding:8px; border-bottom:1px solid #EEE; color:#222;">${lastAlertAt}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #EEE; color:#777;"><strong>Manager Review State:</strong></td><td style="padding:8px; border-bottom:1px solid #EEE; color:#222;">${ackStatus} ${ackAt ? `(${ackAt})` : ""}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #EEE; color:#777;"><strong>Manager Notes:</strong></td><td style="padding:8px; border-bottom:1px solid #EEE; color:#222;">${managerNotes || "None provided"}</td></tr>
          </table>
          <p style="font-size:13px; color:#555;">
            This recurring operational task is blocking downstream operations. Immediate leadership intervention is requested.
          </p>
          <div style="text-align:center; margin:25px 0;">
            <a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}" style="background:#7030A0; color:#FFFFFF; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold; display:inline-block; font-size:14px;">
              📊 Open Operations Command Dashboard
            </a>
          </div>
          <hr style="border:none; border-top:1px solid #EEE; margin:20px 0;">
          <p style="font-size:11px; color:#999; text-align:center;">Allo Innoware Governance Escalation Engine • ${nowFormatted} IST</p>
        </div>
      `;

      try {
        MailApp.sendEmail({
          to: leadershipEmail,
          subject: emailSubject,
          htmlBody: emailBodyHtml
        });
      } catch (e) {
        Logger.log(`Email simulation note: ${e.message}`);
      }

      // 2. Append to 05_Escalations_Log
      const escId = `ESC-${Utilities.formatDate(now, CONFIG.TIMEZONE, "yyyyMMdd")}-${Math.floor(100 + Math.random() * 900)}`;
      if (escSheet) {
        escSheet.appendRow([
          escId,
          taskId,
          taskName,
          currentCycle,
          "Stage 2: Leadership Escalation",
          nowFormatted,
          leadershipEmail,
          emailSubject,
          `${hoursSinceAlert.toFixed(1)} hrs overdue`,
          ackStatus,
          "ESCALATED TO LEADERSHIP"
        ]);
      }

      // 3. Update Task Master: Alert_Level = 3, Leadership_Escalated_At
      const rowIdx = i + 1;
      masterSheet.getRange(rowIdx, 17).setValue(3); // Alert_Level = 3 (Escalated)
      masterSheet.getRange(rowIdx, 22).setValue(nowFormatted); // Leadership_Escalated_At

      escalationsSent++;
    }
  }

  return { escalationsSent: escalationsSent, skipped: duplicatesSkipped };
}

/**
 * Menu action to trigger leadership escalation scan
 */
function menuRunLeadershipEscalation() {
  const result = scanAndEscalateToLeadership();
  SpreadsheetApp.getUi().alert(
    `Leadership Escalation Scan Complete:\n\n• New Leadership Escalations: ${result.escalationsSent}\n• Skipped (Already Escalated or Within SLA): ${result.skipped}`
  );
}
