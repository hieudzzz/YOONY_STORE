import { Swiper, SwiperSlide } from "swiper/react";
import { IVariants } from "../../../interfaces/IVariants";
import { FreeMode } from "swiper/modules";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import slugify from "react-slugify";
import instance from "../../../instance/instance";
import { toast } from "react-toastify";

type Props = {
  imageProduct: string;
  nameProduct: string;
  colorVariantsImages: {
    representativeImage: string;
  }[];
  variants: IVariants[];
  is_featured: boolean;
  is_good_deal: boolean;
  id_Product: number; // Đảm bảo rằng id_Product được khai báo ở đây
  category: string;
};
const CardProductAll = ({
  imageProduct,
  nameProduct,
  colorVariantsImages = [],
  variants = [],
  is_featured,
  is_good_deal,
  id_Product, // Thêm id_Product vào destructuring
  category,
}: Props) => {
  const saleVariant = variants.find((variant) => variant.sale_price);
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    const favoriteProducts = JSON.parse(localStorage.getItem("favoriteProducts") || "[]");
    setIsFavorite(favoriteProducts.includes(id_Product));
  }, [id_Product]);

  const handleAddToWishlist = async () => {
    // Kiểm tra xem sản phẩm đã có trong danh sách yêu thích chưa
    if (isFavorite) {
      toast.warning("Sản phẩm đã có trong danh sách yêu thích!");
      return; // Dừng lại nếu sản phẩm đã có trong danh sách yêu thích
    }

    try {
      const response = await instance.post("/insert-wishlists", { product_id: id_Product });
      toast.success("Đã thêm sản phẩm vào danh sách yêu thích");
      console.log("Thêm vào danh sách yêu thích thành công:", response.data); // Log dữ liệu nhận được từ API
      const favoriteProducts = JSON.parse(localStorage.getItem("favoriteProducts") || "[]");
      favoriteProducts.push(id_Product);
      localStorage.setItem("favoriteProducts", JSON.stringify(favoriteProducts));
      setIsFavorite(true); // Đánh dấu sản phẩm là yêu thích
    } catch (error) {
      console.error("Không thể thêm vào danh sách yêu thích", error);
      toast.warning("Sản phẩm đã có trong danh sách yêu thích");

    }
  };



  return (
    <div className="min-h-[355px] group max-w-[220px] w-full bg-util rounded-lg overflow-hidden shadow-[0px_1px_4px_0px_rgba(255,_138,_0,_0.25)] cursor-pointer">
      <div className="relative z-40 overflow-hidden">
        <Link to={`/${category}/${slugify(nameProduct)}`}>
          <img
            src={imageProduct}
            alt="product-image"
            className="max-h-[260px] object-cover w-full group-hover:scale-110 group-hover:shadow-lg transition-transform duration-500 ease-in-out"
          />
        </Link>
        {/* Các phần khác trong component */}
        <div className="absolute top-2 right-2 z-30 text-primary/70 cursor-pointer" onClick={handleAddToWishlist}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`size-6 hover:fill-primary/75 ${isFavorite ? 'fill-primary' : 'fill-none'}`} // Thay đổi màu sắc ở đây
            color={"currentColor"}
          >
            <path
              d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        {/* Các phần khác trong component */}
      </div>
      <Link to={`/${category}/${slugify(nameProduct)}`}>
        <div className="px-3.5 space-y-3 py-3">
          <p className="line-clamp-1 text-sm md:text-base">{nameProduct}</p>
          <div className="flex gap-2 text-sm">
            {saleVariant ? (
              <>
                <span className="line-through">
                  {saleVariant.price
                    .toLocaleString("vi-VN", {
                      useGrouping: true,
                      maximumFractionDigits: 0,
                    })
                    .replace(/,/g, ".") + "đ"}
                </span>
                <span className="text-primary font-medium">
                  {saleVariant.sale_price
                    ?.toLocaleString("vi-VN", {
                      useGrouping: true,
                      maximumFractionDigits: 0,
                    })
                    .replace(/,/g, ".") + "đ"}
                </span>
              </>
            ) : (
              <span className="text-primary font-medium">
                {variants[0]?.price
                  .toLocaleString("vi-VN", {
                    useGrouping: true,
                    maximumFractionDigits: 0,
                  })
                  .replace(/,/g, ".") + "đ"}
              </span>
            )}
          </div>
          <Swiper
            slidesPerView={6}
            spaceBetween={8}
            freeMode={true}
            modules={[FreeMode]}
            className="mySwiper px-5 z-50"
          >
            {colorVariantsImages.map((colorVariantImage, index: number) => {
              return (
                <SwiperSlide
                  key={index + 1}
                  className="!w-7 !h-7 rounded-full border border-input overflow-hidden"
                >
                  <img
                    src={colorVariantImage?.representativeImage}
                    alt={`Image ${colorVariantImage}`}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </Link>
    </div>
  );
};

export default CardProductAll;
