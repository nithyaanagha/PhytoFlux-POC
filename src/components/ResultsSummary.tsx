import type { SimulationResult } from "@/lib/simulation";
import { ArrowDown, Leaf, Zap, TrendingDown } from "lucide-react";

interface ResultsSummaryProps {
  result: SimulationResult;
  inputPm25: number;
  inputPm10: number;
}

export function ResultsSummary({ result, inputPm25, inputPm10 }: ResultsSummaryProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
        Filtration Results
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ResultCard
          icon={TrendingDown}
          label="PM2.5 Reduction"
          value={`${result.totalEfficiencyPm25}%`}
          detail={`${inputPm25} → ${result.outputPm25} μg/m³`}
          accent
        />
        <ResultCard
          icon={TrendingDown}
          label="PM10 Reduction"
          value={`${result.totalEfficiencyPm10}%`}
          detail={`${inputPm10} → ${result.outputPm10} μg/m³`}
          accent
        />
        <ResultCard
          icon={Zap}
          label="Energy Saved"
          value={`${result.energySaved}`}
          detail="kWh/month"
        />
        <ResultCard
          icon={Leaf}
          label="Active Suction System"
          value="0.005 kW"
          detail="5 Watts power draw"
        />
      </div>

      {/* Stage breakdown */}
      <div className="mt-5 space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Stage Breakdown</p>
        {result.stages.map((stage, i) => (
          <div key={i} className="flex items-center gap-3 rounded-md bg-muted/50 px-3 py-2">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{stage.name}</p>
              <p className="text-xs text-muted-foreground truncate">{stage.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-mono text-primary">{Math.round(stage.efficiencyPm25 * 100)}%</p>
              <p className="text-xs text-muted-foreground">PM2.5</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultCard({
  icon: Icon,
  label,
  value,
  detail,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-md border p-3 ${accent ? "border-primary/20 bg-primary/5 glow-green" : "border-border bg-muted/50"}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`h-3.5 w-3.5 ${accent ? "text-primary" : "text-muted-foreground"}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`text-xl font-mono font-bold ${accent ? "text-primary" : "text-foreground"}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{detail}</p>
    </div>
  );
}
