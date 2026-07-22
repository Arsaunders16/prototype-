import { getPriorityLabel } from "./StickyNote";
import type { Idea } from "./types";

type PresentationCanvasProps = {
  ideas: Idea[];
  plannedIdeas: Idea[];
  embedded?: boolean;
};

function PresentationCanvas({
  ideas,
  plannedIdeas,
  embedded = false,
}: PresentationCanvasProps) {
  const highPriorityCount = ideas.filter(
    (idea) => idea.priority === "high",
  ).length;

  return (
    <div
      className={`relative z-10 h-full overflow-y-auto px-10 pb-32 pt-10 ${
        embedded ? "bg-slate-50" : ""
      }`}
    >
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="bg-slate-900 px-10 py-12 text-white">
            <p className="text-sm font-semibold text-slate-300">
              Product discovery recommendation
            </p>

            <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight">
              A prioritized direction for improving the
              customer experience
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              This summary brings together the strongest
              opportunities identified during the guided
              workflow.
            </p>
          </div>

          <div className="grid gap-8 p-10 lg:grid-cols-[1fr_280px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Recommended initiatives
              </p>

              <div className="mt-5 space-y-4">
                {plannedIdeas.map((idea, index) => (
                  <div
                    key={idea.id}
                    className="flex gap-4 rounded-2xl border border-slate-200 p-5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                      {index + 1}
                    </span>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {idea.text}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {getPriorityLabel(
                          idea.priority,
                        )}
                      </p>
                    </div>
                  </div>
                ))}

                {plannedIdeas.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                    No initiatives have been selected.
                  </p>
                )}
              </div>
            </div>

            <aside className="rounded-2xl bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Workflow summary
              </p>

              <dl className="mt-5 space-y-5">
                <div>
                  <dt className="text-sm text-slate-500">
                    Ideas generated
                  </dt>

                  <dd className="mt-1 text-2xl font-semibold text-slate-900">
                    {ideas.length}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-500">
                    High priority
                  </dt>

                  <dd className="mt-1 text-2xl font-semibold text-slate-900">
                    {highPriorityCount}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-500">
                    Recommended
                  </dt>

                  <dd className="mt-1 text-2xl font-semibold text-slate-900">
                    {plannedIdeas.length}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresentationCanvas;
