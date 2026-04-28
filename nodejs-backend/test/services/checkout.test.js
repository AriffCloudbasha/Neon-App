const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("checkout service", async () => {
  let thisService;
  let checkoutCreated;
  let usersServiceResults;
  let users;

  const customerAddressCreated = await app
    .service("customerAddress")
    .Model.create({
      orderNumber: "new value",
      customer: "parentObjectId",
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
  const customerDetailsCreated = await app
    .service("customerDetails")
    .Model.create({
      orderNumber: "new value",
      customer: "parentObjectId",
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
      dateOfBirth: "2026-04-27T06:45:18.563Z",
    });

  beforeEach(async () => {
    thisService = await app.service("checkout");

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
    assert.ok(thisService, "Registered the service (checkout)");
  });

  describe("#create", () => {
    const options = {
      orderNumber: "new value",
      customer: `${customerDetailsCreated._id}`,
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
      dateOfBirth: "2026-04-27T06:45:18.563Z",
      paymentStatus: true,
      paymentMethod: "new value",
    };

    beforeEach(async () => {
      checkoutCreated = await thisService.Model.create({
        ...options,
        ...users,
      });
    });

    it("should create a new checkout", () => {
      assert.strictEqual(checkoutCreated.orderNumber, options.orderNumber);
      assert.strictEqual(
        checkoutCreated.customer.toString(),
        options.customer.toString(),
      );
      assert.strictEqual(checkoutCreated.paymentStatus, options.paymentStatus);
      assert.strictEqual(checkoutCreated.paymentStatus, options.paymentStatus);
      assert.strictEqual(checkoutCreated.paymentMethod, options.paymentMethod);
    });
  });

  describe("#get", () => {
    it("should retrieve a checkout by ID", async () => {
      const retrieved = await thisService.Model.findById(checkoutCreated._id);
      assert.strictEqual(
        retrieved._id.toString(),
        checkoutCreated._id.toString(),
      );
    });
  });

  describe("#update", () => {
    const options = {
      orderNumber: "updated value",
      customer: `${customerDetailsCreated._id}`,
      paymentStatus: false,
      paymentMethod: "updated value",
    };

    it("should update an existing checkout ", async () => {
      const checkoutUpdated = await thisService.Model.findByIdAndUpdate(
        checkoutCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(checkoutUpdated.orderNumber, options.orderNumber);
      assert.strictEqual(
        checkoutUpdated.customer.toString(),
        options.customer.toString(),
      );
      assert.strictEqual(checkoutUpdated.paymentStatus, options.paymentStatus);
      assert.strictEqual(checkoutUpdated.paymentStatus, options.paymentStatus);
      assert.strictEqual(checkoutUpdated.paymentMethod, options.paymentMethod);
    });
  });

  describe("#delete", async () => {
    it("should delete a checkout", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app
        .service("customerAddress")
        .Model.findByIdAndDelete(customerAddressCreated._id);
      await app
        .service("customerDetails")
        .Model.findByIdAndDelete(customerDetailsCreated._id);

      const checkoutDeleted = await thisService.Model.findByIdAndDelete(
        checkoutCreated._id,
      );
      assert.strictEqual(
        checkoutDeleted._id.toString(),
        checkoutCreated._id.toString(),
      );
    });
  });
});
