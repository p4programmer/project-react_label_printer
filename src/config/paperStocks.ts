/** Preset media sizes for preview and browser @page sizing. */

export type PaperStockId =
  | "die-cut-62x29"
  | "brother-dk-2205"
  | "brother-dk-11201";

type PaperStockFixed = {
  id: PaperStockId;
  label: string;
  widthMm: number;
  heightMm: number;
  autoHeight?: false;
  notes?: string;
};

type PaperStockAuto = {
  id: PaperStockId;
  label: string;
  widthMm: number;
  autoHeight: true;
  minHeightMm: number;
  maxHeightMm: number;
  notes?: string;
};

export type PaperStock = PaperStockFixed | PaperStockAuto;

export function paperStockUsesAutoHeight(stock: PaperStock): stock is PaperStockAuto {
  return stock.autoHeight === true;
}

export function clampAutoLabelHeightMm(
  stock: PaperStockAuto,
  heightMm: number,
): number {
  return Math.min(
    Math.max(heightMm, stock.minHeightMm),
    stock.maxHeightMm,
  );
}

export const PAPER_STOCKS: readonly PaperStock[] = [
  {
    id: "die-cut-62x29",
    label: "62×29 mm die-cut (Epson LW / narrow office)",
    widthMm: 62,
    heightMm: 29,
    notes: "Matches die-cut stock such as Brother DK-11209 class.",
  },
  {
    id: "brother-dk-2205",
    label: "Brother DK-2205 continuous (auto length)",
    widthMm: 62,
    autoHeight: true,
    minHeightMm: 20,
    maxHeightMm: 300,
    notes:
      "62 mm wide continuous paper tape; label height follows your text (20–300 mm).",
  },
  {
    id: "brother-dk-11201",
    label: "Brother DK-11201 standard address (29×90 mm)",
    widthMm: 29,
    heightMm: 90,
    notes:
      "Die-cut standard address labels (typical Brother spec: 29 mm × 90 mm, 400 labels per roll).",
  },
];

export const DEFAULT_PAPER_STOCK_ID: PaperStockId = "die-cut-62x29";

export function getPaperStock(id: string | undefined): PaperStock {
  const found = PAPER_STOCKS.find((s) => s.id === id);
  return found ?? PAPER_STOCKS[0];
}
