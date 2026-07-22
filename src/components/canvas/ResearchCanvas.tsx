import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";

type ResearchCanvasProps = {
  researchText: string;
  fileName: string | null;
  onImport: (
    text: string,
    fileName: string,
  ) => void;
};

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-6 w-6"
    >
      <path
        d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
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
  );
}

function ResearchCanvas({
  researchText,
  fileName,
  onImport,
}: ResearchCanvasProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [error, setError] = useState<
    string | null
  >(null);

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const isTextFile =
      file.type === "text/plain" ||
      file.name.toLowerCase().endsWith(".txt");

    if (!isTextFile) {
      setError(
        "Please choose a plain text (.txt) file.",
      );

      event.target.value = "";
      return;
    }

    try {
      const text = await file.text();

      if (!text.trim()) {
        setError(
          "That file is empty. Choose a file containing research notes.",
        );

        event.target.value = "";
        return;
      }

      setError(null);
      onImport(text, file.name);
    } catch {
      setError(
        "The file could not be read. Please try another text file.",
      );
    }

    event.target.value = "";
  }

  if (!researchText) {
    return (
      <div className="relative z-10 flex h-full items-center justify-center p-10 pb-28">
        <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <UploadIcon />
          </div>

          <p className="mt-6 text-sm font-semibold text-indigo-600">
            Gather research
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Import your research notes
          </h2>

          <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-500">
            Upload a plain text file containing a
            transcript, interview notes, meeting notes,
            or other research material.
          </p>

          <input
            ref={inputRef}
            type="file"
            accept=".txt,text/plain"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            <UploadIcon />
            Choose text file
          </button>

          <p className="mt-4 text-xs text-slate-400">
            Supported format: .txt
          </p>

          {error && (
            <p className="mt-4 text-sm font-medium text-rose-600">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 h-full overflow-auto p-10 pb-32">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              Gather research
            </p>

            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              Imported research
            </h2>

            <p className="mt-2 text-slate-500">
              Review the source material before
              continuing to synthesis.
            </p>
          </div>

          <div>
            <input
              ref={inputRef}
              type="file"
              accept=".txt,text/plain"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() =>
                inputRef.current?.click()
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Replace file
            </button>
          </div>
        </div>

        {error && (
          <p className="mb-4 text-sm font-medium text-rose-600">
            {error}
          </p>
        )}

        <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg">
          <header className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <DocumentIcon />
            </span>

            <div>
              <h3 className="font-semibold text-slate-900">
                {fileName ?? "Imported research"}
              </h3>

              <p className="text-sm text-slate-500">
                {researchText.length.toLocaleString()}{" "}
                characters
              </p>
            </div>
          </header>

          <div className="max-h-[calc(100vh-330px)] overflow-auto p-8">
            <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700">
              {researchText}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

export default ResearchCanvas;