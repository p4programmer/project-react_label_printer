# React label printer (office / SMB)

Small React app that lays out a single die-cut label and prints it through the **browser print dialog**. The OS driver sends output to your label printer—no vendor SDK is required for this flow.

## Default label size

The layout is fixed to **62 × 29 mm** (see [`src/config/labelDimensions.ts`](src/config/labelDimensions.ts) and [`src/styles/label-print.css`](src/styles/label-print.css)). That matches a common office thermal stock (for example Brother DK-style narrow address labels). To support another roll, change the constants and the `@page` / `.label-sheet` dimensions together.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Edit the fields, then **Print label** and choose your label printer in the system dialog.

```bash
npm run build   # production bundle
npm run preview # serve dist
```

## Printer choice (research summary)

Because printing goes through the **system dialog**, any printer with a reliable driver and a matching **custom paper / label size** can work. For typical office die-cut labels:

### Brother QL family

- **Pros:** Broad label catalog, sharp thermal output, solid macOS and Windows drivers, very common in SMB.
- **Models:** Compare USB-only units vs **Wi‑Fi / Ethernet** (often names containing **NWB** or similar) if the device will be shared on a network.
- **Web apps:** You use the normal OS print path; Brother **b-PAC** and similar SDKs are optional and aimed at deeper desktop automation, not required here.

### DYMO LabelWriter class

- **Pros:** Popular for shipping-style and address labels; **DYMO Connect** plus their JS framework can drive printers locally if you later want tighter integration than CSS sizing.
- **Watchouts:** Confirm the exact printer SKU supports the label sizes you buy, and check driver support for every OS you care about.

### How to pick one SKU

1. **Stock first:** Choose the physical label size you must ship; that narrows compatible printers.
2. **Connectivity:** USB for a single workstation vs network for shared use.
3. **OS:** Validate drivers on each platform you deploy (especially macOS).
4. **Barcodes:** If you add barcodes later, render them at adequate resolution (SVG or high-DPI raster) and test scans on real hardware.

### Industrial / silent printing

If you later need **no print dialog**, **direct USB from the browser**, or **ZPL over the network** (Zebra and similar), you would adopt a different integration (WebUSB, a local agent, or raw network printing). This project’s v1 scope is **dialog-based OS printing** only.

## Print dialog tips

1. In the dialog, select your **label printer** (not the default office copier).
2. Set **paper / media size** to the same dimensions as the label (or the driver’s preset for that roll, if listed).
3. Disable **headers and footers** in the browser’s print options when available, so URLs and dates do not appear on the label.
4. Margins: this app uses `@page { margin: 0 }` and a full-bleed label box; if the driver adds non-printable margins, adjust driver settings or slightly reduce content padding in [`src/styles/label-print.css`](src/styles/label-print.css).

## Browser notes

Custom `@page` sizes are interpreted most consistently in **Chromium** (Chrome, Edge). If **Safari** or **Firefox** mis-scales a job, try the same label through Chrome/Edge first; a PDF export workflow is the usual fallback for stubborn engines.

## Project layout

| Path | Role |
|------|------|
| [`src/App.tsx`](src/App.tsx) | Form state, **Print label** using `react-to-print` |
| [`src/components/LabelPreview.tsx`](src/components/LabelPreview.tsx) | Label markup |
| [`src/styles/label-print.css`](src/styles/label-print.css) | Screen + `@media print` + `@page` |
| [`src/config/labelDimensions.ts`](src/config/labelDimensions.ts) | Single source for width/height (mm) |
