import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export function CancelPage() {
  return (
    <div className="max-w-md mx-auto space-y-6 py-4">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks</span>
        </Link>
      </div>

      <Card className="border border-border shadow-xs text-center">
        <CardHeader className="space-y-3 py-8">
          <div className="w-12 h-12 rounded-xl bg-muted text-muted-foreground flex items-center justify-center mx-auto shadow-xs">
            <XCircle className="w-6 h-6" />
          </div>

          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Payment Cancelled
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              No charges were made to your account. You can upgrade anytime.
            </CardDescription>
          </div>
        </CardHeader>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border bg-card">
          <Button asChild variant="outline" className="w-full sm:flex-1 cursor-pointer">
            <Link to="/">Back to Tasks</Link>
          </Button>
          <Button asChild className="w-full sm:flex-1 cursor-pointer gap-2">
            <Link to="/upgrade">
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
