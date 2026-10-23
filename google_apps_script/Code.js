/**
 * ALLO INNOWARE - RECURRING TASK MANAGEMENT & ESCALATION SYSTEM
 * Core Orchestrator & Web App Routing
 * Version: 2.4.0 (Enterprise Production Build)
 */

const CONFIG = {
  SHEET_PORTAL: "01_Employee_Action_Portal",
  SHEET_MASTER: "02_Task_Master",
  SHEET_DASHBOARD: "03_Manager_Dashboard",
  SHEET_COMPLETION: "04_Completion_Log",
  SHEET_ESCALATION: "05_Escalations_Log",
  SHEET_SETTINGS: "06_System_Settings_SLA",
  
  // Default fallback contacts if not set in settings sheet
  DEFAULT_MANAGER_EMAIL: "operations.manager@alloinnoware.com",
  DEFAULT_LEADERSHIP_EMAIL: "leadership.ops@alloinnoware.com",
  TIMEZONE: "Asia/Kolkata"
};

/**
 * Creates custom spreadsheet menu on open
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("🚀 Allo Innoware Ops")
    .addItem("1. Submit Task Completion (Selected / Portal)", "menuSubmitTaskCompletion")
    .addItem("2. Run Same-Day Overdue & Manager Alert Scan", "menuRunManagerAlertScan")
    .addItem("3. Manager Acknowledge Overdue Task", "menuManagerAcknowledge")
    .addItem("4. Run Leadership Escalation Engine", "menuRunLeadershipEscalation")
    .addSeparator()
    .addItem("🧪 Run All 8 Automated Test Cases", "menuRunAllTests")
    .addSeparator()
    .addItem("⚙️ Install Automated Time-Driven Triggers", "installSystemTriggers")
    .addItem("🔄 Reset / Re-seed Demo Data", "menuResetDemoData")
    .addToUi();
}

/**
 * Real-time onEdit handler for checkbox-driven single-point completion
 */
function onEdit(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  const sheetName = sheet.getName();
  const row = e.range.getRow();
  const col = e.range.getColumn();
  const val = e.value;

  // Case 1: Employee Action Portal Completion Checkbox (Col K / Col 11)
  if (sheetName === CONFIG.SHEET_PORTAL && col === 11 && row >= 8) {
    if (val === "TRUE" || val === "DONE" || val === "Done") {
      handlePortalDirectCompletion(sheet, row);
    }
  }

  // Case 2: Manager Dashboard Acknowledgment Checkbox (Col F / Col 6 in Ack Station)
  if (sheetName === CONFIG.SHEET_DASHBOARD && col === 6 && row >= 18) {
    if (val === "TRUE" || val === "YES") {
      handleManagerDashboardDirectAck(sheet, row);
    }
  }
}

/**
 * Web App entry point for 1-Click Email Acknowledgements
 * URL pattern: https://script.google.com/macros/s/{DEPLOY_ID}/exec?action=ack&taskId=TASK-003&user=mgr
 */
function doGet(e) {
  const params = e ? e.parameter : {};
  const action = params.action;
  const taskId = params.taskId;
  const user = params.user || "operations.manager@alloinnoware.com";
  const notes = params.notes || "Acknowledged via 1-click email response";

  if (action === "ack" && taskId) {
    const result = recordManagerAcknowledgement(taskId, notes, user);
    const htmlContent = `
      <div style="font-family:'Segoe UI',Arial,sans-serif; max-width:600px; margin:40px auto; padding:30px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1); border-top:6px solid #1F4E78; text-align:center;">
        <h2 style="color:#1F4E78; margin-top:0;">Allo Innoware Operations Portal</h2>
        <div style="font-size:48px; margin:15px 0;">✅</div>
        <h3 style="color:#385723;">Task Acknowledged Successfully</h3>
        <p style="font-size:15px; color:#555;">Task <strong>${taskId}</strong> has been marked as reviewed by <strong>${user}</strong>.</p>
        <p style="font-size:14px; color:#777;">SLA grace period extended. Leadership escalation temporarily placed on hold.</p>
        <div style="margin-top:25px; padding:12px; background:#F2F4F7; border-radius:6px; font-size:13px; color:#666;">
          Timestamp: ${Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss")} IST
        </div>
      </div>
    `;
    return HtmlService.createHtmlOutput(htmlContent).setTitle("Allo Innoware - Manager Acknowledgment");
  }

  return HtmlService.createHtmlOutput("<p>Allo Innoware Operations API Active.</p>");
}

/**
 * Webhook entry point for WhatsApp Business Bot / External portal webhooks
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const result = processWhatsAppInboundWebhook(postData);
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Global helpers
function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name);
}

function getSettingsValue(paramName) {
  const sheet = getSheet(CONFIG.SHEET_SETTINGS);
  if (!sheet) return null;
  const data = sheet.getDataRange().getValues();
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().trim().toLowerCase() === paramName.trim().toLowerCase()) {
      return data[i][1];
    }
  }
  return null;
}
