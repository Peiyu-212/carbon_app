import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { RedirectEntry, ShowTagComponent } from '../components';
import { CalculationContext } from '../components/CalculationContext';
import { CarbonBasicFunction } from '../components/CarbonBasicFunction';
import { CarbonEmbodiedFunction } from '../components/CarbonEmbodiedFunction';
import { CarbonOperationFunction } from '../components/CarbonOperationFunction';
import { PageContext } from '../components/PageContext';
import heroBg from '../images/hero-bg.jpg';
import {
  buildingCoverageParameter,
  farParameter,
  industryDetailClassification,
  landParameter,
  population,
} from '../utils/Parameters';

const DetailCalculate = () => {
  const { results, setResults } = useContext(CalculationContext);
  const { page, tag } = useContext(PageContext);
  const detail = results.shareParams;
  const [industryTotal, setIndustryTotal] = useState(0);
  const [showAreaWarning, setShowAreaWarning] = useState(false);
  const [industry, setIndustry] = useState(detail.industry);

  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const newTotal = Object.values(industry).reduce(
      (sum, value) => sum + parseInt(value || 0),
      0
    );
    setIndustryTotal(newTotal);
    setShowWarning(newTotal > 100);
  }, [industry]);

  useEffect(() => {
    setShowAreaWarning(detail.area == 0);
  }, [detail.area]);

  const landCol = {
    'area-develop': [{ key: 'parkLand', title: '產業' }],
    'integrated-develop': [
      { key: 'house', title: '住宅' },
      { key: 'commercial', title: '商業' },
    ],
  };

  const colSet = landCol[tag];
  const replaceZeroValues = (obj1, obj2) => {
    Object.keys(obj1).forEach((key) => {
      if (obj1[key] == 0) {
        obj1[key] = obj2[key];
      }
    });
    return obj1;
  };

  const handleChange = (event, key) => {
    const { name, value } = event.target;
    const isNestedField = [
      'industry',
      'far',
      'land',
      'buildingCoverageRate',
    ].includes(name);
    setResults((prevResults) => {
      const updatedShareParams = {
        ...prevResults.shareParams,
        ...(isNestedField
          ? {
              [name]: {
                ...prevResults.shareParams[name],
                [key]: value,
              },
            }
          : {
              [name]: value,
            }),
      };

      return {
        ...prevResults,
        shareParams: updatedShareParams,
      };
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const defaultValues = {
      area: detail.area,
      population:
        detail.population != 0
          ? detail.population
          : population?.[page] * detail.area,
      land: replaceZeroValues(detail.land, landParameter?.[page]),
      far: replaceZeroValues(detail.far, farParameter?.[page]),
      industry: industryTotal == 0 ? {} : industry,
      buildingCoverageRate: replaceZeroValues(
        detail.buildingCoverageRate,
        buildingCoverageParameter?.[page]
      ),
    };
    const basic = CarbonBasicFunction({ results: defaultValues, page });
    const embodied = CarbonEmbodiedFunction({
      results: defaultValues,
      page,
    });
    const operation = CarbonOperationFunction({
      results: defaultValues,
      page,
      tag,
      resultPage: 'detail-calculate',
    });
    setResults((prevResults) => ({
      ...prevResults,
      shareParams: defaultValues,
      carbonResult: {
        detail: {
          basic,
          embodied,
          operation,
        },
      },
    }));
    navigate('/result');
  };
  return (
    <main className="main">
      <RedirectEntry />
      <section id="services" className="hero services">
        <img src={heroBg} alt="background-picture" />
        <Container>
          <Row className="gy-4">
            <div className="col-12 text-center">
              <h2>分類輸入</h2>
              <ShowTagComponent page={page} />
            </div>
            <div className="col-12">
              <Card>
                <Form type="submit" onSubmit={handleSubmit}>
                  <Card.Body className="text-center">
                    {/* Input Area Section */}
                    <h3 className="card-title hight-light">輸入面積</h3>
                    <div className="pt-3">
                      <Row className="justify-content-center">
                        <Col md={6}>
                          <InputGroup className="mb-3">
                            <Form.Control
                              required
                              type="number"
                              placeholder="開發面積"
                              name="area"
                              value={detail?.area || ''}
                              min={0}
                              isInvalid={showAreaWarning}
                              onChange={(e) => handleChange(e, 'area')}
                              step={1}
                            />{' '}
                            <InputGroup.Text>公頃</InputGroup.Text>{' '}
                            <Form.Control.Feedback type="invalid">
                              面積為必填
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Col>
                      </Row>
                    </div>

                    {/* Parameter Adjustment Section */}
                    <h3 className="card-title hight-light">參數調整</h3>
                    <div className="pt-3">
                      <Row className="justify-content-center">
                        <Col md={6}>
                          <InputGroup className="mb-3">
                            <InputGroup.Text>
                              {tag == 'area-develop' ? '就業' : '居住'}人口
                            </InputGroup.Text>
                            <Form.Control
                              type="number"
                              name="population"
                              min={0}
                              value={detail?.population || ''}
                              onChange={(e) => handleChange(e, 'population')}
                            />
                            <InputGroup.Text>人</InputGroup.Text>
                          </InputGroup>
                        </Col>
                      </Row>

                      {/* Land Rate Section */}

                      <p style={{ fontSize: '1.5em' }}>
                        {tag == 'area-develop' ? '產業用地' : '各類用地占比'}
                      </p>

                      <Row className="justify-content-center">
                        {colSet?.map((item, index) => (
                          <Col md={4} key={index}>
                            <InputGroup className="mb-3">
                              <InputGroup.Text>
                                {tag == 'area-develop'
                                  ? `用地占比`
                                  : `${item.title}`}
                              </InputGroup.Text>
                              <Form.Control
                                type="number"
                                key={`${item.key}-landRate`}
                                name="land"
                                min={0}
                                value={detail.land[item.key] || ''}
                                onChange={(e) => handleChange(e, item.key)}
                              />
                              <InputGroup.Text>%</InputGroup.Text>
                            </InputGroup>
                          </Col>
                        ))}
                      </Row>
                      {/* Coverage Rate Section */}
                      {tag == 'integrated-develop' && (
                        <p style={{ fontSize: '1.5em' }}>各類用地建蔽率</p>
                      )}
                      <Row className="justify-content-center">
                        {colSet?.map((item, index) => (
                          <Col md={4} key={index}>
                            <InputGroup className="mb-3">
                              <InputGroup.Text>
                                {tag == 'area-develop'
                                  ? `建蔽率`
                                  : `${item.title}`}
                              </InputGroup.Text>
                              <Form.Control
                                type="number"
                                key={`${item.key}-buildingCoverRate`}
                                name="buildingCoverageRate"
                                min={0}
                                value={
                                  detail.buildingCoverageRate[item.key] || ''
                                }
                                onChange={(e) => handleChange(e, item.key)}
                              />
                              <InputGroup.Text>%</InputGroup.Text>
                            </InputGroup>
                          </Col>
                        ))}
                      </Row>

                      {/* Floor Area Ratio Section */}
                      {tag == 'integrated-develop' && (
                        <p style={{ fontSize: '1.5em' }}>各類用地容積率</p>
                      )}
                      <Row className="justify-content-center">
                        {colSet?.map((item, index) => (
                          <Col md={4} key={index}>
                            <InputGroup className="mb-3">
                              <InputGroup.Text>
                                {tag == 'area-develop'
                                  ? `容積率`
                                  : `${item.title}`}
                              </InputGroup.Text>
                              <Form.Control
                                type="number"
                                key={`${item.key}-far`}
                                name="far"
                                value={detail?.far[item.key] || ''}
                                onChange={(e) => handleChange(e, item.key)}
                              />
                              <InputGroup.Text>%</InputGroup.Text>
                            </InputGroup>
                          </Col>
                        ))}
                      </Row>
                      {/* Industrial Land Ratio Section */}
                      {tag == 'area-develop' && (
                        <>
                          <p style={{ fontSize: '1.5em' }}>
                            各類產業用地占比(總計{industryTotal}%)
                          </p>
                          <Row className="justify-content-center">
                            {industryDetailClassification &&
                              Object.entries(industryDetailClassification)?.map(
                                ([key, value], index) => (
                                  <Col md={3} key={index} className="mt-2">
                                    <InputGroup>
                                      <InputGroup.Text>
                                        {value.labelName}
                                      </InputGroup.Text>
                                      <Form.Control
                                        type="text"
                                        name="industry"
                                        value={industry?.[key] || ''}
                                        onChange={(e) => {
                                          setIndustry({
                                            ...industry,
                                            [key]: e.target.value,
                                          });
                                          handleChange(e, key);
                                        }}
                                      />
                                      <InputGroup.Text>%</InputGroup.Text>
                                    </InputGroup>
                                    <span>註： {value.spanName}</span>
                                  </Col>
                                )
                              )}
                          </Row>
                        </>
                      )}
                      {showWarning && (
                        <p className="text-danger">請檢查產業別占比須為100%</p>
                      )}
                    </div>
                  </Card.Body>
                </Form>
              </Card>
              {/* GO Button */}
              <Row className="justify-content-center">
                <Button
                  className="rounded-pill text-bg-main mt-2 m-5 shadow btn-main"
                  disabled={showWarning || showAreaWarning}
                  onClick={handleSubmit}
                >
                  GO <i className="fa-regular fa-circle-right" />
                </Button>
              </Row>
            </div>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default DetailCalculate;
