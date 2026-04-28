const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("customerAddress service", async () => {
  let thisService;
  let customerAddressCreated;
  let usersServiceResults;
  let users;

  beforeEach(async () => {
    thisService = await app.service("customerAddress");

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
    assert.ok(thisService, "Registered the service (customerAddress)");
  });

  describe("#create", () => {
    const options = {
      addressType: "new value",
      country: "new value",
      addressLine1: "new value",
      addressLine2: "new value",
      city: "new value",
      postalCode: 23,
    };

    beforeEach(async () => {
      customerAddressCreated = await thisService.Model.create({
        ...options,
        ...users,
      });
    });

    it("should create a new customerAddress", () => {
      assert.strictEqual(
        customerAddressCreated.addressType,
        options.addressType,
      );
      assert.strictEqual(customerAddressCreated.country, options.country);
      assert.strictEqual(
        customerAddressCreated.addressLine1,
        options.addressLine1,
      );
      assert.strictEqual(
        customerAddressCreated.addressLine2,
        options.addressLine2,
      );
      assert.strictEqual(customerAddressCreated.city, options.city);
      assert.strictEqual(customerAddressCreated.postalCode, options.postalCode);
    });
  });

  describe("#get", () => {
    it("should retrieve a customerAddress by ID", async () => {
      const retrieved = await thisService.Model.findById(
        customerAddressCreated._id,
      );
      assert.strictEqual(
        retrieved._id.toString(),
        customerAddressCreated._id.toString(),
      );
    });
  });

  describe("#update", () => {
    const options = {
      addressType: "updated value",
      country: "updated value",
      addressLine1: "updated value",
      addressLine2: "updated value",
      city: "updated value",
      postalCode: 100,
    };

    it("should update an existing customerAddress ", async () => {
      const customerAddressUpdated = await thisService.Model.findByIdAndUpdate(
        customerAddressCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(
        customerAddressUpdated.addressType,
        options.addressType,
      );
      assert.strictEqual(customerAddressUpdated.country, options.country);
      assert.strictEqual(
        customerAddressUpdated.addressLine1,
        options.addressLine1,
      );
      assert.strictEqual(
        customerAddressUpdated.addressLine2,
        options.addressLine2,
      );
      assert.strictEqual(customerAddressUpdated.city, options.city);
      assert.strictEqual(customerAddressUpdated.postalCode, options.postalCode);
    });
  });

  describe("#delete", async () => {
    it("should delete a customerAddress", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      const customerAddressDeleted = await thisService.Model.findByIdAndDelete(
        customerAddressCreated._id,
      );
      assert.strictEqual(
        customerAddressDeleted._id.toString(),
        customerAddressCreated._id.toString(),
      );
    });
  });
});
