import type {
  KeyboardEvent,
  PointerEvent,
} from "react";

import type { Idea, Priority } from "./types";

type StickyNoteProps = {
  idea: Idea;
  mode: "brainstorm" | "prioritize";
  interactive?: boolean;
  textareaRef?: (
    element: HTMLTextAreaElement | null,
  ) => void;
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

function getNoteStyles(
  mode: StickyNoteProps["mode"],
  priority: Priority,
) {
  if (mode === "brainstorm") {
    return "border-amber-200 bg-amber-100";
  }

  switch (priority) {
    case "high":
      return "border-rose-300 bg-rose-50 ring-2 ring-rose-200";
    case "medium":
      return "border-amber-300 bg-amber-50 ring-2 ring-amber-200";
    case "low":
      return "border-sky-300 bg-sky-50 ring-2 ring-sky-200";
    default:
      return "border-slate-300 bg-white";
  }
}

function getHeaderStyles(
  mode: StickyNoteProps["mode"],
  priority: Priority,
) {
  if (mode === "brainstorm") {
    return "border-amber-200 text-amber-700";
  }

  switch (priority) {
    case "high":
      return "border-rose-200 text-rose-700";
    case "medium":
      return "border-amber-200 text-amber-700";
    case "low":
      return "border-sky-200 text-sky-700";
    default:
      return "border-slate-200 text-slate-500";
  }
}

function getPriorityButtonStyles(
  buttonPriority: Exclude<Priority, null>,
  selectedPriority: Priority,
) {
  const isSelected =
    buttonPriority === selectedPriority;

  if (buttonPriority === "high") {
    return isSelected
      ? "border-rose-500 bg-rose-500 text-white"
      : "border-rose-200 bg-white text-rose-700 hover:bg-rose-50";
  }

  if (buttonPriority === "medium") {
    return isSelected
      ? "border-amber-500 bg-amber-500 text-white"
      : "border-amber-200 bg-white text-amber-700 hover:bg-amber-50";
  }

  return isSelected
    ? "border-sky-500 bg-sky-500 text-white"
    : "border-sky-200 bg-white text-sky-700 hover:bg-sky-50";
}

export function getPriorityLabel(
  priority: Priority,
) {
  if (!priority) {
    return "Unassigned";
  }

  return `${priority
    .charAt(0)
    .toUpperCase()}${priority.slice(1)} priority`;
}

function StickyNote({
  idea,
  mode,
  interactive = true,
  textareaRef,
  onStartDrag,
  onTextChange,
  onKeyDown,
  onPriorityChange,
}: StickyNoteProps) {
  const isBrainstorming = mode === "brainstorm";
  const canEdit = interactive && isBrainstorming;
  const canPrioritize =
    interactive && mode === "prioritize";

  return (
    <div
      style={{
        left: idea.x,
        top: idea.y,
      }}
      className={`absolute z-10 flex h-[238px] w-64 flex-col overflow-hidden rounded-2xl border shadow-md transition ${getNoteStyles(
        mode,
        idea.priority,
      )}`}
    >
      <button
        type="button"
        onPointerDown={(event) => {
          if (!canEdit || !onStartDrag) {
            return;
          }

          onStartDrag(event, idea);
        }}
        className={`flex w-full touch-none items-center justify-between border-b px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide ${getHeaderStyles(
          mode,
          idea.priority,
        )} ${
          canEdit
            ? "cursor-grab active:cursor-grabbing"
            : "cursor-default"
        }`}
      >
        <span>
          {mode === "prioritize"
            ? getPriorityLabel(idea.priority)
            : "Idea"}
        </span>

        {canEdit && (
          <span aria-hidden="true">⋮⋮</span>
        )}
      </button>

      <textarea
        ref={textareaRef}
        value={idea.text}
        readOnly={!canEdit}
        onKeyDown={(event) =>
          onKeyDown?.(event, idea)
        }
        onChange={(event) =>
          onTextChange?.(
            idea.id,
            event.target.value,
          )
        }
        className={`min-h-0 w-full flex-1 resize-none bg-transparent p-4 text-base leading-6 text-slate-800 outline-none ${
          canEdit ? "" : "cursor-default"
        }`}
      />

      {mode === "prioritize" && (
        <div className="border-t border-slate-200/80 bg-white/60 p-3">
          <p className="mb-2 text-xs font-semibold text-slate-500">
            Priority
          </p>

          <div className="grid grid-cols-3 gap-2">
            {(
              ["high", "medium", "low"] as const
            ).map((priority) => (
              <button
                key={priority}
                type="button"
                disabled={!canPrioritize}
                aria-pressed={
                  idea.priority === priority
                }
                onClick={() =>
                  onPriorityChange?.(
                    idea.id,
                    priority,
                  )
                }
                className={`rounded-lg border px-2 py-1.5 text-xs font-semibold capitalize transition disabled:cursor-default ${getPriorityButtonStyles(
                  priority,
                  idea.priority,
                )}`}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StickyNote;
