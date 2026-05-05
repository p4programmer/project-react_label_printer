/**
 * Generates docs/printer-compatibility-and-setup.pdf (printer guide).
 * Run: node scripts/generate-printer-guide-pdf.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outPath = path.join(root, "docs", "printer-compatibility-and-setup.pdf");

const doc = new PDFDocument({
  size: "LETTER",
  margins: { top: 56, bottom: 56, left: 56, right: 56 },
  info: {
    Title: "Printer compatibility and setup",
    Author: "React label printer project",
  },
});

function heading(text, level = 1) {
  const sizes = { 1: 16, 2: 13, 3: 11 };
  const spaceBefore = level === 1 ? 0 : 10;
  doc.moveDown(spaceBefore ? 0.6 : 0);
  doc
    .font("Helvetica-Bold")
    .fontSize(sizes[level] ?? 11)
    .text(text, { continued: false });
  doc.moveDown(0.35);
  doc.font("Helvetica").fontSize(10);
}

function para(parts) {
  const text = Array.isArray(parts) ? parts.join("") : parts;
  doc.text(text, { align: "left", lineGap: 2 });
  doc.moveDown(0.45);
}

function bullet(items) {
  for (const item of items) {
    doc.list([item], { bulletRadius: 2, textIndent: 12, bulletIndent: 8 });
  }
  doc.moveDown(0.35);
}

function numbered(items) {
  items.forEach((item, i) => {
    doc.text(`${i + 1}. ${item}`, { indent: 0 });
    doc.moveDown(0.25);
  });
  doc.moveDown(0.35);
}

const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

heading("Printer compatibility and setup guide", 1);
para(
  "This document describes which printers work with the React label printer web app, how printing is routed through your operating system, and practical steps to get a good print on real label stock.",
);

heading("How compatibility works", 2);
para(
  "The app renders a label in the browser and opens the standard print dialog. Your OS and printer driver send the job to the printer. No vendor SDK is required for this workflow.",
);
bullet([
  "Compatible: Thermal label printers with reliable drivers and a paper/media size that matches your label roll.",
  "Generally avoid relying on generic drivers if the manufacturer provides an official driver or preset for your rolls.",
]);

heading("Default label dimensions in the app", 2);
para(
  "The project defaults to 62 mm wide by 29 mm tall (narrow office / address style die-cut labels). Brother QL DK rolls in this size are a common match. If your physical labels differ, update the dimensions in src/config/labelDimensions.ts and src/styles/label-print.css together.",
);

heading("Recommended hardware (office / SMB)", 2);
para(
  "For the default 62 x 29 mm layout, a Brother QL series printer plus matching DK stock is usually the least ambiguous choice: broad roll catalog, crisp output, and solid macOS and Windows drivers.",
);
bullet([
  "USB-only models suit a single workstation; Wi-Fi or Ethernet models suit shared desks.",
  "DYMO LabelWriter models can work the same way via the OS print path; verify the roll size matches your CSS before buying.",
]);

heading("Brother QL family", 3);
bullet([
  "Pros: Large label assortment, sharp thermal output, common in SMB.",
  "Networking: Compare USB-only vs Wi-Fi/Ethernet if multiple computers will print.",
  "Brother b-PAC / SDK is optional; not required for browser print dialog flows.",
]);

heading("DYMO LabelWriter class", 3);
bullet([
  "Pros: Widely used for address-style labels.",
  "Confirm each SKU supports the label sizes you purchase; check drivers for every OS you use.",
  "DYMO Connect and JS APIs exist if you later want tighter desktop integration.",
]);

heading("Choosing one printer SKU", 2);
numbered([
  "Pick label stock first (exact width x height drives printer compatibility).",
  "Choose USB vs Wi-Fi/Ethernet based on how the printer will be shared.",
  "Validate drivers on each target OS (especially macOS).",
  "If you print barcodes, test scan quality on hardware after any template changes.",
]);

heading("Out of scope for this app version", 2);
para(
  "Silent printing without a dialog, raw USB-from-browser printing, and industrial ZPL-over-network printing require different architectures (local agents, WebUSB, or print servers). This project targets dialog-based OS printing only.",
);

heading("Steps: print a label from the web app", 2);
numbered([
  "Install dependencies and start the dev server: npm install && npm run dev.",
  "Open the local URL shown in the terminal (often http://localhost:5173).",
  "Fill in title and body fields; confirm the on-screen preview.",
  "Click Print label.",
  "In the system dialog, choose your label printer.",
  "Set paper or media size to match the label (62 x 29 mm or the driver preset for that roll).",
  "Disable headers and footers in the browser print options when available.",
  "Print a test sheet and confirm alignment on die-cut stock before production use.",
]);

heading("Print dialog troubleshooting", 2);
bullet([
  "Wrong printer selected: re-open the dialog and pick the thermal label device explicitly.",
  "Clipping or wrong scale: adjust media size; try Chrome or Edge first (best support for custom page sizes).",
  "Non-printable margins: tweak driver settings or slightly reduce padding in src/styles/label-print.css.",
]);

heading("Browser notes", 2);
para(
  "Chromium browsers (Chrome, Edge) typically honor custom page sizes most consistently. If Safari or Firefox scales oddly, retry in Chrome/Edge; exporting to PDF first is a common fallback.",
);

heading("Project files reference", 2);
bullet([
  "src/App.tsx — form state and Print label action.",
  "src/components/LabelPreview.tsx — label markup.",
  "src/styles/label-print.css — screen styles, @media print, @page size.",
  "src/config/labelDimensions.ts — label width and height constants.",
]);

doc.moveDown(0.5);
para(
  "Generated for the react-label-printer project. Output path: docs/printer-compatibility-and-setup.pdf",
);

doc.end();

await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
});

console.log(`Wrote ${outPath}`);
