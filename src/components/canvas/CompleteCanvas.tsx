import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";

import PlanCanvas from "./PlanCanvas";
import PresentationCanvas from "./PresentationCanvas";
import type { WorkflowStep } from "../layout/WorkflowSidebar";
import type { Idea } from "./types";

type CompleteCanvasProps = {
  researchText: string;
  researchFileName: string | null;
  ideas: Idea[];
  plannedIdeas: Idea[];
  onOpenStep: (step: WorkflowStep) => void;
};

type ViewState = {
  x: number;
  y: number;
  zoom: number;
};

type PanState = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
} | null;

type SynthesisInsight = {
  id: number;
  category:
    | "Theme"
    | "Pain point"
    | "Opportunity";
  title: string;
  description: string;
};

const STAGE_WIDTH = 1200;
const STAGE_HEIGHT = 760;
const STAGE_GAP = 140;
const BOARD_PADDING = 70;
const STAGE_TOP = 90;
const STAGE_COUNT = 6;

const BOARD_WIDTH =
  BOARD_PADDING * 2 +
  STAGE_WIDTH * STAGE_COUNT +
  STAGE_GAP * (STAGE_COUNT - 1);

const BOARD_HEIGHT = 900;

const MIN_ZOOM = 0.08;
const MAX_ZOOM = 1.5;

const SYNTHESIS_INSIGHTS: SynthesisInsight[] = [
  {
    id: 1,
    category: "Theme",
    title: "Blank canvas anxiety",
    description:
      "New users are unsure what to create or how to structure their first board.",
  },
  {
    id: 2,
    category: "Theme",
    title: "Poor template discovery",
    description:
      "Templates reduce uncertainty, but most new users never find them.",
  },
  {
    id: 3,
    category: "Pain point",
    title: "Unclear first action",
    description:
      "Users enter the workspace without a clear prompt or recommended next step.",
  },
  {
    id: 4,
    category: "Pain point",
    title: "Manual organization",
    description:
      "Turning raw notes into themes, priorities, and action items takes too much effort.",
  },
  {
    id: 5,
    category: "Opportunity",
    title: "Import existing research",
    description:
      "Let users begin with notes and transcripts instead of starting from an empty canvas.",
  },
  {
    id: 6,
    category: "Opportunity",
    title: "Guided workflow",
    description:
      "Guide users from research through synthesis, ideation, prioritization, and planning.",
  },
];

function clampZoom(value: number) {
  return Math.min(
    MAX_ZOOM,
    Math.max(MIN_ZOOM, value),
  );
}



function categoryClasses(
  category: SynthesisInsight["category"],
) {
  if (category === "Theme") {
    return {
      card: "border-amber-200 bg-amber-50",
      badge: "bg-amber-100 text-amber-800",
    };
  }

  if (category === "Pain point") {
    return {
      card: "border-rose-200 bg-rose-50",
      badge: "bg-rose-100 text-rose-800",
    };
  }

  return {
    card: "border-emerald-200 bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-800",
  };
}

function EditStepIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
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

function StageLabel({
  number,
  title,
  step,
  onOpenStep,
}: {
  number: number;
  title: string;
  step: WorkflowStep;
  onOpenStep: (step: WorkflowStep) => void;
}) {
  return (
    <div className="absolute left-7 right-7 top-6 z-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
          {number}
        </span>

        <span className="text-lg font-semibold text-slate-900">
          {title}
        </span>
      </div>

      <button
        type="button"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => onOpenStep(step)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
      >
        <EditStepIcon />
        Edit step
      </button>
    </div>
  );
}

function ResearchSnapshot({
  researchText,
  researchFileName,
  onOpenStep,
}: {
  researchText: string;
  researchFileName: string | null;
  onOpenStep: (step: WorkflowStep) => void;
}) {
  const fallbackText =
    "No research file was imported for this workflow.";

  return (
    <div className="relative h-full bg-slate-50 px-14 pb-12 pt-24">
      <StageLabel
        number={1}
        title="Research"
        step="research"
        onOpenStep={onOpenStep}
      />

      <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg">
        <header className="flex items-center gap-4 border-b border-slate-200 px-7 py-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="h-6 w-6"
            >
              <path
                d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />

              <path
                d="M14 3v5h4M9 12h6M9 16h6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <div>
            <p className="text-sm font-semibold text-indigo-600">
              Imported source
            </p>

            <h3 className="mt-1 text-xl font-semibold text-slate-900">
              {researchFileName ??
                "Research notes"}
            </h3>
          </div>
        </header>

        <div
           data-stage-scroll
            onPointerDown={(event) =>
            event.stopPropagation()
                  }
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-8"
        >
          <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700">
            {researchText.trim()
              ? researchText
              : fallbackText}
          </p>
        </div>

        <footer className="border-t border-slate-100 px-8 py-4 text-sm font-medium text-slate-400">
          {researchText.length.toLocaleString()}{" "}
          characters imported
        </footer>
      </div>
    </div>
  );
}

