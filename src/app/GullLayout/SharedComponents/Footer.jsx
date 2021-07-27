import React, { Fragment } from "react";

const Footer = () => {
  return (
    <Fragment>
      <div className="flex-grow-1"></div>
      <div className="app-footer">
        <div className="row">
          <div className="col-md-9">
            <p>
              <strong>WEX Commerce</strong>
            </p>
            <p>
            Food Waste Utilization platform
            (Individuals, cooperatives, businesses)
            </p>
          </div>
        </div>
        <div className="footer-bottom border-top pt-3 d-flex flex-column flex-sm-row align-items-center">
          <a
            id="buy-gull"
            className="btn btn-primary text-white btn-rounded"
            href="https://1.envato.market/LV1va"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore
          </a>
          <span className="flex-grow-1"></span>
          <div className="d-flex align-items-center">
            <img className="logo" src="/assets/images/logo.png" alt="" />
            <div>
              <p className="m-0">&copy; 2021 WEX</p>
              <p className="m-0">All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Footer;
