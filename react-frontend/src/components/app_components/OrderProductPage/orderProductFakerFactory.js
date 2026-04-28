import { faker } from "@faker-js/faker";
export default (
  user,
  count,
  productNameIds,
  quantityIds,
  selectedColorIds,
  selectedSizeIds,
  unitPriceIds,
  orderNumberIds,
) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      productName: productNameIds[i % productNameIds.length],
      quantity: quantityIds[i % quantityIds.length],
      selectedColor: selectedColorIds[i % selectedColorIds.length],
      selectedSize: selectedSizeIds[i % selectedSizeIds.length],
      unitPrice: unitPriceIds[i % unitPriceIds.length],
      orderNumber: orderNumberIds[i % orderNumberIds.length],

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
