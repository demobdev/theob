import React, { useCallback, useState } from "react";
import ObAlertModal, { type ObAlertConfig } from "../components/ObAlertModal";

export type ShowObAlert = (config: ObAlertConfig) => void;

export function useObAlert() {
  const [obAlert, setObAlert] = useState<ObAlertConfig | null>(null);

  const showObAlert = useCallback<ShowObAlert>((config) => {
    setObAlert(config);
  }, []);

  const dismissObAlert = useCallback(() => {
    setObAlert(null);
  }, []);

  const alertModal = (
    <ObAlertModal
      visible={obAlert !== null}
      config={obAlert}
      onClose={dismissObAlert}
    />
  );

  return { showObAlert, dismissObAlert, alertModal };
}
