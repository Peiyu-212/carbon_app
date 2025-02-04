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
  landParameter,
  population,
} from '../utils/Parameters';

const CrudeCalculate = () => {
  const navigate = useNavigate();
  const { page, tag, resultPage } = useContext(PageContext);
  const { results, setResults } = useContext(CalculationContext);
  const details = results.shareParams;
  const [showAreaWarning, setShowAreaWarning] = useState(false);

  const defaultValues = {
    area: details.area,
    population: population?.[page] * details.area,
    land: landParameter[page],
    far: farParameter[page],
    industry: {},
    buildingCoverageRate: buildingCoverageParameter?.[page],
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setResults((prevResults) => ({
      ...prevResults,
      shareParams: {
        ...prevResults.shareParams,
        [name]: value,
      },
    }));
  };

  useEffect(() => {
    setShowAreaWarning(details.area == 0);
  }, [details.area]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const basic = CarbonBasicFunction({ results: defaultValues, page });
    const embodied = CarbonEmbodiedFunction({
      results: defaultValues,
      page,
    });
    const operation = CarbonOperationFunction({
      results: defaultValues,
      page,
      tag,
      resultPage,
    });
    setResults((prevResults) => ({
      ...prevResults,
      shareParams: defaultValues,
      carbonResult: {
        ...prevResults.carbonResult,
        detail: { basic, embodied, operation },
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
              <h2>一鍵概算</h2>
              <ShowTagComponent page={page} />
            </div>
            <div className="col-12">
              <Card>
                <Card.Body as="div" className="text-center">
                  <h3 className="card-title hight-light">輸入面積</h3>
                  <Row className="justify-content-center card-body">
                    <div className="col-md-6">
                      <Form onSubmit={handleSubmit}>
                        <InputGroup className="mb-3">
                          <Form.Control
                            placeholder="開發面積"
                            type="number"
                            name="area"
                            size="lg"
                            required
                            value={details.area}
                            onChange={handleChange}
                            isInvalid={showAreaWarning}
                            min={0}
                            step={1}
                          />
                          <InputGroup.Text id="basic-addon2">
                            公頃
                          </InputGroup.Text>
                          <Form.Control.Feedback type="invalid">
                            面積為必填
                          </Form.Control.Feedback>
                        </InputGroup>
                        <Button
                          type="submit"
                          size="lg"
                          style={{ fontWeight: '800' }}
                          className="rounded-pill text-bg-main mt-2 btn-main"
                          onClick={handleSubmit}
                          disabled={showAreaWarning}
                        >
                          NEXT <i className="fa-regular fa-circle-right" />
                        </Button>
                      </Form>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default CrudeCalculate;
