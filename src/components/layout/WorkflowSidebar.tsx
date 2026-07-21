const workflowSteps = [
  "Import interview",
  "Synthesize insights",
  "Brainstorm ideas",
  "Prioritize",
  "Create Jira tickets",
  "Draft PRD",
  "Build roadmap",
  "Create presentation",
];

function WorkflowSidebar() {
  return (
    <aside className="w-72 shrink-0 border-r border-slate-200 bg-white p-5">
      <p className="text-sm font-semibold text-slate-900">Your workflow</p>

      <div className="mt-6 space-y-3">
        {workflowSteps.map((step, index) => (
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
  );
}

export default WorkflowSidebar;