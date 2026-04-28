module.exports = function (app) {
  const modelName = "order";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      orderNumber: {
        type: Schema.Types.ObjectId,
        ref: "checkout",
        comment:
          "Order Number, dropdown, false, true, true, true, true, true, true, checkout, checkout, one-to-one, orderNumber,",
      },
      customerName: {
        type: Schema.Types.ObjectId,
        ref: "customer_details",
        comment:
          "Customer Name, dropdown, false, true, true, true, true, true, true, customerDetails, customer_details, one-to-one, customerName:customers,",
      },
      total: {
        type: Number,
        max: 1000000,
        comment:
          "Total, p_number, false, true, true, true, true, true, true, , , , ,",
      },
      date: {
        type: Date,
        comment:
          "Date, p_calendar, false, true, true, true, true, true, true, , , , ,",
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
