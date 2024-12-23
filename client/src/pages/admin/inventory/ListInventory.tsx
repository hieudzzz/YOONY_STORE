import {
  Avatar,
  Checkbox,
  ConfigProvider,
  Input,
  Pagination,
} from "antd";
import type { CheckboxProps } from "antd";
import { Table } from "flowbite-react";
import { useCallback, useContext, useEffect, useState } from "react";
import InventoryContext from "../../../contexts/InventoryContext";
import instance from "../../../instance/instance";
import dayjs from "dayjs";
import { IVariants } from "../../../interfaces/IVariants";
import { Link, useSearchParams } from "react-router-dom";
import { IMeta } from "../../../interfaces/IMeta";
import ModalInventoryImport from "./ModalInventoryImport";

import ButtonExport from "../../../components/Admin/Button/ButtonExport";
import { ICategory } from "../../../interfaces/ICategory";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
const ListInventory = () => {
  const [valSearch, SetValSearch] = useState<string>("");
  const { Search } = Input;
  const [checkedListCategory, setCheckedListCategory] = useState<string[]>([]);
  const [checkedListInventory, setCheckedListInventory] = useState<string[]>(
    []
  );
  const [isLoading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();
  const { inventorys, dispatch } = useContext(InventoryContext);
  const [idProduct, setIdProduct] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenShowDetail, setIsModalOpenShowDetail] = useState(false);
  const [isModalOpenHistory, setIsModalOpenHistory] = useState(false);
  const [categoryFilter, setcategoryFilter] = useState<ICategory[]>([]);

  const onChangeCategories = (list: string[]) => {
    setCheckedListCategory(list);
  };
  const onChangeInventory = (list: string[]) => {
    setCheckedListInventory(list);
  };
  const stockFilterInventory = [
    {
      label: "Dưới định mức tồn (SL: 50)",
      value: "duoi50",
    },
    {
      label: "Vượt định mức tồn (SL: 500)",
      value: "tren500",
    },
    {
      label: "Còn hàng trong kho",
      value: "conhang",
    },
    {
      label: "Hết hàng trong kho",
      value: "tonkho0",
    },
  ];

  const plainOptionsInventory = stockFilterInventory.map((item) => ({
    label: item.label,
    value: item.value,
  }));

  const plainOptionsCategory = categoryFilter.map((item) => ({
    label: item.name,
    value: item.slug,
  }));


  const checkAll = plainOptionsInventory.length === checkedListInventory.length;
  const indeterminate =
    checkedListInventory.length > 0 &&
    checkedListInventory.length < plainOptionsInventory.length;

  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setCheckedListInventory(
      e.target.checked
        ? plainOptionsInventory.map((option) => option.value)
        : []
    );
  };

  // list danh sách nhập hàng rồi
  useEffect(() => {
    (async () => {
      try {
        setSearchParams({ page: String(page) });
        const { data } = await instance.get(
          `productsWithInventoryImports?page=${page}`
        );
        if (data) {
          dispatch({
            type: "LIST",
            payload: data.data,
          });
          setMeta(data.meta);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [page]);

  function findNewestUpdateTime(variants: IVariants[]): string | null {
    let newestUpdate = "";

    variants.forEach((variant) => {
      const updatedAt = variant.updated_at;
      if (!newestUpdate || updatedAt > newestUpdate) {
        newestUpdate = updatedAt;
      }
    });

    return newestUpdate || null;
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModalDetail = (id: number) => {
    setIsModalOpenShowDetail(true);
    setIdProduct(id);
  };
  const showModalHistory = () => {
    setIsModalOpenHistory(true);
  };
  const handleCancel = () => {
    setIsModalOpenShowDetail(false);
    setIsModalOpen(false);
  };

  const handleCancelHistory = () => {
    setIsModalOpenHistory(false);
    setIsModalOpenShowDetail(false);
  };

  const getFilterCategoryInventory = async () => {
    try {
      const { data } = await instance.get("filter-stock");
      setcategoryFilter(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFilterCategoryInventory();
  }, []);

  const fetchFilteredInventory = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await instance.post("filter-stock", {
        search: valSearch,
        categories: checkedListCategory,
        filter: checkedListInventory,
      });
      if (data) {
        dispatch({
          type: 'LIST',
          payload: data,
        });
      }
    } catch (error) {
      console.error("Error fetching filtered inventory:", error);
    } finally {
      setLoading(false);
    }
  }, [valSearch, checkedListCategory, checkedListInventory, dispatch]);
  
  useEffect(() => {
    fetchFilteredInventory();
  }, [fetchFilteredInventory]);

  return (
    <div className="grid grid-cols-12 gap-5 min-h-screen">
      <div className="col-span-3 bg-util rounded-md p-5 space-y-8">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Tìm kiếm</h3>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#ff9900",
              },
            }}
          >
            <Search
              placeholder="Tên hàng hoá"
              allowClear
              size="middle"
              onChange={(e) => {
                SetValSearch(e.target.value);
              }}
            />
          </ConfigProvider>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Nhóm hàng</h3>
          <ConfigProvider theme={{ token: { colorPrimary: "#ff9900" } }}>
            <Checkbox.Group
              options={plainOptionsCategory}
              onChange={onChangeCategories}
              value={checkedListCategory}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            />
          </ConfigProvider>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Tồn kho</h3>
          <ConfigProvider theme={{ token: { colorPrimary: "#ff9900" } }}>
            {/* <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
              disabled
            >
              Tất cả
            </Checkbox> */}
            <Checkbox.Group
              options={plainOptionsInventory}
              onChange={onChangeInventory}
              value={checkedListInventory}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            />
          </ConfigProvider>
        </div>
      </div>
      <div className="col-span-9 bg-util rounded-md p-5 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-lg">Hàng hoá</h2>
          <div className="flex items-center gap-2.5">
            <button
              className="flex gap-1.5 text-sm items-center text-util bg-primary py-2 px-4 rounded-md"
              onClick={showModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-5"
                color={"currentColor"}
                fill={"none"}
              >
                <path
                  d="M12 4V20M20 12H4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Nhập hàng
            </button>
            <ButtonExport
              data={inventorys}
              nameButton="Xuất excel"
              nameSheet="Bảng nhập hàng"
              nameFile="nhaphang.xlsx"
            />
          </div>
        </div>
        <LoadingOverlay
          active={isLoading}
          spinner
          text="Đang tải dữ liệu ..."
          styles={{
            overlay: (base) => ({
              ...base,
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(4px)",
            }),
            spinner: (base) => ({
              ...base,
              width: "40px",
              "& svg circle": {
                stroke: "rgba(255, 153, 0,5)",
                strokeWidth: "3px",
              },
            }),
          }}
        >
          <div className="overflow-x-auto listinventory-scroll">
            <Table className="border-b border-[#E4E7EB]">
              <Table.Head className="text-center">
                <Table.HeadCell
                  style={{
                    width: "5%",
                  }}
                  className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap"
                >
                  STT
                </Table.HeadCell>
                <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                  Hàng hoá
                </Table.HeadCell>
                <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                  Giá bán
                </Table.HeadCell>
                <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                  Giá vốn
                </Table.HeadCell>
                <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                  Tồn kho
                </Table.HeadCell>
                <Table.HeadCell
                className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap"
                style={{
                  width: "20%",
                }}
              >
                Hành động
              </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {inventorys.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={6}>
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
                        <p>Không có hàng hoá nào</p>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  inventorys.map((inventory, index) => {
                    return (
                      <Table.Row>
                        <Table.Cell className="text-center">
                          {index + 1}
                        </Table.Cell>
                        <Table.Cell className="text-center">
                          <div className="flex gap-2.5">
                            <Avatar
                              shape="square"
                              src={inventory.images[0]}
                              size={45}
                            />
                            <div className="max-w-[300px] space-y-0.5">
                              <Link
                                to={`/${inventory.category?.slug}/${inventory.slug}`}
                                className="text-left hover:text-primary/90 font-medium"
                              >
                                <p className="text-nowrap text-ellipsis overflow-hidden">
                                  {inventory.name}
                                </p>
                              </Link>
                              <p className="text-left text-nowrap text-ellipsis overflow-hidden text-sm text-secondary/50">
                                Cập nhật:{" "}
                                <span className="text-primary/75">
                                  {dayjs(
                                    findNewestUpdateTime(inventory.variants)
                                  ).format("DD-MM-YYYY")}
                                </span>
                              </p>
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell className="text-center text-nowrap">
                          {inventory.price_range}đ
                        </Table.Cell>
                        <Table.Cell className="text-center text-nowrap">
                          {inventory.import_price_range}đ
                        </Table.Cell>
                        <Table.Cell className="text-center text-nowrap">
                          {inventory.quantity_range}
                        </Table.Cell>
                        <Table.Cell className="text-center text-nowrap">
                        <div className="flex gap-2 justify-center">
                          <button
                            className="bg-util shadow py-2 px-3 rounded-md text-primary"
                            onClick={() => showModalDetail(inventory.id!)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="size-6"
                              color={"currentColor"}
                              fill={"none"}
                            >
                              <path
                                d="M11 22C10.1818 22 9.40019 21.6698 7.83693 21.0095C3.94564 19.3657 2 18.5438 2 17.1613C2 16.7742 2 10.0645 2 7M11 22L11 11.3548M11 22C11.7248 22 12.293 21.7409 13.5 21.2226M20 7V11"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M15 17.5H22M18.5 21L18.5 14"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
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
                            </svg>
                          </button>
                        </div>
                      </Table.Cell>
                      </Table.Row>
                    );
                  })
                )}
              </Table.Body>
            </Table>
          </div>
        </LoadingOverlay>
        <Pagination
          current={page}
          onChange={(page) => {
            setSearchParams({ page: String(page) });
          }}
          total={meta?.total || 0}
          pageSize={meta?.per_page || 10}
          showSizeChanger={false}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} của ${total} mục`
          }
          align="end"
        />
      </div>
      <ModalInventoryImport
        idProduct={idProduct!}
        isModalOpenShowDetail={isModalOpenShowDetail}
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        findNewestUpdateTime={findNewestUpdateTime}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default ListInventory;
