import React, { useContext } from 'react';
import { Card, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { RedirectEntry, ShowTagComponent } from '../components';
import { PageContext } from '../components/PageContext';
import heroBg from '../images/hero-bg.jpg';

const ChooseItem = () => {
  const navigate = useNavigate();
  const { page, setResultPage } = useContext(PageContext);
  const steps = {
    'crude-calculate': {
      icon: 'fa-solid fa-jet-fighter',
      title: ' 一鍵概算',
      description:
        '依中興公司50年工程規劃設計經驗值，一鍵輸入進行總碳排量概算。',
    },
    'detail-calculate': {
      icon: 'fa-solid fa-file-pen',
      title: ' 分類估算',
      description:
        '依個案性質，自行輸入參數，分別估算基底固碳、蘊含碳、營運碳。',
    },
  };

  return (
    <main className="main">
      <RedirectEntry />
      <section id="services" className="hero services">
        <img src={heroBg} alt="background-picture" />
        <Container>
          <Row className="gy-4">
            <div className="col-12 text-center">
              <h2>計算方式</h2>
              <ShowTagComponent page={page} />
            </div>
            {Object.entries(steps).map(([key, value], index) => (
              <div key={key} className="col-sm-6 mb-3 mb-sm-0">
                <Card>
                  <Card.Body>
                    <h3 className="card-title hight-light">
                      <i className={value.icon} />
                      {value.title}
                    </h3>
                    <Card.Text>{value.description}</Card.Text>
                    <a
                      key={index}
                      // todo: router and parameter set
                      onClick={() => {
                        navigate(`/${key}`);
                        setResultPage(key);
                      }}
                      style={{ cursor: 'pointer' }}
                      className="badge rounded-pill text-bg-main mt-2"
                    >
                      GO <i className="fa-regular fa-circle-right" />
                    </a>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default ChooseItem;
