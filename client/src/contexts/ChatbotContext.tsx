import { createContext } from "react"
import { IChatbot } from "../interfaces/IChatbot";

const ChatbotContext = createContext({}as{
    dispatch:any,
    events:IChatbot[]
})

export default ChatbotContext