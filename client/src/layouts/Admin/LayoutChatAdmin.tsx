import AddChatForm from "../../pages/admin/chatbot/AddChat"
import ListChat from "../../pages/admin/chatbot/ListChat"
import ChatbotProvider from "../../providers/ChatbotProvider"

const LayoutChatAdmin = () => {
    return (
        <ChatbotProvider>
            <div className="grid grid-cols-11 gap-5">
                <ListChat />
                <AddChatForm />
            </div>
        </ChatbotProvider>
    )
}
export default LayoutChatAdmin