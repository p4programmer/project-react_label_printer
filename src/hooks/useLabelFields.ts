import { useCallback, useState, type ChangeEvent } from "react";
import type { LabelFields } from "../components/LabelPreview";

export const MAX_EXTRA_LINES = 20;

export function useLabelFields(initial: LabelFields) {
  const [fields, setFields] = useState<LabelFields>(initial);

  const update = useCallback(
    (key: Exclude<keyof LabelFields, "extraLines">) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFields((prev) => ({ ...prev, [key]: e.target.value }));
      },
    [],
  );

  const addExtraLine = useCallback(() => {
    setFields((prev) =>
      prev.extraLines.length >= MAX_EXTRA_LINES
        ? prev
        : { ...prev, extraLines: [...prev.extraLines, ""] },
    );
  }, []);

  const removeExtraLine = useCallback((index: number) => {
    setFields((prev) => ({
      ...prev,
      extraLines: prev.extraLines.filter((_, i) => i !== index),
    }));
  }, []);

  const updateExtraLine = useCallback(
    (index: number, e: ChangeEvent<HTMLTextAreaElement>) => {
      const v = e.target.value;
      setFields((prev) => ({
        ...prev,
        extraLines: prev.extraLines.map((line, i) =>
          i === index ? v : line,
        ),
      }));
    },
    [],
  );

  return {
    fields,
    setFields,
    update,
    addExtraLine,
    removeExtraLine,
    updateExtraLine,
  };
}
