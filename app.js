const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51PBgMwSAFf6ULjsIRQn1vQX1Bl0gnFhIVsLuq8Sceo3XXTHktUMzZVwgTKBbmWfcI0OlxcJw8Smj61ef1fJxSEA700we2vZhMV"
);

app.use(express.json());
app.use(cors());

//recieve the cart
app.post("/api/create-checkout-session", async (req, res) => {
  const { products } = req.body;
  console.log(products);

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.title,
      },
      unit_amount: product.price * 100,
    },
    quantity: product.options[0].quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    // payment_method_types: ["card", "mobilepay"],
    line_items: lineItems,
    mode: "payment",
    // success_url: "http://localhost:3000/unknOrder",
    // cancel_url: "http://localhost:3000/txnFailed",
    success_url: "https://see.myprojects.store/unknOrder",
    cancel_url: "https://see.myprojects.store/txnFailed",
  });

  res.json({ id: session.id });
});

app.listen(7000, () => {
  console.log("Server is listening as port 7000");
});
