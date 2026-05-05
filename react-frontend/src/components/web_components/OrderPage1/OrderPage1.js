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
  const [cartItems, setCartItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);
  const btnRef3 = useRef(null);
  const btnRef4 = useRef(null);
  const btnRef5 = useRef(null);

  // Fetch cart items
  useEffect(() => {
    if (!props.user?._id) return;
    setLoading(true);
    props.show();
    client
      .service("cartItems")
      .find({ query: { $limit: 10000 } })
      .then((res) => {
        setCartItems(res.data);
        props.hide();
        setLoading(false);
      })
      .catch((error) => {
        console.log({ error });
        setLoading(false);
        props.hide();
      });
  }, [props.user?._id]);

  // Fetch customer details + address for the logged-in user
  useEffect(() => {
    if (!props.user?._id) return;
    client
      .service("customerDetails")
      .find({
        query: {
          createdBy: props.user._id,
          $limit: 1,
          $populate: [
            {
              path: "customerAddress",
              service: "customerAddress",
              select: [
                "addressType",
                "addressLine1",
                "addressLine2",
                "city",
                "postalCode",
                "country",
              ],
            },
          ],
        },
      })
      .then((res) => {
        if (res.data && res.data.length > 0) setCustomerInfo(res.data[0]);
      })
      .catch((error) => console.log("customerDetails error:", error));
  }, [props.user?._id]);

  const subtotal = cartItems.reduce((sum, item) => {
    return (
      sum + (parseFloat(item?.price) || 0) * (parseInt(item?.quantity) || 1)
    );
  }, 0);
  const tax = subtotal * 0.06;
  const finalTotal = subtotal + tax;

  const addr = customerInfo?.customerAddress;
  const shippingAddress = addr
    ? [
        customerInfo?.customers,
        addr.addressLine1,
        addr.addressLine2,
        addr.city,
        addr.postalCode,
        addr.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "No address on file";
  const today = new Date().toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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
            <div className="flex flex-column align-items-center ml-6 md:ml-8">
              <span className="text-900 font-medium mb-2">Order Date</span>
              <span className="text-700">{today}</span>
            </div>
          </div>
        </div>

        {/* Dynamic cart items */}
        {loading ? (
          <div className="text-center py-6">
            <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-6 text-600 text-xl border-bottom-1 surface-border">
            No items in your order.
          </div>
        ) : (
          cartItems.map((item, index) => {
            const itemName = item?.productName || "Unknown Product";
            const itemPrice = parseFloat(item?.price) || 0;
            const itemQty = parseInt(item?.quantity) || 1;
            const itemSize = item?.size || "N/A";
            return (
              <div
                key={item._id || index}
                className="flex flex-column md:flex-row md:align-items-center border-bottom-1 surface-border py-5"
              >
                <img
                  src="/lightning/NikeAirMax.jpeg"
                  className="w-8rem border-round flex-shrink-0 md:mr-6"
                  alt="product"
                />
                <div className="flex-auto mt-3 md:mt-0">
                  <span className="text-xl text-900 font-medium">
                    {itemName}
                  </span>
                  <div className="text-600 mt-1 mb-2">
                    Size: {itemSize} &nbsp;|&nbsp; Qty: {itemQty}
                  </div>
                  <div className="font-medium text-2xl text-900 mt-2 mb-4">
                    Order Processing
                  </div>
                  <div
                    className="border-round overflow-hidden surface-300 mb-3"
                    style={{ height: "7px" }}
                  >
                    <div className="bg-primary border-round w-4 h-full"></div>
                  </div>
                  <div className="flex w-full justify-content-between">
                    <span className="text-900 text-xs sm:text-base">
                      Ordered
                    </span>
                    <span className="text-900 font-medium text-xs sm:text-base">
                      Processing
                    </span>
                    <span className="text-500 text-xs sm:text-base">
                      Shipping
                    </span>
                    <span className="text-500 text-xs sm:text-base">
                      Delivered
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div className="py-5 flex justify-content-between flex-wrap">
          {/* Total */}
          <div className="flex flex-column sm:mr-5 mb-5">
            <span className="font-medium text-900 text-xl mb-3">
              Order Total
            </span>
            <div className="flex flex-column text-900">
              <span className="mb-1">Subtotal: RM {subtotal.toFixed(2)}</span>
              <span className="mb-1">VAT (6%): RM {tax.toFixed(2)}</span>
              <span className="font-bold text-xl">
                Total: RM {finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="flex flex-column sm:mr-5 mb-5">
            <span className="font-medium text-900 text-xl mb-3">
              Shipping Address
            </span>
            <div className="flex flex-column text-900">
              {addr ? (
                <>
                  <span className="mb-1 font-medium">
                    {customerInfo?.customers}
                  </span>
                  <span className="mb-1">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                  </span>
                  <span className="mb-1">
                    {addr.city}
                    {addr.postalCode ? ` ${addr.postalCode}` : ""}
                  </span>
                  <span className="mb-1">{addr.country}</span>
                  {customerInfo?.phoneNumber && (
                    <span>{customerInfo.phoneNumber}</span>
                  )}
                </>
              ) : (
                <span className="text-500">
                  No address on file. Please update your profile.
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-content-end mt-5 w-full">
            <Button
              className="p-button-primary w-full lg:w-auto lg:px-6"
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
