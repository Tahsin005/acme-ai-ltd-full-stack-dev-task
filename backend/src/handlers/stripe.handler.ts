import type { RequestHandler } from "express";
import { stripeController } from "../controllers/stripe.controller.js";
import { env } from "../config/env.js";

export const stripeHandler = {
    createCheckoutSession: (async (req, res, next) => {
        try {
            const originHeader = req.headers.origin as string | undefined;
            const refererHeader = req.headers.referer as string | undefined;
            const clientUrl = originHeader || (refererHeader ? new URL(refererHeader).origin : null) || env.CLIENT_URL;

            const result = await stripeController.createCheckoutSession(clientUrl);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    getOrderStatus: (async (req, res, next) => {
        try {
            const sessionId = req.params.sessionId as string;
            const order = await stripeController.getOrder(sessionId);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            res.json(order);
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    getPackage: ((_req, res) => {
        res.json(stripeController.getPackage());
    }) as RequestHandler,

    handleWebhook: (async (req, res) => {
        const signature = req.headers["stripe-signature"] as string | undefined;

        try {
            const result = await stripeController.handleWebhook(
                req.body as Buffer,
                signature
            );
            res.json(result);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unknown error";
            if (
                message.includes("Signature verification failed") ||
                message.includes("No stripe-signature")
            ) {
                return res.status(400).send(`Webhook Error: ${message}`);
            }
            console.error("[Stripe Webhook] Internal handler error:", err);
            return res.status(500).send("Handler failed");
        }
    }) as RequestHandler,
};
