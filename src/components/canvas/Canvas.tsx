import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import type { WorkflowStep } from "../layout/WorkflowSidebar";
import type { WorkflowData } from "./workflowData";
import type { SetupChoice } from "../workflow/SetupModal";
import BottomControls from "./BottomControls";
import CompleteCanvas from "./CompleteCanvas";
import IdeaCanvas from "./IdeaCanvas";
import PlanCanvas from "./PlanCanvas";
import PresentationCanvas from "./PresentationCanvas";
import ResearchCanvas from "./ResearchCanvas";
import SynthesizeCanvas from "./SynthesizeCanvas";
import type {
  DragState,
  Idea,
  Priority,
} from "./types";
import {
  NOTE_GAP,
  NOTE_HEIGHT,
  NOTE_WIDTH,
} from "./types";

type CanvasProps = {
  setupChoice: SetupChoice | null;
  currentStep: WorkflowStep;
  initialWorkflowData?: WorkflowData;

  onContinueToSynthesize: () => void;
  onBackToResearch: () => void;
  onContinueToBrainstorm: () => void;
  onContinueToPrioritize: () => void;
  onBackToBrainstorm: () => void;
  onContinueToPlan: () => void;
  onBackToPrioritize: () => void;
  onContinueToPresent: () => void;
  onBackToPlan: () => void;
  onCompleteWorkflow: (
  workflowData: WorkflowData,
) => void;

onOpenStep: (
  step: WorkflowStep,
) => void;
};

const INITIAL_PROMPT_IDEAS: Idea[] = [
  {
    id: 1,
    text: "What problem are users trying to solve?",
    x: 0,
    y: 0,
    priority: null,
  },
  {
    id: 2,
    text: "Where does the current experience break down?",
    x: 0,
    y: 0,
    priority: null,
  },
  {
    id: 3,
    text: "What would make this workflow feel effortless?",
    x: 0,
    y: 0,
    priority: null,
  },
];

const GENERATED_IDEA_TEXT = [
  "Add guided starting prompts",
  "Surface templates on the empty canvas",
  "Import notes and interview transcripts",
  "Automatically group related ideas",
  "Generate a first draft from research",
  "Add a guided workflow checklist",
];

