import React, { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { RedirectEntry, ShowTagComponent } from '../components';
import { CalculationContext } from '../components/CalculationContext';
import { PageContext } from '../components/PageContext';
import ResultCardItem from '../components/ResultItem';
import heroBg from '../images/hero-bg.jpg';
import { pageObject, pageResultMapping } from '../utils/Parameters';

const Result = () => {
  const { results, resetResults } = useContext(CalculationContext);

  const { resultPage, page } = useContext(PageContext);
  const navigate = useNavigate();
  const { carbonOffsetResult, carbonResult, shareParams, roadDevelop } =
    results;
  const hasCarbonOffsetResult =
    carbonOffsetResult.carbonOffsetStatus.isFinished;

  let resultKey = pageResultMapping[resultPage];
  if (hasCarbonOffsetResult) {
    resultKey = 'offset_' + resultKey;
  }

  const totalBasicEmissions = carbonResult.detail.basic.total;
  const totalEmbodiedEmissions = carbonResult.detail.embodied.total;
  const totalOperationEmissions = carbonResult.detail.operation.total;
  const totalEmissions =
    totalBasicEmissions + totalEmbodiedEmissions + totalOperationEmissions;

  const offsetTotalBasicEmissions = carbonOffsetResult.detail.basic.total;
  const offsetTotalEmbodiedEmissions = carbonOffsetResult.detail.embodied.total;
  const offsetTotalOperationEmissions =
    carbonOffsetResult.detail.operation.total;
  const offsetTotalEmissions =
    offsetTotalBasicEmissions +
    offsetTotalEmbodiedEmissions +
    offsetTotalOperationEmissions;

  const calculatePerCapitaEmissions = (totalEmissions, population) =>
    Math.round((totalEmissions / population) * 100) / 100;

  const calculateEmissionsPerUnitArea = (totalEmissions, area) =>
    Math.round((totalEmissions / area) * 100) / 100;

  const calculateReductionPercentage = (before, after) =>
    Math.round(((before - after) / before) * 100);

  // 基本輸入項目函數
  const createBasicInputs = (totalEmissions, shareParams, md = 12, style) => [
    {
      id: 'totalCarbonEmissions',
      label: '總碳排量',
      unit: '噸 CO₂e/年',
      value: totalEmissions,
      icon: 'cloud',
      md,
      style,
    },
    {
      id: 'perCapitaCarbonEmissions',
      label: '人均碳排',
      unit: '噸 CO₂e/人',
      value: calculatePerCapitaEmissions(
        totalEmissions,
        shareParams.population
      ),
      icon: 'people',
      md,
      style,
    },
    {
      id: 'carbonEmissionsPerUnitArea',
      label: '單位面積碳排',
      unit: '噸 CO₂e/公頃',
      value: calculateEmissionsPerUnitArea(totalEmissions, shareParams.area),
      icon: 'layer',
      md,
      style,
    },
  ];

  // 減碳輸入項目函數
  const createOffsetInputs = (
    totalEmissions,
    offsetEmissions,
    md = 12,
    style
  ) => [
    {
      id: 'totalCarbonEmissions',
      label: '總碳排量',
      unit: '噸 CO₂e/年',
      value: totalEmissions,
      icon: 'cloud',
      md,
      style,
    },
    {
      id: 'carbonEmissions',
      label: '減碳後碳排量',
      unit: '噸 CO₂e/年',
      value: offsetEmissions,
      icon: 'leaf',
      md,
      style,
    },
    {
      id: 'carbonEmissionsRate',
      label: '減碳百分比',
      unit: '%',
      value: calculateReductionPercentage(totalEmissions, offsetEmissions),
      icon: 'chart',
      md,
      style,
    },
  ];

  // 道路輸入項目函數
  const createRoadInputs = (carbonResult, roadDevelop) => [
    {
      id: 'totalCarbonEmissions',
      label: '總碳排量',
      unit: '噸 CO₂e/年',
      value: carbonResult.totalCarbonEmissions,
      icon: 'cloud',
      md: 6,
      condition: true,
      style: { fontSize: '2em', paddingBottom: '1%' },
    },
    {
      id: 'perKmCarbonEmissions',
      label: '每公里碳排',
      unit: '噸 CO₂e/km',
      value:
        Math.round(
          (carbonResult.totalCarbonEmissions / roadDevelop.total) * 100
        ) / 100 || 0,
      icon: 'road',
      md: 6,
      condition: true,
      style: { fontSize: '2em', paddingBottom: '1%' },
    },
  ];

  // 結果類型配置
  const resultTypes = {
    crude: {
      key: 'crudeResults',
      inputsGenerator: createBasicInputs,
    },
    detail: {
      key: 'detailResults',
      inputsGenerator: createBasicInputs,
    },
    road: {
      key: 'roadResults',
      inputsGenerator: createRoadInputs,
    },
    offset_crude: {
      key: 'offset_crudeResults',
      inputsGenerator: createOffsetInputs,
    },
    offset_detail: {
      key: 'offset_detailResults',
      inputsGenerator: createOffsetInputs,
    },
  };

  // 構建 resultConfigurations
  const resultConfigurations = {};

  Object.values(resultTypes).forEach((type) => {
    switch (type.key) {
      case 'crudeResults':
        resultConfigurations[type.key] = [
          {
            id: 'totalResults',
            label: pageObject[page],
            inputs: type.inputsGenerator(totalEmissions, shareParams, 12, {
              fontSize: '2em',
              paddingBottom: '1%',
            }),
          },
        ];
        break;
      case 'detailResults':
        resultConfigurations[type.key] = [
          {
            id: 'totalResults',
            label: '總量',
            inputs: type.inputsGenerator(totalEmissions, shareParams, 4),
          },
          {
            id: 'basicResults',
            label: '基底固碳',
            subLabel: '(規劃階段)',
            inputs: type.inputsGenerator(totalBasicEmissions, shareParams),
          },
          {
            id: 'embodiedResults',
            label: '蘊含碳',
            subLabel: '(施工階段)',
            inputs: type.inputsGenerator(totalEmbodiedEmissions, shareParams),
          },
          {
            id: 'operationResults',
            label: '營運碳',
            subLabel: '(營運階段)',
            inputs: type.inputsGenerator(totalOperationEmissions, shareParams),
          },
        ];
        break;
      case 'roadResults':
        resultConfigurations[type.key] = [
          {
            id: 'totalResults',
            label: '高快速公路',
            inputs: type.inputsGenerator(carbonResult, roadDevelop),
          },
        ];
        break;
      case 'offset_crudeResults':
        resultConfigurations[type.key] = [
          {
            id: 'totalResults',
            label: pageObject[page],
            inputs: type.inputsGenerator(
              totalEmissions,
              offsetTotalEmissions,
              4,
              { fontSize: '2em', paddingBottom: '1%' }
            ),
          },
        ];
        break;
      case 'offset_detailResults':
        resultConfigurations[type.key] = [
          {
            id: 'totalResults',
            label: '碳排結果',
            inputs: type.inputsGenerator(
              totalEmissions,
              offsetTotalEmissions,
              4
            ),
          },
          {
            id: 'basicResults',
            label: '基底固碳',
            subLabel: '(規劃階段)',
            inputs: type.inputsGenerator(
              totalBasicEmissions,
              offsetTotalBasicEmissions
            ),
          },
          {
            id: 'embodiedResults',
            label: '蘊含碳',
            subLabel: '(施工階段)',
            inputs: type.inputsGenerator(
              totalEmbodiedEmissions,
              offsetTotalEmbodiedEmissions
            ),
          },
          {
            id: 'operationResults',
            label: '營運碳',
            subLabel: '(營運階段)',
            inputs: type.inputsGenerator(
              totalOperationEmissions,
              offsetTotalOperationEmissions
            ),
          },
        ];
        break;
      default:
        break;
    }
  });

  const resultCard = resultConfigurations[resultKey];

  const handleReset = (event) => {
    event.preventDefault();
    resetResults();
    navigate('/entry');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/carbon-offset');
  };

  return (
    <main className="main">
      <RedirectEntry />
      <section id="services" className="hero services">
        <img src={heroBg} alt="background-picture" />
        <Container>
          <Row className="gy-4">
            <Col lg={12} className="text-center">
              <h2>試算結果</h2>
              {resultPage === 'detail-calculate' && (
                <ShowTagComponent page={page} />
              )}
            </Col>
            {resultCard?.map((card, index) => (
              <ResultCardItem
                key={index}
                title={card.label}
                inputs={card.inputs}
                index={card.id}
                subLabel={card.subLabel}
              />
            ))}

            {resultPage !== 'highway' && !hasCarbonOffsetResult && (
              <a
                style={{ cursor: 'pointer' }}
                id="cd-button"
                className="badge rounded-pill text-bg-main mt-5"
                onClick={handleSubmit}
              >
                <i className="fa-brands fa-pagelines" /> 碳抵減試算
              </a>
            )}
            <a
              style={{ cursor: 'pointer' }}
              className="badge rounded-pill text-bg-dark mt-5"
              onClick={handleReset}
            >
              <i className="fa-solid fa-calculator" />
              算其他項目
            </a>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Result;
