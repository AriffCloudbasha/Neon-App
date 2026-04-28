import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { SplitButton } from "primereact/splitbutton";
import client from "../../../services/restClient";
import CommentsSection from "../../common/CommentsSection";
import ProjectLayout from "../../Layouts/ProjectLayout";

import ItemsPage from "../ItemsPage/ItemsPage";
import OrderProductPage from "../OrderProductPage/OrderProductPage";
import UploadFilesToS3 from "../../../services/UploadFilesToS3";

const SingleProductPage = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const [_entity, set_entity] = useState({});
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);

  const [productColour, setProductColour] = useState([]);
  const [productPrice, setProductPrice] = useState([]);
  const [productSize, setProductSize] = useState([]);
  const [productRating, setProductRating] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    //on mount
    client
      .service("product")
      .get(urlParams.singleProductId, {
        query: {
          $populate: [
            {
              path: "createdBy",
              service: "users",
              select: ["name"],
            },
            {
              path: "updatedBy",
              service: "users",
              select: ["name"],
            },
            "productColour",
            "productPrice",
            "productSize",
            "productRating",
            "category",
          ],
        },
      })
      .then((res) => {
        set_entity(res || {});
        const productColour = Array.isArray(res.productColour)
          ? res.productColour.map((elem) => ({
              _id: elem._id,
              colorName: elem.colorName,
            }))
          : res.productColour
            ? [
                {
                  _id: res.productColour._id,
                  colorName: res.productColour.colorName,
                },
              ]
            : [];
        setProductColour(productColour);
        const productPrice = Array.isArray(res.productPrice)
          ? res.productPrice.map((elem) => ({
              _id: elem._id,
              basePrice: elem.basePrice,
            }))
          : res.productPrice
            ? [
                {
                  _id: res.productPrice._id,
                  basePrice: res.productPrice.basePrice,
                },
              ]
            : [];
        setProductPrice(productPrice);
        const productSize = Array.isArray(res.productSize)
          ? res.productSize.map((elem) => ({
              _id: elem._id,
              sizeCategory: elem.sizeCategory,
            }))
          : res.productSize
            ? [
                {
                  _id: res.productSize._id,
                  sizeCategory: res.productSize.sizeCategory,
                },
              ]
            : [];
        setProductSize(productSize);
        const productRating = Array.isArray(res.productRating)
          ? res.productRating.map((elem) => ({
              _id: elem._id,
              starRating: elem.starRating,
            }))
          : res.productRating
            ? [
                {
                  _id: res.productRating._id,
                  starRating: res.productRating.starRating,
                },
              ]
            : [];
        setProductRating(productRating);
        const category = Array.isArray(res.category)
          ? res.category.map((elem) => ({ _id: elem._id, type: elem.type }))
          : res.category
            ? [{ _id: res.category._id, type: res.category.type }]
            : [];
        setCategory(category);
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "Product",
          type: "error",
          message: error.message || "Failed get product",
        });
      });
  }, [props, urlParams.singleProductId]);

  const goBack = () => {
    navigate("/app/product");
  };

  const toggleHelpSidebar = () => {
    setHelpSidebarVisible(!isHelpSidebarVisible);
  };

  const copyPageLink = () => {
    const currentUrl = window.location.href;

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        props.alert({
          title: "Link Copied",
          type: "success",
          message: "Page link copied to clipboard!",
        });
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        props.alert({
          title: "Error",
          type: "error",
          message: "Failed to copy page link.",
        });
      });
  };

  const menuItems = [
    {
      label: "Copy link",
      icon: "pi pi-copy",
      command: () => copyPageLink(),
    },
    {
      label: "Help",
      icon: "pi pi-question-circle",
      command: () => toggleHelpSidebar(),
    },
  ];

  return (
    <ProjectLayout>
      <div className="col-12 flex flex-column align-items-center">
        <div className="col-12">
          <div className="flex align-items-center justify-content-between">
            <div className="flex align-items-center">
              <Button
                className="p-button-text"
                icon="pi pi-chevron-left"
                onClick={() => goBack()}
              />
              <h3 className="m-0">Product</h3>
              <SplitButton
                model={menuItems.filter(
                  (m) => !(m.icon === "pi pi-trash" && items?.length === 0),
                )}
                dropdownIcon="pi pi-ellipsis-h"
                buttonClassName="hidden"
                menuButtonClassName="ml-1 p-button-text"
              />
            </div>

            {/* <p>product/{urlParams.singleProductId}</p> */}
          </div>
          <div className="card w-full">
            <div className="grid ">
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Product Title</label>
                <p className="m-0 ml-3">{_entity?.productTitle}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Description</label>
                <p className="m-0 ml-3">{_entity?.description}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">sku</label>
                <p className="m-0 ml-3">{_entity?.sku}</p>
              </div>
              <div className="col-12">
                <label className="text-sm text-gray-600">Product Image</label>
                <div className="m-0 ml-3">
                  <UploadFilesToS3 type={"single"} />
                </div>
              </div>
              <div className="col-12">
                <label className="text-sm text-gray-600">Small Image</label>
                <div className="m-0 ml-3">
                  <UploadFilesToS3 type={"single"} />
                </div>
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Product Colour</label>
                {productColour.map((elem) => (
                  <Link key={elem._id} to={`/productColor/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.colorName}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Product Price</label>
                {productPrice.map((elem) => (
                  <Link key={elem._id} to={`/productPrice/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.basePrice}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Product Size</label>
                {productSize.map((elem) => (
                  <Link key={elem._id} to={`/productSize/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">
                        {elem.sizeCategory}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Product Rating</label>
                {productRating.map((elem) => (
                  <Link key={elem._id} to={`/productRating/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.starRating}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Category</label>
                {category.map((elem) => (
                  <Link key={elem._id} to={`/category/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.type}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="col-12">&nbsp;</div>
            </div>
          </div>
        </div>

        <div className="col-12 mt-2">
          <TabView>
            <TabPanel header="Items" leftIcon="pi pi-building-columns mr-2">
              <ItemsPage />
            </TabPanel>

            <TabPanel
              header="Order Product"
              leftIcon="pi pi-building-columns mr-2"
            >
              <OrderProductPage />
            </TabPanel>
          </TabView>
        </div>

        <CommentsSection
          recordId={urlParams.singleProductId}
          user={props.user}
          alert={props.alert}
          serviceName="product"
        />
        <div
          id="rightsidebar"
          className={classNames(
            "overlay-auto z-1 surface-overlay shadow-2 absolute right-0 w-20rem animation-duration-150 animation-ease-in-out",
            { hidden: !isHelpSidebarVisible },
          )}
          style={{ top: "60px", height: "calc(100% - 60px)" }}
        >
          <div className="flex flex-column h-full p-4">
            <span className="text-xl font-medium text-900 mb-3">Help bar</span>
            <div className="border-2 border-dashed surface-border border-round surface-section flex-auto"></div>
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SingleProductPage);
