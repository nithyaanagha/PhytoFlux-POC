import type { SimulationResult } from "@/lib/simulation";
import { AlertTriangle, CheckCircle, Clock, Gauge, Wind, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FilterHealthDashboardProps {
  result: SimulationResult;
}

export function FilterHealthDashboard({ result }: FilterHealthDashboardProps) {
  const healthPercent = Math.round(result.filterHealth * 100);
  const isWarning = healthPercent < 50;
  const isCritical = healthPercent < 30;

  const statusColor = isCritical
    ? "text-destructive"
    : isWarning
    ? "text-warning"
    : "text-primary";

  const statusLabel = isCritical
    ? "CRITICAL — Clean Now"
    : isWarning
    ? "WARNING — Schedule Cleaning"
    : "GOOD";

  const StatusIcon = isCritical ? AlertTriangle : isWarning ? Clock : CheckCircle;

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">
        Filter Health & Maintenance
      </h3>

      {/* Health bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-secondary-foreground">Filter Health</span>
          <span className={`flex items-center gap-1.5 text-sm font-semibold ${statusColor}`}>
            <StatusIcon className="h-4 w-4" />
            {statusLabel}
          </span>
        </div>
        <Progress value={healthPercent} className="h-3" />
        <p className="text-xs text-muted-foreground">
          {healthPercent}% capacity remaining
        </p>
      </div>

      {/* Maintenance schedule */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={Clock}
          label="Days Until Cleaning"
          value={result.daysUntilCleaning}
          unit="days"
          alert={result.daysUntilCleaning < 14}
        />
        <MetricCard
          icon={Gauge}
          label="Pressure Drop"
          value={result.pressureDrop}
          unit="Pa"
          alert={result.pressureDrop > 45}
        />
        <MetricCard
          icon={Wind}
          label="Airflow Rate"
          value={result.airflowRate}
          unit="m³/hr"
        />
        <MetricCard
          icon={Shield}
          label="Coverage Area"
          value={result.coverageArea}
          unit="m²"
        />
      </div>

      {/* Maintenance recommendation */}
      {isCritical && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
          <p className="text-sm text-destructive font-medium">
            ⚠️ Filter efficiency severely degraded. Immediate cleaning/replacement required to maintain air quality standards.
          </p>
        </div>
      )}
      {isWarning && !isCritical && (
        <div className="rounded-md bg-warning/10 border border-warning/20 p-3">
          <p className="text-sm text-warning font-medium">
            ⏰ Schedule filter cleaning within {result.daysUntilCleaning} days. Current efficiency is below optimal levels.
          </p>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  alert = false,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
  alert?: boolean;
}) {
  return (
    <div className={`rounded-md border p-3 ${alert ? "border-destructive/30 bg-destructive/5" : "border-border bg-muted/50"}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`h-3.5 w-3.5 ${alert ? "text-destructive" : "text-muted-foreground"}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`text-lg font-mono font-bold ${alert ? "text-destructive" : "text-foreground"}`}>
        {value} <span className="text-xs text-muted-foreground font-normal">{unit}</span>
      </p>
    </div>
  );
}
