export interface PackageInfo {
    name: string;
    description: string;
    amount: number;
    currency: string;
}

export interface Order {
    status: "pending" | "paid" | "failed" | "expired";
    email?: string | undefined;
    amountTotal?: number | null | undefined;
    currency?: string | null | undefined;
    userId?: string | null | undefined;
    plan?: string | null | undefined;
    paidAt?: string | undefined;
}
