import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "../api/orders.api.js";

export const orderKeys = {
  all: ["orders"] as const,
  detail: (sessionId: string | null | undefined) =>
    [...orderKeys.all, "detail", sessionId] as const,
};

interface UseOrderOptions {
  maxAttempts?: number;
  pollInterval?: number;
}

export function useOrder(sessionId: string | null, options: UseOrderOptions = {}) {
  const maxAttempts = options.maxAttempts ?? 10;
  const pollInterval = options.pollInterval ?? 1500;
  const queryClient = useQueryClient();

  const queryKey = orderKeys.detail(sessionId);

  const query = useQuery({
    queryKey,
    queryFn: () => ordersApi.getOrder(sessionId!),
    enabled: Boolean(sessionId),
    refetchInterval: (q) => {
      const data = q.state.data;
      if (
        data?.status === "paid" ||
        data?.status === "failed" ||
        data?.status === "expired"
      ) {
        return false;
      }
      const attempts =
        (q.state.dataUpdateCount || 0) + (q.state.fetchFailureCount || 0);
      if (attempts >= maxAttempts) {
        return false;
      }
      return pollInterval;
    },
    refetchIntervalInBackground: false,
    retry: 2,
  });

  const queryState = queryClient.getQueryState(queryKey);
  const attempts =
    (queryState?.dataUpdateCount || 0) + (query.failureCount || 0);
  const isPaid = query.data?.status === "paid";
  const isTerminal =
    isPaid ||
    query.data?.status === "failed" ||
    query.data?.status === "expired" ||
    attempts >= maxAttempts ||
    query.isError;

  const isConfirming = Boolean(sessionId) && !isTerminal;

  return {
    ...query,
    order: query.data,
    isConfirming,
    isPaid,
  };
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: () => ordersApi.createCheckoutSession(),
  });
}
