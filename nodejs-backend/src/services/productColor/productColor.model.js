module.exports = function (app) {
  const modelName = "product_color";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      colorName: {
        type: String,
        maxLength: 150,
        index: true,
        trim: true,
        comment:
          "Color Name, p, false, true, true, true, true, true, true, , , , ,",
      },
      colorCode: {
        type: String,
        maxLength: 150,
        index: true,
        trim: true,
        comment:
          "Color Code, p, false, true, true, true, true, true, true, , , , ,",
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
