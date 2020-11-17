const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appErrors");

exports.userById = async (req, res, next, id) => {
  await User.findById(id).exec((err, user) => {
    if (err || !user) {
      return next(new AppError("User not found", 400));
    }
    req.profile = user;
    next();
  });
};

exports.readUser = (req, res) => {
  return res.json(req.profile);
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password)
    return next(
      new AppError(
        "This route is not for password updates. Please use click on 'Change Password' to create a new password"
      )
    );

  res.status(200).json({
    status: "success",
    message: "User succefully updated",
  });
});

exports.updateUser = async (req, res, next) => {
  await User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        return next(
          new AppError("You are not authorized to perform this action", 400)
        );
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    }
  );
};

exports.addOrderToHistory = async (req, res, next) => {
  let history = [];

  req.body.order.products.forEach((item) => {
    history.push({
      _id: item._id,
      name: item.name,
      quantity: item.count,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount,
    });
  });

  await User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { history: history } },
    { new: true },
    (err, data) => {
      if (err) {
        return res.status(400).json({
          status: "Failed",
          error: "Could not update user purchase history",
        });
      }

      next();
    }
  );
};

// Adding product to vendor : INITIATED
exports.addProductToUser = (req, res, next) => {
  let products = [];
  console.log(req.body);
  next();
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: users,
  });
});
