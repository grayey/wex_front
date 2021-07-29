import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link, Redirect } from "react-router-dom";
import { Dropdown, Modal } from "react-bootstrap";
import Signin from "app/views/sessions/Signin";
import Signup from "app/views/sessions/Signup";
import LaddaButton, {
  XL,
  EXPAND_LEFT,
  EXPAND_RIGHT,
  EXPAND_UP,
  CONTRACT,
} from "react-ladda";

const ListeoHeaderComponent = (props) => {
  const [activeLink, setActiveLink] = useState("/");
  const [signupIsOpen, setsignUpIsOpen] = useState(false);
  const [signinIsOpen, setsigninIsOpen] = useState(false);
  const [loginOrRegister, setLoginOrRegister] = useState(false);
  const [navigate, setNavigation] = useState(false);

  const toggleSignUp = () => {
    if (signinIsOpen) {
      toggleSignIn();
    }
    setsignUpIsOpen(true);
  };

  const toggleSignIn = () => {
    if (signupIsOpen) {
      toggleSignUp();
    }
    setsigninIsOpen(true);
  };

  const loginWithEmailAndPassword = () => {
    setNavigation(!navigate);
  };
  return (
    <>
      <Modal
        show={loginOrRegister}
        onHide={() => {
          setLoginOrRegister(false);
        }}
        {...props}
        size="lg"
        id="loginOrRegisterModal"
        className="login-register-container"
      >
        <Modal.Header closeButton className="bg_public">
          <Modal.Title as={"h2"} className="text-primary">{signupIsOpen ? "Register" : "Login"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {(signupIsOpen && <Signup public={true} />) ||
            (signinIsOpen && (
              <Signin loginWithEmailAndPassword={loginWithEmailAndPassword} public={true} />
            ))}
        </Modal.Body>

        <Modal.Footer className="bg_public">
          <LaddaButton
            className="btn btn-secondary_custom border-0 mr-2 mb-2 position-relative"
            loading={false}
            progress={0.5}
            type="button"
            onClick={() => setLoginOrRegister(false)}
          >
            Close
          </LaddaButton>
        </Modal.Footer>
      </Modal>
      <header id="header-container" className="active-header">
        <div id="header" className="sticky">
          <div className="container-fluid">
            <div className="left-side">
              <div id="logo">
                <img src="/assets/images/logo.jpg" alt="Dotisense Logo" />
              </div>

              <div className="mmenu-trigger">
                <button className="hamburger hamburger--collapse" type="button">
                  <span className="hamburger-box">
                    <span className="hamburger-inner"></span>
                  </span>
                </button>
              </div>

              <nav id="navigation" className="style-1">
                <ul id="responsive">
                  {[
                    {
                      name: "Home",
                      link: "/",
                    },
                    {
                      name: "About us",
                      link: "/about",
                    },
                    {
                      name: "How it works",
                      link: "/how-it-works",
                    },
                  ].map((item) => {
                    return (
                      <li key={item.name}>
                        <Link
                          className={`${
                            activeLink == item?.link ? "current" : ""
                          }`}
                          to={item?.link}
                          onClick={() => {
                            setActiveLink(item?.link);
                          }}
                        >
                          {item?.name}
                        </Link>
                      </li>
                    );
                  })}

                  <li>
                    <a href="#">Pages</a>
                    <div className="mega-menu mobile-styles three-columns">
                      <div className="mega-menu-section">
                        <ul>
                          <li className="mega-menu-headline">Pages #1</li>
                          <li>
                            <a href="pages-user-profile.html">
                              <i className="sl sl-icon-user"></i> User Profile
                            </a>
                          </li>
                          <li>
                            <a href="pages-booking.html">
                              <i className="sl sl-icon-check"></i> Booking Page
                            </a>
                          </li>
                          <li>
                            <a href="pages-add-listing.html">
                              <i className="sl sl-icon-plus"></i> Add Listing
                            </a>
                          </li>
                          <li>
                            <a href="pages-blog.html">
                              <i className="sl sl-icon-docs"></i> Blog
                            </a>
                          </li>
                        </ul>
                      </div>

                      <div className="mega-menu-section">
                        <ul>
                          <li className="mega-menu-headline">Pages #2</li>
                          <li>
                            <a href="pages-contact.html">
                              <i className="sl sl-icon-envelope-open"></i>{" "}
                              Contact
                            </a>
                          </li>
                          <li>
                            <a href="pages-coming-soon.html">
                              <i className="sl sl-icon-hourglass"></i> Coming
                              Soon
                            </a>
                          </li>
                          <li>
                            <a href="pages-404.html">
                              <i className="sl sl-icon-close"></i> 404 Page
                            </a>
                          </li>
                          <li>
                            <a href="pages-masonry-filtering.html">
                              <i className="sl sl-icon-equalizer"></i> Masonry
                              Filtering
                            </a>
                          </li>
                        </ul>
                      </div>

                      <div className="mega-menu-section">
                        <ul>
                          <li className="mega-menu-headline">Other</li>
                          <li>
                            <a href="pages-elements.html">
                              <i className="sl sl-icon-settings"></i> Elements
                            </a>
                          </li>
                          <li>
                            <a href="pages-pricing-tables.html">
                              <i className="sl sl-icon-tag"></i> Pricing Tables
                            </a>
                          </li>
                          <li>
                            <a href="pages-typography.html">
                              <i className="sl sl-icon-pencil"></i> Typography
                            </a>
                          </li>
                          <li>
                            <a href="pages-icons.html">
                              <i className="sl sl-icon-diamond"></i> Icons
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                </ul>
              </nav>
              <div className="clearfix"></div>
            </div>
            <div className="right-side">
              <div className="header-widget">
                <a
                  href="#sign-in-dialog"
                  className="sign-in popup-with-zoom-anim"
                >
                  Invite a friend
                </a>

                {false ? (
                  <div class="user-menu">
                    <div class="user-name">
                      <span>
                        <img src="images/dashboard-avatar.jpg" alt="" />
                      </span>
                      Hi, Tom!
                    </div>
                    <ul>
                      <li>
                        <a href="dashboard.html">
                          <i class="sl sl-icon-settings"></i> Dashboard
                        </a>
                      </li>
                      <li>
                        <a href="index-2.html">
                          <i class="sl sl-icon-power"></i> Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <>
                    <div className="btn-group">
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          setLoginOrRegister(true);
                          setsignUpIsOpen(false);
                          setsigninIsOpen(true);
                        }}
                        className="button border with-icon"
                      >
                        <i className="sl sl-icon-login"></i> Login
                      </a>
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          setLoginOrRegister(true);
                          setsigninIsOpen(false);
                          setsignUpIsOpen(true);
                        }}
                        className="button border with-icon"
                      >
                        Register
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div id="sign-in-dialog" className="zoom-anim-dialog mfp-hide">
              <div className="small-dialog-header">
                <h3>Sign In</h3>
              </div>

              <div className="sign-in-form style-1">
                <ul className="tabs-nav">
                  <li className="">
                    <a href="#tab1">Log In</a>
                  </li>
                  <li>
                    <a href="#tab2">Register</a>
                  </li>
                </ul>

                <div className="tabs-container alt">
                  <div
                    className="tab-content"
                    id="tab1"
                    style={{ display: "none" }}
                  >
                    <form method="post" className="login">
                      <p className="form-row form-row-wide">
                        <label htmlFor="username">
                          Username:
                          <i className="im im-icon-Male"></i>
                          <input
                            type="text"
                            className="input-text"
                            name="username"
                            id="username"
                            value=""
                          />
                        </label>
                      </p>

                      <p className="form-row form-row-wide">
                        <label htmlFor="password">
                          Password:
                          <i className="im im-icon-Lock-2"></i>
                          <input
                            className="input-text"
                            type="password"
                            name="password"
                            id="password"
                          />
                        </label>
                        <span className="lost_password">
                          <a href="#">Lost Your Password?</a>
                        </span>
                      </p>

                      <div className="form-row">
                        <input
                          type="submit"
                          className="button border margin-top-5"
                          name="login"
                          value="Login"
                        />
                        <div className="checkboxes margin-top-10">
                          <input
                            id="remember-me"
                            type="checkbox"
                            name="check"
                          />
                          <label htmlFor="remember-me">Remember Me</label>
                        </div>
                      </div>
                    </form>
                  </div>

                  <div
                    className="tab-content"
                    id="tab2"
                    style={{ display: "none" }}
                  >
                    <form method="post" className="register">
                      <p className="form-row form-row-wide">
                        <label htmlFor="username2">
                          Username:
                          <i className="im im-icon-Male"></i>
                          <input
                            type="text"
                            className="input-text"
                            name="username"
                            id="username2"
                            value=""
                          />
                        </label>
                      </p>

                      <p className="form-row form-row-wide">
                        <label htmlFor="email2">
                          Email Address:
                          <i className="im im-icon-Mail"></i>
                          <input
                            type="text"
                            className="input-text"
                            name="email"
                            id="email2"
                            value=""
                          />
                        </label>
                      </p>

                      <p className="form-row form-row-wide">
                        <label htmlFor="password1">
                          Password:
                          <i className="im im-icon-Lock-2"></i>
                          <input
                            className="input-text"
                            type="password"
                            name="password1"
                            id="password1"
                          />
                        </label>
                      </p>

                      <p className="form-row form-row-wide">
                        <label htmlFor="password2">
                          Repeat Password:
                          <i className="im im-icon-Lock-2"></i>
                          <input
                            className="input-text"
                            type="password"
                            name="password2"
                            id="password2"
                          />
                        </label>
                      </p>

                      <input
                        type="submit"
                        className="button border fw margin-top-10"
                        name="register"
                        value="Register"
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="clearfix" ></div>
    </>
  );
};

export default ListeoHeaderComponent;
