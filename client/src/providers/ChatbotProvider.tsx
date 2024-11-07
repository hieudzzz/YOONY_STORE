import { ReactNode, useEffect, useReducer } from "react";
import instance from "../instance/instance";
import ChatbotReducer from "../reducer/ChatbotReducer";
import { IChatbot } from "../interfaces/IChatbot";
import ChatbotContext from "../contexts/ChatbotContext";

type Props = {
  children: ReactNode;
};

const ChatbotProvider = ({ children }: Props) => {
  const [events, dispatch] = useReducer(ChatbotReducer, [] as IChatbot[]);

  useEffect(() => {
    (async () => {
      try {
        const { data: { data: response } } = await instance.get("admin/questions");
        // Gọi dispatch để cập nhật state chatbots
        dispatch({ type: 'SET_CHATBOTS', payload: response });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <ChatbotContext.Provider value={{ dispatch, events }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export default ChatbotProvider;
