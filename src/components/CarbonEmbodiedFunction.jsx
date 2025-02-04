import { buildingCarbonParameter, carbonParameters } from '../utils/Parameters';

export function CarbonEmbodiedFunction({ results, page }) {
  const { area, land = {}, far = {} } = results || {};
  const carbonParameter = carbonParameters?.[page] || {};
  const sumConstruct = Object.values(carbonParameter).reduce(
    (a, b) => a + b,
    0
  );
  const constructCarbon = (area * sumConstruct) / 50;
  const sumBuilding = Object.keys(land).reduce(
    (sum, key) => sum + (land[key] / 100) * (far[key] / 100),
    0
  );

  const buildingCarbon = (area * sumBuilding * buildingCarbonParameter[0]) / 50;

  return {
    constructCarbon: Math.round(constructCarbon),
    buildingCarbon: Math.round(buildingCarbon),
    total: Math.round(constructCarbon + buildingCarbon),
  };
}
