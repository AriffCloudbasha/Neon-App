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
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";

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

const CartEditDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [customerName, setCustomerName] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    set_entity(props.entity);
  }, [props.entity, props.show]);

  useEffect(() => {
    //on mount customerDetails
    client
      .service("customerDetails")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleCustomerDetailsId,
        },
      })
      .then((res) => {
        setCustomerName(
          res.data.map((e) => {
            return { name: e["customers"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "CustomerDetails",
          type: "error",
          message: error.message || "Failed get customerDetails",
        });
      });
  }, []);
  useEffect(() => {
    //on mount cartItems
    client
      .service("cartItems")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleCartItemsId,
        },
      })
      .then((res) => {
        setItems(
          res.data.map((e) => {
            return { name: e["productName"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "CartItems",
          type: "error",
          message: error.message || "Failed get cartItems",
        });
      });
  }, []);

  const onSave = async () => {
    let _data = {
      customerName: _entity?.customerName?._id,
      subtotal: _entity?.subtotal,
      total: _entity?.total,
      tax: _entity?.tax,
    };

    setLoading(true);
    try {
      await client.service("cart").patch(_entity._id, _data);
      const eagerResult = await client.service("cart").find({
        query: {
          $limit: 10000,
          _id: { $in: [_entity._id] },
          $populate: [
            {
              path: "customerName",
              service: "customerDetails",
              select: ["customers"],
            },
            {
              path: "items",
              service: "cartItems",
              select: ["productName"],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Edit info",
        message: "Info cart updated successfully",
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

  const customerNameOptions = customerName.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const itemsOptions = items.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Edit Cart"
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
        role="cart-edit-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="customerName">Customer Name:</label>
            <Dropdown
              id="customerName"
              value={_entity?.customerName?._id}
              optionLabel="name"
              optionValue="value"
              options={customerNameOptions}
              onChange={(e) => setValByKey("customerName", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["customerName"]) && (
              <p className="m-0" key="error-customerName">
                {error["customerName"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="items">Items:</label>
            <MultiSelect
              id="items"
              value={_entity?.items?.map((i) => i._id)}
              options={itemsOptions}
              optionLabel="name"
              optionValue="value"
              onChange={(e) => setValByKey("items", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["items"]) && (
              <p className="m-0" key="error-items">
                {error["items"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="subtotal">Subtotal:</label>
            <InputNumber
              id="subtotal"
              className="w-full mb-3"
              mode="currency"
              currency="MYR"
              locale="en-US"
              value={_entity?.subtotal}
              onValueChange={(e) => setValByKey("subtotal", e.value)}
              useGrouping={false}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["subtotal"]) && (
              <p className="m-0" key="error-subtotal">
                {error["subtotal"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="total">Total:</label>
            <InputNumber
              id="total"
              className="w-full mb-3"
              mode="currency"
              currency="MYR"
              locale="en-US"
              value={_entity?.total}
              onValueChange={(e) => setValByKey("total", e.value)}
              useGrouping={false}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["total"]) && (
              <p className="m-0" key="error-total">
                {error["total"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="tax">Tax:</label>
            <InputNumber
              id="tax"
              className="w-full mb-3"
              mode="currency"
              currency="MYR"
              locale="en-US"
              value={_entity?.tax}
              onValueChange={(e) => setValByKey("tax", e.value)}
              useGrouping={false}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["tax"]) && (
              <p className="m-0" key="error-tax">
                {error["tax"]}
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

export default connect(mapState, mapDispatch)(CartEditDialogComponent);
