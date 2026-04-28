import { faker } from "@faker-js/faker";
export default (
  user,
  count,
  productPriceIds,
  productSizeIds,
  productRatingIds,
  categoryIds,
) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      productTitle: faker.lorem.sentence("8"),
      description: faker.lorem.sentence(""),
      productPrice: productPriceIds[i % productPriceIds.length],
      productSize: productSizeIds[i % productSizeIds.length],
      productRating: productRatingIds[i % productRatingIds.length],
      category: categoryIds[i % categoryIds.length],
      sku: faker.lorem.sentence(""),
      productImage: faker.lorem.sentence("8"),
      smallImage: faker.lorem.sentence("8"),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
