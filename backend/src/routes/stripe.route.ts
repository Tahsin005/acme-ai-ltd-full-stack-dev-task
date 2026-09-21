import { Router } from "express";
import express from "express";
import { stripeHandler } from "../handlers/stripe.handler.js";

export const stripeRouter = Router();

stripeRouter.post("/create-checkout-session", stripeHandler.createCheckoutSession);
stripeRouter.get("/orders/:sessionId", stripeHandler.getOrderStatus);
stripeRouter.get("/package", stripeHandler.getPackage);

export const stripeWebhookRouter = Router();

stripeWebhookRouter.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    stripeHandler.handleWebhook
);
