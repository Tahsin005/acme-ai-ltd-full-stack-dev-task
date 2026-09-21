import type { Order, CheckoutSessionResponse } from "../types/order.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const normalizedBase = API_URL.replace(/\/api\/?$/, "");

export const ordersApi = {
  getOrder: async (sessionId: string): Promise<Order> => {
    const res = await fetch(`${normalizedBase}/api/orders/${sessionId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch order status: ${res.statusText}`);
    }
    const data = await res.json();
    return (data && typeof data === "object" && "data" in data && data.success ? data.data : data) as Order;
  },

  createCheckoutSession: async (): Promise<CheckoutSessionResponse> => {
    const res = await fetch(`${normalizedBase}/api/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Failed to create checkout session: ${res.statusText}`);
    }
    const data = await res.json();
    return (data && typeof data === "object" && "data" in data && data.success ? data.data : data) as CheckoutSessionResponse;
  },
};
