import { Swiper, SwiperSlide } from "swiper/react";
import { IVariants } from "../../../interfaces/IVariants";
import { FreeMode } from "swiper/modules";
import { Link } from "react-router-dom";
import slugify from "react-slugify";
import instance from "../../../instance/instance";
import { useEffect, useState } from "react";
import { WishlistResponse } from "../../../interfaces/IWishlist";
import { message } from "antd";

type Props = {
  imageProduct: string;
  nameProduct: string;
  colorVariantsImages: {
    representativeImage: string;
  }[];
  variants: IVariants[];
  is_featured: boolean;
  is_good_deal: boolean;
  id_Product: number;
  category: string;
};

const CardProductAll = ({
  imageProduct,
  nameProduct,
  colorVariantsImages = [],
  variants = [],
  is_featured,
  is_good_deal,
  id_Product,
  category,
}: Props) => {
  const saleVariant = variants.find((variant) => variant.sale_price);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectWishlist, setSelectWishlist] = useState<WishlistResponse>();

  // Check wishlist status on component mount
  useEffect(() => {
    const wishlists = JSON.parse(localStorage.getItem('wishlists') || '[]');
    const isProductWishlisted = wishlists.some(
      (wishlist: any) => wishlist.product_id === id_Product
    );
    setIsWishlisted(isProductWishlisted);
  }, [id_Product]);

  const addWishlist = async (product_id: number) => {
    try {
      const { data } = await instance.post(`toogle-wishlists`, {
        product_id: product_id,
      });
      
      if (data) {
        message.success(data.message);
        setSelectWishlist(data);
        const wishlists = JSON.parse(localStorage.getItem('wishlists') || '[]');
        
        if (data.wishlist) {
          if (!wishlists.some((w: any) => w.product_id === product_id)) {
            wishlists.push(data.wishlist);
          }
        } else {
          const index = wishlists.findIndex((w: any) => w.product_id === product_id);
          if (index > -1) {
            wishlists.splice(index, 1);
          }
        }
        localStorage.setItem('wishlists', JSON.stringify(wishlists));
        setIsWishlisted(!isWishlisted);
      }
    } catch (error: any) {
      if (error.response?.data?.message === "Unauthenticated.") {
        message.error('Vui lòng đăng nhập !');
      }
      console.log(error);
    }
  };


  return (
    <div className=" group max-w-[220px] w-full bg-util rounded-lg overflow-hidden shadow-[0px_1px_4px_0px_rgba(255,_138,_0,_0.25)] cursor-pointer">
      <div className="relative z-40 overflow-hidden">
        <Link to={`/${category}/${slugify(nameProduct)}`}>
          <img
            src={imageProduct}
            alt="product-image"
            className="max-h-[260px] object-cover w-full group-hover:scale-110 group-hover:shadow-lg transition-transform duration-500 ease-in-out"
          />
        </Link>
        {/* Wishlist */}
        <button
          type="button"
          onClick={() => addWishlist(id_Product)}
          className="absolute top-2 right-2 z-30 text-primary/70 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`size-6 ${isWishlisted ? "fill-primary/75" : "hover:fill-primary/75"}`}
            color={"currentColor"}
            fill={"none"}
          >
            <path
              d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="absolute top-2 left-2 z-30 text-primary cursor-pointer bg-primary/10 p-1 rounded-full">
          {is_featured && <span className="text-xs">HOT</span>}
        </div>
        <div className="absolute top-2 left-2 z-30 text-primary cursor-pointer bg-primary/10 p-1.5 rounded-full">
          {is_good_deal && (
            <span className="text-xs">
              {100 - (variants[0]?.sale_price / variants[0]?.price) * 100}%
            </span>
          )}
        </div>
      </div>
      <Link to={`/${category}/${slugify(nameProduct)}`}>
        <div className="px-3.5 space-y-3 py-3">
          <p className="line-clamp-1 text-sm md:text-base">{nameProduct}</p>
          <div className="flex gap-2 text-sm">
            {saleVariant ? (
              <>
                <span className="line-through text-secondary/50">
                  {saleVariant.price
                    .toLocaleString("vi-VN", {
                      useGrouping: true,
                      maximumFractionDigits: 0,
                    })
                    .replace(/,/g, ".") + "đ"}
                </span>
                <span className="text-primary font-semibold">
                  {saleVariant.sale_price
                    ?.toLocaleString("vi-VN", {
                      useGrouping: true,
                      maximumFractionDigits: 0,
                    })
                    .replace(/,/g, ".") + "đ"}
                </span>
              </>
            ) : (
              <span className="text-primary font-semibold">
                {Math.min(...variants.map(variant=>variant.price))
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
            {colorVariantsImages?.map((colorVariantImage, index: number) => (
              <SwiperSlide
                key={index + 1}
                className="!w-7 !h-7 rounded-full border border-input overflow-hidden"
              >
                <img
                  src={colorVariantImage?.representativeImage || imageProduct}
                  alt={`Image ${index + 1}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Link>
    </div>
  );
};

export default CardProductAll;