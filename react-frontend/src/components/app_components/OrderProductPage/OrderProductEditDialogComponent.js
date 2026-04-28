/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

const getSchemaValidationErrorsStrings = (errorObj) => {
  let errMsg = {};
  for (const key in errorObj.errors) {
    if (Object.hasOwnProperty.call(errorObj.errors, key)) {
      const element = errorObj.errors[key];
      if (element?.message) {
        errMsg.push(element.message);
      }
    }
  }
  return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const OrderProductEditDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [productName, setProductName] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [unitPrice, setUnitPrice] = useState([]);
  const [orderNumber, setOrderNumber] = useState([]);

  useEffect(() => {
    set_entity(props.entity);
  }, [props.entity, props.show]);

  useEffect(() => {
    //on mount product
    client
      .service("product")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleProductId,
        },
      })
      .then((res) => {
        setProductName(
          res.data.map((e) => {
            return { name: e["productTitle"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "Product",
          type: "error",
          message: error.message || "Failed get product",
        });
      });
  }, []);
  useEffect(() => {
    //on mount items
    client
      .service("items")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleItemsId,
        },
      })
      .then((res) => {
        setQuantity(
          res.data.map((e) => {
            return { name: e["quantity"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "Items",
          type: "error",
          message: error.message || "Failed get items",
        });
      });
  }, []);
  useEffect(() => {
    //on mount productColor
    client
      .service("productColor")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleProductColorId,
        },
      })
      .then((res) => {
        setSelectedColor(
          res.data.map((e) => {
            return { name: e["colorName"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "ProductColor",
          type: "error",
          message: error.message || "Failed get productColor",
        });
      });
  }, []);
  useEffect(() => {
    // on mount productSize
    client
      .service("productSize")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
        },
      })
      .then((res) => {
        setSelectedSize(
          res.data.map((e) => {
            return {
              sizeValue: `${e["sizeValue"]}`,
              sizeCategory: `${e["sizeCategory"]}`,
              value: e._id,
            };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "ProductSize",
          type: "error",
          message: error.message || "Failed get productSize",
        });
      });
  }, []);
  useEffect(() => {
    //on mount productPrice
    client
      .service("productPrice")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleProductPriceId,
        },
      })
      .then((res) => {
        setUnitPrice(
          res.data.map((e) => {
            return { name: e["basePrice"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "ProductPrice",
          type: "error",
          message: error.message || "Failed get productPrice",
        });
      });
  }, []);
  useEffect(() => {
    //on mount checkout
    client
      .service("checkout")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleCheckoutId,
        },
      })
      .then((res) => {
        setOrderNumber(
          res.data.map((e) => {
            return { name: e["orderNumber"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "Checkout",
          type: "error",
          message: error.message || "Failed get checkout",
        });
      });
  }, []);

  const onSave = async () => {
    let _data = {
      productName: _entity?.productName?._id,
      quantity: _entity?.quantity?._id,
      selectedColor: _entity?.selectedColor?._id,
      selectedSize: _entity?.selectedSize?._id,
      unitPrice: _entity?.unitPrice?._id,
      orderNumber: _entity?.orderNumber?._id,
    };

    setLoading(true);
    try {
      await client.service("orderProduct").patch(_entity._id, _data);
      const eagerResult = await client.service("orderProduct").find({
        query: {
          $limit: 10000,
          _id: { $in: [_entity._id] },
          $populate: [
            {
              path: "productName",
              service: "product",
              select: ["productTitle"],
            },
            {
              path: "quantity",
              service: "items",
              select: ["quantity"],
            },
            {
              path: "selectedColor",
              service: "productColor",
              select: ["colorName"],
            },
            {
              path: "selectedSize",
              service: "productSize",
              select: ["sizeValue", "sizeCategory"],
            },
            {
              path: "unitPrice",
              service: "productPrice",
              select: ["basePrice"],
            },
            {
              path: "orderNumber",
              service: "checkout",
              select: ["orderNumber"],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Edit info",
        message: "Info orderProduct updated successfully",
      });
      props.onEditResult(eagerResult.data[0]);
    } catch (error) {
      console.debug("error", error);
      setError(
        getSchemaValidationErrorsStrings(error) || "Failed to update info",
      );
      props.alert({
        type: "error",
        title: "Edit info",
        message: "Failed to update info",
      });
    }
    setLoading(false);
  };

  const renderFooter = () => (
    <div className="flex justify-content-end">
      <Button
        label="save"
        className="p-button-text no-focus-effect"
        onClick={onSave}
        loading={loading}
      />
      <Button
        label="close"
        className="p-button-text no-focus-effect p-button-secondary"
        onClick={props.onHide}
      />
    </div>
  );

  const setValByKey = (key, val) => {
    let new_entity = { ..._entity, [key]: val };
    set_entity(new_entity);
    setError({});
  };

  const productNameOptions = productName.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const quantityOptions = quantity.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const selectedColorOptions = selectedColor.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const selectedSizeOptions = selectedSize.map((elem) => ({
    name: elem.sizeValue,
    value: elem.value,
  }));
  const unitPriceOptions = unitPrice.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const orderNumberOptions = orderNumber.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Edit Order Product"
      visible={props.show}
      closable={false}
      onHide={props.onHide}
      modal
      style={{ width: "40vw" }}
      className="min-w-max scalein animation-ease-in-out animation-duration-1000"
      footer={renderFooter()}
      resizable={false}
    >
      <div
        className="grid p-fluid overflow-y-auto"
        style={{ maxWidth: "55vw" }}
        role="orderProduct-edit-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="productName">Product Name:</label>
            <Dropdown
              id="productName"
              value={_entity?.productName?._id}
              optionLabel="name"
              optionValue="value"
              options={productNameOptions}
              onChange={(e) => setValByKey("productName", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["productName"]) && (
              <p className="m-0" key="error-productName">
                {error["productName"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="quantity">Quantity:</label>
            <Dropdown
              id="quantity"
              value={_entity?.quantity?._id}
              optionLabel="name"
              optionValue="value"
              options={quantityOptions}
              onChange={(e) => setValByKey("quantity", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["quantity"]) && (
              <p className="m-0" key="error-quantity">
                {error["quantity"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="selectedColor">Selected Color:</label>
            <Dropdown
              id="selectedColor"
              value={_entity?.selectedColor?._id}
              optionLabel="name"
              optionValue="value"
              options={selectedColorOptions}
              onChange={(e) => setValByKey("selectedColor", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["selectedColor"]) && (
              <p className="m-0" key="error-selectedColor">
                {error["selectedColor"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="selectedSize">Selected Size:</label>
            <Dropdown
              id="selectedSize"
              value={_entity?.selectedSize?._id}
              optionLabel="name"
              optionValue="value"
              options={selectedSizeOptions}
              onChange={(e) => setValByKey("selectedSize", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["selectedSize"]) && (
              <p className="m-0" key="error-selectedSize">
                {error["selectedSize"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="unitPrice">Unit Price:</label>
            <Dropdown
              id="unitPrice"
              value={_entity?.unitPrice?._id}
              optionLabel="name"
              optionValue="value"
              options={unitPriceOptions}
              onChange={(e) => setValByKey("unitPrice", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["unitPrice"]) && (
              <p className="m-0" key="error-unitPrice">
                {error["unitPrice"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="orderNumber">Order Number:</label>
            <Dropdown
              id="orderNumber"
              value={_entity?.orderNumber?._id}
              optionLabel="name"
              optionValue="value"
              options={orderNumberOptions}
              onChange={(e) => setValByKey("orderNumber", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["orderNumber"]) && (
              <p className="m-0" key="error-orderNumber">
                {error["orderNumber"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12">&nbsp;</div>
        <small className="p-error">
          {Array.isArray(Object.keys(error))
            ? Object.keys(error).map((e, i) => (
                <p className="m-0" key={i}>
                  {e}: {error[e]}
                </p>
              ))
            : error}
        </small>
      </div>
    </Dialog>
  );
};

const mapState = (state) => {
  const { user } = state.auth;
  return { user };
};
const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(OrderProductEditDialogComponent);
