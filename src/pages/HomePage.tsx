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
};

function HomePage({ onSelectWorkflow }: HomePageProps) {
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
              onClick={() => onSelectWorkflow(goal)}
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

export default HomePage;