module.exports = function (app) {
  const modelName = "order_product";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      productName: {
        type: Schema.Types.ObjectId,
        ref: "product",
        comment:
          "Product Name, dropdown, false, true, true, true, true, true, true, product, product, one-to-one, productTitle,",
      },
      quantity: {
        type: Schema.Types.ObjectId,
        ref: "items",
        comment:
          "Quantity, dropdown, false, true, true, true, true, true, true, items, items, one-to-one, quantity,",
      },
      selectedColor: {
        type: Schema.Types.ObjectId,
        ref: "product_color",
        comment:
          "Selected Color, dropdown, false, true, true, true, true, true, true, productColor, product_color, one-to-one, colorName,",
      },
      selectedSize: {
        type: Schema.Types.ObjectId,
        ref: "product_size",
        comment:
          "Selected Size, dropdown, false, true, true, true, true, true, true, productSize, product_size, one-to-one, sizeValue:sizeCategory,",
      },
      unitPrice: {
        type: Schema.Types.ObjectId,
        ref: "product_price",
        comment:
          "Unit Price, dropdown, false, true, true, true, true, true, true, productPrice, product_price, one-to-one, basePrice,",
      },
      orderNumber: {
        type: Schema.Types.ObjectId,
        ref: "checkout",
        comment:
          "Order Number, dropdown, false, true, true, true, true, true, true, checkout, checkout, one-to-one, orderNumber,",
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
