import { useState } from "react";

const goals = [
  "Product Discovery",
  "Sprint Planning",
  "Customer Interview",
  "Roadmapping",
  "Retrospective",
  "User Journey Mapping",
];

function App() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  if (selectedWorkflow) {
    return (
      <main className="flex min-h-screen flex-col bg-slate-100">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
              Prototype
            </p>
            <h1 className="text-lg font-semibold text-slate-900">
              {selectedWorkflow}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setSelectedWorkflow(null)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Back to workflows
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-72 border-r border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">
              Your workflow
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Import interview",
                "Synthesize insights",
                "Brainstorm ideas",
                "Prioritize",
                "Create Jira tickets",
                "Draft PRD",
                "Build roadmap",
                "Create presentation",
              ].map((step, index) => (
                <button
                  key={step}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm text-slate-600 transition hover:bg-slate-50"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                    {index + 1}
                  </span>
                  {step}
                </button>
              ))}
            </div>
          </aside>

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
                <p className="text-sm font-semibold text-violet-600">
                  Step 1 of 8
                </p>

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

            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              {["Select", "Note", "Text", "Frame", "Zoom"].map((tool) => (
                <button
                  key={tool}
                  type="button"
                  className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                >
                  {tool}
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
          Prototype
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          What are you trying to accomplish today?
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Choose a workflow and we’ll guide you from idea to execution.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => setSelectedWorkflow(goal)}
              className="min-h-36 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold text-slate-900">{goal}</h2>

              <p className="mt-3 text-slate-500">Start this workflow →</p>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;