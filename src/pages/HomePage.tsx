import type { SavedWorkflow } from "../components/canvas/workflowData";

const goals = [
  "Product Discovery",
  "Sprint Planning",
  "Customer Interview",
  "Roadmapping",
  "Retrospective",
  "User Journey Mapping",
];

type HomePageProps = {
  onSelectWorkflow: (workflow: string) => void;
  completedWorkflows: SavedWorkflow[];
  onOpenCompletedWorkflow: (
    workflow: SavedWorkflow,
  ) => void;
};

function StepPreview({
  number,
  label,
}: {
  number: number;
  label: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
        {number}
      </span>

      <span className="truncate text-sm font-medium text-slate-600">
        {label}
      </span>
    </div>
  );
}

function Metric({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div>
      <p className="text-xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>
    </div>
  );
}

function formatCompletedDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function HomePage({
  onSelectWorkflow,
  completedWorkflows,
  onOpenCompletedWorkflow,
}: HomePageProps) {
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
          Choose a workflow and we’ll guide you from
          idea to execution.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() =>
                onSelectWorkflow(goal)
              }
              className="group min-h-36 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {goal}
              </h2>

              <p className="mt-3 text-slate-500 transition group-hover:text-violet-600">
                Start this workflow →
              </p>
            </button>
          ))}
        </div>

        <section className="mt-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Previous work
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Completed workflows
              </h2>

              <p className="mt-2 text-slate-600">
                Revisit the final board from a completed
                workflow.
              </p>
            </div>

            <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-500">
              {completedWorkflows.length} completed
            </span>
          </div>

          {completedWorkflows.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                No completed workflows yet
              </h3>

              <p className="mt-2 text-slate-500">
                Complete your first workflow and it will
                appear here.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {completedWorkflows.map((workflow) => {
                const ideas = workflow.data?.ideas ?? [];

                const prioritizedIdeas =
                  ideas.filter(
                    (idea) =>
                      idea.priority !== null,
                  );

                const highPriorityIdeas =
                  ideas.filter(
                    (idea) =>
                      idea.priority === "high",
                  );

                const plannedIdeas =
                  highPriorityIdeas.length > 0
                    ? highPriorityIdeas
                    : ideas.filter(
                        (idea) =>
                          idea.priority !== "low",
                      );

                return (
                  <button
                    key={workflow.id}
                    type="button"
                    onClick={() =>
                      onOpenCompletedWorkflow(
                        workflow,
                      )
                    }
                    className="group w-full overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
                  >
                    <div className="grid lg:grid-cols-[1fr_300px]">
                      <div className="p-7 sm:p-9">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
                            Completed
                          </span>

                          <span className="text-sm font-medium text-slate-400">
                            {formatCompletedDate(
                              workflow.completedDate,
                            )}
                          </span>
                        </div>

                        <h3 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">
                          {workflow.title}
                        </h3>

                        <p className="mt-2 text-base font-medium text-violet-600">
                          {workflow.workflowName}
                        </p>

                        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-hidden="true"
                              className="h-5 w-5"
                            >
                              <path
                                d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinejoin="round"
                              />

                              <path
                                d="M14 3v5h4M9 12h6M9 16h6"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>

                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Research source
                            </p>

                            <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">
                              {workflow.data?.researchFileName ??
                                 "No research file"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-7 grid gap-4 rounded-2xl border border-slate-100 p-5 sm:grid-cols-3 lg:grid-cols-6">
                          <StepPreview
                            number={1}
                            label="Research"
                          />

                          <StepPreview
                            number={2}
                            label="Synthesize"
                          />

                          <StepPreview
                            number={3}
                            label="Brainstorm"
                          />

                          <StepPreview
                            number={4}
                            label="Prioritize"
                          />

                          <StepPreview
                            number={5}
                            label="Plan"
                          />

                          <StepPreview
                            number={6}
                            label="Present"
                          />
                        </div>

                        <div className="mt-7 grid grid-cols-2 gap-6 border-t border-slate-100 pt-7 sm:grid-cols-4">
                          <Metric
                            value={
                              workflow.data?.researchText?.trim().length > 0
                                ? 6
                                : 0
                            }
                            label="Insights"
                          />

                          <Metric
                            value={ideas.length}
                            label="Ideas"
                          />

                          <Metric
                            value={
                              prioritizedIdeas.length
                            }
                            label="Prioritized"
                          />

                          <Metric
                            value={
                              plannedIdeas.length
                            }
                            label="Planned"
                          />
                        </div>
                      </div>

                      <div className="flex min-h-64 flex-col justify-between border-t border-slate-200 bg-slate-950 p-7 text-white sm:p-9 lg:border-l lg:border-t-0">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
                            Final board
                          </p>

                          <h4 className="mt-4 text-2xl font-bold leading-tight">
                            From customer research to an
                            actionable product plan.
                          </h4>

                          <p className="mt-4 leading-7 text-slate-300">
                            Review every step of the
                            completed workflow on one
                            connected canvas.
                          </p>
                        </div>

                        <div className="mt-10 flex items-center justify-between">
                          <span className="font-semibold text-white">
                            Open completed board
                          </span>

                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-slate-950 transition group-hover:translate-x-1">
                            →
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default HomePage;