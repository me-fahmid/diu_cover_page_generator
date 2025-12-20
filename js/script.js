function generatePDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    // ---------- helper ----------
    const v = (id) =>
        document.getElementById(id)?.value?.trim() || "";

    // ---------- user data ----------
    const d = {
        semester: v("semester"),
        name: v("name"),
        sid: v("sid"),
        batch: v("batch"),
        section: v("section"),
        course: v("course"),
        code: v("code"),
        teacher: v("teacher"),
        designation: v("designation"),
        date: v("date")
    };

    // ---------- filename (CourseCode_StudentID.pdf) ----------
    const cleanCode = d.code.replace(/\s+/g, "");
    const cleanId = d.sid.replace(/\s+/g, "");

    const fileName =
        cleanCode && cleanId
            ? `${cleanCode}_${cleanId}.pdf`
            : "student.pdf";

    // ---------- logo ----------
    const logo = new Image();
    logo.src = "assets/logo.png";

    logo.onload = () => {
        drawPage(pdf, d);
        pdf.save(fileName);
    };

    // fallback if logo fails
    logo.onerror = () => {
        drawPage(pdf, d);
        pdf.save(fileName);
    };
}

/* =================================================
   DRAW FULL PAGE (A4 • FINAL VERSION)
================================================= */
function drawPage(pdf, d) {

    /* ---------- HEADER ---------- */
    pdf.addImage("assets/logo.png", "PNG", 60, 8, 90, 22);

    pdf.setFont("Times", "Bold");
    pdf.setFontSize(18);
    pdf.text("Course Assignment Report", 105, 40, { align: "center" });

    pdf.setFontSize(12);
    pdf.text("Only for Course Teacher", 105, 48, { align: "center" });

    /* ---------- TABLE ---------- */
    let x = 10;
    let y = 60;
    let rowH = 11;

    const col = [55, 26, 26, 26, 26, 18];

    pdf.setFont("Times", "Bold");
    pdf.setFontSize(11);

    // header row
    pdf.rect(x, y, col.reduce((a, b) => a + b), rowH);
    pdf.text("Criteria", x + 2, y + 7);

    const headers = [
        "Needs\nImprovement",
        "Developing",
        "Sufficient",
        "Above\nAverage",
        "Total\nMark"
    ];

    let cx = x + col[0];
    headers.forEach((h, i) => {
        pdf.rect(cx, y, col[i + 1], rowH);
        pdf.text(h, cx + col[i + 1] / 2, y + 6, { align: "center" });
        cx += col[i + 1];
    });

    pdf.setFont("Times", "Normal");

    // allocate row
    y += rowH;
    pdf.rect(x, y, col[0], rowH);
    pdf.text("Allocate mark & Percentage", x + 2, y + 7);

    cx = x + col[0];
    ["25%", "50%", "75%", "100%", "5"].forEach((val, i) => {
        pdf.rect(cx, y, col[i + 1], rowH);
        pdf.text(val, cx + col[i + 1] / 2, y + 7, { align: "center" });
        cx += col[i + 1];
    });

    // criteria rows
    const rows = [
        ["Content Quality", "2"],
        ["Clarity", "1"],
        ["Spelling & Grammar", "1"],
        ["Organization & Formatting", "1"]
    ];

    rows.forEach(r => {
        y += rowH;
        pdf.rect(x, y, col[0], rowH);
        pdf.text(r[0], x + 2, y + 7);

        cx = x + col[0];
        for (let i = 0; i < 4; i++) {
            pdf.rect(cx, y, col[i + 1], rowH);
            cx += col[i + 1];
        }
        pdf.rect(cx, y, col[5], rowH);
        pdf.text(r[1], cx + col[5] / 2, y + 7, { align: "center" });
    });

    // comments box
    y += rowH;
    pdf.rect(x, y, col.reduce((a, b) => a + b), 32);
    pdf.text("Comments", x + 2, y + 9);

    /* ---------- INFORMATION (SINGLE COLUMN) ---------- */
    y = y + 32 + 10;

    pdf.setFont("Times", "Normal");
    pdf.setFontSize(18);

    const LEFT = 20;
    const GAP = 9;

    pdf.text(`Semester: ${d.semester}`, LEFT, y); y += GAP;
    pdf.text(`Student Name: ${d.name}`, LEFT, y); y += GAP;
    pdf.text(`Student ID: ${d.sid}`, LEFT, y); y += GAP;
    pdf.text(`Batch: ${d.batch}`, LEFT, y); y += GAP;
    pdf.text(`Section: ${d.section}`, LEFT, y); y += GAP;
    pdf.text(`Course Code: ${d.code}`, LEFT, y); y += GAP;
    pdf.text(`Course Name: ${d.course}`, LEFT, y); y += GAP;
    pdf.text(`Course Teacher Name: ${d.teacher}`, LEFT, y); y += GAP;
    pdf.text(`Designation: ${d.designation}`, LEFT, y); y += GAP;
    pdf.text(`Submission Date: ${d.date}`, LEFT, y);

    /* ---------- FOOTER ---------- */
    pdf.setFontSize(9);
    pdf.setTextColor(120);
    pdf.text("Created by fahm.codes", 105, 292, { align: "center" });
}
