import type {
  KeyboardEvent,
  PointerEvent,
} from "react";

import StickyNote from "./StickyNote";
import type { Idea, Priority } from "./types";

type IdeaCanvasProps = {
  ideas: Idea[];
  mode: "brainstorm" | "prioritize";
  interactive?: boolean;
  titleOffset?: number;
  textareaRefs?: React.MutableRefObject<
    Record<number, HTMLTextAreaElement | null>
  >;
  onStartDrag?: (
    event: PointerEvent<HTMLButtonElement>,
    idea: Idea,
  ) => void;
  onTextChange?: (
    ideaId: number,
    text: string,
  ) => void;
  onKeyDown?: (
    event: KeyboardEvent<HTMLTextAreaElement>,
    idea: Idea,
  ) => void;
  onPriorityChange?: (
    ideaId: number,
    priority: Exclude<Priority, null>,
  ) => void;
};

function IdeaCanvas({
  ideas,
  mode,
  interactive = true,
  titleOffset = 32,
  textareaRefs,
  onStartDrag,
  onTextChange,
  onKeyDown,
  onPriorityChange,
}: IdeaCanvasProps) {
  const isPrioritizing = mode === "prioritize";

  return (
    <>
      <div
        style={{ top: titleOffset }}
        className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 text-center"
      >
        <p className="text-sm font-semibold text-slate-500">
          {isPrioritizing
            ? "Prioritize"
            : "Brainstorm"}
        </p>

        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          Product discovery ideas
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {isPrioritizing
            ? "Assign each idea a high, medium, or low priority."
            : "Drag notes, edit their contents, or press Tab to create another."}
        </p>
      </div>

      {ideas.map((idea) => (
        <StickyNote
          key={idea.id}
          idea={idea}
          mode={mode}
          interactive={interactive}
          textareaRef={(element) => {
            if (textareaRefs) {
              textareaRefs.current[idea.id] =
                element;
            }
          }}
          onStartDrag={onStartDrag}
          onTextChange={onTextChange}
          onKeyDown={onKeyDown}
          onPriorityChange={onPriorityChange}
        />
      ))}
    </>
  );
}

export default IdeaCanvas;
