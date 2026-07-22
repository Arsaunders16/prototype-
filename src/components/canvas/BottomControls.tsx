import { useState, type ReactNode } from "react";
import Toolbar from "../layout/Toolbar";
import type { WorkflowStep } from "../layout/WorkflowSidebar";
import BottomBar from "./BottomBar";

type BottomControlsProps = {
  currentStep: WorkflowStep;
  workspaceStarted: boolean;
  researchReady: boolean;
  onAddNote: () => void;
  onContinueToSynthesize: () => void;
  onBackToResearch: () => void;
  onContinueToBrainstorm: () => void;
  onContinueToPrioritize: () => void;
  onBackToBrainstorm: () => void;
  onContinueToPlan: () => void;
  onBackToPrioritize: () => void;
  onContinueToPresent: () => void;
  onBackToPlan: () => void;
  onCompleteWorkflow: () => void;
  onBackToPresent: () => void;
};

type PresentationTool =
  | "pointer"
  | "pen"
  | "highlighter"
  | "arrow"
  | "text";

type PresentationToolOption = {
  id: PresentationTool;
  label: string;
  icon: ReactNode;
};

const navigationButton =
  "flex h-14 min-w-52 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold shadow-lg transition";

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path
        d="M19 12H5m6-6-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PointerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M6.4 3.8 18 12.1l-5.2 1.1 3 5-2.6 1.5-3-5-3.4 4.1-.4-15Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="m14.5 5.5 4 4M4 20l4.2-1 10.7-10.7a1.8 1.8 0 0 0 0-2.6l-.6-.6a1.8 1.8 0 0 0-2.6 0L5 15.8 4 20Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HighlighterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="m14.8 4.2 5 5-8.7 8.7H6.2l-2-2 10.6-11.7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 20h13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AnnotationArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M5 19 19 5m-7 0h7v7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M5 6V4h14v2M12 4v16m-4 0h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="m8 7-4 4 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 11h8a6 6 0 0 1 6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StatusPill({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-14 items-center rounded-2xl border border-emerald-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-lg">
      <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
        <CheckIcon />
      </span>

      {children}
    </div>
  );
}

