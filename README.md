# Allo Innoware — Recurring Task Tracking & Escalation Automation

> A lightweight, reliable Google Sheets and Apps Script system designed to handle recurring team operations, prevent duplicate updates, alert managers on time, and escalate unresolved items to leadership.

---

## 💡 What This System Does

Operational teams often struggle with recurring work: dates drift, updates happen across multiple disjointed sheets, and managers only notice overdue tasks when something breaks.

This solution turns Google Sheets into a simple, automated operating console:
* **Single-Point Employee Portal**: Team members see only what's pending for them, enter completion proofs (Ticket IDs or WhatsApp confirmations), and submit in one click.
* **Automatic Cycle Tracking**: The system calculates the next due date based on cadence (Daily, 7-day, 15-day, 30-day) and skips weekends automatically.
* **Daily Task Verification**: Solves the problem of daily non-ticket work (like WhatsApp updates) using 1-click verification tokens and automated webhooks.
* **Manager Alerts**: If a task is overdue at the 17:15 cut-off, the manager gets a same-day email with a 1-click acknowledgment link.
* **Leadership Escalation**: If an alert remains unacknowledged or unresolved past the SLA window, it automatically escalates to leadership.
* **Zero Spam / Zero Duplicate Work**: Strict state locks guarantee that scheduled background triggers never spam inboxes or create duplicate task rows.

---

## 📊 Google Sheets Architecture (6 Core Tabs)

| Tab | Audience | Purpose |
|---|---|---|
| **`01_Employee_Action_Portal`** | Team Members | Select your name from dropdown; see pending work; enter Ticket ID or WhatsApp proof; check submit. |
| **`02_Task_Master`** | System & Lead | Central state machine tracking cadences, active cycles, due dates, and alert levels (0–3). |
| **`03_Manager_Dashboard`** | Manager | Real-time KPI summary cards, team recurrence grid, and interactive review/acknowledgment console. |
| **`04_Completion_Log`** | Audit & History | Immutable historical ledger recording user, timestamp, turnaround SLA (On-Time/Late), and proof. |
| **`05_Escalations_Log`** | Management | Complete audit trail of sent manager alerts and leadership escalations. |
| **`06_System_Settings_SLA`** | Admin | Configurable SLA cut-offs, grace periods, and recipient emails. |

---

## ⏱️ Proposed SLA & Escalation Matrix

| Cadence | Due Cut-off | Manager Alert Trigger | Manager Review Window | Leadership Escalation |
|---|---|---|---|---|
| **Daily Tasks** | 17:00 IST | **17:15 IST** (15m grace) | **1.0 Hour** (Until 18:15 IST) | **18:30 IST** (Same evening) |
| **Every 7 Days** | 18:00 IST | **18:30 IST** on Due Date | **12 Hours** (Next day 09:00 IST) | **+24 Hours** (Next day 12:00 IST) |
| **Every 15 Days** | 18:00 IST | **18:30 IST** on Due Date | **24 Hours** (Next day 18:30 IST) | **+48 Hours** past Due Date |
| **Every 30 Days** | 18:00 IST | **18:30 IST** on Due Date | **24 Hours** (Next day 18:30 IST) | **+48 Hours** past Due Date |

---

## 🧪 Verified Test Cases (8 / 8 Passed)

All 8 scenarios from the assignment were verified both in Google Apps Script and through a standalone test simulation:

1. **Test 1 — Recurring Cycle**: Closed 7-day task; cycle incremented from 1 to 2; next due date auto-advanced +7 days. **[PASSED ✅]**
2. **Test 2 — Single-Point Completion**: Completed 30-day task with Ticket ID directly from Employee Portal without touching Master. **[PASSED ✅]**
3. **Test 3 — Daily Task Method**: Captured WhatsApp operational update without a ticket ID; logged token `WA-CONF-...` and rolled to next business day. **[PASSED ✅]**
4. **Test 4 — Same-Day Manager Alert**: Overdue task at 17:15 cut-off triggered immediate email to Manager with 1-click ack URL. **[PASSED ✅]**
5. **Test 5 — Manager Action / Ack**: Manager review recorded with notes; status set to Acknowledged; grace period extended. **[PASSED ✅]**
6. **Test 6 — Leadership Escalation**: Task exceeding manager response SLA escalated to Executive Leadership. **[PASSED ✅]**
7. **Test 7 — SLA Timing Logic**: Mathematical SLA schedule validated across all frequencies. **[PASSED ✅]**
8. **Test 8 — No Duplicate Alerts/Work**: Automated scanners ran 3x consecutively with 0 duplicate cycles, 0 duplicate logs, and 0 duplicate emails. **[PASSED ✅]**

---

## 🚀 Quick Setup & Usage

### 1. View or Run Locally
```bash
# Run the live test suite in terminal:
python run_live_demo.py
```

### 2. Deploy to Google Sheets
1. Upload `Allo_Innoware_Recurring_Task_System.xlsx` to Google Drive and open with Google Sheets.
2. In Google Sheets, click **Extensions > Apps Script** and copy the `.js` files from the `google_apps_script/` folder.
3. Refresh the sheet to see the custom menu: **`🚀 Allo Innoware Ops`**.
4. Click **`🚀 Allo Innoware Ops > 🧪 Run All 8 Automated Test Cases`** to run tests live in Google Sheets.

---

## 📚 Detailed Documentation

* 📖 [Executive Architecture & Flowchart](docs/01_EXECUTIVE_SUMMARY_AND_ARCHITECTURE.md)
* 💬 [Daily Task Completion Strategy (WhatsApp Method)](docs/02_DAILY_TASK_COMPLETION_STRATEGY.md)
* ⏳ [Manager Alerts & Leadership Escalation SLA](docs/03_MANAGER_ALERTS_AND_LEADERSHIP_ESCALATION_SLA.md)
* 📋 [Full Demonstration & Test Results Report](docs/04_TEST_CASES_AND_DEMONSTRATION_REPORT.md)
* 🛠️ [Google Sheets Setup & Deployment Guide](docs/05_GOOGLE_SHEETS_SETUP_AND_DEPLOYMENT_GUIDE.md)

---
*Created for Allo Innoware Operations Leadership Assignment*
