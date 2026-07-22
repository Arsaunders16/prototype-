import {
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";

type SynthesisCard = {
  id: number;
  category:
    | "Theme"
    | "Pain point"
    | "Opportunity";
  title: string;
  description: string;
  x: number;
  y: number;
};

type DragState = {
  cardId: number;
  offsetX: number;
  offsetY: number;
} | null;

type SynthesizeCanvasProps = {
  researchText: string;
};

const CARD_WIDTH = 290;
const CARD_HEIGHT = 178;

const CARD_GAP_X = 30;
const CARD_GAP_Y = 34;

const cardContent = [
  {
    id: 1,
    category: "Theme" as const,
    title: "Blank canvas anxiety",
    description:
      "New users are unsure what to create or how to structure their first board.",
  },
  {
    id: 2,
    category: "Theme" as const,
    title: "Poor template discovery",
    description:
      "Templates reduce uncertainty, but most new users never find them.",
  },
  {
    id: 3,
    category: "Pain point" as const,
    title: "Unclear first action",
    description:
      "Users enter the workspace without a clear prompt or recommended next step.",
  },
  {
    id: 4,
    category: "Pain point" as const,
    title: "Manual organization",
    description:
      "Turning raw notes into themes, priorities, and action items takes too much effort.",
  },
  {
    id: 5,
    category: "Opportunity" as const,
    title: "Import existing research",
    description:
      "Let users begin with notes and transcripts instead of starting from an empty canvas.",
  },
  {
    id: 6,
    category: "Opportunity" as const,
    title: "Guided workflow",
    description:
      "Guide users from research through synthesis, ideation, prioritization, and planning.",
  },
];

function categoryClasses(
  category: SynthesisCard["category"],
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

function createCenteredCards(
  canvasWidth: number,
  canvasHeight: number,
): SynthesisCard[] {
  const clusterWidth =
    CARD_WIDTH * 3 + CARD_GAP_X * 2;

  const clusterHeight =
    CARD_HEIGHT * 2 + CARD_GAP_Y;

  const startX = Math.max(
    40,
    (canvasWidth - clusterWidth) / 2,
  );

  const startY = Math.max(
    140,
    (canvasHeight - clusterHeight) / 2 + 35,
  );

  const positions = [
    {
      x: startX + 20,
      y: startY + 14,
    },
    {
      x:
        startX +
        CARD_WIDTH +
        CARD_GAP_X -
        8,
      y: startY - 8,
    },
    {
      x:
        startX +
        (CARD_WIDTH + CARD_GAP_X) * 2 -
        20,
      y: startY + 18,
    },
    {
      x: startX - 12,
      y:
        startY +
        CARD_HEIGHT +
        CARD_GAP_Y -
        4,
    },
    {
      x:
        startX +
        CARD_WIDTH +
        CARD_GAP_X +
        10,
      y:
        startY +
        CARD_HEIGHT +
        CARD_GAP_Y +
        10,
    },
    {
      x:
        startX +
        (CARD_WIDTH + CARD_GAP_X) * 2 +
        4,
      y:
        startY +
        CARD_HEIGHT +
        CARD_GAP_Y -
        10,
    },
  ];

  return cardContent.map(
    (card, index) => ({
      ...card,
      x: positions[index].x,
      y: positions[index].y,
    }),
  );
}

function SynthesizeCanvas({
  researchText,
}: SynthesizeCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [cards, setCards] = useState<
    SynthesisCard[]
  >([]);

  const [dragState, setDragState] =
    useState<DragState>(null);

  const [hasPositionedCards, setHasPositionedCards] =
    useState(false);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || hasPositionedCards) {
      return;
    }

    setCards(
      createCenteredCards(
        canvas.clientWidth,
        canvas.clientHeight,
      ),
    );

    setHasPositionedCards(true);
  }, [hasPositionedCards]);

  function handlePointerDown(
    event: PointerEvent<HTMLButtonElement>,
    card: SynthesisCard,
  ) {
    const cardBounds =
      event.currentTarget.parentElement?.getBoundingClientRect();

    if (!cardBounds) {
      return;
    }

    event.preventDefault();

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    setDragState({
      cardId: card.id,
      offsetX:
        event.clientX - cardBounds.left,
      offsetY:
        event.clientY - cardBounds.top,
    });
  }

  function handlePointerMove(
    event: PointerEvent<HTMLDivElement>,
  ) {
    if (!dragState || !canvasRef.current) {
      return;
    }

    const bounds =
      canvasRef.current.getBoundingClientRect();

    const maximumX = Math.max(
      0,
      bounds.width - CARD_WIDTH,
    );

    const maximumY = Math.max(
      0,
      bounds.height - CARD_HEIGHT - 110,
    );

    const x = Math.min(
      maximumX,
      Math.max(
        0,
        event.clientX -
          bounds.left -
          dragState.offsetX,
      ),
    );

    const y = Math.min(
      maximumY,
      Math.max(
        110,
        event.clientY -
          bounds.top -
          dragState.offsetY,
      ),
    );

    setCards((currentCards) =>
      currentCards.map((card) =>
        card.id === dragState.cardId
          ? {
              ...card,
              x,
              y,
            }
          : card,
      ),
    );
  }

  function handlePointerUp() {
    setDragState(null);
  }

  return (
    <div
      ref={canvasRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative z-10 h-full w-full overflow-hidden pb-28"
    >
      <div className="pointer-events-none absolute left-10 top-8">
        <p className="text-sm font-semibold text-violet-600">
          Synthesize
        </p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          Key themes and opportunities
        </h2>

        <p className="mt-2 text-slate-500">
          Six insights were identified from the imported
          research. Drag cards to reorganize them.
        </p>
      </div>

      {!researchText && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-50/90 p-10">
          <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              No research imported
            </h2>

            <p className="mt-3 text-slate-500">
              Return to the Research step and import a
              text file before synthesizing.
            </p>
          </div>
        </div>
      )}

      {cards.map((card) => {
        const styles =
          categoryClasses(card.category);

        return (
          <article
            key={card.id}
            style={{
              left: card.x,
              top: card.y,
              width: CARD_WIDTH,
              minHeight: CARD_HEIGHT,
            }}
            className={`absolute overflow-hidden rounded-2xl border shadow-lg ${styles.card}`}
          >
            <button
              type="button"
              onPointerDown={(event) =>
                handlePointerDown(event, card)
              }
              className="flex h-11 w-full cursor-grab items-center justify-between border-b border-black/5 px-4 active:cursor-grabbing"
            >
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}
              >
                {card.category}
              </span>

              <span className="text-lg leading-none text-slate-400">
                ···
              </span>
            </button>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-900">
                {card.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {card.description}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default SynthesizeCanvas;