
import React, {useState, useEffect} from "react";
// import PublicHeaderComponent from "./layouts/layout.header";
import NewLayoutHeader from "./layouts/newLayout.header";
import SeoComponent from "./layouts/seoComponent";

import AppMainService from "../../services/appMainService";
import LandingPageSearch from "../searches/landingPageSearch";
import "../searches/searches.css"
import ProductsGallery from "../products/products.gallery";







 

const NewIndexComponent = (props) =>{
    
   
    
    return (

        <>
        <SeoComponent/>
        <div className="public_view">

        <NewLayoutHeader/>

<div className="row">
  <div className="col-lg-12 col-xl-12 mb-4">
    <div className="card o-hidden">
      <div className="weather-card-1">

      <video poster="http://rollpark.us/wp-content/uploads/2018/10/hero-image.jpg" data-autoplay=""  height="700"  className="ul-weather-card__vid-overlay" autoPlay="auto" muted  playsInline="" loop="loop">
      <source src="http://rollpark.us/wp-content/uploads/2019/01/rollpark-intro.mp4" type="video/mp4" />
  </video>

        <div className="poster-content">
          {/* <div className="ul-weather-card__weather-time">
            <div className="text-white">
              <i className="i-Cloud-Sun display-4"></i> <br />
              <span className="display-5">
                30 <sup>o</sup>
              </span>
              <span>
                C /9<sup>o</sup> C
              </span>
              <p className="">SATURDAY 01.08.2019</p>
            </div>
          </div>
        */}
          <h1 className="text-white"><span className="text-success">W</span>e<span className="text-success">X</span> <br/>Waste exchange commerce</h1>
       
          <div className="main-sub-container">
                    <p className="main-subheader1 first"><strong>2.3%</strong> flat processing fee</p>
                    <p className="main-subheader1">In-store. eCommerce. Invoicing.</p>
                    <p className="main-subheader2">No Hidden Fees or Contracts. Instant Activation. Smart Terminal—Zero Up-Front Cost.</p>
                </div>
        </div>
      
      
        {/* <div className="ul-weather-card__weather-infox">
          <div className="row text-center">
            <div className="col-6 col-md-2">
              <div className="">SAT</div>
              <div className="">
                <i className="i-Cloud-Weather"></i>
              </div>
              <div className="">
                12 <sup>o</sup>C
              </div>
            </div>
            <div className="col-6 col-md-2">
              <div className="">SUN</div>
              <div className="">
                <i className="i-Cloud-Settings"></i>
              </div>
              <div className="">
                23 <sup>o</sup>C
              </div>
            </div>
            <div className="col-6 col-md-2">
              <div className="">MON</div>
              <div className="">
                <i className="i-Cloud-Weather"></i>
              </div>
              <div className="">
                17 <sup>o</sup>C
              </div>
            </div>
            <div className="col-6 col-md-2">
              <div className="">TUE</div>
              <div className="">
                <i className="i-Clouds"></i>
              </div>
              <div className="">
                23 <sup>o</sup>C
              </div>
            </div>
            <div className="col-6 col-md-2">
              <div className="">WED</div>
              <div className="">
                <i className="i-Clouds-Weather"></i>
              </div>
              <div className="">
                27 <sup>o</sup>C
              </div>
            </div>
            <div className="col-6 col-md-2">
              <div className="">THU</div>
              <div className="">
                <i className="i-Cloud-Sun"></i>
              </div>
              <div className="">
                38 <sup>o</sup>C
              </div>
            </div>
          </div>
        </div> */}
      

        <LandingPageSearch/>
      
      </div>
    </div>
  </div>

 
</div>

<div className="m-2">
   
<ProductsGallery/>

</div>

        </div>
        

      


        </>

      
    );
}


export default NewIndexComponent;