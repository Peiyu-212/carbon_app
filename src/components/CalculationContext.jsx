import PropTypes from 'prop-types';
import React, { createContext, useState } from 'react';

export const CalculationContext = createContext({
  photovoltaicResult: null,
  setPhotovoltaicResult: () => {},
  carbonResult: null,
  setCarbonResult: () => {},
  carbonOffsetResult: null,
  setCarbonOffsetResult: () => {},
});

export const resultsDefault = {
  photovoltaicResult: {
    totalInstallerdCapacity: null,
    totalElectricityProduction: null,
    totalCarbonReduction: null,
  },
  shareParams: {
    area: 0,
    population: 0,
    land: {
      parkLand: 0,
      house: 0,
      commercial: 0,
    },
    far: {
      parkLand: 0,
      house: 0,
      commercial: 0,
    },
    industry: { high: 0, mediumHigh: 0, medium: 0, low: 0 },
    buildingCoverageRate: {
      parkLand: 0,
      house: 0,
      commercial: 0,
    }, //建蔽率
  },
  roadDevelop: {
    roadRange: { bridge: 0, embank: 0, tunnel: 0 },
    total: 0,
  },
  carbonResult: {
    detail: { basic: {}, embodied: {}, operation: {} },
    totalCarbonEmissions: null,
    perCapitaCarbonEmissions: null,
    carbonEmissionsPerUnitArea: null,
  },
  carbonOffsetResult: {
    detail: { basic: {}, embodied: {}, operation: {} },
    carbonOffsetStatus: { isFinished: null },
  },
};

export const CalculationProvider = ({ children }) => {
  const [results, setResults] = useState(resultsDefault);
  const resetResults = () => {
    const deepCopyResultsDefault = JSON.parse(JSON.stringify(resultsDefault));
    setResults(deepCopyResultsDefault);
  };
  return (
    <CalculationContext.Provider
      value={{
        results,
        setResults,
        resetResults,
      }}
    >
      {children}
    </CalculationContext.Provider>
  );
};

CalculationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
