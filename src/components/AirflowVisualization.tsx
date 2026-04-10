import type { SimulationResult } from "@/lib/simulation";

interface AirflowVisualizationProps {
  result: SimulationResult;
  inputPm25: number;
  inputPm10: number;
}

const STAGES = [
  { name: "Solar Panel", color: "#2563eb", isCap: true },
  { name: "Top Metal Mesh", color: "#94a3b8", pattern: "mesh" },
  { name: "Diatomaceous Earth", color: "#e2c590", pattern: "dots" },
  { name: "Chitosan-Coated Filter", color: "#a3d9a5", pattern: "fibers" },
  { name: "Vortex Chamber", color: "#7dd3fc", pattern: "swirl" },
  { name: "Collection Chamber", color: "#64748b", pattern: "settled" },
  { name: "Stable Base", color: "#475569", isCap: true },
];

export function AirflowVisualization({ result, inputPm25, inputPm10 }: AirflowVisualizationProps) {
  const stageEfficiencies = [
    null, // solar panel
    { pm25: result.stages[0]?.efficiencyPm25, pm10: result.stages[0]?.efficiencyPm10 },
    { pm25: result.stages[1]?.efficiencyPm25, pm10: result.stages[1]?.efficiencyPm10 },
    { pm25: result.stages[2]?.efficiencyPm25, pm10: result.stages[2]?.efficiencyPm10 },
    { pm25: result.stages[3]?.efficiencyPm25, pm10: result.stages[3]?.efficiencyPm10 },
    null, // collection
    null, // base
  ];

  // Cylinder dimensions
  const cx = 200;
  const cylW = 140;
  const cylTop = 50;
  const cylBottom = 430;
  const ellipseRy = 16;

  // Layer heights
  const layerHeights = [20, 50, 55, 60, 80, 55, 30]; // solar, mesh, diatom, chitosan, vortex, collection, base
  const totalH = layerHeights.reduce((a, b) => a + b, 0);
  const scale = (cylBottom - cylTop) / totalH;
  const scaledHeights = layerHeights.map(h => h * scale);

  let yPositions: number[] = [];
  let y = cylTop;
  for (const h of scaledHeights) {
    yPositions.push(y);
    y += h;
  }

  const healthColor = result.filterHealth > 0.6
    ? "hsl(142,71%,45%)"
    : result.filterHealth > 0.3
    ? "hsl(38,92%,50%)"
    : "hsl(0,72%,51%)";

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
        PhytoFlux Device — Cross Section
      </h3>
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* SVG Device */}
        <div className="flex-shrink-0 mx-auto lg:mx-0">
          <svg width="400" height="500" viewBox="0 0 400 500" className="overflow-visible">
            <defs>
              {/* Glass cylinder gradient */}
              <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(210,20%,30%)" stopOpacity="0.6" />
                <stop offset="30%" stopColor="hsl(210,20%,50%)" stopOpacity="0.15" />
                <stop offset="70%" stopColor="hsl(210,20%,50%)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="hsl(210,20%,30%)" stopOpacity="0.6" />
              </linearGradient>
              {/* Layer gradients */}
              {STAGES.map((s, i) => (
                <linearGradient key={`lg-${i}`} id={`layerGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={s.color} stopOpacity="0.7" />
                  <stop offset="50%" stopColor={s.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={s.color} stopOpacity="0.7" />
                </linearGradient>
              ))}
              {/* Mesh pattern */}
              <pattern id="meshPat" width="8" height="8" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="8" y2="0" stroke="hsl(215,15%,55%)" strokeWidth="0.5" />
                <line x1="0" y1="4" x2="8" y2="4" stroke="hsl(215,15%,55%)" strokeWidth="0.5" />
                <line x1="0" y1="0" x2="0" y2="8" stroke="hsl(215,15%,55%)" strokeWidth="0.5" />
                <line x1="4" y1="0" x2="4" y2="8" stroke="hsl(215,15%,55%)" strokeWidth="0.5" />
              </pattern>
              {/* Dot pattern for diatomaceous */}
              <pattern id="dotPat" width="6" height="6" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1.2" fill="hsl(35,40%,55%)" opacity="0.5" />
              </pattern>
              {/* Fiber pattern for chitosan */}
              <pattern id="fiberPat" width="10" height="10" patternUnits="userSpaceOnUse">
                <line x1="0" y1="5" x2="10" y2="3" stroke="hsl(130,30%,50%)" strokeWidth="0.5" opacity="0.5" />
                <line x1="0" y1="8" x2="10" y2="7" stroke="hsl(130,30%,50%)" strokeWidth="0.5" opacity="0.4" />
              </pattern>
            </defs>

            {/* Polluted air arrows coming in from right */}
            {[85, 140, 200].map((ay, i) => (
              <g key={`dirty-${i}`} opacity="0.6">
                <line x1="340" y1={ay} x2={cx + cylW / 2 + 10} y2={ay} stroke="hsl(0,60%,55%)" strokeWidth="1.5" strokeDasharray="4 3">
                  <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="1.5s" repeatCount="indefinite" />
                </line>
                <polygon points={`${cx + cylW / 2 + 12},${ay - 4} ${cx + cylW / 2 + 12},${ay + 4} ${cx + cylW / 2 + 4},${ay}`} fill="hsl(0,60%,55%)" opacity="0.6" />
                {i === 0 && (
                  <text x="345" y={ay - 6} fontSize="9" fill="hsl(0,60%,65%)" fontFamily="monospace">
                    Polluted Air
                  </text>
                )}
              </g>
            ))}

            {/* Clean air arrows going up/left from top */}
            {[-30, 0, 30].map((offset, i) => (
              <g key={`clean-${i}`} opacity="0.6">
                <line x1={cx + offset} y1={cylTop - 5} x2={cx + offset - 20} y2={cylTop - 40} stroke="hsl(142,71%,45%)" strokeWidth="1.5" strokeDasharray="4 3">
                  <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="1.2s" repeatCount="indefinite" />
                </line>
                <polygon
                  points={`${cx + offset - 22},${cylTop - 38} ${cx + offset - 16},${cylTop - 36} ${cx + offset - 24},${cylTop - 44}`}
                  fill="hsl(142,71%,45%)" opacity="0.6"
                />
              </g>
            ))}
            <text x={cx} y={cylTop - 46} textAnchor="middle" fontSize="9" fill="hsl(142,71%,55%)" fontFamily="monospace">
              Clean Air ↑
            </text>

            {/* Draw layers bottom-up for proper overlap */}
            {STAGES.map((stage, i) => {
              const ly = yPositions[i];
              const lh = scaledHeights[i];
              const isFirst = i === 0;
              const isLast = i === STAGES.length - 1;

              return (
                <g key={stage.name}>
                  {/* Layer body */}
                  <rect
                    x={cx - cylW / 2}
                    y={ly}
                    width={cylW}
                    height={lh}
                    fill={`url(#layerGrad${i})`}
                    stroke="hsl(220,14%,22%)"
                    strokeWidth="0.5"
                  />
                  {/* Pattern overlay */}
                  {stage.pattern === "mesh" && (
                    <rect x={cx - cylW / 2} y={ly} width={cylW} height={lh} fill="url(#meshPat)" opacity="0.5" />
                  )}
                  {stage.pattern === "dots" && (
                    <rect x={cx - cylW / 2} y={ly} width={cylW} height={lh} fill="url(#dotPat)" opacity="0.6" />
                  )}
                  {stage.pattern === "fibers" && (
                    <rect x={cx - cylW / 2} y={ly} width={cylW} height={lh} fill="url(#fiberPat)" opacity="0.6" />
                  )}
                  {stage.pattern === "swirl" && (
                    <>
                      {/* Swirl arrows inside vortex */}
                      <ellipse cx={cx} cy={ly + lh * 0.35} rx={cylW * 0.3} ry={lh * 0.15} fill="none" stroke="hsl(200,80%,70%)" strokeWidth="1" strokeDasharray="6 4" opacity="0.5">
                        <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${ly + lh * 0.35}`} to={`360 ${cx} ${ly + lh * 0.35}`} dur="4s" repeatCount="indefinite" />
                      </ellipse>
                      <ellipse cx={cx} cy={ly + lh * 0.65} rx={cylW * 0.25} ry={lh * 0.12} fill="none" stroke="hsl(200,80%,70%)" strokeWidth="1" strokeDasharray="4 6" opacity="0.4">
                        <animateTransform attributeName="transform" type="rotate" from={`360 ${cx} ${ly + lh * 0.65}`} to={`0 ${cx} ${ly + lh * 0.65}`} dur="3s" repeatCount="indefinite" />
                      </ellipse>
                    </>
                  )}
                  {stage.pattern === "settled" && (
                    <>
                      {[0.7, 0.8, 0.9].map((f, j) => (
                        <circle key={j} cx={cx - 30 + j * 30} cy={ly + lh * f} r={2 + j} fill="hsl(215,15%,40%)" opacity="0.4" />
                      ))}
                    </>
                  )}

                  {/* Top ellipse for 3D effect */}
                  <ellipse
                    cx={cx}
                    cy={ly}
                    rx={cylW / 2}
                    ry={ellipseRy}
                    fill={stage.color}
                    stroke="hsl(220,14%,22%)"
                    strokeWidth="0.5"
                    opacity="0.85"
                  />

                  {/* Number badge */}
                  <circle cx={cx - cylW / 2 - 18} cy={ly + lh / 2} r={9} fill="hsl(220,14%,12%)" stroke={stage.color} strokeWidth="1" />
                  <text x={cx - cylW / 2 - 18} y={ly + lh / 2 + 3.5} textAnchor="middle" fontSize="9" fill={stage.color} fontWeight="700" fontFamily="monospace">
                    {i + 1}
                  </text>
                </g>
              );
            })}

            {/* Bottom ellipse cap */}
            <ellipse cx={cx} cy={cylBottom} rx={cylW / 2} ry={ellipseRy} fill={STAGES[STAGES.length - 1].color} stroke="hsl(220,14%,22%)" strokeWidth="0.5" opacity="0.85" />

            {/* Glass cylinder overlay */}
            <rect x={cx - cylW / 2} y={cylTop} width={cylW} height={cylBottom - cylTop} fill="url(#glassGrad)" pointerEvents="none" />

            {/* Dimension line */}
            <line x1={cx - cylW / 2 - 5} y1={cylBottom + 20} x2={cx + cylW / 2 + 5} y2={cylBottom + 20} stroke="hsl(215,15%,40%)" strokeWidth="0.5" />
            <line x1={cx - cylW / 2 - 5} y1={cylBottom + 15} x2={cx - cylW / 2 - 5} y2={cylBottom + 25} stroke="hsl(215,15%,40%)" strokeWidth="0.5" />
            <line x1={cx + cylW / 2 + 5} y1={cylBottom + 15} x2={cx + cylW / 2 + 5} y2={cylBottom + 25} stroke="hsl(215,15%,40%)" strokeWidth="0.5" />
            <text x={cx} y={cylBottom + 35} textAnchor="middle" fontSize="9" fill="hsl(215,15%,45%)" fontFamily="monospace">
              ~0.50 m
            </text>
          </svg>
        </div>

        {/* Stats panel */}
        <div className="flex-1 w-full space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">
            Filtration Stage Performance
          </p>
          {STAGES.map((stage, i) => {
            const eff = stageEfficiencies[i];
            return (
              <div key={stage.name} className="flex items-center gap-3 rounded-md bg-muted/50 border border-border px-3 py-2">
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border"
                  style={{ borderColor: stage.color, backgroundColor: `${stage.color}15` }}
                >
                  <span className="text-xs font-bold font-mono" style={{ color: stage.color }}>{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{stage.name}</p>
                </div>
                {eff ? (
                  <div className="flex-shrink-0 flex gap-3 text-right">
                    <div>
                      <p className="text-sm font-mono font-bold text-primary">{Math.round(eff.pm25 * 100)}%</p>
                      <p className="text-[10px] text-muted-foreground">PM2.5</p>
                    </div>
                    <div>
                      <p className="text-sm font-mono font-bold text-accent">{Math.round(eff.pm10 * 100)}%</p>
                      <p className="text-[10px] text-muted-foreground">PM10</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">—</span>
                )}
              </div>
            );
          })}

          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 pt-3">
            <div className="rounded-md border border-primary/20 bg-primary/5 p-2.5 text-center glow-green">
              <p className="text-lg font-mono font-bold text-primary">{result.totalEfficiencyPm25}%</p>
              <p className="text-[10px] text-muted-foreground">Total PM2.5</p>
            </div>
            <div className="rounded-md border border-border bg-muted/50 p-2.5 text-center">
              <p className="text-lg font-mono font-bold text-accent">{result.totalEfficiencyPm10}%</p>
              <p className="text-[10px] text-muted-foreground">Total PM10</p>
            </div>
            <div className="rounded-md border border-border bg-muted/50 p-2.5 text-center">
              <p className="text-lg font-mono font-bold" style={{ color: healthColor }}>{Math.round(result.filterHealth * 100)}%</p>
              <p className="text-[10px] text-muted-foreground">Filter Health</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
