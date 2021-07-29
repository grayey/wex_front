import React, { useState, useEffect } from "react";
import * as Mapbox from "mapbox-gl";
// import { Geocoder } from "@mapbox/react-geocoder";
import { APP_ENVIRONMENT } from "./environment/environment";
import { Dropdown, Modal, ProgressBar } from "react-bootstrap";

import {
  BID_STAGES,
  BID_STAGE_PERCENTAGES,
  BID_STAGE_TEXT,
  BID_STAGE_SELLER_INPUTS,
  BID_STAGE_BUYER_INPUTS,
  BID_MOVEMENT_MESSAGES,
} from "./appConstants";

import Rating from "react-rating";
import {
  MdStarBorder,
  MdStar,
  MdFavoriteBorder,
  MdFavorite,
} from "react-icons/md";

import AppNotification from "app/appNotifications";
import swal from "sweetalert2";
import BidService from "app/services/bidService";

const bidService = new BidService();

Mapbox.accessToken = APP_ENVIRONMENT.mapbox_token;

export const FetchingRecords = ({ isFetching, emptyMsg }) => {
  return isFetching ? (
    <>
      <div className="text-center">
        <div className="loader-bubble loader-bubble-info m-5"></div>
        <div className="loader-bubble loader-bubble-light m-5"></div>
        <div className="loader-bubble loader-bubble-dark m-5"></div>
      </div>
    </>
  ) : (
    <>
      <div>{emptyMsg || "No records found"}</div>
    </>
  );
};

export const CustomProgressBar = ({ bid }) => {
  const bidStage = BID_STAGES[bid.stage];
  const bidPercentage = BID_STAGE_PERCENTAGES[bid.stage];
  const barText = BID_STAGE_TEXT[bidStage];
  const { rejection_type } = bid;
  let variant = bidPercentage < 100 ? "info_custom" : "success";
  const ongoing = rejection_type && rejection_type == "NONE";

  // disabled color if discarded
  variant = ongoing ? "secondary_custom" : variant;

  const barAttributes = {
    now: bidPercentage,
    label: `${bidPercentage}%`,
    variant,
  };
  if (ongoing) {
    barAttributes.striped = true;
    barAttributes.animated = true;
  }

  return (
    <div>
      <ProgressBar {...barAttributes}></ProgressBar>
      <p className={`text-center`}>
        <small>
          <b>
            <em>{barText}</em>
          </b>
        </small>
      </p>
    </div>
  );
};

export const BidStageInput = ({ bid, authUser, setBid }) => {
  const { user_type } = authUser;
  const stageInputObject =
    user_type == "SELLER"
      ? BID_STAGE_SELLER_INPUTS
      : user_type == "BUYER"
      ? BID_STAGE_BUYER_INPUTS
      : {};
  const bidStage = BID_STAGES[bid.stage];
  const { value, label } = stageInputObject[bidStage] || {};

  /**
   *
   * @param {*} product
   * This method moves a bid's stage
   */
  const moveBid = (event) => {
    event.preventDefault();
    const { value } = event.target;
    if (!event.target.value) return;
    let { mainText, subText, finalText } = BID_MOVEMENT_MESSAGES[value];

    swal
      .fire({
        title: `<small>${mainText}</small>`,
        text: `${subText}`,
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
          bid.stage = value;
          bidService
            .updateBid(bid, bid._id)
            .then((bidResponse) => {
              console.log({
                bidResponse,
              });
              new AppNotification({
                type: "success",
                msg: finalText,
              });
              setBid(bid);
            })
            .catch((err) => {
              new AppNotification({
                type: "error",
                msg: `An error occured`,
              });
            });
        }
      });
  };

  return (
    <select className="form-control" onChange={moveBid}>
      <option value="">Select</option>
      {value && label && <option value={value}>{label}</option>}
      <option value="CANCEL" className="text-danger">
        Decline
      </option>
    </select>
  );
};

export const BidMarqueeSummary = ({ bids, authUser }) => {
  const checkSummary = () => {
    const noOfBids = bids.length;
    const allPrices = [];
    const allQuantities = [];
    bids.forEach((bid) => {
      allPrices.push(+bid.price_per_kg);
      allQuantities.push(+bid.quantity);
    });
    const minPrice = Math.min(...allPrices);
    const minQuantity = Math.min(...allQuantities);
    const maxPrice = Math.max(...allPrices);
    const maxQuantity = Math.max(...allPrices);
    let marqueeMsg = `${noOfBids} bids on this stock at a `;
    marqueeMsg +=
      authUser.user_type == "SELLER"
        ? `minimum price of NGN${minPrice}.`
        : `maximum price of NGN${maxPrice}.`;
    return marqueeMsg;
  };

  return (
    bids.length > 0 &&
    authUser && (
      <marquee>
        <em>
          <b>{checkSummary()}</b>
        </em>
      </marquee>
    )
  );
};

export const BidRatingSummary = ({ bid, fullReview }) => {
  const { rating, comment } = bid.review
    ? bid.review
    : { rating: 0, comment: "" };
  const Stars = () => (
    <Rating
      initialRating={rating}
      fractions={2}
      emptySymbol={<MdStarBorder size={22}></MdStarBorder>}
      fullSymbol={<MdStar className="text-warning" size={22}></MdStar>}
      onChange={() => {
        return;
      }}
    ></Rating>
  );
  return fullReview ? <div>NAMMAMMAMA</div> : <Stars />;
};

export const RenderMap = (props) =>
  new Mapbox.Map({
    ...props,
    zoom: 0,
    style: "mapbox://styles/mapbox/streets-v11",
  });

export const MapGeocoder = ({ selectCallBack }) => {
  return (
    // <Geocoder accessToken={APP_ENVIRONMENT.mapbox_token} onSelect={(e) => selectCallBack(e)}  />
    null
  );
};
