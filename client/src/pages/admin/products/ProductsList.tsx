import { Link, useSearchParams } from "react-router-dom";
import { Avatar, Badge, ConfigProvider, Input, Pagination, Switch } from "antd";
import { Table, ToggleSwitch } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import ProductContext from "../../../contexts/ProductContext";
import Highlighter from "react-highlight-words";
import axios from "axios";
import { toast } from "react-toastify";
import instance from "../../../instance/instance";
import { IProduct } from "../../../interfaces/IProduct";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
// import TrashContext from "../../../contexts/TrashContext";
import { IMeta } from "../../../interfaces/IMeta";
const ProductList = () => {
  const { Search } = Input;
  const { products, dispatch } = useContext(ProductContext);
  const [valSearch, setValSearch] = useState<string>("");
  // const { trashProducts, dispatch: disPathTrash } = useContext(TrashContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();
  function convertToExcelData(products: IProduct[]) {
    const result = [];
    const allAttributes = new Set<string>();

    // Thu thập tất cả các thuộc tính động
    products.forEach((product) => {
      product.variants.forEach((variant) => {
        variant.attribute_values.forEach((attr) => {
          allAttributes.add(attr.attribute.name);
        });
      });
    });

    products.forEach((product) => {
      product.variants.forEach((variant) => {
        const row: any = {
          // Thông tin sản phẩm
          "ID Sản Phẩm": product.id,
          "Tên Sản Phẩm": product.name,
          Slug: product.slug,
          "Hình Ảnh": product.images ? product.images[0] : "",

          // Thông tin variant
          "ID Variant": variant.id,
          "Số Lượng Tồn": variant.quantity,

          // Thông tin nhập hàng
          "Giá Nhập": variant.inventoryImports?.import_price || "",
          "Số Lượng Nhập": variant.inventoryImports?.quantity || "",

          // Thông tin nhà cung cấp
          "Nhà Cung Cấp ID": variant.inventoryImports?.supplier?.id || "",
        };

        // Thêm các thuộc tính động
        variant.attribute_values.forEach((attr) => {
          row[`${attr.attribute.name} (Tên)`] = attr.attribute.name;
          row[`${attr.attribute.name} (Giá Trị)`] = attr.value;
        });

        result.push(row);
      });
    });

    // Tạo danh sách cột động
    const dynamicAttributeColumns = Array.from(allAttributes).flatMap(
      (attr) => [`${attr} (Tên)`, `${attr} (Giá Trị)`]
    );

    // Định nghĩa thứ tự cột
    const columns = [
      "ID Sản Phẩm",
      "Tên Sản Phẩm",
      "Slug",
      "Hình Ảnh",
      "ID Variant",
      "Số Lượng Tồn",
      "Giá Nhập",
      "Số Lượng Nhập",
      "Nhà Cung Cấp ID",
      ...dynamicAttributeColumns,
    ];

    return { result, columns };
  }

  function exportToExcel(products: IProduct[]) {
    const { result, columns } = convertToExcelData(products);

    // Chuyển đổi mảng kết quả thành worksheet
    const ws = XLSX.utils.json_to_sheet(result, { header: columns });
    const wb = XLSX.utils.book_new(); // Tạo workbook mới
    XLSX.utils.book_append_sheet(wb, ws, "Products"); // Thêm sheet vào workbook

    // Xuất file Excel
    XLSX.writeFile(wb, "products_with_attributes.xlsx");
  }
  useEffect(() => {
    (async () => {
      try {
        setSearchParams({ page: String(page) });
        const { data } = await instance.get(`products?page=${page}`);
        dispatch({
          type: "LIST",
          payload: data.data,
        });
        setMeta(data.meta);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        } else if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log("Đã xảy ra lỗi không mong muốn");
        }
      }
    })();
  }, [page]);

  const handleUpdateStatus = async (idProduct: number, status: any) => {
    try {
      const {
        data: { data: response },
      } = await instance.patch(`product/${idProduct}/is_active`, {
        is_active: status,
      });
      if (response) {
        dispatch({
          type: "UPDATE",
          payload: response,
        });
        if (status) {
          toast.success("Hiển thị");
        } else {
          toast.warning("Ẩn sản phẩm");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateFeature = async (idProduct: number, is_featured: any) => {
    try {
      const {
        data: { data: response },
      } = await instance.patch(`product/${idProduct}/is_featured`, {
        is_featured: is_featured,
      });
      if (response) {
        dispatch({
          type: "UPDATE",
          payload: response,
        });
        if (is_featured) {
          toast.success("Nổi bật");
        } else {
          toast.warning("Ẩn nổi bật");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemoveProduct = async (id: number) => {
    try {
      const {
        data: { data: response },
      } = await instance.delete(`products/${id}`);
      if (response) {
        toast.success("Di chuyển tới thùng rác thành công !");
        dispatch({
          type: "DELETE",
          payload: id,
        });
        disPathTrash({
          type: "ADD",
          payload: response,
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
    <div className="space-y-5 bg-util p-5 rounded-md">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Link
            to={"add"}
            className="flex items-center font-medium gap-1 text-white py-1.5 px-3.5 bg-primary hover:bg-transparent hover:outline-primary hover:outline-1 hover:outline hover:text-primary transition-all rounded-md text-sm"
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
          {/* <ConfigProvider
            theme={{
              components: {
                Badge: {
                  colorError: "#ff9900",
                },
              },
            }}
          >
            <Badge count={trashProducts.length}>
              <Link
                to={"trashs"}
                className="flex items-center font-medium gap-1 text-primary py-1.5 px-3.5 bg-primary/10 hover:text-primary transition-all rounded-md text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-6"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M3.25 5H8.67963C9.34834 5 9.9728 4.6658 10.3437 4.1094L11.1563 2.8906C11.5272 2.3342 12.1517 2 12.8204 2H17.3085C18.1693 2 18.9336 2.55086 19.2058 3.36754L19.75 5M21.25 5H8.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M19.75 5L19.1303 14.906C19.1088 15.2333 19.0887 15.5385 19.0685 15.8235M4.75 5L5.35461 14.8966C5.50945 17.3107 5.58688 18.5177 6.22868 19.3857C6.546 19.8149 6.9548 20.1771 7.42905 20.4493C8.3883 21 9.67312 21 12.2427 21H14.75"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20.25 19C20.25 17.3431 18.9069 16 17.25 16C15.5931 16 14.25 17.3431 14.25 19C14.25 20.6569 15.5931 22 17.25 22C18.9069 22 20.25 20.6569 20.25 19Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                Thùng rác
              </Link>
            </Badge>
          </ConfigProvider> */}
        </div>
        <div className="flex items-center gap-3">
          <button
            className="py-1.5 px-3.5 bg-[#29C27F] text-util flex items-center gap-1.5 text-sm rounded-sm"
            onClick={() => exportToExcel(products)}
          >
            <SiMicrosoftexcel size={25} />
            <p className="text-nowrap">Xuất file</p>
          </button>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#ff9900",
              },
            }}
          >
            <Search
              placeholder="Tên sản phẩm"
              allowClear
              onChange={(e) => {
                setValSearch(e.target.value);
              }}
              size="large"
            />
          </ConfigProvider>
        </div>
      </div>
      <div className="rounded-lg overflow-auto border-b border-[#f1f1f1]">
        <Table>
          <Table.Head className="text-center">
            <Table.HeadCell
              style={{ width: "5%" }}
              className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap"
            >
              STT
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Tên sản phẩm
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Danh mục
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Nổi bật
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Trạng thái
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Hành động
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {products.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={8}>
                  <div className="flex flex-col items-center text-secondary/20 space-y-2 justify-center min-h-[50vh]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-16"
                      viewBox="0 0 64 41"
                    >
                      <g
                        fill="none"
                        fillRule="evenodd"
                        transform="translate(0 1)"
                      >
                        <ellipse
                          cx="32"
                          cy="33"
                          fill="#f5f5f5"
                          rx="32"
                          ry="7"
                        ></ellipse>
                        <g fillRule="nonzero" stroke="#d9d9d9">
                          <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                          <path
                            fill="#fafafa"
                            d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                          ></path>
                        </g>
                      </g>
                    </svg>
                    <p>Không có sản phẩm nào</p>
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : (
              products
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
                      <Table.Cell className="whitespace-nowrap font-medium text-secondary/70 dark:text-white text-left">
                        <div className="flex gap-2">
                          <Avatar
                            shape="square"
                            src={product.images[0]}
                            size={46}
                            className="w-full"
                          />
                          <p className="space-y-1 max-w-[300px] w-full text-ellipsis text-nowrap overflow-hidden">
                            <Link
                              to={`/${product.category?.slug}/${product.slug}`}
                            >
                              <Highlighter
                                highlightClassName="YourHighlightClass"
                                searchWords={[valSearch.toLowerCase()]}
                                autoEscape={true}
                                textToHighlight={product.name}
                                className="hover:text-primary"
                              />
                              <p className="text-sm font-normal text-secondary/50">
                                Cập nhật:{" "}
                                <span className="text-primary/75">
                                  {dayjs(product.updated_at).format(
                                    "DD-MM-YYYY"
                                  )}
                                </span>
                              </p>
                            </Link>
                          </p>
                        </div>
                      </Table.Cell>
                      {/* <Table.Cell>{product.slug}</Table.Cell> */}
                      <Table.Cell>{product?.category?.name}</Table.Cell>
                      <Table.Cell>
                        <ConfigProvider
                          theme={{
                            token: {
                              colorPrimary: "#ff9900",
                            },
                          }}
                        >
                          <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            checked={product.is_featured}
                            onChange={() =>
                              handleUpdateFeature(
                                product.id!,
                                !product.is_featured
                              )
                            }
                          />
                        </ConfigProvider>
                      </Table.Cell>
                      <Table.Cell>
                        <ConfigProvider
                          theme={{
                            token: {
                              colorPrimary: "#ff9900",
                            },
                          }}
                        >
                          <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            checked={product.is_active}
                            onChange={() =>
                              handleUpdateStatus(
                                product.id!,
                                !product.is_active
                              )
                            }
                          />
                        </ConfigProvider>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-2 justify-center">
                          <Link
                            to={`update/${product.id}`}
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
                          {/* <button
                          className="bg-util shadow py-1.5 px-3 rounded-md text-primary"
                          onClick={() => {
                            swal({
                              title: "Di chuyển tới thùng rác",
                              text: "Sau khi di chuyển sản phẩm sẽ xoá tạm thời !",
                              icon: "warning",
                              buttons: ["Hủy", "Thùng rác"],
                              dangerMode: true,
                              className: "my-swal",
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
                        </button> */}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
            )}
          </Table.Body>
        </Table>
      </div>
      <Pagination
        current={page}
        onChange={(page) => {
          setSearchParams({ page: String(page) });
        }}
        total={meta?.total || 0}
        pageSize={meta?.per_page || 10}
        showSizeChanger={false}
        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} mục`}
        align="end"
      />
    </div>
  );
};

export default ProductList;
