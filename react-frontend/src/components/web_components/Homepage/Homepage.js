import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { StyleClass } from "primereact/styleclass";
import { Ripple } from "primereact/ripple";
import { Badge } from "primereact/badge";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import client from "../../../services/restClient";

const HomePage = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    setLoading(true);
    client
      .service("products")
      .find({
        query: {
          $limit: 10000,
          productsColour: urlParams.singleProductColorId,
          productsSize: urlParams.singleProductSizeId,
          productsRating: urlParams.singleProductRatingId,
          productsCategory: urlParams.singleProductCategoryId,
          category: urlParams.singleProductCategoryId,
          $populate: [
            {
              path: "createdBy",
              service: "users",
              select: ["name", "email"],
            },
            {
              path: "updatedBy",
              service: "users",
              select: ["name"],
            },
            {
              path: "productColour",
              service: "product_color",
              select: ["colorName", "colorCode"],
            },
            {
              path: "productPrice",
              service: "product_price",
              select: ["basePrice"],
            },
            {
              path: "productSize",
              service: "product_size",
              select: ["sizeCategory", "sizeValue"],
            },
            {
              path: "productRating",
              service: "product_rating",
              select: ["starRating", "productName"],
            },
            {
              path: "category",
              service: "category",
              select: ["type", "category", "gender", "isSale"],
            },
          ],
        },
      })
      // Stores fetch product data in component
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      // handles error during API Call
      .catch((error) => {
        setLoading(false);
        if (props.alert) {
          props.alert({
            title: "Product",
            type: "error",
            message: error.message || "Failed get Product",
          });
        }
      });
  }, []);
  // handles search query and navigates to product page with search query as parameter
  const onSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/product?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="surface-section">
      <div className="surface-900 px-4 lg:px-8 py-3 lg:py-3 flex flex-column sm:flex-row w-full justify-content-between align-items-center">
        <span className="text-0">Sign Up for 15% off your first order</span>
        <a
          tabIndex="0"
          className="cursor-pointer h-full inline-flex align-items-center mt-3 sm:mt-0 md:py-0"
        >
          <img
            src="/lightning/Flag_of_Malaysia.svg"
            className="mr-2 h-1rem w-auto"
            alt="Flag"
          />
          <span className="text-0">MY</span>
        </a>
      </div>
      <div className="surface-overlay px-3 sm:px-7 flex flex-wrap align-items-stretch justify-content-between relative">
        {/* Navigation menu toggle removed btnRef1, StyleClass can be replaced with a simple button if needed */}
        <a className="p-ripple cursor-pointer flex align-items-center lg:hidden text-700 mr-3">
          <i className="pi pi-bars text-4xl"></i>
          <Ripple />
        </a>
        <div
          id="nav-2"
          className="surface-overlay hidden lg:flex absolute lg:static left-0 top-100 z-1 shadow-2 lg:shadow-none w-full lg:w-auto lg:flex-1 py-3 lg:py-0"
        >
          <ul className="list-none p-0 m-0 flex flex-column lg:flex-row">
            <li className="flex flex-column lg:flex-row">
              <a
                onClick={(e) => {
                  if (window.innerWidth < 1024) navigate("/category");
                }}
                className="p-ripple font-medium inline-flex align-items-center cursor-pointer border-left-2 lg:border-left-none lg:border-bottom-2 border-transparent hover:border-primary
          py-3 lg:py-0 px-6 lg:px-3 text-700 select-none text-xl lg:text-base lg:font-base w-full lg:w-auto"
              >
                <span>Women</span>
                <Ripple />
              </a>
              <div className="surface-overlay shadow-none lg:shadow-2 hidden lg:absolute w-full left-0 top-100 pl-8 pr-6 lg:px-6 py-0 lg:py-6">
                <div className="grid flex-wrap">
                  <div className="col-12 md:col-6 xl:col-3">
                    <a className="font-medium text-lg cursor-pointer text-700 block lg:hidden mb-3 select-none">
                      Clothing
                    </a>
                    <ul className="list-none py-0 pr-0 lg:pl-0 pl-5 m-0 text-700 hidden lg:block">
                      <li className="hidden lg:block">
                        <img
                          src="/photo/storenavigation/storenavigation-2-1.png"
                          alt="Image"
                          height="160"
                          style={{ borderRadius: "12px" }}
                        />
                      </li>
                      <li className="font-bold my-5 text-xl text-900 hidden lg:block">
                        Clothing
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Dresses
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Jeans
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Pants
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Skirts
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Sweaters
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Blouses
                      </li>
                    </ul>
                  </div>
                  <div className="col-12 md:col-6 xl:col-3">
                    <a className="font-medium text-lg cursor-pointer text-700 block lg:hidden mb-3 select-none">
                      Shoes
                    </a>
                    <ul className="list-none py-0 pr-0 lg:pl-0 pl-5 m-0 text-700 hidden lg:block">
                      <li className="hidden lg:block">
                        <img
                          src="/photo/storenavigation/storenavigation-2-2.png"
                          alt="Image"
                          height="160"
                          style={{ borderRadius: "12px" }}
                        />
                      </li>
                      <li className="font-bold my-5 text-xl text-900 hidden lg:block">
                        Shoes
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Athletic
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Boots
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Sneakers
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Flats
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Outdoor
                      </li>
                    </ul>
                  </div>
                  <div className="col-12 md:col-6 xl:col-3">
                    <a className="font-medium text-lg cursor-pointer text-700 block lg:hidden mb-3 select-none">
                      Accessories
                    </a>
                    <ul className="list-none py-0 pr-0 lg:pl-0 pl-5 m-0 text-700 hidden lg:block">
                      <li className="hidden lg:block">
                        <img
                          src="/photo/storenavigation/storenavigation-2-3.png"
                          alt="Image"
                          height="160"
                          style={{ borderRadius: "12px" }}
                        />
                      </li>
                      <li className="font-bold my-5 text-xl text-900 hidden lg:block">
                        Accessories
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Handbags
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Gloves
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Belts
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Hats
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Earmuffs
                      </li>
                    </ul>
                  </div>
                  <div className="col-12 md:col-6 xl:col-3">
                    <a className="font-medium text-lg cursor-pointer text-700 block lg:hidden mb-3 select-none">
                      Beauty
                    </a>
                    <ul className="list-none py-0 pr-0 lg:pl-0 pl-5 m-0 text-700 hidden lg:block">
                      <li className="hidden lg:block">
                        <img
                          src="/photo/storenavigation/storenavigation-2-4.png"
                          alt="Image"
                          height="160"
                          style={{ borderRadius: "12px" }}
                        />
                      </li>
                      <li className="font-bold my-5 text-xl text-900 hidden lg:block">
                        Beauty
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Anklets
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Bracelets
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Earrings
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Necklaces
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Rings
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Wedding
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <li className="flex flex-column lg:flex-row">
              <a
                onClick={(e) => {
                  if (window.innerWidth < 1024) navigate("/category");
                }}
                className="p-ripple font-medium inline-flex align-items-center cursor-pointer border-left-2 lg:border-left-none lg:border-bottom-2 border-transparent hover:border-primary py-3 lg:py-0 px-6 lg:px-3 text-700 select-none text-xl lg:text-base lg:font-base w-full lg:w-auto"
              >
                <span>Men</span>
                <Ripple />
              </a>
              <div className="surface-overlay shadow-none lg:shadow-2 hidden lg:absolute w-full left-0 top-100 pl-8 pr-6 lg:px-6 py-0 lg:py-6 z-1">
                <div className="grid flex-wrap">
                  <div className="col-12 md:col-6 xl:col-3">
                    <a className="font-medium text-lg cursor-pointer text-700 block lg:hidden mb-3 select-none">
                      Clothing
                    </a>
                    <ul className="list-none py-0 pr-0 lg:pl-0 pl-5 m-0 text-700 hidden lg:block">
                      <li className="hidden lg:block">
                        <img
                          src="/photo/storenavigation/storenavigation-2-1.png"
                          alt="Image"
                          height="160"
                          style={{ borderRadius: "12px" }}
                        />
                      </li>
                      <li className="font-bold my-5 text-xl text-900 hidden lg:block">
                        Clothing
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Shirts
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Jeans
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Pants
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Suits
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Jackets
                      </li>
                    </ul>
                  </div>
                  <div className="col-12 md:col-6 xl:col-3">
                    <a className="font-medium text-lg cursor-pointer text-700 block lg:hidden mb-3 select-none">
                      Shoes
                    </a>
                    <ul className="list-none py-0 pr-0 lg:pl-0 pl-5 m-0 text-700 hidden lg:block">
                      <li className="hidden lg:block">
                        <img
                          src="/photo/storenavigation/storenavigation-2-2.png"
                          alt="Image"
                          height="160"
                          style={{ borderRadius: "12px" }}
                        />
                      </li>
                      <li className="font-bold my-5 text-xl text-900 hidden lg:block">
                        Shoes
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Sneakers
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Boots
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Loafers
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Sandals
                      </li>
                    </ul>
                  </div>
                  <div className="col-12 md:col-6 xl:col-3">
                    <a className="font-medium text-lg cursor-pointer text-700 block lg:hidden mb-3 select-none">
                      Accessories
                    </a>
                    <ul className="list-none py-0 pr-0 lg:pl-0 pl-5 m-0 text-700 hidden lg:block">
                      <li className="hidden lg:block">
                        <img
                          src="/photo/storenavigation/storenavigation-2-3.png"
                          alt="Image"
                          height="160"
                          style={{ borderRadius: "12px" }}
                        />
                      </li>
                      <li className="font-bold my-5 text-xl text-900 hidden lg:block">
                        Accessories
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Watches
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Belts
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Sunglasses
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Hats
                      </li>
                    </ul>
                  </div>
                  <div className="col-12 md:col-6 xl:col-3">
                    <a className="font-medium text-lg cursor-pointer text-700 block lg:hidden mb-3 select-none">
                      Grooming
                    </a>
                    <ul className="list-none py-0 pr-0 lg:pl-0 pl-5 m-0 text-700 hidden lg:block">
                      <li className="hidden lg:block">
                        <img
                          src="/photo/storenavigation/storenavigation-2-4.png"
                          alt="Image"
                          height="160"
                          style={{ borderRadius: "12px" }}
                        />
                      </li>
                      <li className="font-bold my-5 text-xl text-900 hidden lg:block">
                        Grooming
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Fragrance
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Skincare
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Shavers
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Shampoos
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <li className="flex flex-column lg:flex-row">
              <a
                onClick={(e) => {
                  if (window.innerWidth < 1024) navigate("/category");
                }}
                className="p-ripple font-medium inline-flex align-items-center cursor-pointer border-left-2 lg:border-left-none lg:border-bottom-2 border-transparent hover:border-primary py-3 lg:py-0 px-6 lg:px-3 text-700 select-none text-xl lg:text-base lg:font-base w-full lg:w-auto"
              >
                <span>Kids</span>
                <Ripple />
              </a>
              <div className="surface-overlay shadow-none lg:shadow-2 hidden lg:absolute w-full left-0 top-100 pl-8 pr-6 lg:px-6 py-0 lg:py-6 z-1">
                <div className="grid flex-wrap">
                  <div className="col-12 md:col-6 xl:col-3">
                    <a className="font-medium text-lg cursor-pointer text-700 block lg:hidden mb-3 select-none">
                      Baby & Kids
                    </a>
                    <ul className="list-none py-0 pr-0 lg:pl-0 pl-5 m-0 text-700 hidden lg:block">
                      <li className="hidden lg:block">
                        <img
                          src="/photo/storenavigation/storenavigation-2-1.png"
                          alt="Image"
                          height="160"
                          style={{ borderRadius: "12px" }}
                        />
                      </li>
                      <li className="font-bold my-5 text-xl text-900 hidden lg:block">
                        Baby & Kids
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Babywear
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Boys
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Girls
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Toys
                      </li>
                    </ul>
                  </div>
                  <div className="col-12 md:col-6 xl:col-3">
                    <a className="font-medium text-lg cursor-pointer text-700 block lg:hidden mb-3 select-none">
                      Clothing
                    </a>
                    <ul className="list-none py-0 pr-0 lg:pl-0 pl-5 m-0 text-700 hidden lg:block">
                      <li className="hidden lg:block">
                        <img
                          src="/photo/storenavigation/storenavigation-2-2.png"
                          alt="Image"
                          height="160"
                          style={{ borderRadius: "12px" }}
                        />
                      </li>
                      <li className="font-bold my-5 text-xl text-900 hidden lg:block">
                        Clothing
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Dresses
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Tops
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Bottoms
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Outerwear
                      </li>
                    </ul>
                  </div>
                  <div className="col-12 md:col-6 xl:col-3">
                    <a className="font-medium text-lg cursor-pointer text-700 block lg:hidden mb-3 select-none">
                      Shoes
                    </a>
                    <ul className="list-none py-0 pr-0 lg:pl-0 pl-5 m-0 text-700 hidden lg:block">
                      <li className="hidden lg:block">
                        <img
                          src="/photo/storenavigation/storenavigation-2-3.png"
                          alt="Image"
                          height="160"
                          style={{ borderRadius: "12px" }}
                        />
                      </li>
                      <li className="font-bold my-5 text-xl text-900 hidden lg:block">
                        Shoes
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Sneakers
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Boots
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Sandals
                      </li>
                    </ul>
                  </div>
                  <div className="col-12 md:col-6 xl:col-3">
                    <a className="font-medium text-lg cursor-pointer text-700 block lg:hidden mb-3 select-none">
                      Accessories
                    </a>
                    <ul className="list-none py-0 pr-0 lg:pl-0 pl-5 m-0 text-700 hidden lg:block">
                      <li className="hidden lg:block">
                        <img
                          src="/photo/storenavigation/storenavigation-2-4.png"
                          alt="Image"
                          height="160"
                          style={{ borderRadius: "12px" }}
                        />
                      </li>
                      <li className="font-bold my-5 text-xl text-900 hidden lg:block">
                        Accessories
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Bags
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Hats
                      </li>
                      <li
                        className="mb-3 cursor-pointer hover:text-900"
                        onClick={() => navigate("/category")}
                      >
                        Socks
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="flex-1 flex align-items-center justify-content-center py-3">
          <a onClick={() => navigate("/Homepage")} className="cursor-pointer">
            <img
              src="/lightning/apple-touch-icon.png"
              alt="Image"
              height="40"
            />
          </a>
        </div>
        <div className="hidden lg:flex flex-1 align-items-center justify-content-end py-3 lg:py-0">
          <ul
            className="list-none p-0 m-0 flex ml-auto"
            style={{ minHeight: "30px" }}
          >
            <li className="flex justify-content-center align-items-center">
              {showSearch ? (
                <span className="p-input-icon-right">
                  <i
                    className="pi pi-times cursor-pointer"
                    onClick={() => {
                      setShowSearch(false);
                      setSearchQuery("");
                    }}
                  />
                  <InputText
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    autoFocus
                    className="text-sm"
                  />
                </span>
              ) : (
                <a
                  className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer lg:pr-3 hover:text-primary"
                  onClick={() => setShowSearch(true)}
                >
                  <i className="pi pi-search text-xl"></i>
                  <span className="hidden">Search</span>
                  <Ripple />
                </a>
              )}
            </li>
            <li className="flex justify-content-center align-items-center">
              <a
                className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer lg:px-3 hover:text-primary"
                onClick={() => {
                  setShowFavorites(!showFavorites);
                  navigate("");
                }}
              >
                <i
                  className={`pi ${showFavorites ? "pi-heart-fill" : "pi-heart"} text-xl`}
                  style={{ color: showFavorites ? "red" : undefined }}
                ></i>
                <span className="hidden">Favorites</span>
                <Ripple />
              </a>
            </li>
            <li className="flex justify-content-center">
              <Link
                to="/web-login"
                onClick={() => navigate("/web-login")}
                className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer lg:px-3 hover:text-primary"
              >
                <i className="pi pi-user text-xl"></i>
                <span className="hidden">Sign In</span>
                <Ripple />
              </Link>
            </li>
            <li className="flex justify-content-center">
              <a
                className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer lg:pl-3 pr-3 hover:text-primary"
                onClick={() => navigate("/cart")}
              >
                <i className="pi pi-shopping-cart text-xl p-overlay-badge">
                  <Badge />
                </i>
                <span className="hidden">Cart</span>
                <Ripple />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex w-full lg:w-auto border-y-1 surface-border surface-overlay lg:hidden py-3 lg:py-0">
        <ul
          className="list-none p-0 m-0 flex w-full"
          style={{ minHeight: "30px" }}
        >
          <li className="flex flex-auto lg:flex-initial justify-content-center align-items-center">
            {showSearch ? (
              <span className="p-input-icon-right">
                <i
                  className="pi pi-times cursor-pointer"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                />
                <InputText
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  autoFocus
                  className="text-sm"
                />
              </span>
            ) : (
              <a
                className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer lg:pr-3 hover:text-primary"
                onClick={() => setShowSearch(true)}
              >
                <i className="pi pi-search text-xl"></i>
                <span className="hidden">Search</span>
                <Ripple />
              </a>
            )}
          </li>
          <li className="flex flex-auto lg:flex-initial justify-content-center">
            <a
              className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer lg:px-3 hover:text-primary"
              onClick={() => {
                setShowFavorites(!showFavorites);
                navigate("");
              }}
            >
              <i
                className={`pi ${showFavorites ? "pi-heart-fill" : "pi-heart"} text-xl`}
                style={{ color: showFavorites ? "red" : undefined }}
              ></i>
              <span className="hidden">Favorites</span>
              <Ripple />
            </a>
          </li>
          <li className="flex flex-auto lg:flex-initial justify-content-center">
            <Link
              to="/web-login"
              onClick={() => navigate("/web-login")}
              className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer lg:px-3 hover:text-primary"
            >
              <i className="pi pi-user text-xl"></i>
              <span className="hidden">Sign In</span>
              <Ripple />
            </Link>
          </li>
          <li className="flex flex-auto lg:flex-initial justify-content-center">
            <a className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer lg:pl-3 pr-1 hover:text-primary">
              <i className="pi pi-shopping-cart text-xl p-overlay-badge">
                <Badge />
              </i>
              <span className="hidden">Cart</span>
              <Ripple />
            </a>
          </li>
        </ul>
      </div>

      <div
        className="surface-section h-30rem bg-no-repeat bg-cover bg-center flex align-items-center"
        style={{
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/photo/storefront/storefront-1-18.png)",
        }}
      >
        <div className="px-4 mx-4 lg:px-6 lg:mx-6">
          <span className="block text-3xl text-white mb-4">New Trend</span>
          <span className="block text-5xl font-medium text-white mb-4">
            Special Collection
          </span>
          <a
            tabIndex="0"
            className="p-ripple py-2 w-13rem text-center block mb-4 text-xl text-white font-medium border-2 cursor-pointer surface-border-0 border-round bg-white-alpha-30"
            onClick={() => navigate("/Category")}
          >
            Explore Collection
            <Ripple />
          </a>
        </div>
      </div>

      <div className="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div className="text-900 text-4xl font-medium mb-4 text-center lg:text-left ">
          Seasonal Collection
        </div>

        <div className="grid -mt-3 -ml-3 -mr-3 flex-wrap">
          <div className="col flex px-3 flex-column mt-4 md:mt-0">
            <img
              src="/photo/categorypreview/category-preview-1-1.png"
              className="w-full h-68"
              alt="product"
            />
            <p className="text-600 uppercase font-medium my-3"></p>
            <Link
              to="/category"
              tabIndex="0"
              className="text-xl cursor-pointer text-900 flex align-items-center hover:text-primary transition-duration-150"
            >
              Category Title{" "}
              <i className="pi pi-fw pi-arrow-right ml-2 text-xl"></i>
            </Link>
          </div>
          <div className="col flex px-3 flex-column mt-4 md:mt-0">
            <img
              src="/photo/categorypreview/category-preview-1-2.png"
              className="w-full h-68"
              alt="product"
            />
            <p className="text-600 uppercase font-medium my-3"></p>
            <Link
              to="/category"
              tabIndex="0"
              className="text-xl cursor-pointer text-900 flex align-items-center hover:text-primary transition-duration-150"
            >
              Category Title{" "}
              <i className="pi pi-fw pi-arrow-right ml-2 text-xl"></i>
            </Link>
          </div>
          <div className="col flex px-3 flex-column mt-4 md:mt-0">
            <img
              src="/photo/categorypreview/category-preview-1-3.png"
              className="w-full h-68"
              alt="product"
            />
            <p className="text-600 uppercase font-medium my-3"></p>
            <Link
              to="/category"
              tabIndex="0"
              className="text-xl cursor-pointer text-900 flex align-items-center hover:text-primary transition-duration-150"
            >
              Category Title{" "}
              <i className="pi pi-fw pi-arrow-right ml-2 text-xl"></i>
            </Link>
          </div>
          <div className="col flex px-3 flex-column mt-4 md:mt-0">
            <img
              src="/photo/categorypreview/category-preview-1-4.png"
              className="w-full h-68"
              alt="product"
            />
            <p className="text-600 uppercase font-medium my-3"></p>
            <Link
              to="/category"
              tabIndex="0"
              className="text-xl cursor-pointer text-900 flex align-items-center hover:text-primary transition-duration-150"
            >
              Category Title{" "}
              <i className="pi pi-fw pi-arrow-right ml-2 text-xl"></i>
            </Link>
          </div>
          <div className="col flex px-3 flex-column mt-4 md:mt-0">
            <img
              src="/photo/categorypreview/category-preview-1-5.png"
              className="w-full h-68"
              alt="product"
            />
            <p className="text-600 uppercase font-medium my-3"></p>
            <Link
              to="/category"
              tabIndex="0"
              className="text-xl cursor-pointer text-900 flex align-items-center hover:text-primary transition-duration-150"
            >
              Category Title{" "}
              <i className="pi pi-fw pi-arrow-right ml-2 text-xl"></i>
            </Link>
          </div>
        </div>
      </div>

      <div className="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div className="text-900 font-medium text-4xl mb-4">Popular Items</div>

        <div className="grid -mt-3 -ml-3 -mr-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            data.map((product, key) => (
              <div className="col-12 md:col-6 lg:col-3 mb-3 lg:mb-0" key={key}>
                <p className="text-900 font-medium text-xl mb-2">
                  {product.category?.category || "Product"}
                </p>
                <div className="p-2">
                  <div className="relative">
                    <img
                      src={
                        product.productImage?.[0] ||
                        "/photo/productlist/product-list-1-1.png"
                      }
                      className="w-full cursor-pointer"
                      alt={product.category?.category || "product"}
                      onClick={() => navigate("/category")}
                    />
                    <button
                      type="text"
                      className="p-ripple p-link w-3rem h-3rem surface-0 hover:surface-200 border-circle shadow-2 inline-flex align-items-center justify-content-center absolute transition-colors transition-duration-300"
                      style={{ top: "1rem", right: "1rem" }}
                    >
                      <i className="pi pi-heart text-2xl text-500"></i>
                    </button>
                  </div>
                  <div className="flex align-items-center justify-content-between mt-3 mb-2">
                    <span className="text-900 font-medium text-xl">
                      {product.category?.category || "Product Name"}
                    </span>
                    <span className="text-900 text-xl ml-3">
                      ${product.productPrice?.basePrice || "--"}
                    </span>
                  </div>
                  <span className="text-600">
                    {product.productColour?.colorName || ""}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div
          className="surface-900 text-0 p-4"
          style={{ borderRadius: "10px" }}
        >
          <div className="flex flex-column md:flex-row md:justify-content-between xl:justify-content-evenly">
            <span className="inline-flex align-items-center mb-3 md:mb-0">
              <i className="pi pi-shopping-cart text-base xl:text-2xl mr-3"></i>
              <span className="text-base xl:text-2xl font-medium">
                Free Shipping
              </span>
            </span>
            <span className="inline-flex align-items-center mb-3 md:mb-0">
              <i className="pi pi-refresh text-base xl:text-2xl mr-3"></i>
              <span className="text-base xl:text-2xl font-medium">
                120 Days Return Policy
              </span>
            </span>
            <span className="inline-flex align-items-center">
              <i className="pi pi-star text-base xl:text-2xl mr-3"></i>
              <span className="text-base xl:text-2xl font-medium">
                10 Year Warranty
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap surface-section px-4 py-8 md:px-6 lg:px-8">
        <div className="w-full md:w-6 px-4 py-8 md:px-6 lg:px-8 surface-900">
          <div className="text-4xl text-0 mb-3 font-medium">
            Promo Title Placeholder
          </div>
          <p className="line-height-3 mt-0 mb-7 p-0 text-0 text-2xl">
            Malesuada bibendum arcu vitae elementum curabitur vitae nunc.
            Aliquam nulla facilisi cras fermentum. Et egestas quis ipsum
            suspendisse ultrices.
          </p>
          <a
            tabIndex="0"
            className="p-ripple text-xl cursor-pointer surface-card text-900 text-center px-5 py-3 border-1 border-gray-200 hover:text-primary transition-duration-150 select-none block w-12rem"
          >
            Read Story
          </a>
        </div>
        <div
          className="w-full md:w-6 bg-no-repeat bg-cover"
          style={{
            background: "url('/photo/storefront/storefront-1-17.png')",
            minHeight: "400px",
          }}
        ></div>
      </div>

      <div className="surface-50 px-4 py-8 md:px-6 lg:px-8">
        <span className="text-900 text-3xl font-medium block text-center lg:text-left">
          Get 25% Discount Today!
        </span>
        <span className="text-600 text-2xl block mt-4 text-center lg:text-left">
          Sign up our email list and know all about new collections of Peak
        </span>
        <div className="mt-4 mx-auto lg:mx-0" style={{ maxWidth: "38rem" }}>
          <div className="p-inputgroup">
            <InputText placeholder="Enter your email address" />
            <Button
              type="button"
              label="Subscribe"
              className="surface-900 text-0 px-5 border-none"
            />
          </div>
        </div>
        <Divider layout="horizontal" className="surface-border" />
        <div className="grid grid-nogutter text-center lg:text-left">
          <div className="col-12 sm:col-6 md:col-4 lg:col-3 mt-4 flex flex-column align-items-center lg:align-items-start">
            <img
              src="/photo/logos/peak-700.svg"
              className="w-9rem mx-auto lg:mx-0"
              alt="Peak logo"
            />
            <div className="flex align-items-center w-full mt-5 justify-content-center lg:justify-content-start">
              <a tabIndex="0" className="cursor-pointer mr-3">
                <i className="pi pi-facebook surface-900 p-1 text-sm border-circle text-0"></i>
              </a>
              <a tabIndex="0" className="cursor-pointer mr-3">
                <i className="pi pi-twitter surface-900 p-1 text-sm border-circle text-0"></i>
              </a>
              <a tabIndex="0" className="cursor-pointer mr-3">
                <i className="pi pi-youtube surface-900 p-1 text-sm border-circle text-0"></i>
              </a>
              <a tabIndex="0" className="cursor-pointer">
                <i className="pi pi-google surface-900 p-1 text-sm border-circle text-0"></i>
              </a>
            </div>
            <span className="text-600 block mt-4">
              <i className="pi pi-phone mr-2"></i>1234 / 12 34 567
            </span>
            <a
              tabIndex="0"
              className="text-600 block mt-4 cursor-pointer hover:text-900 transition-duration-150 select-none w-8rem"
            >
              <i className="pi pi-map-marker mr-2"></i>Contact Us
            </a>
          </div>
          <div className="col-12 sm:col-6 md:col-4 lg:col-3 mt-4 flex flex-column">
            <span className="text-900 text-xl font-medium block">Company</span>
            <ul className="list-none p-0">
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  About Peak
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Factories
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Environmental Initiatives
                </a>
              </li>
            </ul>
          </div>
          <div className="col-12 sm:col-6 md:col-4 lg:col-3 mt-4 flex flex-column">
            <span className="text-900 text-xl font-medium block">Account</span>
            <ul className="list-none p-0">
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Manage Account
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Saved Items
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  My Cart
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Wishlist
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Orders & Returns
                </a>
              </li>
            </ul>
          </div>
          <div className="col-12 sm:col-6 md:col-4 lg:col-3 mt-4 flex flex-column">
            <span className="text-900 text-xl font-medium block">Legal</span>
            <ul className="list-none p-0">
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Investor Relations
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Data Privacy
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Legal Information
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
