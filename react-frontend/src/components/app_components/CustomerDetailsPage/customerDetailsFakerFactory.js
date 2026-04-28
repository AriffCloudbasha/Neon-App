import { faker } from "@faker-js/faker";
export default (user, count, customerAddressIds) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      customers: faker.lorem.sentence("8"),
      customerEmail: faker.date.past("8"),
      customerAddress: customerAddressIds[i % customerAddressIds.length],
      phoneNumber: faker.lorem.sentence(1),
      gender: faker.lorem.sentence(""),
      dateOfBirth: faker.date.past(""),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
