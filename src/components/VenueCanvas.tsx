"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Circle, Text, Group, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import type Konva from "konva";
import type { TableDTO } from "@/lib/tables/types";
import { getSeatPositions, SEAT_RADIUS_M, SEAT_TABLE_GAP_M } from "@/lib/tables/seatLayout";
import { getAvatarUrl } from "@/lib/avatars";
import type { AssignmentDTO } from "@/lib/assignments/types";

const PADDING_PX = 20;
const SEAT_RADIUS_PX_MIN = 10;
/** Debe coincidir con SEAT_EXTRA_PER_SIDE_M del backend (src/lib/geometry.ts). */
const SEAT_EXTRA_PER_SIDE_M = SEAT_TABLE_GAP_M + 2 * SEAT_RADIUS_M;

type PlacedTable = TableDTO & { pos_x: number; pos_y: number };

type TooltipState = { x: number; y: number; text: string } | null;

type VenueCanvasProps = {
  tables: TableDTO[];
  roomWidthM: number;
  roomHeightM: number;
  onTableMove: (table: TableDTO, posXM: number, posYM: number) => void;
  selectedTableId: number | null;
  onSelectTable: (tableId: number) => void;
  assignments: AssignmentDTO[];
  onEmptySeatClick: (table: TableDTO, seatNumber: number) => void;
  onOccupiedSeatClick: (assignment: AssignmentDTO) => void;
};

function SeatAvatar({
  avatarKey,
  radius,
}: {
  avatarKey: string;
  radius: number;
}) {
  const [image] = useImage(getAvatarUrl(avatarKey));
  if (!image) return null;
  return (
    <Group
      clipFunc={(ctx) => {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
        ctx.closePath();
      }}
      listening={false}
    >
      <KonvaImage
        image={image}
        x={-radius}
        y={-radius}
        width={radius * 2}
        height={radius * 2}
      />
    </Group>
  );
}

