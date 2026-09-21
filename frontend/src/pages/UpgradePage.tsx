import { Check, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router";
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
import { useCreateCheckoutSession } from "../hooks/useOrder.js";

const FEATURES = [
  "Unlimited tasks & projects",
  "Advanced filters & quick sorting",
  "Direct customer support",
  "Lifetime access & all future updates",
];

export function UpgradePage() {
  const checkoutMutation = useCreateCheckoutSession();

  const handleCheckout = () => {
    checkoutMutation.mutate(undefined, {
      onSuccess: (data) => {
        if (data.url) {
          window.location.href = data.url;
        }
      },
      onError: (err) => {
        console.error("Checkout error:", err);
      },
    });
  };

  const loading = checkoutMutation.isPending;

  return (
    <div className="max-w-xl mx-auto space-y-6 py-2">
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
        <CardHeader className="space-y-4 pb-6 border-b border-border">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <Badge variant="secondary" className="font-semibold text-xs mb-2">
                One-time Payment
              </Badge>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Upgrade to Pro
              </CardTitle>
              <CardDescription className="text-sm">
                Unlock full productivity capabilities with lifetime access.
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold tracking-tight">$19</div>
              <div className="text-xs text-muted-foreground">one-time payment</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          <h3 className="text-xs font-semibold tracking-wider text-muted-foreground">
            Included with Pro
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-muted-foreground">
                <div className="w-4 h-4 rounded-full bg-foreground/10 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-foreground" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-6 border-t border-border bg-card">
          <Button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="w-full h-11 text-sm font-semibold cursor-pointer gap-2"
            id="checkout-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting to Stripe…</span>
              </>
            ) : (
              <span>Get Pro Access — $19</span>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure checkout powered by Stripe. No subscriptions or hidden fees.</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
