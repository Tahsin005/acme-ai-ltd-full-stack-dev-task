import Stripe from "stripe";
import { env } from "./env.js";
import type { PackageInfo } from "../types/stripe.types.js";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const PACKAGE: PackageInfo = {
    name: "Pro Package",
    description: "Lifetime access to Pro features",
    amount: 1900, // in cents: 1900 = $19.00
    currency: "usd",
};
