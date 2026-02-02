import { useEffect, useState } from "react";
import socket from "../lib/socket";

const useNotificationCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    socket.on(
      "notification:unread-count",
      (data: { notificationCount: number }) => {
        setCount(data.notificationCount);
      },
    );

    return () => {
      socket.off("notification:unread-count");
    };
  }, []);

  return count;
};

export default useNotificationCount;
