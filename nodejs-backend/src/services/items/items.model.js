module.exports = function (app) {
  const modelName = "items";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      sku: {
        type: [Schema.Types.ObjectId],
        ref: "product",
        description: "isArray",
        comment:
          "sku, dropdown, false, true, true, true, true, true, true, product, product, one-to-one, sku,",
      },
      product: {
        type: [Schema.Types.ObjectId],
        ref: "product",
        description: "isArray",
        comment:
          "Product, multiselect, false, true, true, true, true, true, true, product, product, one-to-many, productTitle,",
      },
      quantity: {
        type: String,
        maxLength: 150,
        index: true,
        trim: true,
        comment:
          "Quantity, p, false, true, true, true, true, true, true, , , , ,",
      },
      productPrice: {
        type: Schema.Types.ObjectId,
        ref: "product_price",
        comment:
          "Product Price, dropdown, false, true, true, true, true, true, true, productPrice, product_price, one-to-one, basePrice,",
      },
      amount: {
        type: String,
        maxLength: 150,
        index: true,
        trim: true,
        comment:
          "Amount, p, false, true, true, true, true, true, true, , , , ,",
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