function PresentationToolbar() {
  const [activeTool, setActiveTool] =
    useState<PresentationTool>("pointer");

  const tools: PresentationToolOption[] = [
    {
      id: "pointer",
      label: "Pointer",
      icon: <PointerIcon />,
    },
    {
      id: "pen",
      label: "Pen",
      icon: <PenIcon />,
    },
    {
      id: "highlighter",
      label: "Highlighter",
      icon: <HighlighterIcon />,
    },
    {
      id: "arrow",
      label: "Arrow",
      icon: <AnnotationArrowIcon />,
    },
    {
      id: "text",
      label: "Text",
      icon: <TextIcon />,
    },
  ];

  return (
    <div
      className="flex h-14 items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg"
      role="toolbar"
      aria-label="Presentation tools"
    >
      {tools.map((tool) => {
        const isActive = activeTool === tool.id;

        return (
          <button
            key={tool.id}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            aria-pressed={isActive}
            onClick={() => setActiveTool(tool.id)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
              isActive
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {tool.icon}
          </button>
        );
      })}

      <div
        aria-hidden="true"
        className="mx-1 h-6 w-px bg-slate-200"
      />

      <button
        type="button"
        disabled
        title="Undo"
        aria-label="Undo"
        className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-xl text-slate-300"
      >
        <UndoIcon />
      </button>
    </div>
  );
}

function BottomControls({
  currentStep,
  workspaceStarted,
  researchReady,
  onAddNote,
  onContinueToSynthesize,
  onBackToResearch,
  onContinueToBrainstorm,
  onContinueToPrioritize,
  onBackToBrainstorm,
  onContinueToPlan,
  onBackToPrioritize,
  onContinueToPresent,
  onBackToPlan,
  onCompleteWorkflow,
  onBackToPresent,
}: BottomControlsProps) {
  if (!workspaceStarted) {
    return null;
  }

  if (currentStep === "research") {
    return (
      <BottomBar
        center={
          <StatusPill>
            {researchReady
              ? "Research imported"
              : "Import a text file"}
          </StatusPill>
        }
        right={
          <button
            type="button"
            disabled={!researchReady}
            onClick={onContinueToSynthesize}
            className={`${navigationButton} ${
              researchReady
                ? "bg-slate-900 text-white hover:bg-slate-700"
                : "cursor-not-allowed bg-slate-200 text-slate-400 shadow-none"
            }`}
          >
            Continue to synthesize
            <ArrowRightIcon />
          </button>
        }
      />
    );
  }

  if (currentStep === "synthesize") {
    return (
      <BottomBar
        left={
          <button
            type="button"
            onClick={onBackToResearch}
            className={`${navigationButton} border border-slate-200 bg-white text-slate-700 hover:bg-slate-100`}
          >
            <ArrowLeftIcon />
            Back to research
          </button>
        }
        center={<StatusPill>6 insights identified</StatusPill>}
        right={
          <button
            type="button"
            onClick={onContinueToBrainstorm}
            className={`${navigationButton} bg-slate-900 text-white hover:bg-slate-700`}
          >
            Generate brainstorm
            <ArrowRightIcon />
          </button>
        }
      />
    );
  }

  if (currentStep === "brainstorm") {
    return (
      <BottomBar
        left={
          <button
            type="button"
            disabled
            className={`${navigationButton} cursor-not-allowed border border-slate-200 bg-white text-slate-300`}
          >
            <ArrowLeftIcon />
            Back
          </button>
        }
        center={
          <Toolbar
            noteEnabled
            onAddNote={onAddNote}
          />
        }
        right={
          <button
            type="button"
            onClick={onContinueToPrioritize}
            className={`${navigationButton} bg-slate-900 text-white hover:bg-slate-700`}
          >
            Continue to prioritize
            <ArrowRightIcon />
          </button>
        }
      />
    );
  }

  if (currentStep === "prioritize") {
    return (
      <BottomBar
        left={
          <button
            type="button"
            onClick={onBackToBrainstorm}
            className={`${navigationButton} border border-slate-200 bg-white text-slate-700 hover:bg-slate-100`}
          >
            <ArrowLeftIcon />
            Back to brainstorm
          </button>
        }
        center={
          <div className="flex h-14 items-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-500 shadow-lg">
            Assign priorities
          </div>
        }
        right={
          <button
            type="button"
            onClick={onContinueToPlan}
            className={`${navigationButton} bg-slate-900 text-white hover:bg-slate-700`}
          >
            Continue to plan
            <ArrowRightIcon />
          </button>
        }
      />
    );
  }

  if (currentStep === "plan") {
    return (
      <BottomBar
        left={
          <button
            type="button"
            onClick={onBackToPrioritize}
            className={`${navigationButton} border border-slate-200 bg-white text-slate-700 hover:bg-slate-100`}
          >
            <ArrowLeftIcon />
            Back to prioritize
          </button>
        }
        center={<StatusPill>Plan created</StatusPill>}
        right={
          <button
            type="button"
            onClick={onContinueToPresent}
            className={`${navigationButton} bg-slate-900 text-white hover:bg-slate-700`}
          >
            Continue to present
            <ArrowRightIcon />
          </button>
        }
      />
    );
  }

  if (currentStep === "present") {
    return (
      <BottomBar
        left={
          <button
            type="button"
            onClick={onBackToPlan}
            className={`${navigationButton} border border-slate-200 bg-white text-slate-700 hover:bg-slate-100`}
          >
            <ArrowLeftIcon />
            Back to plan
          </button>
        }
        center={<StatusPill>Ready to present</StatusPill>}
        right={
          <button
            type="button"
            onClick={onCompleteWorkflow}
            className={`${navigationButton} bg-slate-900 text-white hover:bg-slate-700`}
          >
            Complete workflow
            <ArrowRightIcon />
          </button>
        }
      />
    );
  }

  if (currentStep === "complete") {
  return (
    <BottomBar
      center={<PresentationToolbar />}
    />
  );
}

  return null;
}

export default BottomControls;