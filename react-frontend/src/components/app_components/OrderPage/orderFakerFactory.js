import { faker } from "@faker-js/faker";
export default (user, count, orderNumberIds, customerNameIds) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      orderNumber: orderNumberIds[i % orderNumberIds.length],
      customerName: customerNameIds[i % customerNameIds.length],
      total: faker.date.past(""),
      date: faker.date.past(""),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
