import Canvas from "../components/canvas/Canvas";
import Header from "../components/layout/Header";
import WorkflowSidebar from "../components/layout/WorkflowSidebar";

type WorkspacePageProps = {
  workflowName: string;
  onBack: () => void;
};

function WorkspacePage({ workflowName, onBack }: WorkspacePageProps) {
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-slate-100">
      <Header workflowName={workflowName} onBack={onBack} />

      <div className="flex min-h-0 flex-1">
        <WorkflowSidebar />
        <Canvas />
      </div>
    </main>
  );
}

export default WorkspacePage;