import React, { useContext } from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import favicon from '../images/favicon.png';
import { CalculationContext } from './CalculationContext';
import { PageContext } from './PageContext';

const NavbarComponent = () => {
  const navigate = useNavigate();
  const { page } = useContext(PageContext);
  const { resetResults } = useContext(CalculationContext);

  const buttonList = [
    { key: 'index', buttonIcon: 'fa-solid fa-house', router: '/' },
    { key: 'entry', buttonIcon: 'fa-solid fa-calculator', router: '/entry' },
    {
      key: 'reset',
      buttonIcon: 'fa-solid fa-arrow-rotate-right',
      router: '',
    },
  ];

  const { pathname } = useLocation();
  const pageArray = pathname.split('/');
  const pageIndex =
    page === null || pageArray[1] === 'entry'
      ? 1
      : pageArray[1] == 'item' ||
          pageArray[1] == 'result' ||
          pageArray[1] == 'single-carbon-offset' ||
          pageArray[1] == 'carbon-offset'
        ? 2
        : buttonList.length;
  return (
    <div className="page-title" data-aos="fade">
      <Container>
        <Navbar className="bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand" onClick={() => navigate('/')}>
              <img
                src={favicon}
                width="30"
                height="30"
                className="d-inline-block align-text-center"
                alt="favicon"
              />
              {''}碳先知APP
            </a>
            <div className="d-flex">
              {buttonList
                .slice(0, pageIndex)
                .map(({ key, buttonIcon, router }) => (
                  <Button
                    key={key}
                    variant="outline-dark"
                    onClick={() => {
                      resetResults();
                      if (key != 'reset') {
                        navigate(router);
                      }
                    }}
                    style={{ width: '50px', marginLeft: '5px' }}
                  >
                    <i className={buttonIcon} />
                  </Button>
                ))}
            </div>
          </div>
        </Navbar>
      </Container>
    </div>
  );
};

export default NavbarComponent;
