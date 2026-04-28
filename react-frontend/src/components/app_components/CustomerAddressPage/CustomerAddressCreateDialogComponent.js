import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

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

const CustomerAddressCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();

  useEffect(() => {
    let init = {};
    if (!_.isEmpty(props?.entity)) {
      init = initilization({ ...props?.entity, ...init }, [], setError);
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
      addressType: _entity?.addressType,
      country: _entity?.country,
      addressLine1: _entity?.addressLine1,
      addressLine2: _entity?.addressLine2,
      city: _entity?.city,
      postalCode: _entity?.postalCode,
      createdBy: props.user._id,
      updatedBy: props.user._id,
    };

    setLoading(true);

    try {
      const result = await client.service("customerAddress").create(_data);
      props.onHide();
      props.alert({
        type: "success",
        title: "Create info",
        message: "Info Customer Address created successfully",
      });
      props.onCreateResult(result);
    } catch (error) {
      console.debug("error", error);
      setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
      props.alert({
        type: "error",
        title: "Create",
        message: "Failed to create in Customer Address",
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

  return (
    <Dialog
      header="Create Customer Address"
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
        role="customerAddress-create-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="addressType">Address Type:</label>
            <InputText
              id="addressType"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.addressType}
              onChange={(e) => setValByKey("addressType", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["addressType"]) ? (
              <p className="m-0" key="error-addressType">
                {error["addressType"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="country">Country:</label>
            <InputText
              id="country"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.country}
              onChange={(e) => setValByKey("country", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["country"]) ? (
              <p className="m-0" key="error-country">
                {error["country"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="addressLine1">Address Line1:</label>
            <InputText
              id="addressLine1"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.addressLine1}
              onChange={(e) => setValByKey("addressLine1", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["addressLine1"]) ? (
              <p className="m-0" key="error-addressLine1">
                {error["addressLine1"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="addressLine2">Address Line2:</label>
            <InputText
              id="addressLine2"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.addressLine2}
              onChange={(e) => setValByKey("addressLine2", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["addressLine2"]) ? (
              <p className="m-0" key="error-addressLine2">
                {error["addressLine2"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="city">City:</label>
            <InputText
              id="city"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.city}
              onChange={(e) => setValByKey("city", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["city"]) ? (
              <p className="m-0" key="error-city">
                {error["city"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="postalCode">Postal Code:</label>
            <InputNumber
              id="postalCode"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.postalCode}
              onChange={(e) => setValByKey("postalCode", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["postalCode"]) ? (
              <p className="m-0" key="error-postalCode">
                {error["postalCode"]}
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

export default connect(
  mapState,
  mapDispatch,
)(CustomerAddressCreateDialogComponent);
