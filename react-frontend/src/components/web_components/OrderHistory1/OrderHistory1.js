import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { StyleClass } from "primereact/styleclass";
import { Ripple } from "primereact/ripple";
import { Badge } from "primereact/badge";
import { Divider } from "primereact/divider";
import client from "../../../services/restClient";

const OrderHistory1 = (props) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);

  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);
  const btnRef3 = useRef(null);
  const btnRef4 = useRef(null);
  const btnRef5 = useRef(null);

  const cartItems = [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!props.user?._id) return;
    setLoading(true);
    props.show();
    client
      .service("cartItems")
      .find({ query: { $limit: 10000, $sort: { createdAt: -1 } } })
      .then((res) => {
        setData(res.data);
        props.hide();
        setLoading(false);
      })
      .catch((error) => {
        console.log({ error });
        setLoading(false);
        props.hide();
        props.alert({
          title: "Order History",
          type: "error",
          message: error.message || "Failed to load order history",
        });
      });
  }, [props.user?._id]);

  return (
    <>
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
        className="surface-overlay px-3 lg:px-6 flex align-items-stretch relative border-bottom-1 surface-border"
        style={{ minHeight: "80px" }}
      >
        <a
          onClick={() => navigate("/Homepage")}
          className="flex align-items-center justify-content-center cursor-pointer"
        >
          <img
            src="/lightning/apple-touch-icon.png"
            alt="Image"
            height="40"
            className="hidden lg:inline mr-3 lg:mr-6"
          />
          <img
            src="/lightning/apple-touch-icon.png"
            alt="Image"
            height="40"
            className="inline lg:hidden mr-3 lg:mr-6"
          />
        </a>
        <div className="flex align-items-center flex-auto">
          <div className="p-input-icon-left w-full p-input-filled">
            <i className="pi pi-search"></i>
            <InputText
              type="text"
              className="w-full"
              placeholder="Product search"
            />
          </div>
        </div>
        <div className="flex ml-3 lg:ml-6">
          <ul className="list-none p-0 m-0 flex">
            <li className="inline-flex relative">
              <StyleClass
                nodeRef={btnRef1}
                selector="@next"
                enterClassName="hidden"
                enterActiveClassName="scalein"
                leaveToClassName="hidden"
                leaveActiveClassName="fadeout"
                hideOnOutsideClick
              >
                <a
                  ref={btnRef1}
                  className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer px-1 lg:px-3 mr-2 lg:mr-0 border-bottom-2 border-transparent hover:border-primary select-none"
                >
                  <i className="pi pi-user text-xl"></i>
                  <span className="hidden">My Account</span>
                  <Ripple />
                </a>
              </StyleClass>
              <div className="hidden border-round surface-overlay p-3 shadow-2 absolute right-0 top-100 z-1 w-15rem origin-top">
                <ul className="list-none p-0 m-0">
                  <li>
                    <a className="cursor-pointer text-700 hover:text-900 hover:surface-100 border-round flex align-items-center px-3 py-2">
                      <i className="pi pi-fw pi-box text-lg mr-2"></i>
                      <span>Orders</span>
                    </a>
                  </li>
                  <li>
                    <a className="cursor-pointer text-700 hover:text-900 hover:surface-100 border-round flex align-items-center px-3 py-2">
                      <i className="pi pi-fw pi-heart text-lg mr-2"></i>
                      <span>Favorites</span>
                    </a>
                  </li>
                  <li>
                    <a className="cursor-pointer text-700 hover:text-900 hover:surface-100 border-round flex align-items-center px-3 py-2">
                      <i className="pi pi-fw pi-star text-lg mr-2"></i>
                      <span>Reviews</span>
                    </a>
                  </li>
                  <li>
                    <a className="cursor-pointer text-700 hover:text-900 hover:surface-100 border-round flex align-items-center px-3 py-2">
                      <i className="pi pi-fw pi-sign-out text-lg mr-2"></i>
                      <span>Sign Out</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="inline-flex relative">
              <StyleClass
                nodeRef={btnRef2}
                selector="@next"
                enterClassName="hidden"
                enterActiveClassName="scalein"
                leaveToClassName="hidden"
                leaveActiveClassName="fadeout"
                hideOnOutsideClick
              >
                <a
                  ref={btnRef2}
                  className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer px-1 lg:px-3 border-bottom-2 border-transparent hover:border-primary select-none"
                >
                  <i className="pi pi-shopping-cart text-xl p-overlay-badge">
                    <Badge value={cartItems.length} severity="danger" />
                  </i>
                  <span className="hidden">My Cart</span>
                  <Ripple />
                </a>
              </StyleClass>
              <div className="hidden border-round surface-overlay p-4 shadow-2 absolute right-0 top-100 z-1 w-20rem origin-top">
                <span className="text-900 font-medium mb-3 block">
                  My Cart ({cartItems.length} Items)
                </span>
                <div className="flex pt-3">
                  <Button
                    className="p-button-outlined mr-2"
                    onClick={() => navigate("/cart")}
                  >
                    View Cart
                  </Button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="surface-overlay px-2 lg:px-5 flex align-items-stretch relative border-bottom-1 surface-border"
        style={{ minHeight: "80px" }}
      >
        <div className="flex">
          <ul className="list-none p-0 m-0 flex">
            <li className="flex">
              <StyleClass
                nodeRef={btnRef3}
                selector="@next"
                enterClassName="hidden"
                leaveToClassName="hidden"
                hideOnOutsideClick
              >
                <a
                  ref={btnRef3}
                  className="p-ripple font-medium inline-flex align-items-center cursor-pointer border-bottom-2 border-transparent hover:border-primary px-3 text-700 select-none"
                >
                  <span>Women</span>
                  <Ripple />
                </a>
              </StyleClass>
              <div className="surface-overlay shadow-2 hidden absolute w-full left-0 top-100 z-1">
                <div className="border-2 border-dashed surface-border border-round h-full p-6"></div>
              </div>
            </li>
            <li className="flex">
              <StyleClass
                nodeRef={btnRef4}
                selector="@next"
                enterClassName="hidden"
                leaveToClassName="hidden"
                hideOnOutsideClick
              >
                <a
                  ref={btnRef4}
                  className="p-ripple font-medium inline-flex align-items-center cursor-pointer border-bottom-2 border-transparent hover:border-primary px-3 text-700 select-none"
                >
                  <span>Men</span>
                  <Ripple />
                </a>
              </StyleClass>
              <div className="surface-overlay shadow-2 hidden absolute w-full left-0 top-100 h-30rem p-6 z-1">
                <div className="border-2 border-dashed surface-border border-round h-full"></div>
              </div>
            </li>
            <li className="flex">
              <StyleClass
                nodeRef={btnRef5}
                selector="@next"
                enterClassName="hidden"
                leaveToClassName="hidden"
                hideOnOutsideClick
              >
                <a
                  ref={btnRef5}
                  className="p-ripple font-medium inline-flex align-items-center cursor-pointer border-bottom-2 border-transparent hover:border-primary px-3 text-700 select-none"
                >
                  <span>Kids</span>
                  <Ripple />
                </a>
              </StyleClass>
              <div className="surface-overlay shadow-2 hidden absolute w-full left-0 top-100 h-30rem p-6 z-1">
                <div className="border-2 border-dashed surface-border border-round h-full"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div className="text-900 font-medium text-3xl mb-6">My Orders</div>
        {authError && (
          <div className="p-3 mb-4 border-round surface-100 text-700">
            Please log in to view your order history.
          </div>
        )}
        {loading ? (
          <div className="flex justify-content-center py-8">
            <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-column align-items-center py-8">
            <i className="pi pi-inbox text-5xl text-400 mb-4"></i>
            <span className="text-600 text-xl">No orders found.</span>
          </div>
        ) : (
          <ul className="list-none p-0 m-0">
            {data.map((item, index) => (
              <li
                key={item._id}
                className="flex flex-column md:flex-row md:align-items-center border-bottom-1 surface-border py-5"
              >
                <img
                  src="/lightning/NikeAirMax.jpeg"
                  className="w-5rem h-5rem border-round flex-shrink-0 mr-4"
                  alt="product"
                />
                <div className="flex-auto">
                  <div className="flex flex-column sm:flex-row sm:justify-content-between sm:align-items-center mb-2">
                    <span className="text-900 font-medium text-xl">
                      {item.productName || "Unknown Product"}
                    </span>
                    <span className="text-600 mt-2 sm:mt-0">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-MY", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                  <div className="flex flex-column sm:flex-row gap-3">
                    <span className="text-700">Size: {item.size || "N/A"}</span>
                    <span className="text-700">Qty: {item.quantity || 1}</span>
                    <span className="text-700 font-medium">
                      RM {(parseFloat(item.price) || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex mt-4 md:mt-0 md:ml-6">
                  <Button
                    className="p-button-primary w-full lg:w-auto lg:px-6"
                    label="View Order"
                    onClick={() => navigate("/order")}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!loading && data.length > 0 && (
        <div className="surface-ground px-4 py-8 md:px-6 lg:px-8">
          {data.map((item, index) => {
            const itemPrice = parseFloat(item?.price) || 0;
            const itemQty = parseInt(item?.quantity) || 1;
            const orderDate = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-MY", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-";
            return (
              <div
                key={item._id || index}
                className="surface-card grid grid-nogutter border-round shadow-2 mt-5"
              >
                <div className="col-12 flex p-2 surface-100 border-round-top">
                  <div className="p-2 flex-auto text-center md:text-left">
                    <span className="text-700 block">Order</span>
                    <span className="text-900 font-medium block mt-2">
                      #{index + 1}
                    </span>
                  </div>
                  <Divider
                    align="center"
                    layout="vertical"
                    className="h-full mx-0 lg:mx-3 surface-border"
                  />
                  <div className="p-2 flex-auto text-center md:text-left">
                    <span className="text-700 block">Order Date</span>
                    <span className="text-900 font-medium block mt-2">
                      {orderDate}
                    </span>
                  </div>
                  <Divider
                    align="center"
                    layout="vertical"
                    className="h-full mx-0 lg:mx-3 surface-border"
                  />
                  <div className="p-2 flex-auto text-center md:text-left">
                    <span className="text-700 block">Total Amount</span>
                    <span className="text-900 font-medium block mt-2">
                      RM {(itemPrice * itemQty).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="p-2 my-4 flex flex-column lg:flex-row justify-content-between align-items-center">
                    <div className="flex flex-column lg:flex-row justify-content-center align-items-center px-2">
                      <img
                        src="/lightning/NikeAirMax.jpeg"
                        alt="product"
                        className="w-8rem h-8rem mr-3 flex-shrink-0 border-round"
                      />
                      <div className="flex flex-column my-auto text-center md:text-left">
                        <span className="text-900 font-medium mb-3 mt-3 lg:mt-0">
                          {item.productName || "Unknown Product"}
                        </span>
                        <span className="text-600 text-sm mb-3">
                          Size: {item.size || "N/A"} | Qty: {itemQty}
                        </span>
                        <a
                          tabIndex="0"
                          className="p-ripple p-2 cursor-pointer w-9rem mx-auto lg:mx-0 border-round font-medium text-center border-1 border-primary text-primary transition-duration-150"
                          onClick={() => navigate("/product")}
                        >
                          Buy Again{" "}
                          <span className="font-light">
                            | RM {itemPrice.toFixed(2)}
                          </span>
                          <Ripple />
                        </a>
                      </div>
                    </div>
                    <div
                      className="bg-green-50 mr-0 lg:mr-3 mt-4 lg:mt-0 p-2 flex align-items-center"
                      style={{ borderRadius: "2.5rem" }}
                    >
                      <span
                        className="bg-green-500 text-white flex align-items-center justify-content-center border-circle mr-2"
                        style={{ minWidth: "2rem", minHeight: "2rem" }}
                      >
                        <i className="pi pi-check"></i>
                      </span>
                      <span className="text-green-600">
                        Ordered on {orderDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12 p-0 flex border-top-1 surface-border">
                  <a
                    tabIndex="0"
                    className="cursor-pointer py-4 flex flex-column md:flex-row text-center justify-content-center align-items-center font-medium text-primary hover:bg-primary hover:text-0 transition-duration-150 w-full"
                    style={{ borderBottomLeftRadius: "6px" }}
                  >
                    <i className="pi pi-folder mr-2 mb-2 md:mb-0"></i>Archive
                    Order
                  </a>
                  <a
                    tabIndex="0"
                    className="cursor-pointer py-4 flex flex-column md:flex-row text-center justify-content-center align-items-center font-medium text-primary hover:bg-primary hover:text-0 transition-duration-150 w-full"
                  >
                    <i className="pi pi-refresh mr-2 mb-2 md:mb-0"></i>Return
                  </a>
                  <a
                    tabIndex="0"
                    className="cursor-pointer py-4 flex flex-column md:flex-row text-center justify-content-center align-items-center font-medium text-primary hover:bg-primary hover:text-0 transition-duration-150 w-full"
                  >
                    <i className="pi pi-file mr-2 mb-2 md:mb-0"></i>View Invoice
                  </a>
                  <a
                    tabIndex="0"
                    className="cursor-pointer py-4 flex flex-column md:flex-row text-center justify-content-center align-items-center font-medium text-primary hover:bg-primary hover:text-0 transition-duration-150 w-full"
                    style={{ borderBottomRightRadius: "6px" }}
                  >
                    <i className="pi pi-comment mr-2 mb-2 md:mb-0"></i>Write a
                    Review
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
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

export default connect(mapState, mapDispatch)(OrderHistory1);
