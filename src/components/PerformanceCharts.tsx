import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { velocitySweep, filterLifecycle, type SimulationParams } from "@/lib/simulation";

interface PerformanceChartsProps {
  params: SimulationParams;
}

export function PerformanceCharts({ params }: PerformanceChartsProps) {
  const velocityData = useMemo(() => velocitySweep(params), [params]);
  const lifecycleData = useMemo(() => filterLifecycle(params), [params]);

  return (
    <div className="space-y-5">
      {/* Velocity vs Efficiency */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
          Filtration Efficiency vs Wind Velocity
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={velocityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis
              dataKey="velocity"
              stroke="hsl(215, 15%, 45%)"
              fontSize={11}
              label={{ value: "Wind Velocity (m/s)", position: "insideBottom", offset: -5, fill: "hsl(215, 15%, 45%)", fontSize: 10 }}
            />
            <YAxis
              stroke="hsl(215, 15%, 45%)"
              fontSize={11}
              label={{ value: "Efficiency (%)", angle: -90, position: "insideLeft", fill: "hsl(215, 15%, 45%)", fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 14%, 18%)",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="effPm25" name="PM2.5 Efficiency" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="effPm10" name="PM10 Efficiency" stroke="hsl(172, 66%, 40%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Filter Lifecycle */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
          Filter Degradation Over Time
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={lifecycleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis
              dataKey="day"
              stroke="hsl(215, 15%, 45%)"
              fontSize={11}
              label={{ value: "Filter Age (days)", position: "insideBottom", offset: -5, fill: "hsl(215, 15%, 45%)", fontSize: 10 }}
            />
            <YAxis stroke="hsl(215, 15%, 45%)" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 14%, 18%)",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="health" name="Filter Health (%)" stroke="hsl(142, 71%, 45%)" fill="hsl(142, 71%, 45%)" fillOpacity={0.1} strokeWidth={2} />
            <Area type="monotone" dataKey="efficiency" name="PM2.5 Efficiency (%)" stroke="hsl(172, 66%, 40%)" fill="hsl(172, 66%, 40%)" fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
