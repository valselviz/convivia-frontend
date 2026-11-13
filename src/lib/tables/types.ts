export type TableShape = "redonda" | "rectangular";

export type TableDTO = {
  id: number;
  event_id: number;
  name: string;
  shape: TableShape;
  seats: number;
  min_seats: number | null;
  category: string | null;
  pos_x: number | null;
  pos_y: number | null;
  width: number;
  height: number;
};

export type TableCreateInput = {
  name: string;
  shape: TableShape;
  seats: number;
  min_seats?: number | null;
  category?: string | null;
  pos_x?: number | null;
  pos_y?: number | null;
  width?: number;
  height?: number;
};

export type TableUpdateInput = Partial<Omit<TableCreateInput, "name">> & {
  id: number;
  name?: string;
};

export const SHAPE_LABELS: Record<TableShape, string> = {
  redonda: "Redonda",
  rectangular: "Rectangular",
};

export const DEFAULT_SIZE_BY_SHAPE: Record<
  TableShape,
  { width: number; height: number }
> = {
  redonda: { width: 1.5, height: 1.5 },
  rectangular: { width: 2, height: 0.9 },
};
