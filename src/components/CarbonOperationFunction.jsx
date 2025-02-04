import {
  carbonInParkRate,
  developCrudeClassification,
  developDetailClassification,
  industryCrudeClassification,
  industryDetailClassification,
  industryWasteClassification,
  operationCarbonParameters,
} from '../utils/Parameters';

/**
 * This function takes in the results of the previous page and calculates
 * the carbon emissions for the current page. The function is used for
 * both "area-develop" and "integrated-develop" pages.
 * @param {{ results: Record<string, number>, page: string, tag: string, resultPage: string}} props - The props passed in.
 * @returns {number} - The calculated carbon emissions.
 */

export const calculateElectricCarbon = (electricUsage, multiplier = 1) =>
  electricUsage
    ? [
        Math.round(
          electricUsage * operationCarbonParameters.electric * multiplier
        ),
        Math.round(
          (electricUsage * operationCarbonParameters.electric * multiplier) /
            carbonInParkRate -
            electricUsage * operationCarbonParameters.electric * multiplier
        ),
      ]
    : [0, 0];

export const calculateWasteCarbon = (population, area) => {
  const normalWasteCarbon =
    population *
    operationCarbonParameters.normalWaste *
    industryWasteClassification.normalWaste;
  const businessWasteCarbon =
    area *
    operationCarbonParameters.businessWaste *
    industryWasteClassification.businessWaste;
  const toxicWasteCarbon =
    area *
    operationCarbonParameters.toxicWaste *
    industryWasteClassification.toxicWaste;
  return Math.round(normalWasteCarbon + businessWasteCarbon + toxicWasteCarbon);
};

export const calculateWaterCarbon = (
  waterUsage,
  wasteWaterUsage,
  multiplier
) => [
  Math.round(waterUsage * operationCarbonParameters.useWater * multiplier),
  Math.round(
    wasteWaterUsage * operationCarbonParameters.wasteWater * multiplier
  ),
];

export function CarbonOperationFunction({ results, page, tag, resultPage }) {
  const parameterChoose = (tag, resultPage) => {
    switch (true) {
      case tag === 'area-develop' && resultPage === 'detail-calculate':
        return industryDetailClassification || {};
      case tag === 'area-develop' && resultPage === 'crude-calculate':
        return industryCrudeClassification?.[page] || {};
      case tag === 'integrated-develop' && resultPage === 'detail-calculate':
        return developDetailClassification?.[page] || {};
      case tag === 'integrated-develop' && resultPage === 'crude-calculate':
        return developCrudeClassification?.[page] || {};
      default:
        return {};
    }
  };
  let useElectricCarbon = 0;
  let processElectricCarbon = 0;
  let useWaterCarbon = 0;
  let wasteWaterCarbon = 0;
  let wasteCarbon = 0;

  /******  3547c77e-4986-4ea3-9f99-e8a8f5f5a194  *******/
  const landArray = ['house', 'commercial'];
  // Get the appropriate usage parameters
  const perUsage = parameterChoose(tag, resultPage);

  // Function to handle "crude-calculate" for both "area-develop" and "integrated-develop"
  const calculateCrude = () => {
    const { population, area, land, far } = results;
    const { electric, useWater, wasteWater } = perUsage;

    if (tag === 'area-develop') {
      const [ue, pe] = calculateElectricCarbon(electric * 12 * 250, area);
      const [uw, ww] = calculateWaterCarbon(useWater, wasteWater, area * 250);
      useElectricCarbon = ue;
      processElectricCarbon = pe;
      useWaterCarbon = uw;
      wasteWaterCarbon = ww;
      wasteCarbon = calculateWasteCarbon(population * 250, area * 250);
    } else if (tag === 'integrated-develop') {
      useElectricCarbon = landArray.reduce(
        (total, key) =>
          total +
          calculateElectricCarbon(
            perUsage[`${key}Electric`],
            (land[key] / 100) * (far[key] / 100) * area
          )[0],
        0
      );
      const [uw, ww] = calculateWaterCarbon(
        useWater,
        wasteWater,
        population * 250
      );
      useWaterCarbon = uw;
      wasteWaterCarbon = ww;
      wasteCarbon = calculateWasteCarbon(population * 250, 0);
    }

    return {
      useElectricCarbon: useElectricCarbon,
      processElectricCarbon: processElectricCarbon,
      useWaterCarbon: useWaterCarbon,
      wasteWaterCarbon: wasteWaterCarbon,
      wasteCarbon: wasteCarbon,
      total:
        useElectricCarbon +
        processElectricCarbon +
        useWaterCarbon +
        wasteWaterCarbon +
        wasteCarbon,
    };
  };

  const calculateDetail = () => {
    const { population, area, land, far, industry } = results;
    const isAreaDevelop = tag === 'area-develop';
    const isIntegratedDevelop = tag === 'integrated-develop';

    if (isAreaDevelop) {
      if (Object.keys(industry).length > 0) {
        const [ue, pe] = Object.entries(industry).reduce(
          ([ue, pe], [key, value]) => {
            const [cue, cpe] = calculateElectricCarbon(
              perUsage[key]?.electric * 12 * 250,
              (area * value) / 100
            );

            return [ue + cue, pe + cpe];
          },
          [0, 0]
        );
        useElectricCarbon = ue;
        processElectricCarbon = pe;
        const [uw, ww] = Object.entries(industry).reduce(
          ([uw, ww], [key, value]) => {
            const [cuw, cww] = calculateWaterCarbon(
              perUsage[key]?.useWater,
              perUsage[key]?.wasteWater,
              ((area * value) / 100) * 250
            );
            return [uw + cuw, ww + cww];
          },
          [0, 0]
        );
        useWaterCarbon = uw;
        wasteWaterCarbon = ww;
      } else {
        const replaceUsage = industryCrudeClassification?.[page];
        const [ue, pe] = calculateElectricCarbon(
          replaceUsage?.electric * 12 * 250,
          area
        );
        const [uw, ww] = calculateWaterCarbon(
          replaceUsage?.useWater,
          replaceUsage?.wasteWater,
          area * 250
        );
        useElectricCarbon = ue;
        processElectricCarbon = pe;
        useWaterCarbon = uw;
        wasteWaterCarbon = ww;
      }
      wasteCarbon = calculateWasteCarbon(population * 250, area * 250);
    } else if (isIntegratedDevelop) {
      const [ue] = landArray.reduce(
        ([ue], key) => {
          const [cue] = calculateElectricCarbon(
            perUsage?.[`${key}Electric`],
            (land[key] / 100) * (far[key] / 100) * area
          );
          return [ue + cue];
        },
        [0, 0]
      );
      useElectricCarbon = ue;

      const [uw, ww] = calculateWaterCarbon(
        perUsage?.useWater,
        perUsage?.wasteWater,
        population * 250
      );
      useWaterCarbon = uw;
      wasteWaterCarbon = ww;
      wasteCarbon = calculateWasteCarbon(population * 250, 0);
    }

    return {
      useElectricCarbon,
      processElectricCarbon,
      useWaterCarbon,
      wasteWaterCarbon,
      wasteCarbon,
      total:
        useElectricCarbon +
        processElectricCarbon +
        useWaterCarbon +
        wasteWaterCarbon +
        wasteCarbon,
    };
  }; // Main logic based on resultPage type
  if (resultPage === 'crude-calculate') {
    return calculateCrude();
  } else if (resultPage === 'detail-calculate') {
    return calculateDetail();
  }

  return 0; // Default return if no conditions are met
}
