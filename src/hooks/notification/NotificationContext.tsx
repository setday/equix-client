import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { v4 as uuidv4 } from "uuid";
import NotificationContainer from "../../components/Notification/NotificationContainer";
import { NotificationType } from "../../components/Notification/NotificationItem";
import { NOTIFICATION_DURATIONS } from "../../config/constants";

interface NotificationContextType {
  showNotification: (
    type: NotificationType,
    message: string,
    duration?: number,
  ) => void;
  showError: (message: string, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const showNotification = useCallback(
    (type: NotificationType, message: string, duration?: number) => {
      const id = uuidv4();
      const defaultDuration =
        type === "error"
          ? NOTIFICATION_DURATIONS.ERROR
          : type === "warning"
            ? NOTIFICATION_DURATIONS.WARNING
            : type === "success"
              ? NOTIFICATION_DURATIONS.SUCCESS
              : NOTIFICATION_DURATIONS.INFO;

      setNotifications((prev) => [
        ...prev,
        {
          id,
          type,
          message,
          duration: duration ?? defaultDuration,
        },
      ]);
    },
    [],
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      showNotification("error", message, duration);
    },
    [showNotification],
  );

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showNotification("success", message, duration);
    },
    [showNotification],
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showNotification("warning", message, duration);
    },
    [showNotification],
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showNotification("info", message, duration);
    },
    [showNotification],
  );

  const contextValue = useMemo(
    () => ({
      showNotification,
      showError,
      showSuccess,
      showWarning,
      showInfo,
    }),
    [showNotification, showError, showSuccess, showWarning, showInfo],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
