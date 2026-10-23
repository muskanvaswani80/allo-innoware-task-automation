"""
Allo Innoware - Recurring Task Tracking, Pending Reports & Escalation Automation
Script to generate the complete Google Sheet / Excel prototype workbook:
'Allo_Innoware_Recurring_Task_System.xlsx'
"""

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
import datetime

def create_workbook():
    wb = openpyxl.Workbook()
    # Remove default sheet
    wb.remove(wb.active)

    # Styles definition
    font_title = Font(name="Segoe UI", size=16, bold=True, color="FFFFFF")
    font_subtitle = Font(name="Segoe UI", size=10, italic=True, color="D9E1F2")
    font_section = Font(name="Segoe UI", size=12, bold=True, color="1F4E78")
    font_header = Font(name="Segoe UI", size=10, bold=True, color="FFFFFF")
    font_sub_header = Font(name="Segoe UI", size=10, bold=True, color="203764")
    font_bold = Font(name="Segoe UI", size=10, bold=True)
    font_regular = Font(name="Segoe UI", size=10)
    font_italic = Font(name="Segoe UI", size=9, italic=True, color="595959")
    font_kpi_num = Font(name="Segoe UI", size=20, bold=True, color="1F4E78")
    font_kpi_label = Font(name="Segoe UI", size=9, bold=True, color="595959")

    # Fills
    fill_navy = PatternFill(start_color="1F4E78", end_color="1F4E78", fill_type="solid")
    fill_dark_blue = PatternFill(start_color="203764", end_color="203764", fill_type="solid")
    fill_steel = PatternFill(start_color="2F5597", end_color="2F5597", fill_type="solid")
    fill_light_blue = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")
    fill_edit_highlight = PatternFill(start_color="FFF2CC", end_color="FFF2CC", fill_type="solid")  # soft yellow for editable input
    fill_soft_green = PatternFill(start_color="E2EFDA", end_color="E2EFDA", fill_type="solid")
    fill_soft_yellow = PatternFill(start_color="FFF2CC", end_color="FFF2CC", fill_type="solid")
    fill_soft_red = PatternFill(start_color="FCE4D6", end_color="FCE4D6", fill_type="solid")
    fill_soft_purple = PatternFill(start_color="EAD1DC", end_color="EAD1DC", fill_type="solid")
    fill_zebra = PatternFill(start_color="F9FAFB", end_color="F9FAFB", fill_type="solid")
    fill_card = PatternFill(start_color="F2F4F7", end_color="F2F4F7", fill_type="solid")

    # Borders
    thin_border_side = Side(border_style="thin", color="D9D9D9")
    grid_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    thick_bottom = Border(bottom=Side(border_style="medium", color="1F4E78"))
    double_bottom = Border(bottom=Side(border_style="double", color="1F4E78"))
    card_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)

    # Alignments
    align_center = Alignment(horizontal="center", vertical="center", wrap_text=True)
    align_left = Alignment(horizontal="left", vertical="center", wrap_text=True)
    align_right = Alignment(horizontal="right", vertical="center")
    align_header = Alignment(horizontal="center", vertical="center", wrap_text=True)

    today = datetime.date.today()

    # -------------------------------------------------------------
    # SHEET 1: 01_Employee_Action_Portal
    # -------------------------------------------------------------
    ws1 = wb.create_sheet(title="01_Employee_Action_Portal")
    ws1.views.sheetView[0].showGridLines = True
    ws1.tabColor = "00A88F"

    # Title Banner
    ws1.merge_cells("A1:K1")
    ws1["A1"] = "ALLO INNOWARE  —  EMPLOYEE ACTION PORTAL"
    ws1["A1"].font = font_title
    ws1["A1"].fill = fill_navy
    ws1["A1"].alignment = align_center

    ws1.merge_cells("A2:K2")
    ws1["A2"] = "Single-point workspace: View pending tasks, input Ticket ID / Daily Proof, and submit completion with zero duplicate effort."
    ws1["A2"].font = font_subtitle
    ws1["A2"].fill = fill_dark_blue
    ws1["A2"].alignment = align_center

    ws1.row_dimensions[1].height = 30
    ws1.row_dimensions[2].height = 20

    # Selector Panel (Row 4)
    ws1["B4"] = "Active Employee:"
    ws1["B4"].font = font_bold
    ws1["B4"].alignment = align_right
    ws1["C4"] = "Employee A"
    ws1["C4"].font = Font(name="Segoe UI", size=11, bold=True, color="1F4E78")
    ws1["C4"].fill = fill_edit_highlight
    ws1["C4"].alignment = align_center
    ws1["C4"].border = Border(left=Side(style="medium", color="1F4E78"), right=Side(style="medium", color="1F4E78"),
                              top=Side(style="medium", color="1F4E78"), bottom=Side(style="medium", color="1F4E78"))

    ws1["E4"] = "System Date:"
    ws1["E4"].font = font_bold
    ws1["E4"].alignment = align_right
    ws1["F4"] = today.strftime("%Y-%m-%d")
    ws1["F4"].font = font_bold
    ws1["F4"].alignment = align_center
    ws1["F4"].fill = fill_light_blue

    ws1["H4"] = "Pending Tasks:"
    ws1["H4"].font = font_bold
    ws1["H4"].alignment = align_right
    ws1["I4"] = '=COUNTIFS(\'02_Task_Master\'!$C$5:$C$14, $C$4, \'02_Task_Master\'!$L$5:$L$14, "<>COMPLETED")'
    ws1["I4"].font = Font(name="Segoe UI", size=11, bold=True, color="C00000")
    ws1["I4"].alignment = align_center
    ws1["I4"].fill = fill_soft_yellow

    ws1["J4"] = "Overdue Items:"
    ws1["J4"].font = font_bold
    ws1["J4"].alignment = align_right
    ws1["K4"] = '=COUNTIFS(\'02_Task_Master\'!$C$5:$C$14, $C$4, \'02_Task_Master\'!$L$5:$L$14, "OVERDUE")'
    ws1["K4"].font = Font(name="Segoe UI", size=11, bold=True, color="C00000")
    ws1["K4"].alignment = align_center
    ws1["K4"].fill = fill_soft_red

    # Section 1 Header
    ws1.merge_cells("A6:K6")
    ws1["A6"] = "MY ACTIVE & PENDING RECURRING TASKS (Direct Single-Point Entry Console)"
    ws1["A6"].font = font_section
    ws1["A6"].fill = fill_light_blue
    ws1["A6"].alignment = align_left
    ws1.row_dimensions[6].height = 24

    # Table Headers (Row 7)
    portal_headers = [
        ("Task ID", 12),
        ("Task Name", 28),
        ("Frequency", 15),
        ("Cycle #", 10),
        ("Due Date", 14),
        ("Due Time", 12),
        ("Status", 14),
        ("Required Proof Type", 22),
        ("ENTER COMPLETION PROOF / TICKET ID", 36),
        ("COMPLETION NOTES / SUMMARY", 32),
        ("ACTION: SUBMIT", 16)
    ]

    for col_idx, (h_name, width) in enumerate(portal_headers, 1):
        cell = ws1.cell(row=7, column=col_idx)
        cell.value = h_name
        cell.font = font_header
        cell.fill = fill_navy if col_idx < 9 else fill_dark_blue
        cell.alignment = align_header
        ws1.column_dimensions[get_column_letter(col_idx)].width = width
    ws1.row_dimensions[7].height = 28

    # Portal Tasks Rows (Sample active tasks mapped directly from Task Master for Employee A & B demo)
    sample_portal_rows = [
        ("TASK-001", "Daily Operations Update", "Daily", 1, today.strftime("%Y-%m-%d"), "17:00", "DUE TODAY", "WhatsApp Confirmation", "WA-CONF-1645 / Shared in Ops Group", "Completed morning dispatch & warehouse sync", "Click Menu / Done"),
        ("TASK-005", "Daily Logistics Dispatch Check", "Daily", 1, today.strftime("%Y-%m-%d"), "17:00", "DUE TODAY", "WhatsApp Confirmation", "", "", "Pending"),
        ("TASK-002", "Portal Task A (Vendor Reconciliation)", "Every 7 days", 1, (today + datetime.timedelta(days=2)).strftime("%Y-%m-%d"), "18:00", "UPCOMING", "Ticket ID", "", "", "Pending"),
        ("TASK-003", "Portal Task B (Inventory Audit)", "Every 15 days", 1, (today - datetime.timedelta(days=1)).strftime("%Y-%m-%d"), "18:00", "OVERDUE", "Ticket ID", "", "", "Pending"),
        ("TASK-004", "Portal Task C (Monthly Compliance)", "Every 30 days", 1, (today + datetime.timedelta(days=18)).strftime("%Y-%m-%d"), "18:00", "UPCOMING", "Ticket ID", "", "", "Pending"),
    ]

    for r_idx, row_data in enumerate(sample_portal_rows, 8):
        ws1.row_dimensions[r_idx].height = 24
        for c_idx, val in enumerate(row_data, 1):
            cell = ws1.cell(row=r_idx, column=c_idx)
            cell.value = val
            cell.font = font_regular
            cell.border = grid_border

            if c_idx in [1, 3, 4, 5, 6, 11]:
                cell.alignment = align_center
            else:
                cell.alignment = align_left

            # Highlights for status
            if c_idx == 7:
                if val == "DUE TODAY":
                    cell.fill = fill_soft_yellow
                    cell.font = font_bold
                elif val == "OVERDUE":
                    cell.fill = fill_soft_red
                    cell.font = font_bold
                elif val == "COMPLETED":
                    cell.fill = fill_soft_green
                    cell.font = font_bold
                else:
                    cell.fill = fill_card

            # Editable inputs highlighted in soft yellow
            if c_idx in [9, 10]:
                cell.fill = fill_edit_highlight
                cell.border = Border(left=Side(style="thin", color="ED7D31"), right=Side(style="thin", color="ED7D31"),
                                     top=Side(style="thin", color="ED7D31"), bottom=Side(style="thin", color="ED7D31"))

    # Instructions box at bottom of Sheet 1
    ws1.merge_cells("A15:K15")
    ws1["A15"] = "HOW TO COMPLETE TASKS WITHOUT DUPLICATE WORK"
    ws1["A15"].font = font_sub_header
    ws1["A15"].fill = fill_light_blue
    ws1["A15"].alignment = align_left

    instructions = [
        "1. Select your name in Cell C4 to filter your active assignments.",
        "2. Review your pending tasks. Overdue tasks are highlighted in soft RED, and today's tasks in soft YELLOW.",
        "3. For Portal Tasks: Enter the portal Ticket ID (e.g., TKT-10492) into Column I ('ENTER COMPLETION PROOF / TICKET ID').",
        "4. For Daily Tasks: Confirm your WhatsApp group update by entering confirmation text or link (e.g., 'WA-CONF / Posted update at 10:30 AM') in Column I.",
        "5. Submit Completion: Use the custom menu '🚀 Allo Innoware Ops > Submit Task Completion' or tick the checkbox in Google Sheets.",
        "6. Automation Result: The Apps Script logs the completion to '04_Completion_Log', increments the cycle number, auto-calculates the next due date, and resets the task for the next cycle automatically."
    ]
    for i, inst in enumerate(instructions, 16):
        ws1.merge_cells(f"A{i}:K{i}")
        ws1[f"A{i}"] = inst
        ws1[f"A{i}"].font = font_italic
        ws1[f"A{i}"].alignment = align_left


    # -------------------------------------------------------------
    # SHEET 2: 02_Task_Master
    # -------------------------------------------------------------
    ws2 = wb.create_sheet(title="02_Task_Master")
    ws2.views.sheetView[0].showGridLines = True
    ws2.tabColor = "1F4E78"

    # Title Banner
    ws2.merge_cells("A1:W1")
    ws2["A1"] = "ALLO INNOWARE  —  RECURRING TASK MASTER CONFIGURATION & STATE MACHINE"
    ws2["A1"].font = font_title
    ws2["A1"].fill = fill_navy
    ws2["A1"].alignment = align_center

    ws2.merge_cells("A2:W2")
    ws2["A2"] = "Master state table tracking recurrence cycles, current due dates, SLA status, manager acknowledgment, and leadership escalation flags."
    ws2["A2"].font = font_subtitle
    ws2["A2"].fill = fill_dark_blue
    ws2["A2"].alignment = align_center
    ws2.row_dimensions[1].height = 30
    ws2.row_dimensions[2].height = 20

    master_headers = [
        ("Task_ID", 12),
        ("Task_Name", 28),
        ("Assigned_To", 16),
        ("Employee_Email", 24),
        ("Department", 16),
        ("Frequency", 15),
        ("Frequency_Days", 15),
        ("Expected_Proof", 22),
        ("Cycle_Number", 13),
        ("Current_Due_Date", 16),
        ("Due_Time", 12),
        ("Current_Status", 15),
        ("Days_Remaining", 15),
        ("Last_Completed_Date", 18),
        ("Last_Completed_By", 22),
        ("Last_Ticket_Proof", 26),
        ("Alert_Level", 12),
        ("Last_Manager_Alert_At", 22),
        ("Manager_Ack_Status", 20),
        ("Manager_Ack_At", 22),
        ("Manager_Notes", 30),
        ("Leadership_Escalated_At", 24),
        ("Is_Active", 10)
    ]

    for col_idx, (h_name, width) in enumerate(master_headers, 1):
        cell = ws2.cell(row=4, column=col_idx)
        cell.value = h_name
        cell.font = font_header
        cell.fill = fill_navy
        cell.alignment = align_header
        ws2.column_dimensions[get_column_letter(col_idx)].width = width
    ws2.row_dimensions[4].height = 28

    # Master Data Rows (Including all required dummy scenarios + edge test cases)
    master_data = [
        # Col A-W
        ("TASK-001", "Daily Operations Update", "Employee A", "employee.a@alloinnoware.com", "Operations", "Daily", 1, "WhatsApp Confirmation", 1, today.strftime("%Y-%m-%d"), "17:00", '=IF(N5>=J5,"COMPLETED",IF(TODAY()>J5,"OVERDUE",IF(TODAY()=J5,"DUE TODAY","UPCOMING")))', '=J5-TODAY()', "", "", "", 0, "", "Not Required", "", "", "", "TRUE"),
        ("TASK-002", "Portal Task A", "Employee B", "employee.b@alloinnoware.com", "IT Systems", "Every 7 days", 7, "Ticket ID", 1, (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"), "18:00", '=IF(N6>=J6,"COMPLETED",IF(TODAY()>J6,"OVERDUE",IF(TODAY()=J6,"DUE TODAY","UPCOMING")))', '=J6-TODAY()', "", "", "", 0, "", "Not Required", "", "", "", "TRUE"),
        ("TASK-003", "Portal Task B", "Employee C", "employee.c@alloinnoware.com", "Supply Chain", "Every 15 days", 15, "Ticket ID", 1, (today - datetime.timedelta(days=1)).strftime("%Y-%m-%d"), "18:00", '=IF(N7>=J7,"COMPLETED",IF(TODAY()>J7,"OVERDUE",IF(TODAY()=J7,"DUE TODAY","UPCOMING")))', '=J7-TODAY()', "", "", "", 1, (today - datetime.timedelta(hours=5)).strftime("%Y-%m-%d 17:15:00"), "Pending Review", "", "", "", "TRUE"),
        ("TASK-004", "Portal Task C", "Employee D", "employee.d@alloinnoware.com", "Compliance", "Every 30 days", 30, "Ticket ID", 1, (today + datetime.timedelta(days=14)).strftime("%Y-%m-%d"), "18:00", '=IF(N8>=J8,"COMPLETED",IF(TODAY()>J8,"OVERDUE",IF(TODAY()=J8,"DUE TODAY","UPCOMING")))', '=J8-TODAY()', "", "", "", 0, "", "Not Required", "", "", "", "TRUE"),
        # Additional test cases to prove full automation flow
        ("TASK-005", "Daily Dispatch Logistics Check", "Employee A", "employee.a@alloinnoware.com", "Logistics", "Daily", 1, "WhatsApp Confirmation", 1, today.strftime("%Y-%m-%d"), "17:00", '=IF(N9>=J9,"COMPLETED",IF(TODAY()>J9,"OVERDUE",IF(TODAY()=J9,"DUE TODAY","UPCOMING")))', '=J9-TODAY()', "", "", "", 0, "", "Not Required", "", "", "", "TRUE"),
        ("TASK-006", "Weekly Security Audit & Ticket", "Employee B", "employee.b@alloinnoware.com", "Information Security", "Every 7 days", 7, "Ticket ID", 2, (today - datetime.timedelta(days=2)).strftime("%Y-%m-%d"), "18:00", '=IF(N10>=J10,"COMPLETED",IF(TODAY()>J10,"OVERDUE",IF(TODAY()=J10,"DUE TODAY","UPCOMING")))', '=J10-TODAY()', "", "", "", 3, (today - datetime.timedelta(days=1)).strftime("%Y-%m-%d 18:30:00"), "Acknowledged", (today - datetime.timedelta(days=1, hours=2)).strftime("%Y-%m-%d 20:15:00"), "Escalated: Vendor portal maintenance delayed completion", (today - datetime.timedelta(hours=4)).strftime("%Y-%m-%d 12:00:00"), "TRUE"),
    ]

    for r_idx, row_values in enumerate(master_data, 5):
        ws2.row_dimensions[r_idx].height = 22
        for c_idx, val in enumerate(row_values, 1):
            cell = ws2.cell(row=r_idx, column=c_idx)
            cell.value = val
            cell.font = font_regular
            cell.border = grid_border
            if c_idx in [1, 3, 6, 7, 9, 10, 11, 12, 13, 17, 19, 23]:
                cell.alignment = align_center
            else:
                cell.alignment = align_left


    # -------------------------------------------------------------
    # SHEET 3: 03_Manager_Dashboard
    # -------------------------------------------------------------
    ws3 = wb.create_sheet(title="03_Manager_Dashboard")
    ws3.views.sheetView[0].showGridLines = True
    ws3.tabColor = "C00000"

    # Title Banner
    ws3.merge_cells("A1:K1")
    ws3["A1"] = "ALLO INNOWARE  —  OPERATIONS MANAGER COMMAND DASHBOARD"
    ws3["A1"].font = font_title
    ws3["A1"].fill = fill_navy
    ws3["A1"].alignment = align_center

    ws3.merge_cells("A2:K2")
    ws3["A2"] = "Real-time oversight of recurring operational tasks, pending alerts, SLA compliance, and manager review station."
    ws3["A2"].font = font_subtitle
    ws3["A2"].fill = fill_dark_blue
    ws3["A2"].alignment = align_center
    ws3.row_dimensions[1].height = 30
    ws3.row_dimensions[2].height = 20

    # KPI Summary Cards (Rows 4-5)
    kpis = [
        ("TOTAL RECURRING TASKS", '=COUNTA(\'02_Task_Master\'!$A$5:$A$10)', "B", "C", fill_light_blue, "1F4E78"),
        ("TASKS COMPLETED TODAY", '=COUNTIF(\'02_Task_Master\'!$L$5:$L$10, "COMPLETED")', "D", "E", fill_soft_green, "385723"),
        ("PENDING / DUE TODAY", '=COUNTIF(\'02_Task_Master\'!$L$5:$L$10, "DUE TODAY")', "F", "G", fill_soft_yellow, "B25900"),
        ("OVERDUE / ALERT SENT", '=COUNTIF(\'02_Task_Master\'!$L$5:$L$10, "OVERDUE")', "H", "I", fill_soft_red, "C00000"),
        ("LEADERSHIP ESCALATIONS", '=COUNTIF(\'02_Task_Master\'!$Q$5:$Q$10, 3)', "J", "K", fill_soft_purple, "4C1130"),
    ]

    for label, formula, start_col, end_col, fill_color, text_color in kpis:
        # Header row
        ws3.merge_cells(f"{start_col}4:{end_col}4")
        cell_lbl = ws3[f"{start_col}4"]
        cell_lbl.value = label
        cell_lbl.font = font_kpi_label
        cell_lbl.alignment = align_center
        cell_lbl.fill = fill_card

        # Value row
        ws3.merge_cells(f"{start_col}5:{end_col}5")
        cell_val = ws3[f"{start_col}5"]
        cell_val.value = formula
        cell_val.font = Font(name="Segoe UI", size=18, bold=True, color=text_color)
        cell_val.alignment = align_center
        cell_val.fill = fill_color

        for r in [4, 5]:
            for c in [start_col, end_col]:
                ws3[f"{c}{r}"].border = grid_border

    ws3.row_dimensions[4].height = 18
    ws3.row_dimensions[5].height = 32

    # Section 1: Team Operations Overview
    ws3.merge_cells("A7:K7")
    ws3["A7"] = "TEAM TASK RECURRENCE STATUS OVERVIEW"
    ws3["A7"].font = font_section
    ws3["A7"].fill = fill_light_blue
    ws3["A7"].alignment = align_left
    ws3.row_dimensions[7].height = 24

    mgr_headers = [
        ("Task ID", 12),
        ("Task Name", 28),
        ("Assigned To", 16),
        ("Frequency", 14),
        ("Cycle #", 10),
        ("Due Date", 14),
        ("Current Status", 15),
        ("Alert Level", 14),
        ("Manager Ack Status", 20),
        ("Last Completed", 16),
        ("Action / Escalation Status", 24)
    ]

    for col_idx, (h_name, width) in enumerate(mgr_headers, 1):
        cell = ws3.cell(row=8, column=col_idx)
        cell.value = h_name
        cell.font = font_header
        cell.fill = fill_navy
        cell.alignment = align_header
        ws3.column_dimensions[get_column_letter(col_idx)].width = width
    ws3.row_dimensions[8].height = 26

    # Data rows linked to Task Master
    team_overview_rows = [
        ("TASK-001", "Daily Operations Update", "Employee A", "Daily", 1, today.strftime("%Y-%m-%d"), "DUE TODAY", "Normal (0)", "Not Required", "Yesterday 16:45", "On Track (Due 17:00)"),
        ("TASK-005", "Daily Logistics Dispatch Check", "Employee A", "Daily", 1, today.strftime("%Y-%m-%d"), "DUE TODAY", "Normal (0)", "Not Required", "Yesterday 16:50", "On Track (Due 17:00)"),
        ("TASK-002", "Portal Task A", "Employee B", "Every 7 days", 1, (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"), "UPCOMING", "Normal (0)", "Not Required", "7 days ago", "On Track"),
        ("TASK-003", "Portal Task B", "Employee C", "Every 15 days", 1, (today - datetime.timedelta(days=1)).strftime("%Y-%m-%d"), "OVERDUE", "Stage 1 Alert", "Pending Review", "16 days ago", "ACTION REQUIRED: Manager Review"),
        ("TASK-004", "Portal Task C", "Employee D", "Every 30 days", 1, (today + datetime.timedelta(days=14)).strftime("%Y-%m-%d"), "UPCOMING", "Normal (0)", "Not Required", "16 days ago", "On Track"),
        ("TASK-006", "Weekly Security Audit & Ticket", "Employee B", "Every 7 days", 2, (today - datetime.timedelta(days=2)).strftime("%Y-%m-%d"), "OVERDUE", "Stage 3 Escalated", "Acknowledged", "9 days ago", "ESCALATED TO LEADERSHIP"),
    ]

    for r_idx, r_data in enumerate(team_overview_rows, 9):
        ws3.row_dimensions[r_idx].height = 22
        for c_idx, val in enumerate(r_data, 1):
            cell = ws3.cell(row=r_idx, column=c_idx)
            cell.value = val
            cell.font = font_regular
            cell.border = grid_border
            if c_idx in [1, 3, 4, 5, 6, 8, 9, 10]:
                cell.alignment = align_center
            else:
                cell.alignment = align_left

            # Color highlight for status column
            if c_idx == 7:
                if val == "DUE TODAY":
                    cell.fill = fill_soft_yellow
                elif val == "OVERDUE":
                    cell.fill = fill_soft_red
                    cell.font = font_bold
                elif val == "UPCOMING":
                    cell.fill = fill_card

            if c_idx == 11 and "ESCALATED" in val:
                cell.fill = fill_soft_purple
                cell.font = font_bold
            elif c_idx == 11 and "ACTION REQUIRED" in val:
                cell.fill = fill_soft_red
                cell.font = font_bold

    # Section 2: Manager Review & Acknowledgement Console
    ws3.merge_cells("A16:K16")
    ws3["A16"] = "MANAGER REVIEW & ACKNOWLEDGEMENT STATION (Interactive Overdue Governance)"
    ws3["A16"].font = font_section
    ws3["A16"].fill = PatternFill(start_color="FCE4D6", end_color="FCE4D6", fill_type="solid")
    ws3["A16"].alignment = align_left
    ws3.row_dimensions[16].height = 24

    ack_headers = [
        ("Task ID", 12),
        ("Task Name", 28),
        ("Assigned To", 16),
        ("Overdue Since", 16),
        ("Alert Timestamp", 20),
        ("Manager Acknowledged?", 22),
        ("Manager Action / Follow-up Notes", 36),
        ("Timestamp Acknowledged", 22),
        ("Grace Extension Until", 22),
        ("Escalation Prevented?", 20),
        ("Action", 16)
    ]

    for col_idx, (h_name, width) in enumerate(ack_headers, 1):
        cell = ws3.cell(row=17, column=col_idx)
        cell.value = h_name
        cell.font = font_header
        cell.fill = fill_dark_blue
        cell.alignment = align_header
    ws3.row_dimensions[17].height = 26

    ack_sample_data = [
        ("TASK-003", "Portal Task B", "Employee C", (today - datetime.timedelta(days=1)).strftime("%Y-%m-%d"), (today - datetime.timedelta(hours=5)).strftime("%Y-%m-%d 17:15"), "Pending [Tick/Review]", "Contacted employee; awaiting vendor API sync", "", "Until 20:00 Today", "Pending Ack", "Submit Review"),
        ("TASK-006", "Weekly Security Audit & Ticket", "Employee B", (today - datetime.timedelta(days=2)).strftime("%Y-%m-%d"), (today - datetime.timedelta(days=1)).strftime("%Y-%m-%d 18:30"), "YES (Acknowledged)", "Ticket blocked by vendor portal downtime", (today - datetime.timedelta(days=1, hours=2)).strftime("%Y-%m-%d 20:15"), "Expired", "Escalated to VP", "Archived"),
    ]

    for r_idx, r_data in enumerate(ack_sample_data, 18):
        ws3.row_dimensions[r_idx].height = 24
        for c_idx, val in enumerate(r_data, 1):
            cell = ws3.cell(row=r_idx, column=c_idx)
            cell.value = val
            cell.font = font_regular
            cell.border = grid_border
            if c_idx in [1, 3, 4, 5, 6, 8, 9, 10, 11]:
                cell.alignment = align_center
            else:
                cell.alignment = align_left

            if c_idx in [6, 7]:
                cell.fill = fill_edit_highlight


    # -------------------------------------------------------------
    # SHEET 4: 04_Completion_Log
    # -------------------------------------------------------------
    ws4 = wb.create_sheet(title="04_Completion_Log")
    ws4.views.sheetView[0].showGridLines = True
    ws4.tabColor = "385723"

    ws4.merge_cells("A1:L1")
    ws4["A1"] = "ALLO INNOWARE  —  TASK COMPLETIONS AUDIT LOG (Immutable History)"
    ws4["A1"].font = font_title
    ws4["A1"].fill = fill_navy
    ws4["A1"].alignment = align_center

    ws4.merge_cells("A2:L2")
    ws4["A2"] = "Historical ledger recording every completed recurring task cycle, user authentication, timestamp, proof artifact, and turnaround SLA."
    ws4["A2"].font = font_subtitle
    ws4["A2"].fill = fill_dark_blue
    ws4["A2"].alignment = align_center
    ws4.row_dimensions[1].height = 30
    ws4.row_dimensions[2].height = 20

    comp_headers = [
        ("Log_ID", 14),
        ("Task_ID", 12),
        ("Task_Name", 28),
        ("Cycle_Number", 13),
        ("Assigned_To", 16),
        ("Completed_By_User", 24),
        ("Completed_Timestamp", 22),
        ("Due_Date", 14),
        ("Turnaround_SLA", 16),
        ("Proof_Type", 22),
        ("Ticket_ID_or_Proof_Value", 30),
        ("Completion_Notes", 34)
    ]

    for col_idx, (h_name, width) in enumerate(comp_headers, 1):
        cell = ws4.cell(row=4, column=col_idx)
        cell.value = h_name
        cell.font = font_header
        cell.fill = fill_navy
        cell.alignment = align_header
        ws4.column_dimensions[get_column_letter(col_idx)].width = width
    ws4.row_dimensions[4].height = 26

    # Sample audit history data proving recurring cycle history
    audit_history = [
        ("LOG-20261022-001", "TASK-001", "Daily Operations Update", 0, "Employee A", "employee.a@alloinnoware.com", (today - datetime.timedelta(days=1)).strftime("%Y-%m-%d 16:45:10"), (today - datetime.timedelta(days=1)).strftime("%Y-%m-%d"), "ON-TIME", "WhatsApp Confirmation", "WA-CONF-9921 / Posted in Allo Ops", "Dispatched 128 orders, zero delays"),
        ("LOG-20261022-002", "TASK-005", "Daily Logistics Dispatch Check", 0, "Employee A", "employee.a@alloinnoware.com", (today - datetime.timedelta(days=1)).strftime("%Y-%m-%d 16:50:22"), (today - datetime.timedelta(days=1)).strftime("%Y-%m-%d"), "ON-TIME", "WhatsApp Confirmation", "WA-CONF-9925 / Logistics Sync", "All dock doors cleared and signed off"),
        ("LOG-20261016-003", "TASK-002", "Portal Task A", 0, "Employee B", "employee.b@alloinnoware.com", (today - datetime.timedelta(days=7)).strftime("%Y-%m-%d 15:30:00"), (today - datetime.timedelta(days=7)).strftime("%Y-%m-%d"), "ON-TIME", "Ticket ID", "TKT-88410", "Vendor reconciliations approved in SAP portal"),
        ("LOG-20261008-004", "TASK-003", "Portal Task B", 0, "Employee C", "employee.c@alloinnoware.com", (today - datetime.timedelta(days=16)).strftime("%Y-%m-%d 17:10:00"), (today - datetime.timedelta(days=16)).strftime("%Y-%m-%d"), "ON-TIME", "Ticket ID", "TKT-77192", "Bi-weekly physical stock count matched portal figures"),
        ("LOG-20260923-005", "TASK-004", "Portal Task C", 0, "Employee D", "employee.d@alloinnoware.com", (today - datetime.timedelta(days=30)).strftime("%Y-%m-%d 16:00:00"), (today - datetime.timedelta(days=30)).strftime("%Y-%m-%d"), "ON-TIME", "Ticket ID", "TKT-55410", "Monthly statutory regulatory filings submitted"),
    ]

    for r_idx, r_data in enumerate(audit_history, 5):
        ws4.row_dimensions[r_idx].height = 22
        for c_idx, val in enumerate(r_data, 1):
            cell = ws4.cell(row=r_idx, column=c_idx)
            cell.value = val
            cell.font = font_regular
            cell.border = grid_border
            if c_idx in [1, 2, 4, 5, 7, 8, 9, 10]:
                cell.alignment = align_center
            else:
                cell.alignment = align_left

            if c_idx == 9:
                cell.fill = fill_soft_green
                cell.font = font_bold


    # -------------------------------------------------------------
    # SHEET 5: 05_Escalations_Log
    # -------------------------------------------------------------
    ws5 = wb.create_sheet(title="05_Escalations_Log")
    ws5.views.sheetView[0].showGridLines = True
    ws5.tabColor = "7030A0"

    ws5.merge_cells("A1:K1")
    ws5["A1"] = "ALLO INNOWARE  —  MANAGER ALERTS & LEADERSHIP ESCALATIONS LOG"
    ws5["A1"].font = font_title
    ws5["A1"].fill = fill_navy
    ws5["A1"].alignment = align_center

    ws5.merge_cells("A2:K2")
    ws5["A2"] = "Complete audit record of automated alerts sent to Managers and escalations dispatched to Leadership to eliminate duplicate spam."
    ws5["A2"].font = font_subtitle
    ws5["A2"].fill = fill_dark_blue
    ws5["A2"].alignment = align_center
    ws5.row_dimensions[1].height = 30
    ws5.row_dimensions[2].height = 20

    esc_headers = [
        ("Alert_ID", 14),
        ("Task_ID", 12),
        ("Task_Name", 26),
        ("Cycle_#", 10),
        ("Stage", 22),
        ("Trigger_Timestamp", 22),
        ("Recipient_Email", 26),
        ("Subject_Line", 34),
        ("Overdue_Duration", 18),
        ("Manager_Ack_State", 18),
        ("Resolution_Status", 18)
    ]

    for col_idx, (h_name, width) in enumerate(esc_headers, 1):
        cell = ws5.cell(row=4, column=col_idx)
        cell.value = h_name
        cell.font = font_header
        cell.fill = fill_navy
        cell.alignment = align_header
        ws5.column_dimensions[get_column_letter(col_idx)].width = width
    ws5.row_dimensions[4].height = 26

    sample_escalations = [
        ("ESC-20261023-01", "TASK-003", "Portal Task B", 1, "Stage 1: Manager Alert", (today - datetime.timedelta(hours=5)).strftime("%Y-%m-%d 17:15:00"), "manager.ops@alloinnoware.com", "[ALERT] Overdue Recurring Task: Portal Task B (Employee C)", "5.25 hrs overdue", "Pending Review", "ACTIVE ALERT"),
        ("ESC-20261022-02", "TASK-006", "Weekly Security Audit & Ticket", 2, "Stage 1: Manager Alert", (today - datetime.timedelta(days=1, hours=8)).strftime("%Y-%m-%d 18:30:00"), "manager.ops@alloinnoware.com", "[ALERT] Overdue Recurring Task: Weekly Security Audit (Employee B)", "24.5 hrs overdue", "Acknowledged", "ACKNOWLEDGED"),
        ("ESC-20261023-03", "TASK-006", "Weekly Security Audit & Ticket", 2, "Stage 2: Leadership Escalation", (today - datetime.timedelta(hours=4)).strftime("%Y-%m-%d 12:00:00"), "leadership@alloinnoware.com", "[ESCALATION] Unresolved Task Past Manager SLA: Weekly Security Audit", "42 hrs overdue", "Ack Expired", "ESCALATED TO LEADERSHIP"),
    ]

    for r_idx, r_data in enumerate(sample_escalations, 5):
        ws5.row_dimensions[r_idx].height = 22
        for c_idx, val in enumerate(r_data, 1):
            cell = ws5.cell(row=r_idx, column=c_idx)
            cell.value = val
            cell.font = font_regular
            cell.border = grid_border
            if c_idx in [1, 2, 4, 5, 6, 9, 10, 11]:
                cell.alignment = align_center
            else:
                cell.alignment = align_left

            if c_idx == 5:
                if "Stage 1" in val:
                    cell.fill = fill_soft_red
                elif "Stage 2" in val:
                    cell.fill = fill_soft_purple
                    cell.font = font_bold


    # -------------------------------------------------------------
    # SHEET 6: 06_System_Settings_SLA
    # -------------------------------------------------------------
    ws6 = wb.create_sheet(title="06_System_Settings_SLA")
    ws6.views.sheetView[0].showGridLines = True
    ws6.tabColor = "595959"

    ws6.merge_cells("A1:H1")
    ws6["A1"] = "ALLO INNOWARE  —  SYSTEM CONFIGURATION & SLA TIMING RULES"
    ws6["A1"].font = font_title
    ws6["A1"].fill = fill_navy
    ws6["A1"].alignment = align_center

    ws6.merge_cells("A2:H2")
    ws6["A2"] = "Governance parameters: Recurrence frequencies, alert cut-offs, manager response SLA, and leadership escalation rules."
    ws6["A2"].font = font_subtitle
    ws6["A2"].fill = fill_dark_blue
    ws6["A2"].alignment = align_center
    ws6.row_dimensions[1].height = 30
    ws6.row_dimensions[2].height = 20

    # Table 1: SLA Matrix
    ws6.merge_cells("A4:H4")
    ws6["A4"] = "OPERATIONAL SLA TIMING MATRIX & ESCALATION THRESHOLDS"
    ws6["A4"].font = font_section
    ws6["A4"].fill = fill_light_blue
    ws6["A4"].alignment = align_left

    sla_headers = [
        ("Frequency Type", 18),
        ("Standard Due Time", 20),
        ("Employee Reminder", 20),
        ("Manager Alert Trigger", 24),
        ("Manager Ack Window", 22),
        ("Leadership Escalation Trigger", 28),
        ("Deduplication Guard", 24),
        ("Business Day Logic", 20)
    ]

    for col_idx, (h_name, width) in enumerate(sla_headers, 1):
        cell = ws6.cell(row=5, column=col_idx)
        cell.value = h_name
        cell.font = font_header
        cell.fill = fill_navy
        cell.alignment = align_header
        ws6.column_dimensions[get_column_letter(col_idx)].width = width
    ws6.row_dimensions[5].height = 26

    sla_matrix_data = [
        ("Daily", "17:00 IST (Working Day)", "16:00 IST (1 hr before)", "17:15 IST (15 mins past due)", "1 Hour (Until 18:15 IST)", "18:30 IST (Same Day)", "1 Alert per Day / Cycle", "Mon-Fri (Skips Weekends)"),
        ("Every 7 days", "18:00 IST (Due Date)", "09:00 IST (Morning of due date)", "18:30 IST on Due Date", "12 Hours (Until Next Day 09:00)", "Next Day 12:00 IST (+24 hrs)", "1 Alert per Cycle Stage", "Next Working Day if Holiday"),
        ("Every 15 days", "18:00 IST (Due Date)", "24 hrs before due date", "18:30 IST on Due Date", "24 Hours (Next Day 18:30)", "+48 hrs past due date", "1 Alert per Cycle Stage", "Fixed 15-day cycle cadence"),
        ("Every 30 days", "18:00 IST (Due Date)", "48 hrs before due date", "18:30 IST on Due Date", "24 Hours (Next Day 18:30)", "+48 hrs past due date", "1 Alert per Cycle Stage", "Monthly alignment (e.g. 1st/30th)")
    ]

    for r_idx, r_data in enumerate(sla_matrix_data, 6):
        ws6.row_dimensions[r_idx].height = 24
        for c_idx, val in enumerate(r_data, 1):
            cell = ws6.cell(row=r_idx, column=c_idx)
            cell.value = val
            cell.font = font_regular
            cell.border = grid_border
            cell.alignment = align_center

    # Table 2: Stakeholders & System Contacts
    ws6.merge_cells("A12:H12")
    ws6["A12"] = "NOTIFICATION RECIPIENTS & INTEGRATION CREDENTIALS"
    ws6["A12"].font = font_section
    ws6["A12"].fill = fill_light_blue
    ws6["A12"].alignment = align_left

    contact_headers = [("Parameter Name", 26), ("Configured Value / Email", 36), ("Role / Description", 38)]
    for c_idx, (h_name, width) in enumerate(contact_headers, 1):
        cell = ws6.cell(row=13, column=c_idx)
        cell.value = h_name
        cell.font = font_header
        cell.fill = fill_dark_blue
        cell.alignment = align_header
    ws6.row_dimensions[13].height = 24

    system_contacts = [
        ("Manager Alert Email", "operations.manager@alloinnoware.com", "Receives same-day alerts when operational tasks exceed due cut-off"),
        ("Leadership Escalation Email", "leadership.ops@alloinnoware.com", "Receives unacknowledged or critical SLA breaches"),
        ("System Sender Name", "Allo Innoware Automated Task Bot", "Displays as email sender"),
        ("WhatsApp Operations Group", "Allo Innoware Daily Ops Hub", "Target WhatsApp group where daily operational updates are posted"),
        ("WhatsApp Webhook Inbound URL", "https://script.google.com/macros/s/AKfycb.../exec", "Inbound endpoint for auto-capturing WhatsApp message confirmations"),
        ("Prevent Duplicate Email Window", "24 Hours / 1 Alert Per Cycle Stage", "State machine lock prevents re-triggering alert emails if state unchanged"),
        ("Business Working Days", "Monday, Tuesday, Wednesday, Thursday, Friday", "Weekends automatically rolled to Monday")
    ]

    for r_idx, (p_name, p_val, p_desc) in enumerate(system_contacts, 14):
        ws6.row_dimensions[r_idx].height = 22
        ws6.cell(row=r_idx, column=1, value=p_name).font = font_bold
        ws6.cell(row=r_idx, column=1).border = grid_border

        c2 = ws6.cell(row=r_idx, column=2, value=p_val)
        c2.font = font_regular
        c2.border = grid_border
        c2.fill = fill_edit_highlight

        c3 = ws6.cell(row=r_idx, column=3, value=p_desc)
        c3.font = font_italic
        c3.border = grid_border

    # Save workbook
    output_filename = "Allo_Innoware_Recurring_Task_System.xlsx"
    wb.save(output_filename)
    print(f"Successfully generated Google Sheets prototype: {output_filename}")

if __name__ == "__main__":
    create_workbook()
