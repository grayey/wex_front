import React, { Component, useState, useEffect } from "react";
import {
  Dropdown,
  Row,
  Col,
  Badge,
  Button,
  Form,
  ButtonToolbar,
  Modal,
  Tab,
  Tabs,
  TabContent,
  Nav,
  Accordion,
  Card,
  Carousel,
} from "react-bootstrap";

import swal from "sweetalert2";
import AppMainService from "../../services/appMainService";
import localStorageService from "../../services/localStorageService";

import * as utils from "@utils";
import { Formik } from "formik";
import * as yup from "yup";
import AppNotification from "../../appNotifications";
import { FetchingRecords } from "../../appWidgets";
import { Link, Redirect } from "react-router-dom";
import StockBids from "./stockBids";

import {
  FaList,
  FaCheck,
  FaTimes,
  FaPlusCircle,
  FaMinusCircle,
} from "react-icons/fa";

import LaddaButton, {
  XL,
  EXPAND_LEFT,
  EXPAND_RIGHT,
  EXPAND_UP,
  CONTRACT,
} from "react-ladda";
import { toLength } from "lodash";

export class DashboardProductView extends Component {
  state = {
    productSlug: "",
    viewedProduct: {},
    allChecked: false,
    navigate: false,
    newRoute: "",
    editedIndex: 0,
    allProducts: [],
    allTasks: [],
    isSaving: false,
    isFetching: true,
    updateMsg: "Save",
    authUser: localStorageService.getItem("AUTH_USER"),
    productStocks: [
      {
        name: "Smith Doe",
        email: "Smith@gmail.com",
        status: "active",
        photoUrl: "/assets/images/faces/1.jpg",
      },
      {
        name: "Jhon Doe",
        email: "Jhon@gmail.com",
        status: "pending",
        photoUrl: "/assets/images/faces/2.jpg",
      },
      {
        name: "Alex",
        email: "Otttio@gmail.com",
        status: "inactive",
        photoUrl: "/assets/images/faces/3.jpg",
      },
      {
        name: "Mathew Doe",
        email: "matheo@gmail.com",
        status: "active",
        photoUrl: "/assets/images/faces/4.jpg",
      },
    ],
  };
  appMainService;

  constructor(props) {
    super(props);
    this.appMainService = new AppMainService();
  }

  componentDidMount() {
    // let params = queryString.parse(this.props.location.search);
    const params = this.props.match.params;
    const productSlug = params.slug;

    this.getProductBySlug(productSlug);
    this.getAllTasks();
  }

  customTabHeader = (title, icon) => (
    <div className="d-flex align-items-center">
      <span className="mr-2">
        <i className={icon}></i>
      </span>
      <span>{title}</span>
    </div>
  );

  toggleAccordion = async (stock, index) => {
    let { viewedProduct } = this.state;
    let { stocks } = viewedProduct;
    stocks = stocks.map((st) => {
      st.is_open = stock._id == st._id ? !st.is_open : false;
      return st;
    });
    viewedProduct.stocks = stocks;
    this.setState({ viewedProduct });
  };

  setUpdatedBid = (bidResponse) =>{
      const { viewedProduct } = this.state;
      const { stock, _id, stage } = bidResponse;
    const bidStockIndex = viewedProduct.stocks.findIndex((st)=> st._id == stock);
    viewedProduct.stocks[bidStockIndex].bids.forEach((bid)=>{
        if(bid._id == _id){
            bid.stage = stage;
        }
    })
    this.setState({viewedProduct });
     console.log({ viewedProduct, stock })
  }

  tempSynopsis = (stock) => {
    return (
      <>
        {stock?.quantity}
        {"kg "}
        {" of this stock of "} <em>{this?.state?.viewedProduct?.name}</em>{" "}
        {" is available at a price of NGN"}
        {stock.price} {" per kg. It is "}{" "}
        {this?.state?.viewedProduct?.packaging}, {" and the "}{" "}
        {this?.state?.viewedProduct?.delivery_option == "SELLER_DELIVERS"
          ? "seller will deliver"
          : "buyer will pick up"}
        .
        {/* **X kg** of this stock of **shoes** is available at **Y price**. It is
         **unpacked** and the **buyer will pick up**. */}
      </>
    );
  };

