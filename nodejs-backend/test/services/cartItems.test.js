const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("cartItems service", async () => {
  let thisService;
  let cartItemCreated;
  let usersServiceResults;
  let users;

  beforeEach(async () => {
    thisService = await app.service("cartItems");

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
    assert.ok(thisService, "Registered the service (cartItems)");
  });

  describe("#create", () => {
    const options = { productName: "new value", quantity: 23 };

    beforeEach(async () => {
      cartItemCreated = await thisService.Model.create({
        ...options,
        ...users,
      });
    });

    it("should create a new cartItem", () => {
      assert.strictEqual(cartItemCreated.productName, options.productName);
      assert.strictEqual(cartItemCreated.quantity, options.quantity);
    });
  });

  describe("#get", () => {
    it("should retrieve a cartItem by ID", async () => {
      const retrieved = await thisService.Model.findById(cartItemCreated._id);
      assert.strictEqual(
        retrieved._id.toString(),
        cartItemCreated._id.toString(),
      );
    });
  });

  describe("#update", () => {
    const options = { productName: "updated value", quantity: 100 };

    it("should update an existing cartItem ", async () => {
      const cartItemUpdated = await thisService.Model.findByIdAndUpdate(
        cartItemCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(cartItemUpdated.productName, options.productName);
      assert.strictEqual(cartItemUpdated.quantity, options.quantity);
    });
  });

  describe("#delete", async () => {
    it("should delete a cartItem", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      const cartItemDeleted = await thisService.Model.findByIdAndDelete(
        cartItemCreated._id,
      );
      assert.strictEqual(
        cartItemDeleted._id.toString(),
        cartItemCreated._id.toString(),
      );
    });
  });
});
