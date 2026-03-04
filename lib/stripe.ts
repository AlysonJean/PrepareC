import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock";

export const stripe = new Stripe(stripeKey, {
    typescript: true,
});
