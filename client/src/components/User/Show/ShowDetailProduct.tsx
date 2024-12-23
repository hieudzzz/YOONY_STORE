import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../../../instance/instance";
import { IProduct } from "../../../interfaces/IProduct";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, message, Rate, Select, Statistic } from "antd";
import Zoom from "react-zoom-image-hover";
import { Label } from "flowbite-react";
import ShowProductRelated from "./ShowProductRelated";
import CartContext from "../../../contexts/CartContext";
import axios from "axios";
import { Tooltip } from "@mui/material";
import RatingProduct from "./RatingProduct";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
import isAuthenticated from "../../Middleware/isAuthenticated";
import { ICart } from "../../../interfaces/ICart";
import { toast } from "react-toastify";
import ShowDescriptionProduct from "./ShowDescriptionProduct";
interface IAttribute {
  value: string;
  type: "select" | "color" | "button" | "radio";
}

interface IVariant {
  id: number;
  price: number;
  sale_price: number;
  quantity: number;
  image?: string;
  end_sale?: string;
  attributes: {
    [key: string]: IAttribute;
  };
}

interface IAttributeGroup {
  name: string;
  values: string[];
  type: "select" | "color" | "button" | "radio";
  images: string[];
}

const ShowDetailProduct: React.FC = () => {
  const { Countdown } = Statistic;
  const { category, slugproduct } = useParams<{
    category: string;
    slugproduct: string;
  }>();

  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<{ [key: string]: HTMLImageElement | null }>({});

  const handleThumbnailClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);

    // Get the clicked thumbnail element
    const thumbnailElement = thumbnailRefs.current[imageUrl];
    const containerElement = thumbnailContainerRef.current;

    if (thumbnailElement && containerElement) {
      // Get the container's scroll position and dimensions
      const containerRect = containerElement.getBoundingClientRect();
      const thumbnailRect = thumbnailElement.getBoundingClientRect();

      // Calculate the scroll position
      const scrollTop = containerElement.scrollTop;
      const relativeTop = thumbnailRect.top - containerRect.top;

      // Calculate target scroll position to center the thumbnail
      const targetScroll =
        scrollTop +
        relativeTop -
        (containerRect.height - thumbnailRect.height) / 2;

      // Smooth scroll to the target position
      containerElement.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const [product, setProduct] = useState<IProduct | null>(null);
  const [related_products, setRelated_Products] = useState<IProduct[]>([]);
  const [imageProducts, setImageProducts] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [average_rating, setAverage_rating] = useState<number>();
  const [variants, setVariants] = useState<IVariant[]>([]);
  const [attributeGroups, setAttributeGroups] = useState<IAttributeGroup[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { dispatch, carts } = useContext(CartContext);
  const [isZoomEnabled, setIsZoomEnabled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await instance.get(`home/product/${slugproduct}`);
        setProduct(data.product);
        setRelated_Products(data.related_products);
        processProductData(data.product);
        setAverage_rating(data.average_rating);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [slugproduct]);

  const intervalId = useRef<number | null>(null);
  const callApiToUpdateData = useCallback(async () => {
    try {
      const { data } = await instance.get(`home/product/${slugproduct}`);
      setRelated_Products(data.related_products);
      // if (isAuthenticated()) {
      //   const {
      //     data: { data: response },
      //   } = await instance.get("cart");
      //   dispatch({
      //     type: "LIST",
      //     payload: response,
      //   });
      // }
    } catch (error) {
      console.error("Error fetching updated data:", error);
    }
  }, [slugproduct, setRelated_Products, dispatch]);

  // useEffect(() => {
  //   const updateData = async () => {
  //     await callApiToUpdateData();
  //     if (
  //       variants.some((item) => item.sale_price && isSaleActive(item.end_sale))
  //     ) {
  //       intervalId.current = setTimeout(updateData, 5000);
  //     }
  //   };

  //   updateData();

  //   return () => {
  //     if (intervalId.current) {
  //       clearTimeout(intervalId.current);
  //       intervalId.current = null;
  //     }
  //   };
  // }, [callApiToUpdateData, variants]);

  const isSaleActive = (endSale: string | undefined): boolean => {
    if (!endSale) return false;
    return new Date(endSale).getTime() > Date.now();
  };

  const processProductData = (productData: IProduct) => {
    if (productData) {
      const processedVariants = productData.variants.map((variant: any) => ({
        id: variant.id,
        price: variant.price,
        sale_price: variant.sale_price,
        quantity: variant.quantity,
        image: variant.image,
        end_sale: variant.end_sale,
        attributes: variant.attribute_values.reduce((acc: any, attr: any) => {
          acc[attr.attribute.name] = {
            value: attr.value,
            type: attr.attribute.type,
          };
          return acc;
        }, {}),
      }));
      setVariants(processedVariants);

      const groups = generateAttributeGroups(processedVariants);
      setAttributeGroups(groups);

      // Collect all images from product and variants
      let allImages = [];

      // Add all product images if they exist
      if (productData.images && Array.isArray(productData.images)) {
        allImages = [...productData.images];
      }

      // Add all variant images if they exist
      const variantImages = processedVariants
        .map((variant) => variant.image)
        .filter((image): image is string => !!image); // Filter out null/undefined images

      // Combine and deduplicate images
      allImages = [...new Set([...allImages, ...variantImages])];

      setImageProducts(allImages);

      // Set selected image to first available image
      setSelectedImage(allImages[0] || "");

      // Handle variant selection
      if (processedVariants.length > 0) {
        const defaultVariant = processedVariants[0];
        const defaultAttributes = Object.entries(
          defaultVariant.attributes
        ).reduce(
          (acc, [key, attr]) => ({
            ...acc,
            [key]: attr.value,
          }),
          {}
        );
        setSelectedAttributes(defaultAttributes);
        setSelectedVariant(defaultVariant);
      }
    }
  };

  const generateAttributeGroups = (variants: IVariant[]): IAttributeGroup[] => {
    const attributeMap: {
      [key: string]: {
        values: Set<string>;
        images: Set<string>;
        type: "select" | "color" | "button" | "radio";
        availableValues: Set<string>; // New field
      };
    } = {};

    variants.forEach((variant) => {
      Object.entries(variant.attributes).forEach(([key, attrDetails]) => {
        const { value, type } = attrDetails;

        if (!attributeMap[key]) {
          attributeMap[key] = {
            values: new Set(),
            images: new Set(),
            type: type,
            availableValues: new Set(),
          };
        }

        attributeMap[key].values.add(value);
        if (variant.image) {
          attributeMap[key].images.add(variant.image);
        }
      });
    });

    variants.forEach((variant) => {
      Object.entries(variant.attributes).forEach(([key, attrDetails]) => {
        const { value } = attrDetails;
        attributeMap[key].availableValues.add(value);
      });
    });

    return Object.entries(attributeMap).map(
      ([name, { values, images, type, availableValues }]) => ({
        name,
        values: Array.from(values),
        images: Array.from(images),
        type,
        availableValues: Array.from(availableValues),
      })
    );
  };

  const getAvailableAttributeValues = (attributeName: string) => {
    const currentSelectedAttributes = { ...selectedAttributes };

    const matchingVariants = variants.filter((variant) =>
      Object.entries(currentSelectedAttributes).every(
        ([key, selectedValue]) =>
          key === attributeName ||
          variant.attributes[key]?.value === selectedValue
      )
    );

    const availableValues = new Set(
      matchingVariants
        .map((variant) => variant.attributes[attributeName]?.value)
        .filter(Boolean)
    );

    return availableValues;
  };

  const isAttributeValueAvailable = (
    attributeName: string,
    value: string
  ): boolean => {
    const availableValues = getAvailableAttributeValues(attributeName);
    return availableValues.has(value);
  };

  useEffect(() => {
    const matchingVariant = variants.find((variant) =>
      Object.entries(selectedAttributes).every(
        ([key, value]) => variant.attributes[key]?.value === value
      )
    );
    setSelectedVariant(matchingVariant || null);
  }, [selectedAttributes, variants]);

  const handleAttributeSelect = (attributeName: string, value: string) => {
    // Tạo bản sao các thuộc tính đã chọn
    const updatedAttributes = { ...selectedAttributes };

    // Nếu giá trị đã được chọn trước đó, gỡ bỏ nó
    if (updatedAttributes[attributeName] === value) {
      delete updatedAttributes[attributeName];
    } else {
      // Ngược lại, cập nhật giá trị mới
      updatedAttributes[attributeName] = value;
    }

    // Kiểm tra và loại bỏ các thuộc tính không còn khả dụng
    const finalAttributes: { [key: string]: string } = {};

    // Kiểm tra các thuộc tính khác
    attributeGroups.forEach((group) => {
      if (updatedAttributes[group.name]) {
        const availableValues = getAvailableAttributeValues(group.name);

        // Nếu thuộc tính đã chọn trước đó không còn khả dụng
        if (!availableValues.has(updatedAttributes[group.name])) {
          // Chọn giá trị đầu tiên khả dụng nếu có
          const firstAvailableValue = Array.from(availableValues)[0];
          if (firstAvailableValue) {
            finalAttributes[group.name] = firstAvailableValue;
          }
        } else {
          // Giữ nguyên giá trị nếu vẫn còn khả dụng
          finalAttributes[group.name] = updatedAttributes[group.name];
        }
      }
    });

    // Cập nhật trạng thái
    setSelectedAttributes(finalAttributes);

    // Cập nhật hình ảnh và scroll đến thumbnail tương ứng
    const currentGroup = attributeGroups.find(
      (group) => group.name === attributeName
    );
    if (currentGroup) {
      const valueIndex = currentGroup.values.indexOf(value);
      if (valueIndex !== -1 && currentGroup.images[valueIndex]) {
        const newImage = currentGroup.images[valueIndex];
        setSelectedImage(newImage);

        // Scroll to the corresponding thumbnail
        const thumbnailElement = thumbnailRefs.current[newImage];
        const containerElement = thumbnailContainerRef.current;

        if (thumbnailElement && containerElement) {
          const containerRect = containerElement.getBoundingClientRect();
          const thumbnailRect = thumbnailElement.getBoundingClientRect();

          // Calculate scroll position
          const scrollTop = containerElement.scrollTop;
          const relativeTop = thumbnailRect.top - containerRect.top;

          // Scroll to center the thumbnail
          const targetScroll =
            scrollTop +
            relativeTop -
            (containerRect.height - thumbnailRect.height) / 2;

          containerElement.scrollTo({
            top: targetScroll,
            behavior: "smooth",
          });
        }
      }
    }
  };

  const handleImageClick = () => {
    setIsZoomEnabled(!isZoomEnabled);
  };

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Number(e.target.value));
    setQuantity(value);
  };

  const validateCartQuantity = (requestedQuantity, selectedVariant, carts) => {
    const requiredAttributes = Object.keys(selectedVariant.attributes);
    const selectedAttributeKeys = Object.keys(selectedAttributes);

    if (requiredAttributes.length !== selectedAttributeKeys.length) {
      message.error("Vui lòng chọn đủ thuộc tính cho sản phẩm");
      return false;
    }

    // Kiểm tra số lượng sản phẩm
    if (!selectedVariant?.quantity || selectedVariant.quantity <= 0) {
      message.warning("Hết hàng vui lòng chọn phân loại khác");
      return false;
    }

    const existingCartItems = carts.filter(
      (cart) => cart.variant.id === selectedVariant.id
    );

    const quantityInCart = existingCartItems.reduce(
      (total, cart) => total + cart.quantity,
      0
    );

    const availableQuantity = selectedVariant.quantity - quantityInCart;

    if (requestedQuantity > availableQuantity) {
      message.warning(
        `Số lượng không được vượt quá ${selectedVariant.quantity}`
      );
      return false;
    }

    return true;
  };

  const addCart = async () => {
    if (!validateCartQuantity(quantity, selectedVariant, carts)) {
      return;
    }
    try {
      const {
        data: { data: response },
      } = await instance.post("cart", {
        quantity,
        variant_id: selectedVariant?.id,
        user_id: 1,
      });
      if (response) {
        message.success("Đã thêm sản phẩm vào giỏ hàng");
        dispatch({
          type: "ADD",
          payload: response,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message === "Unauthenticated.") {
          message.error("Vui lòng đăng nhập!");
        }
      } else {
        console.error("Đã xảy ra lỗi không mong muốn", error);
      }
    }
  };

  const addCartLocal = async () => {
    const existingCart: ICart[] = JSON.parse(
      localStorage.getItem("cartLocal") || "[]"
    );
    const requiredAttributes = Object.keys(selectedVariant.attributes);
    const selectedAttributeKeys = Object.keys(selectedAttributes);

    if (requiredAttributes.length !== selectedAttributeKeys.length) {
      message.error("Vui lòng chọn đủ thuộc tính cho sản phẩm");
      return false;
    }

    if (!selectedVariant?.quantity || selectedVariant.quantity <= 0) {
      message.warning("Hết hàng vui lòng chọn phân loại khác");
      return false;
    }

    // Tìm số lượng hiện tại của variant này trong giỏ hàng
    const existingItemIndex = existingCart.findIndex(
      (item) => item.variant_id === selectedVariant?.id
    );

    // Tính tổng số lượng hiện tại trong giỏ hàng
    const currentQuantityInCart =
      existingItemIndex !== -1 ? existingCart[existingItemIndex].quantity : 0;

    // Tính tổng số lượng sau khi thêm
    const totalQuantity = currentQuantityInCart + quantity;

    // Kiểm tra tổng số lượng có vượt quá số lượng trong kho không
    if (totalQuantity > selectedVariant?.quantity) {
      message.warning(
        `Số lượng không được vượt quá ${selectedVariant.quantity}`
      );
      return false;
    }

    try {
      const { data: variantDetail } = await instance.get(
        `variant/${selectedVariant?.id}`
      );

      // Chuẩn bị payload mới
      const newCartItem: ICart = {
        id: selectedVariant?.id,
        variant_id: selectedVariant?.id,
        quantity: totalQuantity,
        variant: variantDetail,
      };

      let updatedCart: ICart[];
      if (existingItemIndex !== -1) {
        updatedCart = existingCart.map((item, index) =>
          index === existingItemIndex ? newCartItem : item
        );
      } else {
        updatedCart = [...existingCart, newCartItem];
      }

      localStorage.setItem("cartLocal", JSON.stringify(updatedCart));
      setQuantity(1);
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
      dispatch({
        type: "ADD",
        payload: {
          ...newCartItem,
          quantity: quantity,
          additive: existingItemIndex !== -1,
        },
      });
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      toast.error("Thêm sản phẩm thất bại");
    }
  };

  // const addOrder = async () => {
  //   try {
  //     if (!validateCartQuantity(quantity, selectedVariant, carts)) {
  //       return;
  //     }
  //     const {
  //       data: { data: response },
  //     } = await instance.post("cart", {
  //       quantity,
  //       variant_id: selectedVariant?.id,
  //       user_id: 1,
  //     });
  //     dispatch({
  //       type: "ADD",
  //       payload: response,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  if (!product)
    return (
      <div>
        <LoadingOverlay
          active={!product}
          spinner
          text="Đang load dữ liệu ..."
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
        ></LoadingOverlay>
      </div>
    );

  const renderAttributeValue = (
    group: IAttributeGroup,
    value: string,
    index: number
  ) => {
    const isAvailable = isAttributeValueAvailable(group.name, value);
    const isSelected = selectedAttributes[group.name] === value;
    switch (group.type) {
      case "color":
        return (
          <Tooltip
            key={value}
            title={
              isAvailable ? (isSelected ? "Bỏ chọn" : value) : "Không có sẵn"
            }
            placement="top"
          >
            <div
              className={`relative overflow-hidden rounded-lg ${
                !isAvailable
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:cursor-pointer"
              }`}
              onClick={() => {
                if (isAvailable) {
                  handleAttributeSelect(group.name, value);
                }
              }}
            >
              <div className="relative">
                <img
                  src={
                    group.images[index] ||
                    "https://www.shutterstock.com/shutterstock/videos/3516224453/thumb/5.jpg?ip=x480"
                  }
                  alt={value}
                  className={`w-12 h-12 object-cover rounded-lg border transition-all ${
                    isSelected
                      ? "border-primary/80"
                      : "border-input hover:border-primary/80"
                  }`}
                />
                <p className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-xs py-0.5 text-center overflow-hidden whitespace-nowrap text-ellipsis">
                  {value}
                </p>
              </div>
              {isSelected && (
                <span className="text-util absolute -top-1 -right-1 bg-primary rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-4"
                    color="currentColor"
                    fill="none"
                  >
                    <path
                      d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.0588 8.83333 19 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </div>
          </Tooltip>
        );
      case "radio":
        return (
          <Tooltip
            key={value}
            title={
              isAvailable ? (isSelected ? "Bỏ chọn" : value) : "Không có sẵn"
            }
            placement="top"
          >
            <div className="relative overflow-hidden rounded-lg">
              <button
                type="button"
                className={`px-3.5 py-[9px] flex items-center justify-center border rounded-full transition-all ${
                  !isAvailable
                    ? "opacity-40 cursor-not-allowed"
                    : isSelected
                    ? "border-primary/80 bg-primary/10 text-primary"
                    : "border-input hover:border-primary/80"
                }`}
                onClick={() => {
                  if (isAvailable) {
                    handleAttributeSelect(group.name, value);
                  }
                }}
                disabled={!isAvailable}
              >
                <p className="text-xs font-normal overflow-hidden text-ellipsis white-space">
                  {value}
                </p>
              </button>
              {isSelected && (
                <span className="text-util absolute -top-1 -right-1 bg-primary rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-4"
                    color="currentColor"
                    fill="none"
                  >
                    <path
                      d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.0588 8.83333 19 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </div>
          </Tooltip>
        );
      case "select":
        break;
      default:
        return (
          <Tooltip
            key={value}
            title={
              isAvailable ? (isSelected ? "Bỏ chọn" : value) : "Không có sẵn"
            }
            placement="top"
          >
            <div className="relative overflow-hidden rounded-lg">
              <button
                type="button"
                className={`px-4 py-2.5 flex items-center justify-center border rounded-lg transition-all ${
                  !isAvailable
                    ? "opacity-40 cursor-not-allowed"
                    : isSelected
                    ? "border-primary/80 bg-primary/10 text-primary"
                    : "border-input hover:border-primary/80"
                }`}
                onClick={() => {
                  if (isAvailable) {
                    handleAttributeSelect(group.name, value);
                  }
                }}
                disabled={!isAvailable}
              >
                <p className="text-xs font-normal overflow-hidden text-ellipsis white-space">
                  {value}
                </p>
              </button>
              {isSelected && (
                <span className="text-util absolute -top-1 -right-1 bg-primary rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-4"
                    color="currentColor"
                    fill="none"
                  >
                    <path
                      d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.0588 8.83333 19 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </div>
          </Tooltip>
        );
    }
  };

  const renderSelectTypeValue = (group: IAttributeGroup) => {
    switch (group.type) {
      default:
        return (
          <div className="max-w-[150px] w-full">
            <Select
              key={`${group.name}-select`}
              value={selectedAttributes[group.name]}
              onChange={(value) => handleAttributeSelect(group.name, value)}
              className="w-full h-[35px]"
              placeholder={`Chọn ${group.name}`}
              options={group.values.map((val) => ({
                value: val,
                label: val,
                disabled: !isAttributeValueAvailable(group.name, val),
              }))}
            />
          </div>
        );
    }
  };

  return (
    <section className="space-y-8">
      <Breadcrumb
        className="my-5"
        items={[
          {
            path: "/",
            title: (
              <Link to="/">
                <HomeOutlined /> Trang chủ
              </Link>
            ),
          },
          {
            path: `/${category}`,
            title: (
              <Link to={`/search?category=${category}`}>
                {product?.category?.name}
              </Link>
            ),
          },
          {
            className: "!text-primary",
            title: product?.name,
          },
        ]}
      />
      <div className="grid grid-cols-2 gap-9">
        <div className="grid grid-cols-10 gap-3">
          <div
            ref={thumbnailContainerRef}
            className="col-span-2 flex flex-col gap-5 max-h-[460px] overflow-y-auto scrollbar-thin scrollbar-none scrollbar-track-gray-100 pe-2 px-1.5 py-1.5"
          >
            {imageProducts.map((imageProduct, index) => (
              <img
                ref={(el) => (thumbnailRefs.current[imageProduct] = el)}
                src={imageProduct}
                key={index}
                className={`rounded-lg max-h-[100px] max-w-[100px] w-full object-cover hover:cursor-pointer hover:scale-110 transition-all ${
                  selectedImage === imageProduct ? "border border-primary" : ""
                }`}
                alt={`Product image ${index + 1}`}
                onClick={() => handleThumbnailClick(imageProduct)}
              />
            ))}
          </div>
          <div className="col-span-8">
            {isZoomEnabled ? (
              <Zoom
                height={460}
                width={"100%"}
                className="max-h-[460px] w-full rounded-lg img-zoom hover:cursor-zoom-in"
                zoomScale={2}
                src={selectedImage}
              />
            ) : (
              <img
                src={selectedImage}
                alt="Product"
                className="max-h-[460px] w-full rounded-lg object-cover hover:cursor-zoom-in"
                onClick={handleImageClick}
              />
            )}
          </div>
        </div>
        <div>
          <h2 className="font-medium text-xl line-clamp-2">{product.name}</h2>
          <div className="flex gap-7 items-center mt-2">
            <div>
              <span className="text-primary">{average_rating} </span>
              <Rate disabled allowHalf value={average_rating} />
            </div>
            {selectedVariant ? (
              selectedVariant?.quantity ? (
                <div className="py-1 px-3 bg-[#3CD139]/10 text-[#3CD139] rounded-full flex gap-1 w-fit text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-5"
                    color={"currentColor"}
                    fill={"none"}
                  >
                    <path
                      d="M12 22C11.1818 22 10.4002 21.6646 8.83693 20.9939C4.94564 19.3243 3 18.4895 3 17.0853L3 7.7475M12 22C12.8182 22 13.5998 21.6646 15.1631 20.9939C19.0544 19.3243 21 18.4895 21 17.0853V7.7475M12 22L12 12.1707M21 7.7475C21 8.35125 20.1984 8.7325 18.5953 9.495L15.6741 10.8844C13.8712 11.7419 12.9697 12.1707 12 12.1707M21 7.7475C21 7.14376 20.1984 6.7625 18.5953 6M3 7.7475C3 8.35125 3.80157 8.7325 5.40472 9.495L8.32592 10.8844C10.1288 11.7419 11.0303 12.1707 12 12.1707M3 7.7475C3 7.14376 3.80157 6.7625 5.40472 6M6.33203 13.311L8.32591 14.2594"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 2V4M16 3L14.5 5M8 3L9.5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Còn hàng: {selectedVariant?.quantity}
                </div>
              ) : (
                <div className="py-1 px-3 bg-primary/10 text-primary rounded-full flex gap-1 w-fit text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-5"
                    color={"currentColor"}
                    fill={"none"}
                  >
                    <path
                      d="M12 22C11.1818 22 10.4002 21.6708 8.83693 21.0123C4.94564 19.3734 3 18.5539 3 17.1754V7.54234M12 22C12.8182 22 13.5998 21.6708 15.1631 21.0123C19.0544 19.3734 21 18.5539 21 17.1754V7.54234M12 22V12.0292M21 7.54234C21 8.15478 20.1984 8.54152 18.5953 9.315L15.6741 10.7244C13.8712 11.5943 12.9697 12.0292 12 12.0292M21 7.54234C21 6.9299 20.1984 6.54316 18.5953 5.76969L17 5M3 7.54234C3 8.15478 3.80157 8.54152 5.40472 9.315L8.32592 10.7244C10.1288 11.5943 11.0303 12.0292 12 12.0292M3 7.54234C3 6.9299 3.80157 6.54317 5.40472 5.76969L7 5M6 13.0263L8 14.0234"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 2L12 4M12 4L14 6M12 4L10 6M12 4L14 2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Hết hàng
                </div>
              )
            ) : (
              <div className="py-1 px-3 bg-primary/10 text-primary rounded-full flex gap-1 w-fit text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-5"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M12 22C11.1818 22 10.4002 21.6708 8.83693 21.0123C4.94564 19.3734 3 18.5539 3 17.1754V7.54234M12 22C12.8182 22 13.5998 21.6708 15.1631 21.0123C19.0544 19.3734 21 18.5539 21 17.1754V7.54234M12 22V12.0292M21 7.54234C21 8.15478 20.1984 8.54152 18.5953 9.315L15.6741 10.7244C13.8712 11.5943 12.9697 12.0292 12 12.0292M21 7.54234C21 6.9299 20.1984 6.54316 18.5953 5.76969L17 5M3 7.54234C3 8.15478 3.80157 8.54152 5.40472 9.315L8.32592 10.7244C10.1288 11.5943 11.0303 12.0292 12 12.0292M3 7.54234C3 6.9299 3.80157 6.54317 5.40472 5.76969L7 5M6 13.0263L8 14.0234"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 2L12 4M12 4L14 6M12 4L10 6M12 4L14 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                Chọn thuộc tính
              </div>
            )}
          </div>
          {selectedVariant && (
            <div className="my-5 overflow-hidden rounded-md">
              {selectedVariant.end_sale && selectedVariant.sale_price && (
                <div className="py-2 px-4 bg-primary flex items-center justify-between">
                  <img
                    src="../../../../src/assets/images/flash_sale.svg"
                    alt="flash_sale_img"
                  />
                  <div className="flex gap-3 items-center">
                    {isSaleActive(selectedVariant.end_sale) ? (
                      <>
                        <span className="flex gap-1 items-center text-util uppercase text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="size-4"
                            color={"currentColor"}
                            fill={"none"}
                          >
                            <path
                              d="M5.04798 8.60657L2.53784 8.45376C4.33712 3.70477 9.503 0.999914 14.5396 2.34474C19.904 3.77711 23.0904 9.26107 21.6565 14.5935C20.2227 19.926 14.7116 23.0876 9.3472 21.6553C5.36419 20.5917 2.58192 17.2946 2 13.4844"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 8V12L14 14"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>{" "}
                          Kết thúc trong
                        </span>
                        <Countdown
                          value={new Date(selectedVariant.end_sale)}
                          format="HH:mm:ss"
                          className="countdowm-sale"
                          valueStyle={{
                            fontSize: 18,
                            backgroundColor: "#000",
                            padding: "2px 10px",
                            borderRadius: 5,
                            color: "#fff",
                          }}
                        />
                      </>
                    ) : (
                      <span className="font-medium py-1 text-util">
                        ĐÃ KẾT THÚC
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="flex gap-3 bg-gradient-to-r from-primary/5 to-primary/10 px-4 py-5 items-center">
                {isSaleActive(selectedVariant.end_sale) &&
                selectedVariant.sale_price ? (
                  <>
                    <span className="text-primary font-medium text-[28px]">
                      {selectedVariant.sale_price
                        ?.toLocaleString("vi-VN", {
                          useGrouping: true,
                          maximumFractionDigits: 0,
                        })
                        .replace(/,/g, ".") + "đ"}
                    </span>
                    <span className="line-through text-base text-[#929292]">
                      {selectedVariant.price
                        ?.toLocaleString("vi-VN", {
                          useGrouping: true,
                          maximumFractionDigits: 0,
                        })
                        .replace(/,/g, ".") + "đ"}
                    </span>
                    <span className="text-xs text-red-500 font-medium bg-primary/15 px-1.5 py-0.5 rounded-sm">
                      {"-" +
                        (
                          ((selectedVariant.price -
                            selectedVariant.sale_price) /
                            selectedVariant.price) *
                          100
                        ).toFixed(0) +
                        "%"}
                    </span>
                  </>
                ) : (
                  <span className="text-primary font-medium text-[28px]">
                    {selectedVariant.price
                      ?.toLocaleString("vi-VN", {
                        useGrouping: true,
                        maximumFractionDigits: 0,
                      })
                      .replace(/,/g, ".")}
                    đ
                  </span>
                )}
              </div>
            </div>
          )}
          <form className="space-y-5">
            {attributeGroups.map((group) => (
              <div key={group.name}>
                <div className="mb-2 block">
                  <Label
                    htmlFor={`${group.name}-product`}
                    className="text-[#929292] !font-normal !text-sm"
                    value={
                      group.name.charAt(0).toUpperCase() + group.name.slice(1)
                    }
                  />
                </div>
                <div className="flex gap-2">
                  {group.type === "select" && renderSelectTypeValue(group)}
                  {group.values.map((value, index) =>
                    renderAttributeValue(group, value, index)
                  )}
                </div>
              </div>
            ))}
            <div className="flex gap-3 items-center">
              <Label
                htmlFor="quantity-product"
                className="text-[#929292] !font-normal !text-sm"
                value="Số lượng"
              />
              <div className="flex gap-5 items-center">
                <div className="flex items-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setQuantity(quantity > 1 ? quantity - 1 : 1);
                    }}
                    className="p-3 border-input rounded-es-sm rounded-ss-sm text-[#929292] border-s border-b border-t"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-3"
                      color={"currentColor"}
                      fill={"none"}
                    >
                      <path
                        d="M20 12L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <input
                    id="quantity-product"
                    min={1}
                    max={selectedVariant?.quantity}
                    value={quantity}
                    onChange={handleChangeQuantity}
                    className="w-10 p-1.5 border border-input outline-none text-center"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setQuantity(quantity + 1);
                    }}
                    className="p-3 border-input rounded-ee-sm rounded-se-sm text-[#929292] border-e border-t border-b"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-3"
                      color={"currentColor"}
                      fill={"none"}
                    >
                      <path
                        d="M12 4V20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 12H20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                {!isLoggedIn ? (
                  <button
                    onClick={addCartLocal}
                    type="button"
                    className="py-2 px-4 border border-primary rounded-md text-primary flex gap-1.5 items-center hover:bg-primary hover:text-util transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-5"
                      color={"currentColor"}
                      fill={"none"}
                    >
                      <path
                        d="M8 16L16.7201 15.2733C19.4486 15.046 20.0611 14.45 20.3635 11.7289L21 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6 6H6.5M22 6H19.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.5 6H16.5M13 9.5V2.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="6"
                        cy="20"
                        r="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="17"
                        cy="20"
                        r="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8 20L15 20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M2 2H2.966C3.91068 2 4.73414 2.62459 4.96326 3.51493L7.93852 15.0765C8.08887 15.6608 7.9602 16.2797 7.58824 16.7616L6.63213 18"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Thêm giỏ hàng
                  </button>
                ) : (
                  <button
                    onClick={addCart}
                    type="button"
                    className="py-2 px-4 border border-primary rounded-md text-primary flex gap-1.5 items-center hover:bg-primary hover:text-util transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-5"
                      color={"currentColor"}
                      fill={"none"}
                    >
                      <path
                        d="M8 16L16.7201 15.2733C19.4486 15.046 20.0611 14.45 20.3635 11.7289L21 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6 6H6.5M22 6H19.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.5 6H16.5M13 9.5V2.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="6"
                        cy="20"
                        r="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="17"
                        cy="20"
                        r="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8 20L15 20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M2 2H2.966C3.91068 2 4.73414 2.62459 4.96326 3.51493L7.93852 15.0765C8.08887 15.6608 7.9602 16.2797 7.58824 16.7616L6.63213 18"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Thêm giỏ hàng
                  </button>
                )}
                {/* <button
                type="button"
                className="py-2 px-4 bg-primary text-util rounded-md flex gap-1.5 items-center"
                onClick={() => {
                  addOrder();
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
                    d="M13 18H21M17 22L17 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 7.5V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 22C7.71999 21.9999 6.57085 21.9917 5.76809 21.2752C4.95603 20.5505 4.75097 19.3264 4.34085 16.8781L3.17786 9.93557C2.98869 8.8063 2.89411 8.24167 3.18537 7.87083C3.47662 7.5 4.01468 7.5 5.09079 7.5H18.9092C19.9853 7.5 20.5234 7.5 20.8146 7.87083C21.1059 8.24167 21.0113 8.8063 20.8221 9.93557L20.4763 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4.5 17.5H10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                Mua ngay
              </button> */}
              </div>
            </div>
            <div className="space-y-2.5">
              <h4 className="font-medium text-sm">
                Thanh toán hỗ trợ nhiều phương thức
              </h4>
              <div className="w-fit space-y-2">
                <img
                  src="../../../../src/assets/images/images-payment.svg"
                  alt="image-payment"
                />
                <p className="text-sm  text-secondary/75">
                  Đảm bảo an toàn và bảo mật
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ShowDescriptionProduct descriptionProduct={product?.description} />
      <RatingProduct slugProd={slugproduct} />
      <ShowProductRelated related_products={related_products} />
    </section>
  );
};

export default ShowDetailProduct;
