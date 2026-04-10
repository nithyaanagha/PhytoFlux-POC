import { useState, useMemo } from "react";
import { ParameterControls } from "@/components/ParameterControls";
import { AirflowVisualization } from "@/components/AirflowVisualization";
import { FilterHealthDashboard } from "@/components/FilterHealthDashboard";
import { PerformanceCharts } from "@/components/PerformanceCharts";
import { ResultsSummary } from "@/components/ResultsSummary";
import { runSimulation, type SimulationParams } from "@/lib/simulation";
import { Leaf } from "lucide-react";

const DEFAULT_PARAMS: SimulationParams = {
  windVelocity: 2.5,
  pm25Concentration: 100,
  pm10Concentration: 200,
  temperature: 30,
  humidity: 55,
  filterAge: 30,
};

const Index = () => {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);

  const result = useMemo(() => runSimulation(params), [params]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center glow-green">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Phyto<span className="text-gradient-green">Flux</span>
              </h1>
              <p className="text-xs text-muted-foreground">Urban Bio-Sieve Simulation</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
            <span>SimScale CFD Validated</span>
            <span className="h-1 w-1 rounded-full bg-primary" />
            <span>Nerds of a Feather</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left sidebar - Controls */}
          <div className="lg:col-span-3">
            <ParameterControls params={params} onChange={setParams} />
          </div>

          {/* Main area */}
          <div className="lg:col-span-9 space-y-5">
            <AirflowVisualization result={result} inputPm25={params.pm25Concentration} inputPm10={params.pm10Concentration} />
            <ResultsSummary result={result} inputPm25={params.pm25Concentration} inputPm10={params.pm10Concentration} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <FilterHealthDashboard result={result} />
              <PerformanceCharts params={params} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
