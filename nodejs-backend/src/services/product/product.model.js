module.exports = function (app) {
  const modelName = "product";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      productTitle: {
        type: String,
        maxLength: 150,
        index: true,
        trim: true,
        comment:
          "Product Title, p, false, true, true, true, true, true, true, , , , ,",
      },
      description: {
        type: String,
        comment:
          "Description, inputTextarea, false, true, true, true, true, true, true, , , , ,",
      },
      productColour: {
        type: [Schema.Types.ObjectId],
        ref: "product_color",
        description: "isArray",
        comment:
          "Product Colour, multiselect, false, true, true, true, true, true, true, productColor, product_color, one-to-many, colorName:colorCode,",
      },
      productPrice: {
        type: Schema.Types.ObjectId,
        ref: "product_price",
        comment:
          "Product Price, dropdown, false, true, true, true, true, true, true, productPrice, product_price, one-to-one, basePrice,",
      },
      productSize: {
        type: Schema.Types.ObjectId,
        ref: "product_size",
        comment:
          "Product Size, dropdown, false, true, true, true, true, true, true, productSize, product_size, one-to-one, sizeCategory:sizeValue,",
      },
      productRating: {
        type: Schema.Types.ObjectId,
        ref: "product_rating",
        comment:
          "Product Rating, dropdown, false, true, true, true, true, true, true, productRating, product_rating, one-to-one, starRating:productName,",
      },
      category: {
        type: Schema.Types.ObjectId,
        ref: "category",
        comment:
          "Category, dropdown, false, true, true, true, true, true, true, category, category, one-to-one, type:category,",
      },
      sku: {
        type: String,
        comment: "sku, p, false, true, true, true, true, true, true, , , , ,",
      },
      productImage: {
        type: [Schema.Types.ObjectId],
        ref: "document_storages",
        maxLength: 150,
        index: true,
        trim: true,
        comment:
          "Product Image, file_upload, false, true, true, true, true, true, true, , , , ,",
      },
      smallImage: {
        type: [Schema.Types.ObjectId],
        ref: "document_storages",
        maxLength: 150,
        index: true,
        trim: true,
        comment:
          "Small Image, file_upload, false, true, true, true, true, true, true, , , , ,",
      },

      createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
      updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
    },
    { timestamps: true },
  );

  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
