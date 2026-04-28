module.exports = function (app) {
  const modelName = "product_size";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      sizeCategory: {
        type: String,
        maxLength: 150,
        index: true,
        trim: true,
        comment:
          "Size Category, p, false, true, true, true, true, true, true, , , , ,",
      },
      sizeValue: {
        type: String,
        maxLength: 150,
        index: true,
        trim: true,
        comment:
          "Size Value, p, false, true, true, true, true, true, true, , , , ,",
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
