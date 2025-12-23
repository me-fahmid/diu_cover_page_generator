/* ================= DIU COLORS ================= */
const DIU_BLUE = [0, 102, 179];
const DIU_GREEN = [0, 153, 102];

/* ================= GLOBAL FONT ================= */
const INFO_FONT = 15;
const LINE_HEIGHT = 7.5;

/* ================= SECTION HEADING ================= */
function sectionTitle(pdf, text, y) {
    pdf.setFont("Times", "Bold");
    pdf.setFontSize(15);
    pdf.setTextColor(...DIU_GREEN);
    pdf.text(text, 105, y, { align: "center" });

    pdf.setDrawColor(...DIU_GREEN);
    pdf.setLineWidth(0.6);
    pdf.line(75, y + 2, 135, y + 2);

    pdf.setFont("Times", "Normal");
    pdf.setFontSize(INFO_FONT);
    pdf.setTextColor(0);
}

/* ================= MAIN ================= */
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const v = (id) => document.getElementById(id)?.value?.trim() || "";

    const d = {
        semester: v("semester"),
        name: v("name"),
        sid: v("sid"),
        batch: v("batch"),
        section: v("section"),
        department: v("department"),
        course: v("course"),
        code: v("code"),
        topic: v("topic"),
        teacher: v("teacher"),
        designation: v("designation"),
        t_department: v("t_department"),
        date: v("date")
    };

    drawPage(pdf, d);
    pdf.save(`${d.code || "course"}_${d.sid || "student"}.pdf`);
}

/* ================= DRAW PAGE ================= */
function drawPage(pdf, d) {

    /* ---------- HEADER ---------- */
    pdf.addImage("assets/logo.png", "PNG", 60, 8, 90, 22);

    pdf.setFont("Times", "Bold");
    pdf.setFontSize(16);
    pdf.text("Course Assignment Report", 105, 38, { align: "center" });

    pdf.setFontSize(12);
    pdf.text("Only for Course Teacher", 105, 46, { align: "center" });

    /* ---------- TABLE ---------- */
    let x = 10;
    let y = 55;

    const COL = [55, 26, 26, 26, 26, 18];
    const HEADER_H = 12;
    const ROW_H = 10;

    pdf.setFont("Times", "Bold");
    pdf.setFontSize(10);

    // Header row
    pdf.rect(x, y, COL.reduce((a, b) => a + b), HEADER_H);
    pdf.text("Criteria", x + 2, y + 8);

    const headers = [
        "Needs\nImprovement",
        "Developing",
        "Sufficient",
        "Above\nAverage",
        "Total\nMark"
    ];

    let cx = x + COL[0];
    headers.forEach((h, i) => {
        pdf.rect(cx, y, COL[i + 1], HEADER_H);
        pdf.text(h, cx + COL[i + 1] / 2, y + 6, {
            align: "center",
            lineHeightFactor: 1.2
        });
        cx += COL[i + 1];
    });

    // Allocate row
    y += HEADER_H;
    pdf.setFont("Times", "Normal");

    pdf.rect(x, y, COL[0], ROW_H);
    pdf.text("Allocate mark & Percentage", x + 2, y + 7);

    cx = x + COL[0];
    ["25%", "50%", "75%", "100%", "5"].forEach((v, i) => {
        pdf.rect(cx, y, COL[i + 1], ROW_H);
        pdf.text(v, cx + COL[i + 1] / 2, y + 7, { align: "center" });
        cx += COL[i + 1];
    });

    // Criteria rows
    const rows = [
        ["Content Quality", 2],
        ["Clarity", 1],
        ["Spelling & Grammar", 1],
        ["Organization & Formatting", 1]
    ];

    rows.forEach(r => {
        y += ROW_H;

        pdf.rect(x, y, COL[0], ROW_H);
        pdf.text(r[0], x + 2, y + 7);

        cx = x + COL[0];
        for (let i = 0; i < 4; i++) {
            pdf.rect(cx, y, COL[i + 1], ROW_H);
            cx += COL[i + 1];
        }

        pdf.rect(cx, y, COL[5], ROW_H);
        pdf.text(String(r[1]), cx + COL[5] / 2, y + 7, { align: "center" });
    });

    // Comments
    y += ROW_H;
    pdf.rect(x, y, COL.reduce((a, b) => a + b), 12);
    pdf.text("Comments", x + 2, y + 7);

    /* ================= INFO SECTIONS ================= */
    pdf.setFontSize(INFO_FONT);

    // Course Information
    y += 22;
    sectionTitle(pdf, "Course Information", y);

    y += 10;
    pdf.text(`Semester: ${d.semester}`, 30, y); y += LINE_HEIGHT;
    pdf.text(`Course Code: ${d.code}`, 30, y); y += LINE_HEIGHT;
    pdf.text(`Course Name: ${d.course}`, 30, y); y += LINE_HEIGHT;
    pdf.text(`Topic Name: ${d.topic}`, 30, y);

    // Submitted To
    y += 12;
    sectionTitle(pdf, "Submitted To", y);

    y += 10;
    pdf.text(`Name: ${d.teacher}`, 30, y); y += LINE_HEIGHT;
    pdf.text(`Designation: ${d.designation}`, 30, y); y += LINE_HEIGHT;
    pdf.text(`Department: ${d.t_department}`, 30, y);

    // Submitted By
    y += 12;
    sectionTitle(pdf, "Submitted By", y);

    y += 10;
    pdf.text(`Name: ${d.name}`, 30, y); y += LINE_HEIGHT;
    pdf.text(`ID: ${d.sid}`, 30, y); y += LINE_HEIGHT;
    pdf.text(`Batch: ${d.batch}`, 30, y); y += LINE_HEIGHT;
    pdf.text(`Section: ${d.section}`, 30, y); y += LINE_HEIGHT;
    pdf.text(`Department: ${d.department}`, 30, y);

    y+=9;

   // ===== Submission Date (always below info) =====
pdf.setFont("Times", "Bold");
pdf.setFontSize(15);
pdf.setDrawColor(...DIU_BLUE);
pdf.setTextColor(...DIU_BLUE);

// center aligned box
pdf.roundedRect(65, y, 80, 10, 5, 5);
pdf.text(`Submission Date: ${d.date}`, 105, y + 7, { align: "center" });



    /* ---------- FOOTER ---------- */
    pdf.setFont("Times", "Normal");
    pdf.setFontSize(9);
    pdf.setTextColor(120);
    pdf.text("Created by fahm.codes", 105, 292, { align: "center" });
}
