import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import classNames from "classnames";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Ripple } from "primereact/ripple";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
import client from "../../../services/restClient";

const ProductPage1 = (props) => {
  const navigate = useNavigate();
  const { productId, categoryId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [color, setColor] = useState("bluegray");
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const images = [
    "lightning/NikeAirmax.jpeg",
    "lightning/Necklace.jpg",
    "lightning/Fendi.jpeg",
  ];

  const singleProduct = data.length > 0 ? data[0] : null;

  const colorOptions = [
    { name: "Black", code: "#000000" },
    { name: "White", code: "#FFFFFF" },
    { name: "Red", code: "#FF0000" },
    { name: "Blue", code: "#007BFF" },
    { name: "Green", code: "#28a745" },
    { name: "Yellow", code: "#ffc107" },
    { name: "Purple", code: "#6f42c1" },
    { name: "Orange", code: "#fd7e14" },
    { name: "Gray", code: "#6c757d" },
    { name: "Pink", code: "#e83e8c" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId, categoryId]);

  useEffect(() => {
    setLoading(true);
    props.show();
    if (productId) {
      client
        .service("product")
        .get(productId, {
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
              { path: "productColour", service: "product_colour" },
              { path: "productSize", service: "product_size" },
              { path: "productRating", service: "product_rating" },
            ],
          },
        })
        .then((res) => {
          setData([res]);
          // Auto-select the first available size
          const ps = res?.productSize;
          if (ps) {
            const sizeArr = Array.isArray(ps) ? ps : [ps];
            if (sizeArr.length > 0) {
              const first = sizeArr[0];
              const firstSize =
                first.sizeCategory && first.sizeValue
                  ? `${first.sizeCategory} ${first.sizeValue}`
                  : first.sizeName || JSON.stringify(first);
              setSize(firstSize);
            }
          }
          props.hide();
          setLoading(false);
        })
        .catch((error) => {
          console.log({ error });
          setLoading(false);
          props.hide();
        });
    } else {
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
          setData(res.data);
          props.hide();
          setLoading(false);
        })
        .catch((error) => {
          console.log({ error });
          setLoading(false);
          props.hide();
        });
    }
  }, [productId, categoryId]);

  const handleAddToCart = async () => {
    try {
      // Extract basePrice string — productPrice is a single populated object (one-to-one)
      let rawPrice =
        typeof singleProduct?.productPrice === "object" &&
        !Array.isArray(singleProduct?.productPrice)
          ? singleProduct.productPrice?.basePrice
          : Array.isArray(singleProduct?.productPrice)
            ? singleProduct.productPrice[0]?.basePrice
            : null;

      // Strip any non-numeric characters (e.g. "RM ", " MYR") then parse
      const currentPrice =
        parseFloat(String(rawPrice ?? "0").replace(/[^0-9.]/g, "")) || 0;

      console.log("Add to cart — rawPrice:", rawPrice, "parsed:", currentPrice);

      await client.service("cartItems").create({
        productName:
          singleProduct?.productTitle ||
          singleProduct?.name ||
          "Awesome Product",
        price: currentPrice,
        quantity: quantity,
        size: size,
        createdBy: props.user?._id,
        updatedBy: props.user?._id,
      });

      if (props.alert) {
        props.alert({
          title: "Success",
          type: "success",
          message: "Added to cart!",
        });
      }

      navigate("/cart");
    } catch (error) {
      console.error("Cart error:", error);
      if (props.alert) {
        props.alert({
          title: "Error",
          type: "error",
          message: "Could not add to cart.",
        });
      }
    }
  };

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
      </header>

      <div style={{ paddingTop: "110px" }}>
        {loading ? (
          <div className="flex justify-content-center align-items-center min-h-screen">
            <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
          </div>
        ) : data.length === 0 ? (
          <div className="flex justify-content-center align-items-center min-h-screen">
            <span className="text-500 text-xl">No products found.</span>
          </div>
        ) : (
          <>
            {/* Single Product View */}
            {productId && singleProduct && (
              <div className="grid my-4 px-4 lg:px-8">
                {/* Left Column: Images */}
                <div className="col-12 lg:col-6">
                  <div className="flex">
                    {/* THUMBNAILS */}
                    <div className="flex flex-column w-2 justify-content-between">
                      {[0, 1, 2].map((i) => (
                        <img
                          src="/lightning/NikeAirmax.jpeg"
                          key={i}
                          className={classNames(
                            "w-full cursor-pointer border-2 border-round border-transparent transition-colors transition-duration-150 mb-2",
                            { "border-primary": selectedImageIndex === i },
                          )}
                          onClick={() => setSelectedImageIndex(i)}
                          alt="thumbnail"
                        />
                      ))}
                    </div>

                    {/* MAIN LARGE IMAGE */}
                    <div className="pl-3 w-10">
                      <img
                        src="/lightning/NikeAirmax.jpeg"
                        className="w-full border-round"
                        alt="main-product"
                      />
                    </div>
                  </div>
                </div>
                {/* Right Column: Product Info */}
                <div className="col-12 lg:col-6 py-3 lg:pl-6">
                  <div className="flex align-items-center text-3xl font-medium text-900 mb-4">
                    {singleProduct.productTitle ||
                      singleProduct.name ||
                      "Unknown Product"}
                  </div>
                  <div className="flex align-items-center justify-content-between mb-5">
                    {/* FIXED: Dynamic array handling for UI Price */}
                    <span className="text-900 font-medium text-3xl block">
                      {" "}
                      {Array.isArray(singleProduct?.productPrice)
                        ? singleProduct.productPrice[0]?.basePrice || "0.00"
                        : singleProduct?.productPrice?.basePrice || "0.00"}
                    </span>
                    <div className="flex align-items-center mb-5">
                      <span className="mr-3">
                        {[1, 2, 3, 4, 5].map((star) => {
                          let rating = 0;
                          if (
                            typeof singleProduct?.productRating === "number"
                          ) {
                            rating = singleProduct.productRating;
                          } else if (
                            singleProduct?.productRating &&
                            typeof singleProduct.productRating === "object"
                          ) {
                            if (Array.isArray(singleProduct.productRating)) {
                              rating =
                                singleProduct.productRating[0]?.starRating || 0;
                            } else {
                              rating =
                                singleProduct.productRating.starRating || 0;
                            }
                          }
                          const isFilled = star <= rating;
                          return (
                            <i
                              key={star}
                              className={classNames("pi mr-1", {
                                "pi-star-fill text-yellow-500": isFilled,
                                "pi-star text-700": !isFilled,
                              })}
                            ></i>
                          );
                        })}
                      </span>
                      <span className="text-sm text-black font-bold">
                        <b className="text-900 mr-1">
                          {(() => {
                            if (
                              typeof singleProduct?.productRating === "number"
                            ) {
                              return singleProduct.productRating;
                            } else if (
                              singleProduct?.productRating &&
                              typeof singleProduct.productRating === "object"
                            ) {
                              if (Array.isArray(singleProduct.productRating)) {
                                return (
                                  singleProduct.productRating[0]?.starRating ||
                                  0
                                );
                              } else {
                                return (
                                  singleProduct.productRating.starRating || 0
                                );
                              }
                            }
                            return 0;
                          })()}
                        </b>{" "}
                        / 5 reviews
                      </span>
                    </div>
                  </div>
                  {/* Color */}
                  <div className="font-bold text-900 mb-2">Color</div>
                  <div className="flex align-items-center mb-5">
                    {(() => {
                      let colorName = "N/A";
                      let colorCode = "#ccc";
                      let colorObj = null;

                      if (singleProduct?.productColour) {
                        if (typeof singleProduct.productColour === "string") {
                          colorName = singleProduct.productColour;
                          const found = colorOptions.find(
                            (c) =>
                              c.name.toLowerCase() === colorName.toLowerCase(),
                          );
                          if (found) colorCode = found.code;
                        } else if (
                          typeof singleProduct.productColour === "object"
                        ) {
                          if (Array.isArray(singleProduct.productColour)) {
                            colorObj = singleProduct.productColour[0];
                          } else {
                            colorObj = singleProduct.productColour;
                          }
                          if (colorObj) {
                            colorName =
                              colorObj.colorName ||
                              colorObj.colourName ||
                              "N/A";
                            colorCode =
                              colorObj.colorCode ||
                              colorObj.colourCode ||
                              colorCode;
                            const found = colorOptions.find(
                              (c) =>
                                c.name.toLowerCase() ===
                                colorName.toLowerCase(),
                            );
                            if (found) colorCode = found.code;
                          }
                        }
                      }
                      return (
                        <div className="flex align-items-center">
                          <span
                            style={{
                              display: "inline-block",
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              background: colorCode,
                              border: "1px solid #000",
                              marginRight: 8,
                            }}
                            title={colorName}
                          ></span>
                          <span className="text-900">{colorName}</span>
                        </div>
                      );
                    })()}
                  </div>
                  {/* Size */}
                  <div className="mb-2 flex align-items-center justify-content-between">
                    <span className="font-bold text-900">Size</span>
                    <a
                      tabIndex="0"
                      className="cursor-pointer text-600 text-sm flex align-items-center"
                    >
                      Size Guide <i className="ml-1 pi pi-angle-right"></i>
                    </a>
                  </div>
                  <div className="grid grid-nogutter align-items-center mb-5">
                    {/* FIXED: Size selection is now clickable and highlights state */}
                    {(() => {
                      if (!singleProduct?.productSize) return <div>N/A</div>;

                      let sizeArray = [];
                      if (Array.isArray(singleProduct.productSize)) {
                        sizeArray = singleProduct.productSize;
                      } else if (
                        typeof singleProduct.productSize === "string"
                      ) {
                        sizeArray = [{ sizeName: singleProduct.productSize }];
                      } else {
                        sizeArray = [singleProduct.productSize];
                      }

                      return sizeArray.map((sizeObj, idx) => {
                        const displaySize =
                          sizeObj.sizeCategory && sizeObj.sizeValue
                            ? `${sizeObj.sizeCategory} ${sizeObj.sizeValue}`
                            : sizeObj.sizeName || JSON.stringify(sizeObj);

                        const isSelected = size === displaySize;

                        return (
                          <div
                            key={idx}
                            onClick={() => setSize(displaySize)}
                            className={classNames(
                              "col-auto h-3rem border-2 font-bold inline-flex justify-content-center align-items-center flex-shrink-0 border-round px-4 cursor-pointer mr-2 mb-2 transition-colors",
                              {
                                "border-blue-500 text-blue-500 hover:surface-100":
                                  !isSelected,
                                "surface-blue-500 border-black text-orange-700 hover:surface-orange-100":
                                  isSelected,
                              },
                            )}
                          >
                            {displaySize}
                          </div>
                        );
                      });
                    })()}
                  </div>
                  {/* Quantity & Cart */}
                  <div className="font-bold text-900 mb-3">Quantity</div>
                  <div className="flex flex-column sm:flex-row sm:align-items-center sm:justify-content-between">
                    <InputNumber
                      showButtons
                      buttonLayout="horizontal"
                      min={1}
                      inputClassName="w-3rem text-center"
                      value={quantity}
                      onChange={(e) => setQuantity(e.value)}
                      decrementButtonClassName="p-button-text"
                      incrementButtonClassName="p-button-text"
                      incrementButtonIcon="pi pi-minus"
                      decrementButtonIcon="pi pi-plus"
                    />
                    <div className="flex align-items-center flex-1 mt-3 sm:mt-0 ml-0 sm:ml-5">
                      <Button
                        label="Add to Cart"
                        className="flex-1 mr-5"
                        onClick={handleAddToCart}
                      />
                      <i
                        className={classNames("pi text-2xl cursor-pointer", {
                          "pi-heart text-600": !liked,
                          "pi-heart-fill text-orange-500": liked,
                        })}
                        onClick={() => setLiked(!liked)}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Product List View (Category) */}
            {!productId && (
              <div className="grid my-4 px-4 lg:px-8">
                {data.map((product) => {
                  // Ensure correct price display on the grid list as well
                  let gridPrice = "0.00";
                  if (Array.isArray(product?.productPrice)) {
                    gridPrice = product.productPrice[0]?.basePrice || "0.00";
                  } else {
                    gridPrice = product?.productPrice?.basePrice || "0.00";
                  }

                  return (
                    <div
                      key={product._id}
                      className="col-12 sm:col-6 md:col-4 lg:col-3 p-3"
                    >
                      <Link
                        to={`/product/${product._id}`}
                        className="text-none"
                      >
                        <div className="surface-card shadow-2 border-round p-4 cursor-pointer hover:shadow-4 transition-all transition-duration-300">
                          <img
                            src="/lightning/NikeAirMax.jpeg"
                            alt="product"
                            className="w-full mb-3 border-round"
                          />
                          <div className="text-xl text-900 font-medium mb-2">
                            {product.productTitle ||
                              product.title ||
                              product.name ||
                              "Unknown Product"}
                          </div>
                          <div className="text-primary text-lg font-bold">
                            RM {gridPrice}
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
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
