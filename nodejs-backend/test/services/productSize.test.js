const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("productSize service", async () => {
  let thisService;
  let productSizeCreated;
  let usersServiceResults;
  let users;

  beforeEach(async () => {
    thisService = await app.service("productSize");

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
    assert.ok(thisService, "Registered the service (productSize)");
  });

  describe("#create", () => {
    const options = { sizeCategory: "new value", sizeValue: "new value" };

    beforeEach(async () => {
      productSizeCreated = await thisService.Model.create({
        ...options,
        ...users,
      });
    });

    it("should create a new productSize", () => {
      assert.strictEqual(productSizeCreated.sizeCategory, options.sizeCategory);
      assert.strictEqual(productSizeCreated.sizeValue, options.sizeValue);
    });
  });

  describe("#get", () => {
    it("should retrieve a productSize by ID", async () => {
      const retrieved = await thisService.Model.findById(
        productSizeCreated._id,
      );
      assert.strictEqual(
        retrieved._id.toString(),
        productSizeCreated._id.toString(),
      );
    });
  });

  describe("#update", () => {
    const options = {
      sizeCategory: "updated value",
      sizeValue: "updated value",
    };

    it("should update an existing productSize ", async () => {
      const productSizeUpdated = await thisService.Model.findByIdAndUpdate(
        productSizeCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(productSizeUpdated.sizeCategory, options.sizeCategory);
      assert.strictEqual(productSizeUpdated.sizeValue, options.sizeValue);
    });
  });

  describe("#delete", async () => {
    it("should delete a productSize", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      const productSizeDeleted = await thisService.Model.findByIdAndDelete(
        productSizeCreated._id,
      );
      assert.strictEqual(
        productSizeDeleted._id.toString(),
        productSizeCreated._id.toString(),
      );
    });
  });
});
