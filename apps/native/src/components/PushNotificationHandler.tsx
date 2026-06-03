import { useEffect } from "react";
import type { NavigationContainerRef } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

type PushNotificationHandlerProps = {
  navigationRef: React.RefObject<NavigationContainerRef<Record<string, unknown>> | null>;
};

function navigateToOrder(
  navigationRef: PushNotificationHandlerProps["navigationRef"],
  orders: Array<{ _id: Id<"orders"> }> | undefined,
  orderId: string | undefined,
) {
  if (!orderId || !navigationRef.current?.isReady()) return;

  const order = orders?.find((row) => row._id === orderId);
  if (order) {
    navigationRef.current.navigate("OrderDetailsScreen", { order });
    return;
  }
  navigationRef.current.navigate("OrderHistoryScreen");
}

export default function PushNotificationHandler({
  navigationRef,
}: PushNotificationHandlerProps) {
  const orders = useQuery(api.orders.getOrderHistory);

  useEffect(() => {
    const received = Notifications.addNotificationReceivedListener(() => {
      // Foreground display handled by setNotificationHandler in App.tsx
    });

    const response = Notifications.addNotificationResponseReceivedListener(
      (event) => {
        const data = event.notification.request.content.data;
        const orderId =
          typeof data?.orderId === "string" ? data.orderId : undefined;
        navigateToOrder(navigationRef, orders ?? undefined, orderId);
      },
    );

    void Notifications.getLastNotificationResponseAsync().then((last) => {
      if (!last) return;
      const data = last.notification.request.content.data;
      const orderId =
        typeof data?.orderId === "string" ? data.orderId : undefined;
      navigateToOrder(navigationRef, orders ?? undefined, orderId);
    });

    return () => {
      received.remove();
      response.remove();
    };
  }, [navigationRef, orders]);

  return null;
}
