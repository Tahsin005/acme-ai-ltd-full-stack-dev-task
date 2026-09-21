export type OrderStatus = "pending" | "paid" | "failed" | "expired";

export interface Order {
  status: OrderStatus;
  email?: string;
  amountTotal?: number;
  currency?: string;
  userId?: string;
  plan?: string;
  paidAt?: string;
}

export interface CheckoutSessionResponse {
  url: string | null;
}
