type HeaderProps = {
  workflowName: string;
  onBack: () => void;
};

function Header({ workflowName, onBack }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
          Prototype
        </p>

        <h1 className="text-lg font-semibold text-slate-900">
          {workflowName}
        </h1>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
      >
        Back to workflows
      </button>
    </header>
  );
}

export default Header;