function SynthesisSnapshot({
  onOpenStep,
}: {
  onOpenStep: (step: WorkflowStep) => void;
}) {
  const positions = [
    { left: 92, top: 160 },
    { left: 445, top: 142 },
    { left: 798, top: 164 },
    { left: 74, top: 424 },
    { left: 432, top: 444 },
    { left: 790, top: 414 },
  ];

  return (
    <div className="relative h-full bg-slate-50">
      <StageLabel
        number={2}
        title="Synthesize"
        step="synthesize"
        onOpenStep={onOpenStep}
      />

      <div className="absolute left-7 top-[70px]">
        <p className="text-sm text-slate-500">
          Themes, pain points, and opportunities
          identified from the research
        </p>
      </div>

      {SYNTHESIS_INSIGHTS.map(
        (insight, index) => {
          const styles = categoryClasses(
            insight.category,
          );

          return (
            <article
              key={insight.id}
              style={{
                left: positions[index].left,
                top: positions[index].top,
                width: 310,
                minHeight: 190,
              }}
              className={`absolute overflow-hidden rounded-2xl border shadow-lg ${styles.card}`}
            >
              <div className="flex h-12 items-center border-b border-black/5 px-5">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}
                >
                  {insight.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  {insight.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {insight.description}
                </p>
              </div>
            </article>
          );
        },
      )}
    </div>
  );
}
function IdeasSnapshot({
  ideas,
  mode,
}: {
  ideas: Idea[];
  mode: "brainstorm" | "prioritize";
}) {
  return (
    <div
      data-stage-scroll
      onPointerDown={(event) =>
        event.stopPropagation()
      }
      className="absolute inset-x-0 bottom-0 top-20 overflow-y-auto overscroll-contain px-10 pb-10"
    >
      <div className="grid grid-cols-3 gap-5">
        {ideas.map((idea) => {
          const priorityStyles =
            idea.priority === "high"
              ? "border-rose-300 bg-rose-50"
              : idea.priority === "medium"
                ? "border-amber-300 bg-amber-50"
                : idea.priority === "low"
                  ? "border-slate-300 bg-slate-100"
                  : "border-amber-200 bg-amber-50";

          return (
            <article
              key={idea.id}
              className={`min-h-36 rounded-2xl border p-5 shadow-sm ${priorityStyles}`}
            >
              {mode === "prioritize" && (
                <div className="mb-4">
                  <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                    {idea.priority ??
                      "Unassigned"}
                  </span>
                </div>
              )}

              <p className="text-base font-medium leading-6 text-slate-800">
                {idea.text || "Untitled idea"}
              </p>
            </article>
          );
        })}
      </div>

      {ideas.length === 0 && (
        <div className="flex h-full items-center justify-center text-slate-400">
          No ideas were created.
        </div>
      )}
    </div>
  );
}
function CompleteCanvas({
  researchText,
  researchFileName,
  ideas,
  plannedIdeas,
  onOpenStep,
}: CompleteCanvasProps) {
  const viewportRef =
    useRef<HTMLDivElement>(null);

  const panStateRef =
    useRef<PanState>(null);

  const viewRef = useRef<ViewState>({
    x: 40,
    y: 40,
    zoom: 0.35,
  });

  const [view, setViewState] =
    useState<ViewState>(
      viewRef.current,
    );



  const setView = useCallback(
    (
      next:
        | ViewState
        | ((
            current: ViewState,
          ) => ViewState),
    ) => {
      const resolved =
        typeof next === "function"
          ? next(viewRef.current)
          : next;

      viewRef.current = resolved;
      setViewState(resolved);
    },
    [],
  );

  const fitToScreen = useCallback(() => {
    const viewport =
      viewportRef.current;

    if (!viewport) {
      return;
    }

    const availableWidth =
      viewport.clientWidth - 80;

    const availableHeight =
      viewport.clientHeight - 130;

    const nextZoom = clampZoom(
      Math.min(
        availableWidth / BOARD_WIDTH,
        availableHeight / BOARD_HEIGHT,
      ),
    );

    setView({
      zoom: nextZoom,
      x:
        (viewport.clientWidth -
          BOARD_WIDTH * nextZoom) /
        2,
      y:
        (viewport.clientHeight -
          BOARD_HEIGHT * nextZoom) /
        2,
    });
  }, [setView]);

  const zoomAtPoint = useCallback(
    (
      nextZoom: number,
      clientX?: number,
      clientY?: number,
    ) => {
      const viewport =
        viewportRef.current;

      if (!viewport) {
        return;
      }

      const bounds =
        viewport.getBoundingClientRect();

      const pointX =
        clientX === undefined
          ? bounds.width / 2
          : clientX - bounds.left;

      const pointY =
        clientY === undefined
          ? bounds.height / 2
          : clientY - bounds.top;

      setView((current) => {
        const clampedZoom =
          clampZoom(nextZoom);

        const worldX =
          (pointX - current.x) /
          current.zoom;

        const worldY =
          (pointY - current.y) /
          current.zoom;

        return {
          zoom: clampedZoom,
          x:
            pointX -
            worldX * clampedZoom,
          y:
            pointY -
            worldY * clampedZoom,
        };
      });
    },
    [setView],
  );

  useEffect(() => {
    const frame =
      window.requestAnimationFrame(
        fitToScreen,
      );

    const viewport =
      viewportRef.current;

    const observer =
      new ResizeObserver(fitToScreen);

    if (viewport) {
      observer.observe(viewport);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [fitToScreen]);

  useEffect(() => {
    const viewport =
      viewportRef.current;

    if (!viewport) {
      return;
    }

    function handleWheel(
      event: WheelEvent,
    ) {
      const target = event.target;

        if (
              target instanceof HTMLElement &&
            target.closest("[data-stage-scroll]")
            ) {
            return;
              }
      event.preventDefault();
      event.stopPropagation();

      const zoomSpeed = 0.0035;

      const limitedDelta = Math.max(
        -40,
        Math.min(40, event.deltaY),
      );

      const nextZoom =
        viewRef.current.zoom *
        Math.exp(
          -limitedDelta * zoomSpeed,
        );

      zoomAtPoint(
        nextZoom,
        event.clientX,
        event.clientY,
      );
    }

    viewport.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
      },
    );

    return () => {
      viewport.removeEventListener(
        "wheel",
        handleWheel,
      );
    };
  }, [zoomAtPoint]);

  function handlePointerDown(
    event: PointerEvent<HTMLDivElement>,
  ) {
    if (event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    panStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: viewRef.current.x,
      originY: viewRef.current.y,
    };
  }

  function handlePointerMove(
    event: PointerEvent<HTMLDivElement>,
  ) {
    const panState =
      panStateRef.current;

    if (
      !panState ||
      panState.pointerId !==
        event.pointerId
    ) {
      return;
    }

    setView((current) => ({
      ...current,
      x:
        panState.originX +
        event.clientX -
        panState.startX,
      y:
        panState.originY +
        event.clientY -
        panState.startY,
    }));
  }

  function finishPan(
    event: PointerEvent<HTMLDivElement>,
  ) {
    if (
      panStateRef.current
        ?.pointerId === event.pointerId
    ) {
      panStateRef.current = null;
    }

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }
  }

  function resetView() {
    setView({
      x: 40,
      y: 40,
      zoom: 0.3,
    });
  }

  const stagePositions = Array.from(
    { length: STAGE_COUNT },
    (_, index) =>
      BOARD_PADDING +
      index *
        (STAGE_WIDTH + STAGE_GAP),
  );

  return (
    <div
      ref={viewportRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPan}
      onPointerCancel={finishPan}
      className="relative h-full w-full touch-none cursor-grab overflow-hidden overscroll-none bg-slate-100 active:cursor-grabbing"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundPosition: `${view.x}px ${view.y}px`,
          backgroundSize: `${
            24 * view.zoom
          }px ${24 * view.zoom}px`,
        }}
      />

      <div
        className="absolute left-0 top-0"
        style={{
          width: BOARD_WIDTH,
          height: BOARD_HEIGHT,
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
          transformOrigin: "0 0",
        }}
      >
        <div className="absolute left-[70px] top-4">
          <p className="text-sm font-semibold text-slate-500">
            Complete workflow
          </p>

          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            From research to final recommendation
          </h2>
        </div>

        {stagePositions
          .slice(0, -1)
          .map((left) => (
            <div
              key={left}
              style={{
                left:
                  left + STAGE_WIDTH,
                top: 420,
                width: STAGE_GAP,
              }}
              className="absolute flex items-center justify-center"
            >
              <div className="h-px flex-1 bg-slate-300" />

              <span className="mx-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl text-slate-400 shadow-sm">
                →
              </span>

              <div className="h-px flex-1 bg-slate-300" />
            </div>
          ))}

        <section
          style={{
            left: stagePositions[0],
            top: STAGE_TOP,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
          }}
          className="absolute overflow-hidden rounded-[32px] border border-slate-200 bg-slate-50 shadow-xl"
        >
          <ResearchSnapshot
            researchText={researchText}
            researchFileName={researchFileName}
            onOpenStep={onOpenStep}
          />
        </section>

        <section
          style={{
            left: stagePositions[1],
            top: STAGE_TOP,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
          }}
          className="absolute overflow-hidden rounded-[32px] border border-slate-200 bg-slate-50 shadow-xl"
        >
          <SynthesisSnapshot onOpenStep={onOpenStep} />
        </section>

        <section
          style={{
            left: stagePositions[2],
            top: STAGE_TOP,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
          }}
          className="absolute overflow-hidden rounded-[32px] border border-slate-200 bg-slate-50 shadow-xl"
        >
          <StageLabel
            number={3}
            title="Brainstorm"
            step="brainstorm"
            onOpenStep={onOpenStep}
          />

          <IdeasSnapshot
            ideas={ideas}
            mode="brainstorm"
          />
        </section>

        <section
          style={{
            left: stagePositions[3],
            top: STAGE_TOP,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
          }}
          className="absolute overflow-hidden rounded-[32px] border border-slate-200 bg-slate-50 shadow-xl"
        >
          <StageLabel
            number={4}
            title="Prioritize"
            step="prioritize"
            onOpenStep={onOpenStep}
          />

          <IdeasSnapshot
            ideas={ideas}
            mode="prioritize"
          />
        </section>

        <section
          style={{
            left: stagePositions[4],
            top: STAGE_TOP,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
          }}
          className="absolute overflow-hidden rounded-[32px] border border-slate-200 bg-slate-50 shadow-xl"
        >
          <StageLabel
            number={5}
            title="Plan"
            step="plan"
            onOpenStep={onOpenStep}
          />

          <div
  data-stage-scroll
  onPointerDown={(event) =>
    event.stopPropagation()
  }
  className="absolute inset-x-0 bottom-0 top-20 overflow-y-auto overscroll-contain"
