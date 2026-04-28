const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("product service", async () => {
  let thisService;
  let productCreated;
  let usersServiceResults;
  let users;

  const productColorCreated = await app.service("productColor").Model.create({
    productTitle: "new value",
    description: "new value",
    productColour: "parentObjectId",
    colorName: "new value",
    colorCode: "new value",
  });
  const productPriceCreated = await app.service("productPrice").Model.create({
    productTitle: "new value",
    description: "new value",
    productColour: `${productColorCreated._id}`,
    colorName: "new value",
    colorCode: "new value",
    productPrice: "parentObjectId",
    basePrice: "new value",
    discountedPrice: "new value",
    taxPercentage: "new value",
  });
  const productSizeCreated = await app.service("productSize").Model.create({
    productTitle: "new value",
    description: "new value",
    productColour: `${productColorCreated._id}`,
    colorName: "new value",
    colorCode: "new value",
    productPrice: `${productPriceCreated._id}`,
    basePrice: "new value",
    discountedPrice: "new value",
    taxPercentage: "new value",
    productSize: "parentObjectId",
    sizeCategory: "new value",
    sizeValue: "new value",
  });
  const productRatingCreated = await app.service("productRating").Model.create({
    productTitle: "new value",
    description: "new value",
    productColour: `${productColorCreated._id}`,
    colorName: "new value",
    colorCode: "new value",
    productPrice: `${productPriceCreated._id}`,
    basePrice: "new value",
    discountedPrice: "new value",
    taxPercentage: "new value",
    productSize: `${productSizeCreated._id}`,
    sizeCategory: "new value",
    sizeValue: "new value",
    productRating: "parentObjectId",
    productName: "new value",
    customerName: "new value",
    starRating: 23,
  });
  const productPriceCreated = await app.service("productPrice").Model.create({
    productTitle: "new value",
    description: "new value",
    productColour: `${productColorCreated._id}`,
    colorName: "new value",
    colorCode: "new value",
    productPrice: `${productPriceCreated._id}`,
    basePrice: "new value",
    discountedPrice: "new value",
    taxPercentage: "new value",
    productSize: `${productSizeCreated._id}`,
    sizeCategory: "new value",
    sizeValue: "new value",
    productRating: `${productRatingCreated._id}`,
    productName: "new value",
    customerName: "new value",
    starRating: 23,
    category: "new value",
    type: "new value",
    gender: ["new value"],
    isSale: "parentObjectId",
  });
  const categoryCreated = await app.service("category").Model.create({
    productTitle: "new value",
    description: "new value",
    productColour: `${productColorCreated._id}`,
    colorName: "new value",
    colorCode: "new value",
    productPrice: `${productPriceCreated._id}`,
    basePrice: "new value",
    discountedPrice: "new value",
    taxPercentage: "new value",
    productSize: `${productSizeCreated._id}`,
    sizeCategory: "new value",
    sizeValue: "new value",
    productRating: `${productRatingCreated._id}`,
    productName: "new value",
    customerName: "new value",
    starRating: 23,
    category: "new value",
    type: "new value",
    gender: ["new value"],
    isSale: `${productPriceCreated._id}`,
  });

  beforeEach(async () => {
    thisService = await app.service("product");

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
    assert.ok(thisService, "Registered the service (product)");
  });

  describe("#create", () => {
    const options = {
      productTitle: "new value",
      description: "new value",
      productColour: `${productColorCreated._id}`,
      colorName: "new value",
      colorCode: "new value",
      productPrice: `${productPriceCreated._id}`,
      basePrice: "new value",
      discountedPrice: "new value",
      taxPercentage: "new value",
      productSize: `${productSizeCreated._id}`,
      sizeCategory: "new value",
      sizeValue: "new value",
      productRating: `${productRatingCreated._id}`,
      productName: "new value",
      customerName: "new value",
      starRating: 23,
      category: `${categoryCreated._id}`,
      type: "new value",
      gender: ["new value"],
      isSale: `${productPriceCreated._id}`,
      sku: "new value",
      productImage: "new value",
      smallImage: "new value",
    };

    beforeEach(async () => {
      productCreated = await thisService.Model.create({ ...options, ...users });
    });

    it("should create a new product", () => {
      assert.strictEqual(productCreated.productTitle, options.productTitle);
      assert.strictEqual(productCreated.description, options.description);
      assert.strictEqual(
        productCreated.productColour.toString(),
        options.productColour.toString(),
      );
      assert.strictEqual(
        productCreated.productPrice.toString(),
        options.productPrice.toString(),
      );
      assert.strictEqual(
        productCreated.productSize.toString(),
        options.productSize.toString(),
      );
      assert.strictEqual(
        productCreated.productRating.toString(),
        options.productRating.toString(),
      );
      assert.strictEqual(
        productCreated.category.toString(),
        options.category.toString(),
      );
      assert.strictEqual(productCreated.sku, options.sku);
      assert.strictEqual(productCreated.productImage, options.productImage);
      assert.strictEqual(productCreated.smallImage, options.smallImage);
    });
  });

  describe("#get", () => {
    it("should retrieve a product by ID", async () => {
      const retrieved = await thisService.Model.findById(productCreated._id);
      assert.strictEqual(
        retrieved._id.toString(),
        productCreated._id.toString(),
      );
    });
  });

  describe("#update", () => {
    const options = {
      productTitle: "updated value",
      description: "updated value",
      productColour: `${productColorCreated._id}`,
      productPrice: `${productPriceCreated._id}`,
      productSize: `${productSizeCreated._id}`,
      productRating: `${productRatingCreated._id}`,
      category: `${categoryCreated._id}`,
      sku: "updated value",
      productImage: "updated value",
      smallImage: "updated value",
    };

    it("should update an existing product ", async () => {
      const productUpdated = await thisService.Model.findByIdAndUpdate(
        productCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(productUpdated.productTitle, options.productTitle);
      assert.strictEqual(productUpdated.description, options.description);
      assert.strictEqual(
        productUpdated.productColour.toString(),
        options.productColour.toString(),
      );
      assert.strictEqual(
        productUpdated.productPrice.toString(),
        options.productPrice.toString(),
      );
      assert.strictEqual(
        productUpdated.productSize.toString(),
        options.productSize.toString(),
      );
      assert.strictEqual(
        productUpdated.productRating.toString(),
        options.productRating.toString(),
      );
      assert.strictEqual(
        productUpdated.category.toString(),
        options.category.toString(),
      );
      assert.strictEqual(productUpdated.sku, options.sku);
      assert.strictEqual(productUpdated.productImage, options.productImage);
      assert.strictEqual(productUpdated.smallImage, options.smallImage);
    });
  });

  describe("#delete", async () => {
    it("should delete a product", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app
        .service("productColor")
        .Model.findByIdAndDelete(productColorCreated._id);
      await app
        .service("productPrice")
        .Model.findByIdAndDelete(productPriceCreated._id);
      await app
        .service("productSize")
        .Model.findByIdAndDelete(productSizeCreated._id);
      await app
        .service("productRating")
        .Model.findByIdAndDelete(productRatingCreated._id);
      await app
        .service("category")
        .Model.findByIdAndDelete(categoryCreated._id);

      const productDeleted = await thisService.Model.findByIdAndDelete(
        productCreated._id,
      );
      assert.strictEqual(
        productDeleted._id.toString(),
        productCreated._id.toString(),
      );
    });
  });
});
