import React, { Component, useState, useEffect } from "react";
import {
  Dropdown,
  Row,
  Col,
  Button,
  Form,
  ButtonToolbar,
  Modal,
} from "react-bootstrap";

import swal from "sweetalert2";
import AppMainService from "../../services/appMainService";
import * as utils from "@utils";
import { Formik } from "formik";
import * as yup from "yup";
import AppNotification from "../../appNotifications";
import { FetchingRecords } from "../../appWidgets";
import localStorageService from "../../services/localStorageService";
import BidService from "app/services/bidService";
import StockBids from "../products/stockBids";

import LaddaButton, {
  XL,
  EXPAND_LEFT,
  EXPAND_RIGHT,
  EXPAND_UP,
  CONTRACT,
} from "react-ladda";

export class BidsComponent extends Component {
  state = {
    editedIndex: 0,
    allBids: [],
    showEditModal: false,
    showCreateModal: false,
    isSaving: false,
    isFetching: true,
    saveMsg: "Save",
    updateMsg: "Update",
    authUser: localStorageService.getItem("AUTH_USER"),
    editedBid: {},
    createBidForm: {
      name: "",
      description: "",
      parentId: "",
    },
    updateBidForm: {
      name: "",
      parentId: "",
      description: "",
    },
  };
  appMainService;

  constructor(props) {
    super(props);
    this.bidService = new BidService();
    this.appMainService = new AppMainService();
  }

  componentDidMount() {
    this.getAllBids();
  }

  /**
   *
   * @param {*} event
   * @param {*} errors
   * @param {*} form
   */

  handleChange = (event, form = "create") => {
    const { createBidForm, updateBidForm } = this.state;
    if (form == "create") {
      createBidForm[event.target.name] = event.target.value;
    } else if (form == "edit") {
      updateBidForm[event.target.name] = event.target.value;
    }
    this.setState({ createBidForm, updateBidForm });
  };

  setUpdatedBid = (bidResponse) => {
    const { allBids } = this.state;
    const { _id, stage } = bidResponse;
    allBids.forEach((bid) => {
      if (bid._id == _id) {
        bid.stage = stage;
      }
    });
    this.setState({ allBids });
  };

