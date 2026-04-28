import { faker } from "@faker-js/faker";
export default (user, count, orderNumberIds, customerIds) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      orderNumber: orderNumberIds[i % orderNumberIds.length],
      customer: customerIds[i % customerIds.length],

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
