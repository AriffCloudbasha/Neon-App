import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";

import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Ripple } from "primereact/ripple";
import { Badge } from "primereact/badge";
import { Divider } from "primereact/divider";
import { Menu } from "primereact/menu";
import { MultiSelect } from "primereact/multiselect";
import { ToggleButton } from "primereact/togglebutton";
import client from "../../../services/restClient";

const CategoryPage1 = (props) => {
  const navigate = useNavigate();
  const { categoryType } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const menu = useRef(null);
  const [items] = useState([]);
  const [types, setTypes] = useState([]);
  const [colors] = useState([
    { name: "Black", class: "bg-black" },
    { name: "White", class: "bg-white" },
  ]);
  const [prices] = useState([{ range: "$0 - $50" }, { range: "$50 - $150" }]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [text, setText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [categoryImageMap, setCategoryImageMap] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setLoading(true);
    props.show();

    // Build query based on category type
    const query = {
      $limit: 10000,
      $populate: [
        { path: "createdBy", service: "users", select: ["name"] },
        { path: "updatedBy", service: "users", select: ["name"] },
      ],
    };

    // Filter by gender if categoryType is provided
    if (
      categoryType &&
      ["women", "men", "kids"].includes(categoryType.toLowerCase())
    ) {
      query.gender = categoryType.toLowerCase();
    }

    client
      .service("category")
      .find({ query })
      .then((res) => {
        let results = res.data;
        setData(results);
        // Build unique type options from fetched data
        const uniqueTypes = [
          ...new Set(results.map((r) => r.type).filter(Boolean)),
        ].map((t) => ({ name: t }));
        setTypes(uniqueTypes);

        // Fetch one product image per category
        const categoryIds = results.map((r) => r._id);
        if (categoryIds.length > 0) {
          client
            .service("product")
            .find({
              query: {
                $limit: 1000,
                $populate: [
                  {
                    path: "productImage",
                    service: "documentStorages",
                    select: ["url"],
                  },
                ],
              },
            })
            .then((productRes) => {
              console.log(
                "[CategoryPage] raw products:",
                JSON.stringify(
                  productRes.data.map((p) => ({
                    id: p._id,
                    category: p.category,
                    productImage: p.productImage,
                  })),
                  null,
                  2,
                ),
              );
              const imageMap = {};
              const serverUrl = process.env.REACT_APP_SERVER_URL || "";
              productRes.data.forEach((product) => {
                const catId = product.category
                  ? (product.category._id || product.category).toString()
                  : null;
                const rawUrl = product.productImage?.[0]?.url;
                const url = rawUrl
                  ? rawUrl.startsWith("/uploads")
                    ? `${serverUrl}${rawUrl}`
                    : rawUrl
                  : null;
                if (catId && !imageMap[catId] && url) {
                  imageMap[catId] = url;
                }
              });
              setCategoryImageMap(imageMap);
              console.log(
                "[CategoryPage] imageMap:",
                JSON.stringify(imageMap, null, 2),
              );
            })
            .catch(() => {});
        }

        props.hide();
        setLoading(false);
      })
      .catch((error) => {
        console.log({ error });
        setLoading(false);
        props.hide();
        props.alert({
          title: "Category",
          type: "error",
          message: error.message || "Failed get Category",
        });
      });
  }, [categoryType]);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 bg-white shadow-md">
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
          className="surface-overlay px-3 sm:px-7 flex align-items-center justify-content-between relative"
          style={{ minHeight: "64px" }}
        >
          {/* Left: Women / Men / Kids nav */}
          <div className="hidden lg:flex align-items-center flex-1">
            <ul className="list-none p-0 m-0 flex">
              <li className="flex flex-column lg:flex-row">
                <a
                  onClick={() => navigate("/categories/women")}
                  className="p-ripple font-medium inline-flex align-items-center cursor-pointer border-left-2 lg:border-left-none lg:border-bottom-2 border-transparent hover:border-primary py-3 lg:py-0 px-6 lg:px-3 text-700 select-none text-xl lg:text-base lg:font-base"
                >
                  <span>Women</span>
                  <Ripple />
                </a>
              </li>
              <li className="flex flex-column lg:flex-row">
                <a
                  onClick={() => navigate("/categories/men")}
                  className="p-ripple font-medium inline-flex align-items-center cursor-pointer border-left-2 lg:border-left-none lg:border-bottom-2 border-transparent hover:border-primary py-3 lg:py-0 px-6 lg:px-3 text-700 select-none text-xl lg:text-base lg:font-base"
                >
                  <span>Men</span>
                  <Ripple />
                </a>
              </li>
              <li className="flex flex-column lg:flex-row">
                <a
                  onClick={() => navigate("/categories/kids")}
                  className="p-ripple font-medium inline-flex align-items-center cursor-pointer border-left-2 lg:border-left-none lg:border-bottom-2 border-transparent hover:border-primary py-3 lg:py-0 px-6 lg:px-3 text-700 select-none text-xl lg:text-base lg:font-base"
                >
                  <span>Kids</span>
                  <Ripple />
                </a>
              </li>
            </ul>
          </div>
          {/* Center: Logo */}
          <div className="flex-1 flex align-items-center justify-content-center py-3">
            <a onClick={() => navigate("/Homepage")} className="cursor-pointer">
              <img
                src="/lightning/apple-touch-icon.png"
                alt="Image"
                height="40"
              />
            </a>
          </div>
          {/* Right: Icons */}
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
                  onClick={() => navigate("/order")}
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
      </header>

      <div className="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div className="flex justify-content-between flex-wrap">
          <div className="flex align-items-center mb-4 md:mb-0">
            <div className="text-900 font-bold text-3xl">
              {categoryType
                ? categoryType.charAt(0).toUpperCase() + categoryType.slice(1)
                : "Category"}{" "}
              Products
            </div>
            <Badge
              value={
                data.filter((item) => {
                  const typeMatch =
                    selectedTypes.length === 0 ||
                    selectedTypes.some((t) => t.name === item.type);
                  const saleMatch = !checked2 || item.isSale;
                  return typeMatch && saleMatch;
                }).length
              }
              className="ml-3 bg-gray-200 text-gray-900 p-0 border-circle"
            />
          </div>
          <div>
            <Button
              icon="pi pi-sort-alt"
              className="p-button-outlined p-button-secondary w-7rem p-2"
              iconPos="right"
              label="Sort By"
              onClick={(event) => menu.current.toggle(event)}
            />
            <Menu ref={menu} popup model={items} />
          </div>
        </div>

        <p className="text-600 text-xl"></p>
        <Divider className="w-full border-gray-200" />
        <div className="grid grid-nogutter align-items-center">
          <MultiSelect
            options={types}
            value={selectedTypes}
            onChange={(e) => setSelectedTypes(e.value)}
            placeholder="Type"
            optionLabel="name"
            filter
            maxSelectedLabels="2"
            selectedItemsLabel={`${selectedTypes && selectedTypes.length} types selected`}
            className="flex-auto lg:flex-1 mb-3 lg:mt-0 w-full mr-0 lg:mr-4 text-900"
          />
          <MultiSelect
            options={colors}
            value={selectedColors}
            onChange={(e) => setSelectedColors(e.value)}
            placeholder="Color"
            optionLabel="name"
            filter
            maxSelectedLabels="2"
            selectedItemsLabel={`${selectedColors && selectedColors.length} colors selected`}
            className="flex-auto lg:flex-1 mb-3 lg:mt-0 w-full mr-0 lg:mr-4 text-900"
            itemTemplate={(color) => (
              <div className="flex align-items-center">
                <div
                  className={`w-2rem h-2rem border-circle ${color.class} cursor-pointer border-none`}
                ></div>
                <div className="text-900 ml-2">{color.name}</div>
              </div>
            )}
          />
          <MultiSelect
            options={prices}
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.value)}
            placeholder="Price"
            optionLabel="range"
            filter
            maxSelectedLabels="2"
            selectedItemsLabel={`${selectedPrice && selectedPrice.length} prices selected`}
            className="flex-auto lg:flex-1 mb-3 lg:mt-0 w-full mr-0 lg:mr-4 text-900"
          />
          <ToggleButton
            checked={checked1}
            onChange={(e) => setChecked1(e.value)}
            onLabel="Sustainable"
            offLabel="Unsustainable"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            className="mb-3 lg:mt-0 mr-4 flex-shrink-0 w-12rem"
          />
          <ToggleButton
            checked={checked2}
            onChange={(e) => setChecked2(e.value)}
            onLabel="Sale"
            offLabel="Not Sale"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            className="mb-3 lg:mt-0 mr-4 flex-shrink-0 w-9rem"
          />
          <a
            tabIndex="0"
            className="p-ripple cursor-pointer flex align-items-center mb-3 lg:mt-0 text-900"
            onClick={() => {
              setSelectedTypes([]);
              setSelectedColors([]);
              setSelectedPrice([]);
              setChecked1(false);
              setChecked2(false);
            }}
          >
            Clear All
            <Ripple />
          </a>
          <div className="col-12">
            <div className="grid mt-4">
              {loading && (
                <div className="col-12 text-center py-5">
                  <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
                </div>
              )}
              {!loading && data.length === 0 && (
                <div className="col-12 text-center py-5">
                  <p className="text-500 text-xl">No categories found.</p>
                </div>
              )}
              {data
                .filter((item) => {
                  const typeMatch =
                    selectedTypes.length === 0 ||
                    selectedTypes.some((t) => t.name === item.type);
                  const saleMatch = !checked2 || item.isSale;
                  return typeMatch && saleMatch;
                })
                .map((item) => (
                  <div key={item._id} className="col-12 md:col-6 lg:col-3 mb-5">
                    <div className="mb-3 relative">
                      <Link to={`/product?category=${item._id}`}>
                        <img
                          src={
                            categoryImageMap[item._id] ||
                            "/photo/productlist/product-list-2-1.png"
                          }
                          className="w-full"
                          alt={item.type || "category"}
                          onError={(e) => {
                            e.target.src =
                              "/photo/productlist/product-list-2-1.png";
                          }}
                        />
                      </Link>
                      {item.isSale && (
                        <span
                          className="absolute bg-red-500 text-white text-xs font-bold px-2 py-1 border-round"
                          style={{ top: "0.75rem", left: "0.75rem" }}
                        >
                          SALE
                        </span>
                      )}
                      <button
                        type="button"
                        className="p-ripple border-1 border-white-alpha-20 border-round py-2 px-3 absolute bg-black-alpha-30 text-white inline-flex align-items-center justify-content-center hover:bg-black-alpha-40 transition-colors transition-duration-300 cursor-pointer font-semibold"
                        style={{
                          bottom: "1rem",
                          left: "1rem",
                          width: "calc(100% - 2rem)",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        <i className="pi pi-shopping-cart mr-3 text-base"></i>
                        <span className="text-base">Add to Cart</span>
                        <Ripple />
                      </button>
                    </div>
                    <div className="flex flex-column align-items-center">
                      <Link
                        to={`/product?category=${item._id}`}
                        className="text-xl text-900 font-medium mb-2 text-center"
                      >
                        {item.type || "Category"}
                      </Link>
                      {item.category && (
                        <span className="text-500 text-sm mb-2">
                          {item.category}
                        </span>
                      )}
                      <div className="flex align-items-center gap-2 mb-2">
                        {item.gender && (
                          <span className="text-500 text-sm capitalize">
                            {item.gender}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <Divider className="w-full border-gray-200 m-0" />
      <div className="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-nogutter flex-wrap p-2 lg:p-4 bg-cyan-50 border-round mb-4 text-center lg:text-left">
          <div className="col-12 lg:col-6 p-4 flex flex-column justify-content-center">
            <span className="text-3xl block text-cyan-900 font-bold">
              Get Deals and Updates from Peak
            </span>
            <span className="block text-cyan-600 mt-3">
              We promise for not sending spam emails. Itâ€™ll only good emails.
            </span>
            <div
              className="p-inputgroup relative mt-4"
              style={{ borderRadius: "30px", maxWidth: "90%" }}
            >
              <InputText
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Email"
                style={{ borderRadius: "30px", height: "3.5rem" }}
                className="bg-white-alpha-90 text-black-alpha-90 px-4 border-cyan-100"
              />
              <Button
                type="button"
                label="Subscribe"
                className="bg-cyan-500 border-none absolute text-white"
                style={{
                  borderRadius: "30px",
                  right: "8px",
                  top: "8px",
                  height: "2.5rem",
                  zIndex: "1",
                }}
              />
            </div>
          </div>
          <div className="col-12 lg:col-6 p-4">
            <div
              className="w-full h-full bg-no-repeat bg-center bg-cover p-5"
              style={{
                background: "url(/photo/categorypage/categorypage-1-1.png)",
                borderRadius: "30px",
              }}
            >
              <span className="text-cyan-500 font-bold block">
                Exclusive Peak Club
              </span>
              <span className="text-white text-xl font-bold block mt-3 line-height-3">
                Join Exlusive Peak Club for free shipping, premium service and
                deals.
              </span>
              <Button
                type="button"
                label="Get Your Card Today"
                className="bg-cyan-500 border-none w-full mt-3 text-white"
                style={{ borderRadius: "30px" }}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-nogutter text-center sm:text-left flex-wrap mt-8">
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
            Â© 2022, Peak. Powered by PrimeBlocks.
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

export default connect(mapState, mapDispatch)(CategoryPage1);
