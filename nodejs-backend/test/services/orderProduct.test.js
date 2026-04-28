const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("orderProduct service", async () => {
  let thisService;
  let orderProductCreated;
  let usersServiceResults;
  let users;

  const productColorCreated = await app.service("productColor").Model.create({
    productName: "parentObjectId",
    productTitle: "new value",
    description: "new value",
    productColour: "parentObjectId",
    colorName: "new value",
    colorCode: "new value",
  });
  const productPriceCreated = await app.service("productPrice").Model.create({
    productName: "parentObjectId",
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
    productName: "parentObjectId",
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
    productName: "new value",
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
    customerName: "new value",
    starRating: 23,
  });
  const productPriceCreated = await app.service("productPrice").Model.create({
    productName: "new value",
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
    customerName: "new value",
    starRating: 23,
    category: "new value",
    type: "new value",
    gender: ["new value"],
    isSale: "parentObjectId",
  });
  const categoryCreated = await app.service("category").Model.create({
    productName: "new value",
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
    customerName: "new value",
    starRating: 23,
    category: "new value",
    type: "new value",
    gender: ["new value"],
    isSale: `${productPriceCreated._id}`,
  });
  const productCreated = await app.service("product").Model.create({
    productName: "new value",
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
    customerName: "new value",
    starRating: 23,
    category: `${categoryCreated._id}`,
    type: "new value",
    gender: ["new value"],
    isSale: `${productPriceCreated._id}`,
    sku: "new value",
    productImage: "new value",
    smallImage: "new value",
  });
  const productCreated = await app.service("product").Model.create({
    productName: `${productCreated._id}`,
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
    customerName: "new value",
    starRating: 23,
    category: "parentObjectId",
    type: "new value",
    gender: ["new value"],
    isSale: `${productPriceCreated._id}`,
    sku: "new value",
    productImage: "new value",
    smallImage: "new value",
    quantity: "parentObjectId",
  });
  const productCreated = await app.service("product").Model.create({
    productName: `${productCreated._id}`,
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
    customerName: "new value",
    starRating: 23,
    category: "parentObjectId",
    type: "new value",
    gender: ["new value"],
    isSale: `${productPriceCreated._id}`,
    sku: "new value",
    productImage: "new value",
    smallImage: "new value",
    quantity: "parentObjectId",
    product: "parentObjectId",
  });
  const itemsCreated = await app.service("items").Model.create({
    productName: `${productCreated._id}`,
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
    customerName: "new value",
    starRating: 23,
    category: "parentObjectId",
    type: "new value",
    gender: ["new value"],
    isSale: `${productPriceCreated._id}`,
    sku: "new value",
    productImage: "new value",
    smallImage: "new value",
    quantity: "new value",
    product: `${productCreated._id}`,
    amount: "new value",
  });
  const productColorCreated = await app.service("productColor").Model.create({
    productName: `${productCreated._id}`,
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
    customerName: "new value",
    starRating: 23,
    category: "parentObjectId",
    type: "new value",
    gender: ["new value"],
    isSale: `${productPriceCreated._id}`,
    sku: "new value",
    productImage: "new value",
    smallImage: "new value",
    quantity: `${itemsCreated._id}`,
    product: `${productCreated._id}`,
    amount: "new value",
    selectedColor: "parentObjectId",
  });
  const productSizeCreated = await app.service("productSize").Model.create({
    productName: `${productCreated._id}`,
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
    customerName: "new value",
    starRating: 23,
    category: "parentObjectId",
    type: "new value",
    gender: ["new value"],
    isSale: `${productPriceCreated._id}`,
    sku: "new value",
    productImage: "new value",
    smallImage: "new value",
    quantity: `${itemsCreated._id}`,
    product: `${productCreated._id}`,
    amount: "new value",
    selectedColor: `${productColorCreated._id}`,
    selectedSize: "parentObjectId",
  });
  const productPriceCreated = await app.service("productPrice").Model.create({
    productName: `${productCreated._id}`,
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
    customerName: "new value",
    starRating: 23,
    category: "parentObjectId",
    type: "new value",
    gender: ["new value"],
    isSale: `${productPriceCreated._id}`,
    sku: "new value",
    productImage: "new value",
    smallImage: "new value",
    quantity: `${itemsCreated._id}`,
    product: `${productCreated._id}`,
    amount: "new value",
    selectedColor: `${productColorCreated._id}`,
    selectedSize: `${productSizeCreated._id}`,
    unitPrice: "parentObjectId",
  });
  const customerAddressCreated = await app
    .service("customerAddress")
    .Model.create({
      productName: `${productCreated._id}`,
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
      customerName: "new value",
      starRating: 23,
      category: "parentObjectId",
      type: "new value",
      gender: ["new value"],
      isSale: `${productPriceCreated._id}`,
      sku: "new value",
      productImage: "new value",
      smallImage: "new value",
      quantity: `${itemsCreated._id}`,
      product: `${productCreated._id}`,
      amount: "new value",
      selectedColor: `${productColorCreated._id}`,
      selectedSize: `${productSizeCreated._id}`,
      unitPrice: `${productPriceCreated._id}`,
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
      productName: `${productCreated._id}`,
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
      customerName: "new value",
      starRating: 23,
      category: "parentObjectId",
      type: "new value",
      gender: ["new value"],
      isSale: `${productPriceCreated._id}`,
      sku: "new value",
      productImage: "new value",
      smallImage: "new value",
      quantity: `${itemsCreated._id}`,
      product: `${productCreated._id}`,
      amount: "new value",
      selectedColor: `${productColorCreated._id}`,
      selectedSize: `${productSizeCreated._id}`,
      unitPrice: `${productPriceCreated._id}`,
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
      dateOfBirth: "2026-04-27T06:45:18.638Z",
    });
  const checkoutCreated = await app.service("checkout").Model.create({
    productName: `${productCreated._id}`,
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
    customerName: "new value",
    starRating: 23,
    category: "parentObjectId",
    type: "new value",
    gender: ["new value"],
    isSale: `${productPriceCreated._id}`,
    sku: "new value",
    productImage: "new value",
    smallImage: "new value",
    quantity: `${itemsCreated._id}`,
    product: `${productCreated._id}`,
    amount: "new value",
    selectedColor: `${productColorCreated._id}`,
    selectedSize: `${productSizeCreated._id}`,
    unitPrice: `${productPriceCreated._id}`,
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
    dateOfBirth: "2026-04-27T06:45:18.638Z",
    paymentStatus: true,
    paymentMethod: "new value",
  });

  beforeEach(async () => {
    thisService = await app.service("orderProduct");

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
    assert.ok(thisService, "Registered the service (orderProduct)");
  });

  describe("#create", () => {
    const options = {
      productName: `${productCreated._id}`,
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
      customerName: "new value",
      starRating: 23,
      category: "parentObjectId",
      type: "new value",
      gender: ["new value"],
      isSale: `${productPriceCreated._id}`,
      sku: "new value",
      productImage: "new value",
      smallImage: "new value",
      quantity: `${itemsCreated._id}`,
      product: `${productCreated._id}`,
      amount: "new value",
      selectedColor: `${productColorCreated._id}`,
      selectedSize: `${productSizeCreated._id}`,
      unitPrice: `${productPriceCreated._id}`,
      orderNumber: `${checkoutCreated._id}`,
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
      dateOfBirth: "2026-04-27T06:45:18.638Z",
      paymentStatus: true,
      paymentMethod: "new value",
    };

    beforeEach(async () => {
      orderProductCreated = await thisService.Model.create({
        ...options,
        ...users,
      });
    });

    it("should create a new orderProduct", () => {
      assert.strictEqual(
        orderProductCreated.productName.toString(),
        options.productName.toString(),
      );
      assert.strictEqual(
        orderProductCreated.quantity.toString(),
        options.quantity.toString(),
      );
      assert.strictEqual(
        orderProductCreated.selectedColor.toString(),
        options.selectedColor.toString(),
      );
      assert.strictEqual(
        orderProductCreated.selectedSize.toString(),
        options.selectedSize.toString(),
      );
      assert.strictEqual(
        orderProductCreated.unitPrice.toString(),
        options.unitPrice.toString(),
      );
      assert.strictEqual(
        orderProductCreated.orderNumber.toString(),
        options.orderNumber.toString(),
      );
    });
  });

  describe("#get", () => {
    it("should retrieve a orderProduct by ID", async () => {
      const retrieved = await thisService.Model.findById(
        orderProductCreated._id,
      );
      assert.strictEqual(
        retrieved._id.toString(),
        orderProductCreated._id.toString(),
      );
    });
  });

  describe("#update", () => {
    const options = {
      productName: `${productCreated._id}`,
      quantity: `${itemsCreated._id}`,
      selectedColor: `${productColorCreated._id}`,
      selectedSize: `${productSizeCreated._id}`,
      unitPrice: `${productPriceCreated._id}`,
      orderNumber: `${checkoutCreated._id}`,
    };

    it("should update an existing orderProduct ", async () => {
      const orderProductUpdated = await thisService.Model.findByIdAndUpdate(
        orderProductCreated._id,
        options,
        { new: true }, // Ensure it returns the updated doc
      );
      assert.strictEqual(
        orderProductUpdated.productName.toString(),
        options.productName.toString(),
      );
      assert.strictEqual(
        orderProductUpdated.quantity.toString(),
        options.quantity.toString(),
      );
      assert.strictEqual(
        orderProductUpdated.selectedColor.toString(),
        options.selectedColor.toString(),
      );
      assert.strictEqual(
        orderProductUpdated.selectedSize.toString(),
        options.selectedSize.toString(),
      );
      assert.strictEqual(
        orderProductUpdated.unitPrice.toString(),
        options.unitPrice.toString(),
      );
      assert.strictEqual(
        orderProductUpdated.orderNumber.toString(),
        options.orderNumber.toString(),
      );
    });
  });

  describe("#delete", async () => {
    it("should delete a orderProduct", async () => {
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
      await app.service("items").Model.findByIdAndDelete(itemsCreated._id);
      await app
        .service("customerAddress")
        .Model.findByIdAndDelete(customerAddressCreated._id);
      await app
        .service("customerDetails")
        .Model.findByIdAndDelete(customerDetailsCreated._id);
      await app
        .service("checkout")
        .Model.findByIdAndDelete(checkoutCreated._id);

      const orderProductDeleted = await thisService.Model.findByIdAndDelete(
        orderProductCreated._id,
      );
      assert.strictEqual(
        orderProductDeleted._id.toString(),
        orderProductCreated._id.toString(),
      );
    });
  });
});
