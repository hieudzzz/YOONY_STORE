import React, { useState, useEffect, useRef } from "react";
import { Modal, Input, Button } from "antd";

const ChatModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
    const [messages, setMessages] = useState<{ text: string; isSender: boolean }[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null); // Tạo ref để cuộn xuống

    // Danh sách câu hỏi mẫu
    const sampleQuestions = [
        "Bạn cần hỗ trợ về vấn đề gì?",
        "Có điều gì tôi có thể giúp bạn hôm nay?",
        "Bạn đã tìm thấy thông tin mình cần chưa?",
        "Bạn có câu hỏi nào về sản phẩm của chúng tôi không?",
        "Bạn cần trợ giúp về đơn hàng của mình chứ?",
    ];
    useEffect(() => {
        if (visible) {
            // Thêm câu hỏi mẫu vào danh sách tin nhắn khi mở modal
            const initialMessages = sampleQuestions.map((question) => ({
                text: question,
                isSender: false, // Câu hỏi là từ người hỗ trợ
            }));
            setMessages(initialMessages);
        }
    }, [visible]);

    useEffect(() => {
        // Cuộn xuống dưới mỗi khi danh sách tin nhắn thay đổi
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: inputValue.trim(), isSender: true },
            ]);
            setInputValue(""); // Xóa ô nhập sau khi gửi
        }
    };

    return (
        <Modal
            title={<span style={{  color: '#000' }}>Trợ lí YoonyStore</span>} // Đổi màu chữ header nếu cần
            visible={visible}
            onCancel={onClose}
            footer={null} // Không cần footer trong modal
            width={400} // Chiều rộng của modal
            style={{ top: 20 }} // Đặt modal ở trên cùng
        >
            <div className="flex flex-col h-[400px] overflow-y-auto">
                {/* Hiển thị danh sách tin nhắn */}
                <div className="flex-grow p-2 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`mb-2 ${msg.isSender ? 'text-right' : 'text-left'}`}>
                            <div
                                className={`rounded-lg p-2 inline-block max-w-[70%] ${msg.isSender ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {/* Phần tử ref để cuộn xuống */}
                    <div ref={messagesEndRef} />
                </div>
                {/* Ô nhập và nút gửi */}
                <div className="flex p-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onPressEnter={handleSendMessage} // Gửi tin khi nhấn Enter
                        placeholder="Nhập tin nhắn..."
                        className="flex-grow mr-2 rounded-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        style={{ height: '40px' }} // Chiều cao của ô nhập
                    />
                    <Button
                        type="primary"
                        onClick={handleSendMessage}
                        className="bg-primary rounded-full h-10 px-4 shadow-sm transition-colors duration-300 hover:bg-primary"
                    >
                        Gửi
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ChatModal;
