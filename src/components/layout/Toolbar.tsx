const tools = ["Select", "Note", "Text", "Frame", "Zoom"];

function Toolbar() {
  return (
    <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
      {tools.map((tool) => (
        <button
          key={tool}
          type="button"
          className="rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
        >
          {tool}
        </button>
      ))}
    </div>
  );
}

export default Toolbar;