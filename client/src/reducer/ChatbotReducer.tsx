import { IChatbot } from "../interfaces/IChatbot"
const ChatbotReducer = (state: any, action: any) => {
    switch (action.type) {
        case "LIST":
            return action.payload
        case "ADD":
            return [action.payload, ...state]
        case "UPDATE":
            return state.map((item: IChatbot) => {
                if (item.id !== action.payload.id) {
                    return item
                }
                return action.payload
            })
        case "DELETE":
            return state.filter((item: IChatbot) => {
                return item.id !== action.payload
            })
        case 'SET_CHATBOTS':
            return action.payload; // Cập nhật state với dữ liệu mới từ API
        default:
            break;
    }
}

export default ChatbotReducer