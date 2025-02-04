import React, { useContext } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PageContext } from '../components/PageContext';
import heroBg from '../images/hero-bg.jpg';
const Entry = () => {
  const navigate = useNavigate();
  const { setPage, setTag } = useContext(PageContext);

  const options = [
    {
      label: '園區開發',
      value: 'area-develop',
      icon: 'fa-solid fa-building-wheat',
      description: '以科學園區、產業區園區為例，試算其全生命週期碳排放量。',
      items: [
        { key: '科學園區試算', value: 'science-park' },
        { key: '產業園區試算', value: 'industrial-park' },
      ],
      router: '/item',
    },
    {
      label: '都市開發',
      value: 'integrated-develop',
      icon: 'fa-solid fa-tree-city',
      description:
        '針對區段徵收與市地重劃兩種都市開發方式，試算全生命週期碳排量。',
      items: [
        { key: '市地重劃試算', value: 'land-reconfiguration' },
        { key: '區段徵收試算', value: 'sectional-acquisition' },
      ],
      router: '/item',
    },
    {
      label: '高快速公路',
      value: 'highway',
      icon: 'fa-solid fa-road',
      description:
        '以可行性規劃階段的路、橋、隧道長度為基礎，進行工程碳排放的概算。',
      items: [{ key: '高快速公路試算', value: 'highway' }],
      router: '/highway',
    },
    {
      label: '碳抵減試算器',
      value: 'carbon-offset',
      icon: 'fa-brands fa-envira',
      description:
        '以「增加自然碳匯」及「設置再生能源」2大主要減碳作為，進行試算。',
      items: [{ key: '碳抵減試算', value: 'carbon-offset' }],
      router: '/single-carbon-offset',
    },
  ];
  return (
    <main className="main">
      <section id="services" className="hero services">
        <img src={heroBg} alt="background-picture" />
        <Container>
          <Row className="gy-4">
            <div className="col-12 text-center">
              <h2>試算項目</h2>
            </div>
            {options.map((option, index) => (
              <div
                key={index}
                className="col-md-6 col-lg-3"
                data-aos="fade-up"
                data-aos-delay={(index + 1) * 100}
              >
                <div className="service-item position-relative">
                  <div className="icon">
                    <i className={option.icon} />
                  </div>
                  <h3>{option.label}</h3>
                  <p>{option.description}</p>
                  {option.items.map((item, itemIndex) => (
                    <a
                      key={itemIndex}
                      // todo: router and parameter set
                      onClick={() => {
                        navigate(option.router);
                        setPage(item.value);
                        setTag(option.value);
                      }}
                      style={{ cursor: 'pointer' }}
                      className="badge rounded-pill text-bg-main mt-2"
                    >
                      {item.key} <i className="fa-regular fa-circle-right" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </Row>
        </Container>
      </section>
    </main>
  );
};
export default Entry;
