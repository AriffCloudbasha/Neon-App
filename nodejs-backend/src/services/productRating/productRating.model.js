module.exports = function (app) {
  const modelName = "product_rating";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      productName: {
        type: String,
        comment:
          "Product Name, p, false, true, true, true, true, true, true, , , , ,",
      },
      customerName: {
        type: String,
        maxLength: 150,
        index: true,
        trim: true,
        comment:
          "Customer Name, p, false, true, true, true, true, true, true, , , , ,",
      },
      starRating: {
        type: Number,
        max: 1000000,
        comment:
          "Star Rating, rating, false, true, true, true, true, true, true, , , , ,",
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