  /**
   *
   * @param {*} task
   * This method saves the permissions for a product
   */
  addPermission = (task) => {
    let { viewedProduct, allChecked } = this.state;
    const tasks = viewedProduct["tasks"];
    const findTask = tasks.findIndex((t) => t._id == task._id);
    if (findTask != -1) {
      tasks.splice(findTask, 1); // remove
    } else {
      tasks.push(task); // add
      console.log("Tasks ", tasks);
    }
    allChecked = tasks?.length == this.state.allTasks.length && tasks.length;
    viewedProduct["tasks"] = tasks;
    this.setState({ viewedProduct, allChecked });
  };

  /**
   * This method lists all products
   */
  getAllProducts = async () => {
    let isFetching = false;

    this.appMainService
      .getAllProducts()
      .then((productsResponse) => {
        const allProducts = productsResponse;
        this.setState({ allProducts, isFetching });
        console.log("Products response", productsResponse);
      })
      .catch((error) => {
        this.setState({ isFetching });
        const errorNotification = {
          type: "error",
          msg: utils.processErrors(error),
        };
        new AppNotification(errorNotification);
        console.log("Error", error);
      });
  };

  /**
   * This method gets a product by its slug
   */
  getProductBySlug = async (slug) => {
    let isFetching = false;
    this.appMainService
      .getProductById(slug)
      .then((viewedProduct) => {
        this.setState({ viewedProduct, isFetching });
        console.log("Products viewed", viewedProduct);
      })
      .catch((error) => {
        this.setState({ isFetching });
        const errorNotification = {
          type: "error",
          msg: utils.processErrors(error),
        };
        new AppNotification(errorNotification);
        console.log("Error", error);
      });
  };

  /**
   * This method lists all tasks
   */
  getAllTasks = async (round2 = false) => {
    let isFetching = false;

    this.appMainService
      .getAllTasks()
      .then((tasksResponse) => {
        const allTasks = tasksResponse;
        if (!allTasks.length && !round2) {
          return this.getAllTasks(true);
        }
        const allChecked =
          this.state?.viewedProduct?.tasks?.length == allTasks.length &&
          allTasks.length;

        this.setState({ allTasks, isFetching, allChecked });
        console.log("Tasks response", tasksResponse);
      })
      .catch((error) => {
        this.setState({ isFetching });
        const errorNotification = {
          type: "error",
          msg: utils.processErrors(error),
        };
        new AppNotification(errorNotification);
        console.log("Error", error);
      });
  };

  formatTaskName = (taskName) => {
    taskName = taskName.replace(".", " | ").split("_").join(" ");
    return utils.toTiltle(taskName);
  };

  includesTask = (task) => {
    return (
      this.state?.viewedProduct?.tasks?.filter((t) => t._id == task._id)
        .length > 0
    );
  };

  checkorUncheckAll = () => {
    let { allTasks, viewedProduct, allChecked } = this.state;
    let { tasks } = viewedProduct;

    if (!allChecked) {
      allTasks.forEach((t) => {
        if (!this.includesTask(t)) {
          tasks.push(t);
        }
      });
    } else {
      tasks = [];
    }
    allChecked = !allChecked;
    viewedProduct["tasks"] = tasks;
    this.setState({ viewedProduct, allChecked });
  };

