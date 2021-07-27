import React, { useState, useEffect, Suspense } from "react";
import { Router } from "react-router-dom";
import ListeoHeaderComponent from "./layouts/listeoHeaderComponent";
import ListeoFooterComponent from "./layouts/listeoFooterComponent";
import SeoComponent from "./layouts/seoComponent";
import { renderRoutes } from "react-router-config";
import "./layouts/assets/styles/style.css";
import "./layouts/assets/styles/main-color.css";
import "../../styles/app/app.scss";

const PublicLayoutComponent = (props) => {
 
  const { history, route } = props;

  return (
    <Suspense>
      <SeoComponent/>
      <div id="wrapper">
        <div className="clearfix"></div>
        <ListeoHeaderComponent />
        <Router history={history} {...props}>
          {renderRoutes(route.routes)}
        </Router>
        <ListeoFooterComponent />
      </div>
    </Suspense>
  );
};

export default PublicLayoutComponent;
