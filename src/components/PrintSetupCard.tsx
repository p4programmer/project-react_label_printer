import { useId } from "react";

type PrintSetupCardProps = {
  labelWidthMm: number;
  labelHeightMm: number;
  onPrint: () => void;
};

export function PrintSetupCard({
  labelWidthMm,
  labelHeightMm,
  onPrint,
}: PrintSetupCardProps) {
  const tipsId = useId();

  return (
    <>
      <section
        className="app-card no-print"
        aria-labelledby="print-heading"
      >
        <h2 id="print-heading">Print</h2>
        <div className="preview-actions">
          <button type="button" onClick={onPrint}>
            Print label
          </button>
          <span>
            Choose your label printer and matching paper size in the system
            dialog.
          </span>
        </div>
      </section>

      <section className="app-card no-print" aria-labelledby={tipsId}>
        <h2 id={tipsId}>Print checklist</h2>
        <ul className="print-tips">
          <li>Select the correct label printer (not the office copier).</li>
          <li>
            Match <strong>paper / media size</strong> to your roll (preview:{" "}
            <strong>
              {labelWidthMm}×{labelHeightMm} mm
            </strong>
            ).
          </li>
          <li>Turn off browser headers and footers so URLs do not print.</li>
          <li>
            With <strong>two labels</strong> enabled, the print job has two pages
            in order (label 1, then label 2). Use <strong>Copies</strong> in the
            dialog only if you want duplicate pairs.
          </li>
          <li>
            If you use <strong>horizontal</strong> layout, set the same orientation
            in the printer driver if the print does not match the label on the roll.
          </li>
        </ul>
      </section>
    </>
  );
}