function Canvas({
  setupChoice,
  currentStep,
  initialWorkflowData,
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
  onOpenStep,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const noteRefs = useRef<
    Record<number, HTMLTextAreaElement | null>
  >({});

  const [hasStarted, setHasStarted] =
  useState(Boolean(initialWorkflowData));

const [researchText, setResearchText] =
  useState(
    initialWorkflowData?.researchText ?? "",
  );

const [researchFileName, setResearchFileName] =
  useState<string | null>(
    initialWorkflowData?.researchFileName ??
      null,
  );
  const [dragState, setDragState] =
    useState<DragState>(null);

  const [nextIdeaId, setNextIdeaId] =
  useState(
    initialWorkflowData
      ? Math.max(
          0,
          ...initialWorkflowData.ideas.map(
            (idea) => idea.id,
          ),
        ) + 1
      : 4,
  );

  const [ideaToFocus, setIdeaToFocus] =
    useState<number | null>(null);

  const [isDraggingNoteTool, setIsDraggingNoteTool] =
    useState(false);

  const [ideas, setIdeas] = useState<Idea[]>(
  initialWorkflowData?.ideas ??
    INITIAL_PROMPT_IDEAS,
);

  const workspaceStarted =
    currentStep === "research" ||
    currentStep === "synthesize" ||
    hasStarted;

  const isBrainstorming =
    currentStep === "brainstorm";

  const highPriorityIdeas = ideas.filter(
    (idea) => idea.priority === "high",
  );

  const plannedIdeas =
    highPriorityIdeas.length > 0
      ? highPriorityIdeas
      : ideas.filter(
          (idea) => idea.priority !== "low",
        );

  useEffect(() => {
    if (
      ideaToFocus === null ||
      !isBrainstorming
    ) {
      return;
    }

    const textarea =
      noteRefs.current[ideaToFocus];

    if (textarea) {
      textarea.focus();
      textarea.select();
      setIdeaToFocus(null);
    }
  }, [ideaToFocus, ideas, isBrainstorming]);

  useEffect(() => {
    if (!isBrainstorming) {
      setDragState(null);
      setIsDraggingNoteTool(false);
    }
  }, [isBrainstorming]);

  function getCenteredPositions(
    count: number,
  ) {
    const canvas = canvasRef.current;

    const width =
      canvas?.clientWidth ?? 1200;

    const columns = count <= 3 ? count : 3;
    const rows = Math.ceil(count / columns);

    const totalWidth =
      NOTE_WIDTH * columns +
      NOTE_GAP * (columns - 1);

    const totalHeight =
      NOTE_HEIGHT * rows +
      NOTE_GAP * (rows - 1);

    const startingX = Math.max(
      40,
      (width - totalWidth) / 2,
    );

    const canvasHeight =
      canvas?.clientHeight ?? 800;

    const startingY = Math.max(
      130,
      (canvasHeight - totalHeight) / 2 - 20,
    );

    return Array.from(
      { length: count },
      (_, index) => ({
        x:
          startingX +
          (index % columns) *
            (NOTE_WIDTH + NOTE_GAP),
        y:
          startingY +
          Math.floor(index / columns) *
            (NOTE_HEIGHT + NOTE_GAP),
      }),
    );
  }

  function centerInitialIdeas() {
    const positions = getCenteredPositions(
      INITIAL_PROMPT_IDEAS.length,
    );

    setIdeas(
      INITIAL_PROMPT_IDEAS.map(
        (idea, index) => ({
          ...idea,
          x: positions[index].x,
          y: positions[index].y,
        }),
      ),
    );
  }

  function startBrainstorm() {
    setHasStarted(true);

    window.requestAnimationFrame(() => {
      centerInitialIdeas();
    });
  }

  function importResearch(
    text: string,
    fileName: string,
  ) {
    setResearchText(text);
    setResearchFileName(fileName);
    setHasStarted(true);
  }

  function generateBrainstormIdeas() {
    const positions = getCenteredPositions(
      GENERATED_IDEA_TEXT.length,
    );

    const generatedIdeas: Idea[] =
      GENERATED_IDEA_TEXT.map(
        (text, index) => ({
          id: index + 1,
          text,
          x: positions[index].x,
          y: positions[index].y,
          priority: null,
        }),
      );

    setIdeas(generatedIdeas);
    setNextIdeaId(generatedIdeas.length + 1);
    setHasStarted(true);
    onContinueToBrainstorm();
  }

  function handlePointerMove(
    event: PointerEvent<HTMLDivElement>,
  ) {
    if (
      !dragState ||
      !canvasRef.current ||
      !isBrainstorming
    ) {
      return;
    }

    const canvasBounds =
      canvasRef.current.getBoundingClientRect();

    const rawX =
      event.clientX -
      canvasBounds.left -
      dragState.offsetX;

    const rawY =
      event.clientY -
      canvasBounds.top -
      dragState.offsetY;

    const maximumX = Math.max(
      0,
      canvasBounds.width - NOTE_WIDTH,
    );

    const maximumY = Math.max(
      0,
      canvasBounds.height - NOTE_HEIGHT,
    );

    setIdeas((currentIdeas) =>
      currentIdeas.map((idea) =>
        idea.id === dragState.ideaId
          ? {
              ...idea,
              x: Math.min(
                maximumX,
                Math.max(0, rawX),
              ),
              y: Math.min(
                maximumY,
                Math.max(0, rawY),
              ),
            }
          : idea,
      ),
    );
  }

  function handlePointerUp() {
    setDragState(null);
  }

  function getCanvasCenterPosition() {
    const canvas = canvasRef.current;

    if (!canvas) {
      return {
        x: 200,
        y: 200,
      };
    }

    return {
      x: Math.max(
        40,
        canvas.clientWidth / 2 -
          NOTE_WIDTH / 2,
      ),
      y: Math.max(
        140,
        canvas.clientHeight / 2 -
          NOTE_HEIGHT / 2,
      ),
    };
  }

  function keepNoteInsideCanvas(position: {
    x: number;
    y: number;
  }) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return position;
    }

    const maximumX = Math.max(
      0,
      canvas.clientWidth - NOTE_WIDTH,
    );

    const maximumY = Math.max(
      0,
      canvas.clientHeight - NOTE_HEIGHT,
    );

    return {
      x: Math.min(
        maximumX,
        Math.max(0, position.x),
      ),
      y: Math.min(
        maximumY,
        Math.max(0, position.y),
      ),
    };
  }

  function addIdea(position?: {
    x: number;
    y: number;
  }) {
    if (
      !workspaceStarted ||
      !isBrainstorming
    ) {
      return;
    }

    const newIdeaId = nextIdeaId;
    const defaultPosition =
      getCanvasCenterPosition();

    const nextPosition =
      keepNoteInsideCanvas(
        position ?? defaultPosition,
      );

    setIdeas((currentIdeas) => [
      ...currentIdeas,
      {
        id: newIdeaId,
        text: "New idea",
        x: nextPosition.x,
        y: nextPosition.y,
        priority: null,
      },
    ]);

    setNextIdeaId(
      (currentId) => currentId + 1,
    );

    setIdeaToFocus(newIdeaId);
  }

  function addIdeaFromExistingNote(
    idea: Idea,
  ) {
    const canvas = canvasRef.current;

    if (!canvas) {
      addIdea();
      return;
    }

    let nextX =
      idea.x + NOTE_WIDTH + NOTE_GAP;

    let nextY = idea.y;

    if (
      nextX + NOTE_WIDTH >
      canvas.clientWidth
    ) {
      nextX = idea.x;
      nextY =
        idea.y + NOTE_HEIGHT + NOTE_GAP;
    }

    if (
      nextY + NOTE_HEIGHT >
      canvas.clientHeight
    ) {
      const centerPosition =
        getCanvasCenterPosition();

      nextX =
        centerPosition.x +
        ideas.length * 20;

      nextY =
        centerPosition.y +
        ideas.length * 20;
    }

    addIdea({
      x: nextX,
      y: nextY,
    });
  }

  function handleNoteKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>,
    idea: Idea,
  ) {
    if (
      event.key !== "Tab" ||
      !isBrainstorming
    ) {
      return;
    }

    event.preventDefault();
    addIdeaFromExistingNote(idea);
  }

  function handleCanvasDragOver(
    event: DragEvent<HTMLDivElement>,
  ) {
    const hasStickyNote =
      event.dataTransfer.types.includes(
        "application/x-canvas-sticky-note",
      );

    if (
      !hasStickyNote ||
      !workspaceStarted ||
      !isBrainstorming
    ) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDraggingNoteTool(true);
  }

  function handleCanvasDragLeave(
    event: DragEvent<HTMLDivElement>,
  ) {
    const nextTarget =
      event.relatedTarget;

    if (
      nextTarget instanceof Node &&
      event.currentTarget.contains(nextTarget)
    ) {
      return;
    }

    setIsDraggingNoteTool(false);
  }

  function handleCanvasDrop(
    event: DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    setIsDraggingNoteTool(false);

    const draggedItem =
      event.dataTransfer.getData(
        "application/x-canvas-sticky-note",
      );

    if (
      draggedItem !== "sticky-note" ||
      !canvasRef.current ||
      !workspaceStarted ||
      !isBrainstorming
    ) {
      return;
    }

    const canvasBounds =
      canvasRef.current.getBoundingClientRect();

    addIdea({
      x:
        event.clientX -
        canvasBounds.left -
        NOTE_WIDTH / 2,
      y:
        event.clientY -
        canvasBounds.top -
        NOTE_HEIGHT / 2,
    });
  }

  function handleStartDrag(
    event: PointerEvent<HTMLButtonElement>,
    idea: Idea,
  ) {
    const noteBounds =
      event.currentTarget.parentElement?.getBoundingClientRect();

    if (!noteBounds) {
      return;
    }

    event.preventDefault();

    setDragState({
      ideaId: idea.id,
      offsetX:
        event.clientX - noteBounds.left,
      offsetY:
        event.clientY - noteBounds.top,
    });
  }

  function updateIdeaText(
    ideaId: number,
    text: string,
  ) {
    setIdeas((currentIdeas) =>
      currentIdeas.map((idea) =>
        idea.id === ideaId
          ? {
              ...idea,
              text,
            }
          : idea,
      ),
    );
  }
  function updateIdeaPlan(
  ideaId: number,
  field: "nextAction" | "successSignal",
  value: string,
) {
  setIdeas((currentIdeas) =>
    currentIdeas.map((idea) =>
      idea.id === ideaId
        ? {
            ...idea,
            [field]: value,
          }
        : idea,
    ),
  );
}

  function setIdeaPriority(
    ideaId: number,
    priority: Exclude<Priority, null>,
  ) {
    setIdeas((currentIdeas) =>
      currentIdeas.map((idea) =>
        idea.id === ideaId
          ? {
              ...idea,
              priority:
                idea.priority === priority
                  ? null
                  : priority,
            }
          : idea,
      ),
    );
  }
  function handleCompleteWorkflow() {
  const now = new Date().toISOString();

  const workflowData: WorkflowData = {
    researchText,
    researchFileName,
    ideas,
    createdAt:
      initialWorkflowData?.createdAt ?? now,
    updatedAt: now,
  };

  onCompleteWorkflow(workflowData);
}

  function renderBrainstormStartingState() {
    return (
      <div className="relative z-10 flex h-full items-center justify-center p-10">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Brainstorm
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            Start generating ideas
          </h2>

          <p className="mt-4 text-slate-500">
            Begin with an open brainstorming space
            and organize ideas into themes as you go.
          </p>

          <button
            type="button"
            onClick={startBrainstorm}
            className="mt-8 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
          >
            Start brainstorming
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="relative flex-1 overflow-hidden bg-slate-50">
      <div
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDragOver={handleCanvasDragOver}
        onDragLeave={handleCanvasDragLeave}
        onDrop={handleCanvasDrop}
        className={`relative h-full w-full overflow-hidden transition ${
          isDraggingNoteTool
            ? "bg-amber-50"
            : "bg-transparent"
        }`}
      >
        {currentStep !== "complete" && (
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        )}

        {isDraggingNoteTool && (
          <div className="pointer-events-none absolute inset-4 z-20 rounded-3xl border-2 border-dashed border-amber-400" />
        )}

        {currentStep === "research" && (
          <ResearchCanvas
            researchText={researchText}
            fileName={researchFileName}
            onImport={importResearch}
          />
        )}

        {currentStep === "synthesize" && (
          <SynthesizeCanvas
            researchText={researchText}
          />
        )}

        {currentStep === "brainstorm" &&
          !hasStarted &&
          setupChoice === "brainstorm" &&
          renderBrainstormStartingState()}

        {hasStarted &&
          (currentStep === "brainstorm" ||
            currentStep === "prioritize") && (
            <IdeaCanvas
              ideas={ideas}
              mode={
                currentStep === "brainstorm"
                  ? "brainstorm"
                  : "prioritize"
              }
              interactive
              textareaRefs={noteRefs}
              onStartDrag={handleStartDrag}
              onTextChange={updateIdeaText}
              onKeyDown={handleNoteKeyDown}
              onPriorityChange={
                setIdeaPriority
              }
            />
          )}

        {hasStarted &&
          currentStep === "plan" && (
            <PlanCanvas
              plannedIdeas={plannedIdeas}
              onPlanChange={updateIdeaPlan}
            />
          )}

        {hasStarted &&
          currentStep === "present" && (
            <PresentationCanvas
              ideas={ideas}
              plannedIdeas={plannedIdeas}
            />
          )}

        {hasStarted &&
          currentStep === "complete" && (
            <CompleteCanvas
  researchText={researchText}
  researchFileName={researchFileName}
  ideas={ideas}
  plannedIdeas={plannedIdeas}
  onOpenStep={onOpenStep}
/>
          )}
      </div>

      <BottomControls
        currentStep={currentStep}
        workspaceStarted={workspaceStarted}
        researchReady={
          researchText.trim().length > 0
        }
        onAddNote={() => addIdea()}
        onContinueToSynthesize={
          onContinueToSynthesize
        }
        onBackToResearch={onBackToResearch}
        onContinueToBrainstorm={
          generateBrainstormIdeas
        }
        onContinueToPrioritize={
          onContinueToPrioritize
        }
        onBackToBrainstorm={
          onBackToBrainstorm
        }
        onContinueToPlan={onContinueToPlan}
        onBackToPrioritize={
          onBackToPrioritize
        }
        onContinueToPresent={
          onContinueToPresent
        }
        onBackToPlan={onBackToPlan}
onCompleteWorkflow={
  handleCompleteWorkflow
}
      />
    </section>
  );
}

export default Canvas;