import Toolbar from "../layout/Toolbar";

function Canvas() {
  return (
    <section className="relative flex-1 overflow-hidden bg-slate-50">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative flex h-full items-center justify-center p-10">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-semibold text-violet-600">Step 1 of 8</p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            Start with a customer interview
          </h2>

          <p className="mt-4 text-slate-500">
            Import a transcript or connect a meeting so the workspace can
            identify themes, pain points, and opportunities.
          </p>

          <button
            type="button"
            className="mt-8 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            Import interview
          </button>
        </div>
      </div>

      <Toolbar />
    </section>
  );
}

export default Canvas;