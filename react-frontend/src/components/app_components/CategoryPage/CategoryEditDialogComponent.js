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

const CategoryEditDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [isSale, setIsSale] = useState([]);

  useEffect(() => {
    set_entity(props.entity);
  }, [props.entity, props.show]);

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
        setIsSale(
          res.data.map((e) => {
            return { name: e["discountedPrice"], value: e._id };
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

  const onSave = async () => {
    let _data = {
      type: _entity?.type,
      category: _entity?.category,
      gender: _entity?.gender,
      isSale: _entity?.isSale?._id,
    };

    setLoading(true);
    try {
      await client.service("category").patch(_entity._id, _data);
      const eagerResult = await client.service("category").find({
        query: {
          $limit: 10000,
          _id: { $in: [_entity._id] },
          $populate: [
            {
              path: "isSale",
              service: "productPrice",
              select: ["discountedPrice"],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Edit info",
        message: "Info category updated successfully",
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

  const isSaleOptions = isSale.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Edit Category"
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
        role="category-edit-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="type">Type:</label>
            <InputText
              id="type"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.type}
              onChange={(e) => setValByKey("type", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["type"]) && (
              <p className="m-0" key="error-type">
                {error["type"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="category">Category:</label>
            <InputText
              id="category"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.category}
              onChange={(e) => setValByKey("category", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["category"]) && (
              <p className="m-0" key="error-category">
                {error["category"]}
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
            <label htmlFor="isSale">is Sale:</label>
            <Dropdown
              id="isSale"
              value={_entity?.isSale?._id}
              optionLabel="name"
              optionValue="value"
              options={isSaleOptions}
              onChange={(e) => setValByKey("isSale", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["isSale"]) && (
              <p className="m-0" key="error-isSale">
                {error["isSale"]}
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

export default connect(mapState, mapDispatch)(CategoryEditDialogComponent);
