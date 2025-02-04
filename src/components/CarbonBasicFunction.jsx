import {
  annualCommuting,
  averageDistance,
  carbonFixation,
  carbonFixationRate,
  carbonPerPassager,
  populationUsage,
  transportationUsage,
} from '../utils/Parameters';

export function CarbonBasicFunction({ results, page }) {
  const participationRate = populationUsage?.[page] / 100 || 0;
  const transportation = transportationUsage?.[page] || {};
  const transportationEmissions = Object.entries(transportation).reduce(
    (total, [mode, percentage]) =>
      total + (percentage / 100) * carbonPerPassager[mode],
    0
  );
  const greenCarbonSequestration =
    results?.area *
    (carbonFixationRate.greenCarbon / 100) *
    carbonFixation.greenCarbon;

  const transportationBasic =
    results?.population *
    annualCommuting *
    participationRate *
    averageDistance *
    transportationEmissions;

  return {
    transportationBasic: Math.round(transportationBasic),
    greenCarbonSequestration: Math.round(greenCarbonSequestration),
    total: Math.round(transportationBasic - greenCarbonSequestration),
  };
}
