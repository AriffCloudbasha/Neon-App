const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("customerDetails service", async () => {
  let thisService;
  let customerDetailCreated;
  let usersServiceResults;
  let users;

  const customerAddressCreated = await app
    .service("customerAddress")
    .Model.create({
      customers: "new value",
      customerEmail: "new value",
      customerAddress: "parentObjectId",
      addressType: "new value",
      country: "new value",
      addressLine1: "new value",
      addressLine2: "new value",
      city: "new value",
      postalCode: 23,
    });

  beforeEach(async () => {
    thisService = await app.service("customerDetails");

    // Create users here
    usersServiceResults = await app.service("users").Model.create(usersRefData);
    users = {
      createdBy: usersServiceResults[0]._id,
      updatedBy: usersServiceResults[0]._id,
    };
  });

  after(async () => {
    if (usersServiceResults) {
      await Promise.all(
        usersServiceResults.map((i) =>
          app.service("users").Model.findByIdAndDelete(i._id),
        ),
      );
    }
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (customerDetails)");
  });

  describe("#create", () => {
    const options = {
      customers: "new value",
      customerEmail: "new value",
      customerAddress: `${customerAddressCreated._id}`,
      addressType: "new value",
      country: "new value",
      addressLine1: "new value",
      addressLine2: "new value",
      city: "new value",
      postalCode: 23,
      phoneNumber: "new value",
      gender: ["new value"],
      dateOfBirth: "2026-04-27T06:45:18.577Z",
    };

    beforeEach(async () => {
      customerDetailCreated = await thisService.Model.create({
        ...options,
        ...users,
      });
    });

    it("should create a new customerDetail", () => {
      assert.strictEqual(customerDetailCreated.customers, options.customers);
      assert.strictEqual(
        customerDetailCreated.customerEmail,
        options.customerEmail,
      );
      assert.strictEqual(
        customerDetailCreated.customerAddress.toString(),
        options.customerAddress.toString(),
      );
      assert.strictEqual(
        customerDetailCreated.phoneNumber,
        options.phoneNumber,
      );
      assert.strictEqual(customerDetailCreated.gender, options.gender);
      assert.strictEqual(
        customerDetailCreated.dateOfBirth.toISOString(),
        options.dateOfBirth,
      );
    });
  });

  describe("#get", () => {
    it("should retrieve a customerDetail by ID", async () => {
      const retrieved = await thisService.Model.findById(
        customerDetailCreated._id,
      );
      assert.strictEqual(
        retrieved._id.toString(),
        customerDetailCreated._id.toString(),
      );
    });
  });

  describe("#update", () => {
    const options = {
      customers: "updated value",
      customerEmail: "updated value",
      customerAddress: `${customerAddressCreated._id}`,
      phoneNumber: "updated value",
      gender: ["updated value"],
      dateOfBirth: "2026-04-27T06:45:18.577Z",
    };

    it("should update an existing customerDetail ", async () => {
      const customerDetailUpdated = await thisService.Model.findByIdAndUpdate(
        customerDetailCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(customerDetailUpdated.customers, options.customers);
      assert.strictEqual(
        customerDetailUpdated.customerEmail,
        options.customerEmail,
      );
      assert.strictEqual(
        customerDetailUpdated.customerAddress.toString(),
        options.customerAddress.toString(),
      );
      assert.strictEqual(
        customerDetailUpdated.phoneNumber,
        options.phoneNumber,
      );
      assert.strictEqual(customerDetailUpdated.gender, options.gender);
      assert.strictEqual(
        customerDetailUpdated.dateOfBirth.toISOString(),
        options.dateOfBirth,
      );
    });
  });

  describe("#delete", async () => {
    it("should delete a customerDetail", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app
        .service("customerAddress")
        .Model.findByIdAndDelete(customerAddressCreated._id);

      const customerDetailDeleted = await thisService.Model.findByIdAndDelete(
        customerDetailCreated._id,
      );
      assert.strictEqual(
        customerDetailDeleted._id.toString(),
        customerDetailCreated._id.toString(),
      );
    });
  });
});
