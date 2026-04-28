import { faker } from "@faker-js/faker";
export default (user, count) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      productName: faker.lorem.sentence(1),
      customerName: faker.datatype.number("8"),
      starRating: faker.datatype.number(""),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
