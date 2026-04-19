import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type FulfillmentMethod = "pickup_instore" | "pickup_curbside" | "delivery_partner";
export type ScheduleMode = "asap" | "scheduled";

export interface OrderContextState {
  fulfillmentMethod: FulfillmentMethod;
  locationId: string;
  locationName: string;
  locationAddress: string;
  scheduleMode: ScheduleMode;
  scheduledTime: string | null;
  phoneNumber: string;
  vehicleInfo: {
    make: string;
    model: string;
    color: string;
  };
  shopNotice: string | null;
}

interface OrderContextType extends OrderContextState {
  setFulfillmentMethod: (method: FulfillmentMethod) => void;
  setLocation: (id: string, name: string, address: string) => void;
  setSchedule: (mode: ScheduleMode, time?: string | null) => void;
  setPhone: (phone: string) => void;
  setVehicle: (info: { make: string; model: string; color: string }) => void;
  setShopNotice: (notice: string | null) => void;
  isOrderContextSetup: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OrderContextState>({
    fulfillmentMethod: "pickup_instore",
    locationId: "greenville_01",
    locationName: "Greenville",
    locationAddress: "123 Main St, Greenville, SC",
    scheduleMode: "asap",
    scheduledTime: null,
    phoneNumber: "",
    vehicleInfo: {
      make: "",
      model: "",
      color: "",
    },
    shopNotice: "Kitchen closes at 10:30 PM tonight.", // Example shop notice
  });

  const [isOrderContextSetup, setIsOrderContextSetup] = useState(false);

  useEffect(() => {
    // Load from storage on mount
    const loadSession = async () => {
      try {
        const saved = await AsyncStorage.getItem("@theob_order_context");
        if (saved) {
          setState(prev => ({ ...prev, ...JSON.parse(saved) }));
        }
        setIsOrderContextSetup(true);
      } catch (e) {
        setIsOrderContextSetup(true);
      }
    };
    loadSession();
  }, []);

  const saveState = async (newState: OrderContextState) => {
    try {
      await AsyncStorage.setItem("@theob_order_context", JSON.stringify(newState));
    } catch (e) {
      console.error("Failed to save order context", e);
    }
  };

  const setFulfillmentMethod = (method: FulfillmentMethod) => {
    const newState = { ...state, fulfillmentMethod: method };
    setState(newState);
    saveState(newState);
  };

  const setLocation = (id: string, name: string, address: string) => {
    const newState = { ...state, locationId: id, locationName: name, locationAddress: address };
    setState(newState);
    saveState(newState);
  };

  const setSchedule = (mode: ScheduleMode, time: string | null = null) => {
    const newState = { ...state, scheduleMode: mode, scheduledTime: time };
    setState(newState);
    saveState(newState);
  };

  const setPhone = (phone: string) => {
    const newState = { ...state, phoneNumber: phone };
    setState(newState);
    saveState(newState);
  };

  const setVehicle = (info: { make: string; model: string; color: string }) => {
    const newState = { ...state, vehicleInfo: info };
    setState(newState);
    saveState(newState);
  };

  const setShopNotice = (notice: string | null) => {
    setState(prev => ({ ...prev, shopNotice: notice }));
  };

  return (
    <OrderContext.Provider
      value={{
        ...state,
        setFulfillmentMethod,
        setLocation,
        setSchedule,
        setPhone,
        setVehicle,
        setShopNotice,
        isOrderContextSetup,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
