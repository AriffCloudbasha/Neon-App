const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("productRating service", async () => {
  let thisService;
  let productRatingCreated;
  let usersServiceResults;
  let users;

  beforeEach(async () => {
    thisService = await app.service("productRating");

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
    assert.ok(thisService, "Registered the service (productRating)");
  });

  describe("#create", () => {
    const options = {
      productName: "new value",
      customerName: "new value",
      starRating: 23,
    };

    beforeEach(async () => {
      productRatingCreated = await thisService.Model.create({
        ...options,
        ...users,
      });
    });

    it("should create a new productRating", () => {
      assert.strictEqual(productRatingCreated.productName, options.productName);
      assert.strictEqual(
        productRatingCreated.customerName,
        options.customerName,
      );
      assert.strictEqual(productRatingCreated.starRating, options.starRating);
    });
  });

  describe("#get", () => {
    it("should retrieve a productRating by ID", async () => {
      const retrieved = await thisService.Model.findById(
        productRatingCreated._id,
      );
      assert.strictEqual(
        retrieved._id.toString(),
        productRatingCreated._id.toString(),
      );
    });
  });

  describe("#update", () => {
    const options = {
      productName: "updated value",
      customerName: "updated value",
      starRating: 100,
    };

    it("should update an existing productRating ", async () => {
      const productRatingUpdated = await thisService.Model.findByIdAndUpdate(
        productRatingCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(productRatingUpdated.productName, options.productName);
      assert.strictEqual(
        productRatingUpdated.customerName,
        options.customerName,
      );
      assert.strictEqual(productRatingUpdated.starRating, options.starRating);
    });
  });

  describe("#delete", async () => {
    it("should delete a productRating", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      const productRatingDeleted = await thisService.Model.findByIdAndDelete(
        productRatingCreated._id,
      );
      assert.strictEqual(
        productRatingDeleted._id.toString(),
        productRatingCreated._id.toString(),
      );
    });
  });
});
