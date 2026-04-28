const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("order service", async () => {
  let thisService;
  let orderCreated;
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
      dateOfBirth: "2026-04-27T06:45:18.605Z",
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
    dateOfBirth: "2026-04-27T06:45:18.605Z",
    paymentStatus: true,
    paymentMethod: "new value",
  });
  const customerDetailsCreated = await app
    .service("customerDetails")
    .Model.create({
      orderNumber: `${checkoutCreated._id}`,
      customer: `${customerDetailsCreated._id}`,
      customers: "new value",
      customerEmail: "new value",
      customerAddress: "parentObjectId",
      addressType: "new value",
      country: "new value",
      addressLine1: "new value",
      addressLine2: "new value",
      city: "new value",
      postalCode: 23,
      phoneNumber: "new value",
      gender: ["new value"],
      dateOfBirth: "2026-04-27T06:45:18.605Z",
      paymentStatus: true,
      paymentMethod: "new value",
      customerName: "parentObjectId",
    });

  beforeEach(async () => {
    thisService = await app.service("order");

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
    assert.ok(thisService, "Registered the service (order)");
  });

  describe("#create", () => {
    const options = {
      orderNumber: `${checkoutCreated._id}`,
      customer: `${customerDetailsCreated._id}`,
      customers: "new value",
      customerEmail: "new value",
      customerAddress: "parentObjectId",
      addressType: "new value",
      country: "new value",
      addressLine1: "new value",
      addressLine2: "new value",
      city: "new value",
      postalCode: 23,
      phoneNumber: "new value",
      gender: ["new value"],
      dateOfBirth: "2026-04-27T06:45:18.605Z",
      paymentStatus: true,
      paymentMethod: "new value",
      customerName: `${customerDetailsCreated._id}`,
      total: 23,
      date: "2026-04-27T06:45:18.605Z",
    };

    beforeEach(async () => {
      orderCreated = await thisService.Model.create({ ...options, ...users });
    });

    it("should create a new order", () => {
      assert.strictEqual(
        orderCreated.orderNumber.toString(),
        options.orderNumber.toString(),
      );
      assert.strictEqual(
        orderCreated.customerName.toString(),
        options.customerName.toString(),
      );
      assert.strictEqual(orderCreated.total, options.total);
      assert.strictEqual(orderCreated.date.toISOString(), options.date);
    });
  });

  describe("#get", () => {
    it("should retrieve a order by ID", async () => {
      const retrieved = await thisService.Model.findById(orderCreated._id);
      assert.strictEqual(retrieved._id.toString(), orderCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {
      orderNumber: `${checkoutCreated._id}`,
      customerName: `${customerDetailsCreated._id}`,
      total: 100,
      date: "2026-04-27T06:45:18.605Z",
    };

    it("should update an existing order ", async () => {
      const orderUpdated = await thisService.Model.findByIdAndUpdate(
        orderCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(
        orderUpdated.orderNumber.toString(),
        options.orderNumber.toString(),
      );
      assert.strictEqual(
        orderUpdated.customerName.toString(),
        options.customerName.toString(),
      );
      assert.strictEqual(orderUpdated.total, options.total);
      assert.strictEqual(orderUpdated.date.toISOString(), options.date);
    });
  });

  describe("#delete", async () => {
    it("should delete a order", async () => {
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

      const orderDeleted = await thisService.Model.findByIdAndDelete(
        orderCreated._id,
      );
      assert.strictEqual(
        orderDeleted._id.toString(),
        orderCreated._id.toString(),
      );
    });
  });
});
