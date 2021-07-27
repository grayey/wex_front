import React, { useState, useEffect } from "react";
// import PublicHeaderComponent from "./layouts/layout.header";
import AppMainService from "../../services/appMainService";

import Select from "react-select";
import { FaSearch } from "react-icons/fa";
// import "./searches.css";


const LandingPageSearch = (props) => {
  const [activeDiv, setActiveDiv] = useState("");
  const [selectedOption, setSelection] = useState(null);
  const { allCategories } = props;


  const setActive = (divId) => {
    setActiveDiv(divId);
  };

  const handleChange = (option) => {
    const { label, value } = option;
    setSelection({ label, value });
  };



  return (
    <>
      <div className="main-search-input">

        <div className="main-search-input-item location">
          <div id="autocomplete-container">
            <input id="autocomplete-input" type="text" placeholder="Location" />
          </div>
          <a href="#">
            <i className="fa fa-map-marker"></i>
          </a>
        </div>

        <div className="main-search-input-item">
          <Select
            value={selectedOption}
            onChange={handleChange}
            options={allCategories}
            placeholder="What type of Product?"
          />
        </div>

        <div className="main-search-input-item">
          <input type="number" placeholder="Quantity (kg)" value="" />
        </div>

        <div className="main-search-input-item">
          <input type="number" placeholder="Price (per kg)" value="" />
        </div>

        <button className="button">
          <FaSearch /> Search
        </button>
      </div>

     
    </>
  );
};

export default LandingPageSearch;



{/* <section className="app-search ">
<div className="row">
  <div className="col-md-1"></div>

  <div className="col-md-9">
    <div className="card shadow pr-2 pl-1">
      <div className="row">
        <div
          className={`col-md-4  search-field ${
            activeDiv == "product_loc" ? "active_field" : ""
          }`}
          id="product_loc"
        >
          <label>Location</label>
          <input
            className="form-control"
            onClick={() => {
              setActive("product_loc");
            }}
            placeholder="Where is the item?"
          />
        </div>
        <div
          className={`col-md-3  search-field ${
            activeDiv == "product_cat" ? "active_field" : ""
          }`}
          id="product_cat"
          onClick={() => {
            setActive("product_cat");
          }}
        >
          <label>Category</label>

          <Select
            value={selectedOption}
            onChange={handleChange}
            options={allCategories}
            placeholder="What type of Product?"
          />
        </div>
        <div
          className={`col-md-3  search-field no-right ${
            activeDiv == "product_qty" ? "active_field" : ""
          }`}
          id="product_qty"
        >
          <label>Quantity</label>

          <input
            className="form-control"
            onClick={() => {
              setActive("product_qty");
            }}
            type="number"
            placeholder="Weight in  kg"
          />
        </div>
        <div className="col-md-2 mt-3 mb-2">
          <button
            className="search_btn btn float-right"
            target="_blank"
            id="cta-home-hero-getpoyntx"
          >
            <FaSearch />
            &nbsp; Search
          </button>
        </div>
      </div>
    </div>
  </div>

  <div className="col-md-2"></div>
</div>
</section> */}
