import { useSearchParams, Link } from "react-router";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useOrder } from "../hooks/useOrder.js";

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { order, isConfirming, isPaid } = useOrder(sessionId);

  const formatAmount = (amount?: number | null, currency?: string | null) => {
    if (!amount || !currency) return "$19.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 py-2">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks</span>
        </Link>
      </div>

      <Card className="border border-border shadow-xs">
        {isConfirming ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            <h2 className="text-xl font-bold tracking-tight">Confirming payment…</h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we verify your order with Stripe.
            </p>
          </div>
        ) : isPaid && order ? (
          <>
            <CardHeader className="text-center space-y-3 pb-6 border-b border-border">
              <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Payment Successful
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Thank you for upgrading! Your Pro access is now active.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold"
                  >
                    Paid
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium text-foreground capitalize">
                    {order.plan || "Pro"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold text-foreground">
                    {formatAmount(order.amountTotal, order.currency)}
                  </span>
                </div>
                {order.email && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Receipt to</span>
                    <span className="font-medium text-foreground">{order.email}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Date</span>
                  <span className="text-foreground">
                    {order.paidAt
                      ? new Date(order.paidAt).toLocaleDateString()
                      : new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2 pb-6 border-t border-border bg-card">
              <Button asChild className="w-full h-11 font-semibold cursor-pointer">
                <Link to="/">Back to Tasks</Link>
              </Button>
            </CardFooter>
          </>
        ) : (
          <div className="py-12 px-6 text-center space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Payment Status Pending</h2>
            <p className="text-sm text-muted-foreground">
              We haven't received full confirmation from Stripe yet. Your access will activate as soon as the transaction settles.
            </p>
            <Button asChild variant="outline" className="cursor-pointer">
              <Link to="/">Back to Tasks</Link>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
