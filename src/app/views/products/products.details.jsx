import React, { Component } from "react";
import { Breadcrumb } from "@gull";
import { Tabs, Tab, Carousel, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import * as utils from "@utils";
import AppNotification from "../../appNotifications";
import localStorageService from "../../services/localStorageService";
import AppMainService from "../../services/appMainService";
import swal from "sweetalert2";

import { Link } from "react-router-dom";
import { FetchingRecords, BidMarqueeSummary, BidRatingSummary } from "app/appWidgets";
import { FaCog } from "react-icons/fa";

import BidService from "app/services/bidService";
import StockBids from "./stockBids";
import "./products.details.css";
import io from "socket.io-client";
import { APP_ENVIRONMENT } from "app/environment/environment";

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.bidService = new BidService();
    this.appMainService = new AppMainService();
    this.initialBidForm = {
      price_per_kg: "",
      quantity: "",
    };

    this.socket = io(APP_ENVIRONMENT.websocket_url, {
      transports: ["websocket"],
    });

    this.socket.on("USER_BIDDED", (bidResponse) => {
      this.setNewUserBid(bidResponse);
    });
  }

  state = {
    breadCrumbs: [
      {
        name: "Home",
        path: "/",
      },
    ],
    viewedProduct: {},
    otherStocks: [],
    bidForm: {
      price_per_kg: "",
      quantity: "",
    },
    isSaving: false,
    isFetching: true,
    isSubmitting: false,
    saveMsg: "Save",
    authUser: localStorageService.getItem("AUTH_USER"),
    featuredBids: [],
  };

  addUserBid = (bid) => {
    this.socket.emit("NEW_BID", bid);
  };

  setNewUserBid = (bidResponse) => {
    const { featuredBids, authUser } = this.state;
    const { buyer } = bidResponse;
    if (buyer !== authUser._id) {
      featuredBids.unshift(bidResponse);
    }

    this.setState({ featuredBids });
  };

  setBreadCrumbs = async (viewedProduct) => {
    let crumbs = [
      {
        name: "Home",
        path: "/",
      },
    ];
    if (Object.keys(viewedProduct).length) {
      viewedProduct.category.ancestors.forEach((ancestor) => {
        crumbs.push({ ...ancestor, path: `/category/${ancestor.id}` });
      });
      crumbs.push({
        name: viewedProduct.category.name,
        path: `/category/${viewedProduct.category.id}`,
      });
      crumbs.push({
        name: viewedProduct.name,
        path: "",
      });
    }
    const featuredBids = viewedProduct?.featured_stock?.bids || [];
    await this.setState({
      breadCrumbs: crumbs,
      viewedProduct,
      featuredBids,
    });
    this.setOtherStocks();
  };

  componentDidMount = async () => {
    console.log("viewed product", this.props.viewedProduct);
  };

  componentWillReceiveProps = async (nextProps) => {
    this.setBreadCrumbs(nextProps.viewedProduct);
    // if(nextProps.viewedProduct._id !== this.props.viewedProduct._id ){

    // }
  };

  tempSynopsis = () => {
    return (
      <p>
        {this?.state?.viewedProduct?.featured_stock?.quantity}
        {"kg "}
        {" of this stock of "} <em>{this?.state?.viewedProduct?.name}</em>{" "}
        {" is available at a price of NGN"}
        {this?.state?.viewedProduct?.featured_stock?.price} {" per kg. It is "}{" "}
        {this?.state?.viewedProduct?.packaging}, {" and the "}{" "}
        {this?.state?.viewedProduct?.delivery_option == "SELLER_DELIVERS"
          ? "seller will deliver"
          : "buyer will pick up"}
        .
        {/* **X kg** of this stock of **shoes** is available at **Y price**. It is
         **unpacked** and the **buyer will pick up**. */}
      </p>
    );
  };

  setOtherStocks = () => {
    let { viewedProduct, otherStocks } = this.state;
    if (viewedProduct.stocks) {
      otherStocks = viewedProduct.stocks.filter((stock) => {
        return stock._id !== viewedProduct.featured_stock._id;
      });
    }
    this.setState({ otherStocks, isFetching: false });
  };

  viewOtherStock = async (stock) => {
    let { viewedProduct, otherStocks, featuredBids } = this.state;
    const oldFeaturedStock = { ...viewedProduct.featured_stock };
    const newStockIndex = otherStocks.findIndex((s) => s._id == stock._id);
    otherStocks.splice(newStockIndex, 1); // remove viewed stock from otherStocks;
    otherStocks.push(oldFeaturedStock); // put the old featured stock back in otherStocks;
    viewedProduct.featured_stock = stock; // set new stock as the featured stock;
    featuredBids = stock.bids;
    return await this.setState({ viewedProduct, otherStocks, featuredBids });
  };

  handleBidFormChange = (event, callBack = null) => {
    let { bidForm } = this.state;
    const { name, value } = event.target;
    bidForm = { ...bidForm, [name]: value };
    console.log({ bidForm });
    this.setState({ bidForm });
    return callBack && callBack(event);
  };

  submitBid = async (event) => {
    let { bidForm, viewedProduct, isSaving, saveMsg, authUser, featuredBids } =
      this.state;
    const { featured_stock } = viewedProduct;
    const user_id = authUser._id;
    let bidData = { ...bidForm, user_id, stock_id: featured_stock._id };
    this.bidService
      .createBid(bidData)
      .then((bidResponse) => {
        isSaving = false;
        saveMsg = "Save";
        bidData = { ...bidData, ...bidResponse };
        bidData.name = authUser.full_name;
        this.setState({
          saveMsg,
          featuredBids: [bidData, ...featuredBids],
        });
        const successNotification = {
          type: "success",
          msg: `Your bid has been registered! The seller will review your offer.`,
        };
        new AppNotification(successNotification);
        this.addUserBid(bidData);
      })
      .catch((error) => {
        isSaving = false;
        saveMsg = "Save";
        this.setState({ isSaving, saveMsg });
        const errorNotification = {
          type: "error",
          msg: utils.processErrors(error),
        };
        new AppNotification(errorNotification);
      });

  };

  /**
   *
   * @param {*} value
   * This method quickly tries to log a user in
   */
  quickLogin = (value) => {
    let { isSubmitting } = this.state;
    isSubmitting = !isSubmitting;
    this.setState({ isSubmitting });
    const { email, password } = value;
    const loginObject = {
      username: email,
      email,
      password,
    };
    this.appMainService
      .logUserIn(loginObject)
      .then((userResponse) => {
        isSubmitting = !isSubmitting;
        this.setState({ isSubmitting });
        const notification = {
          type: "",
          message: "",
          timeOut: null,
        };
        if (userResponse.statusCode == 401) {
          notification.type = "error";
          notification.msg = userResponse.message;
          return new AppNotification(notification);
        }
        notification.type = "success";
        notification.timeOut = 1000;
        localStorageService.setItem("AUTH_USER", userResponse);
        this.setState({ authUser: userResponse });
      })
      .catch((error) => {
        this.setState({ isSubmitting });
        const errorNotification = {
          type: "error",
          msg: utils.processErrors(error),
        };
        new AppNotification(errorNotification);
      });
  };

  render() {
    const { featuredBids, authUser, viewedProduct } = this.state;
    const showColumns = {

    }
    return (
      <div>
        <Breadcrumb routeSegments={this.state.breadCrumbs}></Breadcrumb>
        <section className="ul-product-detail p-details">
          <div className="row">
            <div className="col-12 ">
              <div className="cardx ">
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-4 col-md-4">
                      <div className="ul-product-detail__image">
                        {/* <img src={this?.state?.viewedProduct?.featured_stock?.images[0]?.preview_url} alt="" /> */}

                        <Carousel fade={true}>
                          {!this?.state?.viewedProduct?.featured_stock?.images
                            ?.length ? (
                            <FetchingRecords
                              isFetching={this.state.isFetching}
                            />
                          ) : (
                            this?.state?.viewedProduct?.featured_stock?.images?.map(
                              (img, ind) => (
                                <Carousel.Item key={ind}>
                                  <img
                                    className="d-block w-100"
                                    src={img?.preview_url}
                                    alt={this?.state?.viewedProduct?.name}
                                  />
                                  <Carousel.Caption>
                                    <h5 className="text-white">
                                      {this?.state?.viewedProduct?.name}
                                    </h5>
                                    <p>
                                      {
                                        this?.state?.viewedProduct
                                          ?.featured_stock?.description
                                      }
                                    </p>
                                  </Carousel.Caption>
                                </Carousel.Item>
                              )
                            )
                          )}
                        </Carousel>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-3 border-right">
                      <div className="ul-product-detail__brand-name mb-4">
                        <h5 className="heading">
                          {this.state.viewedProduct?.name}
                        </h5>
                        <BidRatingSummary bid={{}} />
                      </div>
                      

                      <div className="ul-product-detail__price-and-rating d-flex align-items-baseline">
                        <h3 className="font-weight-700 text-primary mb-0 mr-2">
                          &#x20a6;
                          {this?.state?.viewedProduct?.featured_stock?.price}
                        </h3>
                        <span className="text-mute font-weight-800 mr-2">
                          Minimum price per kg
                        </span>
                        {/* <small className="text-success font-weight-700">
                          50% off
                        </small> */}
                      </div>

                      <div className="ul-product-detail__features mt-3">
                        {/* <h5 className=" font-weight-700">Details:</h5> */}
                        <ul className="m-0 p-0">
                          <li>
                            <i className="i-Right1 text-primary text-15 align-middle font-weight-700"></i>
                            &nbsp;
                            <span className="align-middle">
                              <b>Available quantity:</b>{" "}
                              {
                                this?.state?.viewedProduct?.featured_stock
                                  ?.quantity
                              }{" "}
                              kg
                            </span>
                          </li>
                          <li>
                            <i className="i-Right1 text-primary text-15 align-middle font-weight-700"></i>
                            &nbsp;
                            <span className="align-middle">
                              <b>Category:</b>{" "}
                              {this?.state?.viewedProduct?.category?.name}
                            </span>
                          </li>
                          <li>
                            <i className="i-Right1 text-primary text-15 align-middle font-weight-700"></i>
                            &nbsp;
                            <b>Packaging:</b>{" "}
                            {this?.state?.viewedProduct?.packaging}
                          </li>
                          <li>
                            <i className="i-Right1 text-primary text-15 align-middle font-weight-700"></i>
                            &nbsp;
                            <span className="align-middle">
                              <b>Delivery:</b>{" "}
                              {this?.state?.viewedProduct?.delivery_option ==
                              "SELLER_DELIVERS"
                                ? "seller delivers"
                                : "buyer picks up"}
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="ul-product-detail__quantity d-flex align-items-center mt-3">
                        {authUser && authUser?.user_type == "BUYER" && this?.state?.viewedProduct?.owner && this?.state?.viewedProduct?.owner?._id !== authUser?._id ? (
                          <Formik
                            initialValues={this.state.bidForm}
                            validationSchema={this.bidFormSchema}
                            onSubmit={this.submitBid}
                          >
                            {({
                              values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              isSubmitting,
                              resetForm,
                            }) => {
                              return (
                                <form
                                  className="needs-validation "
                                  onSubmit={handleSubmit}
                                  noValidate
                                >
                                  <div className="form-row">
                                    <div
                                      className={utils.classList({
                                        "col-md-6 ": true,
                                        "valid-field":
                                          !errors.price_per_kg &&
                                          touched.price_per_kg,
                                        "invalid-field":
                                          errors.price_per_kg &&
                                          touched.price_per_kg,
                                      })}
                                    >
                                      <label htmlFor="price_per_kg">
                                        <b>
                                          Price per kg
                                          <span className="text-danger">*</span>
                                        </b>
                                      </label>
                                      <input
                                        type="number"
                                        placeholder="price per kg"
                                        value={values.price_per_kg || ""}
                                        onChange={(event) =>
                                          this.handleBidFormChange(
                                            event,
                                            handleChange
                                          )
                                        }
                                        name="price_per_kg"
                                        className="form-control"
                                      />
                                      <div className="valid-feedback"></div>
                                      <div className="invalid-feedback">
                                        Price per kg is required
                                      </div>
                                    </div>

                                    <div
                                      className={utils.classList({
                                        "col-md-6 ": true,
                                        "valid-field":
                                          !errors.quantity && touched.quantity,
                                        "invalid-field":
                                          errors.quantity && touched.quantity,
                                      })}
                                    >
                                      <label htmlFor="quantity">
                                        <b>
                                          Quantity
                                          <span className="text-danger">*</span>
                                        </b>
                                      </label>
                                      <input
                                        type="number"
                                        placeholder="quantity"
                                        value={values.quantity || ""}
                                        onChange={(event) =>
                                          this.handleBidFormChange(
                                            event,
                                            handleChange
                                          )
                                        }
                                        name="quantity"
                                        className="form-control"
                                      />
                                      <div className="valid-feedback"></div>
                                      <div className="invalid-feedback">
                                        Quantity is required
                                      </div>
                                    </div>

                                    <div className="col-md-12 mt-3">
                                      <button
                                        type="submit"
                                        className="btn btn-primary text-center m-1 d-block w-100"
                                      >
                                        <i className="i-Full-Cart text-15"> </i>
                                        BID
                                      </button>
                                    </div>
                                  </div>
                                </form>
                              );
                            }}
                          </Formik>
                        ) : (
                          !authUser && (
                            <Button
                              className="btn-block mb-2"
                              disabled={this.state.isSubmitting}
                              onClick={() => {
                                swal
                                  .mixin({
                                    input: "text",
                                    confirmButtonText: "Next &rarr;",
                                    showCancelButton: true,
                                    progressSteps: ["1", "2"],
                                  })
                                  .queue(["Username or Email", "Password"])
                                  .then(async (result) => {
                                    if (result.value) {
                                      const answers = result.value;
                                      const email = answers[0];
                                      const password = answers[1];
                                      const userCredentials = {
                                        email,
                                        password,
                                      };
                                      await this.quickLogin(userCredentials);
                                    }
                                  });
                              }}
                            >
                              QUICK LOGIN{" "}
                              {this.state.isSubmitting ? (
                                <FaCog className="fa-spin" />
                              ) : null}
                            </Button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="col-lg-5 col-md-5">
                      <div className="cardxx text-left">
                        <div className="card-header">
                          <h4 className="text-muted">
                            <em>
                             Other Available stocks
                            </em>
                          </h4>
                        </div>
                        <div className="card-body other-stocks">
                          {/* <h4 className="card-title mb-2">Flush</h4> */}
                          {/* <p className="text-primary">Click <b>'View'</b> to bid for any of these items</p> */}
                          <ul className="list-group list-group-flush">
                            {!this.state.otherStocks?.length ? (
                              <li
                                className="list-group-item text-center"
                                key={"empty_other_stocks"}
                              >
                                <FetchingRecords
                                  isFetching={this.state.isFetching}
                                  emptyMsg={"No other stocks available"}
                                />
                              </li>
                            ) : (
                              this.state.otherStocks.map((stock) => {
                                return (
                                  <li
                                    className="list-group-item"
                                    key={stock._id}
                                  >
                                    <div className="row">
                                      <div className="col-md-3">
                                        <div>
                                          <b>Price/kg</b>
                                        </div>{" "}
                                        &#x20a6;{stock?.price}
                                      </div>

                                      <div className="col-md-3">
                                        <div>
                                          <b>Quantity</b>
                                        </div>
                                        {stock?.quantity}kg
                                      </div>

                                      <div className="col-md-4">
                                        <Carousel indicators={false}>
                                          {stock.images.map((img, ind) => (
                                            <Carousel.Item key={ind}>
                                              {/* <img
                                            className="rounded-circle m-0 avatar-sm-table "
                                            src={img}
                                            alt="First slide"
                                            /> */}

                                              <div className="ul-widget3-imgx">
                                                <img src={img.preview_url} />
                                              </div>
                                            </Carousel.Item>
                                          ))}
                                        </Carousel>
                                      </div>
                                      <div className="col-md-2">
                                        <button
                                          className="btn mt-2 btn-info_custom"
                                          onClick={() =>
                                            this.viewOtherStock(stock)
                                          }
                                        >
                                          Select
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })
                            )}

                            {/* <li className="list-group-item">Dapibus ac facilisis in</li>
                              <li className="list-group-item">Morbi leo risus</li>
                              <li className="list-group-item">Porta ac consectetur ac</li>
                              <li className="list-group-item">Vestibulum at eros</li> */}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ul-product-detail__tab">
          <div className="row">
            <div className="col-lg-12 col-md-12 mt-4">
              <div className="cardx mt-2 mb-4 ">
                <div className="card-body">
                  <Tabs defaultActiveKey="Description" className="mb-4">
                    <Tab eventKey="Description" title="Description">
                      <div className="row">
                      
                        <div className="col-lg-12 col-md-12 col-sm-12">
                          <div className="row">
                            <div className="col-5 border-right">
                              <h6 className=" font-weight-700 text-muted mt-4 mb-2">
                                {this.tempSynopsis()}
                              </h6>
                              <div>
                                {
                                  this?.state?.viewedProduct?.featured_stock
                                    ?.description
                                }
                              </div>
                            </div>
                            <div className="col-7">
                              <div className="card-header">
                                <div className="row">
                                  <div className="col-5">
                                  <h4>
                                Bids for this stock{" "}
                                <span
                                  className={`badge badge-${
                                    authUser ? "success" : "info"
                                  }`}
                                >
                                  {authUser ? "Open" : "Unavailable"}
                                </span>
                                </h4>
                                  </div>
                                  <div className="col-7">
                                    <BidMarqueeSummary 
                                    bids={featuredBids}
                                    authUser={authUser}
                                    />

                                  </div>


                                </div>
                               
                              
                              </div>
                              <div className="card-body ">
                                <div
                                  style={{ minHeight: "20em" }}
                                  className={authUser ? "" : "access-overlay"}
                                >
                                  {authUser ? (
                                    <StockBids
                                      featuredBids={featuredBids}
                                      authUser={authUser}
                                      showColumns={showColumns}
                                    />
                                  ) : (
                                    <h4 className="pt-4 text-center">
                                      INACCESSIBLE DATA
                                    </h4>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab eventKey="Reviews" title="Reviews">
                      <div className="row">
                        <div className="col-12">
                          <div className="ul-product-detail__avg-rate text-center">
                            <h3 className="heading text-success">4.9</h3>
                            <span className="text-muted font-weight-600">
                              Overall Rating
                            </span>
                          </div>

                          <div className="ul-product-detail__comment-list mt-3">
                            <ul className="list-group list-group-flush">
                              <li className="list-group-item">
                                <Link
                                  to="/"
                                  className="ul-product-detail__reply float-right"
                                >
                                  <i className="i-Left"></i>
                                  <span>Reply</span>
                                </Link>
                                <h5 className="font-weight-800">
                                  Timothy Clarkson
                                </h5>
                                <p>Very comfortable key,and nice product.</p>
                                <span className="text-warning">**** </span>
                              </li>

                              <li className="list-group-item">
                                <Link
                                  to="/"
                                  className="ul-product-detail__reply float-right"
                                >
                                  <i className="i-Left"></i>
                                  <span>Reply</span>
                                </Link>
                                <h5 className="font-weight-800">Jaret Leto</h5>
                                <p>Very comfortable key,and nice product.</p>
                                <span className="text-warning">**** </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab
                      eventKey="Seller | Product Information"
                      title="Seller | Product Information"
                    >
                      <div className="row">
                        <div className="col-lg-2">
                          <img src="/assets/images/mac_book.jpg" alt="" />
                        </div>
                        <div className="col-lg-6"></div>
                        <div className="col-lg-4">
                          <div className="ul-product-detail__features mt-3">
                            <ul className="m-0 p-0">
                              <li>
                                <i className="i-Right1 text-primary text-15 align-middle font-weight-700"></i>
                                <span className="align-middle">
                                  This Refurbished product is tested to work and
                                  look like new with minimal to no signs of wear
                                  &amp; tear
                                </span>
                              </li>
                              <li>
                                <i className="i-Right1 text-primary text-15 align-middle font-weight-700"></i>
                                <span className="align-middle">
                                  2.6GHz Intel Core i5 4th Gen processor
                                </span>
                              </li>
                              <li>
                                <i className="i-Right1 text-primary text-15 align-middle font-weight-700"></i>
                                <span className="align-middle">
                                  8GB DDR3 RAM
                                </span>
                              </li>
                              <li>
                                <i className="i-Right1 text-primary text-15 align-middle font-weight-700"></i>
                                <span className="align-middle">
                                  13.3-inch screen, Intel Iris 5100 1.5GB
                                  Graphics
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  bidFormSchema = yup.object().shape({
    price_per_kg: yup.number().required("Price is required"),
    quantity: yup.number().required("Quantity is required"),
  });
}

export default ProductDetails;
