module.exports = function (app) {
  const modelName = "cart_items";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      productName: {
        type: String,
        maxLength: 150,
        comment:
          "Product Name, p, false, true, true, true, true, true, true, , , , ,",
      },
      quantity: {
        type: Number,
        max: 1000000,
        comment:
          "Quantity, p_number, false, true, true, true, true, true, true, , , , ,",
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
