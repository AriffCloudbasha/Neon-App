module.exports = function (app) {
  const modelName = "category";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      type: {
        type: String,
        maxLength: 150,
        index: true,
        trim: true,
        comment: "Type, p, false, true, true, true, true, true, true, , , , ,",
      },
      category: {
        type: String,
        comment:
          "Category, p, false, true, true, true, true, true, true, , , , ,",
      },
      gender: {
        type: String,
        enum: ["Male", "Female"],
        comment:
          "Gender, dropdownArray, false, true, true, true, true, true, true, , , , ,",
      },
      isSale: {
        type: Schema.Types.ObjectId,
        ref: "product_price",
        comment:
          "is Sale, dropdown, false, true, true, true, true, true, true, productPrice, product_price, one-to-one, discountedPrice,",
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
