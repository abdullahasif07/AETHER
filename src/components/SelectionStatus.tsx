import { useSelectionStore } from "../store/selectionStore";
import { useSelectedBody } from "../store/useSelectedBody";

export function SelectionStatus() {
  const clearSelection = useSelectionStore((state) => state.clearSelection);
  const selectedBody = useSelectedBody();

  return (
    <section
      aria-label="Celestial body selection"
      aria-live="polite"
      onPointerDown={(event) => event.stopPropagation()}
      className="pointer-events-auto absolute left-4 top-4 flex min-h-10 max-w-[calc(100%-2rem)] items-center gap-3 rounded-xl border border-white/15 bg-black/55 px-3 py-2 text-sm text-white shadow-xl backdrop-blur-md"
    >
      <span className="truncate">
        {selectedBody ? `Selected: ${selectedBody.name}` : "Selected: None"}
      </span>
      {selectedBody ? (
        <button
          type="button"
          onClick={clearSelection}
          className="rounded-md border border-white/15 px-2 py-1 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
        >
          Clear
        </button>
      ) : null}
    </section>
  );
}
