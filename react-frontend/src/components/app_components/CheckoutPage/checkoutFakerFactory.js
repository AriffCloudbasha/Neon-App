import { faker } from "@faker-js/faker";
export default (user, count, customerIds) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      orderNumber: faker.lorem.sentence(1),
      customer: customerIds[i % customerIds.length],
      paymentStatus: faker.lorem.sentence(1),
      paymentMethod: faker.lorem.sentence(1),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
