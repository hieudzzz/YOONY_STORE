import Pusher from "pusher-js";
import { useEffect } from "react";

const UserRoleListener = () => {
    const userData = JSON.parse(localStorage.getItem("userInfor")!);
    useEffect(() => {
        if (!userData?.id) return;

        Pusher.logToConsole = true;
      
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
          cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
          encrypted: true,
        });
      
        const channel = pusher.subscribe(`user-role-updates.${userData.id}`);
        channel.bind("user-role-updated", (data: any) => {
            const updatedUserData = { ...userData, ...data.user };
            localStorage.setItem('userInfor', JSON.stringify(updatedUserData));
        });

        return () => {
          channel.unbind_all();
          channel.unsubscribe();
        };
      }, [userData]);
    return null;
}

export default UserRoleListener