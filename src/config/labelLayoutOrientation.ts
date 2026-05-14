/** Page layout relative to the stock’s default width × height. */

export type LabelLayoutOrientation = "portrait" | "landscape";

export const LAYOUT_ORIENTATION_STORAGE = "label-print:layout-orientation";

export const DEFAULT_LABEL_LAYOUT_ORIENTATION: LabelLayoutOrientation =
  "portrait";

export const LAYOUT_ORIENTATION_OPTIONS: {
  value: LabelLayoutOrientation;
  label: string;
}[] = [
  { value: "portrait", label: "Vertical (portrait)" },
  { value: "landscape", label: "Horizontal (landscape)" },
];
