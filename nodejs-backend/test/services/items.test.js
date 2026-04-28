const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("items service", async () => {
  let thisService;
  let itemCreated;
  let usersServiceResults;
  let users;

  const productColorCreated = await app.service("productColor").Model.create({
    sku: "parentObjectId",
    productTitle: "new value",
    description: "new value",
    productColour: "parentObjectId",
    colorName: "new value",
    colorCode: "new value",
  });
  const productPriceCreated = await app.service("productPrice").Model.create({
    sku: "parentObjectId",
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
    sku: "parentObjectId",
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
    sku: "parentObjectId",
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
    sku: "parentObjectId",
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
    sku: "parentObjectId",
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
  const productCreated = await app.service("product").Model.create({
    sku: "new value",
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
    productImage: "new value",
    smallImage: "new value",
  });
  const productCreated = await app.service("product").Model.create({
    sku: "new value",
    productTitle: "new value",
    description: "new value",
    productColour: "parentObjectId",
    colorName: "new value",
    colorCode: "new value",
    productPrice: "parentObjectId",
    basePrice: "new value",
    discountedPrice: "new value",
    taxPercentage: "new value",
    productSize: "parentObjectId",
    sizeCategory: "new value",
    sizeValue: "new value",
    productRating: "parentObjectId",
    productName: "new value",
    customerName: "new value",
    starRating: 23,
    category: "parentObjectId",
    type: "new value",
    gender: ["new value"],
    isSale: `${productPriceCreated._id}`,
    productImage: "new value",
    smallImage: "new value",
    product: "parentObjectId",
  });

  beforeEach(async () => {
    thisService = await app.service("items");

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
    assert.ok(thisService, "Registered the service (items)");
  });

  describe("#create", () => {
    const options = {
      sku: "new value",
      productTitle: "new value",
      description: "new value",
      productColour: "parentObjectId",
      colorName: "new value",
      colorCode: "new value",
      productPrice: "parentObjectId",
      basePrice: "new value",
      discountedPrice: "new value",
      taxPercentage: "new value",
      productSize: "parentObjectId",
      sizeCategory: "new value",
      sizeValue: "new value",
      productRating: "parentObjectId",
      productName: "new value",
      customerName: "new value",
      starRating: 23,
      category: "parentObjectId",
      type: "new value",
      gender: ["new value"],
      isSale: `${productPriceCreated._id}`,
      productImage: "new value",
      smallImage: "new value",
      product: `${productCreated._id}`,
      quantity: "new value",
      amount: "new value",
    };

    beforeEach(async () => {
      itemCreated = await thisService.Model.create({ ...options, ...users });
    });

    it("should create a new item", () => {
      assert.strictEqual(itemCreated.sku.toString(), options.sku.toString());
      assert.strictEqual(
        itemCreated.product.toString(),
        options.product.toString(),
      );
      assert.strictEqual(itemCreated.quantity, options.quantity);
      assert.strictEqual(
        itemCreated.productPrice.toString(),
        options.productPrice.toString(),
      );
      assert.strictEqual(itemCreated.amount, options.amount);
    });
  });

  describe("#get", () => {
    it("should retrieve a item by ID", async () => {
      const retrieved = await thisService.Model.findById(itemCreated._id);
      assert.strictEqual(retrieved._id.toString(), itemCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {
      sku: `${productCreated._id}`,
      product: `${productCreated._id}`,
      quantity: "updated value",
      productPrice: `${productPriceCreated._id}`,
      amount: "updated value",
    };

    it("should update an existing item ", async () => {
      const itemUpdated = await thisService.Model.findByIdAndUpdate(
        itemCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(itemUpdated.sku.toString(), options.sku.toString());
      assert.strictEqual(
        itemUpdated.product.toString(),
        options.product.toString(),
      );
      assert.strictEqual(itemUpdated.quantity, options.quantity);
      assert.strictEqual(
        itemUpdated.productPrice.toString(),
        options.productPrice.toString(),
      );
      assert.strictEqual(itemUpdated.amount, options.amount);
    });
  });

  describe("#delete", async () => {
    it("should delete a item", async () => {
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
      await app.service("product").Model.findByIdAndDelete(productCreated._id);

      const itemDeleted = await thisService.Model.findByIdAndDelete(
        itemCreated._id,
      );
      assert.strictEqual(
        itemDeleted._id.toString(),
        itemCreated._id.toString(),
      );
    });
  });
});
