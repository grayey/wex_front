import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";

import PublicHeaderComponent from "./layouts/layout.header";
// import NewLayoutHeader from "./layouts/newLayout.header";

import AppMainService from "../../services/appMainService";

import Select from "react-select";
import ProductsGallery from "../products/products.gallery";

const appMainService = new AppMainService();

const IndexComponent = () => {
  const [activeDiv, setActiveDiv] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [selectedOption, setSelection] = useState(null);
  const [navigationUrl, setNavigationUrl] = useState("");

  useEffect(() => {
    getAllCategories();
  }, []);

  const setActive = (divId) => {
    setActiveDiv(divId);
  };

  const viewProduct = (product) => {
    const url = `product/${product.slug}`;
    setNavigationUrl(url);
  };

  const handleChange = (option) => {
    const { label, value } = option;
    setSelection({ label, value });
  };

  const getAllCategories = async () => {
    appMainService
      .getAllCategories()
      .then((categoriesResponse) => {
        const allCategories = categoriesResponse
          .filter((cat) => cat.status)
          .map((c) => {
            c.value = c._id;
            c.label = c.name;
            return c;
          });
        setAllCategories(allCategories);
      })
      .catch((error) => {
        console.log("Categories error", error);
      });
  };

  return navigationUrl ? (
    <Redirect to={navigationUrl} />
  ) : (
    <>
      <div className="site-wrapper">
        <PublicHeaderComponent />
        <section className="main-screen herox">
          <div className="video-container">
            <div
              className="video"
              style={{
                backgroundImage:
                  "url(../d85ecz8votkqa.cloudfront.net/images/booynt/hero_image.jpg)",
              }}
            >
              {/* <video autoPlay="autoplay" loop="loop" muted>
                        <source src="https://d85ecz8votkqa.cloudfront.net/images/booynt/Home_hero_A_resized_1680x720.mp4" type="video/mp4"/>
                    </video> */}

              <video
                poster="http://rollpark.us/wp-content/uploads/2018/10/hero-image.jpg"
                data-autoplay=""
                className="video-short"
                autoPlay="auto"
                muted
                playsInline=""
                loop="loop"
              >
                <source
                  src="http://rollpark.us/wp-content/uploads/2019/01/rollpark-intro.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>

          <div className="item">
            <div className="container">
              <h1 className="homepage-title max-width">
                <span className="text-success">W</span>e
                <span className="text-success">X</span> <br />
                Waste exchange commerce
              </h1>
              <div className="main-sub-container">
                <p className="main-subheader1 first">
                  <strong>2.3%</strong> flat processing fee
                </p>
                <p className="main-subheader1">
                  In-store. eCommerce. Invoicing.
                </p>
                <p className="main-subheader2">
                  No Hidden Fees or ContractsNEW. Instant Activation. Smart
                  Terminal—Zero Up-Front Cost.
                </p>
              </div>
              {/* <a href="https://get.poynt.com/signup" className="secondary-btn-large" id="cta-home-hero-learnmore">Learn more</a>
                        <a href="https://signup.poynt.com/" className="primary-btn-large" target="_blank" id="cta-home-hero-getpoynt">Register</a> */}
            </div>
          </div>
        </section>

        <section className="app-search container">
          <div className="row">
            <div className="col-md-1"></div>

            <div className="col-md-9">
              <div className="card shadow">
                <div className="row">
                  <div
                    className={`col-md-4  search-field border-right ${
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
                    className={`col-md-3  search-field border-right ${
                      activeDiv == "product_cat" ? "active_field" : ""
                    }`}
                    id="product_cat"
                    onClick={() => {
                      setActive("product_cat");
                    }}
                  >
                    <label>Category</label>
                    {/* <select className="form-control " onClick={()=>{setActive('product_cat')}}>
                                        <option value="" className="text-muted category_list">What type of product?</option>

                                        {
                                          allCategories.length ?  allCategories.map((category)=>{
                                                return (
                                                    <option key={category?._id} className="category_list">{category?.name}</option>

                                                )
                                            }) :

                                            (
                                                <option value="" disabled className="text-muted category_list">No availble category.</option>
                                            )

                                        }
                                        
                                    </select> */}

                    <Select
                      value={selectedOption}
                      onChange={handleChange}
                      options={allCategories}
                      placeholder="What type of Product?"
                    />
                  </div>
                  <div
                    className={`col-md-3  search-field ${
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
                  <div className="col-md-2 mt-4">
                    <button
                      className="primary-btn-largex float-right"
                      target="_blank"
                      id="cta-home-hero-getpoyntx"
                    >
                      <i className="search-icon i-Magnifi-Glass1"></i>&nbsp;
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-2"></div>
          </div>
        </section>

        <div className="m-2">
          <ProductsGallery viewProduct={(product) => viewProduct(product)} />
        </div>

        <section className="bg-light-blue">
          <div className="container">
            <div className="row d-flex align-items-center bottom-padding">
              <div className="col-md-6 text-center order-md-2 order-sm-1 img-padding-l img-sm-padding-b img-sm-margin-lr">
                <img
                  src="../d85ecz8votkqa.cloudfront.net/images/poyntdotcom/products/processing2.png"
                  alt="A laptop displaying Poynt HQ and a Poynt terminal"
                />
              </div>
              <div className="col-md-6 d-flex align-items-center order-md-1 order-1">
                <div>
                  <h2>It's everything you need to run your business</h2>
                  <ul className="checklist-blue">
                    <li>Best-in-className payment processing</li>
                    <li>
                      Software to power your business: Invoices, Ecommerce,
                      Virtual Terminal, Register & more
                    </li>
                    <li>Choice of Smart Terminal to suit your needs</li>
                    <li>Business activity monitoring & management tools</li>
                    <li>3rd party business apps for various industries</li>
                    <li>Integration with your favorite accessories</li>
                    <li>Access to merchant cash advances</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row d-flex align-items-center no-top-padding">
              <div className="feature-items col-md-8 offset-md-2 order-md-2 order-2">
                <div className="feature-item">
                  <div className="fi-img">
                    <img
                      src="https://d85ecz8votkqa.cloudfront.net/images/poyntdotcom/icons/icons_instantactivation.svg"
                      alt="Instant Activation icon"
                    />
                  </div>
                  <div className="fi-header">Instant Activation</div>
                </div>
                <div className="feature-item">
                  <div className="fi-img">
                    <img
                      src="https://d85ecz8votkqa.cloudfront.net/images/poyntdotcom/icons/icons_nextdayfunding.svg"
                      alt="Next-day Funding icon"
                    />
                  </div>
                  <div className="fi-header">Next-day Funding</div>
                </div>
                <div className="feature-item">
                  <div className="fi-img">
                    <img
                      src="https://d85ecz8votkqa.cloudfront.net/images/poyntdotcom/icons/icons_expertsupport.svg"
                      alt="Expert Support 24/7 icon"
                    />
                  </div>
                  <div className="fi-header">Expert Support 24/7</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-1">
          <div className="container">
            <div className="row align-content-center">
              <div className="col-md-6 d-flex align-items-center order-md-2 order-2">
                <div>
                  <h2>Enjoy industry-disrupting rates</h2>
                  <p>
                    We offer fair, transparent pricing with zero hidden fees
                    (i.e. activation, interchange, assessment, inactivity or
                    cancellation).
                  </p>
                </div>
              </div>
              <div className="col-md-6 text-center d-flex align-items-center order-md-1d-1 order-1">
                <img
                  src="../d85ecz8votkqa.cloudfront.net/images/poyntdotcom/products/industryrates3.png"
                  alt="A payment processing unit"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="b-offers merchant-section-1 bg-light-blue">
          <div className="container">
            <div className="row align-content-center">
              <div className="col-md-6 d-flex align-items-center order-md-1d-1 order-1">
                <div>
                  <h2>Select the right software bundle for your business</h2>
                </div>
              </div>
              <div className="col-md-6 text-center order-md-2 order-2">
                <div className="bundles">
                  <div id="bundlesModalBtn1" className="bundle bundle-advanced">
                    <div className="bundle-header text-white">Advanced</div>
                    <div className="bundle-text">$30/month</div>
                    <div className="bundle-subheader">
                      <i>(includes hardware)</i>
                    </div>
                    <div className="bundle-features">
                      <button className="features-btn">
                        Click to see all features
                      </button>
                    </div>
                  </div>
                  <div id="bundlesModalBtn2" className="bundle bundle-premium">
                    <div className="bundle-header text-white">Premium</div>
                    <div className="bundle-text">$50/month</div>
                    <div className="bundle-subheader">
                      <i>(includes hardware)</i>
                    </div>
                    <div className="bundle-features">
                      <button className="features-btn btn-dark-bg">
                        Click to see all features
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="row align-content-center">
              <div className="col-md-6 order-md-1d-1 order-1 d-flex align-items-center img-sm-padding-b">
                <img
                  className="img-padding-sm-r"
                  src="../d85ecz8votkqa.cloudfront.net/images/poyntdotcom/products/choiceofterminal.png"
                  alt="3 types of payment processing units"
                />
              </div>
              <div className="col-md-6 d-flex align-items-center order-md-2 order-2">
                <div>
                  <h2>Choose the Smart Terminal that's right for you</h2>
                  <p>
                    Our all-in-one solution includes beautiful hardware built
                    around amazing software.
                  </p>
                  <a
                    href="features/index.html#hardware"
                    className="learn-more-link"
                  >
                    Learn more
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-light-blue">
          <div className="container">
            <div className="row align-content-center">
              <div className="col-md-6 d-flex align-items-center order-md-1 order-2">
                <div>
                  <h2>Run your business from anywhere with Poynt HQ</h2>
                  <p>
                    Monitor real-time activity and manage your business from any
                    device.
                  </p>
                </div>
              </div>
              <div className="col-md-6 text-center d-flex align-items-center order-md-2 order-1 img-sm-padding-b img-sm-margin-lr">
                <img
                  src="../d85ecz8votkqa.cloudfront.net/images/booynt/1_Home_For%20Merchants%20Page/Home_HQ_web_mobile_3x.png"
                  alt="The online HQ for Poynt's payment processing unit"
                />
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="row align-content-center">
              <div className="col-md-6 text-center order-md-1 order-1 img-sm-padding-b">
                <img
                  src="../d85ecz8votkqa.cloudfront.net/images/poyntdotcom/products/appcenter.png"
                  alt="Poynt terminal and various App Center apps"
                />
              </div>
              <div className="col-md-6 d-flex align-items-center order-md-2 order-2">
                <div>
                  <h2>Manage your business with powerful apps</h2>
                  <p>
                    App Center opens up a world of possibilities from 3rd-party
                    developers.
                  </p>
                  <a href="showcase/index.html" className="learn-more-link">
                    Learn more
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-light-blue">
          <div className="container">
            <div className="row align-content-center">
              <div className="col-md-6 d-flex align-items-center order-md-1 order-2">
                <div>
                  <h2>Integrate with all your favorite accessories</h2>
                  <p>
                    Works seamlessly with your printers, scanners, registers,
                    and cash drawers.
                  </p>
                  <a href="accessories/index.html" className="learn-more-link">
                    Learn more
                  </a>
                </div>
              </div>
              <div className="col-md-6 text-center order-md-2 order-1 img-sm-padding-b">
                <img
                  src="../d85ecz8votkqa.cloudfront.net/images/poyntdotcom/products/accessories.png"
                  alt="Poynt terminal and various accessories"
                />
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="row align-content-center">
              <div className="col-md-6 text-center order-md-1 order-1 img-padding-lg-r img-sm-padding-b img-sm-margin-lr">
                <img
                  src="../d85ecz8votkqa.cloudfront.net/images/poyntdotcom/products/poyntcapital_2.png"
                  alt="Screenshot of Poynt Capital popup on a computer"
                />
              </div>
              <div className="col-md-6 d-flex align-items-center order-md-2 order-2">
                <div>
                  <h2>Poynt Capital: Merchant Cash Advances</h2>
                  <p>
                    Easy approval process. No loan application required.
                    Next-day access to funds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="b-review">
          <div className="b-title text-center">
            Trusted by over 100,000 merchants
          </div>
          <div className="b-review-slider owl-carousel">
            <div>
              <div className="row no-padding">
                <div className="col-lg-7">
                  <img
                    src="../d85ecz8votkqa.cloudfront.net/images/poyntdotcom/landing/case-study-retail.jpg"
                    alt="James Dant store image"
                  />
                </div>
                <div className="col-lg-5 d-flex flex-column">
                  <p className="review-text">
                    “Poynt takes the hassle out of paying, and instead makes it
                    part of a tailored experience, which is essential when
                    clients buy something they really love.”
                  </p>
                  <div className="down">
                    <h4>Tommy</h4>
                    <h4 className="normal">James Dant Store for Men</h4>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="row no-padding">
                <div className="col-lg-7">
                  <img
                    src="../d85ecz8votkqa.cloudfront.net/images/poyntdotcom/landing/case-study-equipment.jpg"
                    alt="Experience Powersports store image"
                  />
                </div>
                <div className="col-lg-5 d-flex flex-column">
                  <p className="review-text">
                    “The Poynt Smart Terminal was the most technologically
                    advanced solution available to us — the terminal is totally
                    wireless, and customers love it.”
                  </p>
                  <div className="down">
                    <h4>Derek Smith</h4>
                    <h4 className="normal">Experience Powersports</h4>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="row no-padding">
                <div className="col-lg-7">
                  <img
                    src="../d85ecz8votkqa.cloudfront.net/images/poyntdotcom/landing/case-study-lodging.jpg"
                    alt="Twin Rocks Motel lodging image"
                  />
                </div>
                <div className="col-lg-5 d-flex flex-column">
                  <p className="review-text">
                    “We&rsquo;re so happy that we switched to the Poynt system
                    for our lodging and payments. It&rsquo;s very user friendly,
                    customers appreciate it, and I think it&rsquo;s just life
                    changing.”
                  </p>
                  <div className="down">
                    <h4>Kathleen Marvin</h4>
                    <h4 className="normal">Twin Rocks Motel</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="b-payments-list">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="b-title text-center">
                  Any Payment. Always Secure.
                </div>
                <div className="b-items-list d-flex justify-content-center text-center">
                  <div className="item">
                    <img
                      src="../d85ecz8votkqa.cloudfront.net/images/booynt/1_Home_For%20Merchants%20Page/Payments%20icons_3x/EMV_3x.png"
                      alt=""
                    />
                    <span>EMV</span>
                  </div>
                  <div className="item">
                    <img
                      src="../d85ecz8votkqa.cloudfront.net/images/booynt/1_Home_For%20Merchants%20Page/Payments%20icons_3x/NFC_3x.png"
                      alt=""
                    />
                    <span>NFC</span>
                  </div>
                  <div className="item">
                    <img
                      src="../d85ecz8votkqa.cloudfront.net/images/booynt/1_Home_For%20Merchants%20Page/Payments%20icons_3x/Mag%20Stripe_3x.png"
                      alt=""
                    />
                    <span>Mag Stripe</span>
                  </div>
                  <div className="item">
                    <img
                      src="../d85ecz8votkqa.cloudfront.net/images/booynt/1_Home_For%20Merchants%20Page/Payments%20icons_3x/Gift%20Card_3x.png"
                      alt=""
                    />
                    <span>Gift Card</span>
                  </div>
                  <div className="item">
                    <img
                      src="../d85ecz8votkqa.cloudfront.net/images/booynt/1_Home_For%20Merchants%20Page/Payments%20icons_3x/EBT_3x.png"
                      alt=""
                    />
                    <span>EBT</span>
                  </div>
                  <div className="item">
                    <img
                      src="../d85ecz8votkqa.cloudfront.net/images/booynt/1_Home_For%20Merchants%20Page/Payments%20icons_3x/Cash_3x.png"
                      alt=""
                    />
                    <span>Cash</span>
                  </div>
                  <div className="item">
                    <img
                      src="../d85ecz8votkqa.cloudfront.net/images/booynt/1_Home_For%20Merchants%20Page/Payments%20icons_3x/Credit%20Card_3x.png"
                      alt=""
                    />
                    <span>Credit Card</span>
                  </div>
                  <div className="item">
                    <img
                      src="../d85ecz8votkqa.cloudfront.net/images/booynt/1_Home_For%20Merchants%20Page/Payments%20icons_3x/Pin_3x.png"
                      alt=""
                    />
                    <span>PIN on Glass</span>
                  </div>
                </div>
                <div className="merchants-brands row no-padding">
                  <div className="col-md-10 offset-md-1 col-sm-12 offset-sm-0">
                    <div className="row no-padding">
                      <div className="col-md-12 text-center">
                        <img
                          src="../d85ecz8votkqa.cloudfront.net/images/booynt/1_Home_For%20Merchants%20Page/pci_dss_3x.png"
                          alt=""
                        />
                        <img
                          src="../d85ecz8votkqa.cloudfront.net/images/booynt/1_Home_For%20Merchants%20Page/pci_pts_3x.png"
                          alt=""
                        />
                        <img
                          src="../d85ecz8votkqa.cloudfront.net/images/booynt/1_Home_For%20Merchants%20Page/emv_3x.png"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div id="bundlesModal" className="modal-bundle">
          <div className="modal-bundle-content">
            <div className="modal-bundle-close">&times;</div>
            <div className="modal-bundle-body">
              <div className="bundles-m">
                <div className="bundle-m bundle-m-advanced">
                  <div className="bundle-color advanced-color"></div>
                  <div className="bundle-m-header">Advanced</div>
                  <div className="bundle-m-text text-m-advanced">$30/month</div>
                  <div className="bundle-m-subheader">
                    <i>(includes hardware)</i>
                  </div>
                  <div className="bundle-m-features">
                    <ul className="checklist-blue-xs">
                      <li>Transaction Reports</li>
                      <li>Digital Receipts (SMS, Email)</li>
                      <li>Remote Management</li>
                      <li>Access to 3rd Party Apps</li>
                      <li className="features-bold">Virtual Terminal</li>
                      <li className="features-bold">
                        QuickBooks Online Integration
                      </li>
                      <li className="features-bold">
                        Logo on Digital Receipts
                      </li>
                      <li className="features-bold">
                        Advanced Register, 575 Items
                      </li>
                      <li className="features-bold">
                        Customer Feedback & Messaging
                      </li>
                      <li className="features-bold">Up to 15 Device Users</li>
                    </ul>
                  </div>
                </div>
                <div className="bundle-m bundle-m-premium">
                  <div className="bundle-color premium-color"></div>
                  <div className="bundle-m-header">Premium</div>
                  <div className="bundle-m-text text-m-advanced">$50/month</div>
                  <div className="bundle-m-subheader">
                    <i>(includes hardware)</i>
                  </div>
                  <div className="bundle-m-features">
                    <ul className="checklist-blue-xs">
                      <li>Transaction Reports</li>
                      <li>Digital Receipts (SMS, Email)</li>
                      <li>Remote Management</li>
                      <li>Access to 3rd Party Apps</li>
                      <li>Virtual Terminal</li>
                      <li>QuickBooks Online Integration</li>
                      <li>Logo on Digital Receipts</li>
                      <li>Advanced Register, 575 Items</li>
                      <li>Customer Feedback & Messaging</li>
                      <li className="features-bold">Integrated Invoicing</li>
                      <li className="features-bold">Unlimited Device Users</li>
                      <li className="features-bold">Loyalty</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="container">
            <nav className="site-footer-nav">
              <div className="row no-padding">
                <div className="col-md-2">
                  <a href="index.html" className="link">
                    For Merchants
                  </a>
                </div>
                <div className="col-md-2">
                  <a href="resellers/index.html" className="link">
                    For Resellers
                  </a>
                  <ul>
                    <li>
                      <a href="resellers/index.html">Poynt Processing</a>
                    </li>
                    <li>
                      <a href="resellers/capital/index.html">Poynt Capital</a>
                    </li>
                    <li>
                      <a href="resellers/platform/index.html">Poynt Platform</a>
                    </li>
                    <li>
                      <a href="#0" className="open-modal order-demo-unit">
                        Order Demo Unit
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-md-2">
                  <a href="developers/index.html" className="link">
                    For Developers
                  </a>
                  <ul>
                    <li>
                      <a href="showcase/index.html">App Showcase</a>
                    </li>
                    <li>
                      <a
                        href="https://poynt.github.io/developer-docs/"
                        target="_blank"
                      >
                        Developer Docs
                      </a>
                    </li>
                    <li>
                      <a href="docs/api/index.html" target="_blank">
                        API Reference
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://poynt.github.io/developer-docs/guides/posapp/"
                        target="_blank"
                      >
                        Build Your First App
                      </a>
                    </li>
                    <li>
                      <a href="#0" className="open-modal order-dev-kit">
                        Order Dev Kit
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-md-2">
                  <a href="features/index.html" className="link">
                    Features
                  </a>
                  <ul>
                    <li>
                      <a
                        className="tab-trigger"
                        data-tab="#tab-2"
                        href="features/index.html#software"
                      >
                        Software
                      </a>
                    </li>
                    <li>
                      <a
                        className="tab-trigger"
                        data-tab="#tab-1"
                        href="features/index.html#hardware"
                      >
                        Hardware
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-md-2">
                  <a href="accessories/index.html" className="link">
                    Accessories
                  </a>
                </div>
                <div className="col-md-2">
                  <ul className="simple">
                    <li>
                      <a href="about/index.html">About Poynt</a>
                    </li>
                    <li>
                      <a href="careers/index.html">Careers</a>
                    </li>
                    <li>
                      <a href="press/index.html">Press</a>
                    </li>
                    <li>
                      <a href="https://info.poynt.com/blog">Blog</a>
                    </li>
                    <li>
                      <a href="faq/index.html">FAQs</a>
                    </li>
                    <li>
                      <a
                        href="https://support.poynt.com/hc/en-us"
                        target="_blank"
                      >
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a href="https://info.poynt.com/resources">
                        Resources Center
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
            <div className="footer-down d-flex justify-content-between">
              <div className="d-flex">
                <div className="social">
                  <a href="https://www.facebook.com/Poynt/" target="_blank">
                    <img
                      src="https://d85ecz8votkqa.cloudfront.net/images/booynt/icons/facebook_ic.svg"
                      alt=""
                    />
                  </a>
                  <a href="https://twitter.com/poynt" target="_blank">
                    <img
                      src="https://d85ecz8votkqa.cloudfront.net/images/booynt/icons/twitter_ic.svg"
                      alt=""
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/poynt/"
                    target="_blank"
                  >
                    <img
                      src="https://d85ecz8votkqa.cloudfront.net/images/booynt/icons/linkedin_ic.svg"
                      alt=""
                    />
                  </a>
                </div>
                <nav>
                  <a href="privacy/index.html">Privacy</a>
                  <a href="terms-of-use/index.html">Terms</a>
                  <a href="legal/index.html">Legal</a>
                  <a href="batteries/index.html">Batteries</a>
                </nav>
              </div>
              <div className="footer-copyright">
                Copyright © 2014-2020 Poynt Co. All rights reserved.
              </div>
            </div>
          </div>
        </footer>

        <div className="search-container">
          <img
            src="https://d85ecz8votkqa.cloudfront.net/images/poyntdotcom/common/close.svg"
            id="search-close"
          />
          <div className="search-body">
            <form id="search-form">
              <div className="search-bar">
                <span className="fa fa-search"></span>
                <input
                  id="search-input"
                  autoFocus={true}
                  type="text"
                  autoComplete="off"
                ></input>
              </div>
            </form>
            <div className="search-results">
              <div className="search-default">
                <div className="search-results-column">
                  <h4>Top Pages</h4>
                  <ul>
                    <li>
                      <a href="index.html">Merchants</a>
                    </li>
                    <li>
                      <a href="resellers/index.html">Resellers</a>
                    </li>
                    <li>
                      <a href="developers/index.html">Developers</a>
                    </li>
                    <li>
                      <a href="about/index.html">About Poynt</a>
                    </li>
                    <li>
                      <a href="careers/index.html">Careers</a>
                    </li>
                    <li>
                      <a href="https://info.poynt.com/blog">Blog</a>
                    </li>
                    <li>
                      <a href="faq/index.html">FAQs</a>
                    </li>
                  </ul>
                </div>
                <div className="search-results-column">
                  <h4>Help Center</h4>
                  <ul id="help-center">
                    <div className="search-help-loading">
                      <span className="fa fa-circle-o-notch fa-spin"></span>
                    </div>
                  </ul>
                </div>
              </div>
              <div className="search-response">
                <div className="search-results-column">
                  <h4>Pages</h4>
                  <ul id="search-results"></ul>
                </div>
                <div className="search-results-column search-results-zendesk">
                  <h4>Help Center</h4>
                  <ul id="help-results">
                    <div className="search-help-loading">
                      <span className="fa fa-circle-o-notch fa-spin"></span>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexComponent;
