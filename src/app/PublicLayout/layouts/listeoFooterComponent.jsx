import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";

const ListeoFooterComponent = () => {
  return (
    <>
      <div id="footer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-5 col-sm-6">
              <img className="footer-logo" src="images/logo.png" alt="" />
              <br />
              <br />
              <p>
                Morbi convallis bibendum urna ut viverra. Maecenas quis
                consequat libero, a feugiat eros. Nunc ut lacinia tortor morbi
                ultricies laoreet ullamcorper phasellus semper.
              </p>
            </div>

            <div className="col-md-4 col-sm-6 ">
              <h4>Helpful Links</h4>
              <ul className="footer-links">
                <li>
                  <a href="#">Login</a>
                </li>
                <li>
                  <a href="#">Sign Up</a>
                </li>
                <li>
                  <a href="#">My Account</a>
                </li>
                <li>
                  <a href="#">Add Listing</a>
                </li>
                <li>
                  <a href="#">Pricing</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>

              <ul className="footer-links">
                <li>
                  <a href="#">FAQ</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Our Partners</a>
                </li>
                <li>
                  <a href="#">How It Works</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
              <div className="clearfix"></div>
            </div>

            <div className="col-md-3  col-sm-12">
              <h4>Contact Us</h4>
              <div className="text-widget">
                <span>12345 Little Lonsdale St, Melbourne</span> <br />
                Phone: <span>(123) 123-456 </span>
                <br />
                E-Mail:
                <span>
                  {" "}
                  <a href="#">office@example.com</a>{" "}
                </span>
                <br />
              </div>

              <ul className="social-icons margin-top-20">
                <li>
                  <a className="facebook" href="#">
                    <i className="icon-facebook"></i>
                  </a>
                </li>
                <li>
                  <a className="twitter" href="#">
                    <i className="icon-twitter"></i>
                  </a>
                </li>
                <li>
                  <a className="gplus" href="#">
                    <i className="icon-gplus"></i>
                  </a>
                </li>
                <li>
                  <a className="vimeo" href="#">
                    <i className="icon-vimeo"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="copyrights">
                © 2021 Dotisense. All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <div id="backtotop">
          <a href="#"></a>
        </div>

        <div id="style-switcher">
          <h2>
            Color Switcher{" "}
            <a href="#">
              <i className="sl sl-icon-settings"></i>
            </a>
          </h2>

          <div>
            <ul className="colors" id="color1">
              <li>
                <a href="#" className="main" title="Main"></a>
              </li>
              <li>
                <a href="#" className="blue" title="Blue"></a>
              </li>
              <li>
                <a href="#" className="green" title="Green"></a>
              </li>
              <li>
                <a href="#" className="orange" title="Orange"></a>
              </li>
              <li>
                <a href="#" className="navy" title="Navy"></a>
              </li>
              <li>
                <a href="#" className="yellow" title="Yellow"></a>
              </li>
              <li>
                <a href="#" className="peach" title="Peach"></a>
              </li>
              <li>
                <a href="#" className="beige" title="Beige"></a>
              </li>
              <li>
                <a href="#" className="purple" title="Purple"></a>
              </li>
              <li>
                <a href="#" className="celadon" title="Celadon"></a>
              </li>
              <li>
                <a href="#" className="red" title="Red"></a>
              </li>
              <li>
                <a href="#" className="brown" title="Brown"></a>
              </li>
              <li>
                <a href="#" className="cherry" title="Cherry"></a>
              </li>
              <li>
                <a href="#" className="cyan" title="Cyan"></a>
              </li>
              <li>
                <a href="#" className="gray" title="Gray"></a>
              </li>
              <li>
                <a href="#" className="olive" title="Olive"></a>
              </li>
            </ul>
          </div>
        </div>
      
    </>
  );
};

export default ListeoFooterComponent;
