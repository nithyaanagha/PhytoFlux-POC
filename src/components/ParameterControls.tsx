import { useMemo, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Wind, Thermometer, Droplets, Calendar, Factory } from "lucide-react";
import type { SimulationParams } from "@/lib/simulation";

interface ParameterControlsProps {
  params: SimulationParams;
  onChange: (params: SimulationParams) => void;
}

const controls = [
  { key: "windVelocity" as const, label: "Wind Velocity", unit: "m/s", min: 0.5, max: 8, step: 0.1, icon: Wind },
  { key: "pm25Concentration" as const, label: "PM2.5 Density", unit: "μg/m³", min: 10, max: 500, step: 5, icon: Factory },
  { key: "pm10Concentration" as const, label: "PM10 Density", unit: "μg/m³", min: 20, max: 800, step: 10, icon: Factory },
  { key: "temperature" as const, label: "Temperature", unit: "°C", min: 5, max: 50, step: 1, icon: Thermometer },
  { key: "humidity" as const, label: "Humidity", unit: "%", min: 10, max: 95, step: 1, icon: Droplets },
  { key: "filterAge" as const, label: "Filter Age", unit: "days", min: 0, max: 365, step: 1, icon: Calendar },
];

export function ParameterControls({ params, onChange }: ParameterControlsProps) {
  const handleChange = useCallback(
    (key: keyof SimulationParams, value: number) => {
      onChange({ ...params, [key]: value });
    },
    [params, onChange]
  );

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-5">
      <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">
        Simulation Parameters
      </h3>
      {controls.map(({ key, label, unit, min, max, step, icon: Icon }) => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm text-secondary-foreground">
              <Icon className="h-3.5 w-3.5 text-primary" />
              {label}
            </Label>
            <span className="text-sm font-mono text-primary">
              {params[key]} <span className="text-muted-foreground text-xs">{unit}</span>
            </span>
          </div>
          <Slider
            value={[params[key]]}
            min={min}
            max={max}
            step={step}
            onValueChange={([v]) => handleChange(key, v)}
            className="cursor-pointer"
          />
        </div>
      ))}
    </div>
  );
}
