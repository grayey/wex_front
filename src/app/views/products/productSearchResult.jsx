import React, { useState, useEffect } from "react";
import { APP_ENVIRONMENT } from "../../environment/environment";
import { RenderMap } from "../../appWidgets";

const mapBoxId = "MAP_BOX";

const ProductSearchResult = (props) => {
  const mapOptions = {
    container: mapBoxId,
    zoom: 200,
  };

  useEffect(() => {
    const mapBox = RenderMap(mapOptions);
  }, []);
  return (
    <>
      <div className="row">
        <div className="col-6">
          <div>Product search result page</div>
        </div>
        <div className="col-6">
          <div style={{ height: "100vh" }} id={mapBoxId}></div>
        </div>
      </div>
    </>
  );
};

export default ProductSearchResult;
