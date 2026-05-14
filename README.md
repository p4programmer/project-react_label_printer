# React label printer (office / SMB)

Small React app that lays out a label for **selectable paper presets** (Epson-style die-cut, Brother DK rolls). Printing goes through the **browser print dialog**; the OS driver sends output to your label printer.

## Paper / tape presets

Choose **Paper / tape** in the app. Presets are defined in [`src/config/paperStocks.ts`](src/config/paperStocks.ts).

| Preset | Size | Notes |
|--------|------|--------|
| 62×29 mm die-cut (Epson LW / narrow office) | 62 × 29 mm | Die-cut / die-style narrow labels (e.g. Brother DK-11209 class). |
| Brother DK-2205 continuous | 62 mm wide, **auto height** | Continuous tape; height follows content (clamped **20–300 mm**). Preview measures layout for `@page`. |
| Brother DK-11201 standard address | 29 × 90 mm | Die-cut standard address labels (typical Brother spec; 400 labels per roll). |

`@page` size for browser printing is set at runtime from the selected preset. Legacy constants for scripts remain in [`src/config/labelDimensions.ts`](src/config/labelDimensions.ts).

**Printer layout** (vertical vs horizontal) swaps the page width and height for preview and `@page` (portrait vs landscape). Use the same orientation in your driver if the job does not match how the label is loaded on the printer.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Edit the fields, choose **Paper / tape** and **Printer layout**, then **Print label** and pick your printer in the system dialog.

```bash
npm run build   # production bundle
npm run preview # serve dist
```

## Printer choice (research summary)

Because printing goes through the **system dialog**, any printer with a reliable driver and a matching **custom paper / label size** can work.

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

### Silent or programmatic printing

If you need **no print dialog** or **automation from another program**, you would add a different integration (desktop shell, vendor SDK, raw network printing, etc.). This project uses **dialog-based browser printing** only.

## Print dialog tips

1. In the dialog, select your **label printer** (not the default office copier).
2. Set **paper / media size** to the same dimensions as the label (or the driver’s preset for that roll, if listed).
3. Disable **headers and footers** in the browser’s print options when available, so URLs and dates do not appear on the label.
4. Margins: the app uses `@page { margin: 0 }` and a full-bleed label box; if the driver adds non-printable margins, adjust driver settings or slightly reduce content padding in [`src/styles/label-print.css`](src/styles/label-print.css).

## Browser notes

Custom `@page` sizes are interpreted most consistently in **Chromium** (Chrome, Edge). If **Safari** or **Firefox** mis-scales a job, try the same label through Chrome/Edge first; a PDF export workflow is the usual fallback for stubborn engines.

## Project layout

| Path | Role |
|------|------|
| [`src/App.tsx`](src/App.tsx) | Form state, preview ref, print wiring |
| [`src/components/PrintSetupCard.tsx`](src/components/PrintSetupCard.tsx) | Print button + checklist |
| [`src/components/LabelPreview.tsx`](src/components/LabelPreview.tsx) | Label markup |
| [`src/styles/label-print.css`](src/styles/label-print.css) | Screen + `@media print` label layout |
| [`src/config/paperStocks.ts`](src/config/paperStocks.ts) | Paper presets (sizes) |
| [`src/config/labelLayoutOrientation.ts`](src/config/labelLayoutOrientation.ts) | Vertical / horizontal layout labels |
| [`src/config/labelDimensions.ts`](src/config/labelDimensions.ts) | Default 62×29 mm constants for legacy scripts |