  /**
   * This method lists all bids
   */
  getAllBids = async () => {
    let isFetching = false;

    this.bidService
      .getAllBidsBBuyerId(this.state.authUser?._id)
      .then((bidsResponse) => {
        const allBids = bidsResponse;
        allBids.forEach((cat) => {
          const subLevel = cat.ancestors ? cat.ancestors.length : 0;
          // cat['sub_level'] = subLevel;
          cat["parent"] = subLevel ? cat.ancestors[subLevel - 1] : null;
        });
        this.setState({ allBids, isFetching });
        console.log("Bids response", bidsResponse);
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
   * This method creates a new bid
   */
  createBid = async () => {
    const { createBidForm, allBids } = this.state;
    if (+createBidForm.commission >= 100) {
      const commissionError = {
        type: "error",
        msg: "Sales commision cannot be more than 99%",
      };
      return new AppNotification(commissionError);
    }
    let isSaving = true;
    let saveMsg = "Saving";
    this.setState({ isSaving, saveMsg });
    createBidForm["ancestors"] = this.getAncestry(createBidForm.parentId);
    this.appMainService
      .createBid(createBidForm)
      .then((bidData) => {
        isSaving = false;
        saveMsg = "Save";
        const subLevel = bidData.ancestors ? bidData.ancestors.length : 0;
        // cat['sub_level'] = subLevel;
        bidData["parent"] = subLevel ? bidData.ancestors[subLevel - 1] : null;
        allBids.unshift(bidData);
        this.setState({ allBids, isSaving, saveMsg });
        const successNotification = {
          type: "success",
          msg: `${bidData.name} successfully created!`,
        };
        new AppNotification(successNotification);
        this.toggleModal();
        this.resetForm();
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
   * This method updates a new bid
   */
  updateBid = async () => {
    let { updateBidForm, allBids, editedBid } = this.state;

    if (+updateBidForm.commission >= 100) {
      const commissionError = {
        type: "error",
        msg: "Sales commision cannot be more than 99%",
      };
      return new AppNotification(commissionError);
    }
    let isSaving = true;
    let updateMsg = "Updating";
    this.setState({ isSaving, updateMsg });
    this.appMainService
      .updateBid(updateBidForm, editedBid._id)
      .then((updatedBid) => {
        updatedBid.temp_flash = true;
        isSaving = false;
        updateMsg = "Update";
        allBids.splice(this.state.editedIndex, 1, updatedBid);
        this.setState({ allBids, isSaving, updateMsg });
        const successNotification = {
          type: "success",
          msg: `${updatedBid.name} successfully updated!`,
        };
        new AppNotification(successNotification);
        this.toggleModal("edit");

        setTimeout(() => {
          updatedBid.temp_flash = false;
          allBids.splice(this.state.editedIndex, 1, updatedBid);
          this.setState({ allBids, isSaving, updateMsg });
        }, 10000);
      })
      .catch((error) => {
        isSaving = false;
        updateMsg = "Update";
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
   * @param {*} modalName
   * This method toggles a modal
   */
  toggleModal = (modalName = "create") => {
    let { showEditModal, showCreateModal } = this.state;
    if (modalName == "create") {
      showCreateModal = !showCreateModal;
    } else if (modalName == "edit") {
      showEditModal = !showEditModal;
    }

    this.setState({ showEditModal, showCreateModal });
  };

  /**
   * This method sets the bid to be edited
   *  and opens the modal for edit
   *
   */
  editBid = (editedBid) => {
    const updateBidForm = { ...editedBid };
    const editedIndex = this.state.allBids.findIndex(
      (bid) => editedBid._id == bid._id
    );
    this.setState({ editedBid, editedIndex, updateBidForm });
    this.toggleModal("edit");
  };

  /**
   *
   * @param {*} bid
   * This method toggles a bid's status
   */
  toggleBid = (bid) => {
    const toggleMsg = bid.status ? "Disable" : "Enable";
    const gL = bid.status ? "lose" : "gain";

    swal
      .fire({
        title: `<small>${toggleMsg}&nbsp;<b>${bid.name}</b>?</small>`,
        text: `${bid.name} members will ${gL} permissions.`,
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
          let { allBids } = this.state;
          const toggleIndex = allBids.findIndex((r) => r._id == bid._id);
          // bid.status = !bid.status;

          this.appMainService
            .toggleBid(bid)
            .then((toggledBid) => {
              allBids.splice(toggleIndex, 1, toggledBid);
              this.setState({ allBids });
              const successNotification = {
                type: "success",
                msg: `${toggledBid.name} successfully ${toggleMsg}d!`,
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
   * @param {*} bid
   * This method deletes a bid
   *
   */
  deleteBid = (bid) => {
    swal
      .fire({
        title: `<small>Delete&nbsp;<b>${bid.name}</b>?</small>`,
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
          let { allBids } = this.state;
          this.appMainService
            .deleteBid(bid)
            .then((deletedBid) => {
              allBids = allBids.filter((r) => r._id !== bid._id);
              this.setState({ allBids });
              const successNotification = {
                type: "success",
                msg: `${bid.name} successfully deleted!`,
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
    const createBidForm = {
      name: "",
      description: "",
    };
    this.setState({ createBidForm });
  };

  /**
   * This method recursively builds the ancestry of a bid using its parentId
   */
  getAncestry = (parentId, ancestry = []) => {
    const { allBids } = this.state;
    let immediateParent = allBids.find((cat) => {
      return parentId == cat._id;
    });
    if (immediateParent) {
      const { _id, name } = immediateParent;
      ancestry.push({ _id, name });
      if (immediateParent.parentId) {
        return this.getAncestry(immediateParent.parentId, ancestry);
      }
    }
    return ancestry.reverse();
  };

  render() {
    const { allBids, authUser } = this.state;
    const showColumns = {
      stage: true,
      action: true,
      buyer_dashboard: true,
      more: true,
    };

    return (
      <>
        <div className="specific">
          <Modal
            show={this.state.showEditModal}
            onHide={() => {
              this.toggleModal("edit");
            }}
            {...this.props}
            id="edit_modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Update {this.state.editedBid.name}</Modal.Title>
            </Modal.Header>

            <Formik
              initialValues={this.state.updateBidForm}
              validationSchema={this.updateBidSchema}
              onSubmit={this.updateBid}
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
                    <Modal.Body>
                      <div className="form-row">
                        <div
                          className={utils.classList({
                            "col-md-12 mb-2": true,
                            "valid-field": !errors.name && touched.name,
                            "invalid-field": errors.name && touched.name,
                          })}
                        >
                          <label htmlFor="bid_name">
                            <b>
                              Name<span className="text-danger">*</span>
                            </b>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="bid_name"
                            placeholder=""
                            name="name"
                            value={values.name}
                            onChange={(event) =>
                              this.handleChange(event, "edit")
                            }
                            onBlur={handleBlur}
                            required
                          />
                          <div className="valid-feedback"></div>
                          <div className="invalid-feedback">
                            Name is required
                          </div>
                        </div>

                        <div
                          className={utils.classList({
                            "col-md-12 mb-2": true,
                            "valid-field":
                              !errors.commission && touched.commission,
                            "invalid-field":
                              errors.commission && touched.commission,
                          })}
                        >
                          <label htmlFor="bid_commission">
                            <b>
                              Sales Commision (%)
                              <span className="text-danger">*</span>
                            </b>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="bid_commission"
                            placeholder=""
                            name="commission"
                            value={values.commission}
                            onChange={(event) =>
                              this.handleChange(event, "edit")
                            }
                            onBlur={handleBlur}
                            required
                          />
                          <div className="valid-feedback"></div>
                          <div className="invalid-feedback">
                            {errors.commission}
                          </div>
                        </div>

                        <div
                          className={utils.classList({
                            "col-md-12 mb-2": true,
                            "valid-field":
                              touched.description && !errors.description,
                            "invalid-field":
                              touched.description && errors.description,
                          })}
                        >
                          <label htmlFor="update_bid_description">
                            <b>
                              Description<span className="text-danger">*</span>
                            </b>
                          </label>

                          <textarea
                            className="form-control"
                            id="update_bid_description"
                            onChange={(event) =>
                              this.handleChange(event, "edit")
                            }
                            name="description"
                            defaultValue={values.description}
                          />
                          <div className="valid-feedback"></div>
                          <div className="invalid-feedback">
                            Description is required
                          </div>
                        </div>
                      </div>
                    </Modal.Body>

                    <Modal.Footer>
                      <LaddaButton
                        className="btn btn-secondary_custom border-0 mr-2 mb-2 position-relative"
                        loading={false}
                        progress={0.5}
                        type="button"
                        onClick={() => this.toggleModal("edit")}
                      >
                        Close
                      </LaddaButton>

                      <LaddaButton
                        className={`btn btn-${
                          utils.isValid(
                            this.updateBidSchema,
                            this.state.updateBidForm
                          )
                            ? "success"
                            : "info_custom"
                        } border-0 mr-2 mb-2 position-relative`}
                        loading={this.state.isSaving}
                        progress={0.5}
                        type="submit"
                        data-style={EXPAND_RIGHT}
                      >
                        {this.state.updateMsg}
                      </LaddaButton>
                    </Modal.Footer>
                  </form>
                );
              }}
            </Formik>
          </Modal>

          <Modal
            show={this.state.showCreateModal}
            onHide={() => {
              this.toggleModal("create");
            }}
            {...this.props}
            id="create_modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Create Bid</Modal.Title>
            </Modal.Header>

            <Formik
              initialValues={this.state.createBidForm}
              validationSchema={this.createBidSchema}
              onSubmit={this.createBid}
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
                    <Modal.Body>
                      <div className="form-row">
                        <div
                          className={utils.classList({
                            "col-md-12 mb-2": true,
                            "valid-field": !errors.parentId && touched.parentId,
                            "invalid-field":
                              errors.parentId && touched.parentId,
                          })}
                        >
                          <label htmlFor="parent_bid_name">
                            <b>Parent Bid(optional)</b>
                          </label>
                          {/* <input
                                    type="text"
                                    className="form-control"
                                    id="bid_name"
                                    placeholder=""
                                    name="name"
                                    value={values.name}
                                    onChange={(event)=>this.handleChange(event)}
                                    onBlur={handleBlur}
                                    required
                                    /> */}

                          <select
                            className="form-control"
                            id="parent_bid_name"
                            name="parentId"
                            onChange={(event) => this.handleChange(event)}
                            onBlur={handleBlur}
                            value={values.parentId}
                          >
                            <option value="">Select Parent Bid</option>
                            {this.state.allBids.map((cat) => {
                              return (
                                <option value={cat._id} key={cat._id}>
                                  {cat.name}
                                </option>
                              );
                            })}
                          </select>
                          <div className="valid-feedback"></div>
                          <div className="invalid-feedback">
                            Parent Bid is required
                          </div>
                        </div>

                        <div
                          className={utils.classList({
                            "col-md-12 mb-2": true,
                            "valid-field": !errors.name && touched.name,
                            "invalid-field": errors.name && touched.name,
                          })}
                        >
                          <label htmlFor="bid_name">
                            <b>
                              Name<span className="text-danger">*</span>
                            </b>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="bid_name"
                            placeholder=""
                            name="name"
                            value={values.name}
                            onChange={(event) => this.handleChange(event)}
                            onBlur={handleBlur}
                            required
                          />
                          <div className="valid-feedback"></div>
                          <div className="invalid-feedback">
                            Name is required
                          </div>
                        </div>

                        <div
                          className={utils.classList({
                            "col-md-12 mb-2": true,
                            "valid-field":
                              !errors.commission && touched.commission,
                            "invalid-field":
                              errors.commission && touched.commission,
                          })}
                        >
                          <label htmlFor="create_bid_commission">
                            <b>
                              Sales Commission (%)
                              <span className="text-danger">*</span>
                            </b>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="create_bid_commission"
                            placeholder=""
                            name="commission"
                            value={values.commission}
                            onChange={(event) => this.handleChange(event)}
                            onBlur={handleBlur}
                            required
                          />
                          <div className="valid-feedback"></div>
                          <div className="invalid-feedback">
                            {errors.commission}
                          </div>
                        </div>

                        <div
                          className={utils.classList({
                            "col-md-12 mb-2": true,
                            "valid-field":
                              touched.description && !errors.description,
                            "invalid-field":
                              touched.description && errors.description,
                          })}
                        >
                          <label htmlFor="create_bid_description">
                            <b>
                              Description<span className="text-danger">*</span>
                            </b>
                          </label>

                          <textarea
                            className="form-control"
                            id="create_bid_description"
                            onChange={(event) => this.handleChange(event)}
                            name="description"
                            defaultValue={values.description}
                          />
                          <div className="valid-feedback"></div>
                          <div className="invalid-feedback">
                            Description is required
                          </div>
                        </div>
                      </div>
                    </Modal.Body>

                    <Modal.Footer>
                      <LaddaButton
                        className="btn btn-secondary_custom border-0 mr-2 mb-2 position-relative"
                        loading={false}
                        progress={0.5}
                        type="button"
                        onClick={() => this.toggleModal("create")}
                      >
                        Close
                      </LaddaButton>

                      <LaddaButton
                        className={`btn btn-${
                          utils.isValid(
                            this.createBidSchema,
                            this.state.createBidForm
                          )
                            ? "success"
                            : "info_custom"
                        } border-0 mr-2 mb-2 position-relative`}
                        loading={this.state.isSaving}
                        progress={0.5}
                        type="submit"
                        data-style={EXPAND_RIGHT}
                      >
                        {this.state.saveMsg}
                      </LaddaButton>
                    </Modal.Footer>
                  </form>
                );
              }}
            </Formik>
          </Modal>

          <div className="float-right">
            {/* <Button  variant="secondary_custom" className="ripple m-1 text-capitalize" onClick={ ()=>{ this.toggleModal('create')} }><i className='i-Add'></i> Create Bid</Button> */}
          </div>

          <div className="breadcrumb">
            <h1>Bids</h1>
            <ul>
              <li>
                <a href="#">List</a>
              </li>
              <li>View</li>
            </ul>
          </div>

          <div className="separator-breadcrumb border-top"></div>
          <div className="row mb-4">
            <div className="col-md-12 mb-4">
              <div className="card text-left">
                <div className="card-body">
                  <h4 className="card-title mb-3">Bids</h4>
                  <p>List of Bids.</p>

                  {/* <div style={{"maxHeight":"500px", "overflowY":"scroll"}}> */}

                  <div className="table-responsive">
                    <StockBids
                      featuredBids={allBids}
                      authUser={authUser}
                      showColumns={showColumns}
                      setUpdatedBid={(bidRes) => this.setUpdatedBid(bidRes)}
                    />
                  </div>
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

  createBidSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    commission: yup.number().required("Sales commission is required"),
    description: yup.string().required("Description is required"),
    parentId: null,
  });

  updateBidSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    commission: yup.number().required("Sales commission is required"),
    description: yup.string().required("Description is required"),
    parentId: null,
  });
}

export default BidsComponent;
