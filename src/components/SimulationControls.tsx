import {
  TIME_SCALE_CONFIG,
  useSimulationStore,
} from "../store/simulationStore";

export function SimulationControls() {
  const timeScale = useSimulationStore((state) => state.timeScale);
  const setTimeScale = useSimulationStore((state) => state.setTimeScale);
  const resetTimeScale = useSimulationStore((state) => state.resetTimeScale);
  const speedLabel = timeScale === 0 ? "Paused" : `${timeScale.toFixed(2)}×`;

  return (
    <section
      aria-label="Simulation controls"
      onPointerDown={(event) => event.stopPropagation()}
      className="pointer-events-auto absolute bottom-5 left-1/2 w-[min(22rem,calc(100%-2rem))] -translate-x-1/2 rounded-2xl border border-white/15 bg-black/55 px-4 py-3 text-white shadow-2xl backdrop-blur-md"
    >
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <label
          className="text-xs font-medium uppercase tracking-[0.2em] text-white/65"
          htmlFor="simulation-speed"
        >
          Simulation speed
        </label>
        <output
          className="min-w-16 text-right text-sm tabular-nums text-white"
          htmlFor="simulation-speed"
        >
          {speedLabel}
        </output>
      </div>

      <input
        id="simulation-speed"
        type="range"
        min={TIME_SCALE_CONFIG.minimum}
        max={TIME_SCALE_CONFIG.maximum}
        step={TIME_SCALE_CONFIG.step}
        value={timeScale}
        aria-valuetext={speedLabel}
        onChange={(event) => setTimeScale(event.currentTarget.valueAsNumber)}
        className="h-1.5 w-full cursor-pointer accent-sky-300"
      />

      <div
        aria-hidden="true"
        className="relative mt-1.5 h-3 text-[0.65rem] text-white/40"
      >
        <span className="absolute left-0">Pause</span>
        <span className="absolute left-1/4 -translate-x-1/2">Normal</span>
        <span className="absolute right-0">4×</span>
      </div>

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() =>
            setTimeScale(
              timeScale === 0 ? TIME_SCALE_CONFIG.default : 0,
            )
          }
          className="min-h-9 flex-1 rounded-lg border border-white/15 bg-white/10 px-3 text-xs font-medium text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
        >
          {timeScale === 0 ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          onClick={resetTimeScale}
          disabled={timeScale === TIME_SCALE_CONFIG.default}
          className="min-h-9 flex-1 rounded-lg border border-white/15 px-3 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset to 1×
        </button>
      </div>
    </section>
  );
}
