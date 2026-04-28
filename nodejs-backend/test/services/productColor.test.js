const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("productColor service", async () => {
  let thisService;
  let productColorCreated;
  let usersServiceResults;
  let users;

  beforeEach(async () => {
    thisService = await app.service("productColor");

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
    assert.ok(thisService, "Registered the service (productColor)");
  });

  describe("#create", () => {
    const options = { colorName: "new value", colorCode: "new value" };

    beforeEach(async () => {
      productColorCreated = await thisService.Model.create({
        ...options,
        ...users,
      });
    });

    it("should create a new productColor", () => {
      assert.strictEqual(productColorCreated.colorName, options.colorName);
      assert.strictEqual(productColorCreated.colorCode, options.colorCode);
    });
  });

  describe("#get", () => {
    it("should retrieve a productColor by ID", async () => {
      const retrieved = await thisService.Model.findById(
        productColorCreated._id,
      );
      assert.strictEqual(
        retrieved._id.toString(),
        productColorCreated._id.toString(),
      );
    });
  });

  describe("#update", () => {
    const options = { colorName: "updated value", colorCode: "updated value" };

    it("should update an existing productColor ", async () => {
      const productColorUpdated = await thisService.Model.findByIdAndUpdate(
        productColorCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(productColorUpdated.colorName, options.colorName);
      assert.strictEqual(productColorUpdated.colorCode, options.colorCode);
    });
  });

  describe("#delete", async () => {
    it("should delete a productColor", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      const productColorDeleted = await thisService.Model.findByIdAndDelete(
        productColorCreated._id,
      );
      assert.strictEqual(
        productColorDeleted._id.toString(),
        productColorCreated._id.toString(),
      );
    });
  });
});
