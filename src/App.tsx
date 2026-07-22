import { useState } from "react";

import HomePage from "./pages/HomePage";
import WorkspacePage from "./pages/WorkspacePage";
import type {
  SavedWorkflow,
  WorkflowData,
} from "./components/canvas/workflowData";
import type { WorkflowStep } from "./components/layout/WorkflowSidebar";

type AppView =
  | {
      page: "home";
    }
  | {
      page: "workspace";
      workflowName: string;
      initialStep: WorkflowStep;
      initialWorkflowData?: WorkflowData;
    };





function App() {
  const [view, setView] = useState<AppView>({
    page: "home",
  });

  const [
  completedWorkflows,
  setCompletedWorkflows,
] = useState<SavedWorkflow[]>([]);

  function handleSelectWorkflow(
    workflowName: string,
  ) {
    setView({
      page: "workspace",
      workflowName,
      initialStep: "setup",
    });
  }

  function handleWorkflowCompleted(
    workflowData: WorkflowData,
  ) {
    if (view.page !== "workspace") {
      return;
    }

    const completedWorkflow: SavedWorkflow = {
      id: crypto.randomUUID(),
      title: view.workflowName,
      workflowName: view.workflowName,
      completedDate: new Date().toISOString(),
      data: workflowData,
    };

    setCompletedWorkflows(
      (currentWorkflows) => [
        completedWorkflow,
        ...currentWorkflows,
      ],
    );
  }

  function handleOpenCompletedWorkflow(
  workflow: SavedWorkflow,
) {
  setView({
    page: "workspace",
    workflowName: workflow.workflowName,
    initialStep: "complete",
    initialWorkflowData: workflow.data,
  });
}

  function handleBackToWorkflows() {
    setView({
      page: "home",
    });
  }

  if (view.page === "workspace") {
    return (
      <WorkspacePage
        workflowName={view.workflowName}
        initialStep={view.initialStep}
        initialWorkflowData={
          view.initialWorkflowData
        }
        onWorkflowCompleted={
          handleWorkflowCompleted
        }
        onBack={handleBackToWorkflows}
      />
    );
  }

  return (
    <HomePage
    onSelectWorkflow={handleSelectWorkflow}
    completedWorkflows={completedWorkflows}
    onOpenCompletedWorkflow={handleOpenCompletedWorkflow}
/>
  );
}

export default App;