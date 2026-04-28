import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
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

const ProductCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [productColour, setProductColour] = useState([]);
  const [productPrice, setProductPrice] = useState([]);
  const [productSize, setProductSize] = useState([]);
  const [productRating, setProductRating] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    let init = {};
    if (!_.isEmpty(props?.entity)) {
      init = initilization(
        { ...props?.entity, ...init },
        [productColour, productPrice, productSize, productRating, category],
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
      productTitle: _entity?.productTitle,
      description: _entity?.description,
      productColour: _entity?.productColour,
      productPrice: _entity?.productPrice?._id,
      productSize: _entity?.productSize?._id,
      productRating: _entity?.productRating?._id,
      category: _entity?.category?._id,
      sku: _entity?.sku,
      productImage: _entity?.productImage,
      smallImage: _entity?.smallImage,
      createdBy: props.user._id,
      updatedBy: props.user._id,
    };

    setLoading(true);

    try {
      const result = await client.service("product").create(_data);
      const eagerResult = await client.service("product").find({
        query: {
          $limit: 10000,
          _id: { $in: [result._id] },
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
        title: "Create info",
        message: "Info Product updated successfully",
      });
      props.onCreateResult(eagerResult.data[0]);
    } catch (error) {
      console.debug("error", error);
      setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
      props.alert({
        type: "error",
        title: "Create",
        message: "Failed to create in Product",
      });
    }
    setLoading(false);
  };

  const onFileproductImageLoaded = (file, status) => {
    if (status)
      props.alert({
        title: "file uploader",
        type: "success",
        message: "file uploaded" + file.name,
      });
    else
      props.alert({
        title: "file uploader",
        type: "error",
        message: "file uploader failed" + file.name,
      });
  };
  const onFilesmallImageLoaded = (file, status) => {
    if (status)
      props.alert({
        title: "file uploader",
        type: "success",
        message: "file uploaded" + file.name,
      });
    else
      props.alert({
        title: "file uploader",
        type: "error",
        message: "file uploader failed" + file.name,
      });
  };

  const setproductImageId = (id) => {
    setValByKey("productImage", id);
  };
  const setsmallImageId = (id) => {
    setValByKey("smallImage", id);
  };

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
      header="Create Product"
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
        role="product-create-dialog-component"
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
            {!_.isEmpty(error["productTitle"]) ? (
              <p className="m-0" key="error-productTitle">
                {error["productTitle"]}
              </p>
            ) : null}
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
            {!_.isEmpty(error["description"]) ? (
              <p className="m-0" key="error-description">
                {error["description"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="productColour">Product Colour:</label>
            <MultiSelect
              id="productColour"
              value={_entity?.productColour}
              options={productColourOptions}
              optionLabel="name"
              optionValue="value"
              onChange={(e) => setValByKey("productColour", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["productColour"]) ? (
              <p className="m-0" key="error-productColour">
                {error["productColour"]}
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
            {!_.isEmpty(error["productSize"]) ? (
              <p className="m-0" key="error-productSize">
                {error["productSize"]}
              </p>
            ) : null}
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
            {!_.isEmpty(error["productRating"]) ? (
              <p className="m-0" key="error-productRating">
                {error["productRating"]}
              </p>
            ) : null}
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
            {!_.isEmpty(error["category"]) ? (
              <p className="m-0" key="error-category">
                {error["category"]}
              </p>
            ) : null}
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
            {!_.isEmpty(error["sku"]) ? (
              <p className="m-0" key="error-sku">
                {error["sku"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 field">
          <span className="align-items-center">
            <label htmlFor="productImage">Product Image:</label>
            <UploadFilesToS3
              type={"create"}
              user={props.user}
              id={urlParams.id}
              serviceName="product"
              onUploadComplete={setproductImageId}
              onFileLoaded={onFileproductImageLoaded}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["productImage"]) ? (
              <p className="m-0" key="error-productImage">
                {error["productImage"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 field">
          <span className="align-items-center">
            <label htmlFor="smallImage">Small Image:</label>
            <UploadFilesToS3
              type={"create"}
              user={props.user}
              id={urlParams.id}
              serviceName="product"
              onUploadComplete={setsmallImageId}
              onFileLoaded={onFilesmallImageLoaded}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["smallImage"]) ? (
              <p className="m-0" key="error-smallImage">
                {error["smallImage"]}
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

export default connect(mapState, mapDispatch)(ProductCreateDialogComponent);
