import { faker } from "@faker-js/faker";
export default (user, count, skuIds, productPriceIds) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      sku: skuIds[i % skuIds.length],
      quantity: faker.datatype.number("8"),
      productPrice: productPriceIds[i % productPriceIds.length],
      amount: faker.lorem.sentence("8"),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
