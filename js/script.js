/* ================= TABLE CONFIG (DIU FORMAT) ================= */
const TABLE_CONFIG = {
    "course": {
        title: "Course Assignment Report",
        total: 5,
        rows: [
            ["Content Quality", 2],
            ["Clarity", 1],
            ["Spelling & Grammar", 1],
            ["Organization & Formatting", 1]
        ]
    },
    "lab-assignment": {
        title: "Lab / Project Assignment Report",
        total: 5,
        rows: [
            ["Creativity", 1],
            ["Content Development", 2],
            ["Problem Solving", 1],
            ["Organization & Formatting", 1]
        ]
    },
    "lab": {
        title: "Lab / Project Report",
        total: 25,
        rows: [
            ["Problem Understanding & Analysis", 7],
            ["Implementation", 8],
            ["Report Writing", 10]
        ]
    },
    "final": {
        title: "Lab / Project Final Report",
        total: 40,
        rows: [
            ["Problem Understanding", 10],
            ["Analysis", 15],
            ["Implementation", 10],
            ["Task Efficiency", 5]
        ]
    }
};

/* ================= MAIN ================= */
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const v = (id) =>
        document.getElementById(id)?.value?.trim() || "";

    const d = {
        semester: v("semester"),
        name: v("name"),
        sid: v("sid"),
        batch: v("batch"),
        section: v("section"),
        department: v("department"),
        course: v("course"),
        code: v("code"),
        teacher: v("teacher"),
        designation: v("designation"),
        t_department: v("t_department"),
        date: v("date")
    };

    // 🔥 READ DROPDOWN VALUE
    const reportTypeEl = document.getElementById("reportType");
    const reportType = reportTypeEl ? reportTypeEl.value : "course";
    const cfg = TABLE_CONFIG[reportType];

    console.log("Selected report type:", reportType);

    // filename
    const cleanCode = d.code.replace(/\s+/g, "");
    const cleanId = d.sid.replace(/\s+/g, "");
    const fileName =
        cleanCode && cleanId ? `${cleanCode}_${cleanId}.pdf` : "student.pdf";

    drawPage(pdf, d, cfg);
    pdf.save(fileName);
}

/* ================= DRAW PAGE ================= */
function drawPage(pdf, d, cfg) {

    /* ---------- HEADER ---------- */
    pdf.addImage("assets/logo.png", "PNG", 60, 8, 90, 22);

    pdf.setFont("Times", "Bold");
    pdf.setFontSize(18);
    pdf.text(cfg.title, 105, 40, { align: "center" });

    pdf.setFontSize(12);
    pdf.text("Only for Course Teacher", 105, 48, { align: "center" });

    /* ---------- TABLE ---------- */
    let x = 10;
    let y = 60;
    let rowH = 11;
    const col = [55, 26, 26, 26, 26, 18];

    pdf.setFont("Times", "Bold");
    pdf.setFontSize(11);

    // Header row
    pdf.rect(x, y, col.reduce((a,b)=>a+b), rowH);
    pdf.text("Criteria", x + 2, y + 7);

    const headers = [
    ["Needs", "Improvement"],
    ["Developing"],
    ["Sufficient"],
    ["Above", "Average"],
    ["Total", "Mark"]
     ];


    let cx = x + col[0];
    headers.forEach((lines, i) => {
    pdf.rect(cx, y, col[i + 1], rowH);

    if (Array.isArray(lines)) {
        pdf.text(lines, cx + col[i + 1] / 2, y + 5, {
            align: "center",
            lineHeightFactor: 1.2
        });
    } else {
        pdf.text(lines, cx + col[i + 1] / 2, y + 7, {
            align: "center"
        });
    }

    cx += col[i + 1];
    });


    // Allocate row
    y += rowH;
    pdf.rect(x, y, col[0], rowH);
    pdf.text("Allocate mark & Percentage", x + 2, y + 7);

    cx = x + col[0];
    ["25%", "50%", "75%", "100%", cfg.total].forEach((v, i) => {
        pdf.rect(cx, y, col[i+1], rowH);
        pdf.text(String(v), cx + col[i+1]/2, y + 7, { align: "center" });
        cx += col[i+1];
    });

    pdf.setFont("Times", "Normal");

    // Criteria rows
    cfg.rows.forEach(r => {
        y += rowH;
        pdf.rect(x, y, col[0], rowH);
        pdf.text(r[0], x + 2, y + 7);

        cx = x + col[0];
        for (let i = 0; i < 4; i++) {
            pdf.rect(cx, y, col[i+1], rowH);
            cx += col[i+1];
        }
        pdf.rect(cx, y, col[5], rowH);
        pdf.text(String(r[1]), cx + col[5]/2, y + 7, { align: "center" });
    });

    // Comments
    y += rowH;
    pdf.rect(x, y, col.reduce((a,b)=>a+b), 32);
    pdf.text("Comments", x + 2, y + 9);

    /* ---------- INFORMATION ---------- */
    y += 42;
    pdf.setFontSize(18);

    const LEFT = 20;
    const GAP = 9;

    pdf.text(`Semester: ${d.semester}`, LEFT, y); y += GAP;
    pdf.text(`Student Name: ${d.name}`, LEFT, y); y += GAP;
    pdf.text(`Student ID: ${d.sid}`, LEFT, y); y += GAP;
    pdf.text(`Batch: ${d.batch}`, LEFT, y); y += GAP;
    pdf.text(`Section: ${d.section}`, LEFT, y); y += GAP;
    pdf.text(`Department: ${d.department}`, LEFT, y); y += GAP;
    pdf.text(`Course Code: ${d.code}`, LEFT, y); y += GAP;
    pdf.text(`Course Name: ${d.course}`, LEFT, y); y += GAP;
    pdf.text(`Course Teacher Name: ${d.teacher}`, LEFT, y); y += GAP;
    pdf.text(`Designation: ${d.designation}`, LEFT, y); y += GAP;
    pdf.text(`Teacher Department: ${d.t_department}`, LEFT, y); y += GAP;
    pdf.text(`Submission Date: ${d.date}`, LEFT, y);

    /* ---------- FOOTER ---------- */
    pdf.setFontSize(9);
    pdf.setTextColor(120);
    pdf.text("Created by fahm.codes", 105, 292, { align: "center" });
}
