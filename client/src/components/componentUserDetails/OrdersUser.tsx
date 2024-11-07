import { Button, Table } from "flowbite-react";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";
import { Input } from 'antd';
const OrdersUser = () => {
    return (
        <div className="overflow-x w-full border border-gray p-4">
            <div className="flex justify-end mb-4">
                <div className="flex justify-end gap-2">
                    <Input
                        className="w-full "
                        placeholder="Mã đơn hàng"
                        suffix={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                color="#000000"
                                fill="none"
                                className="text-primary"
                            >
                                <path
                                    d="M11 22C10.1818 22 9.40019 21.6698 7.83693 21.0095C3.94564 19.3657 2 18.5438 2 17.1613C2 16.7742 2 10.0645 2 7M11 22V11.3548M11 22C11.3404 22 11.6463 21.9428 12 21.8285M20 7V11.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M7.32592 9.69138L4.40472 8.27785C2.80157 7.5021 2 7.11423 2 6.5C2 5.88577 2.80157 5.4979 4.40472 4.72215L7.32592 3.30862C9.12883 2.43621 10.0303 2 11 2C11.9697 2 12.8712 2.4362 14.6741 3.30862L17.5953 4.72215C19.1984 5.4979 20 5.88577 20 6.5C20 7.11423 19.1984 7.5021 17.5953 8.27785L14.6741 9.69138C12.8712 10.5638 11.9697 11 11 11C10.0303 11 9.12883 10.5638 7.32592 9.69138Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M5 12L7 13"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M16 4L6 9"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M20.1322 20.1589L22 22M21.2074 17.5964C21.2074 19.5826 19.594 21.1928 17.6037 21.1928C15.6134 21.1928 14 19.5826 14 17.5964C14 15.6102 15.6134 14 17.6037 14C19.594 14 21.2074 15.6102 21.2074 17.5964Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        }
                    />
                    <button className=" bg-primary hover:bg-primary text-white text-sm py-2 px-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary flex items-center ">
                        Fillter
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none" className="text-white ml-2">
                            <path d="M13 4L3 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M11 19L3 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M21 19L17 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M21 11.5L11 11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M21 4L19 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M5 11.5L3 11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M14.5 2C14.9659 2 15.1989 2 15.3827 2.07612C15.6277 2.17761 15.8224 2.37229 15.9239 2.61732C16 2.80109 16 3.03406 16 3.5L16 4.5C16 4.96594 16 5.19891 15.9239 5.38268C15.8224 5.62771 15.6277 5.82239 15.3827 5.92388C15.1989 6 14.9659 6 14.5 6C14.0341 6 13.8011 6 13.6173 5.92388C13.3723 5.82239 13.1776 5.62771 13.0761 5.38268C13 5.19891 13 4.96594 13 4.5L13 3.5C13 3.03406 13 2.80109 13.0761 2.61732C13.1776 2.37229 13.3723 2.17761 13.6173 2.07612C13.8011 2 14.0341 2 14.5 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12.5 17C12.9659 17 13.1989 17 13.3827 17.0761C13.6277 17.1776 13.8224 17.3723 13.9239 17.6173C14 17.8011 14 18.0341 14 18.5L14 19.5C14 19.9659 14 20.1989 13.9239 20.3827C13.8224 20.6277 13.6277 20.8224 13.3827 20.9239C13.1989 21 12.9659 21 12.5 21C12.0341 21 11.8011 21 11.6173 20.9239C11.3723 20.8224 11.1776 20.6277 11.0761 20.3827C11 20.1989 11 19.9659 11 19.5L11 18.5C11 18.0341 11 17.8011 11.0761 17.6173C11.1776 17.3723 11.3723 17.1776 11.6173 17.0761C11.8011 17 12.0341 17 12.5 17Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M9.5 9.5C9.96594 9.5 10.1989 9.5 10.3827 9.57612C10.6277 9.67761 10.8224 9.87229 10.9239 10.1173C11 10.3011 11 10.5341 11 11L11 12C11 12.4659 11 12.6989 10.9239 12.8827C10.8224 13.1277 10.6277 13.3224 10.3827 13.4239C10.1989 13.5 9.96594 13.5 9.5 13.5C9.03406 13.5 8.80109 13.5 8.61732 13.4239C8.37229 13.3224 8.17761 13.1277 8.07612 12.8827C8 12.6989 8 12.4659 8 12L8 11C8 10.5341 8 10.3011 8.07612 10.1173C8.17761 9.87229 8.37229 9.67761 8.61732 9.57612C8.80109 9.5 9.03406 9.5 9.5 9.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </button>
                </div>
            </div>
            <Table hoverable className="text-center">
                <Table.Head>
                    <Table.HeadCell className="bg-primary">Mã đơn hàng</Table.HeadCell>
                    <Table.HeadCell className="bg-primary">Ngày mua</Table.HeadCell>
                    <Table.HeadCell className="bg-primary">Tổng tiền</Table.HeadCell>
                    <Table.HeadCell className="bg-primary">Tình trạng</Table.HeadCell>
                    <Table.HeadCell className="bg-primary">Hành động</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {'#YOOK20'}
                        </Table.Cell>
                        <Table.Cell>16/03/2024</Table.Cell>
                        <Table.Cell>900.000Đ</Table.Cell>
                        <Table.Cell className="">
                            <div className="flex justify-center">
                                <Button className="bg-custom-light text-primary hover:bg-primary">Chờ xử lí</Button>
                            </div>
                        </Table.Cell>
                        <Table.Cell className="flex justify-center items-center gap-2">
                            <Button className="flex items-center bg-primary text-white">
                                <MdOutlineContentPasteSearch className="mr-1 mt-0.5 size-4" />
                                Chi tiết
                            </Button>
                            <Button className="flex items-center bg-custom-light text-primary">
                                <TiDeleteOutline className="mr-1 mt-0.5 size-4" />
                                Cancel
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {'#YOOK21'}
                        </Table.Cell>
                        <Table.Cell>16/03/2024</Table.Cell>
                        <Table.Cell>900.000Đ</Table.Cell>
                        <Table.Cell className="">
                            <div className="flex justify-center">
                                <Button color="gray" className="bg-[#FFF7D8] text-[#FFBF00]">Đã xử lý</Button>
                            </div>
                        </Table.Cell>
                        <Table.Cell className="flex justify-center items-center gap-2">
                            <Button className="flex items-center bg-primary text-white">
                                <MdOutlineContentPasteSearch className="mr-1 mt-0.5 size-4" />
                                Chi tiết
                            </Button>
                            <Button className="flex items-center bg-custom-light text-primary">
                                <TiDeleteOutline className="mr-1 mt-0.5 size-4" />
                                Cancel
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {'#YOOK21'}
                        </Table.Cell>
                        <Table.Cell>16/03/2024</Table.Cell>
                        <Table.Cell>900.000Đ</Table.Cell>
                        <Table.Cell className="">
                            <div className="flex justify-center">
                                <Button color="gray" className="bg-[#EBFAEB] text-[#3CD139]">Hoàn thành</Button>
                            </div>
                        </Table.Cell>
                        <Table.Cell className="flex justify-center items-center gap-2">
                            <Button className="flex items-center bg-primary text-white">
                                <MdOutlineContentPasteSearch className="mr-1 mt-0.5 size-4" />
                                Chi tiết
                            </Button>
                            <Button color="gray" className="flex items-center bg-custom-light text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" color="#000000" fill="none" className="text-primary size-4 mt-0.5 mr-2">
                                    <path d="M21.8665 9.99999C21.9543 10.5098 22 11.0331 22 11.5667C22 16.8499 17.5222 21.1334 12 21.1334C11.3507 21.1343 10.7032 21.0742 10.0654 20.9544C9.60633 20.8682 9.37678 20.8251 9.21653 20.8496C9.05627 20.8741 8.82918 20.9948 8.37499 21.2364C7.09014 21.9197 5.59195 22.161 4.15111 21.893C4.69874 21.2194 5.07275 20.4112 5.23778 19.5448C5.33778 19.0148 5.09 18.5 4.71889 18.1231C3.03333 16.4115 2 14.1051 2 11.5667C2 6.60645 5.94718 2.48007 11 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M17.5 5H17.509" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M21.7948 4.59071C21.9316 4.77342 22 4.86477 22 5C22 5.13523 21.9316 5.22658 21.7948 5.40929C21.1801 6.23024 19.6101 8 17.5 8C15.3899 8 13.8199 6.23024 13.2052 5.40929C13.0684 5.22658 13 5.13523 13 5C13 4.86477 13.0684 4.77342 13.2052 4.59071C13.8199 3.76976 15.3899 2 17.5 2C19.6101 2 21.1801 3.76976 21.7948 4.59071Z" stroke="currentColor" stroke-width="1.5" />
                                    <path d="M11.9955 12H12.0045M8 12H8.00897M15.9955 12H16.0045" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                Review
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {'#YOOK21'}
                        </Table.Cell>
                        <Table.Cell>16/03/2024</Table.Cell>
                        <Table.Cell>900.000Đ</Table.Cell>
                        <Table.Cell className="">
                            <div className="flex justify-center">
                                <Button color="gray" className="bg-[#FFE9E8] text-[#FF5A00]">Đã hủy</Button>
                            </div>
                        </Table.Cell>
                        <Table.Cell className="flex justify-center items-center gap-2">
                            <Button className="flex items-center bg-primary text-white">
                                <MdOutlineContentPasteSearch className="mr-1 mt-0.5 size-4" />
                                Chi tiết
                            </Button>
                            <Button className="flex items-center bg-gray-100 text-gray-400">
                                <TiDeleteOutline className="mr-1 mt-0.5 size-4" />
                                Cancel
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </div>
    )
}
export default OrdersUser
