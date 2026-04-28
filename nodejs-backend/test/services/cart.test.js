const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("cart service", async () => {
  let thisService;
  let cartCreated;
  let usersServiceResults;
  let users;

  const customerAddressCreated = await app
    .service("customerAddress")
    .Model.create({
      customerName: "parentObjectId",
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
      customerName: "parentObjectId",
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
      dateOfBirth: "2026-04-27T06:45:18.535Z",
    });
  const cartItemsCreated = await app.service("cartItems").Model.create({
    customerName: `${customerDetailsCreated._id}`,
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
    dateOfBirth: "2026-04-27T06:45:18.535Z",
    items: "parentObjectId",
    productName: "new value",
    quantity: 23,
  });

  beforeEach(async () => {
    thisService = await app.service("cart");

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
    assert.ok(thisService, "Registered the service (cart)");
  });

  describe("#create", () => {
    const options = {
      customerName: `${customerDetailsCreated._id}`,
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
      dateOfBirth: "2026-04-27T06:45:18.535Z",
      items: `${cartItemsCreated._id}`,
      productName: "new value",
      quantity: 23,
      subtotal: 23,
      total: 23,
      tax: 23,
    };

    beforeEach(async () => {
      cartCreated = await thisService.Model.create({ ...options, ...users });
    });

    it("should create a new cart", () => {
      assert.strictEqual(
        cartCreated.customerName.toString(),
        options.customerName.toString(),
      );
      assert.strictEqual(
        cartCreated.items.toString(),
        options.items.toString(),
      );
      assert.strictEqual(cartCreated.subtotal, options.subtotal);
      assert.strictEqual(cartCreated.total, options.total);
      assert.strictEqual(cartCreated.tax, options.tax);
    });
  });

  describe("#get", () => {
    it("should retrieve a cart by ID", async () => {
      const retrieved = await thisService.Model.findById(cartCreated._id);
      assert.strictEqual(retrieved._id.toString(), cartCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {
      customerName: `${customerDetailsCreated._id}`,
      items: `${cartItemsCreated._id}`,
      subtotal: 100,
      total: 100,
      tax: 100,
    };

    it("should update an existing cart ", async () => {
      const cartUpdated = await thisService.Model.findByIdAndUpdate(
        cartCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(
        cartUpdated.customerName.toString(),
        options.customerName.toString(),
      );
      assert.strictEqual(
        cartUpdated.items.toString(),
        options.items.toString(),
      );
      assert.strictEqual(cartUpdated.subtotal, options.subtotal);
      assert.strictEqual(cartUpdated.total, options.total);
      assert.strictEqual(cartUpdated.tax, options.tax);
    });
  });

  describe("#delete", async () => {
    it("should delete a cart", async () => {
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
        .service("cartItems")
        .Model.findByIdAndDelete(cartItemsCreated._id);

      const cartDeleted = await thisService.Model.findByIdAndDelete(
        cartCreated._id,
      );
      assert.strictEqual(
        cartDeleted._id.toString(),
        cartCreated._id.toString(),
      );
    });
  });
});
