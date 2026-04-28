import { faker } from "@faker-js/faker";
export default (user, count, isSaleIds) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      type: faker.lorem.sentence("8"),
      category: faker.lorem.sentence(1),
      gender: "Female",
      isSale: isSaleIds[i % isSaleIds.length],

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
