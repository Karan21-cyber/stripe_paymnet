const express = require("express");
const app = express();
const { resolve } = require("path");
// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

app.use(express.static(process.env.STATIC_DIR));

app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

// sending the publishibale key to frontend
app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

//It is a paymentIntent for automatic payment by click in the button in dashboard
app.post("/create-payment-intent", async (req, res) => {
  try {

    const price = req.query.amount *100 ;
    // console.log(req.query.amount);

    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: price,
    });

    // Uncomment this code block to enable automatic payments
    // const paymentIntent = await stripe.paymentIntents.create({
    //   currency: "usd",
    //   amount: 3399,
    //   automatic_payment_methods: {
    //     enabled: true,
    //   },
    // });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return res.status(400).send({
      error: {
        message: error.message,
      },
    });
  }
});


app.listen(5252, () =>
  console.log(`Node server listening at http://localhost:5252`)
);
