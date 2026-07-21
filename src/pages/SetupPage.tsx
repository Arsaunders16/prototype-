type SetupPageProps = {
  workflowName: string;
  onContinue: () => void;
  onBack: () => void;
};

function SetupPage({
  workflowName,
  onContinue,
  onBack,
}: SetupPageProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Back to workflows
        </button>

        <p className="mt-12 text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
          {workflowName}
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
          Let’s set up your workspace
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Tell us how you want to begin. We’ll use your answers to prepare the
          right starting point on the canvas.
        </p>

        <div className="mt-10 space-y-4">
          {[
            {
              title: "Import an interview transcript",
              description:
                "Upload an existing customer conversation and extract insights.",
            },
            {
              title: "Connect a recorded meeting",
              description:
                "Bring in a Zoom or meeting recording for AI synthesis.",
            },
            {
              title: "Start with brainstorming",
              description:
                "Skip the research import and begin generating ideas.",
            },
            {
              title: "Start from an existing board",
              description:
                "Import existing notes, research, or workshop material.",
            },
          ].map((option, index) => (
            <button
              key={option.title}
              type="button"
              onClick={onContinue}
              className="flex w-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-violet-300 hover:shadow-md"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                {index + 1}
              </span>

              <span>
                <span className="block font-semibold text-slate-900">
                  {option.title}
                </span>

                <span className="mt-1 block text-sm leading-6 text-slate-500">
                  {option.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default SetupPage;