>
  <PlanCanvas
    plannedIdeas={plannedIdeas}
    embedded
  />
</div>
        </section>

        <section
          style={{
            left: stagePositions[5],
            top: STAGE_TOP,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
          }}
          className="absolute overflow-hidden rounded-[32px] border border-slate-200 bg-slate-50 shadow-xl"
        >
          <StageLabel
            number={6}
            title="Present"
            step="present"
            onOpenStep={onOpenStep}
          />

          <div
  data-stage-scroll
  onPointerDown={(event) =>
    event.stopPropagation()
  }
  className="absolute inset-x-0 bottom-0 top-20 overflow-y-auto overscroll-contain"
>
  <PresentationCanvas
    ideas={ideas}
    plannedIdeas={plannedIdeas}
    embedded
  />
</div>
        </section>
      </div>

      <div
        onPointerDown={(event) =>
          event.stopPropagation()
        }
        className="absolute bottom-24 right-6 z-30 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() =>
              zoomAtPoint(
                viewRef.current.zoom /
                  1.08,
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            −
          </button>

          <div className="min-w-16 text-center text-sm font-semibold text-slate-600">
            {Math.round(
              view.zoom * 100,
            )}
            %
          </div>

          <button
            type="button"
            aria-label="Zoom in"
            onClick={() =>
              zoomAtPoint(
                viewRef.current.zoom *
                  1.08,
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            +
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={fitToScreen}
            className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Fit
          </button>

          <button
            type="button"
            onClick={resetView}
            className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompleteCanvas;