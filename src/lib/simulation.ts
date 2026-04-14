// PhytoFlux Filtration Simulation Engine
// Based on SimScale CFD results and experimental data

export interface SimulationParams {
  windVelocity: number;       // m/s (0.5 - 8)
  pm25Concentration: number;  // μg/m³ (10 - 500)
  pm10Concentration: number;  // μg/m³ (20 - 800)
  temperature: number;        // °C (5 - 50)
  humidity: number;           // % (10 - 95)
  filterAge: number;          // days since last cleaning (0 - 365)
}

export interface FiltrationStage {
  name: string;
  description: string;
  efficiencyPm25: number;  // 0-1
  efficiencyPm10: number;  // 0-1
}

export interface SimulationResult {
  stages: FiltrationStage[];
  outputPm25: number;
  outputPm10: number;
  totalEfficiencyPm25: number;
  totalEfficiencyPm10: number;
  airflowRate: number;        // m³/hour
  coverageArea: number;       // m²
  filterHealth: number;       // 0-1
  daysUntilCleaning: number;
  pressureDrop: number;       // Pa
  fanEfficiency: number;      // %
  energySaved: number;        // kWh vs active system
}

// Optimal airflow range from SimScale: 300-430 m³/hr
const OPTIMAL_VELOCITY_MIN = 1.5; // m/s
const OPTIMAL_VELOCITY_MAX = 4.0; // m/s
const BASE_AIRFLOW_RATE = 365;    // m³/hr at optimal velocity
const BASE_COVERAGE_AREA = 115;   // m² average of 80-150

// Filter degradation model
const MAX_FILTER_LIFE_DAYS = 180; // 6 months before cleaning needed
const CRITICAL_FILTER_HEALTH = 0.3;

/**
 * Calculate velocity efficiency factor.
 * At optimal range (1.5-4 m/s), efficiency is maximized.
 * Too slow = insufficient flow; too fast = particles pass through.
 */
function velocityFactor(velocity: number): number {
  if (velocity >= OPTIMAL_VELOCITY_MIN && velocity <= OPTIMAL_VELOCITY_MAX) {
    return 1.0;
  }
  if (velocity < OPTIMAL_VELOCITY_MIN) {
    return 0.5 + 0.5 * (velocity / OPTIMAL_VELOCITY_MIN);
  }
  // Above optimal: efficiency drops as vortex can't hold particles
  const excess = velocity - OPTIMAL_VELOCITY_MAX;
  return Math.max(0.15, 1.0 - 0.12 * excess);
}

/**
 * Temperature & humidity affect chitosan binding efficiency.
 * Optimal: 20-35°C, 40-70% humidity
 */
function environmentFactor(temp: number, humidity: number): number {
  let tFactor = 1.0;
  if (temp < 10) tFactor = 0.7 + 0.03 * temp;
  else if (temp > 40) tFactor = Math.max(0.6, 1.0 - 0.04 * (temp - 40));

  let hFactor = 1.0;
  if (humidity < 30) hFactor = 0.75 + 0.0083 * humidity;
  else if (humidity > 80) hFactor = Math.max(0.7, 1.0 - 0.02 * (humidity - 80));

  return tFactor * hFactor;
}

/**
 * Filter health degrades with age and pollutant load.
 * Higher concentrations accelerate filter clogging.
 */
function calculateFilterHealth(filterAge: number, avgConcentration: number): number {
  const loadFactor = 1 + (avgConcentration - 100) / 500; // baseline at 100 μg/m³
  const effectiveAge = filterAge * Math.max(0.5, loadFactor);
  return Math.max(0, 1 - effectiveAge / MAX_FILTER_LIFE_DAYS);
}

/**
 * Main simulation function based on PhytoFlux multi-stage filtration:
 * 1. Structural Pre-Filter (mesh) - captures large PM10
 * 2. Diatomaceous Earth Layer - porous matrix traps medium particles
 * 3. Chitosan-Coated Biomimetic Layer - electrostatic PM2.5 capture
 * 4. Vortex Flow Chamber - extended contact time for fine particles
 */
export function runSimulation(params: SimulationParams): SimulationResult {
  const vFactor = velocityFactor(params.windVelocity);
  const eFactor = environmentFactor(params.temperature, params.humidity);
  const filterHealth = calculateFilterHealth(
    params.filterAge,
    (params.pm25Concentration + params.pm10Concentration) / 2
  );
  const healthFactor = 0.4 + 0.6 * filterHealth; // even degraded filters work somewhat

  const modifier = vFactor * eFactor * healthFactor;

  // Stage efficiencies (base values from experimental data)
  const stages: FiltrationStage[] = [
    {
      name: "Structural Pre-Filter",
      description: "Mesh layer captures large particulate matter (PM10, dust, debris)",
      efficiencyPm25: 0.05 * modifier,
      efficiencyPm10: 0.35 * modifier,
    },
    {
      name: "Diatomaceous Earth Layer",
      description: "Porous mineral matrix traps medium particles via physical adsorption",
      efficiencyPm25: 0.08 * modifier,
      efficiencyPm10: 0.20 * modifier,
    },
    {
      name: "Chitosan-Coated Layer",
      description: "Electrostatically attracts negatively charged fine particles (PM2.5)",
      efficiencyPm25: 0.12 * modifier,
      efficiencyPm10: 0.08 * modifier,
    },
    {
      name: "Vortex Flow Chamber",
      description: "Active vortex induction overcomes 822.7 Pa internal resistance, maintaining 35% velocity attenuation for optimal biochemical binding",
      efficiencyPm25: 0.07 * modifier,
      efficiencyPm10: 0.05 * modifier,
    },
  ];

  // Calculate cumulative filtration
  let remainingPm25 = params.pm25Concentration;
  let remainingPm10 = params.pm10Concentration;

  for (const stage of stages) {
    remainingPm25 *= (1 - stage.efficiencyPm25);
    remainingPm10 *= (1 - stage.efficiencyPm10);
  }

  const totalEffPm25 = 1 - remainingPm25 / params.pm25Concentration;
  const totalEffPm10 = 1 - remainingPm10 / params.pm10Concentration;

  // Airflow rate scales with wind velocity
  const airflowRate = BASE_AIRFLOW_RATE * (params.windVelocity / 2.5);

  // Coverage area shrinks with very high/low velocities
  const coverageArea = BASE_COVERAGE_AREA * Math.min(1, vFactor * 1.1);

  // Days until cleaning needed
  const avgConc = (params.pm25Concentration + params.pm10Concentration) / 2;
  const loadFactor = Math.max(0.5, 1 + (avgConc - 100) / 500);
  const remainingLife = MAX_FILTER_LIFE_DAYS * (1 - params.filterAge / MAX_FILTER_LIFE_DAYS);
  const daysUntilCleaning = Math.max(0, Math.round(remainingLife / loadFactor));

  // Pressure drop default value used for current filter health model
  const pressureDrop = 115.4;

  // Energy saved vs active system (5-10 kW)
  const energySaved = 7.5 * 24 / 1000 * 30; // ~5.4 kWh/month saved

  return {
    stages,
    outputPm25: Math.round(remainingPm25 * 10) / 10,
    outputPm10: Math.round(remainingPm10 * 10) / 10,
    totalEfficiencyPm25: Math.round(totalEffPm25 * 1000) / 10,
    totalEfficiencyPm10: Math.round(totalEffPm10 * 1000) / 10,
    airflowRate: Math.round(airflowRate),
    coverageArea: Math.round(coverageArea),
    filterHealth: Math.round(filterHealth * 100) / 100,
    daysUntilCleaning,
    pressureDrop: Math.round(pressureDrop * 10) / 10,
    fanEfficiency: 100,
    energySaved: Math.round(energySaved * 10) / 10,
  };
}

/**
 * Generate data for velocity sweep chart
 */
export function velocitySweep(params: SimulationParams): Array<{ velocity: number; effPm25: number; effPm10: number; airflow: number }> {
  const data = [];
  for (let v = 0.5; v <= 8; v += 0.5) {
    const result = runSimulation({ ...params, windVelocity: v });
    data.push({
      velocity: v,
      effPm25: result.totalEfficiencyPm25,
      effPm10: result.totalEfficiencyPm10,
      airflow: result.airflowRate,
    });
  }
  return data;
}

/**
 * Generate data for filter degradation over time
 */
export function filterLifecycle(params: SimulationParams): Array<{ day: number; health: number; efficiency: number; daysLeft: number }> {
  const data = [];
  for (let d = 0; d <= 180; d += 5) {
    const result = runSimulation({ ...params, filterAge: d });
    data.push({
      day: d,
      health: Math.round(result.filterHealth * 100),
      efficiency: result.totalEfficiencyPm25,
      daysLeft: result.daysUntilCleaning,
    });
  }
  return data;
}
