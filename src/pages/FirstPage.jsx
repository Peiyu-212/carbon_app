import React, { useContext } from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PageContext } from '../components/PageContext';
import favicon from '../images/favicon.png';
import heroBg from '../images/hero-bg.jpg';

const FirstPage = () => {
  const navigate = useNavigate();
  const { setPage } = useContext(PageContext);

  return (
    <main className="main">
      {/* Hero Section */}
      <section id="startpage" className="hero section light-background">
        <img src={heroBg} alt="background-picture" />
        <Container data-aos="zoom-out">
          <Row className="justify-content-center">
            <div className="col-lg-9" id="logo">
              <img src={favicon} />
              <h2> 碳先知APP</h2>
              <p className="text-white" style={{ fontSize: '2em' }}>
                Carbon Oracle APP
              </p>
              <span className="badge bg-main m-2">V1.0.0</span>
              <p className="text-white">
                在園區及都市開發工程生命週期的前期進行碳排及減碳估算
              </p>
            </div>

            <div className="col-lg-9">
              <Button
                className="btn-main p-2 mt-5"
                style={{ fontSize: '1.5em' }}
                onClick={() => {
                  navigate('/entry');
                  setPage('entry');
                }}
              >
                Get Started{' '}
                <i className="fa-solid fa-magnifying-glass-arrow-right" />
              </Button>
            </div>
            <div className="col-lg-9" style={{ marginTop: '50px' }}>
              <p
                style={{
                  paddingTop: '30%',
                  fontSize: '1em',
                }}
                className="text-white"
              >
                若您在使用本APP有任何建議與反饋，歡迎與我們聯繫：
                <br />
                中興公司園路部永續中心
                <br />
                王珮琪副理
                <br />
                <i className="fa-regular fa-envelope" />{' '}
                piggywang@mail.sinotech.com.tw
                <br />
                許智修副理
                <br />
                <i className="fa-regular fa-envelope" />{' '}
                hung@mail.sinotech.com.tw
              </p>
              <p
                style={{
                  paddingTop: '30px',
                  fontSize: '0.8em',
                }}
                className="text-white"
              >
                版權聲明 |
                本網站內容版權所有，未經書面許可禁止複製、散佈、修改或商業使用，引用請聯繫授權。
                <br />
                免責聲明 |
                本網站所提供的資訊主要基於公司自身經驗及政府公開資料進行估算，僅供參考之用。
                <br />
                總指導：曹以強協理、王珮琪副理；碳估算：許智修副理、康聿萱、王治嘉；程式開發：蔡達煜、鍾佩瑜、陳逸歆。
              </p>
              <p
                style={{
                  paddingTop: '5px',
                  fontSize: '1em',
                }}
                className="text-white"
              >
                Copyright © 中興工程顧問股份有限公司
                <br />
                園區及路航工程部 2024
              </p>
            </div>
          </Row>
        </Container>
      </section>
      {/* /Hero Section */}
    </main>
  );
};

export default FirstPage;
