module.exports = function (app) {
  const modelName = "checkout";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      orderNumber: {
        type: String,
        comment:
          "Order Number, p, false, true, true, true, true, true, true, , , , ,",
      },
      customer: {
        type: Schema.Types.ObjectId,
        ref: "customer_details",
        comment:
          "Customer, dropdown, false, true, true, true, true, true, true, customerDetails, customer_details, one-to-one, customers,",
      },
      paymentStatus: {
        type: Boolean,
        required: false,
        default: false,
        comment:
          "Payment Status, tick, false, true, true, true, true, true, true, , , , ,",
      },
      paymentMethod: {
        type: String,
        default: "",
        comment:
          "Payment Method, p, false, true, true, true, true, true, true, , , , ,",
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
