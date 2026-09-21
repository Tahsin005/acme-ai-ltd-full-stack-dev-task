import type Stripe from "stripe";
import { stripe, PACKAGE } from "../config/stripe.js";
import { env } from "../config/env.js";
import type { Order, PackageInfo } from "../types/stripe.types.js";

const orders = new Map<string, Order>();
const processedEvents = new Set<string>();

export const stripeController = {
    getPackage(): PackageInfo {
        return PACKAGE;
    },

    async createCheckoutSession(clientUrl: string): Promise<{ url: string | null }> {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: PACKAGE.currency,
                        unit_amount: PACKAGE.amount,
                        product_data: {
                            name: PACKAGE.name,
                            description: PACKAGE.description,
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${clientUrl}/cancel`,
            client_reference_id: "user_123",
            metadata: { plan: "pro" },
        });

        orders.set(session.id, { status: "pending" });
        return { url: session.url };
    },

    async getOrder(sessionId: string): Promise<Order | null> {
        let order = orders.get(sessionId);

        // fallback: if order not found in memory, fetch from Stripe API
        if (!order || order.status !== "paid") {
            try {
                const session = await stripe.checkout.sessions.retrieve(sessionId);
                if (session.payment_status === "paid") {
                    this.fulfillOrder(session);
                    order = orders.get(sessionId);
                }
            } catch {
                // session not found or network error
            }
        }

        return order || null;
    },

    fulfillOrder(session: Stripe.Checkout.Session): void {
        if (session.amount_total !== PACKAGE.amount) {
            console.warn(
                `[Stripe Webhook] Amount mismatch for session ${session.id}: expected ${PACKAGE.amount}, got ${session.amount_total}`
            );
        }

        orders.set(session.id, {
            status: "paid",
            email: session.customer_details?.email ?? undefined,
            amountTotal: session.amount_total,
            currency: session.currency,
            userId: session.client_reference_id,
            plan: session.metadata?.plan,
            paidAt: new Date().toISOString(),
        });

        console.log(
            `[Stripe Webhook] Order successfully fulfilled for session: ${session.id} (${session.customer_details?.email || "anonymous"})`
        );
    },

    async handleWebhook(rawBody: Buffer, signature?: string): Promise<{ received: boolean }> {
        if (!signature) {
            throw new Error("Signature verification failed: No stripe-signature header provided");
        }

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                rawBody,
                signature,
                env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unknown error";
            throw new Error(`Signature verification failed: ${message}`);
        }

        const eventId = event.id;
        const eventType = event.type;

        if (processedEvents.has(eventId)) {
            console.log(`[Stripe Webhook] Event ${eventId} already processed, skipping.`);
            return { received: true };
        }
        processedEvents.add(eventId);

        console.log(`[Stripe Webhook] Received: ${eventType} (${eventId})`);

        const extractId = (): string | undefined => {
            const dataObj = event.data?.object as { id?: string } | undefined;
            if (dataObj?.id) return dataObj.id;
            const related = (event as unknown as { related_object?: { id?: string } })?.related_object;
            return related?.id;
        };

        try {
            switch (eventType) {
                case "checkout.session.completed":
                case "checkout.session.async_payment_succeeded": {
                    let session = event.data?.object as Stripe.Checkout.Session | undefined;
                    const sessionId = session?.id || extractId();

                    if (sessionId && (!session || !session.payment_status)) {
                        try {
                            session = await stripe.checkout.sessions.retrieve(sessionId);
                        } catch (err) {
                            console.warn(`[Stripe Webhook] Could not retrieve session ${sessionId} from API:`, err);
                        }
                    }

                    if (session && session.payment_status === "paid") {
                        this.fulfillOrder(session);
                    } else {
                        console.log(`[Stripe Webhook] Session ${sessionId} status: ${session?.payment_status ?? "unknown"}`);
                    }
                    break;
                }

                case "checkout.session.async_payment_failed":
                case "checkout.session.expired": {
                    const sessionId = extractId();
                    if (sessionId) {
                        const status = eventType.endsWith("expired") ? "expired" : "failed";
                        orders.set(sessionId, {
                            ...(orders.get(sessionId) || {}),
                            status,
                        });
                        console.log(`[Stripe Webhook] Order marked as ${status} for session: ${sessionId}`);
                    }
                    break;
                }

                case "payment_intent.succeeded": {
                    const piId = extractId();
                    console.log(`[Stripe Webhook] PaymentIntent succeeded: ${piId}`);
                    break;
                }

                case "payment_intent.payment_failed": {
                    const piId = extractId();
                    if (piId) {
                        const pi = await stripe.paymentIntents.retrieve(piId).catch(() => null);
                        console.log(
                            `[Stripe Webhook] Payment failed for ${piId}:`,
                            pi?.last_payment_error?.message || "Unknown error"
                        );
                    }
                    break;
                }

                case "charge.refunded": {
                    const chargeId = extractId();
                    console.log(`[Stripe Webhook] Charge refunded: ${chargeId}`);
                    break;
                }

                default:
                    console.log(`[Stripe Webhook] Handled event type: ${eventType}`);
            }
        } catch (err) {
            processedEvents.delete(eventId);
            throw err;
        }

        return { received: true };
    },
};
