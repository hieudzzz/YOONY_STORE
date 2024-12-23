import React, { createContext, ReactNode, useContext, useEffect } from "react";
import Pusher from "pusher-js";
import { IUser } from "../interfaces/IUser"; 
import { useAuth } from "./AuthProvider";

interface PusherContextType {
  initializePusher: (userData: IUser) => void;
}

const PusherContext = createContext<PusherContextType | undefined>(undefined);

export const PusherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const initializePusher = (userData: IUser) => {
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
  };

  useEffect(() => {
    if (user) {
      const cleanup = initializePusher(user);
      return cleanup;
    }
  }, []);

  return (
    <PusherContext.Provider value={{ initializePusher }}>
      {children}
    </PusherContext.Provider>
  );
};

export const usePusher = (): PusherContextType => {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error("usePusher must be used within a PusherProvider");
  }
  return context;
};