import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { StyleClass } from "primereact/styleclass";
import { Ripple } from "primereact/ripple";
import { Badge } from "primereact/badge";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import client from "../../../services/restClient";

const CartPage1 = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);

  const quantityOptions = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
  ];

  const currentCart = data.length > 0 ? data[0] : null;

  const customerName =
    currentCart?.customerName?.customerName ||
    currentCart?.customerName?.customers ||
    "Customer";

  let cartItemsList = Array.isArray(data) ? data : [];

  let subtotal = currentCart?.subtotal || currentCart?.Subtotal;
  let taxAmount = currentCart?.tax || currentCart?.Tax;
  let finalTotal = currentCart?.total || currentCart?.Total;

  // FIXED: Float parsing ensures proper calculation of dynamic totals
  if (subtotal === undefined || subtotal === null) {
    subtotal = Array.isArray(cartItemsList)
      ? cartItemsList.reduce((sum, item) => {
          const price = parseFloat(
            item?.price ||
              item?.basePrice ||
              item?.productPrice?.basePrice ||
              0,
          );
          const qty = parseInt(item?.quantity || 1);
          return sum + price * qty;
        }, 0)
      : 0;
  }

  if (taxAmount === undefined || taxAmount === null) {
    const taxRate = 0.06; // 6% GST/VAT
    taxAmount = parseFloat(subtotal) * taxRate;
  }

  if (finalTotal === undefined || finalTotal === null) {
    const shipping = 0; // Free
    finalTotal = parseFloat(subtotal) + shipping + parseFloat(taxAmount);
  }

  useEffect(() => {
    if (!props.user?._id) return;

    setLoading(true);
    props.show();
    client
      .service("cartItems")
      .find({
        query: {
          $limit: 10000,
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
          title: "Cart",
          type: "error",
          message: error.message || "Failed to get Cart",
        });
      });
  }, [props.user?._id]);

  const handleRemoveItem = async (itemId) => {
    try {
      props.show(); // Show loading spinner

      // 1. Delete from database
      await client.service("cartItems").remove(itemId);

      // 2. Remove from local UI state immediately
      setData((prevData) => prevData.filter((item) => item._id !== itemId));

      // 3. Show success alert
      if (props.alert) {
        props.alert({
          title: "Success",
          type: "success",
          message: "Item removed from cart",
        });
      }
    } catch (error) {
      console.error("Error removing item:", error);
      if (props.alert) {
        props.alert({
          title: "Error",
          type: "error",
          message: "Failed to remove item.",
        });
      }
    } finally {
      props.hide(); // Hide loading spinner
    }
  };

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
                    <Badge value={cartItemsList.length} severity="danger" />
                  </i>
                  <span className="hidden">My Cart</span>
                  <Ripple />
                </a>
              </StyleClass>
              <div className="hidden border-round surface-overlay p-4 shadow-2 absolute right-0 top-100 z-1 w-20rem origin-top">
                <span className="text-900 font-medium mb-3 block">
                  My Cart ({cartItemsList.length} Item)
                </span>
                <div className="flex pt-3">
                  <Button className="p-button-outlined mr-2">View Cart</Button>
                  <Button
                    className="ml-2"
                    onClick={() => navigate("/checkout")}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div className="flex flex-column align-items-center mb-6">
          <div className="text-900 text-4xl mb-4 font-medium text-center">
            {customerName} cart total is RM {finalTotal.toFixed(2)}
          </div>
          <p className="text-600 font-medium text-xl mt-0 mb-4">
            FREE SHIPPING AND RETURN
          </p>
          <Button label="Check Out" onClick={() => navigate("/checkout")} />
        </div>

        <ul className="list-none p-0 m-0">
          {loading ? (
            <div className="text-center py-6">
              <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
            </div>
          ) : !Array.isArray(cartItemsList) || cartItemsList.length === 0 ? (
            <div className="text-center py-6 text-600 text-xl border-top-1 border-bottom-1 surface-border">
              Your cart is currently empty.
            </div>
          ) : (
            cartItemsList.map((item, index) => {
              const itemName =
                item?.productName ||
                item?.name ||
                item?.items?.productName ||
                "Unknown Product";
              const itemSize =
                item?.size || item?.productSize || item?.items?.size || "N/A";
              const itemPrice = parseFloat(
                item?.price ||
                  item?.basePrice ||
                  item?.productPrice?.basePrice ||
                  0,
              );
              const itemQty = parseInt(item?.quantity || 1);

              return (
                <li
                  key={item._id || index}
                  className="flex flex-column md:flex-row py-6 border-top-1 border-bottom-1 surface-border md:align-items-center"
                >
                  <img
                    src="/lightning/NikeAirMax.jpeg"
                    className="w-12rem flex-shrink-0 mx-auto md:mx-0 border-round"
                    alt="product"
                  />
                  <div className="flex-auto py-5 md:pl-5">
                    <div className="flex flex-wrap align-items-start sm:align-items-center sm:flex-row sm:justify-content-between surface-border pb-6">
                      <div className="w-full sm:w-6 flex flex-column">
                        <span className="text-900 text-xl font-medium mb-3">
                          {itemName}
                        </span>
                        <span className="text-600">Size: {itemSize}</span>
                      </div>

                      <div className="w-full sm:w-6 flex align-items-start justify-content-between mt-3 sm:mt-0">
                        <div>
                          <Dropdown
                            options={quantityOptions}
                            value={itemQty}
                            onChange={(e) =>
                              console.log(
                                `Update quantity for ${item._id} to ${e.value}`,
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-column sm:align-items-end">
                          <span className="text-900 text-2xl font-medium mb-2 sm:mb-3">
                            RM {itemPrice.toFixed(2)}
                          </span>
                          <a
                            className="cursor-pointer text-pink-500 font-medium hover:text-pink-600 transition-colors transition-duration-300"
                            tabIndex="0"
                            onClick={() => handleRemoveItem(item._id)}
                          >
                            Remove
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-column">
                      <span className="inline-flex align-items-center mb-3">
                        <i className="pi pi-send text-600 mr-2"></i>
                        <span className="text-600 mr-2">
                          Delivery by <span className="font-bold">Dec 23.</span>
                        </span>
                      </span>
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>

        <div className="flex">
          <div className="w-12rem hidden md:block"></div>
          <ul className="list-none py-0 pr-0 pl-0 md:pl-5 mt-6 mx-0 mb-0 flex-auto">
            <li className="flex justify-content-between mb-4">
              <span className="text-xl text-900">Subtotal</span>
              <span className="text-xl text-900">RM {subtotal.toFixed(2)}</span>
            </li>
            <li className="flex justify-content-between mb-4">
              <span className="text-xl text-900">Shipping</span>
              <span className="text-xl text-green-500 font-bold">Free</span>
            </li>
            <li className="flex justify-content-between mb-4">
              <span className="text-xl text-900">VAT (6%)</span>
              <span className="text-xl text-900">
                RM {taxAmount.toFixed(2)}
              </span>
            </li>
            <li className="flex justify-content-between border-top-1 surface-border mb-4 pt-4">
              <span className="text-900 font-bold text-3xl">Total</span>
              <span className="text-primary font-bold text-3xl">
                RM {finalTotal.toFixed(2)}
              </span>
            </li>
            <li className="flex justify-content-end">
              <Button label="Check Out" onClick={() => navigate("/checkout")} />
            </li>
          </ul>
        </div>
      </div>
      <Divider className="w-full m-0" />

      <div className="surface-200 px-4 py-2 md:px-6 lg:px-8 flex flex-column lg:flex-row justify-content-between align-items-center">
        <div className="col-fixed flex flex-wrap flex-order-1 lg:flex-order-0 text-center lg:text-left">
          <span className="text-500">© 2026, My App.</span>
        </div>
        <div className="col-fixed flex align-items-center flex-order-0 lg:flex-order-1">
          <i className="pi pi-twitter p-1 text-sm text-900 cursor-pointer mr-3"></i>
          <i className="pi pi-facebook p-1 text-sm text-900 cursor-pointer mr-3"></i>
          <i className="pi pi-instagram p-1 text-sm text-900 cursor-pointer mr-3"></i>
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

export default connect(mapState, mapDispatch)(CartPage1);
