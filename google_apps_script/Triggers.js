/**
 * ALLO INNOWARE - AUTOMATION TRIGGERS MANAGER
 * Installs and manages Google Apps Script time-driven execution triggers.
 */

/**
 * Installs scheduled background triggers for real-time operations
 */
function installSystemTriggers() {
  uninstallAllTriggers();

  // 1. Hourly SLA & Escalation Monitor
  ScriptApp.newTrigger("scheduledHourlySlaMonitor")
    .timeBased()
    .everyHours(1)
    .create();

  // 2. Daily Cut-off Monitor (Runs between 17:00 and 18:00 IST to catch 17:00 daily tasks)
  ScriptApp.newTrigger("scheduledDailyCutoffScan")
    .timeBased()
    .atHour(17)
    .everyDays(1)
    .inTimezone(CONFIG.TIMEZONE)
    .create();

  // 3. Morning Operational Digest (Runs at 09:00 IST every morning)
  ScriptApp.newTrigger("scheduledMorningDigest")
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .inTimezone(CONFIG.TIMEZONE)
    .create();

  SpreadsheetApp.getUi().alert(
    "✅ System Triggers Installed Successfully!\n\n" +
    "1. Hourly SLA Monitor (Evaluates overdue status & escalations every hour)\n" +
    "2. Daily Cut-off Scanner (17:15 IST daily task alerts)\n" +
    "3. Morning Operations Digest (09:00 IST daily upcoming task briefing)"
  );
}

/**
 * Removes all active triggers to prevent orphan processes
 */
function uninstallAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

/**
 * Handler for hourly SLA monitor trigger
 */
function scheduledHourlySlaMonitor() {
  scanAndSendManagerAlerts();
  scanAndEscalateToLeadership();
}

/**
 * Handler for daily 17:15 cut-off trigger
 */
function scheduledDailyCutoffScan() {
  scanAndSendManagerAlerts();
}

/**
 * Handler for morning digest
 */
function scheduledMorningDigest() {
  refreshPortalView();
  syncManagerDashboardView();
}
