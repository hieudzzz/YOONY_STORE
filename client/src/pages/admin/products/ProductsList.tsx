import { Link } from "react-router-dom";
import { Input } from "antd";
import { Table, ToggleSwitch } from "flowbite-react";
import { useContext, useState } from "react";
import ProductContext from "../../../contexts/ProductContext";
import Highlighter from "react-highlight-words";
import { Avatar } from "flowbite-react";
import axios from "axios";
import { toast } from "react-toastify";
import instance from "../../../instance/instance";
const ProductList = () => {
  const { Search } = Input;
  const { products, dispatch } = useContext(ProductContext);
  const [valSearch, setValSearch] = useState<string>("");

  const renderImageProduct = (images: string[]) => {
    const avatars = [];
    for (let i = 0; i < images.length - 1; i++) {
      avatars.push(<Avatar key={i} img={images[i]} rounded stacked />);
    }
    return avatars;
  };
  
  const handleRemoveProduct = async (id: number) => {
    try {
      const data = await instance.delete(`products/${id}`);
      if (data) {
        toast.success('Di chuyển tới thùng rác thành công !')
        dispatch({
          type: "DELETE",
          payload: id,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Đã xảy ra lỗi không mong muốn");
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <Link
          to={"add"}
          className="flex items-center font-medium gap-1 text-white py-2 px-3.5 bg-primary hover:bg-transparent hover:outline-primary hover:outline-1 hover:outline hover:text-primary transition-all rounded-md text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          THÊM SẢN PHẨM
        </Link>
        <div>
          <Search
            placeholder="Tên sản phẩm"
            allowClear
            onChange={(e) => {
              setValSearch(e.target.value);
            }}
            size="large"
            enterButton
          />
        </div>
      </div>
      <div className="rounded-lg overflow-hidden">
        <Table hoverable>
          <Table.Head className="text-center">
            <Table.HeadCell className="bg-primary text-white text-sm font-medium">
              STT
            </Table.HeadCell>
            <Table.HeadCell className="bg-primary text-white text-sm font-medium">
              Tên sản phẩm
            </Table.HeadCell>
            {/* <Table.HeadCell className="bg-primary text-white text-sm font-medium">
              Slug
            </Table.HeadCell> */}
            <Table.HeadCell className="bg-primary text-white text-sm font-medium">
              Danh mục
            </Table.HeadCell>
            <Table.HeadCell className="bg-primary text-white text-sm font-medium">
              Hình Ảnh
            </Table.HeadCell>
            <Table.HeadCell className="bg-primary text-white text-sm font-medium">
              Nổi bật
            </Table.HeadCell>
            <Table.HeadCell className="bg-primary text-white text-sm font-medium">
              SALE
            </Table.HeadCell>
            <Table.HeadCell className="bg-primary text-white text-sm font-medium">
              Trạng thái
            </Table.HeadCell>
            <Table.HeadCell className="bg-primary text-white text-sm font-medium">
              Hành động
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {products
              .filter((item) => {
                return item.name
                  .toLowerCase()
                  .includes(valSearch.toLowerCase());
              })
              .map((product, index) => {
                return (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
                    key={product.id}
                  >
                    <Table.Cell className="font-medium text-primary text-base border-[#f5f5f5] border-r ">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-secondary dark:text-white">
                      <Highlighter
                        highlightClassName="YourHighlightClass"
                        searchWords={[valSearch.toLowerCase()]}
                        autoEscape={true}
                        textToHighlight={product.name}
                      />
                    </Table.Cell>
                    {/* <Table.Cell>{product.slug}</Table.Cell> */}
                    <Table.Cell>{product?.category?.name}</Table.Cell>
                    <Table.Cell>
                      <Avatar.Group className="justify-center">
                        {renderImageProduct(product.images)}
                        <Avatar.Counter className="bg-primary" total={product.images.length} />
                      </Avatar.Group>
                    </Table.Cell>
                    <Table.Cell>
                      <ToggleSwitch
                        sizing={"sm"}
                        checked={true}
                        onChange={() => {}}
                        className="mx-auto"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <ToggleSwitch
                        sizing={"sm"}
                        checked={true}
                        onChange={() => {}}
                        className="mx-auto"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <ToggleSwitch
                        sizing={"sm"}
                        checked={true}
                        onChange={() => {}}
                        className="mx-auto"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2 justify-center">
                        <Link to={`update/${product.id}`}
                          className="bg-util shadow py-1.5 px-3 rounded-md"
                        >
                          <svg
                            className="size-5"
                            fill="none"
                            viewBox="0 0 20 20"
                          >
                            <path
                              stroke="#1FD178"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeMiterlimit="10"
                              strokeWidth="1.5"
                              d="M11.05 3l-6.842 7.242c-.258.275-.508.816-.558 1.191l-.308 2.7c-.109.975.591 1.642 1.558 1.475l2.683-.458c.375-.067.9-.342 1.159-.625l6.841-7.242c1.184-1.25 1.717-2.675-.125-4.416C13.625 1.142 12.233 1.75 11.05 3zM9.908 4.208A5.105 5.105 0 0014.45 8.5M2.5 18.333h15"
                            ></path>
                          </svg>
                        </Link>
                        <button
                          className="bg-util shadow py-1.5 px-3 rounded-md text-primary"
                          onClick={() => {
                            swal({
                              title: "Di chuyển tới thùng rác",
                              text: "Sau khi di chuyển sản phẩm sẽ xoá tạm thời !",
                              icon: "warning",
                              buttons: ["Hủy", "Thùng rác"],
                              dangerMode: true,
                            }).then((willDelete) => {
                              if (willDelete) {
                                handleRemoveProduct(product.id!);
                              }
                            });
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="size-6"
                            color={"currentColor"}
                            fill={"none"}
                          >
                            <path
                              d="M4.47461 6.10018L5.31543 18.1768C5.40886 19.3365 6.28178 21.5536 8.51889 21.8022C10.756 22.0507 15.2503 21.9951 16.0699 21.9951C16.8895 21.9951 19.0128 21.4136 19.0128 19.0059C19.0128 16.5756 16.9833 15.9419 15.7077 15.9635H12.0554M12.0554 15.9635C12.0607 15.7494 12.1515 15.5372 12.3278 15.3828L14.487 13.4924M12.0554 15.9635C12.0497 16.1919 12.1412 16.4224 12.33 16.5864L14.487 18.4609M19.4701 5.82422L19.0023 13.4792"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3 5.49561H21M16.0555 5.49561L15.3729 4.08911C14.9194 3.15481 14.6926 2.68766 14.3015 2.39631C14.2148 2.33168 14.1229 2.2742 14.0268 2.22442C13.5937 2 13.0739 2 12.0343 2C10.9686 2 10.4358 2 9.99549 2.23383C9.89791 2.28565 9.80479 2.34547 9.7171 2.41265C9.32145 2.7158 9.10044 3.20004 8.65842 4.16854L8.05273 5.49561"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default ProductList;
