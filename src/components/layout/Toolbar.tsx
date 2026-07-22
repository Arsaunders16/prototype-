type ToolbarProps = {
  noteEnabled: boolean;
  onAddNote: () => void;
};

function StickyNoteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M6.75 3.75h10.5a3 3 0 0 1 3 3v7.879a3 3 0 0 1-.879 2.121l-3.621 3.621a3 3 0 0 1-2.121.879H6.75a3 3 0 0 1-3-3V6.75a3 3 0 0 1 3-3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M14.25 20.75v-4a2 2 0 0 1 2-2h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Toolbar({
  noteEnabled,
  onAddNote,
}: ToolbarProps) {
  function handleDragStart(
    event: React.DragEvent<HTMLButtonElement>,
  ) {
    if (!noteEnabled) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = "copy";

    event.dataTransfer.setData(
      "application/x-canvas-sticky-note",
      "sticky-note",
    );

    event.dataTransfer.setData(
      "text/plain",
      "sticky-note",
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
      <button
        type="button"
        draggable={noteEnabled}
        disabled={!noteEnabled}
        onClick={onAddNote}
        onDragStart={handleDragStart}
        className="group flex h-12 items-center gap-3 rounded-xl px-4 text-sm font-semibold text-slate-700 transition hover:bg-amber-50 hover:text-amber-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 transition group-hover:bg-amber-200">
          <StickyNoteIcon />
        </span>

        <span>Sticky note</span>

        <span className="text-xs font-normal text-slate-400">
          Drag or click
        </span>
      </button>
    </div>
  );
}

export default Toolbar;