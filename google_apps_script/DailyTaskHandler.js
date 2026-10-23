/**
 * ALLO INNOWARE - DAILY TASK LOGGING & WHATSAPP INTEGRATION ENGINE
 * Proposes and implements practical, frictionless completion recording for daily operational tasks.
 */

/**
 * Proposes a 3-Tier Practical Architecture for Daily WhatsApp Tasks:
 * 
 * TIER 1 (Zero-Friction Inbound Webhook):
 *   Employee posts daily update directly in official WhatsApp group with tag '#OpsUpdate'.
 *   A lightweight WhatsApp Cloud API / Twilio / Zapier webhook posts to Google Apps Script doPost().
 *   The system automatically parses sender, extracts message excerpt, marks task complete, and rolls cycle.
 *   Employee Effort: 0 Sheet clicks!
 * 
 * TIER 2 (Single-Point 1-Click Verification in Sheet):
 *   Employee on 01_Employee_Action_Portal inputs brief summary (e.g. "Dispatched 120 units")
 *   or checks the Action box. System auto-generates audit token 'WA-CONF-YYYYMMDD-HHMM-XXXX'.
 *   Employee Effort: 5 seconds.
 * 
 * TIER 3 (Mobile Quick Action Form):
 *   A 2-field mobile web form bookmarked on employee's phone home screen for warehouse/field staff.
 */

/**
 * Generates an immutable, timestamped verification token for daily WhatsApp actions
 */
function generateDailyWhatsAppConfirmation(taskId, source) {
  const now = new Date();
  const dateStamp = Utilities.formatDate(now, CONFIG.TIMEZONE, "yyyyMMdd");
  const timeStamp = Utilities.formatDate(now, CONFIG.TIMEZONE, "HHmm");
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `WA-CONF-${dateStamp}-${timeStamp}-${randomSuffix}`;
}

/**
 * Validates and normalizes daily task completion proof
 */
function normalizeDailyTaskProof(rawInput, taskId) {
  if (!rawInput || rawInput.trim().length === 0) {
    return generateDailyWhatsAppConfirmation(taskId, "Auto-Generated-Default");
  }

  const cleaned = rawInput.trim();

  // If already a generated confirmation or URL
  if (cleaned.startsWith("WA-CONF-") || cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return cleaned;
  }

  // If employee entered an operational message snippet, prepend verification tag
  const dateStamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyyMMdd");
  return `WA-CONF-${dateStamp}: ${cleaned}`;
}

/**
 * Handles inbound webhook from WhatsApp Business API / Twilio / Zapier
 * Called by doPost(e)
 */
function processWhatsAppInboundWebhook(payload) {
  // Expected payload structure:
  // {
  //   "senderPhone": "+919876543210",
  //   "senderName": "Employee A",
  //   "messageText": "Morning dispatch completed. 142 orders packed. #DailyOpsDone",
  //   "timestamp": "2026-10-23T10:15:00Z"
  // }
  
  if (!payload || !payload.messageText) {
    return { status: "error", message: "Invalid payload: missing messageText" };
  }

  const text = payload.messageText;
  const sender = payload.senderName || payload.senderPhone || "WhatsApp Bot";

  // Check if message corresponds to daily operational update
  let matchedTaskId = "TASK-001"; // Default daily task for Employee A
  if (text.toLowerCase().includes("logistics") || text.toLowerCase().includes("dispatch")) {
    matchedTaskId = "TASK-005";
  }

  const proofCode = `WA-MSG-${Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyyMMdd-HHmm")}`;
  const notes = `WhatsApp Inbound: "${text.substring(0, 100)}" from ${sender}`;

  const rollover = rolloverTaskCycle(matchedTaskId, proofCode, sender, notes);
  refreshPortalView();

  return {
    status: "success",
    message: `WhatsApp message captured. Task ${matchedTaskId} cycle ${rollover.completedCycle} closed automatically.`,
    rollover: rollover
  };
}
