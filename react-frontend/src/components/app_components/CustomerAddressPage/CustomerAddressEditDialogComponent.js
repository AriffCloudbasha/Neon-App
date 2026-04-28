/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
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
        errMsg.push(element.message);
      }
    }
  }
  return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const CustomerAddressEditDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();

  useEffect(() => {
    set_entity(props.entity);
  }, [props.entity, props.show]);

  const onSave = async () => {
    let _data = {
      addressType: _entity?.addressType,
      country: _entity?.country,
      addressLine1: _entity?.addressLine1,
      addressLine2: _entity?.addressLine2,
      city: _entity?.city,
      postalCode: _entity?.postalCode,
    };

    setLoading(true);
    try {
      const result = await client
        .service("customerAddress")
        .patch(_entity._id, _data);
      props.onHide();
      props.alert({
        type: "success",
        title: "Edit info",
        message: "Info customerAddress updated successfully",
      });
      props.onEditResult(result);
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

  return (
    <Dialog
      header="Edit Customer Address"
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
        role="customerAddress-edit-dialog-component"
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
            {!_.isEmpty(error["addressType"]) && (
              <p className="m-0" key="error-addressType">
                {error["addressType"]}
              </p>
            )}
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
            {!_.isEmpty(error["country"]) && (
              <p className="m-0" key="error-country">
                {error["country"]}
              </p>
            )}
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
            {!_.isEmpty(error["addressLine1"]) && (
              <p className="m-0" key="error-addressLine1">
                {error["addressLine1"]}
              </p>
            )}
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
            {!_.isEmpty(error["addressLine2"]) && (
              <p className="m-0" key="error-addressLine2">
                {error["addressLine2"]}
              </p>
            )}
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
            {!_.isEmpty(error["city"]) && (
              <p className="m-0" key="error-city">
                {error["city"]}
              </p>
            )}
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
              useGrouping={false}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["postalCode"]) && (
              <p className="m-0" key="error-postalCode">
                {error["postalCode"]}
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

export default connect(
  mapState,
  mapDispatch,
)(CustomerAddressEditDialogComponent);
