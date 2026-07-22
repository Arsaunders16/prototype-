export type SetupChoice =
  | "transcript"
  | "meeting"
  | "brainstorm"
  | "existing-board";

type SetupModalProps = {
  workflowName: string;
  onContinue: (choice: SetupChoice) => void;
  onBack: () => void;
};

type SetupOption = {
  id: SetupChoice;
  title: string;
  description: string;
};

const options: SetupOption[] = [
  {
    id: "transcript",
    title: "Import an interview transcript",
    description:
      "Upload an existing customer conversation and extract insights.",
  },
  {
    id: "meeting",
    title: "Connect a recorded meeting",
    description:
      "Bring in a Zoom or meeting recording for AI synthesis.",
  },
  {
    id: "brainstorm",
    title: "Start with brainstorming",
    description:
      "Skip the research import and begin generating ideas.",
  },
  {
    id: "existing-board",
    title: "Start from an existing board",
    description:
      "Import existing notes, research, or workshop material.",
  },
];

function SetupModal({
  workflowName,
  onContinue,
  onBack,
}: SetupModalProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/20 p-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Back to workflows
        </button>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
          {workflowName}
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Let’s set up your workspace
        </h2>

        <p className="mt-3 text-slate-600">
          Choose how you want to begin. We’ll prepare the
          right starting point on the canvas.
        </p>

        <div className="mt-8 space-y-3">
          {options.map((option, index) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onContinue(option.id)}
              className="flex w-full items-start gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-violet-300 hover:bg-violet-50/50"
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
    </div>
  );
}

export default SetupModal;