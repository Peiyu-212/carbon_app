import React from 'react';

const FooterComponent = () => {
  return (
    <footer id="footer" className="footer position-relative text-start">
      <div className="container">
        <div className="text-start mb-3">
          <span>
            版權聲明 |
            本網站內容版權所有，未經書面許可禁止複製、散佈、修改或商業使用，引用請聯繫授權。
            <br />
            免責聲明 |
            本網站所提供的資訊主要基於公司自身經驗及政府公開資料進行估算，僅供參考之用。
          </span>
        </div>
        <div className="copyright">
          <span>
            Copyright © 中興工程顧問股份有限公司 園區及路航工程部2024
          </span>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
