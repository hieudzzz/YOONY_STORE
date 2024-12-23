import Pusher from "pusher-js";
import { useEffect, useState } from "react";

const NotificationsUser = () => {
  const [eventData, setEventData] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userInfor")!);
  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      encrypted: true,
    });

    const channel = pusher.subscribe('notifications.' + userData.id);
    channel.bind("order-status-updated", (data) => {
      setEventData(data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);
  return JSON.stringify(eventData, null, 2);
};

export default NotificationsUser;
