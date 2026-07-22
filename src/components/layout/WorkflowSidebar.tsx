export type WorkflowStep =
  | "setup"
  | "research"
  | "synthesize"
  | "brainstorm"
  | "prioritize"
  | "plan"
  | "present"
  | "complete";

type WorkflowSidebarProps = {
  currentStep: WorkflowStep;
};

type Step = {
  id: WorkflowStep;
  number: number;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    id: "setup",
    number: 1,
    title: "Setup",
    description: "Choose how to begin",
  },
  {
    id: "research",
    number: 2,
    title: "Gather research",
    description: "Bring in customer context",
  },
  {
    id: "synthesize",
    number: 3,
    title: "Synthesize",
    description: "Find patterns and insights",
  },
  {
    id: "brainstorm",
    number: 4,
    title: "Brainstorm",
    description: "Generate opportunities",
  },
  {
    id: "prioritize",
    number: 5,
    title: "Prioritize",
    description: "Decide what to pursue",
  },
  {
    id: "plan",
    number: 6,
    title: "Plan",
    description: "Turn priorities into action",
  },
  {
    id: "present",
    number: 7,
    title: "Present",
    description: "Share the recommended direction",
  },
  {
    id: "complete",
    number: 8,
    title: "Complete",
    description: "Review the full workflow",
  },
];

function WorkflowSidebar({
  currentStep,
}: WorkflowSidebarProps) {
  const currentStepIndex = steps.findIndex(
    (step) => step.id === currentStep,
  );

  return (
    <aside className="w-72 shrink-0 overflow-y-auto border-r border-slate-200 bg-white px-6 py-7">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Guided workflow
        </p>

        <h2 className="mt-2 text-lg font-semibold text-slate-900">
          Product discovery
        </h2>

        <p className="mt-1 text-sm leading-5 text-slate-500">
          Move from customer context to a clear,
          presentable direction.
        </p>
      </div>

      <ol>
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isComplete =
            index < currentStepIndex;
          const isLast =
            index === steps.length - 1;

          return (
            <li
              key={step.id}
              className="relative flex gap-4"
            >
              <div className="relative flex w-8 shrink-0 justify-center">
                {!isLast && (
                  <div
                    className={`absolute left-1/2 top-8 h-[calc(100%-4px)] w-px -translate-x-1/2 ${
                      isComplete
                        ? "bg-emerald-300"
                        : "bg-slate-200"
                    }`}
                  />
                )}

                <div
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : isComplete
                        ? "bg-emerald-500 text-white"
                        : "border border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  {isComplete ? "✓" : step.number}
                </div>
              </div>

              <div
                className={`mb-6 min-w-0 flex-1 rounded-xl px-3 py-2.5 ${
                  isActive
                    ? "bg-slate-100"
                    : "bg-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-semibold ${
                      isActive
                        ? "text-slate-950"
                        : isComplete
                          ? "text-slate-700"
                          : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </p>

                  {isActive && (
                    <span
                      className="h-2 w-2 rounded-full bg-amber-400"
                      aria-label="Current step"
                    />
                  )}
                </div>

                <p
                  className={`mt-1 text-xs leading-4 ${
                    isActive
                      ? "text-slate-600"
                      : isComplete
                        ? "text-slate-500"
                        : "text-slate-400"
                  }`}
                >
                  {step.description}
                </p>

                {isActive && (
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Current step
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

export default WorkflowSidebar;
