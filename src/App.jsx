import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import { CalculationProvider } from './components/CalculationContext.jsx';
import { PageProvider } from './components/PageContext';
import {
  FooterComponent,
  NavbarComponent,
  ScrollToTop,
} from './components/index.jsx';
import {
  CarbonOffset,
  ChooseItem,
  CrudeCalculate,
  DetailCalculate,
  Entry,
  FirstPage,
  Highway,
  Result,
  SingleCarbonOffset,
} from './pages/index.jsx';

const Layout = () => {
  const location = useLocation(); // 这里确保 useLocation 在 Router 的上下文中

  return (
    <>
      {location.pathname !== '/' && <NavbarComponent />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/entry" element={<Entry />} />
        <Route path="/item" element={<ChooseItem />} />
        <Route path="/crude-calculate" element={<CrudeCalculate />} />
        <Route path="/highway" element={<Highway />} />
        <Route path="/detail-calculate" element={<DetailCalculate />} />
        <Route path="/carbon-offset" element={<CarbonOffset />} />
        <Route path="/result" element={<Result />} />
        <Route path="/single-carbon-offset" element={<SingleCarbonOffset />} />
      </Routes>
      {/* 检查路徑是否不是根路徑，如果不是，則渲染 FooterComponent */}
      {location.pathname !== '/' && <FooterComponent />}
    </>
  );
};

const App = () => {
  return (
    <Router basename="/CarbonOracle/">
      <PageProvider>
        <CalculationProvider>
          <Layout />
        </CalculationProvider>
      </PageProvider>
    </Router>
  );
};

export default App;
