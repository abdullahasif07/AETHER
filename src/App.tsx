import { SimulationControls } from "./components/SimulationControls";
import { SolarSystemScene } from "./scenes/SolarSystemScene";

export default function App() {
  return (
    <main className="relative h-screen w-screen bg-[#020308]">
      <SolarSystemScene />
      <SimulationControls />
    </main>
  );
}
