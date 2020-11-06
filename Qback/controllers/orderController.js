const { Order, CartItem } = require("../models/order");
const { errorHandler } = require("../helpers/dbErrorHandler");

// Creating order for authenticated users
exports.createOrder = (req, res) => {
  // console.log(req.body);
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, data) => {
    if (err) {
      return res.status(400).json({
        status: "Failed",
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

// Creating orders for guest users
exports.createGuestOrder = (req, res) => {
  console.log("profile", req.profile);
  console.log("guest order", req.body);
  const order = new Order(req.body.order);
  order.save((err, data) => {
    if (err) {
      return res.status(400).json({
        status: "Failed",
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.listOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name address")
    .sort("-created")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          status: "Failed",
          error: errorHandler(err),
        });
      }
      res.json(orders);
    });
};
