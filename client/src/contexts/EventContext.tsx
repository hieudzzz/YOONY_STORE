import { createContext } from "react"
import { IEvent } from "../interfaces/IEvent";

const EventContext = createContext({}as{
    dispatch:any,
    events:IEvent[]
})

export default EventContext