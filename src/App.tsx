import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useReactToPrint } from "react-to-print";
import { LabelFieldsEditor } from "./components/LabelFieldsEditor";
import { LabelPreview, type LabelFields } from "./components/LabelPreview";
import { PrintSetupCard } from "./components/PrintSetupCard";
import {
  DEFAULT_LABEL_LAYOUT_ORIENTATION,
  LAYOUT_ORIENTATION_OPTIONS,
  LAYOUT_ORIENTATION_STORAGE,
  type LabelLayoutOrientation,
} from "./config/labelLayoutOrientation";
import {
  DEFAULT_PAPER_STOCK_ID,
  type PaperStockId,
  PAPER_STOCKS,
  clampAutoLabelHeightMm,
  getPaperStock,
  paperStockUsesAutoHeight,
  type PaperStock,
} from "./config/paperStocks";
import { useLabelFields } from "./hooks/useLabelFields";
import "./App.css";

const PAPER_STOCK_STORAGE = "label-print:paper-stock";
const USE_SECOND_LABEL_STORAGE = "label-print:use-second-label";

const defaultLabel1: LabelFields = {
  title: "Ship to",
  line1: "Alex Morgan\n123 Example Street",
  line2: "Portland, OR 97201",
  logoUrl: "",
  extraLines: [],
};

const defaultLabel2: LabelFields = {
  title: "Return",
  line1: "",
  line2: "",
  logoUrl: "",
  extraLines: [],
};

