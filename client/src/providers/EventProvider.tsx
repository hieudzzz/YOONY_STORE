import { ReactNode, useEffect, useReducer } from "react";
import EventContext from "../contexts/EventContext";
import { IEvent } from "../interfaces/IEvent";
import eventReducer from "../reducer/eventReducer";
import instance from "../instance/instance";

type Props = {
    children: ReactNode;
  };
  
//   admin/events/coupons

const EventProvider = ({children}:Props) => {
    useEffect(() => {
      (async()=>{
        try {
            const {data:{data:response}}=await instance.get('admin/events/coupons')
            console.log(response)
            // if (response) {
            //     dispatch({
            //         type:"LIST",
            //         payload:response
            //     })
            // }
        } catch (error) {
            console.log(error)
        }
      })()
    }, [])
    const [events, dispatch] = useReducer(eventReducer, [] as IEvent[])
  return (
    <EventContext.Provider value={{dispatch,events}}>
        {children}
    </EventContext.Provider>
  )
}

export default EventProvider

