import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { StyleClass } from "primereact/styleclass";
import { Ripple } from "primereact/ripple";
import { Badge } from "primereact/badge";
import client from "../../../services/restClient";

const OrderPage1 = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);
  const btnRef3 = useRef(null);
  const btnRef4 = useRef(null);
  const btnRef5 = useRef(null);

  const cartItems = [];

  useEffect(() => {
    setLoading(true);
    props.show();
    client
      .service("order")
      .find({
        query: {
          $limit: 10000,
          customerName: urlParams.singleCustomerDetailsId,
          $populate: [
            { path: "createdBy", service: "users", select: ["name"] },
            { path: "updatedBy", service: "users", select: ["name"] },
            {
              path: "customerName",
              service: "customer_details",
              select: [
                "customerName",
                "customerEmail",
                "customerAddress",
                "phoneNumber",
              ],
            },
          ],
        },
      })
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
          title: "Order",
          type: "error",
          message: error.message || "Failed get Order",
        });
      });
  }, []);

  return (
    <>
      {/* Top banner */}
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

      {/* Main navbar */}
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

      {/* Category nav */}
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
        <div className="flex flex-column sm:flex-row sm:justify-content-between sm:align-items-center">
          <span className="text-2xl font-medium text-900">
            Thanks for your order!
          </span>
          <div className="flex mt-3 sm:mt-0">
            <div className="flex flex-column align-items-center">
              <span className="text-900 font-medium mb-2">Order ID</span>
              <span className="text-700">451234</span>
            </div>
            <div className="flex flex-column align-items-center ml-6 md:ml-8">
              <span className="text-900 font-medium mb-2">Order Date</span>
              <span className="text-700">7 Feb 2023</span>
            </div>
          </div>
        </div>
        <div className="flex flex-column md:flex-row md:align-items-center border-bottom-1 surface-border py-5">
          <img
            src="photo/ordersummary/order-summary-2-1.png"
            className="w-15rem flex-shrink-0 md:mr-6"
          />
          <div className="flex-auto mt-3 md:mt-0">
            <span className="text-xl text-900">Product Name</span>
            <div className="font-medium text-2xl text-900 mt-3 mb-5">
              Order Processing
            </div>
            <div
              className="border-round overflow-hidden surface-300 mb-3"
              style={{ height: "7px" }}
            >
              <div className="bg-primary border-round w-4 h-full"></div>
            </div>
            <div className="flex w-full justify-content-between">
              <span className="text-900 text-xs sm:text-base">Ordered</span>
              <span className="text-900 font-medium text-xs sm:text-base">
                Processing
              </span>
              <span className="text-500 text-xs sm:text-base">Shipping</span>
              <span className="text-500 text-xs sm:text-base">Delivered</span>
            </div>
          </div>
        </div>
        <div className="py-5 flex justify-content-between flex-wrap">
          <div className="flex sm:mr-5 mb-5">
            <span className="font-medium text-900 text-xl mr-8">
              Product Name
            </span>
            <span className="text-900 text-xl">$21.00</span>
          </div>
          <div className="flex flex-column sm:mr-5 mb-5">
            <span className="font-medium text-900 text-xl">
              Shipping Address
            </span>
            <div className="flex flex-column text-900 mt-3">
              <span className="mb-1">Celeste Slater</span>
              <span className="mb-1">
                606-3727 Ullamcorper. Roseville NH 11523
              </span>
              <span>(786) 713-8616</span>
            </div>
          </div>
          <div className="flex flex-column">
            <span className="font-medium text-900 text-xl">Payment</span>
            <div className="flex align-items-center mt-3">
              <img src="/photo/ordersummary/visa.png" className="w-4rem mr-3" />
              <div className="flex flex-column">
                <span className="text-900 mb-1">Visa Debit Card</span>
                <span className="text-900 font-medium">
                  **** **** **** 1234
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-content-end mt-5">
            <Button
              className="p-button-primary w-full lg:w-auto lg:px-6 flex-order-1 lg:flex-order-2"
              label="View Order History"
              onClick={() => navigate("/OrderHistory1")}
            />
          </div>
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

export default connect(mapState, mapDispatch)(OrderPage1);
