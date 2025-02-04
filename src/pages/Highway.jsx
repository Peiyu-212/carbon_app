import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Row,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CalculationContext } from '../components/CalculationContext';
import { PageContext } from '../components/PageContext';
import heroBg from '../images/hero-bg.jpg';
import { highwayCarbon } from '../utils/Parameters';

const Highway = () => {
  const navigate = useNavigate();
  const { results, setResults } = useContext(CalculationContext);
  const params = results.roadDevelop.roadRange || {
    bridge: 0,
    embank: 0,
    tunnel: 0,
  };

  const [sumDistance, setSumDistance] = useState(0);
  const { setResultPage } = useContext(PageContext);

  const rangeParameters = {
    tunnel: {
      key: '隧道',
      parameter: params.tunnel,
    },
    bridge: {
      key: '橋梁',
      parameter: params.bridge,
    },
    embank: {
      key: '路堤',
      parameter: params.embank,
    },
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setResults((prevResults) => ({
      ...prevResults,
      roadDevelop: {
        ...prevResults.roadDevelop,
        roadRange: {
          ...prevResults.roadDevelop.roadRange,
          [name]: value,
        },
      },
    }));
  };
  useEffect(() => {
    let distances = Object.values(params);
    setSumDistance(distances.reduce((a, b) => a + Number(b), 0));
  }, [JSON.stringify(params)]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const carbon = Object.entries(params).reduce(
      (sum, [key, parameter]) => sum + (parameter * highwayCarbon[key]) / 50,
      0
    );
    setResults((prevResults) => ({
      ...prevResults,
      roadDevelop: { roadRange: params, total: sumDistance },
      carbonResult: {
        ...prevResults.carbonResult,
        totalCarbonEmissions: Math.round(carbon),
      },
    }));
    setResultPage('highway');
    navigate('/result');
  };

  return (
    <main className="main">
      <section id="services" className="hero services">
        <img src={heroBg} alt="background-picture" />
        <Container>
          <Row className="gy-4">
            <div className="col-12 text-center">
              <h2>高快速公路</h2>
            </div>
            <div className="col-12">
              <Card>
                <Card.Body as="div" className="text-center">
                  <h3 className="card-title hight-light">基本資料</h3>
                  <p className="card-text pt-3"></p>
                  <p>
                    已輸入總長共
                    <span className="hight-light">{sumDistance}</span>
                    公里
                  </p>
                  <Row className="justify-content-center card-body">
                    <div className="col-md-6">
                      <Form onSubmit={handleSubmit}>
                        {Object.entries(rangeParameters).map(
                          ([key, value], index) => (
                            <InputGroup key={index} className="mb-3">
                              <InputGroup.Text id="basic-addon">
                                {value.key}長度
                              </InputGroup.Text>
                              <Form.Control
                                type="number"
                                name={key}
                                size="lg"
                                required
                                value={params?.[key]}
                                onChange={handleChange}
                              />
                              <InputGroup.Text id="basic-addon2">
                                公里
                              </InputGroup.Text>
                            </InputGroup>
                          )
                        )}
                      </Form>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
              <Row>
                <Button
                  type="submit"
                  size="lg"
                  style={{ fontWeight: '800' }}
                  className="rounded-pill text-bg-main mt-2 btn-main"
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

export default Highway;
