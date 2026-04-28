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

import { InputNumber } from "primereact/inputnumber";

const SingleCartPage = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const [_entity, set_entity] = useState({});
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);

  const [customerName, setCustomerName] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    //on mount
    client
      .service("cart")
      .get(urlParams.singleCartId, {
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
            "customerName",
            "items",
          ],
        },
      })
      .then((res) => {
        set_entity(res || {});
        const customerName = Array.isArray(res.customerName)
          ? res.customerName.map((elem) => ({
              _id: elem._id,
              customers: elem.customers,
            }))
          : res.customerName
            ? [
                {
                  _id: res.customerName._id,
                  customers: res.customerName.customers,
                },
              ]
            : [];
        setCustomerName(customerName);
        const items = Array.isArray(res.items)
          ? res.items.map((elem) => ({
              _id: elem._id,
              productName: elem.productName,
            }))
          : res.items
            ? [{ _id: res.items._id, productName: res.items.productName }]
            : [];
        setItems(items);
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "Cart",
          type: "error",
          message: error.message || "Failed get cart",
        });
      });
  }, [props, urlParams.singleCartId]);

  const goBack = () => {
    navigate("/app/cart");
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
              <h3 className="m-0">Cart</h3>
              <SplitButton
                model={menuItems.filter(
                  (m) => !(m.icon === "pi pi-trash" && items?.length === 0),
                )}
                dropdownIcon="pi pi-ellipsis-h"
                buttonClassName="hidden"
                menuButtonClassName="ml-1 p-button-text"
              />
            </div>

            {/* <p>cart/{urlParams.singleCartId}</p> */}
          </div>
          <div className="card w-full">
            <div className="grid ">
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Subtotal</label>
                <p className="m-0 ml-3">
                  <InputNumber
                    id="subtotal"
                    value={Number(_entity?.subtotal)}
                    mode="currency"
                    currency="MYR"
                    locale="en-US"
                    disabled={true}
                  />
                </p>
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Total</label>
                <p className="m-0 ml-3">
                  <InputNumber
                    id="total"
                    value={Number(_entity?.total)}
                    mode="currency"
                    currency="MYR"
                    locale="en-US"
                    disabled={true}
                  />
                </p>
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Tax</label>
                <p className="m-0 ml-3">
                  <InputNumber
                    id="tax"
                    value={Number(_entity?.tax)}
                    mode="currency"
                    currency="MYR"
                    locale="en-US"
                    disabled={true}
                  />
                </p>
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Customer Name</label>
                {customerName.map((elem) => (
                  <Link key={elem._id} to={`/customerDetails/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.customers}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Items</label>
                {items.map((elem) => (
                  <Link key={elem._id} to={`/cartItems/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.productName}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="col-12">&nbsp;</div>
            </div>
          </div>
        </div>

        <CommentsSection
          recordId={urlParams.singleCartId}
          user={props.user}
          alert={props.alert}
          serviceName="cart"
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

export default connect(mapState, mapDispatch)(SingleCartPage);
