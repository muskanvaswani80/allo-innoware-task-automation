# Allo Innoware — AI Operations Manager Assignment Test

### Recurring Task Tracking, Pending Reports & Escalation Automation

---

## 📌 Executive Summary

This repository contains the complete, production-grade prototype built for **Allo Innoware's Operational Task Tracking & Escalation Assignment**. The system orchestrates multi-frequency recurring operational tasks (Daily, 7-Day, 15-Day, and 30-Day cadences) using **Google Sheets** as the primary operating interface, powered by **Google Apps Script** automation and deterministic state-machine governance.

### Core Problems Solved
1. **Zero Duplicate Work**: Employees operate from a single interactive portal (`01_Employee_Action_Portal`) where they can view pending tasks, enter Ticket IDs or WhatsApp completion proofs, and submit work in 1 step without updating multiple tabs.
2. **Automated Recurrence Arithmetic**: Cycles advance automatically; next due dates are calculated dynamically respecting business days and skipping weekends. Frontline employees never calculate dates manually.
3. **Structured Daily Task Tracking**: Eliminates ambiguity for tasks without Ticket IDs (such as WhatsApp group updates) via 1-click verification hashes, summary notes, and inbound webhooks.
4. **Proactive Manager Governance**: Overdue tasks trigger same-day alert emails with 1-click review links and interactive acknowledgment stations on the Manager Dashboard.
5. **Multi-Tier Leadership Escalation**: Unacknowledged alerts or unresolved grace period breaches escalate automatically to Executive Leadership.
6. **Strict Deduplication & Noise Suppression**: State-machine locks guarantee zero duplicate task cycles, zero duplicate audit logs, and zero email spam loops.

---

## 📂 Repository Deliverables Overview

```
c:\Users\muska\Downloads\ALLO INNOWARE\
├── Allo_Innoware_Recurring_Task_System.xlsx   <-- Pre-built working prototype spreadsheet
├── README.md                                  <-- Master project documentation (You are here)
├── build_sheet.py                             <-- Automated Python openpyxl sheet generator
├── google_apps_script/                        <-- Production Google Apps Script codebase
│   ├── appsscript.json                        <-- Manifest file with scopes and timezone
│   ├── Code.js                                <-- Core orchestrator, custom menu, doGet/doPost webhooks
│   ├── RecurringCycles.js                     <-- Recurrence arithmetic, calendar logic, cycle rollover
│   ├── SinglePointAction.js                   <-- Single-point employee portal handler
│   ├── DailyTaskHandler.js                    <-- WhatsApp daily task verification & hash engine
│   ├── ManagerAlerts.js                       <-- Same-day 17:15 overdue alert scanner
│   ├── ManagerAcknowledgement.js              <-- In-sheet & 1-click email acknowledgment handler
│   ├── LeadershipEscalation.js                <-- SLA breach leadership escalation engine
│   ├── Triggers.js                            <-- Background hourly and daily cut-off triggers
│   └── TestRunner.js                          <-- In-sheet automated test runner for Tests 1-8
├── tests/
│   ├── simulate_tests.py                      <-- Standalone local simulation suite (Tests 1-8)
│   └── test_results.json                      <-- Output audit ledger & assertion verifications
└── docs/
    ├── 01_EXECUTIVE_SUMMARY_AND_ARCHITECTURE.md
    ├── 02_DAILY_TASK_COMPLETION_STRATEGY.md
    ├── 03_MANAGER_ALERTS_AND_LEADERSHIP_ESCALATION_SLA.md
    ├── 04_TEST_CASES_AND_DEMONSTRATION_REPORT.md
    └── 05_GOOGLE_SHEETS_SETUP_AND_DEPLOYMENT_GUIDE.md
```

---

## ⚡ Quick Start: Running & Verifying the System

### Option A: Run Local Python Verification (Tests 1 - 8)
You can instantly execute the entire business logic simulation and verify all 8 test assertions on your local machine:
```bash
python tests/simulate_tests.py
```
*Output: All 8 tests pass with detailed output logs and outputs saved to `tests/test_results.json`.*

