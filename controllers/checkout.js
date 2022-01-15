const COURSES = require("../constants/database").CURRENT_COURSES;

const stripe = require("stripe")(
  "sk_test_51JyxVpGlGt0q5M6YFtzaBubgCOfi1m6dvWAZZh5YUy3pNEYnXR68DrGZXPOTAX2YHsCmqkzdNaUbtLDy4r4s0jfg00Tz8u3xfQ"
);

exports.getCheckout = async (req, res, next) => {
  const productIds = req.body.products;
  const products = [];

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
    description: `course id: ${p._id.toString()}`,
    amount: parseInt(+p.price * 100),
    currency: "pln",
    quantity: 1,
  }));

  try {
    const ssKey = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhos:3000/success",
      cancel_url: "http://localhos:3000/cancel",
    });

    res.status(201).json({ sessionKey: ssKey.id });
  } catch (err) {
    next(err);
  }
};
