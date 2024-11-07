
import { Label } from "flowbite-react";
import ButtonSubmit from "../../../components/Admin/ButtonSubmit";

const AddChatForm = () => {
    return (
        <div className="col-span-3 bg-util rounded-lg p-4 space-y-5">
            <h2 className="text-center bg-primary text-util py-2.5 rounded-[5px] font-medium">
                Thêm chat
            </h2>
            <form
                action=""
                className="space-y-4"
            >
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="name-event" value="Thêm câu hỏi" />
                    </div>
                    <input
                        type="text"
                        placeholder="Thêm câu hỏi"
                        id="name-event"

                        className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
                    />

                </div>
                <div className="mt-3 space-y-2">
                    <div className="block">
                        <Label htmlFor="select-vouchers" value="Thêm câu trả lời" />
                    </div>
                    <input
                        type="text"
                        placeholder="Thêm câu trả lời"
                        id="name-event"

                        className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
                    />

                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="start-event" value="..." />
                    </div>
                    <input
                        type="date"
                        placeholder="..."
                        id="name-event"
                        className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
                    />

                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="end-event" value="..." />
                    </div>
                    <input
                        type="date"
                        placeholder="..."

                        id="end-event"
                        className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="desc-event"
                            value="..." />
                    </div>
                    <textarea
                        placeholder="..."
                        id="desc-event"
                        className="block focus:!border-primary/50 text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
                    ></textarea>
                </div>
                <ButtonSubmit content="Thêm" />

            </form>
        </div>


    )

}
export default AddChatForm