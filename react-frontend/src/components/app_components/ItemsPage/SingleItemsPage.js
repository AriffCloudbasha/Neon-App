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

import OrderProductPage from "../OrderProductPage/OrderProductPage";

const SingleItemsPage = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const [_entity, set_entity] = useState({});
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);

  const [sku, setSku] = useState([]);
  const [product, setProduct] = useState([]);
  const [productPrice, setProductPrice] = useState([]);

  useEffect(() => {
    //on mount
    client
      .service("items")
      .get(urlParams.singleItemsId, {
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
            "sku",
            "product",
            "productPrice",
          ],
        },
      })
      .then((res) => {
        set_entity(res || {});
        const sku = Array.isArray(res.sku)
          ? res.sku.map((elem) => ({ _id: elem._id, sku: elem.sku }))
          : res.sku
            ? [{ _id: res.sku._id, sku: res.sku.sku }]
            : [];
        setSku(sku);
        const product = Array.isArray(res.product)
          ? res.product.map((elem) => ({
              _id: elem._id,
              productTitle: elem.productTitle,
            }))
          : res.product
            ? [{ _id: res.product._id, productTitle: res.product.productTitle }]
            : [];
        setProduct(product);
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
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "Items",
          type: "error",
          message: error.message || "Failed get items",
        });
      });
  }, [props, urlParams.singleItemsId]);

  const goBack = () => {
    navigate("/app/items");
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
              <h3 className="m-0">Items</h3>
              <SplitButton
                model={menuItems.filter(
                  (m) => !(m.icon === "pi pi-trash" && items?.length === 0),
                )}
                dropdownIcon="pi pi-ellipsis-h"
                buttonClassName="hidden"
                menuButtonClassName="ml-1 p-button-text"
              />
            </div>

            {/* <p>items/{urlParams.singleItemsId}</p> */}
          </div>
          <div className="card w-full">
            <div className="grid ">
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Quantity</label>
                <p className="m-0 ml-3">{_entity?.quantity}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Amount</label>
                <p className="m-0 ml-3">{_entity?.amount}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">sku</label>
                {sku.map((elem) => (
                  <Link key={elem._id} to={`/product/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.sku}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Product</label>
                {product.map((elem) => (
                  <Link key={elem._id} to={`/product/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">
                        {elem.productTitle}
                      </p>
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

              <div className="col-12">&nbsp;</div>
            </div>
          </div>
        </div>

        <div className="col-12 mt-2">
          <TabView>
            <TabPanel
              header="Order Product"
              leftIcon="pi pi-building-columns mr-2"
            >
              <OrderProductPage />
            </TabPanel>
          </TabView>
        </div>

        <CommentsSection
          recordId={urlParams.singleItemsId}
          user={props.user}
          alert={props.alert}
          serviceName="items"
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

export default connect(mapState, mapDispatch)(SingleItemsPage);
