const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("orderHistory service", async () => {
  let thisService;
  let orderHistoryCreated;
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
      dateOfBirth: "2026-04-27T06:45:18.651Z",
    });
  const checkoutCreated = await app.service("checkout").Model.create({
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
    dateOfBirth: "2026-04-27T06:45:18.651Z",
    paymentStatus: true,
    paymentMethod: "new value",
  });

  beforeEach(async () => {
    thisService = await app.service("orderHistory");

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
    assert.ok(thisService, "Registered the service (orderHistory)");
  });

  describe("#create", () => {
    const options = {
      orderNumber: `${checkoutCreated._id}`,
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
      dateOfBirth: "2026-04-27T06:45:18.651Z",
      paymentStatus: true,
      paymentMethod: "new value",
    };

    beforeEach(async () => {
      orderHistoryCreated = await thisService.Model.create({
        ...options,
        ...users,
      });
    });

    it("should create a new orderHistory", () => {
      assert.strictEqual(
        orderHistoryCreated.orderNumber.toString(),
        options.orderNumber.toString(),
      );
      assert.strictEqual(
        orderHistoryCreated.customer.toString(),
        options.customer.toString(),
      );
    });
  });

  describe("#get", () => {
    it("should retrieve a orderHistory by ID", async () => {
      const retrieved = await thisService.Model.findById(
        orderHistoryCreated._id,
      );
      assert.strictEqual(
        retrieved._id.toString(),
        orderHistoryCreated._id.toString(),
      );
    });
  });

  describe("#update", () => {
    const options = {
      orderNumber: `${checkoutCreated._id}`,
      customer: `${customerDetailsCreated._id}`,
    };

    it("should update an existing orderHistory ", async () => {
      const orderHistoryUpdated = await thisService.Model.findByIdAndUpdate(
        orderHistoryCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(
        orderHistoryUpdated.orderNumber.toString(),
        options.orderNumber.toString(),
      );
      assert.strictEqual(
        orderHistoryUpdated.customer.toString(),
        options.customer.toString(),
      );
    });
  });

  describe("#delete", async () => {
    it("should delete a orderHistory", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app
        .service("customerAddress")
        .Model.findByIdAndDelete(customerAddressCreated._id);
      await app
        .service("customerDetails")
        .Model.findByIdAndDelete(customerDetailsCreated._id);
      await app
        .service("checkout")
        .Model.findByIdAndDelete(checkoutCreated._id);

      const orderHistoryDeleted = await thisService.Model.findByIdAndDelete(
        orderHistoryCreated._id,
      );
      assert.strictEqual(
        orderHistoryDeleted._id.toString(),
        orderHistoryCreated._id.toString(),
      );
    });
  });
});
