import { createContext, ReactNode } from "react";
import { INotification } from "../interfaces/Inotification";


export interface Props{
    children:ReactNode
}

export const NotificationsContext = createContext({} as{
    notifications: INotification[],
    dispatch:any;
})

