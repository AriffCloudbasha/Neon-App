const category = require("./category/category.service.js");
const product = require("./product/product.service.js");
const productColor = require("./productColor/productColor.service.js");
const productPrice = require("./productPrice/productPrice.service.js");
const productSize = require("./productSize/productSize.service.js");
const productRating = require("./productRating/productRating.service.js");
const cart = require("./cart/cart.service.js");
const cartItems = require("./cartItems/cartItems.service.js");
const checkout = require("./checkout/checkout.service.js");
const customerDetails = require("./customerDetails/customerDetails.service.js");
const customerAddress = require("./customerAddress/customerAddress.service.js");
const order = require("./order/order.service.js");
const items = require("./items/items.service.js");
const orderProduct = require("./orderProduct/orderProduct.service.js");
const orderHistory = require("./orderHistory/orderHistory.service.js");
const userDetails = require("./userDetails/userDetails.service.js");
// ~cb-add-require-service-name~

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(category);
  app.configure(product);
  app.configure(productColor);
  app.configure(productPrice);
  app.configure(productSize);
  app.configure(productRating);
  app.configure(cart);
  app.configure(cartItems);
  app.configure(checkout);
  app.configure(customerDetails);
  app.configure(customerAddress);
  app.configure(order);
  app.configure(items);
  app.configure(orderProduct);
  app.configure(orderHistory);
  app.configure(userDetails);
  // ~cb-add-configure-service-name~
};
