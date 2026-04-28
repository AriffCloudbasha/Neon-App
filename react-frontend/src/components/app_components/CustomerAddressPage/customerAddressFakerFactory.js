import { faker } from "@faker-js/faker";
export default (user, count) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      addressType: faker.datatype.number(""),
      country: faker.datatype.number(""),
      addressLine1: faker.datatype.number(""),
      addressLine2: faker.datatype.number(""),
      city: faker.datatype.number(""),
      postalCode: faker.datatype.number(""),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
