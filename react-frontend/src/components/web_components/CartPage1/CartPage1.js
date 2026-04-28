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
  const btnRef3 = useRef(null);
  const btnRef4 = useRef(null);
  const btnRef5 = useRef(null);

  const [value1, setValue1] = useState(1);
  const [value2, setValue2] = useState(1);

  const quantityOptions = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
  ];

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

  const cartItems = [1];

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
                  My Cart (1 Item)
                </span>
                <div className="flex align-items-center border-bottom-1 surface-border pb-3">
                  <img
                    src="/photo/shoppingcart/shopping-cart-2-2.png"
                    className="w-4rem flex-shrink-0 shadow-1"
                    alt="shopping-cart-2-2"
                  />
                  <div className="flex flex-column pl-3">
                    <span className="text-900 font-medium mb-2">
                      Prime Watch
                    </span>
                    <span className="text-600 mb-2">Standard Size</span>
                    <span className="text-primary font-bold">$50.00</span>
                  </div>
                </div>
                <div className="flex pt-3">
                  <Button className="p-button-outlined mr-2">View Cart</Button>
                  <Button className="ml-2">Purchase</Button>
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
                <div className="flex flex-wrap justify-content-between p-4 lg:p-6">
                  <ul className="list-none px-3 lg:px-0 py-0 m-0 text-700 mb-5">
                    <li className="font-bold mb-5 text-xl text-900">
                      Clothing
                    </li>
                    <li className="mb-3 cursor-pointer hover:text-900">
                      Dresses
                    </li>
                    <li className="mb-3 cursor-pointer hover:text-900">
                      Jeans
                    </li>
                    <li className="mb-3 cursor-pointer hover:text-900">
                      Pants
                    </li>
                    <li className="mb-3 cursor-pointer hover:text-900">
                      Skirts
                    </li>
                    <li className="mb-3 cursor-pointer hover:text-900">
                      Sweaters
                    </li>
                    <li className="mb-3 cursor-pointer hover:text-900">
                      Blouses
                    </li>
                  </ul>
                  <ul className="list-none px-3 lg:px-0 py-0 m-0 text-700 mb-5">
                    <li className="font-bold mb-5 text-xl text-900">Shoes</li>
                    <li className="mb-3 cursor-pointer hover:text-900">
                      Athletic
                    </li>
                    <li className="mb-3 cursor-pointer hover:text-900">
                      Boots
                    </li>
                    <li className="mb-3 cursor-pointer hover:text-900">
                      Sneakers
                    </li>
                    <li className="mb-3 cursor-pointer hover:text-900">
                      Flats
                    </li>
                    <li className="mb-3 cursor-pointer hover:text-900">
                      Outdoor
                    </li>
                  </ul>
                  <ul className="list-none px-3 lg:px-0 py-0 m-0 text-700 mb-5">
                    <li className="font-bold mb-5 text-xl text-900">
                      Accessories
                    </li>
                    <li className="mb-3 cursor-pointer hover:text-900">
                      Handbags
                    </li>
                    <li className="mb-3 cursor-pointer hover:text-900">
                      Gloves
                    </li>
                    <li className="mb-3 cursor-pointer hover:text-900">
                      Belts
                    </li>
                    <li className="mb-3 cursor-pointer hover:text-900">Hats</li>
                    <li className="mb-3 cursor-pointer hover:text-900">
                      Earmuffs
                    </li>
                  </ul>
                  <ul className="list-none flex p-0 m-0">
                    <li className="flex flex-column align-items-center mb-5 lg:mr-5 pr-3 lg:pr-0">
                      <img
                        src="/photo/storenavigation/storenavigation-3-1.png"
                        alt="Image"
                        style={{ borderRadius: "12px" }}
                        className="mb-5 w-full lg:w-20rem"
                      />
                      <span className="inline-flex surface-0 text-900 border-round font-semibold text-xl mb-3">
                        New Arrivals
                      </span>
                      <a className="cursor-pointer text-700 font-medium hover:text-900">
                        View All
                      </a>
                    </li>
                    <li className="flex flex-column align-items-center pl-3 lg:pl-0">
                      <img
                        src="/photo/storenavigation/storenavigation-3-2.png"
                        alt="Image"
                        style={{ borderRadius: "12px" }}
                        className="mb-5 w-full lg:w-20rem"
                      />
                      <span className="inline-flex surface-0 text-900 border-round font-semibold text-xl mb-3">
                        Seasonal
                      </span>
                      <a className="cursor-pointer text-700 font-medium hover:text-900">
                        View All
                      </a>
                    </li>
                  </ul>
                </div>
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
        <div className="flex flex-column align-items-center mb-6">
          <div className="text-900 text-4xl mb-4 font-medium text-center">
            Your cart total is $82.00
          </div>
          <p className="text-600 font-medium text-xl mt-0 mb-4">
            FREE SHIPPING AND RETURN
          </p>
          <Button label="Check Out" onClick={() => navigate("/checkout")} />
        </div>
        <ul className="list-none p-0 m-0">
          <li className="flex flex-column md:flex-row py-6 border-top-1 border-bottom-1 surface-border md:align-items-center">
            <img
              src="/photo/shoppingcart/shopping-cart-2-1.png"
              className="w-12rem flex-shrink-0 mx-auto md:mx-0"
              alt="shopping-cart-2-1"
            />
            <div className="flex-auto py-5 md:pl-5">
              <div className="flex flex-wrap align-items-start sm:align-items-center sm:flex-row sm:justify-content-between surface-border pb-6">
                <div className="w-full sm:w-6 flex flex-column">
                  <span className="text-900 text-xl font-medium mb-3">
                    Product Name
                  </span>
                  <span className="text-600">Medium</span>
                </div>
                <div className="w-full sm:w-6 flex align-items-start justify-content-between mt-3 sm:mt-0">
                  <div>
                    <Dropdown
                      options={quantityOptions}
                      value={value1}
                      onChange={(e) => setValue1(e.value)}
                    />
                  </div>
                  <div className="flex flex-column sm:align-items-end">
                    <span className="text-900 text-2xl font-medium mb-2 sm:mb-3">
                      $20.00
                    </span>
                    <a
                      className="cursor-pointer text-pink-500 font-medium hover:text-pink-600 transition-colors transition-duration-300"
                      tabIndex="0"
                    >
                      Remove
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex flex-column">
                <span className="inline-flex align-items-center mb-3">
                  <i className="pi pi-envelope text-600 mr-2"></i>
                  <span className="text-600 mr-2">Order today.</span>
                </span>
                <span className="inline-flex align-items-center mb-3">
                  <i className="pi pi-send text-600 mr-2"></i>
                  <span className="text-600 mr-2">
                    Delivery by <span className="font-bold">Dec 23.</span>
                  </span>
                </span>
                <span className="flex align-items-center">
                  <i className="pi pi-exclamation-triangle text-600 mr-2"></i>
                  <span className="text-600">Only 8 Available.</span>
                </span>
              </div>
            </div>
          </li>
          <li className="flex flex-column md:flex-row py-6 border-top-1 border-bottom-1 surface-border md:align-items-center">
            <img
              src="/photo/shoppingcart/shopping-cart-2-2.png"
              className="w-12rem flex-shrink-0 mx-auto md:mx-0"
              alt="shopping-cart-2-2"
            />
            <div className="flex-auto py-5 md:pl-5">
              <div className="flex flex-wrap align-items-start sm:align-items-center sm:flex-row sm:justify-content-between surface-border pb-6">
                <div className="w-full sm:w-6 flex flex-column">
                  <span className="text-900 text-xl font-medium mb-3">
                    Product Name
                  </span>
                  <span className="text-600">Medium</span>
                </div>
                <div className="w-full sm:w-6 flex align-items-start justify-content-between mt-3 sm:mt-0">
                  <div>
                    <Dropdown
                      options={quantityOptions}
                      value={value2}
                      onChange={(e) => setValue2(e.value)}
                    />
                  </div>
                  <div className="flex flex-column sm:align-items-end">
                    <span className="text-900 text-2xl font-medium mb-2 sm:mb-3">
                      $62.00
                    </span>
                    <a
                      className="cursor-pointer text-pink-500 font-medium hover:text-pink-600 transition-colors transition-duration-300"
                      tabIndex="0"
                    >
                      Remove
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex flex-column">
                <span className="inline-flex align-items-center mb-3">
                  <i className="pi pi-envelope text-600 mr-2"></i>
                  <span className="text-600 mr-2">Order today.</span>
                </span>
                <span className="inline-flex align-items-center mb-3">
                  <i className="pi pi-send text-600 mr-2"></i>
                  <span className="text-600 mr-2">
                    Delivery by <span className="font-bold">Dec 23.</span>
                  </span>
                </span>
                <span className="flex align-items-center">
                  <i className="pi pi-exclamation-triangle text-600 mr-2"></i>
                  <span className="text-600">Only 2 Available.</span>
                </span>
              </div>
            </div>
          </li>
        </ul>
        <div className="flex">
          <div className="w-12rem hidden md:block"></div>
          <ul className="list-none py-0 pr-0 pl-0 md:pl-5 mt-6 mx-0 mb-0 flex-auto">
            <li className="flex justify-content-between mb-4">
              <span className="text-xl text-900">Subtotal</span>
              <span className="text-xl text-900">$82.00</span>
            </li>
            <li className="flex justify-content-between mb-4">
              <span className="text-xl text-900">Shipping</span>
              <span className="text-xl text-900">Free</span>
            </li>
            <li className="flex justify-content-between mb-4">
              <span className="text-xl text-900">VAT</span>
              <span className="text-xl text-900">$8.00</span>
            </li>
            <li className="flex justify-content-between border-top-1 surface-border mb-4 pt-4">
              <span className="text-900 font-bold text-3xl">Total</span>
              <span className="text-900 font-bold text-3xl">$90.00</span>
            </li>
            <li className="flex justify-content-end">
              <Button label="Check Out" onClick={() => navigate("/checkout")} />
            </li>
          </ul>
        </div>
      </div>
      <Divider className="w-full m-0" />
      <div className="surface-section px-4 py-6 md:px-6 lg:px-8">
        <div className="grid grid-nogutter text-center sm:text-left flex-wrap">
          <div className="col-12 sm:col-6 md:col-4 lg:col-3 flex-column mt-4">
            <span className="text-900 text-xl block">Company</span>
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

          <div className="col-12 sm:col-6 md:col-4 lg:col-3 flex-column mt-4">
            <span className="text-900 text-xl block">Account</span>
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

          <div className="col-12 sm:col-6 md:col-4 lg:col-3 flex-column mt-4">
            <span className="text-900 text-xl block">Legal</span>
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

          <div className="col-12 sm:col-6 md:col-4 lg:col-3 flex-column mt-4">
            <span className="text-900 text-xl block">Connect</span>
            <ul className="list-none p-0">
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Pinterest
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="surface-200 px-4 py-2 md:px-6 lg:px-8 flex flex-column lg:flex-row justify-content-between align-items-center">
        <div className="col-fixed flex flex-wrap flex-order-1 lg:flex-order-0 text-center lg:text-left">
          <span className="text-500">
            © 2022, Peak. Powered by PrimeBlocks.
          </span>
        </div>
        <div className="col-fixed flex align-items-center flex-order-0 lg:flex-order-1">
          <i className="pi pi-twitter p-1 text-sm text-900 cursor-pointer mr-3"></i>
          <i className="pi pi-facebook p-1 text-sm text-900 cursor-pointer mr-3"></i>
          <i className="pi pi-youtube p-1 text-sm text-900 cursor-pointer mr-3"></i>
          <i className="pi pi-google p-1 text-sm text-900 cursor-pointer mr-3"></i>
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
