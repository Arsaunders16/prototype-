export type Priority =
  | "high"
  | "medium"
  | "low"
  | null;

export type Idea = {
  id: number;
  text: string;
  x: number;
  y: number;
  priority: Priority;
  nextAction?: string;
  successSignal?: string;
};

export type DragState = {
  ideaId: number;
  offsetX: number;
  offsetY: number;
} | null;

export const NOTE_WIDTH = 256;
export const NOTE_HEIGHT = 238;
export const NOTE_GAP = 32;