import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useReactToPrint } from "react-to-print";
import {
  LabelPreview,
  type LabelFields,
} from "./components/LabelPreview";
import { LABEL_HEIGHT_MM, LABEL_WIDTH_MM } from "./config/labelDimensions";
import "./App.css";

const defaultFields: LabelFields = {
  title: "Ship to",
  line1: "Alex Morgan\n123 Example Street",
  line2: "Portland, OR 97201",
};

export default function App() {
  const printRef = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState<LabelFields>(defaultFields);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Label",
  });

  const update =
    (key: keyof LabelFields) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const onPrintClick = useCallback(() => {
    void handlePrint();
  }, [handlePrint]);

  return (
    <div className="app-shell">
      <header className="app-header no-print">
        <h1>Office label print</h1>
        <p>
          Edit the fields, then print. The system print dialog sends output to
          your label printer ({LABEL_WIDTH_MM}×{LABEL_HEIGHT_MM} mm layout).
        </p>
      </header>

      <section className="app-card no-print" aria-labelledby="fields-heading">
        <h2 id="fields-heading">Label fields</h2>
        <div className="field-grid">
          <label htmlFor="title">
            Title
            <input
              id="title"
              value={fields.title}
              onChange={update("title")}
              autoComplete="off"
            />
          </label>
          <label htmlFor="line1">
            Address / line 1
            <textarea
              id="line1"
              value={fields.line1}
              onChange={update("line1")}
              autoComplete="off"
              rows={3}
            />
          </label>
          <label htmlFor="line2">
            Line 2
            <textarea
              id="line2"
              value={fields.line2}
              onChange={update("line2")}
              autoComplete="off"
              rows={2}
            />
          </label>
        </div>
      </section>

      <section className="app-card no-print" aria-labelledby="preview-heading">
        <h2 id="preview-heading">Preview</h2>
        <LabelPreview ref={printRef} fields={fields} />
        <div className="preview-actions">
          <button type="button" onClick={onPrintClick}>
            Print label
          </button>
          <span>
            Choose your label printer and matching paper size in the dialog.
          </span>
        </div>
      </section>
    </div>
  );
}