  /**
   * This method updates a new product
   */
  savePermissions = async () => {
    let isSaving = true;
    let updateMsg = "Saving";
    this.setState({ isSaving, updateMsg });
    this.appMainService
      .updateProduct(this.state.viewedProduct, this.state.viewedProduct._id)
      .then((viewedProduct) => {
        isSaving = false;
        updateMsg = "Save";
        this.setState({ viewedProduct, isSaving, updateMsg });
        const successNotification = {
          type: "success",
          msg: `Successfully updated ${viewedProduct.name} permissions!`,
        };
        new AppNotification(successNotification);
      })
      .catch((error) => {
        isSaving = false;
        updateMsg = "Save";
        this.setState({ isSaving, updateMsg });
        const errorNotification = {
          type: "error",
          msg: utils.processErrors(error),
        };
        new AppNotification(errorNotification);
      });
  };

  /**
   *
   * @param {*} product
   * This method toggles a product's status
   */
  toggleProduct = (product) => {
    const toggleMsg = product.status ? "Disable" : "Enable";
    const gL = product.status ? "lose" : "gain";

    swal
      .fire({
        title: `<small>${toggleMsg}&nbsp;<b>${product.name}</b>?</small>`,
        text: `${product.name} stocks will ${gL} permissions.`,
        icon: "warning",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#007BFF",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No",
      })
      .then((result) => {
        if (result.value) {
          let { allProducts } = this.state;
          const toggleIndex = allProducts.findIndex(
            (r) => r._id == product._id
          );
          // product.status = !product.status;

          this.appMainService
            .toggleProduct(product)
            .then((toggledProduct) => {
              allProducts.splice(toggleIndex, 1, toggledProduct);
              this.setState({ allProducts });
              const successNotification = {
                type: "success",
                msg: `${toggledProduct.name} successfully ${toggleMsg}d!`,
              };
              new AppNotification(successNotification);
            })
            .catch((error) => {
              const errorNotification = {
                type: "error",
                msg: utils.processErrors(error),
              };
              new AppNotification(errorNotification);
            });
        }
      });
  };

  /**
   *
   * @param {*} product
   * This method deletes a product
   *
   */
  deleteProduct = (product) => {
    swal
      .fire({
        title: `<small>Delete&nbsp;<b>${product.name}</b>?</small>`,
        text: "You won't be able to revert this!",
        icon: "warning",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#007BFF",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No",
      })
      .then((result) => {
        if (result.value) {
          let { allProducts } = this.state;
          this.appMainService
            .deleteProduct(product)
            .then((deletedProduct) => {
              allProducts = allProducts.filter((r) => r._id !== product._id);
              this.setState({ allProducts });
              const successNotification = {
                type: "success",
                msg: `${product.name} successfully deleted!`,
              };
              new AppNotification(successNotification);
            })
            .catch((error) => {
              const errorNotification = {
                type: "error",
                msg: utils.processErrors(error),
              };
              new AppNotification(errorNotification);
            });
        }
      });
  };

  /**
   *
   * @param {*} modalName
   */
  resetForm = () => {
    const createProductForm = {
      name: "",
      description: "",
    };
    this.setState({ createProductForm });
  };
  getUserStatusClass = (status) => {
    switch (status) {
      case "active":
        return "badge-success";
      case "inactive":
        return "badge-warning";
      case "pending":
        return "badge-primary";
      default:
        break;
    }
  };