function readStoredPaperStockId(): PaperStockId {
  try {
    const raw = localStorage.getItem(PAPER_STOCK_STORAGE);
    if (raw && PAPER_STOCKS.some((s) => s.id === raw)) {
      return raw as PaperStockId;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_PAPER_STOCK_ID;
}

function readStoredLayoutOrientation(): LabelLayoutOrientation {
  try {
    const raw = localStorage.getItem(LAYOUT_ORIENTATION_STORAGE);
    if (raw === "landscape" || raw === "portrait") {
      return raw;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_LABEL_LAYOUT_ORIENTATION;
}

function readStoredUseSecondLabel(): boolean {
  try {
    return localStorage.getItem(USE_SECOND_LABEL_STORAGE) === "1";
  } catch {
    return false;
  }
}

function computePageSizeMm(
  stock: PaperStock,
  layoutOrientation: LabelLayoutOrientation,
  variableSpanMm: number | null,
): { w: number; h: number } {
  if (paperStockUsesAutoHeight(stock)) {
    const span = variableSpanMm ?? stock.minHeightMm;
    if (layoutOrientation === "portrait") {
      return { w: stock.widthMm, h: span };
    }
    return { w: span, h: stock.widthMm };
  }
  if (layoutOrientation === "portrait") {
    return { w: stock.widthMm, h: stock.heightMm };
  }
  return { w: stock.heightMm, h: stock.widthMm };
}

export default function App() {
  const printRef = useRef<HTMLDivElement>(null);
  const label1 = useLabelFields(defaultLabel1);
  const label2 = useLabelFields(defaultLabel2);
  const [useSecondLabel, setUseSecondLabel] = useState(readStoredUseSecondLabel);

  const [paperStockId, setPaperStockId] = useState<PaperStockId>(
    readStoredPaperStockId,
  );
  const [layoutOrientation, setLayoutOrientation] =
    useState<LabelLayoutOrientation>(readStoredLayoutOrientation);
  const [autoHeightMm, setAutoHeightMm] = useState<number | null>(null);

  const stock = getPaperStock(paperStockId);

  useEffect(() => {
    try {
      localStorage.setItem(PAPER_STOCK_STORAGE, paperStockId);
    } catch {
      /* ignore */
    }
  }, [paperStockId]);

  useEffect(() => {
    try {
      localStorage.setItem(LAYOUT_ORIENTATION_STORAGE, layoutOrientation);
    } catch {
      /* ignore */
    }
  }, [layoutOrientation]);

  useEffect(() => {
    try {
      localStorage.setItem(
        USE_SECOND_LABEL_STORAGE,
        useSecondLabel ? "1" : "0",
      );
    } catch {
      /* ignore */
    }
  }, [useSecondLabel]);

  useLayoutEffect(() => {
    if (!paperStockUsesAutoHeight(stock)) {
      setAutoHeightMm(null);
      return;
    }

    const root = printRef.current;
    const sheets = root?.querySelectorAll(".label-sheet");
    if (!sheets?.length) {
      return;
    }

    const fixedMm = stock.widthMm;
    let bestRaw = 0;

    for (const sheet of sheets) {
      if (!(sheet instanceof HTMLElement)) continue;
      const wPx = sheet.offsetWidth;
      const hPx = sheet.offsetHeight;
      if (wPx < 1 || hPx < 1) continue;
      const rawMm =
        layoutOrientation === "portrait"
          ? hPx * (fixedMm / wPx)
          : wPx * (fixedMm / hPx);
      bestRaw = Math.max(bestRaw, rawMm);
    }

    if (bestRaw > 0) {
      setAutoHeightMm(clampAutoLabelHeightMm(stock, bestRaw));
    }
  }, [
    label1.fields,
    label2.fields,
    useSecondLabel,
    paperStockId,
    stock,
    layoutOrientation,
  ]);

  const { w: pageWmm, h: pageHmm } = computePageSizeMm(
    stock,
    layoutOrientation,
    autoHeightMm,
  );

  const layoutShort =
    layoutOrientation === "portrait" ? "vertical" : "horizontal";

  const sizeCaption = paperStockUsesAutoHeight(stock)
    ? `${pageWmm}×${pageHmm} mm (${layoutShort}${autoHeightMm == null ? ", estimating…" : ""})${useSecondLabel ? " · 2 labels" : ""}`
    : `${pageWmm}×${pageHmm} mm (${layoutShort})${useSecondLabel ? " · 2 labels" : ""}`;

  const sheetWidthMm: number | "auto" = paperStockUsesAutoHeight(stock)
    ? layoutOrientation === "portrait"
      ? stock.widthMm
      : "auto"
    : pageWmm;
  const sheetHeightMm: number | "auto" = paperStockUsesAutoHeight(stock)
    ? layoutOrientation === "portrait"
      ? "auto"
      : stock.widthMm
    : pageHmm;

  const sharedPreviewProps = {
    widthMm: sheetWidthMm,
    heightMm: sheetHeightMm,
    minAutoAxisMm: paperStockUsesAutoHeight(stock)
      ? stock.minHeightMm
      : undefined,
    sizeCaption,
  };

  useEffect(() => {
    const id = "label-print-page-size";
    let node = document.getElementById(id);
    if (!node) {
      node = document.createElement("style");
      node.id = id;
      document.head.appendChild(node);
    }
    node.textContent = `@media print { @page { size: ${pageWmm}mm ${pageHmm}mm; margin: 0; } }`;
  }, [pageWmm, pageHmm]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: useSecondLabel ? "Labels" : "Label",
  });

  return (
    <div className="app-shell">
      <header className="app-header no-print">
        <h1>Office label print</h1>
        <p>
          Edit the fields, then print from your browser. Preview uses{" "}
          <strong>{sizeCaption}</strong> for the selected paper and layout.
        </p>
      </header>

      <section className="app-card no-print" aria-labelledby="paper-heading">
        <h2 id="paper-heading">Paper / tape</h2>
        <label className="paper-field" htmlFor="paper-stock">
          <span className="paper-field__text">Media preset</span>
          <select
            id="paper-stock"
            value={paperStockId}
            onChange={(e) =>
              setPaperStockId(e.target.value as PaperStockId)
            }
          >
            {PAPER_STOCKS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="paper-field" htmlFor="layout-orientation">
          <span className="paper-field__text">Printer layout</span>
          <select
            id="layout-orientation"
            value={layoutOrientation}
            onChange={(e) =>
              setLayoutOrientation(e.target.value as LabelLayoutOrientation)
            }
          >
            {LAYOUT_ORIENTATION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <p className="paper-field__hint">
          Horizontal swaps width and height on the page (landscape). Match the
          same orientation in your printer driver if the preview does not line
          up with the physical label.
        </p>
        {stock.notes ? (
          <p className="paper-field__hint">{stock.notes}</p>
        ) : null}
      </section>

      <section className="app-card no-print" aria-labelledby="fields-heading">
        <h2 id="fields-heading">Label fields</h2>

        <label className="second-label-toggle field-grid__full">
          <input
            type="checkbox"
            checked={useSecondLabel}
            onChange={(e) => setUseSecondLabel(e.target.checked)}
          />
          <span>Include second label (two labels in one print job)</span>
        </label>

        <LabelFieldsEditor
          idPrefix="l1-"
          subheading="Label 1"
          fields={label1.fields}
          update={label1.update}
          addExtraLine={label1.addExtraLine}
          removeExtraLine={label1.removeExtraLine}
          updateExtraLine={label1.updateExtraLine}
        />

        {useSecondLabel ? (
          <LabelFieldsEditor
            idPrefix="l2-"
            subheading="Label 2"
            fields={label2.fields}
            update={label2.update}
            addExtraLine={label2.addExtraLine}
            removeExtraLine={label2.removeExtraLine}
            updateExtraLine={label2.updateExtraLine}
          />
        ) : null}
      </section>

      <section className="app-card no-print" aria-labelledby="preview-heading">
        <h2 id="preview-heading">Preview</h2>
        <div ref={printRef} className="label-print-stack">
          <LabelPreview fields={label1.fields} {...sharedPreviewProps} />
          {useSecondLabel ? (
            <LabelPreview fields={label2.fields} {...sharedPreviewProps} />
          ) : null}
        </div>
      </section>

      <PrintSetupCard
        labelWidthMm={pageWmm}
        labelHeightMm={pageHmm}
        onPrint={() => void handlePrint()}
      />
    </div>
  );
}
