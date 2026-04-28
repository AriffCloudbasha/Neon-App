module.exports = function (app) {
  const modelName = "cart";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      customerName: {
        type: Schema.Types.ObjectId,
        ref: "customer_details",
        comment:
          "Customer Name, dropdown, false, true, true, true, true, true, true, customerDetails, customer_details, one-to-one, customers,",
      },
      items: {
        type: [Schema.Types.ObjectId],
        ref: "cart_items",
        description: "isArray",
        comment:
          "Items, multiselect, false, true, true, true, true, true, true, cartItems, cart_items, one-to-many, productName,",
      },
      subtotal: {
        type: Number,
        max: 1000000,
        comment:
          "Subtotal, currency, false, true, true, true, true, true, true, , , , ,",
      },
      total: {
        type: Number,
        max: 1000000,
        comment:
          "Total, currency, false, true, true, true, true, true, true, , , , ,",
      },
      tax: {
        type: Number,
        max: 1000000,
        comment:
          "Tax, currency, false, true, true, true, true, true, true, , , , ,",
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
