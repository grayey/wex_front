import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import {
  Dropdown,
  Row,
  Col,
  Button,
  Form,
  ButtonToolbar,
  Modal,
  Carousel,
} from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import AppMainService from "../../services/appMainService";
import * as utils from "@utils";
import AppNotification from "../../appNotifications";
import { FetchingRecords } from "../../appWidgets";

const appMainService = new AppMainService();

const ProductsGallery = (props) => {
  const [currentPage, setCurrentPage] = useState("");
  const [allProducts, setProducts] = useState([]);
  const [isFetching, setFetching] = useState(false);

  useEffect(() => {
    getAllProducts();
  }, []);

  const handlePageClick = (data) => {
    let currentPage = data.selected;
    setCurrentPage({ currentPage });
  };

  const flipProduct = (index, flip = true) => {
    const products = [...allProducts];
    products[index].flip = flip;
    setProducts(products);
  };

  /**
   * This method lists all products
   */
  const getAllProducts = async () => {
    setFetching(true);

    appMainService
      .getAllProducts()
      .then((productsResponse) => {
        const allProducts = productsResponse;
        allProducts.forEach((prod) => {
          const subLevel = prod.ancestors ? prod.ancestors.length : 0;
          // cat['sub_level'] = subLevel;
          prod["parent"] = subLevel ? prod.ancestors[subLevel - 1] : null;
        });
        setProducts(allProducts);
        setFetching(false);
        console.log("Products response", productsResponse);
      })
      .catch((error) => {
        setFetching(false);
        const errorNotification = {
          type: "error",
          msg: utils.processErrors(error),
        };
        new AppNotification(errorNotification);
        console.log("Error", error);
      });
  };

  return (
    <section className="product-cart">
      <div className="row list-grid mb-4">
        { !allProducts.length ? (
          <FetchingRecords isFetching={ isFetching } />
        ) : (
          allProducts.map((product, index) => {
            return (
              <>
                <div
                  className="list-item col-md-2"
                  key={product?._id}
                  onMouseEnter={() => flipProduct(index)}
                  onMouseLeave={() => flipProduct(index, false)}
                >
                  <div className="flip-card">
                    <div className="flip-card-inner">
                      <div
                        className={`flip-card-${product?.flip ? "front" : "x"}`}
                      >
                        <div className="card o-hidden mb-3 d-flex flex-column">
                          <div className="list-thumb d-flex">
                            <Carousel indicators={true}>
                              {product?.featured_stock?.images?.map((img) => (
                                <Carousel.Item key={img.preview_url}>
                                  <img
                                    src={img.preview_url}
                                    id="userDropdown"
                                    alt={product?.name}
                                  />
                                </Carousel.Item>
                              ))}
                            </Carousel>

                            {/* <img alt="" src={product?.featured_stock?.images[0]?.preview_url} /> */}
                          </div>
                          <div className="flex-grow-1 d-bock flipper">
                            <div className="card-body align-self-center d-flex flex-column justify-content-between align-items-lg-center">
                              <Link className="w-40 w-sm-100" to="/">
                                <div className="item-title">
                                  {product?.name}
                                </div>
                              </Link>
                              <p className="m-0 text-muted text-small w-15 w-sm-100">
                                {product?.category?.name}
                              </p>
                              <p className="m-0 text-muted text-small w-15 w-sm-100">
                                Price per kg:{" "}
                                <small className="text-secondary">
                                  &#x20a6;{product?.featured_stock?.price}
                                </small>
                              </p>
                              <p className="m-0 text-muted text-small w-15 w-sm-100 d-none d-lg-block item-badges">
                                <span className="badge badge-info">
                                  Available qty.{" "}
                                  {product?.featured_stock?.quantity}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {product?.flip ? (
                        <div className="flip-card-back">
                          <div className="card o-hidden d-flex flex-column">
                            <div className="card-header">
                              <h5>{product?.name}</h5>
                            </div>

                            <div className="card-body">
                              <p className="m-0 text-small w-15 w-sm-100 border-bottom">
                                <b>Location: </b>
                                {product?.location || "Lagos"}
                              </p>
                              <p className="m-0  text-small w-15 w-sm-100 border-bottom">
                                <b>Category: </b>
                                {product?.category?.name}
                              </p>
                              <p className="m-0 text-small w-15 w-sm-100 ellipsis border-bottom">
                                <b>Description: </b>
                                {product?.featured_stock?.description}
                              </p>
                              <p className="m-0 text-small w-15 w-sm-100 border-bottom">
                                <b>Price per kg: </b>&#x20a6;
                                {product?.featured_stock?.price}
                              </p>
                              <p className="m-0 text-small w-15 w-sm-100 border-bottom">
                                <b>Available Qty: </b>
                                {product?.featured_stock?.quantity}kg
                              </p>
                              <p className="m-0 text-small w-15 w-sm-100 border-bottom">
                                <b>Packaging: </b>
                                {product?.packaging}
                              </p>
                              <p className="m-0 text-small w-15 w-sm-100 border-bottom">
                                <b>Delivery: </b>
                                {product?.delivery_option == "SELLER_DELIVERS"
                                  ? "seller delivers"
                                  : "buyer picks up"}
                              </p>
                            </div>

                            <div className="card-footer">
                              <button
                                className="btn btn-info_custom ml-5 navigator"
                                onClick={() => props.viewProduct(product)}
                              >
                                {" "}
                                View <FaEye />{" "}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </>
            );
          })
        )}
      </div>

      {/* <hr/>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={5}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination pagination-lg"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        /> */}
    </section>
  );
};

export default ProductsGallery;
