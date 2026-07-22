import { useState } from "react";

import Canvas from "../components/canvas/Canvas";
import type { WorkflowData } from "../components/canvas/workflowData";
import Header from "../components/layout/Header";
import WorkflowSidebar, {
  type WorkflowStep,
} from "../components/layout/WorkflowSidebar";
import SetupModal, {
  type SetupChoice,
} from "../components/workflow/SetupModal";

type WorkspacePageProps = {
  workflowName: string;
  onBack: () => void;
  initialStep?: WorkflowStep;
  initialWorkflowData?: WorkflowData;
  onWorkflowCompleted: (
    workflowData: WorkflowData,
  ) => void;
};

function WorkspacePage({
  workflowName,
  onBack,
  initialStep = "setup",
  initialWorkflowData,
  onWorkflowCompleted,
}: WorkspacePageProps) {
  const isOpeningCompletedWorkflow =
    initialStep === "complete" &&
    Boolean(initialWorkflowData);

  const [showSetup, setShowSetup] = useState(
    initialStep === "setup",
  );

  const [setupChoice, setSetupChoice] =
    useState<SetupChoice | null>(
      isOpeningCompletedWorkflow
        ? "research"
        : null,
    );

  const [currentStep, setCurrentStep] =
    useState<WorkflowStep>(initialStep);

  function handleSetupChoice(
    choice: SetupChoice,
  ) {
    setSetupChoice(choice);
    setShowSetup(false);

    if (choice === "brainstorm") {
      setCurrentStep("brainstorm");
      return;
    }

    setCurrentStep("research");
  }

  function handleWorkflowCompleted(
    workflowData: WorkflowData,
  ) {
    onWorkflowCompleted(workflowData);
    setCurrentStep("complete");
  }

  return (
    <main className="relative flex h-screen flex-col overflow-hidden bg-slate-100">
      <Header
        workflowName={workflowName}
        onBack={onBack}
      />

      <div className="flex min-h-0 flex-1">
        <WorkflowSidebar
          currentStep={currentStep}
        />

        <Canvas
          setupChoice={setupChoice}
          currentStep={currentStep}
          initialWorkflowData={
            initialWorkflowData
          }
          onContinueToSynthesize={() =>
            setCurrentStep("synthesize")
          }
          onBackToResearch={() =>
            setCurrentStep("research")
          }
          onContinueToBrainstorm={() =>
            setCurrentStep("brainstorm")
          }
          onContinueToPrioritize={() =>
            setCurrentStep("prioritize")
          }
          onBackToBrainstorm={() =>
            setCurrentStep("brainstorm")
          }
          onContinueToPlan={() =>
            setCurrentStep("plan")
          }
          onBackToPrioritize={() =>
            setCurrentStep("prioritize")
          }
          onContinueToPresent={() =>
            setCurrentStep("present")
          }
          onBackToPlan={() =>
            setCurrentStep("plan")
          }
          onCompleteWorkflow={
            handleWorkflowCompleted
          }
         
          onOpenStep={setCurrentStep}
        />
      </div>

      {showSetup && (
        <SetupModal
          workflowName={workflowName}
          onBack={onBack}
          onContinue={handleSetupChoice}
        />
      )}
    </main>
  );
}

export default WorkspacePage;