const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("category service", async () => {
  let thisService;
  let categoryCreated;
  let usersServiceResults;
  let users;

  const productPriceCreated = await app.service("productPrice").Model.create({
    type: "new value",
    category: "new value",
    gender: ["new value"],
    isSale: "parentObjectId",
    basePrice: "new value",
    discountedPrice: "new value",
    taxPercentage: "new value",
  });

  beforeEach(async () => {
    thisService = await app.service("category");

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
    assert.ok(thisService, "Registered the service (category)");
  });

  describe("#create", () => {
    const options = {
      type: "new value",
      category: "new value",
      gender: ["new value"],
      isSale: `${productPriceCreated._id}`,
      basePrice: "new value",
      discountedPrice: "new value",
      taxPercentage: "new value",
    };

    beforeEach(async () => {
      categoryCreated = await thisService.Model.create({
        ...options,
        ...users,
      });
    });

    it("should create a new category", () => {
      assert.strictEqual(categoryCreated.type, options.type);
      assert.strictEqual(categoryCreated.category, options.category);
      assert.strictEqual(categoryCreated.gender, options.gender);
      assert.strictEqual(
        categoryCreated.isSale.toString(),
        options.isSale.toString(),
      );
    });
  });

  describe("#get", () => {
    it("should retrieve a category by ID", async () => {
      const retrieved = await thisService.Model.findById(categoryCreated._id);
      assert.strictEqual(
        retrieved._id.toString(),
        categoryCreated._id.toString(),
      );
    });
  });

  describe("#update", () => {
    const options = {
      type: "updated value",
      category: "updated value",
      gender: ["updated value"],
      isSale: `${productPriceCreated._id}`,
    };

    it("should update an existing category ", async () => {
      const categoryUpdated = await thisService.Model.findByIdAndUpdate(
        categoryCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(categoryUpdated.type, options.type);
      assert.strictEqual(categoryUpdated.category, options.category);
      assert.strictEqual(categoryUpdated.gender, options.gender);
      assert.strictEqual(
        categoryUpdated.isSale.toString(),
        options.isSale.toString(),
      );
    });
  });

  describe("#delete", async () => {
    it("should delete a category", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app
        .service("productPrice")
        .Model.findByIdAndDelete(productPriceCreated._id);

      const categoryDeleted = await thisService.Model.findByIdAndDelete(
        categoryCreated._id,
      );
      assert.strictEqual(
        categoryDeleted._id.toString(),
        categoryCreated._id.toString(),
      );
    });
  });
});
