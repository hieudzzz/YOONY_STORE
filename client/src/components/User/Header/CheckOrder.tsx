import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import logo from "./checkorder.png";

export const CheckOrder = () => {

    return (
        <div className='flex justify-center items-center gap-10 mt-8'>
            <div>
                <img src={logo} />
            </div>
            <div className=' space-y-8'>
                <h2 className='font-medium text-primary text-4xl mb-[30px]'>CHECK ĐƠN HÀNG</h2>
                <div>
                    <label htmlFor="fullname" className="block text-gray-700 text-sm font-bold mb-2">
                        Số điện thoại hoặc Mã đơn hàng
                    </label>
                    <Input.Group compact>
                        <Input
                            style={{ width: 'calc(100% - 100px)', height: '40px', border: '1px solid #d9d9d9' }} // Đặt chiều cao cho input
                            placeholder="Nhập nội dung tìm kiếm"
                        />
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            style={{ height: '40px', lineHeight: '40px' }}
                            // Đặt chiều cao và line-height cho button
                            className='bg-primary'
                        >
                            Search
                        </Button>
                    </Input.Group>
                </div>
                <div>
                    <label htmlFor="OTP" className="block text-gray-700 text-sm font-bold mb-2">
                        OTP
                    </label>
                    <input
                        type="text"
                        id="otp"
                        className="appearance-none border border-gray-300 rounded-sm w-full py-2 px-4 text-gray-100 leading-tight "
                        placeholder="OTP"
                    />
                </div>
                <Button type="primary" className='bg-primary'>
                    TIẾP TỤC
                </Button>
            </div>
        </div>
    )
}
