import React, { Component, useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import ProductDetails from "./products.details";


import AppMainService from "../../services/appMainService";
import * as utils from "@utils";
import AppNotification from "../../appNotifications";

const appMainService = new AppMainService();

const PublicProductView = (props) => {
  const [viewedProduct, setViewedProduct] = useState({});
  const [isFetching, setFetching] = useState(false);
  const [navigationUrl, setNavigationUrl] = useState("");
  const [breadCrumbs, setBreadCrumbs] = useState([]);

  useEffect(() => {
    getProductBySlug();
  }, []);

  const getProductBySlug = () => {
    const params = props.match.params;
    const { slug } = params;

    setFetching(true);

    appMainService
      .getProductById(slug)
      .then((productResponse) => {
        setViewedProduct(productResponse);
        setFetching(false);
      })
      .catch((error) => {
        setFetching(false);
        const errorNotification = {
          type: "error",
          msg: utils.processErrors(error),
        };
        new AppNotification(errorNotification);
        return setNavigationUrl("session/404");
      });
  };

  return navigationUrl ? (
    <Redirect to={navigationUrl} />
  ) : (
    <>
      
      <div className="public_view m-2">
        <ProductDetails caller="public" viewedProduct={viewedProduct} />
      </div>
    </>
  );
};

export default PublicProductView;
