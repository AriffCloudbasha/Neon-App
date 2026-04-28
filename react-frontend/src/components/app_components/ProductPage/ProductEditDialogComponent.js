/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import UploadFilesToS3 from "../../../services/UploadFilesToS3";

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

const ProductEditDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [productColour, setProductColour] = useState([]);
  const [productPrice, setProductPrice] = useState([]);
  const [productSize, setProductSize] = useState([]);
  const [productRating, setProductRating] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    set_entity(props.entity);
  }, [props.entity, props.show]);

  useEffect(() => {
    // on mount productColor
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
        setProductColour(
          res.data.map((e) => {
            return {
              colorName: `${e["colorName"]}`,
              colorCode: `${e["colorCode"]}`,
              value: e._id,
            };
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
  useEffect(() => {
    // on mount productSize
    client
      .service("productSize")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleProductSizeId,
        },
      })
      .then((res) => {
        setProductSize(
          res.data.map((e) => {
            return {
              sizeCategory: `${e["sizeCategory"]}`,
              sizeValue: `${e["sizeValue"]}`,
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
    // on mount productRating
    client
      .service("productRating")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleProductRatingId,
        },
      })
      .then((res) => {
        setProductRating(
          res.data.map((e) => {
            return {
              starRating: `${e["starRating"]}`,
              productName: `${e["productName"]}`,
              value: e._id,
            };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "ProductRating",
          type: "error",
          message: error.message || "Failed get productRating",
        });
      });
  }, []);
  useEffect(() => {
    // on mount category
    client
      .service("category")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleCategoryId,
        },
      })
      .then((res) => {
        setCategory(
          res.data.map((e) => {
            return {
              type: `${e["type"]}`,
              category: `${e["category"]}`,
              value: e._id,
            };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "Category",
          type: "error",
          message: error.message || "Failed get category",
        });
      });
  }, []);

  const onSave = async () => {
    let _data = {
      productTitle: _entity?.productTitle,
      description: _entity?.description,
      productPrice: _entity?.productPrice?._id,
      productSize: _entity?.productSize?._id,
      productRating: _entity?.productRating?._id,
      category: _entity?.category?._id,
      sku: _entity?.sku,
      productImage: _entity?.productImage,
      smallImage: _entity?.smallImage,
    };

    setLoading(true);
    try {
      await client.service("product").patch(_entity._id, _data);
      const eagerResult = await client.service("product").find({
        query: {
          $limit: 10000,
          _id: { $in: [_entity._id] },
          $populate: [
            {
              path: "productColour",
              service: "productColor",
              select: ["colorName", "colorCode"],
            },
            {
              path: "productPrice",
              service: "productPrice",
              select: ["basePrice"],
            },
            {
              path: "productSize",
              service: "productSize",
              select: ["sizeCategory", "sizeValue"],
            },
            {
              path: "productRating",
              service: "productRating",
              select: ["starRating", "productName"],
            },
            {
              path: "category",
              service: "category",
              select: ["type", "category"],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Edit info",
        message: "Info product updated successfully",
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

  const productColourOptions = productColour.map((elem) => ({
    name: `${elem.colorName} (${elem.colorCode})`,
    value: elem.value,
  }));
  const productPriceOptions = productPrice.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const productSizeOptions = productSize.map((elem) => ({
    name: `${elem.sizeCategory} - ${elem.sizeValue}`,
    value: elem.value,
  }));
  const productRatingOptions = productRating.map((elem) => ({
    name: `${elem.starRating}`,
    value: elem.value,
  }));
  const categoryOptions = category.map((elem) => ({
    name: `${elem.type} - ${elem.category}`,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Edit Product"
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
        role="product-edit-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="productTitle">Product Title:</label>
            <InputText
              id="productTitle"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.productTitle ?? ""}
              onChange={(e) => setValByKey("productTitle", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["productTitle"]) && (
              <p className="m-0" key="error-productTitle">
                {error["productTitle"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="description">Description:</label>
            <InputTextarea
              id="description"
              rows={5}
              cols={30}
              value={_entity?.description ?? ""}
              onChange={(e) => setValByKey("description", e.target.value)}
              autoResize
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["description"]) && (
              <p className="m-0" key="error-description">
                {error["description"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="productColour">Product Colour:</label>
            <MultiSelect
              id="productColour"
              value={_entity?.productColour?.map((i) => i._id)}
              options={productColourOptions}
              optionLabel="name"
              optionValue="value"
              onChange={(e) => setValByKey("productColour", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["productColour"]) && (
              <p className="m-0" key="error-productColour">
                {error["productColour"]}
              </p>
            )}
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
            {!_.isEmpty(error["productPrice"]) && (
              <p className="m-0" key="error-productPrice">
                {error["productPrice"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="productSize">Product Size:</label>
            <Dropdown
              id="productSize"
              value={_entity?.productSize?._id}
              optionLabel="name"
              optionValue="value"
              options={productSizeOptions}
              onChange={(e) => setValByKey("productSize", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["productSize"]) && (
              <p className="m-0" key="error-productSize">
                {error["productSize"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="productRating">Product Rating:</label>
            <Dropdown
              id="productRating"
              value={_entity?.productRating?._id}
              optionLabel="name"
              optionValue="value"
              options={productRatingOptions}
              onChange={(e) => setValByKey("productRating", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["productRating"]) && (
              <p className="m-0" key="error-productRating">
                {error["productRating"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="category">Category:</label>
            <Dropdown
              id="category"
              value={_entity?.category?._id}
              optionLabel="name"
              optionValue="value"
              options={categoryOptions}
              onChange={(e) => setValByKey("category", { _id: e.value })}
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
            <label htmlFor="sku">sku:</label>
            <InputText
              id="sku"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.sku}
              onChange={(e) => setValByKey("sku", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["sku"]) && (
              <p className="m-0" key="error-sku">
                {error["sku"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 field">
          <span className="align-items-center">
            <label htmlFor="productImage">Product Image:</label>
            <UploadFilesToS3
              type={"edit"}
              setValByKey={setValByKey}
              onSave={onSave}
              id={urlParams.singleProductId}
              serviceName="product"
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["productImage"]) && (
              <p className="m-0" key="error-productImage">
                {error["productImage"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 field">
          <span className="align-items-center">
            <label htmlFor="smallImage">Small Image:</label>
            <UploadFilesToS3
              type={"edit"}
              setValByKey={setValByKey}
              onSave={onSave}
              id={urlParams.singleProductId}
              serviceName="product"
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["smallImage"]) && (
              <p className="m-0" key="error-smallImage">
                {error["smallImage"]}
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

export default connect(mapState, mapDispatch)(ProductEditDialogComponent);
