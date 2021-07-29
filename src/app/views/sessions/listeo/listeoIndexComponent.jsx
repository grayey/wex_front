import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";

import { FaChevronRight, FaSearch } from "react-icons/fa";
import LandingPageSearch from "../../searches/landingPageSearch";
import BusyTrafficVideo from "app/PublicLayout/layouts/assets/images/main-search-video.mp4";
import RecycleAnimationVideo from "app/PublicLayout/layouts/assets/videos/recycle-animation.mp4";

import AppMainService from "app/services/appMainService";
import ProductsGallery from "app/views/products/products.gallery";

const appMainService = new AppMainService();

const ListeoIndexComponent = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [navigationUrl, setNavigationUrl] = useState("");

  const viewProduct = (product) => {
    const url = `product/${product.slug}`;
    setNavigationUrl(url);
  };

  const viewCategory = (category) => {
    const url = `category/${category._id}`;
    setNavigationUrl(url);
  };
  useEffect(() => {
    getAllCategories();
  }, []);

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
      <div className="main-search-container dark-overlay">
        <div className="main-search-inner">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <h2>Find Nearby Attractions</h2>
                <h4>Expolore top-rated attractions, activities and more</h4>
                <LandingPageSearch allCategories={allCategories} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <h5 className="highlighted-categories-headline text-white">
                  Or browse featured categories:
                </h5>

                <div className="highlighted-categories">
                  <a
                    href="listings-list-with-sidebar.html"
                    className="highlighted-category"
                  >
                    <i className="im im-icon-Home"></i>
                    <h4>Food Waste</h4>
                  </a>

                  <a
                    href="listings-list-full-width.html"
                    className="highlighted-category"
                  >
                    <i className="im im-icon-Hamburger"></i>
                    <h4>Plastics</h4>
                  </a>

                  <a
                    href="listings-half-screen-map-list.html"
                    className="highlighted-category"
                  >
                    <i className="im im-icon-Electric-Guitar"></i>
                    <h4>Spent grain</h4>
                  </a>

                  <a
                    href="listings-half-screen-map-list.html"
                    className="highlighted-category"
                  >
                    <i className="im im-icon-Dumbbell"></i>
                    <h4>Crushed bones & shells</h4>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="video-container">
          {/* poster: "images/main-search-video-poster.jpg" */}
          <video
            poster="https://picsum.photos/200"
            loop
            autoPlay
            muted
          >
            {/*src: images/main-search-video.mp4 "http://rollpark.us/wp-content/uploads/2019/01/rollpark-intro.mp4" */}
            <source src={RecycleAnimationVideo} type="video/mp4" />
          </video>
        </div>
      </div>

      <section className="category-list fullwidth">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <h3 className="headline margin-top-20">Browse Categories</h3>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="categories-boxes-container margin-bottom-30">
                {allCategories.map((category, index) => {
                  return (
                    index < 24 && (
                      <a
                        href="javascript:void(0)"
                        className="category-small-box-alt"
                        key={category?._id}
                        onClick={(event) => {
                          event.preventDefault();
                          viewCategory(category);
                        }}
                      >
                        <i className="im im-icon-Hamburger"></i>
                        <h4>{category?.name}</h4>
                        <span className="category-box-counter-alt">12</span>
                        <img src="https://picsum.photos/200"></img>
                      </a>
                    )
                  );
                })}
              </div>
              {allCategories.length > 4 && (
                <div className="p-1">
                  <button className="float-right">
                    View more ... <FaChevronRight />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="fullwidth  padding-top-20 padding-bottom-70">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <h3 className="headline  margin-bottom-45">
                Popular products
                <span>Discover top-rated items</span>
              </h3>
            </div>
            <div className="col-md-12">
              <ProductsGallery
                viewProduct={(product) => viewProduct(product)}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="fullwidth margin-top-65 padding-top-75 padding-bottom-70"
        data-background-color="#f8f8f8"
      >
        <div className="container-fluid bg-sucess">
          <div className="row">
            <div className="col-md-12">
              <h3 className="headline  margin-bottom-45">Our partners</h3>
            </div>
            <div className="col-md-12">
              <div className="jumbotron"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ListeoIndexComponent;
