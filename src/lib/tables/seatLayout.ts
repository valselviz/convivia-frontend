import type { TableShape } from "./types";

/** Debe coincidir con las constantes del backend (src/lib/geometry.ts). */
export const SEAT_RADIUS_M = 0.15;
export const SEAT_TABLE_GAP_M = 0.05;

export type SeatPosition = {
  seatNumber: number;
  /** Relativo al centro de la mesa, en metros. */
  x: number;
  y: number;
};

const roundSeatPositions = (
  width: number,
  seats: number,
): SeatPosition[] => {
  const ringRadius = width / 2 + SEAT_TABLE_GAP_M + SEAT_RADIUS_M;
  const positions: SeatPosition[] = [];
  for (let i = 0; i < seats; i++) {
    const angle = -Math.PI / 2 + (i / seats) * 2 * Math.PI;
    positions.push({
      seatNumber: i + 1,
      x: Math.cos(angle) * ringRadius,
      y: Math.sin(angle) * ringRadius,
    });
  }
  return positions;
};

const pointOnRectanglePerimeter = (
  distance: number,
  halfW: number,
  halfH: number,
): { x: number; y: number } => {
  // Arranca en la esquina superior izquierda y recorre en sentido horario:
  // arriba -> derecha -> abajo -> izquierda.
  const top = 2 * halfW;
  const right = 2 * halfH;
  const bottom = 2 * halfW;

  let remaining = distance;
  if (remaining <= top) {
    return { x: -halfW + remaining, y: -halfH };
  }
  remaining -= top;
  if (remaining <= right) {
    return { x: halfW, y: -halfH + remaining };
  }
  remaining -= right;
  if (remaining <= bottom) {
    return { x: halfW - remaining, y: halfH };
  }
  remaining -= bottom;
  return { x: -halfW, y: halfH - remaining };
};

const rectangularSeatPositions = (
  width: number,
  height: number,
  seats: number,
): SeatPosition[] => {
  const halfW = width / 2 + SEAT_TABLE_GAP_M + SEAT_RADIUS_M;
  const halfH = height / 2 + SEAT_TABLE_GAP_M + SEAT_RADIUS_M;
  const perimeter = 4 * halfW + 4 * halfH;

  const positions: SeatPosition[] = [];
  for (let i = 0; i < seats; i++) {
    const distance = (i / seats) * perimeter;
    const point = pointOnRectanglePerimeter(distance, halfW, halfH);
    positions.push({ seatNumber: i + 1, x: point.x, y: point.y });
  }
  return positions;
};

export const getSeatPositions = (table: {
  shape: TableShape;
  width: number;
  height: number;
  seats: number;
}): SeatPosition[] => {
  if (table.seats <= 0) return [];
  return table.shape === "redonda"
    ? roundSeatPositions(table.width, table.seats)
    : rectangularSeatPositions(table.width, table.height, table.seats);
};
