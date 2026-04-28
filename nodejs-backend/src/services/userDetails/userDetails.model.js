module.exports = function (app) {
  const modelName = "user_details";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      email: {
        type: String,
        maxLength: 150,
        index: true,
        trim: true,
        comment:
          "Email , p, false, true, true, true, true, true, true, , , , ,",
      },
      passwordHash: {
        type: String,
        comment:
          "Password Hash, p, false, true, true, true, true, true, true, , , , ,",
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
