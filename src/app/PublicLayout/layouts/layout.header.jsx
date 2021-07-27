import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";

import ScrollBar from "react-perfect-scrollbar";
import Signin from "../Signin";
import Signup from "../Signup";

// import "./assets/css/bootstrap-grid.minee72.css?v=9766dcc668";
// import "./assets/css/owl.carousel.minee72.css?v=9766dcc668"
// import "./assets/css/hamburgers.minee72.css?v=9766dcc668";
// import "./assets/css/jquery.fancybox.minee72.css?v=9766dcc668";
// import "./assets/css/screenee72.css?v=9766dcc668";

const PublicHeaderComponent = () => {
  const [signupIsOpen, setsignUpIsOpen] = useState(false);
  const [signinIsOpen, setsigninIsOpen] = useState(false);
  const [navigate, setNavigation] = useState(false);

  const toggleSignUp = () => {
    if (signinIsOpen) {
      toggleSignIn();
    }
    setsignUpIsOpen(!signupIsOpen);
  };

  const toggleSignIn = () => {
    if (signupIsOpen) {
      toggleSignUp();
    }
    setsigninIsOpen(!signinIsOpen);
  };

  const loginWithEmailAndPassword = () => {
    setNavigation(!navigate);
  };

  return navigate ? (
    <Redirect to="/dashboard/v1" />
  ) : (
    <>
      <header className="header" style={{ backgroundColor: "#eaf0f3" }}>
        {/* <div className="covid-container">
            <a href="https://info.poynt.com/covid-resources" className="covid-link"> <span style={{fontSize:"20px"}}>We<span className="text-success">X</span> </span>&nbsp;&nbsp;</a>
        </div> */}
        <div className="container">
          <nav className="main-nav">
            <a href="#0" className="search-trigger mobile-search">
              <span className="fa fa-search"></span>
            </a>
            <a href="index.html" className="nav-home">
              <img src="/assets/images/logo.png" alt="" className="site-logo" />
            </a>
            {/* <a className="nav-home" href="index.html">Home</a>
                <a className="nav-home" href="resellers/index.html">About</a> */}
            <a href="#" className="hamburger hamburger--spin">
              <div className="hamburger-box">
                <div className="hamburger-inner"></div>
              </div>
            </a>
            <div className="nav-right">
              <ul className="nav" role="menu">
                <li>
                  <a className="nav-current" href="index.html">
                    Home
                  </a>
                </li>
                <li>
                  <a href="resellers/index.html">About</a>
                </li>
                <li>
                  <a href="developers/index.html">Invite a friend</a>
                </li>

              </ul>
              <div className="split"></div>
              <a href="#0" className="search-trigger">
                <span className="fa fa-search"></span>
              </a>
              <button
                className="white-outline secondary-btn-small"
                onClick={toggleSignIn}
              >
                Log In
              </button>

              <button
                className="white-outline primary-btn-small"
                id="cta-topnav-getpoynt"
                onClick={toggleSignUp}
              >
                <i className="i-Add-User"></i> Become a Seller
              </button>
            </div>
          </nav>
        </div>
      </header>

      {signupIsOpen ? (
        <div className="login-register-container">
          <a className="close-modal" onClick={toggleSignUp}>
            X
          </a>

          <Signup />
        </div>
      ) : signinIsOpen ? (
        <div className="login-register-container">
          <a className="close-modal" onClick={toggleSignIn}>
            X
          </a>

          <Signin loginWithEmailAndPassword={loginWithEmailAndPassword} />
        </div>
      ) : null}
    </>
  );
};

export default PublicHeaderComponent;
