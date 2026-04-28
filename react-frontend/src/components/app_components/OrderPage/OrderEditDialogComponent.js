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
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";

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

const OrderEditDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [orderNumber, setOrderNumber] = useState([]);
  const [customerName, setCustomerName] = useState([]);

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
        setCustomerName(
          res.data.map((e) => {
            return {
              customerName: `${e["customerName"]}`,
              customers: `${e["customers"]}`,
              value: e._id,
            };
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
      customerName: _entity?.customerName?._id,
      total: _entity?.total,
      date: _entity?.date,
    };

    setLoading(true);
    try {
      await client.service("order").patch(_entity._id, _data);
      const eagerResult = await client.service("order").find({
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
              path: "customerName",
              service: "customerDetails",
              select: ["customerName", "customers"],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Edit info",
        message: "Info order updated successfully",
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
  const customerNameOptions = customerName.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Edit Order"
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
        role="order-edit-dialog-component"
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
            <label htmlFor="total">Total:</label>
            <InputNumber
              id="total"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.total}
              onChange={(e) => setValByKey("total", e.value)}
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
            <label htmlFor="date">Date:</label>
            <Calendar
              id="date"
              value={_entity?.date ? new Date(_entity?.date) : null}
              onChange={(e) => setValByKey("date", new Date(e.value))}
              showIcon
              showButtonBar
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["date"]) && (
              <p className="m-0" key="error-date">
                {error["date"]}
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

export default connect(mapState, mapDispatch)(OrderEditDialogComponent);
