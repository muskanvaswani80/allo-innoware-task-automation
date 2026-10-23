# Allo Innoware — Google Sheets Setup & Deployment Guide

## Production Setup, Apps Script Configuration & Trigger Installation

This guide walks you through setting up and operating the Allo Innoware Recurring Task Management System in Google Workspace.

---

### Step 1: Upload the Prototype Workbook to Google Sheets

1. Open your web browser and go to [Google Drive](https://drive.google.com).
2. Click **+ New** > **File upload**.
3. Select the prototype file:
   `c:\Users\muska\Downloads\ALLO INNOWARE\Allo_Innoware_Recurring_Task_System.xlsx`
4. Once uploaded, right-click the file in Google Drive and select **Open with** > **Google Sheets**.
5. Click **File** > **Save as Google Sheets**.
   *(This ensures native Google Sheets formula calculation and Apps Script compatibility).*

---

### Step 2: Configure Google Apps Script

1. In your newly created Google Sheet, click **Extensions** > **Apps Script**.
2. An Apps Script editor will open in a new browser tab.
3. Replace the default `Code.gs` or create files matching the `google_apps_script/` folder in this repository:
   - `Code.gs` $\leftarrow$ copy contents of `google_apps_script/Code.js`
   - `RecurringCycles.gs` $\leftarrow$ copy contents of `google_apps_script/RecurringCycles.js`
   - `SinglePointAction.gs` $\leftarrow$ copy contents of `google_apps_script/SinglePointAction.js`
   - `DailyTaskHandler.gs` $\leftarrow$ copy contents of `google_apps_script/DailyTaskHandler.js`
   - `ManagerAlerts.gs` $\leftarrow$ copy contents of `google_apps_script/ManagerAlerts.js`
   - `ManagerAcknowledgement.gs` $\leftarrow$ copy contents of `google_apps_script/ManagerAcknowledgement.js`
   - `LeadershipEscalation.gs` $\leftarrow$ copy contents of `google_apps_script/LeadershipEscalation.js`
   - `Triggers.gs` $\leftarrow$ copy contents of `google_apps_script/Triggers.js`
   - `TestRunner.gs` $\leftarrow$ copy contents of `google_apps_script/TestRunner.js`
   - `appsscript.json` $\leftarrow$ copy contents of `google_apps_script/appsscript.json` *(accessible via Project Settings > Show appsscript.json manifest)*.
4. Click the **Save Project** icon (or press `Ctrl + S`).

---

### Step 3: Deploy Web App (For 1-Click Email Acknowledgment)

To enable managers to click "Acknowledge in 1-Click" directly from their alert emails:
1. In the Apps Script editor, click **Deploy** > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set the configuration:
   - **Description**: `Allo Innoware Operations API v2`
   - **Execute as**: `Me (your Google account)`
   - **Who has access**: `Anyone within your organization` (or `Anyone` for testing).
4. Click **Deploy**.
5. Grant the necessary Google Workspace authorization permissions when prompted.
6. Copy the **Web App URL** generated. *(The script automatically routes through `ScriptApp.getService().getUrl()`)*.

---

### Step 4: Initialize the Spreadsheet & Install Triggers

1. Return to your Google Sheet tab and refresh the page (`F5`).
2. After a few seconds, you will see a new custom menu at the top:
   **`🚀 Allo Innoware Ops`**
3. Click **`🚀 Allo Innoware Ops`** > **`⚙️ Install Automated Time-Driven Triggers`**.
4. This installs 3 background cron triggers:
   - **Hourly SLA Monitor**: Checks for overdue tasks and unresolved escalations every 60 minutes.
   - **Daily 17:15 Cut-off Scanner**: Dispatches same-day alerts for daily tasks that missed the 17:00 IST cut-off.
   - **Daily 09:00 Morning Digest**: Refreshes portal views and compiles upcoming work briefings.

---

### Step 5: Verify the Setup with 1-Click Test Runner

1. Click **`🚀 Allo Innoware Ops`** > **`🧪 Run All 8 Automated Test Cases`**.
2. Watch the automated test suite execute all 8 scenarios live against your active spreadsheet!
3. An executive dialog box will appear displaying:
   - `Test 1: Recurring Cycle Logic: PASSED ✅`
   - `Test 2: Single-Point Completion: PASSED ✅`
   - `Test 3: Daily Task Completion Method: PASSED ✅`
   - `Test 4: Same-Day Manager Alert: PASSED ✅`
   - `Test 5: Manager Review & Ack: PASSED ✅`
   - `Test 6: Leadership Escalation: PASSED ✅`
   - `Test 7: Escalation Timing Logic: PASSED ✅`
   - `Test 8: Zero Duplicate Alerts / Work: PASSED ✅`

---

### Step 6: Daily Operating Instructions for Team Members

#### For Employees (Employee A, B, C, D)
1. Open the sheet and navigate to tab **`01_Employee_Action_Portal`**.
2. Select your name from the dropdown in Cell **`C4`**.
3. Review your pending tasks.
4. When work is completed:
   - For Portal Tasks: Type your Ticket ID into Column I.
   - For Daily Tasks: Type a brief summary or paste the WhatsApp link in Column I.
5. Check the action box in Column K OR click **`🚀 Allo Innoware Ops`** > **`1. Submit Task Completion`**.
6. The system closes the cycle, logs the audit record, and prepares the next cycle automatically!

#### For Operations Managers
1. Monitor tab **`03_Manager_Dashboard`** for KPI overviews and overdue tasks.
2. When receiving an overdue alert email:
   - Click the **`Acknowledge in 1-Click`** button in the email, OR
   - Go to Row 18 on `03_Manager_Dashboard`, check `Manager Acknowledged?`, and type follow-up notes.
3. This pauses leadership escalation and documents management oversight.
