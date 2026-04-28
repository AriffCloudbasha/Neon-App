import { faker } from "@faker-js/faker";
export default (user, count) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      basePrice: faker.lorem.sentence("8"),
      discountedPrice: faker.lorem.sentence("8"),
      taxPercentage: faker.lorem.sentence("8"),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
