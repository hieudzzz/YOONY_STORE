import { Avatar, ConfigProvider, Input, Modal, Popconfirm, Select } from "antd";
import { Table } from "flowbite-react";
import React, { useContext, useEffect, useState } from "react";
import instance from "../../../instance/instance";
import { IProduct } from "../../../interfaces/IProduct";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { IVariants } from "../../../interfaces/IVariants";
import ButtonSubmit from "../../../components/Admin/ButtonSubmit";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { IAttributeValue } from "../../../interfaces/IAttributeValue";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
import { Checkbox } from "antd";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import slugify from "react-slugify";
import { ISupplier } from "../../../interfaces/ISupplier";
type Props = {
  isModalOpen: boolean;
  handleCancel: () => void;
  findNewestUpdateTime: (variants: IVariants[]) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
  idProduct: number;
  isModalOpenShowDetail: boolean;
};

type FormValues = {
  variants: Array<
    IVariants & {
      newImport?: {
        import_price: number;
        quantity: number;
        supplier: {
          id: number;
        };
      };
    }
  >;
};

const ModalInventoryImport = ({
  isModalOpen,
  findNewestUpdateTime,
  handleCancel,
  setIsModalOpen,
  idProduct,
  isModalOpenShowDetail,
}: Props) => {
  const { Search } = Input;
  const [valSearch, SetValSearch] = useState<string>("");
  const [inventorys, setInventorys] = useState<IProduct[]>([]);
  const [inventoryItem, setInventoryItem] = useState<IVariants[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  // const { inventorys, dispatch } = useContext(InventoryContext);
  const [optionsSupplier, setOptionsSupplier] = useState([]);
  const [selectedVariantIndices, setSelectedVariantIndices] = useState<
    number[]
  >([]);
  const [isExpandAll, setIsExpandAll] = useState(false);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [selectedVariants, setSelectedVariants] = useState<IVariants[]>([]);
  const handleCheckboxChange = (index: number) => {
    setSelectedVariantIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const handleSelectAll = () => {
    if (selectedVariantIndices.length === fields.length) {
      setSelectedVariantIndices([]);
    } else {
      setSelectedVariantIndices(fields.map((_, index) => index));
    }
  };
  const fetchSuppliers = async () => {
    try {
      const {
        data: {
          data: { data: response },
        },
      } = await instance.get("suppliers");
      return response.map((supplier: ISupplier) => ({
        label: supplier.name,
        value: supplier.id,
      }));
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadSuppliers = async () => {
      const suppliers = await fetchSuppliers();
      setOptionsSupplier(suppliers);
    };
    loadSuppliers();
  }, []);

  const fetchNoInventory = async () => {
    try {
      const { data } = await instance.get(`getAllProductNoImport`);
      setInventorys(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNoInventory();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { data: response },
        } = await instance.get(`import-detail/${idProduct}`);

        console.log(response);
        // Đặt inventorys và chọn sản phẩm
        setInventorys([response]);
        setSelectedProductId(response.id);

        // Cập nhật variants và mở rộng
        if (response && response.variants && response.variants.length > 0) {
          setInventoryItem(response.variants);

          // Reset form với variants mới
          reset({
            variants: response.variants,
          });
        }
      } catch (error) {
        console.log(error);
        // Reset state nếu fetch lỗi
        setInventorys([]);
        setInventoryItem([]);
        setSelectedProductId(null);
      }
    };

    // Kiểm tra điều kiện để fetch
    if (idProduct && (isModalOpen || isModalOpenShowDetail)) {
      fetchData();
    } else {
      setSelectedProductId(null);
    }
  }, [idProduct, isModalOpen, isModalOpenShowDetail]);

  const { control, handleSubmit, register, setValue, reset, watch, getValues } =
    useForm<FormValues>();

  const { fields } = useFieldArray({
    control,
    name: "variants",
  });

  const handleUpdateVariantIventory = (id: number) => {
    const inventoryItem =
      inventorys.find((item) => item.id === id)?.variants || [];

    reset({
      variants: inventoryItem,
    });

    setInventoryItem(inventoryItem);
  };

  const handleToggleVariants = (id: number) => {
    if (selectedProductId === id) {
      setSelectedProductId(null);
    } else {
      setSelectedProductId(id);
      handleUpdateVariantIventory(id);
    }
  };

  useEffect(() => {
    if (inventoryItem.length > 0) {
      setValue("variants", inventoryItem);
    }
  }, [inventoryItem, setValue]);

  const renderAttributes = (attributeValues?: IAttributeValue[]) => {
    if (!attributeValues || !Array.isArray(attributeValues)) {
      return "Không có phân loại";
    }
    return attributeValues
      .map((attr) => {
        return attr.value;
      })
      .join(", ");
  };

  // Hàm kiểm tra xem một variant đã được chọn chưa
  const isVariantSelected = (variant: IVariants) => {
    return selectedVariants.some((v) => v.id === variant.id);
  };

  // Hàm chọn/bỏ chọn tất cả variants của một nhóm
  const handleGroupSelect = (variants: IVariants[]) => {
    const allSelected = variants.every((v) => isVariantSelected(v));

    if (allSelected) {
      // Bỏ chọn tất cả variants trong nhóm
      setSelectedVariants((prev) =>
        prev.filter((v) => !variants.some((gv) => gv.id === v.id))
      );
    } else {
      // Chọn tất cả variants trong nhóm
      setSelectedVariants((prev) => {
        // Loại bỏ các variants đã chọn trong nhóm này
        const filteredPrev = prev.filter(
          (v) => !variants.some((gv) => gv.id === v.id)
        );
        // Thêm tất cả variants mới
        return [...filteredPrev, ...variants];
      });
    }
  };

  // Hàm chọn/bỏ chọn tất cả variants
  const handleSelectAllVariants = () => {
    const allVariants = inventorys.flatMap((product) => product.variants);

    if (selectedVariants.length === allVariants.length) {
      // Bỏ chọn tất cả
      setSelectedVariants([]);
    } else {
      // Chọn tất cả
      setSelectedVariants(allVariants);
    }
  };
  // Hàm xử lý nhập kho cho các variant đã chọn
  const handleImportSelectedVariants = async () => {
    if (selectedVariants.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một variant.");
      return;
    }

    setLoading(true);
    try {
      // Tìm và báo cáo các variant không đủ thông tin
      const invalidVariants = selectedVariants.filter(
        (variant) =>
          !variant.inventoryImports?.import_price ||
          !variant.inventoryImports?.quantity ||
          !variant.inventoryImports?.supplier?.id
      );

      // Hiển thị chi tiết các variant không hợp lệ
      if (invalidVariants.length > 0) {
        const invalidVariantDetails = invalidVariants.map((variant) => {
          const missingFields = [];

          if (!variant.inventoryImports?.import_price) {
            missingFields.push("Giá nhập");
          }

          if (!variant.inventoryImports?.quantity) {
            missingFields.push("Số lượng");
          }

          if (!variant.inventoryImports?.supplier?.id) {
            missingFields.push("Nhà cung cấp");
          }

          return {
            id: variant.id,
            missingFields: missingFields.join(", "),
            attributes: variant.attribute_values
              .map((attr) => `${attr.attribute.name}: ${attr.value}`)
              .join(", "),
          };
        });

        // Tạo thông báo chi tiết
        const errorMessage = invalidVariantDetails
          .map(
            (variant) =>
              `Biến thể ${variant.id} (${variant.attributes}): Thiếu ${variant.missingFields}`
          )
          .join("\n");

        toast.warning(
          <div>
            <p>Có {invalidVariants.length} variant không đủ thông tin:</p>
            <pre
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            >
              {errorMessage}
            </pre>
          </div>,
          {
            autoClose: false,
            closeOnClick: false,
          }
        );
        setLoading(false);
        return;
      }
      // Lọc các variant hợp lệ
      const importVariants = selectedVariants.map((variant) => ({
        variant_id: variant.id,
        supplier_id: variant.inventoryImports?.supplier?.id || null,
        quantity: variant.inventoryImports?.quantity || null,
        import_price: variant.inventoryImports?.import_price || null,
      }));

      const { data } = await instance.post("import-multiple-orders", {
        variants: importVariants,
      });

      if (data) {
        toast.success(`Nhập kho thành công ${importVariants.length} biến thể!`);
        await fetchNoInventory();
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi nhập kho:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi nhập kho."
      );
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa lần nhập

  const onImportInventory = async (dataForm: FormValues) => {
    setLoading(true);
    try {
      const validVariants = dataForm.variants
        .filter((variant) => {
          const newImport = variant.newImport;
          return (
            newImport?.import_price &&
            newImport?.quantity &&
            newImport?.supplier?.id
          );
        })
        .map((variant) => ({
          variant_id: variant.id,
          supplier_id: variant.newImport?.supplier.id,
          quantity: variant.newImport?.quantity,
          import_price: variant.newImport?.import_price,
        }));

      // Kiểm tra nếu không có variant nào hợp lệ
      if (validVariants.length === 0) {
        toast.warning("Không có variant nào đủ thông tin để nhập kho");
        return;
      }

      // Kiểm tra và validate dữ liệu trước khi gửi
      const invalidVariants = validVariants.filter(
        (variant) =>
          !variant.variant_id ||
          !variant.supplier_id ||
          (variant.quantity || 0) <= 0 ||
          (variant.import_price || 0) <= 0
      );

      if (invalidVariants.length > 0) {
        toast.error(`Có ${invalidVariants.length} variant không hợp lệ`);
        return;
      }

      try {
        const { data, status } = await instance.post("import-multiple-orders", {
          variants: validVariants,
        });

        // Kiểm tra response từ API
        if (status !== 200 || !data) {
          throw new Error("Nhập kho không thành công");
        }

        // Lấy thông tin import records từ response
        const importRecords = data.importedRecords || [];

        // Cập nhật trực tiếp vào form state
        const currentVariants = getValues("variants");
        const updatedVariants = currentVariants.map((variant) => {
          // Tìm variant tương ứng trong validVariants
          const matchedValidVariant = validVariants.find(
            (validVariant) => validVariant.variant_id === variant.id
          );

          if (matchedValidVariant) {
            // Tìm import record tương ứng
            const matchedImportRecord = importRecords.find(
              (record) => record.variant_id === variant.id
            );

            const newImportRecord = {
              id: matchedImportRecord?.id, // Lấy ID từ response
              import_price: variant.newImport?.import_price,
              quantity: variant.newImport?.quantity,
              supplier: {
                id: variant.newImport?.supplier.id,
                name: optionsSupplier.find(
                  (sup) => sup.value === variant.newImport?.supplier.id
                )?.label,
              },
              created_at:
                matchedImportRecord?.created_at || new Date().toISOString(),
            };

            return {
              ...variant,
              quantity:
                (variant.quantity || 0) + (variant.newImport?.quantity || 0),
              inventoryImports: [
                ...(variant.inventoryImports || []),
                newImportRecord,
              ],
              newImport: null, // Reset newImport
            };
          }
          return variant;
        });

        // Cập nhật form và state
        reset({ variants: updatedVariants });

        // Cập nhật inventorys
        const updatedInventorys = inventorys.map((product) => ({
          ...product,
          variants: product.variants.map((variant) => {
            const matchedUpdatedVariant = updatedVariants.find(
              (v) => v.id === variant.id
            );
            return matchedUpdatedVariant || variant;
          }),
        }));

        setInventorys(updatedInventorys);

        toast.success(`Nhập kho thành công ${validVariants.length} biến thể!`);

        // Làm mới danh sách sản phẩm chưa nhập kho
        await fetchNoInventory();
      } catch (apiError) {
        console.error("API Error:", apiError);
        toast.error(
          apiError.response?.data?.message || "Có lỗi xảy ra khi nhập kho"
        );
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      toast.error("Có lỗi không xác định xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const [variantDetails, setVariantDetails] = useState<IVariants[]>([]);
  const [unlockVariantDetails, setUnlockVariantDetails] = useState<IVariants[]>(
    []
  );

  const handleLockImportRecord = async (importId: number) => {
    try {
      const {
        data: { data: response },
      } = await instance.delete(`deleteImport/${importId}`);
      if (response) {
        setVariantDetails(
          variantDetails.filter((variantDetail) => {
            return variantDetail?.inventory_import?.id !== importId;
          })
        );
        toast.success("Khoá lô hàng thành công");
      }

    } catch (error) {
      console.error("Lỗi khi xóa lô nhập hàng:", error);
    }
  };
  const handleUnLockImportRecord = async (importId: number) => {
    try {
      const {
        data: { data: response },
      } = await instance.post(`inventory-imports/${importId}/restore`);
      if (response) {
        setUnlockVariantDetails(
          unlockVariantDetails.filter((variantDetail) => {
            return variantDetail?.inventory_import?.id !== importId;
          })
        );
        toast.success("Mở khoá lô nhập hàng thành công");
      }
    } catch (error) {
      console.error("Lỗi khi xóa lô nhập hàng:", error);
    }
  };

  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Chuyển đổi dữ liệu Excel thành mảng JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Xử lý dữ liệu để tạo inventorys và inventoryItem
        const processedInventorys = processExcelData(jsonData);

        // KHÔNG gộp sản phẩm, giữ nguyên mảng
        setInventorys(processedInventorys);
        setIsExpandAll(true);

        // Lấy variants từ processedInventorys
        const allVariants = processedInventorys.flatMap(
          (product) => product.variants
        );
        setInventoryItem(allVariants);
        setSelectedProductId(processedInventorys[0]?.id || null);

        toast.success("Import Excel thành công!");
      } catch (error) {
        console.error("Lỗi khi đọc file Excel:", error);
        toast.error("Có lỗi xảy ra khi import Excel");
      }
    };

    reader.readAsBinaryString(file);
  };

  const processExcelData = (data: any[]): IProduct[] => {
    const headers = data[0];
    const processedData: IProduct[] = [];
    const productColumns = {
      id: headers.indexOf("ID Sản Phẩm"),
      name: headers.indexOf("Tên Sản Phẩm"),
      slug: headers.indexOf("Slug"),
      images: headers.indexOf("Hình Ảnh"),
    };

    const variantColumns = {
      id: headers.indexOf("ID Variant"),
      inventoryImportPrice: headers.indexOf("Giá Nhập"),
      inventoryImportQuantity: headers.indexOf("Số Lượng Nhập"),
      supplierId: headers.indexOf("Nhà Cung Cấp ID"),
    };

    const dynamicAttributeColumns = headers.reduce((acc, header, index) => {
      const match = header.match(/^(.*) \(Tên\)$/);
      if (match) {
        const attributeName = match[1];
        acc.push({
          name: attributeName,
          nameIndex: index,
          valueIndex: headers.findIndex(
            (h) => h === `${attributeName} (Giá Trị)`
          ),
        });
      }
      return acc;
    }, [] as Array<{ name: string; nameIndex: number; valueIndex: number }>);

    // Bắt đầu từ hàng thứ 2 (index 1)
    for (let i = 1; i < data.length; i++) {
      const rowData = data[i];
      // Kiểm tra nếu dòng rỗng
      if (rowData.every((cell) => cell == null || cell === "")) continue;

      // Tạo sản phẩm mới cho mỗi dòng
      const product: IProduct = {
        id: rowData[productColumns.id],
        name: rowData[productColumns.name],
        slug:
          rowData[productColumns.slug] || slugify(rowData[productColumns.name]),
        images: [rowData[productColumns.images]],
        variants: [],
      };

      // Tạo variant
      const variant: IVariants = {
        id: rowData[variantColumns.id],
        quantity: rowData[variantColumns.quantity] || 0,
        attribute_values: dynamicAttributeColumns.map((attr) => ({
          id: null,
          value: rowData[attr.valueIndex],
          attribute: {
            id: null,
            name: attr.name,
            slug: slugify(attr.name),
            type: attr.name.toLowerCase() === "color" ? "color" : "button",
          },
        })),
        inventoryImports: {
          import_price: rowData[variantColumns.inventoryImportPrice],
          quantity: rowData[variantColumns.inventoryImportQuantity] || 0,
          supplier: {
            id: rowData[variantColumns.supplierId],
          },
        },
      };
      console.log("Headers:", processedData);
      // Thêm variant vào sản phẩm
      product.variants.push(variant);

      // Thêm sản phẩm vào mảng
      processedData.push(product);
    }

    return processedData;
  };

  const modalWidth = isExpandAll ? 1240 : 750;

  const watchVariants = watch("variants");

  const calculateTotalQuantity = (item: IVariants) => {
    // Tìm variant hiện tại trong watchVariants
    const currentVariant = watchVariants.find((v) => v.id === item.id);

    if (!currentVariant) return item.quantity || "rỗng";

    // Số lượng gốc
    const baseQuantity = item.quantity || 0;

    // Số lượng nhập từ form
    const formImportQuantity = currentVariant.newImport?.quantity || 0;

    // Tổng số lượng từ các bản ghi nhập kho đã lưu
    const savedImportedQuantity =
      currentVariant.inventoryImports?.reduce(
        (total, record) => total + (record.quantity || 0),
        0
      ) || 0;

    // Tính toán tổng số lượng
    const totalQuantity =
      baseQuantity + formImportQuantity + savedImportedQuantity;

    return totalQuantity > 0 ? totalQuantity : "rỗng";
  };

  const [expandedVariantId, setExpandedVariantId] = useState<number | null>(
    null
  );
  const [unlockVariantId, setUnlockVariantId] = useState<number | null>(null);

  const toggleVariantDetails = async (item: any) => {
    const originalVariant = inventoryItem.find((v) =>
      v.attribute_values.every(
        (attr, index) => attr.value === item.attribute_values[index]?.value
      )
    );

    if (originalVariant) {
      const newExpandedId = expandedVariantId === item.id ? null : item.id;
      setExpandedVariantId(newExpandedId);
      setUnlockVariantId(null);
      if (newExpandedId !== null) {
        try {
          const {
            data: { data: response },
          } = await instance.get(
            `inventory-import/variant/${originalVariant.id}`
          );
          setVariantDetails(response);
        } catch (error) {
          console.log(error);
          setVariantDetails(null);
        }
      } else {
        setVariantDetails(null);
      }
    } else {
      console.log("Không tìm thấy variant");
      setExpandedVariantId(null);
      setVariantDetails(null);
    }
  };
  const toggleUnlockVariant = async (item: any) => {
    const originalVariant = inventoryItem.find((v) =>
      v.attribute_values.every(
        (attr, index) => attr.value === item.attribute_values[index]?.value
      )
    );

    if (originalVariant) {
      const newUnlockId = unlockVariantId === item.id ? null : item.id;
      setUnlockVariantId(newUnlockId);
      setExpandedVariantId(null);
      if (newUnlockId !== null) {
        try {
          const {
            data: { data: response },
          } = await instance.get(
            `getByVariantIdOnlyTrashed/${originalVariant.id}`
          );
          const filteredDetails = response.filter(
            (detail: any) => detail.inventory_import.quantity > 0
          );
          setUnlockVariantDetails(filteredDetails);
        } catch (error) {
          console.log(error);
          setUnlockVariantDetails(null);
        }
      } else {
        setUnlockVariantDetails(null);
      }
    } else {
      console.log("Không tìm thấy variant");
      setUnlockVariantId(null);
      setUnlockVariantDetails(null);
    }
  };

  return (
    <div>
      <Modal
        open={isModalOpen || isModalOpenShowDetail}
        width={modalWidth}
        onCancel={handleCancel}
        footer={[]}
      >
        <div className="space-y-7">
          <div className="flex items-center justify-between gap-5">
            <button
              className="font-medium flex items-center gap-1.5"
              onClick={() => {
                setIsModalOpen(!isModalOpen);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-5"
                color={"currentColor"}
                fill={"none"}
              >
                <path
                  d="M3.99982 11.9998L19.9998 11.9998"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.99963 17C8.99963 17 3.99968 13.3176 3.99966 12C3.99965 10.6824 8.99966 7 8.99966 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Nhập hàng
            </button>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#ff9900",
                },
              }}
            >
              <div className="max-w-[600px]">
                <Search
                  placeholder="Tên hàng hoá"
                  allowClear
                  style={{ width: "300px" }}
                  size="middle"
                  onChange={(e) => {
                    SetValSearch(e.target.value);
                  }}
                />
              </div>
            </ConfigProvider>
            <button className="flex gap-1.5 hover:cursor-pointer relative text-sm items-center text-util bg-[#5EB800] overflow-hidden py-2 px-4 rounded-md mr-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-5"
                color={"currentColor"}
                fill={"none"}
              >
                <path
                  d="M12 4.5L12 14.5M12 4.5C11.2998 4.5 9.99153 6.4943 9.5 7M12 4.5C12.7002 4.5 14.0085 6.4943 14.5 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 16.5C20 18.982 19.482 19.5 17 19.5H7C4.518 19.5 4 18.982 4 16.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="file"
                accept=".xlsx,.xls"
                className="opacity-0 absolute flex top-0 left-0 right-0 bottom-0 hover:cursor-pointer"
                onChange={handleImportExcel}
              />
              Nhập Excel
            </button>
          </div>
          <div className={"min-h-[80vh] overflow-x-auto"}>
            {!isExpandAll ? (
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
                  <Table.HeadCell className="bg-[#F4F7FA] text-center text-secondary/75 text-sm font-medium capitalize text-nowrap">
                    Giá vốn
                  </Table.HeadCell>
                  <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                    Tồn kho
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {inventorys.length === 0 ? (
                    <Table.Row key={1}>
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
                    inventorys
                      .filter((item) => {
                        return item.name
                          .toLowerCase()
                          .includes(valSearch.toLowerCase());
                      })
                      .map((inventory, index) => {
                        return (
                          <>
                            <Table.Row
                              className="hover:cursor-pointer"
                              onClick={() =>
                                handleToggleVariants(inventory.id!)
                              }
                              key={index+1}
                            >
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
                                  <div className="max-w-[350px] min-w-[350px] space-y-0.5">
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
                                          findNewestUpdateTime(
                                            inventory.variants
                                          )
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
                                {inventory.import_price_range === "0 - 0"
                                  ? "Chưa nhập"
                                  : `${inventory.import_price_range}đ`}
                              </Table.Cell>
                              <Table.Cell className="text-center text-nowrap">
                                {inventory.quantity_range}
                              </Table.Cell>
                            </Table.Row>
                            {selectedProductId === inventory.id &&
                              inventoryItem.length !== 0 && (
                                <Table.Row>
                                  <Table.Cell colSpan={3}>
                                    <LoadingOverlay
                                      active={isLoading}
                                      spinner
                                      text="Đang nhập hàng ..."
                                      styles={{
                                        overlay: (base) => ({
                                          ...base,
                                          background:
                                            "rgba(255, 255, 255, 0.75)",
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
                                      <div className="border border-[#f1f1f1] rounded-md p-3 space-y-4">
                                        <div className="flex items-center justify-between border-b border-dashed border-[#f1f1f1] pb-3">
                                          <h4 className="font-medium text-secondary">
                                            Nhập thông tin hàng hoá
                                          </h4>
                                          <div className="flex items-center gap-2">
                                            <ConfigProvider
                                              theme={{
                                                token: {
                                                  colorPrimary: "#ff9900",
                                                },
                                              }}
                                            >
                                              <Checkbox
                                                checked={
                                                  selectedVariantIndices.length ===
                                                  fields.length
                                                }
                                                onChange={handleSelectAll}
                                              >
                                                Chọn tất cả
                                              </Checkbox>
                                            </ConfigProvider>
                                          </div>
                                        </div>
                                        <form
                                          action=""
                                          className="space-y-3"
                                          onSubmit={handleSubmit(
                                            onImportInventory
                                          )}
                                        >
                                          {fields.map((item, index) => {
                                            return (
                                              <div
                                                key={item?.id}
                                                data-variant-index={index}
                                                className="border border-[#f1f1f1] p-3 rounded-md space-y-3 bg-util"
                                              >
                                                <div className="flex items-center justify-between">
                                                  <div className="text-sm flex items-center gap-3">
                                                    <ConfigProvider
                                                      theme={{
                                                        token: {
                                                          colorPrimary:
                                                            "#ff9900",
                                                        },
                                                      }}
                                                    >
                                                      <Checkbox
                                                        checked={selectedVariantIndices.includes(
                                                          index
                                                        )}
                                                        onChange={() =>
                                                          handleCheckboxChange(
                                                            index
                                                          )
                                                        }
                                                      />
                                                    </ConfigProvider>
                                                    <span className="text-primary">
                                                      Phân loại:{" "}
                                                    </span>
                                                    <p className="text-secondary/50">
                                                      {renderAttributes(
                                                        item.attribute_values
                                                      )}
                                                    </p>
                                                    <p className="text-primary/85">
                                                      ( SL:{" "}
                                                      {calculateTotalQuantity(
                                                        item
                                                      )}
                                                      )
                                                    </p>
                                                  </div>
                                                  <div className="flex gap-2 items-center">
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        toggleUnlockVariant(
                                                          item
                                                        )
                                                      }
                                                      className="px-4 py-1 text-primary rounded-sm border border-[#f1f1f1]"
                                                    >
                                                      Kho
                                                    </button>
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        toggleVariantDetails(
                                                          item
                                                        )
                                                      }
                                                      className="px-4 py-1 text-[#5EB800] rounded-sm border border-[#f1f1f1]"
                                                    >
                                                      Chi tiết
                                                    </button>
                                                    <button
                                                      type="button"
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        const dataForm =
                                                          getValues();
                                                        const singleVariantForm =
                                                          {
                                                            variants: [
                                                              dataForm.variants[
                                                                index
                                                              ],
                                                            ],
                                                          };

                                                        onImportInventory(
                                                          singleVariantForm
                                                        );
                                                      }}
                                                      className="bg-primary py-1 text-util px-3 rounded-sm flex items-center gap-1"
                                                    >
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        className="size-4"
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
                                                      Nhập
                                                    </button>
                                                  </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3">
                                                  <input
                                                    type="number"
                                                    placeholder="Giá nhập"
                                                    {...register(
                                                      `variants.${index}.newImport.import_price`,
                                                      {
                                                        valueAsNumber: true,
                                                        validate: {
                                                          positive: (value) =>
                                                            !value ||
                                                            value > 0 ||
                                                            "Giá nhập phải lớn hơn 0",
                                                        },
                                                      }
                                                    )}
                                                    min={0}
                                                    className="block text-secondary focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-[#e9e9e9] rounded-[5px] w-full focus:!shadow-none"
                                                  />
                                                  <input
                                                    type="number"
                                                    placeholder="Số lượng"
                                                    {...register(
                                                      `variants.${index}.newImport.quantity`,
                                                      {
                                                        valueAsNumber: true,
                                                        validate: {
                                                          positive: (value) =>
                                                            !value ||
                                                            value > 0 ||
                                                            "Số lượng phải lớn hơn 0",
                                                        },
                                                      }
                                                    )}
                                                    min={0}
                                                    className="block text-secondary focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-[#e9e9e9] rounded-[5px] w-full focus:!shadow-none"
                                                  />
                                                  <ConfigProvider
                                                    theme={{
                                                      token: {
                                                        colorPrimary: "#ff9900",
                                                      },
                                                      components: {
                                                        Select: {
                                                          colorBorder:
                                                            "#f1f1f1",
                                                          colorPrimaryHover:
                                                            "#f1f1f1",
                                                          activeBorderColor:
                                                            "#ffcc93",
                                                        },
                                                      },
                                                    }}
                                                  >
                                                    <Select
                                                      allowClear
                                                      showSearch
                                                      style={{
                                                        width: "100%",
                                                        height: 35,
                                                      }}
                                                      placeholder="Nhà cung cấp"
                                                      options={optionsSupplier}
                                                      onChange={(value) => {
                                                        setValue(
                                                          `variants.${index}.newImport.supplier.id`,
                                                          value
                                                        );
                                                      }}
                                                    />
                                                  </ConfigProvider>
                                                </div>
                                                {/* Danh sách các lần nhập trước */}
                                                {unlockVariantId ===
                                                  item.id && (
                                                  <div className="mt-4">
                                                    <h4 className="font-medium text-secondary mb-2">
                                                      Kho bị khoá
                                                    </h4>
                                                    {unlockVariantDetails?.length >
                                                      0 ||
                                                    (item.inventoryImports &&
                                                      item.inventoryImports
                                                        .length > 0) ? (
                                                      <div className="overflow-x-auto">
                                                        <table className="w-full">
                                                          <thead>
                                                            <tr className="bg-[#F4F7FA]">
                                                              <th className="p-2 text-left text-sm font-normal">
                                                                Ngày Nhập
                                                              </th>
                                                              <th className="p-2 text-left text-sm font-normal">
                                                                Giá Nhập
                                                              </th>
                                                              <th className="p-2 text-center text-sm font-normal">
                                                                Số Lượng Nhập
                                                              </th>
                                                              <th className="p-2 text-center text-sm font-normal">
                                                                Còn Lại
                                                              </th>
                                                              <th className="p-2 text-center text-sm font-normal">
                                                                Nhà Cung Cấp
                                                              </th>
                                                              <th className="p-2 text-center text-sm font-normal">
                                                                Hành động
                                                              </th>
                                                            </tr>
                                                          </thead>
                                                          <tbody>
                                                            {unlockVariantDetails?.map(
                                                              (
                                                                importItem: any
                                                              ) => (
                                                                <tr
                                                                  key={
                                                                    importItem
                                                                      .inventory_import
                                                                      .id
                                                                  }
                                                                  className="transition-colors bg-util"
                                                                >
                                                                  <td className="p-2 text-sm">
                                                                    {dayjs(
                                                                      importItem
                                                                        .inventory_import
                                                                        .created_at
                                                                    ).format(
                                                                      "DD/MM/YYYY HH:mm"
                                                                    )}
                                                                  </td>
                                                                  <td className="p-2 text-sm">
                                                                    {new Intl.NumberFormat(
                                                                      "vi-VN",
                                                                      {
                                                                        style:
                                                                          "currency",
                                                                        currency:
                                                                          "VND",
                                                                      }
                                                                    ).format(
                                                                      importItem
                                                                        .inventory_import
                                                                        .import_price
                                                                    )}
                                                                  </td>
                                                                  <td className="p-2 text-sm text-center">
                                                                    {
                                                                      importItem.quantity_imported
                                                                    }
                                                                  </td>
                                                                  <td className="p-2 text-sm text-center text-primary">
                                                                    {
                                                                      importItem
                                                                        .inventory_import
                                                                        .quantity
                                                                    }
                                                                  </td>
                                                                  <td className="p-2 text-sm text-center">
                                                                    <p className="text-nowrap text-ellipsis overflow-hidden">
                                                                      {importItem
                                                                        .inventory_import
                                                                        .supplier
                                                                        ?.name ||
                                                                        "Chưa xác định"}
                                                                    </p>
                                                                  </td>
                                                                  <td className="p-2">
                                                                    <div className="flex items-center gap-2 justify-center">
                                                                      <ConfigProvider
                                                                        theme={{
                                                                          token:
                                                                            {
                                                                              colorPrimary:
                                                                                "#ff9900",
                                                                            },
                                                                        }}
                                                                      >
                                                                        <Popconfirm
                                                                          title="Xác nhận mở khoá lần nhập này?"
                                                                          onConfirm={() =>
                                                                            handleUnLockImportRecord(
                                                                              importItem
                                                                                .inventory_import
                                                                                .id
                                                                            )
                                                                          }
                                                                          okText="Mở khoá"
                                                                          cancelText="Hủy"
                                                                        >
                                                                          <button
                                                                            type="button"
                                                                            className="text-primary p-2 bg-util shadow-sm rounded-full"
                                                                          >
                                                                            <svg
                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                              viewBox="0 0 24 24"
                                                                              className="size-5"
                                                                              color={
                                                                                "currentColor"
                                                                              }
                                                                              fill={
                                                                                "none"
                                                                              }
                                                                            >
                                                                              <path
                                                                                d="M5 15C5 11.134 8.13401 8 12 8C15.866 8 19 11.134 19 15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15Z"
                                                                                stroke="currentColor"
                                                                                strokeWidth="1.5"
                                                                              />
                                                                              <path
                                                                                d="M7.5 9.5V6.5C7.5 4.01472 9.51472 2 12 2C13.5602 2 14.935 2.79401 15.7422 4"
                                                                                stroke="currentColor"
                                                                                strokeWidth="1.5"
                                                                                strokeLinecap="round"
                                                                              />
                                                                              <path
                                                                                d="M12 16V14"
                                                                                stroke="currentColor"
                                                                                strokeWidth="1.5"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                              />
                                                                            </svg>
                                                                          </button>
                                                                        </Popconfirm>
                                                                      </ConfigProvider>
                                                                    </div>
                                                                  </td>
                                                                </tr>
                                                              )
                                                            )}
                                                          </tbody>
                                                        </table>
                                                      </div>
                                                    ) : (
                                                      <p className="text-secondary/50 italic">
                                                        Kho rỗng
                                                      </p>
                                                    )}
                                                  </div>
                                                )}
                                                {expandedVariantId ===
                                                  item.id && (
                                                  <div className="mt-4">
                                                    <h4 className="font-medium text-secondary mb-2">
                                                      Kho hàng
                                                    </h4>
                                                    {variantDetails?.length >
                                                      0 ||
                                                    (item.inventoryImports &&
                                                      item.inventoryImports
                                                        .length > 0) ? (
                                                      <div className="overflow-x-auto">
                                                        <table className="w-full">
                                                          <thead>
                                                            <tr className="bg-[#F4F7FA]">
                                                              <th className="p-2 text-left text-sm font-normal">
                                                                Ngày Nhập
                                                              </th>
                                                              <th className="p-2 text-left text-sm font-normal">
                                                                Giá Nhập
                                                              </th>
                                                              <th className="p-2 text-center text-sm font-normal">
                                                                Số Lượng Nhập
                                                              </th>
                                                              <th className="p-2 text-center text-sm font-normal">
                                                                Còn Lại
                                                              </th>
                                                              <th className="p-2 text-center text-sm font-normal">
                                                                Nhà Cung Cấp
                                                              </th>
                                                              <th className="p-2 text-center text-sm font-normal">
                                                                Hành động
                                                              </th>
                                                            </tr>
                                                          </thead>
                                                          <tbody>
                                                            {variantDetails?.map(
                                                              (
                                                                importItem: any
                                                              ) => (
                                                                <tr
                                                                  key={
                                                                    importItem
                                                                      .inventory_import
                                                                      .id
                                                                  }
                                                                  className="transition-colors bg-util"
                                                                >
                                                                  <td className="p-2 text-sm">
                                                                    {dayjs(
                                                                      importItem
                                                                        .inventory_import
                                                                        .created_at
                                                                    ).format(
                                                                      "DD/MM/YYYY HH:mm"
                                                                    )}
                                                                  </td>
                                                                  <td className="p-2 text-sm">
                                                                    {new Intl.NumberFormat(
                                                                      "vi-VN",
                                                                      {
                                                                        style:
                                                                          "currency",
                                                                        currency:
                                                                          "VND",
                                                                      }
                                                                    ).format(
                                                                      importItem
                                                                        .inventory_import
                                                                        .import_price
                                                                    )}
                                                                  </td>
                                                                  <td className="p-2 text-sm text-center">
                                                                    {
                                                                      importItem.quantity_imported
                                                                    }
                                                                  </td>
                                                                  <td className="p-2 text-sm text-center text-primary">
                                                                    {
                                                                      importItem
                                                                        .inventory_import
                                                                        .quantity
                                                                    }
                                                                  </td>
                                                                  <td className="p-2 text-sm text-center">
                                                                    <p className="text-nowrap text-ellipsis overflow-hidden">
                                                                      {importItem
                                                                        .inventory_import
                                                                        .supplier
                                                                        ?.name ||
                                                                        "Chưa xác định"}
                                                                    </p>
                                                                  </td>
                                                                  <td className="p-2">
                                                                    <div className="flex items-center gap-2 justify-center">
                                                                      <ConfigProvider
                                                                        theme={{
                                                                          token:
                                                                            {
                                                                              colorPrimary:
                                                                                "#ff9900",
                                                                            },
                                                                        }}
                                                                      >
                                                                        <Popconfirm
                                                                          title="Xác nhận khoá lần nhập này?"
                                                                          onConfirm={() =>
                                                                            handleLockImportRecord(
                                                                              importItem
                                                                                .inventory_import
                                                                                .id
                                                                            )
                                                                          }
                                                                          okText="Khoá"
                                                                          cancelText="Hủy"
                                                                        >
                                                                          <button
                                                                            type="button"
                                                                            className="text-primary p-2 bg-util shadow-sm rounded-full"
                                                                          >
                                                                            <svg
                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                              viewBox="0 0 24 24"
                                                                              className="size-5"
                                                                              color={
                                                                                "currentColor"
                                                                              }
                                                                              fill={
                                                                                "none"
                                                                              }
                                                                            >
                                                                              <path
                                                                                d="M14.491 15.5H14.5M9.5 15.5H9.50897"
                                                                                stroke="currentColor"
                                                                                strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                              />
                                                                              <path
                                                                                d="M4.26781 18.8447C4.49269 20.515 5.87613 21.8235 7.55966 21.9009C8.97627 21.966 10.4153 22 12 22C13.5847 22 15.0237 21.966 16.4403 21.9009C18.1239 21.8235 19.5073 20.515 19.7322 18.8447C19.879 17.7547 20 16.6376 20 15.5C20 14.3624 19.879 13.2453 19.7322 12.1553C19.5073 10.485 18.1239 9.17649 16.4403 9.09909C15.0237 9.03397 13.5847 9 12 9C10.4153 9 8.97627 9.03397 7.55966 9.09909C5.87613 9.17649 4.49269 10.485 4.26781 12.1553C4.12105 13.2453 4 14.3624 4 15.5C4 16.6376 4.12105 17.7547 4.26781 18.8447Z"
                                                                                stroke="currentColor"
                                                                                strokeWidth="1.5"
                                                                              />
                                                                              <path
                                                                                d="M7.5 9V6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5V9"
                                                                                stroke="currentColor"
                                                                                strokeWidth="1.5"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                              />
                                                                            </svg>
                                                                          </button>
                                                                        </Popconfirm>
                                                                      </ConfigProvider>
                                                                    </div>
                                                                  </td>
                                                                </tr>
                                                              )
                                                            )}
                                                          </tbody>
                                                        </table>
                                                      </div>
                                                    ) : (
                                                      <p className="text-secondary/50 italic">
                                                        Kho rỗng
                                                      </p>
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                          {selectedVariantIndices.length >
                                            0 && (
                                            <ButtonSubmit content="Nhập tất cả lựa chọn" />
                                          )}
                                        </form>
                                      </div>
                                    </LoadingOverlay>
                                  </Table.Cell>
                                </Table.Row>
                              )}
                          </>
                        );
                      })
                  )}
                </Table.Body>
              </Table>
            ) : (
              <>
                {/* Nút chọn tất cả và nhập kho */}
                <div className="flex items-center gap-3 mb-4">
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#ff9900",
                      },
                    }}
                  >
                    <Checkbox
                      checked={
                        inventorys.flatMap((p) => p.variants).length ===
                        selectedVariants.length
                      }
                      onChange={handleSelectAllVariants}
                    >
                      Chọn tất cả
                    </Checkbox>
                  </ConfigProvider>
                  {selectedVariants.length > 0 && (
                    <button
                      onClick={handleImportSelectedVariants}
                      className="bg-primary text-util py-1.5 rounded-sm px-3.5"
                    >
                      Nhập kho ({selectedVariants.length} biến thể)
                    </button>
                  )}
                </div>
                <Table className="border-b border-[#E4E7EB]">
                  <Table.Head className="text-center">
                    <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap"></Table.HeadCell>
                    <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                      ID
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                      Tên Sản Phẩm
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                      Hình Ảnh
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-[#F4F7FA] text-center text-secondary/75 text-sm font-medium capitalize text-nowrap">
                      ID Variant
                    </Table.HeadCell>

                    {/* Render động các thuộc tính */}
                    {inventoryItem.length > 0 &&
                      inventoryItem[0].attribute_values.map((attr, index) => (
                        <Table.HeadCell
                          key={index}
                          className="bg-[#F4F7FA] text-center text-secondary/75 text-sm font-medium capitalize text-nowrap"
                        >
                          {attr.attribute.name}
                        </Table.HeadCell>
                      ))}
                    <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                      Số Lượng Nhập
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                      Giá Nhập
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                      Nhà Cung Cấp ID
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {/* Nhóm các variant theo sản phẩm */}
                    {inventorys
                      .filter((item) => {
                        return item.name
                          .toLowerCase()
                          .includes(valSearch.toLowerCase());
                      })
                      .map((product) => {
                        // Nhóm các variant có cùng thuộc tính
                        const groupedVariants = product.variants.reduce(
                          (acc, variant) => {
                            // Tạo key từ các thuộc tính
                            const key = variant.attribute_values
                              .map(
                                (attr) => `${attr.attribute.name}:${attr.value}`
                              )
                              .join("|");

                            if (!acc[key]) {
                              acc[key] = [];
                            }
                            acc[key].push(variant);
                            return acc;
                          },
                          {} as Record<string, IVariants[]>
                        );

                        return Object.entries(groupedVariants).map(
                          ([key, variants], groupIndex) => {
                            const firstVariant = variants[0];
                            // const totalQuantity = variants.reduce(
                            //   (sum, v) => sum + v.quantity,
                            //   0
                            // );
                            const totalImportPrice = variants.reduce(
                              (sum, v) =>
                                sum + (v.inventoryImports?.import_price || 0),
                              0
                            );
                            const importQuantity = variants.reduce(
                              (sum, v) =>
                                sum + (v.inventoryImports?.quantity || 0),
                              0
                            );
                            const isGroupSelected = variants.every((v) =>
                              isVariantSelected(v)
                            );
                            return (
                              <Table.Row key={`${product.id}-${groupIndex}`}>
                                {/* Thông tin sản phẩm (chỉ render 1 lần) */}
                                <Table.Cell>
                                  <ConfigProvider
                                    theme={{
                                      token: {
                                        colorPrimary: "#ff9900",
                                      },
                                    }}
                                  >
                                    <Checkbox
                                      checked={isGroupSelected}
                                      onChange={() =>
                                        handleGroupSelect(variants)
                                      }
                                    />
                                  </ConfigProvider>
                                </Table.Cell>
                                {groupIndex === 0 && (
                                  <>
                                    <Table.Cell
                                      rowSpan={
                                        Object.keys(groupedVariants).length
                                      }
                                      className="text-nowrap"
                                    >
                                      {product.id}
                                    </Table.Cell>
                                    <Table.Cell
                                      rowSpan={
                                        Object.keys(groupedVariants).length
                                      }
                                      className="text-nowrap"
                                    >
                                      {product.name}
                                    </Table.Cell>
                                    <Table.Cell
                                      rowSpan={
                                        Object.keys(groupedVariants).length
                                      }
                                      className="text-nowrap flex justify-center"
                                    >
                                      <Avatar
                                        shape="square"
                                        size="large"
                                        src={product.images[0]}
                                      />
                                    </Table.Cell>
                                  </>
                                )}
                                <Table.Cell className="text-nowrap text-center">
                                  {variants.map((v) => v.id).join(", ")}
                                </Table.Cell>
                                {/* Render các thuộc tính */}
                                {firstVariant.attribute_values.map(
                                  (attr, attrIndex) => (
                                    <Table.Cell
                                      key={attrIndex}
                                      className="text-nowrap text-center"
                                    >
                                      {attr.value}
                                    </Table.Cell>
                                  )
                                )}

                                {/* Thông tin giá và số lượng */}
                                <Table.Cell className="text-nowrap text-center">
                                  {importQuantity}
                                </Table.Cell>
                                <Table.Cell className="text-nowrap">
                                  {totalImportPrice > 0
                                    ? new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      }).format(totalImportPrice)
                                    : "Không có"}
                                </Table.Cell>
                                <Table.Cell className="text-nowrap text-center">
                                  {firstVariant.inventoryImports?.supplier
                                    ?.id || "Chưa có"}
                                </Table.Cell>
                              </Table.Row>
                            );
                          }
                        );
                      })}
                  </Table.Body>
                </Table>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalInventoryImport;
