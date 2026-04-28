module.exports = function (app) {
  const modelName = "customer_details";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      customers: {
        type: String,
        maxLength: 150,
        index: true,
        trim: true,
        comment:
          "Customers, p, false, true, true, true, true, true, true, , , , ,",
      },
      customerEmail: {
        type: String,
        maxLength: 150,
        index: true,
        trim: true,
        comment:
          "Customer Email, p, false, true, true, true, true, true, true, , , , ,",
      },
      customerAddress: {
        type: Schema.Types.ObjectId,
        ref: "customer_address",
        comment:
          "Customer Address, dropdown, false, true, true, true, true, true, true, customerAddress, customer_address, one-to-one, addressType:addressLine1:addressLine2:city:postalCode,",
      },
      phoneNumber: {
        type: String,
        maxLength: 150,
        index: true,
        trim: true,
        comment:
          "Phone Number, p, false, true, true, true, true, true, true, , , , ,",
      },
      gender: {
        type: String,
        enum: ["Male", "Female"],
        comment:
          "Gender, dropdownArray, false, true, true, true, true, true, true, , , , ,",
      },
      dateOfBirth: {
        type: Date,
        comment:
          "Date Of Birth, p_date, false, true, true, true, true, true, true, , , , ,",
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
