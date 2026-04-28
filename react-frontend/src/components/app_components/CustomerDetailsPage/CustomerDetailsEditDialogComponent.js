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
import { Calendar } from "primereact/calendar";
const genderArray = ["Male", "Female"];
const genderOptions = genderArray.map((x) => ({ name: x, value: x }));

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

const CustomerDetailsEditDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [customerAddress, setCustomerAddress] = useState([]);

  useEffect(() => {
    set_entity(props.entity);
  }, [props.entity, props.show]);

  useEffect(() => {
    // on mount customerAddress
    client
      .service("customerAddress")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleCustomerAddressId,
        },
      })
      .then((res) => {
        setCustomerAddress(
          res.data.map((e) => {
            return {
              addressType: `${e["addressType"]}`,
              addressLine1: `${e["addressLine1"]}`,
              addressLine2: `${e["addressLine2"]}`,
              city: `${e["city"]}`,
              postalCode: `${e["postalCode"]}`,
              value: e._id,
            };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "CustomerAddress",
          type: "error",
          message: error.message || "Failed get customerAddress",
        });
      });
  }, []);

  const onSave = async () => {
    let _data = {
      customers: _entity?.customers,
      customerEmail: _entity?.customerEmail,
      customerAddress: _entity?.customerAddress?._id,
      phoneNumber: _entity?.phoneNumber,
      gender: _entity?.gender,
      dateOfBirth: _entity?.dateOfBirth,
    };

    setLoading(true);
    try {
      await client.service("customerDetails").patch(_entity._id, _data);
      const eagerResult = await client.service("customerDetails").find({
        query: {
          $limit: 10000,
          _id: { $in: [_entity._id] },
          $populate: [
            {
              path: "customerAddress",
              service: "customerAddress",
              select: [
                "addressType",
                "addressLine1",
                "addressLine2",
                "city",
                "postalCode",
              ],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Edit info",
        message: "Info customerDetails updated successfully",
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

  const customerAddressOptions = customerAddress.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Edit Customers"
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
        role="customerDetails-edit-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="customers">Customers:</label>
            <InputText
              id="customers"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.customers}
              onChange={(e) => setValByKey("customers", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["customers"]) && (
              <p className="m-0" key="error-customers">
                {error["customers"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="customerEmail">Customer Email:</label>
            <InputText
              id="customerEmail"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.customerEmail}
              onChange={(e) => setValByKey("customerEmail", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["customerEmail"]) && (
              <p className="m-0" key="error-customerEmail">
                {error["customerEmail"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="customerAddress">Customer Address:</label>
            <Dropdown
              id="customerAddress"
              value={_entity?.customerAddress?._id}
              optionLabel="name"
              optionValue="value"
              options={customerAddressOptions}
              onChange={(e) => setValByKey("customerAddress", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["customerAddress"]) && (
              <p className="m-0" key="error-customerAddress">
                {error["customerAddress"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <InputText
              id="phoneNumber"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.phoneNumber}
              onChange={(e) => setValByKey("phoneNumber", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["phoneNumber"]) && (
              <p className="m-0" key="error-phoneNumber">
                {error["phoneNumber"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="gender">Gender:</label>
            <Dropdown
              id="gender"
              value={_entity?.gender}
              options={genderOptions}
              optionLabel="name"
              optionValue="value"
              onChange={(e) => setValByKey("gender", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["gender"]) && (
              <p className="m-0" key="error-gender">
                {error["gender"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="dateOfBirth">Date Of Birth:</label>
            <Calendar
              id="dateOfBirth"
              value={
                _entity?.dateOfBirth ? new Date(_entity?.dateOfBirth) : null
              }
              dateFormat="dd/mm/yy"
              onChange={(e) => setValByKey("dateOfBirth", new Date(e.value))}
              showIcon
              showButtonBar
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["dateOfBirth"]) && (
              <p className="m-0" key="error-dateOfBirth">
                {error["dateOfBirth"]}
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
)(CustomerDetailsEditDialogComponent);
