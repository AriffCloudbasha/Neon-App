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
import { Checkbox } from "primereact/checkbox";

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

const CheckoutCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [customer, setCustomer] = useState([]);

  useEffect(() => {
    let init = { paymentStatus: false };
    if (!_.isEmpty(props?.entity)) {
      init = initilization({ ...props?.entity, ...init }, [customer], setError);
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
      orderNumber: _entity?.orderNumber,
      customer: _entity?.customer?._id,
      paymentStatus: _entity?.paymentStatus || false,
      paymentMethod: _entity?.paymentMethod,
      createdBy: props.user._id,
      updatedBy: props.user._id,
    };

    setLoading(true);

    try {
      const result = await client.service("checkout").create(_data);
      const eagerResult = await client.service("checkout").find({
        query: {
          $limit: 10000,
          _id: { $in: [result._id] },
          $populate: [
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
        title: "Create info",
        message: "Info Checkout updated successfully",
      });
      props.onCreateResult(eagerResult.data[0]);
    } catch (error) {
      console.debug("error", error);
      setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
      props.alert({
        type: "error",
        title: "Create",
        message: "Failed to create in Checkout",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // on mount customerDetails
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

  const customerOptions = customer.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Create Checkout"
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
        role="checkout-create-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="orderNumber">Order Number:</label>
            <InputText
              id="orderNumber"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.orderNumber}
              onChange={(e) => setValByKey("orderNumber", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["orderNumber"]) ? (
              <p className="m-0" key="error-orderNumber">
                {error["orderNumber"]}
              </p>
            ) : null}
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
            {!_.isEmpty(error["customer"]) ? (
              <p className="m-0" key="error-customer">
                {error["customer"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field flex">
          <span className="align-items-center">
            <label htmlFor="paymentStatus">Payment Status:</label>
            <Checkbox
              id="paymentStatus"
              className="ml-3"
              checked={_entity?.paymentStatus}
              onChange={(e) => setValByKey("paymentStatus", e.checked)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["paymentStatus"]) ? (
              <p className="m-0" key="error-paymentStatus">
                {error["paymentStatus"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="paymentMethod">Payment Method:</label>
            <InputText
              id="paymentMethod"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.paymentMethod}
              onChange={(e) => setValByKey("paymentMethod", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["paymentMethod"]) ? (
              <p className="m-0" key="error-paymentMethod">
                {error["paymentMethod"]}
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

export default connect(mapState, mapDispatch)(CheckoutCreateDialogComponent);
