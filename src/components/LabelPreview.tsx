import { forwardRef } from "react";
import { LABEL_HEIGHT_MM, LABEL_WIDTH_MM } from "../config/labelDimensions";
import "../styles/label-print.css";

export type LabelFields = {
  title: string;
  line1: string;
  line2: string;
};

type LabelPreviewProps = {
  fields: LabelFields;
};

export const LabelPreview = forwardRef<HTMLDivElement, LabelPreviewProps>(
  function LabelPreview({ fields }, ref) {
    return (
      <div ref={ref} className="label-print-root">
        <div className="label-print-wrapper">
          <article className="label-sheet" aria-label="Label preview">
            <div className="label-sheet__title">{fields.title}</div>
            {fields.line1 ? (
              <div className="label-sheet__line">{fields.line1}</div>
            ) : null}
            {fields.line2 ? (
              <div className="label-sheet__line">{fields.line2}</div>
            ) : null}
            <div className="label-sheet__meta">
              Screen preview · {LABEL_WIDTH_MM}×{LABEL_HEIGHT_MM} mm stock (hidden
              when printing)
            </div>
          </article>
        </div>
      </div>
    );
  },
);