  render() {
    const { navigate, newRoute, authUser, viewedProduct } = this.state;
    let bids = [];
    const x = viewedProduct?.stocks?.forEach((stock) => {
      bids = bids.concat(stock.bids);
    });
    const buyers = bids.map((bid) => bid?.buyer?._id);
    const actioners = [viewedProduct?.owner?._id, ...buyers]; // a buyer, the owner or admin
    const showColumns = {
      stage: true,
      action: actioners.includes(authUser?._id) || authUser?.user_type == 'ADMIN',
      more:true,
    };
    if (navigate) {
      return <Redirect to={newRoute} />;
    }

    return (
      <>
        <div className="specific">
          <div className="float-right">
            {/* <Button  variant="secondary_custom" className="ripple m-1 text-capitalize" onClick={ ()=>{ this.toggleModal('create')} }><i className='i-Add'></i> Create Product</Button> */}
          </div>

          <div className="breadcrumb">
            <h1>{this.state.viewedProduct?.name}</h1>
            <ul>
              <li>
                <a href="#">Detail</a>
              </li>
              <li>View</li>
            </ul>
          </div>

          <div className="separator-breadcrumb border-top"></div>
          <div className="row mb-4">
            <div className="col-md-12 mb-4">
              <div className="cardx text-left">
                <div className="card-bodyx">
                  <Tabs
                    defaultActiveKey="product_information"
                    id="uncontrolled-tab-example"
                  >
                    <Tab
                      eventKey="product_information"
                      title={this.customTabHeader(
                        "Product information",
                        "i-Atom"
                      )}
                    >
                      <div className="mt-2">
                        <div className="row">
                          <div className="col-3 border-right">
                            <div className="card ">
                              <div className="card-header">
                                <h4 className="card-titlex">
                                  <Badge
                                    className={`badge-round-${
                                      this.state.viewedProduct?.status
                                        ? "success"
                                        : "danger"
                                    }  m-1`}
                                  >
                                    {this.state.viewedProduct?.status ? (
                                      <span>&#x2713;</span>
                                    ) : (
                                      <span>&#x21;</span>
                                    )}
                                  </Badge>
                                  General
                                </h4>
                              </div>

                              <div className="card-body">
                                <p>{this.state.viewedProduct?.description}</p>
                                <ul className="list-group list-group-flush">
                                  <li className="list-group-item">
                                    <b>Name: </b>
                                    {this.state.viewedProduct?.name}
                                  </li>
                                  <li className="list-group-item">
                                    <b>Category: </b>
                                    {this.state.viewedProduct?.category?.name}
                                  </li>
                                  <li className="list-group-item">
                                    <b>No. of stocks: </b>
                                    {this.state.viewedProduct?.no_of_stocks}
                                  </li>
                                  <li className="list-group-item">
                                    <b>Keywords: </b>

                                    <div className="badges">
                                      {this.state.viewedProduct?.keywords?.map(
                                        (keyword) => {
                                          return (
                                            <span
                                              className="badge badge-primary badge-sm mr-1"
                                              key={keyword.id}
                                            >
                                              {keyword.text}
                                            </span>
                                          );
                                        }
                                      )}
                                    </div>
                                  </li>
                                  <li className="list-group-item">
                                    <b>Delivery Option: </b>
                                    {this.state.viewedProduct?.delivery_option
                                      ?.split("_")
                                      ?.join(" ")}
                                  </li>
                                  <li className="list-group-item">
                                    <b>Packaging: </b>
                                    {this.state.viewedProduct?.packaging}
                                  </li>
                                  <li className="list-group-item">
                                    <b>Status: </b>
                                    <span
                                      className={
                                        this.state.viewedProduct?.status
                                          ? "text-success"
                                          : "text-danger"
                                      }
                                    >
                                      {this.state.viewedProduct?.status
                                        ? "Enabled"
                                        : "Disabled"}
                                    </span>
                                  </li>
                                  <li className="list-group-item">
                                    <b>Date Created: </b>
                                    {utils.formatDate(
                                      this.state.viewedProduct?.created_at
                                    )}
                                  </li>
                                  <li className="list-group-item">
                                    <b>Date Updated: </b>
                                    {utils.formatDate(
                                      this.state.viewedProduct?.updated_at
                                    )}
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="col-9">
                            <div className="card ">
                              <div className="card-header">
                                <h4 className="card-titlex">
                                  <b>{this.state.viewedProduct?.name}</b> stocks
                                </h4>
                              </div>

                              <div className="card-body">
                                {this.state.viewedProduct?.stocks?.map(
                                  (stock, index) => {
                                    const eventKey = `${index}_${stock?._id}`;
                                    return (
                                      <Card
                                        key={stock?._id}
                                        className="shadow-sm mb-3"
                                      >
                                        <Accordion>
                                          <Card.Header className="d-flex align-items-center justify-content-between">
                                            <Accordion.Toggle
                                              className="cursor-pointer mb-0 text-primary"
                                              as="span"
                                              eventKey={eventKey}
                                              onClick={() =>
                                                this.toggleAccordion(
                                                  stock,
                                                  index
                                                )
                                              }
                                            >
                                              <div className="pb-1">
                                                <h6 className="card-header text-center">
                                                  <u>
                                                    <em>Summary</em>
                                                  </u>
                                                </h6>
                                                <a
                                                  href="javascript:void(0)"
                                                  onClick={(e) =>
                                                    e.preventDefault()
                                                  }
                                                  className="underline"
                                                >
                                                  <code>
                                                    {this.tempSynopsis(stock)}
                                                  </code>
                                                </a>
                                                &nbsp;&nbsp;
                                                {stock?.is_open ? (
                                                  <FaMinusCircle className="text-danger" />
                                                ) : (
                                                  <FaPlusCircle />
                                                )}
                                              </div>

                                              <div className="text-center">
                                                {stock?.is_featured && (
                                                  <span className="badge badge-danger">
                                                    Featured
                                                  </span>
                                                )}
                                              </div>
                                            </Accordion.Toggle>

                                            <div className="d-flex">
                                              <table className="table">
                                                <thead>
                                                  <tr>
                                                    <th className="text-rightx">
                                                      <small>
                                                        Price/Kg (&#x20a6;)
                                                      </small>
                                                    </th>
                                                    <th className="text-rightx">
                                                      <small>Quantity</small>
                                                    </th>
                                                    <th className="text-rightx">
                                                      <small>Description</small>
                                                    </th>

                                                    <th colSpan="2">
                                                      <small>Images</small>
                                                      <sup>
                                                        <span className="badge badge-pill  badge-info">
                                                          {
                                                            stock?.images
                                                              ?.length
                                                          }
                                                        </span>
                                                      </sup>
                                                    </th>
                                                  </tr>
                                                  <tr>
                                                    <th className="text-rightx">
                                                      {stock?.price}
                                                    </th>

                                                    <th className="text-rightx">
                                                      {stock?.quantity}
                                                    </th>

                                                    <th className="text-rightx">
                                                      <a
                                                        className="underline"
                                                        href="#"
                                                      >
                                                        View
                                                      </a>
                                                    </th>

                                                    <th colSpan="2">
                                                      <Carousel
                                                        indicators={false}
                                                      >
                                                        {stock.images.map(
                                                          (img, ind) => (
                                                            <Carousel.Item
                                                              key={ind}
                                                            >
                                                              <div className="ul-widget3-img">
                                                                <img
                                                                  src={
                                                                    img.preview_url
                                                                  }
                                                                  id="userDropdown"
                                                                  alt=""
                                                                  data-toggle="dropdown"
                                                                  aria-haspopup="true"
                                                                  aria-expanded="false"
                                                                />
                                                              </div>
                                                            </Carousel.Item>
                                                          )
                                                        )}
                                                      </Carousel>
                                                    </th>
                                                  </tr>
                                                </thead>
                                              </table>
                                              <div></div>
                                            </div>
                                          </Card.Header>
                                          <Accordion.Collapse
                                            eventKey={eventKey}
                                          >
                                            <Card.Body>
                                              <h4 className="card-header">
                                                Bids for this stock{" "}
                                                <span
                                                  className={`badge badge-${
                                                    authUser
                                                      ? "success"
                                                      : "info"
                                                  }`}
                                                >
                                                  {authUser
                                                    ? "Open"
                                                    : "Unavailable"}
                                                </span>
                                              </h4>
                                              <StockBids
                                                featuredBids={stock?.bids}
                                                authUser={authUser}
                                                showColumns={showColumns}
                                                setUpdatedBid={(bidRes)=>this.setUpdatedBid(bidRes)}
                                              />
                                            </Card.Body>
                                          </Accordion.Collapse>
                                        </Accordion>
                                      </Card>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab
                      eventKey="Reviews"
                      title={this.customTabHeader("Reviews", "i-Gear-2")}
                    >
                      <div className="card ">
                        <div className="card-header card-title mb-0 d-flex align-items-center justify-content-between border-0">
                          <h3 className="w-50 float-left card-title m-0">
                            <i className="i-Gears"></i>{" "}
                            <b>{this.state.viewedProduct?.name}</b> permissions
                          </h3>

                          <div className="float-right">
                            {/* <Button  variant="secondary_custom" className="ripple m-1 text-capitalize" onClick={ ()=>{ this.toggleModal('create')} }><i className='i-Add'></i> Create Product</Button> */}

                            <LaddaButton
                              className={`btn btn-${
                                true ? "success" : "info_custom"
                              } border-0 mr-2 mb-2 position-relative`}
                              loading={this.state.isSaving}
                              progress={0.5}
                              type="button"
                              data-style={EXPAND_RIGHT}
                              onClick={this.savePermissions}
                            >
                              {this.state.updateMsg} Permissions
                            </LaddaButton>
                          </div>
                        </div>

                        <div className="card-body">
                          <div className="table-responsive">
                            <div>
                              {/*  style={{"maxHeight":"500px", "overflowY":"scroll"}} */}

                              <table
                                className="display table table-striped table-hover "
                                id="zero_configuration_table"
                                style={{ width: "100%" }}
                              >
                                <thead>
                                  <tr className="ul-widget6__tr--sticky-th">
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Module</th>
                                    <th>Date Created</th>
                                    <th>Date Updated</th>
                                    <th>
                                      <div
                                        className="form-inline"
                                        style={{ cursor: "pointer !important" }}
                                      >
                                        Select &nbsp; <b>|</b> &nbsp;{" "}
                                        <Form.Check
                                          name="check_uncheck"
                                          onChange={this.checkorUncheckAll}
                                          value=""
                                          checked={this.state.allChecked}
                                          type="checkbox"
                                          id="check_uncheck"
                                          className={`text-${
                                            this.state.allChecked
                                              ? "danger"
                                              : "success"
                                          }`}
                                          label={
                                            this.state.allChecked
                                              ? "uncheck all"
                                              : "check all"
                                          }
                                        />
                                      </div>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.allTasks.length ? (
                                    this.state.allTasks.map((task, index) => {
                                      return (
                                        <tr
                                          key={task._id}
                                          className={
                                            task.temp_flash
                                              ? "bg-success text-white"
                                              : ""
                                          }
                                        >
                                          <td>
                                            <b>{index + 1}</b>.
                                          </td>
                                          <td>
                                            {this.formatTaskName(task?.name)}{" "}
                                            &nbsp;
                                            {this.includesTask(task) ? (
                                              <Badge
                                                pill
                                                variant="success"
                                                className="m-1"
                                              >
                                                assigned
                                              </Badge>
                                            ) : null}
                                          </td>
                                          <td>
                                            {utils.toTiltle(task?.module_name)}
                                          </td>
                                          <td>
                                            {utils.formatDate(task.created_at)}
                                          </td>
                                          <td>
                                            {utils.formatDate(task.updated_at)}
                                          </td>

                                          <td>
                                            <Form.Check
                                              name="checkbox3"
                                              key={`check2${task._id}`}
                                              onChange={() => {
                                                this.addPermission(task);
                                              }}
                                              value=""
                                              checked={this.includesTask(task)}
                                              type="checkbox"
                                              id={`check2${task._id}`}
                                              label=""
                                            />
                                          </td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <tr>
                                      <td className="text-center" colSpan="6">
                                        <FetchingRecords
                                          isFetching={this.state.isFetching}
                                        />
                                      </td>
                                    </tr>
                                  )}
                                </tbody>

                                <tfoot>
                                  <tr>
                                    <td colSpan="7"></td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
            {/* </div> */}
            {/* <!-- end of col--> */}
          </div>
        </div>
      </>
    );
  }
}

export default DashboardProductView;
