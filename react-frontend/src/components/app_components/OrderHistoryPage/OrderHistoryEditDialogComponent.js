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

const OrderHistoryEditDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [orderNumber, setOrderNumber] = useState([]);
  const [customer, setCustomer] = useState([]);

  useEffect(() => {
    set_entity(props.entity);
  }, [props.entity, props.show]);

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
        setCustomer(
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

  const onSave = async () => {
    let _data = {
      orderNumber: _entity?.orderNumber?._id,
      customer: _entity?.customer?._id,
    };

    setLoading(true);
    try {
      await client.service("orderHistory").patch(_entity._id, _data);
      const eagerResult = await client.service("orderHistory").find({
        query: {
          $limit: 10000,
          _id: { $in: [_entity._id] },
          $populate: [
            {
              path: "orderNumber",
              service: "checkout",
              select: ["orderNumber"],
            },
            {
              path: "customer",
              service: "customerDetails",
              select: ["customers"],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Edit info",
        message: "Info orderHistory updated successfully",
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

  const orderNumberOptions = orderNumber.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const customerOptions = customer.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Edit Order History"
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
        role="orderHistory-edit-dialog-component"
      >
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
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="customer">Customer:</label>
            <Dropdown
              id="customer"
              value={_entity?.customer?._id}
              optionLabel="name"
              optionValue="value"
              options={customerOptions}
              onChange={(e) => setValByKey("customer", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["customer"]) && (
              <p className="m-0" key="error-customer">
                {error["customer"]}
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

export default connect(mapState, mapDispatch)(OrderHistoryEditDialogComponent);
