const COURSES = require("../constants/database").CURRENT_COURSES;
const USERS = require("../constants/database").USERS;
const User = require("../models/user");

const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.getCheckout = async (req, res, next) => {
  const productIds = req.body.products;
  const uid = req.get("uid");
  const products = [];

  const userIndex = USERS[0].findIndex(
    (u) => u._id.toString() === uid.toString()
  );
  if (userIndex < 0) {
    return res.status(404).json({ msg: "User not found." });
  }

  productIds.forEach((id) => {
    for (const course of COURSES[0]) {
      if (course._id.toString() === id.toString()) {
        products.push(course);
        break;
      }
    }
  });

  const lineItems = products.map((p) => ({
    name: p.name,
    description: `Identyfikator kursu: ${p._id.toString()}`,
    amount: parseInt(+p.price * 100),
    currency: "pln",
    quantity: 1,
  }));

  try {
    const ssKey = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:3000/checkout/${uid}`,
      cancel_url: "http://localhost:3000/cancel",
    });

    USERS[0][userIndex].paymentSession = {
      id: ssKey.id,
      courses: productIds,
    };

    res.status(201).json({ sessionKey: ssKey.id });
  } catch (err) {
    next(err);
  }
};

exports.grantPermissionsAfterPayment = async (req, res, next) => {
  const uid = req.body.uid;

  const userIndex = USERS[0].findIndex(
    (u) => u._id.toString() === uid.toString()
  );
  if (userIndex < 0) {
    return res.status(404).json({ msg: "User not found." });
  }

  if (!USERS[0][userIndex].paymentSession) {
    return res.status(400).json({ msg: "Payment session uninitialized." });
  }

  const response = await stripe.checkout.sessions.retrieve(
    USERS[0][userIndex].paymentSession.id
  );

  if (
    response.mode === "payment" &&
    response.payment_status === "paid" &&
    response.status === "complete"
  ) {
    const user = await User.findById(uid);
    const date = new Date();
    date.setMonth(date.getMonth() + 7);
    console.log(date);

    USERS[0][userIndex].paymentSession.courses.forEach((c) => {
      user.permissions.push({
        courseId: c,
        modify: {
          read: true,
          write: false,
        },
        date: date,
      });
    });

    const savedUser = await user.save();
    USERS[0][userIndex].paymentSession = undefined;
    USERS[0][userIndex].permissions = savedUser.permissions;
    return res.status(201).json({
      msg: "Payment completed.",
      permissions: USERS[0][userIndex].permissions,
    });
  }
  res.status(400).json({ msg: "Payment not received." });
};
