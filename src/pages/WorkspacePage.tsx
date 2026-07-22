import { useState } from "react";

import Canvas from "../components/canvas/Canvas";
import Header from "../components/layout/Header";
import WorkflowSidebar from "../components/layout/WorkflowSidebar";
import SetupModal from "../components/workflow/SetupModal";

type WorkspacePageProps = {
  workflowName: string;
  onBack: () => void;
};

function WorkspacePage({ workflowName, onBack }: WorkspacePageProps) {
  const [showSetup, setShowSetup] = useState(true);

  return (
    <main className="relative flex h-screen flex-col overflow-hidden bg-slate-100">
      <Header workflowName={workflowName} onBack={onBack} />

      <div className="flex min-h-0 flex-1">
        <WorkflowSidebar />
        <Canvas />
      </div>

      {showSetup && (
        <SetupModal
          workflowName={workflowName}
          onBack={onBack}
          onContinue={() => setShowSetup(false)}
        />
      )}
    </main>
  );
}

export default WorkspacePage;