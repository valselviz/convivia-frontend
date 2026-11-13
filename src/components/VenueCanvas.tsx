"use client";

import { Stage, Layer, Rect, Circle, Text, Group } from "react-konva";
import type Konva from "konva";
import type { TableDTO } from "@/lib/tables/types";

const CANVAS_WIDTH_PX = 900;
const CANVAS_HEIGHT_PX = 600;
const PADDING_PX = 20;

type PlacedTable = TableDTO & { pos_x: number; pos_y: number };

type VenueCanvasProps = {
  tables: TableDTO[];
  roomWidthM: number;
  roomHeightM: number;
  onTableMove: (table: TableDTO, posXM: number, posYM: number) => void;
  selectedTableId: number | null;
  onSelectTable: (tableId: number) => void;
};

export default function VenueCanvas({
  tables,
  roomWidthM,
  roomHeightM,
  onTableMove,
  selectedTableId,
  onSelectTable,
}: VenueCanvasProps) {
  const availableWidth = CANVAS_WIDTH_PX - PADDING_PX * 2;
  const availableHeight = CANVAS_HEIGHT_PX - PADDING_PX * 2;
  const scale = Math.min(
    availableWidth / roomWidthM,
    availableHeight / roomHeightM,
  );

  const roomWidthPx = roomWidthM * scale;
  const roomHeightPx = roomHeightM * scale;

  const mToPx = (m: number) => m * scale;
  const pxToM = (px: number) => px / scale;

  const placedTables = tables.filter(
    (t): t is PlacedTable => t.pos_x !== null && t.pos_y !== null,
  );

  const makeDragBoundFunc = (table: PlacedTable) => {
    const halfW = mToPx(table.width) / 2;
    const halfH = mToPx(table.height) / 2;
    return (pos: { x: number; y: number }) => ({
      x: Math.min(Math.max(pos.x, PADDING_PX + halfW), PADDING_PX + roomWidthPx - halfW),
      y: Math.min(Math.max(pos.y, PADDING_PX + halfH), PADDING_PX + roomHeightPx - halfH),
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
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <Stage width={CANVAS_WIDTH_PX} height={CANVAS_HEIGHT_PX}>
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
                  text={`${table.name}\n${table.seats} puestos`}
                  align="center"
                  fontSize={12}
                  fill={textColor}
                  width={mToPx(Math.max(table.width, 1.2))}
                  offsetX={mToPx(Math.max(table.width, 1.2)) / 2}
                  offsetY={-6}
                />
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