### Option B: Deploy to Google Sheets
1. Open [Google Drive](https://drive.google.com) and upload `Allo_Innoware_Recurring_Task_System.xlsx`.
2. Right-click and choose **Open with > Google Sheets**, then **File > Save as Google Sheets**.
3. Open **Extensions > Apps Script** and copy the `.js` files from `google_apps_script/`.
4. Refresh your sheet to access the custom menu **`🚀 Allo Innoware Ops`**.
5. Click **`🚀 Allo Innoware Ops > 🧪 Run All 8 Automated Test Cases`** to run live tests directly inside Google Sheets!

---

## 📊 Google Sheet Prototype Architecture

The spreadsheet prototype contains 6 purpose-built tabs designed for simplicity and clarity:

| Tab Name | Target Audience | Primary Functionality |
|---|---|---|
| **`01_Employee_Action_Portal`** | Frontline Team (Emp A, B, C, D) | **Single-Point Operating Console**. Employee selects their name from dropdown; views pending/overdue tasks; types Ticket ID or WhatsApp proof in Column I; checks Column K to mark completed. |
| **`02_Task_Master`** | System & Operations Lead | **Central State Machine & Task Registry**. Holds task IDs, assigned employees, cadences, current cycle numbers, dynamic status formulas, alert levels (0-3), and escalation timestamps. |
| **`03_Manager_Dashboard`** | Operations Manager | **Executive Visibility & Review Station**. Live KPI cards (Active, Due Today, Overdue, Escalated); Team Recurrence Grid; and Manager Review Station to acknowledge overdue tasks. |
| **`04_Completion_Log`** | Compliance & Auditing | **Immutable Historical Ledger**. Permanent record of every completed cycle, stamping exact completion timestamp, turnaround SLA (ON-TIME vs LATE), user identity, and proof ID. |
| **`05_Escalations_Log`** | Management & HR | **Alert Audit Trail**. Permanent log of every alert email sent to Managers and escalations sent to Leadership, tracking acknowledgment status and resolution. |
| **`06_System_Settings_SLA`** | Operations Administrator | **Governance Rules & Settings**. Configurable SLA thresholds, cut-off hours, manager/leadership emails, WhatsApp integration webhook URLs, and working day logic. |

---

## 🎯 Verification of All 8 Assignment Tests

| Test # | Assignment Requirement | System Implementation & Verification | Result |
|:---:|---|---|:---:|
| **Test 1** | **Recurring cycle** | When a 7-day, 15-day, or 30-day task is completed, current cycle closes, cycle counter increments, and next due date auto-calculates without manual calculation. | **PASSED ✅** |
| **Test 2** | **Single-point completion** | Employee operates 100% from `01_Employee_Action_Portal`. Entering Ticket ID and submitting automatically updates Master, History, and Dashboard in 1 step. | **PASSED ✅** |
| **Test 3** | **Daily task tracking** | Proposed 3-tier solution (WhatsApp Webhook / 1-Click Verification Token `WA-CONF-...` / Mobile Form). Captures updates without Ticket IDs and rolls to next business day. | **PASSED ✅** |
| **Test 4** | **Same-day manager alert** | Tasks uncompleted past daily 17:00 cut-off or overdue date trigger an automated Stage 1 Alert Email to the manager on the same day. | **PASSED ✅** |
| **Test 5** | **Manager acknowledgement** | Manager reviews via 1-Click email link or Dashboard Station. System stamps `Manager_Ack = TRUE`, records notes, and extends SLA grace period, pausing escalation. | **PASSED ✅** |
| **Test 6** | **Leadership escalation** | Tasks unreviewed within SLA window or unresolved past grace period automatically trigger an Urgent Stage 2 Escalation Email to Leadership. | **PASSED ✅** |
| **Test 7** | **Escalation timing logic** | Proposed complete mathematical SLA matrix: Daily (17:15 alert, 1h manager window, 1.5h leadership escalation); Multi-day (18:30 alert, 12h manager window, 24h escalation). | **PASSED ✅** |
| **Test 8** | **No duplicate alerts/work** | Running automated scanners multiple times consecutively yields **0 duplicate cycles, 0 duplicate logs, and 0 duplicate emails** via state-level locks. | **PASSED ✅** |

---

## 📄 Key Documentation Links

For comprehensive breakdowns, refer to the documentation files in the `docs/` folder:
1. [Executive Summary & System Architecture](file:///c:/Users/muska/Downloads/ALLO%20INNOWARE/docs/01_EXECUTIVE_SUMMARY_AND_ARCHITECTURE.md)
2. [Daily Task Completion Strategy & WhatsApp Proposal](file:///c:/Users/muska/Downloads/ALLO%20INNOWARE/docs/02_DAILY_TASK_COMPLETION_STRATEGY.md)
3. [Manager Alerts & Leadership Escalation SLA Framework](file:///c:/Users/muska/Downloads/ALLO%20INNOWARE/docs/03_MANAGER_ALERTS_AND_LEADERSHIP_ESCALATION_SLA.md)
4. [Demonstration & Test Execution Report (Tests 1 - 8)](file:///c:/Users/muska/Downloads/ALLO%20INNOWARE/docs/04_TEST_CASES_AND_DEMONSTRATION_REPORT.md)
5. [Google Sheets Setup & Deployment Guide](file:///c:/Users/muska/Downloads/ALLO%20INNOWARE/docs/05_GOOGLE_SHEETS_SETUP_AND_DEPLOYMENT_GUIDE.md)

---
*Built for Allo Innoware Operations Leadership • October 2026*