export default function VenueCanvas({
  tables,
  roomWidthM,
  roomHeightM,
  onTableMove,
  selectedTableId,
  onSelectTable,
  assignments,
  onEmptySeatClick,
  onOccupiedSeatClick,
}: VenueCanvasProps) {
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setContainerWidth(width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const availableWidth = Math.max(containerWidth - PADDING_PX * 2, 0);
  const scale = availableWidth > 0 ? availableWidth / roomWidthM : 0;

  const roomWidthPx = roomWidthM * scale;
  const roomHeightPx = roomHeightM * scale;
  const stageWidth = containerWidth;
  const stageHeight = roomHeightPx + PADDING_PX * 2;

  const mToPx = (m: number) => m * scale;
  const pxToM = (px: number) => (scale > 0 ? px / scale : 0);

  const placedTables = tables.filter(
    (t): t is PlacedTable => t.pos_x !== null && t.pos_y !== null,
  );

  const assignmentByTableSeat = new Map<string, AssignmentDTO>();
  for (const assignment of assignments) {
    if (assignment.seat_number != null) {
      assignmentByTableSeat.set(
        `${assignment.table_id}-${assignment.seat_number}`,
        assignment,
      );
    }
  }

  const makeDragBoundFunc = (table: PlacedTable) => {
    const effectiveHalfW = mToPx(table.width / 2 + SEAT_EXTRA_PER_SIDE_M);
    const effectiveHalfH = mToPx(
      (table.shape === "redonda" ? table.width : table.height) / 2 +
        SEAT_EXTRA_PER_SIDE_M,
    );
    return (pos: { x: number; y: number }) => ({
      x: Math.min(
        Math.max(pos.x, PADDING_PX + effectiveHalfW),
        PADDING_PX + roomWidthPx - effectiveHalfW,
      ),
      y: Math.min(
        Math.max(pos.y, PADDING_PX + effectiveHalfH),
        PADDING_PX + roomHeightPx - effectiveHalfH,
      ),
    });
  };

  const handleDragEnd = (
    table: PlacedTable,
    e: Konva.KonvaEventObject<DragEvent>,
  ) => {
    const node = e.target;
    onTableMove(
      table,
      pxToM(node.x() - PADDING_PX),
      pxToM(node.y() - PADDING_PX),
    );
  };

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
    >
      {containerWidth > 0 && (
        <div className="relative">
          <Stage width={stageWidth} height={stageHeight}>
            <Layer>
              <Rect
                x={PADDING_PX}
                y={PADDING_PX}
                width={roomWidthPx}
                height={roomHeightPx}
                fill="#fafafa"
                stroke="#d4d4d8"
                strokeWidth={2}
                dash={[6, 4]}
              />
              {placedTables.map((table) => {
                const x = PADDING_PX + mToPx(table.pos_x);
                const y = PADDING_PX + mToPx(table.pos_y);
                const isSelected = table.id === selectedTableId;
                const fill = isSelected ? "#18181b" : "#e4e4e7";
                const stroke = isSelected ? "#18181b" : "#a1a1aa";
                const textColor = isSelected ? "#fafafa" : "#3f3f46";
                const seatRadiusPx = Math.max(SEAT_RADIUS_PX_MIN, mToPx(SEAT_RADIUS_M));

                const seatPositions = getSeatPositions(table);

                return (
                  <Group
                    key={table.id}
                    x={x}
                    y={y}
                    draggable
                    dragBoundFunc={makeDragBoundFunc(table)}
                    onDragEnd={(e) => handleDragEnd(table, e)}
                    onClick={() => onSelectTable(table.id)}
                    onTap={() => onSelectTable(table.id)}
                  >
                    {table.shape === "redonda" ? (
                      <Circle
                        radius={mToPx(table.width) / 2}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={2}
                      />
                    ) : (
                      <Rect
                        x={-mToPx(table.width) / 2}
                        y={-mToPx(table.height) / 2}
                        width={mToPx(table.width)}
                        height={mToPx(table.height)}
                        cornerRadius={4}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={2}
                      />
                    )}
                    <Text
                      text={`${table.name} · ${table.seats}`}
                      align="center"
                      fontSize={12}
                      fill={textColor}
                      width={mToPx(Math.max(table.width, 1.2))}
                      offsetX={mToPx(Math.max(table.width, 1.2)) / 2}
                      offsetY={6}
                    />

                    {seatPositions.map((seat) => {
                      const assignment = assignmentByTableSeat.get(
                        `${table.id}-${seat.seatNumber}`,
                      );
                      const ringColor = assignment
                        ? assignment.locked
                          ? "#f59e0b"
                          : "#52525b"
                        : "#d4d4d8";

                      return (
                        <Group
                          key={seat.seatNumber}
                          x={mToPx(seat.x)}
                          y={mToPx(seat.y)}
                          onMouseDown={(e) => {
                            e.cancelBubble = true;
                          }}
                          onClick={(e) => {
                            e.cancelBubble = true;
                            if (assignment) {
                              onOccupiedSeatClick(assignment);
                            } else {
                              onEmptySeatClick(table, seat.seatNumber);
                            }
                          }}
                          onTap={(e) => {
                            e.cancelBubble = true;
                            if (assignment) {
                              onOccupiedSeatClick(assignment);
                            } else {
                              onEmptySeatClick(table, seat.seatNumber);
                            }
                          }}
                          onMouseEnter={(e) => {
                            if (!assignment) return;
                            const stage = e.target.getStage();
                            const pointer = stage?.getPointerPosition();
                            if (!pointer) return;
                            setTooltip({
                              x: pointer.x,
                              y: pointer.y,
                              text: assignment.guest.full_name,
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        >
                          <Circle
                            radius={seatRadiusPx}
                            fill="#ffffff"
                            stroke={ringColor}
                            strokeWidth={2}
                          />
                          {assignment?.guest.avatar_key && (
                            <SeatAvatar
                              avatarKey={assignment.guest.avatar_key}
                              radius={seatRadiusPx - 1.5}
                            />
                          )}
                        </Group>
                      );
                    })}
                  </Group>
                );
              })}
            </Layer>
          </Stage>
          {tooltip && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-zinc-900 px-2 py-1 text-xs font-medium text-white shadow-md"
              style={{ left: tooltip.x, top: tooltip.y - 8 }}
            >
              {tooltip.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
