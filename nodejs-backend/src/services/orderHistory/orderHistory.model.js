module.exports = function (app) {
  const modelName = "order_history";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      orderNumber: {
        type: [Schema.Types.ObjectId],
        ref: "checkout",
        description: "isArray",
        comment:
          "Order Number, dropdown, false, true, true, true, true, true, true, checkout, checkout, one-to-one, orderNumber,",
      },
      customer: {
        type: Schema.Types.ObjectId,
        ref: "customer_details",
        comment:
          "Customer, dropdown, false, true, true, true, true, true, true, customerDetails, customer_details, one-to-one, customers,",
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
