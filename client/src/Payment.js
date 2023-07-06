import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

function Payment(props) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  // getting a publish key
  const getPublishedKey = async () => {
    try {
      await axios.get("/config").then((res) => {
        // console.log(res.data.publishableKey);
        setStripePromise(loadStripe(res.data.publishableKey));
      });
    } catch (error) {
      console.log("unable to fetch published key");
    }
  };

  const getSecretKey = async () => {
    try {
      const price = 149;
  
      const response = await axios.post(
        `/create-payment-intent?amount=${price}`
      );

      if (response.data) {
        setClientSecret(response.data.clientSecret);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getPublishedKey();
    getSecretKey();
  }, []);

  return (
    <>
      <h1>React Stripe and the Payment Element</h1>
      {/* if there is stripePromise and clientSecrete true then display else donot display */}
      {stripePromise && clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      ):""}
    </>
  );
}

export default Payment;
