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

const SingleOrderProductPage = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const [_entity, set_entity] = useState({});
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);

  const [productName, setProductName] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [unitPrice, setUnitPrice] = useState([]);
  const [orderNumber, setOrderNumber] = useState([]);

  useEffect(() => {
    //on mount
    client
      .service("orderProduct")
      .get(urlParams.singleOrderProductId, {
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
            "productName",
            "quantity",
            "selectedColor",
            "selectedSize",
            "unitPrice",
            "orderNumber",
          ],
        },
      })
      .then((res) => {
        set_entity(res || {});
        const productName = Array.isArray(res.productName)
          ? res.productName.map((elem) => ({
              _id: elem._id,
              productTitle: elem.productTitle,
            }))
          : res.productName
            ? [
                {
                  _id: res.productName._id,
                  productTitle: res.productName.productTitle,
                },
              ]
            : [];
        setProductName(productName);
        const quantity = Array.isArray(res.quantity)
          ? res.quantity.map((elem) => ({
              _id: elem._id,
              quantity: elem.quantity,
            }))
          : res.quantity
            ? [{ _id: res.quantity._id, quantity: res.quantity.quantity }]
            : [];
        setQuantity(quantity);
        const selectedColor = Array.isArray(res.selectedColor)
          ? res.selectedColor.map((elem) => ({
              _id: elem._id,
              colorName: elem.colorName,
            }))
          : res.selectedColor
            ? [
                {
                  _id: res.selectedColor._id,
                  colorName: res.selectedColor.colorName,
                },
              ]
            : [];
        setSelectedColor(selectedColor);
        const selectedSize = Array.isArray(res.selectedSize)
          ? res.selectedSize.map((elem) => ({
              _id: elem._id,
              sizeValue: elem.sizeValue,
            }))
          : res.selectedSize
            ? [
                {
                  _id: res.selectedSize._id,
                  sizeValue: res.selectedSize.sizeValue,
                },
              ]
            : [];
        setSelectedSize(selectedSize);
        const unitPrice = Array.isArray(res.unitPrice)
          ? res.unitPrice.map((elem) => ({
              _id: elem._id,
              basePrice: elem.basePrice,
            }))
          : res.unitPrice
            ? [{ _id: res.unitPrice._id, basePrice: res.unitPrice.basePrice }]
            : [];
        setUnitPrice(unitPrice);
        const orderNumber = Array.isArray(res.orderNumber)
          ? res.orderNumber.map((elem) => ({
              _id: elem._id,
              orderNumber: elem.orderNumber,
            }))
          : res.orderNumber
            ? [
                {
                  _id: res.orderNumber._id,
                  orderNumber: res.orderNumber.orderNumber,
                },
              ]
            : [];
        setOrderNumber(orderNumber);
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "OrderProduct",
          type: "error",
          message: error.message || "Failed get orderProduct",
        });
      });
  }, [props, urlParams.singleOrderProductId]);

  const goBack = () => {
    navigate("/app/orderProduct");
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
              <h3 className="m-0">Order Product</h3>
              <SplitButton
                model={menuItems.filter(
                  (m) => !(m.icon === "pi pi-trash" && items?.length === 0),
                )}
                dropdownIcon="pi pi-ellipsis-h"
                buttonClassName="hidden"
                menuButtonClassName="ml-1 p-button-text"
              />
            </div>

            {/* <p>orderProduct/{urlParams.singleOrderProductId}</p> */}
          </div>
          <div className="card w-full">
            <div className="grid ">
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Product Name</label>
                {productName.map((elem) => (
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
                <label className="text-sm text-gray-600">Quantity</label>
                {quantity.map((elem) => (
                  <Link key={elem._id} to={`/items/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.quantity}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Selected Color</label>
                {selectedColor.map((elem) => (
                  <Link key={elem._id} to={`/productColor/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.colorName}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Selected Size</label>
                {selectedSize.map((elem) => (
                  <Link key={elem._id} to={`/productSize/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.sizeValue}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Unit Price</label>
                {unitPrice.map((elem) => (
                  <Link key={elem._id} to={`/productPrice/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.basePrice}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Order Number</label>
                {orderNumber.map((elem) => (
                  <Link key={elem._id} to={`/checkout/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.orderNumber}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="col-12">&nbsp;</div>
            </div>
          </div>
        </div>

        <CommentsSection
          recordId={urlParams.singleOrderProductId}
          user={props.user}
          alert={props.alert}
          serviceName="orderProduct"
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

export default connect(mapState, mapDispatch)(SingleOrderProductPage);
