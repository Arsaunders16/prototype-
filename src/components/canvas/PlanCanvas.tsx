import { getPriorityLabel } from "./StickyNote";
import type { Idea } from "./types";

type PlanField =
  | "nextAction"
  | "successSignal";

type PlanCanvasProps = {
  plannedIdeas: Idea[];
  embedded?: boolean;
  onPlanChange?: (
    ideaId: number,
    field: PlanField,
    value: string,
  ) => void;
};

function PlanCanvas({
  plannedIdeas,
  embedded = false,
  onPlanChange,
}: PlanCanvasProps) {
  const isEditable =
    typeof onPlanChange === "function";

  return (
    <div
      className={`relative z-10 h-full overflow-y-auto px-10 pb-32 pt-10 ${
        embedded ? "bg-slate-50" : ""
      }`}
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-500">
            Plan
          </p>

          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Turn priorities into action
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Your highest-priority ideas have been brought
            forward as recommended initiatives.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {plannedIdeas.map((idea, index) => (
            <article
              key={idea.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Initiative {index + 1}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {idea.text}
                  </h3>
                </div>

                <span className="shrink-0 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                  {getPriorityLabel(
                    idea.priority,
                  )}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <label
                    htmlFor={`next-action-${idea.id}`}
                    className="text-xs font-semibold text-slate-500"
                  >
                    Next action
                  </label>

                  <textarea
                    id={`next-action-${idea.id}`}
                    value={idea.nextAction ?? ""}
                    onChange={(event) =>
                      onPlanChange?.(
                        idea.id,
                        "nextAction",
                        event.target.value,
                      )
                    }
                    readOnly={!isEditable}
                    placeholder="Define the next action..."
                    rows={4}
                    className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 read-only:cursor-default read-only:bg-transparent"
                  />
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <label
                    htmlFor={`success-signal-${idea.id}`}
                    className="text-xs font-semibold text-slate-500"
                  >
                    Success signal
                  </label>

                  <textarea
                    id={`success-signal-${idea.id}`}
                    value={
                      idea.successSignal ?? ""
                    }
                    onChange={(event) =>
                      onPlanChange?.(
                        idea.id,
                        "successSignal",
                        event.target.value,
                      )
                    }
                    readOnly={!isEditable}
                    placeholder="Describe how success will be measured..."
                    rows={4}
                    className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 read-only:cursor-default read-only:bg-transparent"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        {plannedIdeas.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="font-semibold text-slate-900">
              No ideas selected yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Return to Prioritize and assign at least
              one idea a high or medium priority.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlanCanvas;