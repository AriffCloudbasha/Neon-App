import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";

const getSchemaValidationErrorsStrings = (errorObj) => {
  let errMsg = {};
  for (const key in errorObj.errors) {
    if (Object.hasOwnProperty.call(errorObj.errors, key)) {
      const element = errorObj.errors[key];
      if (element?.message) {
        errMsg[key] = element.message;
      }
    }
  }
  return errMsg.length
    ? errMsg
    : errorObj.message
      ? { error: errorObj.message }
      : {};
};

const ItemsCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [sku, setSku] = useState([]);
  const [product, setProduct] = useState([]);
  const [productPrice, setProductPrice] = useState([]);

  useEffect(() => {
    let init = {};
    if (!_.isEmpty(props?.entity)) {
      init = initilization(
        { ...props?.entity, ...init },
        [sku, product, productPrice],
        setError,
      );
    }
    set_entity({ ...init });
    setError({});
  }, [props.show]);

  const validate = () => {
    let ret = true;
    const error = {};

    if (!ret) setError(error);
    return ret;
  };

  const onSave = async () => {
    if (!validate()) return;
    let _data = {
      sku: _entity?.sku?._id,
      product: _entity?.product,
      quantity: _entity?.quantity,
      productPrice: _entity?.productPrice?._id,
      amount: _entity?.amount,
      createdBy: props.user._id,
      updatedBy: props.user._id,
    };

    setLoading(true);

    try {
      const result = await client.service("items").create(_data);
      const eagerResult = await client.service("items").find({
        query: {
          $limit: 10000,
          _id: { $in: [result._id] },
          $populate: [
            {
              path: "sku",
              service: "product",
              select: ["sku"],
            },
            {
              path: "productPrice",
              service: "productPrice",
              select: ["basePrice"],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Create info",
        message: "Info Items updated successfully",
      });
      props.onCreateResult(eagerResult.data[0]);
    } catch (error) {
      console.debug("error", error);
      setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
      props.alert({
        type: "error",
        title: "Create",
        message: "Failed to create in Items",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // on mount product
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
        setSku(
          res.data.map((e) => {
            return { name: e["sku"], value: e._id };
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
    // on mount product options
    client
      .service("product")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
        },
      })
      .then((res) => {
        setProduct(
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
    // on mount productPrice
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
        setProductPrice(
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

  const skuOptions = sku.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const productOptions = product.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const productPriceOptions = productPrice.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Create Items"
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
        role="items-create-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="sku">sku:</label>
            <Dropdown
              id="sku"
              value={_entity?.sku?._id}
              optionLabel="name"
              optionValue="value"
              options={skuOptions}
              onChange={(e) => setValByKey("sku", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["sku"]) ? (
              <p className="m-0" key="error-sku">
                {error["sku"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="product">Product:</label>
            <MultiSelect
              id="product"
              value={_entity?.product}
              options={productOptions}
              optionLabel="name"
              optionValue="value"
              onChange={(e) => setValByKey("product", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["product"]) ? (
              <p className="m-0" key="error-product">
                {error["product"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="quantity">Quantity:</label>
            <InputText
              id="quantity"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.quantity}
              onChange={(e) => setValByKey("quantity", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["quantity"]) ? (
              <p className="m-0" key="error-quantity">
                {error["quantity"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="productPrice">Product Price:</label>
            <Dropdown
              id="productPrice"
              value={_entity?.productPrice?._id}
              optionLabel="name"
              optionValue="value"
              options={productPriceOptions}
              onChange={(e) => setValByKey("productPrice", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["productPrice"]) ? (
              <p className="m-0" key="error-productPrice">
                {error["productPrice"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="amount">Amount:</label>
            <InputText
              id="amount"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.amount}
              onChange={(e) => setValByKey("amount", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["amount"]) ? (
              <p className="m-0" key="error-amount">
                {error["amount"]}
              </p>
            ) : null}
          </small>
        </div>
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

export default connect(mapState, mapDispatch)(ItemsCreateDialogComponent);
