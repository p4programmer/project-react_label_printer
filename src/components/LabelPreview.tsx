import {
  forwardRef,
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import "../styles/label-print.css";

export type LabelFields = {
  title: string;
  line1: string;
  line2: string;
  /** Optional image URL; empty = text-only label. */
  logoUrl: string;
  /** Optional extra text blocks after line 2; each prints as its own paragraph. */
  extraLines: string[];
};

type LabelPreviewProps = {
  fields: LabelFields;
  /** Page width; use `"auto"` when only height is fixed (e.g. landscape + auto height). */
  widthMm: number | "auto";
  /** Page height; use `"auto"` when only width is fixed (e.g. portrait + auto height). */
  heightMm: number | "auto";
  /** Minimum on the axis that is `"auto"` (continuous tape). */
  minAutoAxisMm?: number;
  /** Shown in the preview meta line (e.g. dimensions or "auto"). */
  sizeCaption: string;
};

export const LabelPreview = forwardRef<HTMLDivElement, LabelPreviewProps>(
  function LabelPreview(
    {
      fields,
      widthMm,
      heightMm,
      minAutoAxisMm = 20,
      sizeCaption,
    },
    ref,
  ) {
    const [logoFailed, setLogoFailed] = useState(false);
    const trimmedLogo = fields.logoUrl.trim();
    const wantsLogo = Boolean(trimmedLogo);

    useEffect(() => {
      setLogoFailed(false);
    }, [trimmedLogo]);

    const showLogo = wantsLogo && !logoFailed;

    const sheetStyle: CSSProperties = {};

    if (widthMm === "auto") {
      sheetStyle.width = "auto";
      sheetStyle.minWidth = `${minAutoAxisMm}mm`;
    } else {
      sheetStyle.width = `${widthMm}mm`;
    }

    if (heightMm === "auto") {
      sheetStyle.height = "auto";
      sheetStyle.minHeight = `${minAutoAxisMm}mm`;
    } else {
      sheetStyle.height = `${heightMm}mm`;
    }

    return (
      <div ref={ref} className="label-print-root">
        <div className="label-print-wrapper">
          <article
            className={
              showLogo
                ? "label-sheet label-sheet--with-logo"
                : "label-sheet"
            }
            aria-label="Label preview"
            style={sheetStyle}
          >
            {showLogo ? (
              <div className="label-sheet__logo-wrap">
                <img
                  className="label-sheet__logo"
                  src={trimmedLogo}
                  alt=""
                  onError={() => setLogoFailed(true)}
                />
              </div>
            ) : null}
            <div className="label-sheet__body">
              <div className="label-sheet__title">{fields.title}</div>
              {fields.line1 ? (
                <div className="label-sheet__line">{fields.line1}</div>
              ) : null}
              {fields.line2 ? (
                <div className="label-sheet__line">{fields.line2}</div>
              ) : null}
              {fields.extraLines.map((line, i) =>
                line.trim() ? (
                  <div key={`extra-${i}`} className="label-sheet__line">
                    {line}
                  </div>
                ) : null,
              )}
              <div className="label-sheet__meta">
                Screen preview · {sizeCaption} (hidden when printing)
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  },
);
