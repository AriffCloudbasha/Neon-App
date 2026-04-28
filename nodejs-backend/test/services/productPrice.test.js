const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("productPrice service", async () => {
  let thisService;
  let productPriceCreated;
  let usersServiceResults;
  let users;

  beforeEach(async () => {
    thisService = await app.service("productPrice");

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
    assert.ok(thisService, "Registered the service (productPrice)");
  });

  describe("#create", () => {
    const options = {
      basePrice: "new value",
      discountedPrice: "new value",
      taxPercentage: "new value",
    };

    beforeEach(async () => {
      productPriceCreated = await thisService.Model.create({
        ...options,
        ...users,
      });
    });

    it("should create a new productPrice", () => {
      assert.strictEqual(productPriceCreated.basePrice, options.basePrice);
      assert.strictEqual(
        productPriceCreated.discountedPrice,
        options.discountedPrice,
      );
      assert.strictEqual(
        productPriceCreated.taxPercentage,
        options.taxPercentage,
      );
    });
  });

  describe("#get", () => {
    it("should retrieve a productPrice by ID", async () => {
      const retrieved = await thisService.Model.findById(
        productPriceCreated._id,
      );
      assert.strictEqual(
        retrieved._id.toString(),
        productPriceCreated._id.toString(),
      );
    });
  });

  describe("#update", () => {
    const options = {
      basePrice: "updated value",
      discountedPrice: "updated value",
      taxPercentage: "updated value",
    };

    it("should update an existing productPrice ", async () => {
      const productPriceUpdated = await thisService.Model.findByIdAndUpdate(
        productPriceCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(productPriceUpdated.basePrice, options.basePrice);
      assert.strictEqual(
        productPriceUpdated.discountedPrice,
        options.discountedPrice,
      );
      assert.strictEqual(
        productPriceUpdated.taxPercentage,
        options.taxPercentage,
      );
    });
  });

  describe("#delete", async () => {
    it("should delete a productPrice", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      const productPriceDeleted = await thisService.Model.findByIdAndDelete(
        productPriceCreated._id,
      );
      assert.strictEqual(
        productPriceDeleted._id.toString(),
        productPriceCreated._id.toString(),
      );
    });
  });
});
