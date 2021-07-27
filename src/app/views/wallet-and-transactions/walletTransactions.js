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
} from "react-bootstrap";

import swal from "sweetalert2";
import AppMainService from "../../services/appMainService";
import BidService from "../../services/bidService";
import localStorageService from "../../services/localStorageService";
import * as utils from "@utils";
import { Formik } from "formik";
import * as yup from "yup";
import AppNotification from "../../appNotifications";
import { FetchingRecords } from "../../appWidgets";
import { Link, Redirect } from "react-router-dom";
// import queryString from 'query-string';
import { APP_ENVIRONMENT } from "app/environment/environment";

import LaddaButton, {
  XL,
  EXPAND_LEFT,
  EXPAND_RIGHT,
  EXPAND_UP,
  CONTRACT,
} from "react-ladda";
import { toLength } from "lodash";
import { usePaystackPayment } from "react-paystack";
import { FaChevronDown, FaExternalLinkAlt } from "react-icons/fa";

export class WalletTransactionDetailComponent extends Component {
  state = {
    walletTransactionSlug: "",
    viewedWalletTransaction: {},
    allChecked: false,
    navigate: false,
    newRoute: "",
    editedIndex: 0,
    paymentMode: "Top-Up",
    allWalletTransactions: [],
    allTasks: [],
    authUser: localStorageService.getItem("AUTH_USER"),
    isSaving: false,
    isFetching: true,
    updateMsg: "Save",
    topUpForm: {
      amount: "",
    },
    showInvalidTopUpAmount: false,
    walletTransactionMembers: [
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
    this.bidService = new BidService();
  }

  componentDidMount() {
    this.getWalletByUserId();
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

  /**
   *
   * @param {*} task
   * This method saves the permissions for a walletTransaction
   */
  addPermission = (task) => {
    let { viewedWalletTransaction, allChecked } = this.state;
    const tasks = viewedWalletTransaction["tasks"];
    const findTask = tasks.findIndex((t) => t._id == task._id);
    if (findTask != -1) {
      tasks.splice(findTask, 1); // remove
    } else {
      tasks.push(task); // add
      console.log("Tasks ", tasks);
    }
    allChecked = tasks?.length == this.state.allTasks.length && tasks.length;
    viewedWalletTransaction["tasks"] = tasks;
    this.setState({ viewedWalletTransaction, allChecked });
  };

  handleTopUpFormChange = (e) => {
    const { name, value } = e.target;
    const { topUpForm } = this.state;
    topUpForm[name] = value;
    this.setState({
      topUpForm,
    });
  };

  /**
   * This method lists all walletTransactions
   */
  getWalletByUserId = async () => {
    let isFetching = false;

    this.bidService
      .getWalletByUserId(this.state.authUser._id)
      .then((walletTransactionsResponse) => {
        const viewedWalletTransaction = walletTransactionsResponse;
        this.setState({ viewedWalletTransaction, isFetching });
        console.log("WalletTransactions response", walletTransactionsResponse);
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

  // you can call this function anything
  onPaySuccess = (transaction) => {
    // Implementation for whatever you want to do with reference and after success call.
    const { topUpForm } = this.state;
    const { amount } = topUpForm;
    this.createTransactionAndUpdateWallet(amount, transaction);
    console.log({
        transaction, amount
    });
  };

  // you can call this function anything
  onPopClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log("closed");
  };

  PaystackPopUp = ({ topUpForm, authUser }) => {
    const config = {
      reference: new Date().getTime().toString(),
      email: authUser && authUser?.email,
      amount: topUpForm?.amount && parseInt(topUpForm.amount) * 100,
      publicKey: APP_ENVIRONMENT.paystack_api_key,
    };
    const initializePayment = usePaystackPayment(config);
    return (
      <div>
        <button
          className="btn btn-info_custom text-center "
          onClick={() => {
            this.setState({
              showInvalidTopUpAmount: false,
            });
            if (!topUpForm?.amount) {
              this.setState({
                showInvalidTopUpAmount: true,
              });
              return new AppNotification({
                type: "error",
                msg: "Please enter a valid amount.",
              });
            }
            initializePayment(this.onPaySuccess, this.onPopClose);
          }}
        >
          Make payment <FaExternalLinkAlt />
        </button>
      </div>
    );
  };

  createTransactionAndUpdateWallet = (amount, transaction) => {
    this.bidService
      .createTransactionAndUpdateWallet({
        user: this.state.authUser._id,
        amount,
        transaction,
      })
      .then((walletTransactionResponse) => {
        this.getWalletByUserId();
      })
      .catch((e) => {
        new AppNotification({
          type: "error",
          msg: utils.processErrors(e),
        });
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
          this.state?.viewedWalletTransaction?.tasks?.length ==
            allTasks.length && allTasks.length;

        this.setState({ allTasks, isFetching, allChecked });
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
      this.state?.viewedWalletTransaction?.tasks?.filter(
        (t) => t._id == task._id
      ).length > 0
    );
  };

  checkorUncheckAll = () => {
    let { allTasks, viewedWalletTransaction, allChecked } = this.state;
    let { tasks } = viewedWalletTransaction;

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
    viewedWalletTransaction["tasks"] = tasks;
    this.setState({ viewedWalletTransaction, allChecked });
  };

  /**
   * This method updates a new walletTransaction
   */
  savePermissions = async () => {
    let isSaving = true;
    let updateMsg = "Saving";
    this.setState({ isSaving, updateMsg });
    this.appMainService
      .updateWalletTransaction(
        this.state.viewedWalletTransaction,
        this.state.viewedWalletTransaction._id
      )
      .then((viewedWalletTransaction) => {
        isSaving = false;
        updateMsg = "Save";
        this.setState({ viewedWalletTransaction, isSaving, updateMsg });
        const successNotification = {
          type: "success",
          msg: `Successfully updated ${viewedWalletTransaction.name} permissions!`,
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
   * @param {*} walletTransaction
   * This method toggles a walletTransaction's status
   */
  toggleWalletTransaction = (walletTransaction) => {
    const toggleMsg = walletTransaction.status ? "Disable" : "Enable";
    const gL = walletTransaction.status ? "lose" : "gain";

    swal
      .fire({
        title: `<small>${toggleMsg}&nbsp;<b>${walletTransaction.name}</b>?</small>`,
        text: `${walletTransaction.name} members will ${gL} permissions.`,
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
          let { allWalletTransactions } = this.state;
          const toggleIndex = allWalletTransactions.findIndex(
            (r) => r._id == walletTransaction._id
          );
          // walletTransaction.status = !walletTransaction.status;

          this.appMainService
            .toggleWalletTransaction(walletTransaction)
            .then((toggledWalletTransaction) => {
              allWalletTransactions.splice(
                toggleIndex,
                1,
                toggledWalletTransaction
              );
              this.setState({ allWalletTransactions });
              const successNotification = {
                type: "success",
                msg: `${toggledWalletTransaction.name} successfully ${toggleMsg}d!`,
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
   * @param {*} walletTransaction
   * This method deletes a walletTransaction
   *
   */
  deleteWalletTransaction = (walletTransaction) => {
    swal
      .fire({
        title: `<small>Delete&nbsp;<b>${walletTransaction.name}</b>?</small>`,
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
          let { allWalletTransactions } = this.state;
          this.appMainService
            .deleteWalletTransaction(walletTransaction)
            .then((deletedWalletTransaction) => {
              allWalletTransactions = allWalletTransactions.filter(
                (r) => r._id !== walletTransaction._id
              );
              this.setState({ allWalletTransactions });
              const successNotification = {
                type: "success",
                msg: `${walletTransaction.name} successfully deleted!`,
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
    const createWalletTransactionForm = {
      name: "",
      description: "",
    };
    this.setState({ createWalletTransactionForm });
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
    const { PaystackPopUp, handleTopUpFormChange } = this;
    const {
      navigate,
      newRoute,
      authUser,
      paymentMode,
      topUpForm,
      showInvalidTopUpAmount,
    } = this.state;
    if (navigate) {
      return <Redirect to={newRoute} />;
    }

    return (
      <>
        <div className="specific">
          <div className="float-right">
            {/* <Button  variant="secondary_custom" className="ripple m-1 text-capitalize" onClick={ ()=>{ this.toggleModal('create')} }><i className='i-Add'></i> Create WalletTransaction</Button> */}
          </div>

          <div className="breadcrumb">
            <h1>Wallet | Transactions</h1>
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
                    defaultActiveKey="walletTransaction_information"
                    id="uncontrolled-tab-example"
                  >
                    <Tab
                      eventKey="walletTransaction_information"
                      title={this.customTabHeader(
                        "Wallet Information",
                        "i-Atom"
                      )}
                    >
                      <div className="mt-2">
                        <div className="row">
                          <div className="col-md-5 border-right">
                            <div className="card ">
                              <div className="card-header">
                                <h4 className="card-titlex">
                                  <Badge
                                    className={`badge-round-${
                                      this.state.viewedWalletTransaction?.status
                                        ? "success"
                                        : "danger"
                                    }  m-1`}
                                  >
                                    {this.state.viewedWalletTransaction
                                      ?.status ? (
                                      <span>&#x2713;</span>
                                    ) : (
                                      <span>&#x2713;</span>
                                    )}
                                  </Badge>
                                  Account Balance:{" "}
                                  <span className="lead text-primary text-24 pl-2 text-capitalize">
                                    &#x20a6;
                                    {utils.formatNumber(
                                      this.state.viewedWalletTransaction
                                        ?.balance
                                    )}
                                  </span>
                                </h4>
                              </div>

                              <div className="card-body">
                                <p>
                                  {
                                    this.state.viewedWalletTransaction
                                      ?.description
                                  }
                                </p>
                                <ul className="list-group list-group-flush">
                                  <li className="list-group-item">
                                    <b>Currency: </b>
                                    NGN
                                  </li>

                                  <li className="list-group-item">
                                    <b>Status: </b>
                                    <span
                                      className={
                                        this.state.viewedWalletTransaction
                                          ?.status
                                          ? "text-success"
                                          : "text-success"
                                      }
                                    >
                                      {this.state.viewedWalletTransaction
                                        ?.status
                                        ? "Active"
                                        : "Active"}
                                    </span>
                                  </li>
                                  <li className="list-group-item">
                                    <b>Created at: </b>
                                    {utils.formatDate(
                                      this.state.viewedWalletTransaction
                                        ?.created_at
                                    )}
                                  </li>
                                  <li className="list-group-item">
                                    <b>Last updated: </b>
                                    {utils.formatDate(
                                      this.state.viewedWalletTransaction
                                        ?.updated_at
                                    )}
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-7">
                            <div className="card ">
                              <div className="card-header">
                                <div className="float-left">
                                  <div className="btn-group">
                                    <button
                                      onClick={() =>
                                        this.setState({ paymentMode: "Top-Up" })
                                      }
                                      className={`btn btn-${
                                        paymentMode == "Top-Up"
                                          ? "success"
                                          : "info_custom"
                                      }`}
                                    >
                                      Top-Up <FaChevronDown />
                                    </button>
                                    <button
                                      onClick={() =>
                                        this.setState({
                                          paymentMode: "Cashout",
                                        })
                                      }
                                      className={`btn btn-${
                                        paymentMode == "Top-Up"
                                          ? "info"
                                          : "success"
                                      }`}
                                    >
                                      Cashout <FaChevronDown />
                                    </button>
                                  </div>
                                </div>

                                {paymentMode !== "Top-Up" && (
                                  <div className="float-right">
                                    <select className="form-control">
                                      <option>
                                        Select existing beneficiary
                                      </option>
                                    </select>
                                  </div>
                                )}
                                <h4
                                  className={`card-titlex text-center text-${
                                    paymentMode == "Top-Up"
                                      ? "info_custom"
                                      : "info"
                                  }`}
                                >
                                  <b>{paymentMode}</b>
                                </h4>
                              </div>

                              <div
                                className="card-body pt-4"
                                style={{ minHeight: "12em" }}
                              >
                                {paymentMode == "Top-Up" ? (
                                  <form>
                                    <div className="form-group">
                                      <div className="form-row">
                                        <div className="col-6">
                                          <label>
                                            <b>
                                              Amount
                                              <span className="text-danger">
                                                *
                                              </span>
                                            </b>
                                          </label>
                                          <input
                                            className="form-control"
                                            name="amount"
                                            type="number"
                                            onChange={handleTopUpFormChange}
                                            value={topUpForm?.amount || ""}
                                          />
                                          {showInvalidTopUpAmount &&
                                            !topUpForm?.amount && (
                                              <small className="text-danger">
                                                Please enter a valid amount.
                                              </small>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  </form>
                                ) : (
                                  <form>
                                    <div className="form-group">
                                      <div className="form-row">
                                        <div className="col-6">
                                          <label>
                                            <b>Account Number:</b>
                                          </label>
                                          <input
                                            className="form-control"
                                            name="account_no"
                                            type="text"
                                          />
                                        </div>
                                        <div className="col-6">
                                          <label>
                                            <b>
                                              Bank
                                              <span className="text-danger">
                                                *
                                              </span>
                                            </b>
                                          </label>
                                          <select className="form-control">
                                            <option>Access Bank</option>
                                            <option>
                                              Guaranty Trust Bank PLC
                                            </option>
                                          </select>
                                        </div>
                                      </div>

                                      <div className="form-row">
                                        <div className="col-6">
                                          <label>
                                            <b>Beneficiary Name</b>
                                          </label>
                                          <input
                                            className="form-control"
                                            name="beneficiary_name"
                                            readOnly
                                            type="text"
                                          />
                                        </div>
                                        <div className="col-6">
                                          <label>
                                            <b>
                                              Amount
                                              <span className="text-danger">
                                                *
                                              </span>
                                            </b>
                                          </label>
                                          <input
                                            className="form-control"
                                            name="amount"
                                            type="number"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </form>
                                )}
                              </div>

                              <div className="card-footer paystack-footer">
                                <div className="float-left">
                                  <em>Powered by</em> &nbsp;{" "}
                                  <img src="/assets/images/paystack.png" />
                                </div>
                                <div className="float-right">
                                  {paymentMode == "Top-Up" ? (
                                    <PaystackPopUp
                                      authUser={authUser}
                                      topUpForm={topUpForm}
                                    />
                                  ) : (
                                    <button className="btn btn-info">
                                      Submit
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab
                      eventKey="permissions"
                      title={this.customTabHeader("Transactions", "i-Gear-2")}
                    >
                      <div className="card ">
                        <div className="card-header card-title mb-0 d-flex align-items-center justify-content-between border-0">
                          <h3 className="w-50 float-left card-title m-0">
                            <i className="i-Gears"></i>{" "}
                            <b>{this.state.viewedWalletTransaction?.name}</b>{" "}
                            permissions
                          </h3>

                          <div className="float-right">
                            {/* <Button  variant="secondary_custom" className="ripple m-1 text-capitalize" onClick={ ()=>{ this.toggleModal('create')} }><i className='i-Add'></i> Create WalletTransaction</Button> */}

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

export default WalletTransactionDetailComponent;
