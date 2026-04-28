module.exports = function (app) {
  const modelName = "customer_address";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      addressType: {
        type: String,
        comment:
          "Address Type, p, false, true, true, true, true, true, true, , , , ,",
      },
      country: {
        type: String,
        comment:
          "Country, p, false, true, true, true, true, true, true, , , , ,",
      },
      addressLine1: {
        type: String,
        comment:
          "Address Line1, p, false, true, true, true, true, true, true, , , , ,",
      },
      addressLine2: {
        type: String,
        comment:
          "Address Line2, p, false, true, true, true, true, true, true, , , , ,",
      },
      city: {
        type: String,
        comment: "City, p, false, true, true, true, true, true, true, , , , ,",
      },
      postalCode: {
        type: Number,
        max: 1000000,
        comment:
          "Postal Code, p_number, false, true, true, true, true, true, true, , , , ,",
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
