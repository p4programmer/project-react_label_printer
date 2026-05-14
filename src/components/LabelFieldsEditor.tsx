import type { ChangeEvent } from "react";
import type { LabelFields } from "./LabelPreview";
import { MAX_EXTRA_LINES } from "../hooks/useLabelFields";

type LabelFieldsEditorProps = {
  idPrefix: string;
  /** Shown above the grid (e.g. "Label 1"). */
  subheading: string;
  fields: LabelFields;
  update: (
    key: Exclude<keyof LabelFields, "extraLines">,
  ) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  addExtraLine: () => void;
  removeExtraLine: (index: number) => void;
  updateExtraLine: (
    index: number,
    e: ChangeEvent<HTMLTextAreaElement>,
  ) => void;
};

export function LabelFieldsEditor({
  idPrefix,
  subheading,
  fields,
  update,
  addExtraLine,
  removeExtraLine,
  updateExtraLine,
}: LabelFieldsEditorProps) {
  const pid = (name: string) => `${idPrefix}${name}`;

  return (
    <div className="label-fields-editor">
      <h3 className="label-fields-editor__title">{subheading}</h3>
      <div className="field-grid">
        <label className="field-grid__full" htmlFor={pid("logo-url")}>
          Logo URL (optional)
          <input
            id={pid("logo-url")}
            type="url"
            value={fields.logoUrl}
            onChange={update("logoUrl")}
            placeholder="https://example.com/logo.png"
            autoComplete="off"
          />
        </label>
        <label htmlFor={pid("title")}>
          Title
          <input
            id={pid("title")}
            value={fields.title}
            onChange={update("title")}
            autoComplete="off"
          />
        </label>
        <label htmlFor={pid("line1")}>
          Address / line 1
          <textarea
            id={pid("line1")}
            value={fields.line1}
            onChange={update("line1")}
            autoComplete="off"
            rows={3}
          />
        </label>
        <label htmlFor={pid("line2")}>
          Line 2
          <textarea
            id={pid("line2")}
            value={fields.line2}
            onChange={update("line2")}
            autoComplete="off"
            rows={2}
          />
        </label>

        <div className="extra-lines-block field-grid__full">
          <div className="extra-lines-block__header">
            <span className="extra-lines-block__title">Additional lines</span>
            <button
              type="button"
              className="btn-add-line"
              onClick={addExtraLine}
              disabled={fields.extraLines.length >= MAX_EXTRA_LINES}
            >
              Add line
            </button>
          </div>
          {fields.extraLines.length === 0 ? (
            <p className="extra-lines-block__empty">
              Optional: add more text blocks below line 2. Each prints as its own
              paragraph on the label.
            </p>
          ) : null}
          {fields.extraLines.map((line, index) => (
            <div className="extra-line-row" key={`${idPrefix}-extra-${index}`}>
              <label htmlFor={pid(`extra-line-${index}`)}>
                Line {index + 3}
                <textarea
                  id={pid(`extra-line-${index}`)}
                  value={line}
                  onChange={(e) => updateExtraLine(index, e)}
                  autoComplete="off"
                  rows={2}
                />
              </label>
              <button
                type="button"
                className="btn-remove-line"
                onClick={() => removeExtraLine(index)}
                aria-label={`Remove line ${index + 3}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
