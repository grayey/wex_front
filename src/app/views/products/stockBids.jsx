import React, { useEffect, useState } from "react";
import { CustomProgressBar, BidStageInput } from "app/appWidgets";
import { Carousel, Dropdown, Row, Col, Button, Modal } from "react-bootstrap";
import { FaExternalLinkAlt } from "react-icons/fa";
import * as utils from "@utils";
import { Formik } from "formik";
import * as yup from "yup";
import BidService from "app/services/bidService";
import { Link, Redirect } from "react-router-dom";

import LaddaButton, {
  XL,
  EXPAND_LEFT,
  EXPAND_RIGHT,
  EXPAND_UP,
  CONTRACT,
} from "react-ladda";
import Rating from "react-rating";
import {
  MdStarBorder,
  MdStar,
  MdFavoriteBorder,
  MdFavorite,
} from "react-icons/md";
import AppNotification from "app/appNotifications";

const newRateSchema = yup.object().shape({
  comment: yup.string().required("Comment is required"),
});
const bidService = new BidService();

export default function StockBids(props) {
  const { featuredBids, authUser, showColumns, setUpdatedBid } = props;

  useEffect(() => {}, []);

  const [showRatingModal, setRatingModal] = useState(false);
  const [ratingForm, setRatingForm] = useState({
    comment: "",
    rate: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [ratedBid, setRatedBid] = useState({});
  const [navigation, setNavigation] = useState({
    navigate: false,
    newRoute: "",
  });
  const saveBidReview = () => {
    setIsSaving(true);
    const { rate, comment } = ratingForm;
    const ratingData = {
      rating: rate,
      comment,
      bid: ratedBid._id,
      reviewer: authUser._id,
    };
    const updateId = ratedBid.review ? ratedBid.review?._id : "";
    bidService
      .saveBidReview(ratingData, updateId)
      .then((ratingResponse) => {
        setIsSaving(false);
        setRatingModal(false);
        new AppNotification({
          type: "success",
          msg: "Review submitted",
        });
      })
      .catch((e) => {
        setIsSaving(false);
        new AppNotification({
          type: "error",
          msg: utils.processErrors(e),
        });
      });
  };
  const handleRatingChange = (event) => {
    const { name, value } =
      typeof event == "number" ? { name: "rate", value: event } : event?.target;
    setRatingForm({
      ...ratingForm,
      [name]: value,
    });
  };

  /**
   *
   * This method sets the product to be viewed
   *
   *
   */
  const gotoChatByBid = (event, bid) => {
    event.preventDefault();
    const newRoute = `/dashboard/bids/${bid._id}/chat`;
    setNavigation({ navigate: true, newRoute });
  };

  return navigation.navigate ? <Redirect to={navigation.newRoute} /> : (
    <>
      <Modal
        show={showRatingModal}
        onHide={() => {
          setRatingModal(false);
        }}
        {...props}
        id="rating_modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div>Bid Rating</div>
            <small>
              <code>
                {ratedBid?.stock?.product_id?.name}-{ratedBid._id}
              </code>
            </small>
          </Modal.Title>
        </Modal.Header>

        <Formik
          initialValues={ratingForm}
          validationSchema={newRateSchema}
          onSubmit={saveBidReview}
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
                      })}
                    >
                      <label htmlFor="role_name">
                        <b>
                          Rating ({ratingForm.rate})
                          <span className="text-danger">*</span>
                        </b>
                      </label>

                      <Rating
                        initialRating={ratingForm.rate}
                        fractions={2}
                        emptySymbol={<MdStarBorder size={22}></MdStarBorder>}
                        fullSymbol={
                          <MdStar className="text-warning" size={22}></MdStar>
                        }
                        onChange={handleRatingChange}
                      ></Rating>
                    </div>
                    <div
                      className={utils.classList({
                        "col-md-12 mb-2": true,
                        "valid-field": touched.comment && !errors.comment,
                        "invalid-field": touched.comment && errors.comment,
                      })}
                    >
                      <label htmlFor="update_role_comment">
                        <b>
                          Comment<span className="text-danger">*</span>
                        </b>
                      </label>

                      <textarea
                        className="form-control"
                        id="update_role_comment"
                        onChange={(event) => {
                          handleRatingChange(event);
                          handleChange(event);
                        }}
                        name="comment"
                        defaultValue={ratingForm.comment}
                      />
                      <div className="valid-feedback"></div>
                      <div className="invalid-feedback">
                        Comment is required
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
                    onClick={() => setRatingModal(false)}
                  >
                    Close
                  </LaddaButton>

                  <LaddaButton
                    className={`btn btn-${
                      utils.isValid(newRateSchema, ratingForm)
                        ? "success"
                        : "info_custom"
                    } border-0 mr-2 mb-2 position-relative`}
                    loading={isSaving}
                    progress={0.5}
                    type="submit"
                    data-style={EXPAND_RIGHT}
                  >
                    Submit
                  </LaddaButton>
                </Modal.Footer>
              </form>
            );
          }}
        </Formik>
      </Modal>

      <div className="table-responsive">
        <table className="table table-sm table-striped">
          <thead>
            <tr>
              <th>#</th>
              {(!showColumns || !showColumns.buyer_dashboard) && <th>Buyer</th>}

              {showColumns.buyer_dashboard && (
                <>
                  <th>Owner</th>
                  <th>Category</th>
                  <th>Product</th>
                  <th>Images</th>
                </>
              )}

              <th>Price/Kg (&#x20a6;)</th>
              <th>Quantity(kg)</th>
              <th>Time of Bid</th>
              {showColumns && showColumns?.stage && <th>Stage</th>}
              {showColumns && showColumns?.action && <th>Action</th>}
              {showColumns && showColumns?.more && <th>More</th>}
            </tr>
          </thead>

          <tbody>
            {featuredBids.length ? (
              featuredBids.map((bid, index) => {
                const userId = bid?.buyer?._id || bid?.user_id;
                return (
                  <tr key={index}>
                    <td>
                      {index + 1}.
                      {authUser?._id == userId &&
                        !showColumns?.buyer_dashboard && (
                          <sup>
                            <span className="badge badge-sm badge-danger">
                              <small>You</small>
                            </span>
                          </sup>
                        )}
                    </td>
                    {!showColumns.buyer_dashboard && (
                      <td>
                        <code>{bid?.buyer?.full_name || bid?.name}</code>
                      </td>
                    )}
                    {showColumns.buyer_dashboard && (
                      <>
                        <td>{bid?.stock?.product_id?.owner?.full_name}</td>
                        <td>{bid?.stock?.product_id?.category?.name}</td>
                        <td>{bid?.stock?.product_id?.name}</td>
                        <td>
                          <Carousel indicators={false}>
                            {bid?.stock?.images.map((img, ind) => (
                              <Carousel.Item key={ind}>
                                <div className="ul-widget3-img">
                                  <img
                                    src={img.preview_url}
                                    id="userDropdown"
                                    alt=""
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  />
                                </div>
                              </Carousel.Item>
                            ))}
                          </Carousel>
                        </td>
                      </>
                    )}
                    <td className="text-center">{bid?.price_per_kg}</td>
                    <td className="text-center">{bid?.quantity}</td>
                    <td>
                      <code>{bid?.created_at}</code>
                    </td>
                    {showColumns && showColumns?.stage && (
                      <td>
                        <CustomProgressBar bid={bid} />
                      </td>
                    )}
                    {showColumns && showColumns?.action && (
                      <td>
                        <BidStageInput
                          bid={bid}
                          setBid={(bidRes) => setUpdatedBid(bid)}
                          authUser={authUser}
                        />
                      </td>
                    )}
                    {showColumns && showColumns?.more && (
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle
                            className="btn-sm toggle-hidden"
                            variant="secondary"
                          >
                            <span className="_dot _inline-dot bg-secondary_custom mr-1"></span>
                            <span className="_dot _inline-dot bg-secondary_custom mr-1"></span>
                            <span className="_dot _inline-dot bg-secondary_custom"></span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {authUser && authUser?.user_type == "BUYER" && (
                              <>
                                <Dropdown.Item
                                  eventKey={`${bid._id}1`}
                                  onClick={async () => {
                                    await setRatedBid(bid);
                                    const { rating, comment } = bid.review
                                      ? bid.review
                                      : { rating: 0, comment: "" };
                                    setRatingModal(true);
                                    setRatingForm({
                                      rate: rating,
                                      comment,
                                    });
                                  }}
                                >
                                  Rate bid
                                </Dropdown.Item>
                                <Dropdown.Divider></Dropdown.Divider>
                              </>
                            )}
                            <Dropdown.Item eventKey={`${bid._id}2`} onClick={(e) => gotoChatByBid(e, bid)}>
                              Chat <FaExternalLinkAlt />
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={`${
                    showColumns && showColumns.buyer_dashboard ? "11" : "7"
                  }`}
                  className="text-center"
                >
                  No bids for this stock yet. You'll be the first.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
