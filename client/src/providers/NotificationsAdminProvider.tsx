import { useEffect, useReducer } from "react";
import { IProduct } from "../interfaces/IProduct";
import { NotificationsContext, Props } from "../contexts/NotificationsContext";
import NotificationsReducer from "../reducer/NotificationsReducer";
import instance from "../instance/instance";
import Pusher from "pusher-js";
const NotificationsAdminProvider = (props: Props) => {
  const [notifications, dispatch] = useReducer(
    NotificationsReducer,
    [] as IProduct[]
  );
  // const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  const userData = JSON.parse(localStorage.getItem("userInfor")!);
  useEffect(() => {
    if (!userData?.id) return;
    const fetchNotifications = async () => {
      try {
        const {
          data: { data: response },
        } = await instance.get(`notification/orders/delivered}`);
        // console.log(response);
        // if (response) {
        //   dispatch({
        //     type: "LIST",
        //     payload: response,
        //   });
        // }
      } catch (error) {
        console.log(error);
      }
    };
  
    Pusher.logToConsole = true;
  
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      encrypted: true,
    });
  
    const channel = pusher.subscribe(`admin.notifications}`);
    channel.bind("order-status-updated", (data: any) => {
      dispatch({
        type: "ADD",
        payload: data.notification,
      });
    });
  
    fetchNotifications();
  
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [userData?.id]);
  return (
    <NotificationsContext.Provider value={{ notifications, dispatch }}>
      {props.children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsAdminProvider;
