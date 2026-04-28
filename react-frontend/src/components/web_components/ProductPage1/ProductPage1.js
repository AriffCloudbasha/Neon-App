import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { StyleClass } from "primereact/styleclass";
import { Ripple } from "primereact/ripple";
import { Badge } from "primereact/badge";
import { Divider } from "primereact/divider";
import { Menu } from "primereact/menu";
import { MultiSelect } from "primereact/multiselect";
import { ToggleButton } from "primereact/togglebutton";
import { TabView, TabPanel } from "primereact/tabview";
import client from "../../../services/restClient";

const ProductPage1 = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const location = useLocation();
  const categoryId = new URLSearchParams(location.search).get("category");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);
  const btnRef3 = useRef(null);
  const btnRef4 = useRef(null);
  const btnRef5 = useRef(null);
  const btnRef6 = useRef(null);
  const btnRef7 = useRef(null);
  const btnRef8 = useRef(null);
  const btnRef9 = useRef(null);
  const menu = useRef(null);

  const images = [
    "product-overview-1-1.png",
    "product-overview-1-2.png",
    "product-overview-1-3.png",
  ];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [color, setColor] = useState("bluegray");
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [items] = useState([]);
  const [brands] = useState([{ name: "Brand A" }, { name: "Brand B" }]);
  const [colors] = useState([
    { name: "Black", class: "bg-black" },
    { name: "White", class: "bg-white" },
  ]);
  const [prices] = useState([{ range: "$0 - $50" }, { range: "$50 - $150" }]);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setLoading(true);
    props.show();

    // If productId exists in URL, fetch that specific product
    if (urlParams.productId) {
      client
        .service("product")
        .get(urlParams.productId, {
          query: {
            $populate: [
              { path: "createdBy", service: "users", select: ["name"] },
              { path: "updatedBy", service: "users", select: ["name"] },
              {
                path: "productPrice",
                service: "product_price",
                select: [
                  "productName",
                  "basePrice",
                  "currency",
                  "discountedPrice",
                  "taxPercentage",
                ],
              },
            ],
          },
        })
        .then((res) => {
          setData([res]);
          props.hide();
          setLoading(false);
        })
        .catch((error) => {
          console.log({ error });
          setLoading(false);
          props.hide();
          props.alert({
            title: "Product",
            type: "error",
            message: error.message || "Failed to get Product",
          });
        });
    } else {
      // Fetch all products if no productId is provided
      const query = {
        $limit: 10000,
        $populate: [
          { path: "createdBy", service: "users", select: ["name"] },
          { path: "updatedBy", service: "users", select: ["name"] },
          {
            path: "productPrice",
            service: "product_price",
            select: [
              "productName",
              "basePrice",
              "currency",
              "discountedPrice",
              "taxPercentage",
            ],
          },
        ],
      };
      if (categoryId) query.category = categoryId;
      client
        .service("product")
        .find({ query })
        .then((res) => {
          let results = res.data;
          setData(results);
          props.hide();
          setLoading(false);
        })
        .catch((error) => {
          console.log({ error });
          setLoading(false);
          props.hide();
          props.alert({
            title: "Product",
            type: "error",
            message: error.message || "Failed get Product",
          });
        });
    }
  }, [urlParams.productId, categoryId]);

  return (
    <>
      {/* ---------------- NEW LAYOUT START ---------------- */}
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

      <div
        className="surface-overlay px-4 md:px-6 lg:px-8 flex align-items-center justify-content-between relative"
        style={{ minHeight: "80px" }}
      >
        <StyleClass
          nodeRef={btnRef1}
          selector="#nav-1"
          enterClassName="hidden"
          leaveToClassName="hidden"
          hideOnOutsideClick
        >
          <a
            ref={btnRef1}
            className="p-ripple cursor-pointer flex align-items-center lg:hidden text-700 mr-3 sm:mr-5"
          >
            <i className="pi pi-bars text-4xl"></i>
            <Ripple />
          </a>
        </StyleClass>
        <div
          id="nav-1"
          className="surface-overlay hidden lg:flex absolute lg:static left-0 top-100 z-1 shadow-2 lg:shadow-none w-full lg:w-auto lg:flex-1 py-3 lg:py-0"
        >
          <ul className="list-none p-0 m-0 flex flex-column lg:flex-row">
            <li className="flex flex-column lg:flex-row">
              <StyleClass
                nodeRef={btnRef2}
                selector="@next"
                enterClassName="hidden"
                leaveToClassName="hidden"
                hideOnOutsideClick
              >
                <a
                  ref={btnRef2}
                  className="p-ripple inline-flex align-items-center cursor-pointer border-right-2 lg:border-right-none lg:border-bottom-2 border-transparent
              hover:border-primary py-3 lg:py-0 px-6 lg:px-3 text-700 select-none text-xl lg:text-base font-medium lg:font-base w-full lg:w-auto"
                >
                  <span>Women</span>
                  <Ripple />
                </a>
              </StyleClass>
              <div className="surface-overlay shadow-none lg:shadow-2 hidden lg:absolute w-full left-0 top-100 px-6 py-0 lg:py-6 h-10rem lg:h-30rem z-1">
                <div className="border-2 border-dashed surface-border border-round h-full"></div>
              </div>
            </li>
            <li className="flex flex-column lg:flex-row">
              <StyleClass
                nodeRef={btnRef8}
                selector="@next"
                enterClassName="hidden"
                leaveToClassName="hidden"
                hideOnOutsideClick
              >
                <a
                  ref={btnRef8}
                  className="p-ripple inline-flex align-items-center cursor-pointer border-right-2 lg:border-right-none lg:border-bottom-2 border-transparent
              hover:border-primary py-3 lg:py-0 px-6 lg:px-3 text-700 select-none text-xl lg:text-base font-medium lg:font-base w-full lg:w-auto"
                >
                  <span>Men</span>
                  <Ripple />
                </a>
              </StyleClass>

              <div className="surface-overlay shadow-none lg:shadow-2 hidden lg:absolute w-full left-0 top-100 px-6 py-0 lg:py-6 h-10rem lg:h-30rem z-1">
                <div className="border-2 border-dashed surface-border border-round h-full"></div>
              </div>
            </li>
            <li className="flex flex-column lg:flex-row">
              <StyleClass
                nodeRef={btnRef9}
                selector="@next"
                enterClassName="hidden"
                leaveToClassName="hidden"
                hideOnOutsideClick
              >
                <a
                  ref={btnRef9}
                  className="p-ripple inline-flex align-items-center cursor-pointer border-right-2 lg:border-right-none lg:border-bottom-2 border-transparent
              hover:border-primary py-3 lg:py-0 px-6 lg:px-3 text-700 select-none text-xl lg:text-base font-medium lg:font-base w-full lg:w-auto"
                >
                  <span>Kids</span>
                  <Ripple />
                </a>
              </StyleClass>

              <div className="surface-overlay shadow-none lg:shadow-2 hidden lg:absolute w-full left-0 top-100 px-6 py-0 lg:py-6 h-10rem lg:h-30rem z-1">
                <div className="border-2 border-dashed surface-border border-round h-full"></div>
              </div>
            </li>
          </ul>
        </div>
        <div className="flex-1 flex align-items-center justify-content-center py-3">
          <a onClick={() => navigate("/Homepage")} className="cursor-pointer">
            <img
              src="/lightning/apple-touch-icon.png"
              alt="Image"
              className="h-2rem sm:h-3rem"
            />
          </a>
        </div>
        <div className="hidden lg:flex flex-1 align-items-center justify-content-end">
          <ul className="list-none p-0 m-0 flex ml-auto">
            <li className="flex">
              <a className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer px-2 sm:px-3 hover:text-primary">
                <i className="pi pi-search mr-2 lg:mr-3 text-xl sm:text-base"></i>
                <span className="hidden lg:inline">Search</span>
                <Ripple />
              </a>
            </li>
            <li className="flex">
              <a className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer px-2 sm:px-3 hover:text-primary">
                <i className="pi pi-heart mr-2 lg:mr-3 text-xl sm:text-base"></i>
                <span className="hidden lg:inline">Favorites</span>
                <Ripple />
              </a>
            </li>
            <li className="flex">
              <a className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer px-2 sm:px-3 hover:text-primary">
                <i className="pi pi-shopping-cart lg:mr-3 text-xl sm:text-base p-overlay-badge">
                  <Badge />
                </i>
                <span className="hidden lg:inline">Cart</span>
                <Ripple />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="surface-section px-4 md:px-6 lg:px-8">
        <ul className="list-none py-3 px-0 m-0 border-y-1 surface-border flex flex-wrap align-items-center font-medium overflow-x-auto">
          <li className="lg:pr-3">
            <Link
              to="/Homepage"
              className="cursor-pointer text-900 white-space-nowrap"
            >
              Home
            </Link>
          </li>
          <li className="lg:px-2">
            <span className="text-900">/</span>
          </li>
          <li className="lg:px-2">
            <Link
              to="/category"
              className="cursor-pointer text-900 white-space-nowrap"
            >
              Women
            </Link>
          </li>
          <li className="lg:px-2">
            <span className="text-900">/</span>
          </li>
          <li className="lg:px-2">
            <Link
              to="/accessories"
              className="cursor-pointer text-900 white-space-nowrap"
            >
              Accessories
            </Link>
          </li>
          <li className="lg:px-2">
            <span className="text-900">/</span>
          </li>
          <li className="lg:px-2">
            <Link
              to="/shoes"
              className="cursor-pointer text-500 white-space-nowrap"
            >
              Shoes
            </Link>
          </li>
        </ul>

        <div className="grid my-4">
          <div className="col-12 lg:col-6">
            <div className="flex">
              <div className="flex flex-column w-2 justify-content-between">
                {images.map((image, i) => {
                  return (
                    <img
                      src={`/photo/productoverview/${image}`}
                      key={i}
                      className={classNames(
                        "w-full cursor-pointer border-2 border-round border-transparent transition-colors transition-duration-150",
                        { "border-primary": selectedImageIndex === i },
                      )}
                      onClick={() => setSelectedImageIndex(i)}
                      alt="product-overview"
                    />
                  );
                })}
              </div>
              <div className="pl-3 w-10">
                <img
                  src={`/photo/productoverview/${images[selectedImageIndex]}`}
                  className="w-full"
                  alt="product-overview"
                />
              </div>
            </div>
          </div>
          <div className="col-12 lg:col-6 py-3 lg:pl-6">
            <div className="flex align-items-center text-xl font-medium text-900 mb-4">
              Product Title Placeholder
            </div>
            <div className="flex align-items-center justify-content-between mb-5">
              <span className="text-900 font-medium text-3xl block">$120</span>
              <div className="flex align-items-center">
                <span className="mr-3">
                  <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                  <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                  <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                  <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                  <i className="pi pi-star text-700 mr-1"></i>
                </span>
                <span className="text-sm">
                  <b className="text-900 mr-1">24</b>{" "}
                  <span className="text-500"></span>reviews
                </span>
              </div>
            </div>

            <div className="font-bold text-900 mb-3">Color</div>
            <div className="flex align-items-center mb-5">
              <div
                className="w-2rem h-2rem flex-shrink-0 border-circle bg-bluegray-500 mr-3 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                style={{
                  boxShadow:
                    color === "bluegray"
                      ? "0 0 0 0.2rem var(--bluegray-500)"
                      : null,
                }}
                onClick={() => setColor("bluegray")}
              ></div>
              <div
                className="w-2rem h-2rem flex-shrink-0 border-circle bg-green-500 mr-3 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                style={{
                  boxShadow:
                    color === "green" ? "0 0 0 0.2rem var(--green-500)" : null,
                }}
                onClick={() => setColor("green")}
              ></div>
              <div
                className="w-2rem h-2rem flex-shrink-0 border-circle bg-blue-500 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                style={{
                  boxShadow:
                    color === "blue" ? "0 0 0 0.2rem var(--blue-500)" : null,
                }}
                onClick={() => setColor("blue")}
              ></div>
            </div>

            <div className="mb-3 flex align-items-center justify-content-between">
              <span className="font-bold text-900">Size</span>
              <a
                tabIndex="0"
                className="cursor-pointer text-600 text-sm flex align-items-center"
              >
                Size Guide <i className="ml-1 pi pi-angle-right"></i>
              </a>
            </div>
            <div className="grid grid-nogutter align-items-center mb-5">
              <div
                className={classNames(
                  "col h-3rem border-1 border-300 text-900 inline-flex justify-content-center align-items-center flex-shrink-0 border-round mr-3 cursor-pointer hover:surface-100 transition-duration-150 transition-colors",
                  { "border-blue-500 border-2 text-blue-500": size === "XS" },
                )}
                onClick={() => setSize("XS")}
              >
                XS
              </div>
              <div
                className={classNames(
                  "col h-3rem border-1 border-300 text-900 inline-flex justify-content-center align-items-center flex-shrink-0 border-round mr-3 cursor-pointer hover:surface-100 transition-duration-150 transition-colors",
                  { "border-blue-500 border-2 text-blue-500": size === "S" },
                )}
                onClick={() => setSize("S")}
              >
                S
              </div>
              <div
                className={classNames(
                  "col h-3rem border-1 border-300 text-900 inline-flex justify-content-center align-items-center flex-shrink-0 border-round mr-3 cursor-pointer hover:surface-100 transition-duration-150 transition-colors",
                  { "border-blue-500 border-2 text-blue-500": size === "M" },
                )}
                onClick={() => setSize("M")}
              >
                M
              </div>
              <div
                className={classNames(
                  "col h-3rem border-1 border-300 text-900 inline-flex justify-content-center align-items-center flex-shrink-0 border-round mr-3 cursor-pointer hover:surface-100 transition-duration-150 transition-colors",
                  { "border-blue-500 border-2 text-blue-500": size === "L" },
                )}
                onClick={() => setSize("L")}
              >
                L
              </div>
              <div
                className={classNames(
                  "col h-3rem border-1 border-300 text-900 inline-flex justify-content-center align-items-center flex-shrink-0 border-round cursor-pointer hover:surface-100 transition-duration-150 transition-colors",
                  { "border-blue-500 border-2 text-blue-500": size === "XL" },
                )}
                onClick={() => setSize("XL")}
              >
                XL
              </div>
            </div>

            <div className="font-bold text-900 mb-3">Quantity</div>
            <div className="flex flex-column sm:flex-row sm:align-items-center sm:justify-content-between">
              <InputNumber
                showButtons
                buttonLayout="horizontal"
                min="0"
                inputClassName="w-3rem text-center"
                value={quantity}
                onChange={(e) => setQuantity(e.value)}
                decrementButtonClassName="p-button-text"
                incrementButtonClassName="p-button-text"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
              ></InputNumber>
              <div className="flex align-items-center flex-1 mt-3 sm:mt-0 ml-0 sm:ml-5">
                <Button
                  label="Add to Cart"
                  className="flex-1 mr-5"
                  onClick={() => navigate("/cart")}
                />
                <i
                  className={classNames("pi text-2xl cursor-pointer", {
                    "pi-heart text-600": !liked,
                    "pi-heart-fill text-orange-500": liked,
                  })}
                  onClick={() => setLiked((prevState) => !prevState)}
                ></i>
              </div>
            </div>
          </div>
        </div>

        <TabView>
          <TabPanel header="Details">
            <div className="grid mt-4">
              <div className="col-12 lg:col-4">
                <div className="font-medium text-xl text-900 mb-3">
                  Share your experience
                </div>
                <p className="text-600 p-0 mt-0 mb-3 line-height-3">
                  Orci a scelerisque purus semper eget duis at tellus at. Ut
                  diam quam nulla porttitor.
                </p>
                <Button label="Write a review" className="p-button-rounded" />
              </div>
              <div className="col-12 lg:col-4 flex align-items-start justify-content-center py-5 lg:py-0">
                <div>
                  <span className="text-5xl text-900 font-bold mr-2">190</span>
                  <span className="text-5xl text-600">Reviews</span>
                  <div className="mt-3 text-center">
                    <i className="pi pi-star-fill text-yellow-500 text-2xl mr-1"></i>
                    <i className="pi pi-star-fill text-yellow-500 text-2xl mr-1"></i>
                    <i className="pi pi-star-fill text-yellow-500 text-2xl mr-1"></i>
                    <i className="pi pi-star-fill text-yellow-500 text-2xl mr-1"></i>
                    <i className="pi pi-star-fill text-300 text-2xl "></i>
                  </div>
                </div>
              </div>
              <div className="col-12 lg:col-4">
                <ul className="list-none p-0 m-0">
                  <li className="flex align-items-center mb-2">
                    <span className="text-900 font-medium mr-1 w-1rem">5</span>
                    <i className="pi pi-star-fill text-yellow-500 mr-2"></i>
                    <div
                      style={{ height: "7px" }}
                      className="border-round overflow-hidden flex-auto surface-300"
                    >
                      <div className="h-full bg-yellow-500 w-9 border-round"></div>
                    </div>
                    <span className="text-500 font-medium ml-2">75%</span>
                  </li>
                  <li className="flex align-items-center mb-2">
                    <span className="text-900 font-medium mr-1 w-1rem">4</span>
                    <i className="pi pi-star-fill text-yellow-500 mr-2"></i>
                    <div
                      style={{ height: "7px" }}
                      className="border-round overflow-hidden flex-auto surface-300"
                    >
                      <div className="h-full bg-yellow-500 w-6 border-round"></div>
                    </div>
                    <span className="text-500 font-medium ml-2">50%</span>
                  </li>
                  <li className="flex align-items-center mb-2">
                    <span className="text-900 font-medium mr-1 w-1rem">3</span>
                    <i className="pi pi-star-fill text-yellow-500 mr-2"></i>
                    <div
                      style={{ height: "7px" }}
                      className="border-round overflow-hidden flex-auto surface-300"
                    >
                      <div className="h-full bg-yellow-500 w-2 border-round"></div>
                    </div>
                    <span className="text-500 font-medium ml-2">20%</span>
                  </li>
                  <li className="flex align-items-center mb-2">
                    <span className="text-900 font-medium mr-1 w-1rem">2</span>
                    <i className="pi pi-star-fill text-yellow-500 mr-2"></i>
                    <div
                      style={{ height: "7px" }}
                      className="border-round overflow-hidden flex-auto surface-300"
                    >
                      <div className="h-full bg-yellow-500 w-4 border-round"></div>
                    </div>
                    <span className="text-500 font-medium ml-2">40%</span>
                  </li>
                  <li className="flex align-items-center mb-2">
                    <span className="text-900 font-medium mr-1 w-1rem">1</span>
                    <i className="pi pi-star-fill text-yellow-500 mr-2"></i>
                    <div
                      style={{ height: "7px" }}
                      className="border-round overflow-hidden flex-auto surface-300"
                    >
                      <div className="h-full bg-yellow-500 w-3 border-round"></div>
                    </div>
                    <span className="text-500 font-medium ml-2">30%</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-5">
              <ul className="list-none m-0 p-0">
                <li className="py-5 border-top-1 surface-border">
                  <div className="flex align-items-center justify-content-between mb-3">
                    <div className="flex align-items-center">
                      <img
                        src="/photo/avatars/circle/avatar-m-1.png"
                        className="w-3rem h-3rem flex-shrink-0 mr-3"
                        alt="avatar-m-1"
                      />
                      <div className="flex flex-column">
                        <span className="text-900 font-medium mb-1">
                          Robert Fox
                        </span>
                        <span className="text-500 font-medium text-sm">
                          February 3, 2022
                        </span>
                      </div>
                    </div>
                    <div className="flex align-items-center">
                      <span className="mr-2">
                        <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                        <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                        <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                        <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                        <i className="pi pi-star-fill text-yellow-500"></i>
                      </span>
                      <span className="font-medium">5</span>
                    </div>
                  </div>
                  <p className="text-600 p-0 m-0 line-height-3">
                    Scelerisque varius morbi enim nunc. Arcu bibendum at varius
                    vel pharetra vel turpis nunc eget. Elit ut aliquam purus sit
                    amet luctus. Aliquam etiam erat velit scelerisque in.
                  </p>
                </li>
                <li className="py-5 border-top-1 surface-border">
                  <div className="flex align-items-center justify-content-between mb-3">
                    <div className="flex align-items-center">
                      <img
                        src="/photo/avatars/circle/avatar-f-3.png"
                        className="w-3rem h-3rem flex-shrink-0 mr-3"
                        alt="avatar-f-3"
                      />
                      <div className="flex flex-column">
                        <span className="text-900 font-medium mb-1">
                          Savannah Williams
                        </span>
                        <span className="text-500 font-medium text-sm">
                          February 4, 2022
                        </span>
                      </div>
                    </div>
                    <div className="flex align-items-center">
                      <span className="mr-2">
                        <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                        <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                        <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                        <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                        <i className="pi pi-star-fill text-yellow-500"></i>
                      </span>
                      <span className="font-medium">5</span>
                    </div>
                  </div>
                  <p className="text-600 p-0 m-0 line-height-3">
                    Orci porta non pulvinar neque laoreet suspendisse interdum
                    consectetur. Vitae elementum curabitur vitae nunc sed velit
                    dignissim sodales ut.
                  </p>
                </li>
                <li className="py-5 border-top-1 surface-border">
                  <div className="flex align-items-center justify-content-between mb-3">
                    <div className="flex align-items-center">
                      <img
                        src="/photo/avatars/circle/avatar-f-2.png"
                        className="w-3rem h-3rem flex-shrink-0 mr-3"
                        alt="avatar-f-2"
                      />
                      <div className="flex flex-column">
                        <span className="text-900 font-medium mb-1">
                          Kathryn Murphy
                        </span>
                        <span className="text-500 font-medium text-sm">
                          February 5, 2022
                        </span>
                      </div>
                    </div>
                    <div className="flex align-items-center">
                      <span className="mr-2">
                        <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                        <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                        <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                        <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                        <i className="pi pi-star-fill text-yellow-500"></i>
                      </span>
                      <span className="font-medium">5</span>
                    </div>
                  </div>
                  <p className="text-600 p-0 m-0 line-height-3">
                    Sollicitudin nibh sit amet commodo nulla facilisi nullam
                    vehicula. Fringilla est ullamcorper eget nulla facilisi
                    etiam dignissim diam quis.{" "}
                  </p>
                </li>
              </ul>
            </div>
          </TabPanel>
          <TabPanel header="Reviews">
            <ul className="list-none p-0 m-0">
              <li className="pb-5 border-bottom-1 surface-border">
                <span>
                  <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                  <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                  <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                  <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                  <i className="pi pi-star-fill text-gray-500"></i>
                </span>
                <div className="text-900 font-medium text-xl my-3">
                  Absolute Perfection!
                </div>
                <p className="mx-0 mt-0 mb-3 text-700 line-height-3">
                  Blandit libero volutpat sed cras ornare arcu dui vivamus. Arcu
                  dictum varius duis at consectetur lorem donec massa. Imperdiet
                  proin fermentum leo vel orci porta non. Porttitor rhoncus
                  dolor purus non.
                </p>
                <span className="text-600 font-medium">
                  Darlene Robertson, 2 days ago
                </span>
              </li>
              <li className="py-5 border-bottom-1 surface-border">
                <span>
                  <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                  <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                  <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                  <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                  <i className="pi pi-star-fill text-yellow-500"></i>
                </span>
                <div className="text-900 font-medium text-xl my-3">Classy</div>
                <p className="mx-0 mt-0 mb-3 text-700 line-height-3">
                  Venenatis cras sed felis eget. Proin nibh nisl condimentum id
                  venenatis a condimentum.
                </p>
                <span className="text-600 font-medium">
                  Kristin Watson, 2 days ago
                </span>
              </li>
            </ul>
          </TabPanel>
          <TabPanel header="Shipping and Returns">
            <p className="line-height-3 text-700 p-0 mx-0 mt-0 mb-4">
              Mattis aliquam faucibus purus in massa tempor nec feugiat nisl.
              Justo donec enim diam vulputate ut pharetra. Tempus egestas sed
              sed risus. Feugiat sed lectus vestibulum mattis. Tristique nulla
              aliquet enim tortor at auctor urna nunc. Habitant morbi tristique
              senectus et. Facilisi nullam vehicula ipsum.
            </p>

            <div className="grid">
              <div className="col-12 md:col-6">
                <span className="text-900 block font-medium mb-3">
                  Shipping Costs
                </span>
                <ul className="py-0 pl-3 m-0 text-700 mb-3">
                  <li className="mb-2">Japan - JPY 2,500.</li>
                  <li className="mb-2">Europe – EUR 10</li>
                  <li className="mb-2">Switzerland – CHF 10</li>
                  <li className="mb-2">Canada – CAD 25</li>
                  <li className="mb-2">USA – USD 20</li>
                  <li className="mb-2">Australia – AUD 30</li>
                  <li className="mb-2">United Kingdom – GBP 10</li>
                </ul>
              </div>
              <div className="col-12 md:col-6">
                <span className="text-900 block font-medium mb-3">
                  Return Policy
                </span>
                <p className="line-height-3 text-700 p-0 m-0">
                  Pharetra et ultrices neque ornare aenean euismod elementum
                  nisi. Diam phasellus vestibulum lorem sed. Mattis molestie a
                  iaculis at.{" "}
                </p>
              </div>
            </div>
          </TabPanel>
        </TabView>

        <div className="grid -mr-3 -ml-3 py-8">
          <span className="text-900 p-2 text-4xl font-medium w-full">
            You may also like
          </span>
          <div className="col-12 md:col-6 lg:col-3 mb-3 lg:mb-0">
            <div className="p-2">
              <div className="relative">
                <img
                  src="/photo/productpage/productpage-1-1.png"
                  className="w-full"
                  alt="prdoctpage-1-1"
                />
                <button
                  type="text"
                  className="p-ripple p-link w-3rem h-3rem surface-0 hover:surface-200 border-circle shadow-2 inline-flex align-items-center justify-content-center absolute transition-colors transition-duration-300"
                  style={{ top: "1rem", right: "1rem" }}
                >
                  <i className="pi pi-heart text-2xl text-500"></i>
                  <Ripple />
                </button>
              </div>
              <div className="flex align-items-center justify-content-between mt-3 mb-2">
                <span className="text-900 font-medium text-xl">
                  Product Name
                </span>
                <span className="text-900 text-xl ml-3">$114</span>
              </div>
              <span className="text-600">Black</span>
            </div>
          </div>
          <div className="col-12 md:col-6 lg:col-3 mb-3 lg:mb-0">
            <div className="p-2">
              <div className="relative">
                <img
                  src="/photo/productpage/productpage-1-2.png"
                  className="w-full"
                  alt="prdoctpage-1-2"
                />
                <button
                  type="text"
                  className="p-ripple p-link w-3rem h-3rem surface-0 hover:surface-200 border-circle shadow-2 inline-flex align-items-center justify-content-center absolute transition-colors transition-duration-300"
                  style={{ top: "1rem", right: "1rem" }}
                >
                  <i className="pi pi-heart text-2xl text-500"></i>
                  <Ripple />
                </button>
              </div>
              <div className="flex align-items-center justify-content-between mt-3 mb-2">
                <span className="text-900 font-medium text-xl">
                  Product Name
                </span>
                <span className="text-900 text-xl ml-3">$124</span>
              </div>
              <span className="text-600">Beige</span>
            </div>
          </div>
          <div className="col-12 md:col-6 lg:col-3 mb-3 lg:mb-0">
            <div className="p-2">
              <div className="relative">
                <img
                  src="/photo/productpage/productpage-1-3.png"
                  className="w-full"
                  alt="productpage-1-3"
                />
                <button
                  type="text"
                  className="p-ripple p-link w-3rem h-3rem surface-0 hover:surface-200 border-circle shadow-2 inline-flex align-items-center justify-content-center absolute transition-colors transition-duration-300"
                  style={{ top: "1rem", right: "1rem" }}
                >
                  <i className="pi pi-heart text-2xl text-500"></i>
                  <Ripple />
                </button>
              </div>
              <div className="flex align-items-center justify-content-between mt-3 mb-2">
                <span className="text-900 font-medium text-xl">
                  Product Name
                </span>
                <span className="text-900 text-xl ml-3">$142</span>
              </div>
              <span className="text-600">White</span>
            </div>
          </div>
          <div className="col-12 md:col-6 lg:col-3">
            <div className="p-2">
              <div className="relative">
                <img
                  src="/photo/productpage/productpage-1-4.png"
                  className="w-full"
                  alt="prdoctpage-1-4"
                />
                <button
                  type="text"
                  className="p-ripple p-link w-3rem h-3rem surface-0 hover:surface-200 border-circle shadow-2 inline-flex align-items-center justify-content-center absolute transition-colors transition-duration-300"
                  style={{ top: "1rem", right: "1rem" }}
                >
                  <i className="pi pi-heart text-2xl text-500"></i>
                  <Ripple />
                </button>
              </div>
              <div className="flex align-items-center justify-content-between mt-3 mb-2">
                <span className="text-900 font-medium text-xl">
                  Product Name
                </span>
                <span className="text-900 text-xl ml-3">$120</span>
              </div>
              <span className="text-600">Black</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-nogutter surface-section px-4 py-4 md:px-6 lg:px-8 border-top-1 surface-border">
        <div className="col-12 lg:col-6 lg:border-right-1 surface-border">
          <img
            src="/photo/logos/peak-700.svg"
            className="w-9rem mx-auto lg:mx-0"
            alt="Peak logo"
          />
          <span className="text-900 block mt-4 mr-3">
            Aliquam id diam maecenas ultricies. Faucibus pulvinar elementum
            integer enim neque volutpat ac tincidunt vitae.
          </span>
          <span className="text-500 block mt-4">
            © 2022, Peak. Powered by PrimeBlocks.
          </span>
        </div>
        <div className="col-12 md:col-6 lg:col-3 mt-4 lg:mt-0 lg:pl-4 flex flex-column">
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
        <div className="col-12 lg:col-3 md:col-6 flex mt-4 lg:mt-0 lg:pl-4 flex-column">
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
      </div>

      <div className="surface-900 py-6 lg:py-4 md:px-6 lg:px-8 flex flex-column lg:flex-row justify-content-between align-items-center">
        <ul className="list-none p-0 mb-0 flex flex-column md:flex-row flex-order-1 lg:flex-order-0 mt-4 lg:mt-0">
          <li className="mr-4 mt-3 lg:mt-0">
            <a tabIndex="0" className="cursor-pointer text-0">
              Investor Relations
            </a>
          </li>
          <li className="mr-4 mt-3 lg:mt-0">
            <a tabIndex="0" className="cursor-pointer text-0">
              Data Privacy
            </a>
          </li>
          <li className="mr-4 mt-3 lg:mt-0">
            <a tabIndex="0" className="cursor-pointer text-0">
              Terms of Service
            </a>
          </li>
          <li className="mr-4 mt-3 lg:mt-0">
            <a tabIndex="0" className="cursor-pointer text-0">
              Legal Information
            </a>
          </li>
        </ul>

        <div className="flex align-items-center flex-order-0 lg:flex-order-1">
          <a tabIndex="0" className="cursor-pointer mr-3 lg:mt-0 block">
            <i className="pi pi-facebook surface-section p-1 text-sm border-circle text-900"></i>
          </a>
          <a tabIndex="0" className="cursor-pointer mr-3 lg:mt-0 block">
            <i className="pi pi-twitter surface-section p-1 text-sm border-circle text-900"></i>
          </a>
          <a tabIndex="0" className="cursor-pointer mr-3 lg:mt-0 block">
            <i className="pi pi-youtube surface-section p-1 text-sm border-circle text-900"></i>
          </a>
          <a tabIndex="0" className="cursor-pointer lg:mt-0 block">
            <i className="pi pi-google surface-section p-1 text-sm border-circle text-900"></i>
          </a>
        </div>
      </div>
    </>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
  show: () => dispatch.loading.show(),
  hide: () => dispatch.loading.hide(),
});

export default connect(mapState, mapDispatch)(ProductPage1);
