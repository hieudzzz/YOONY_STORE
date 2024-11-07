import ButtonSeeMore from "../Button/ButtonSeeMore";
import CardProductAll from "./CardProductAll";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, HashNavigation } from "swiper/modules";
import { IProduct } from "../../../interfaces/IProduct";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import instance from "../../../instance/instance";
import GroupVariantsByColor from "../Show/GroupVariantsByColor";
const ProductFeature = () => {
  const [productFeatures, setProductFeatures] = useState<IProduct[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get("home/products/featured");
        setProductFeatures(data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Đã xảy ra lỗi không mong muốn");
        }
      }
    })();
  }, []);
  return (
    <section className="py-5">
      <h2 className="text-base md:text-xl lg:text-2xl font-medium uppercase product-feature flex items-center gap-2">
        Sản phẩm nổi bật
      </h2>
      <Swiper
        slidesPerView={5}
        spaceBetween={20}
        freeMode={true}
        hashNavigation={true}
        navigation={true}
        modules={[FreeMode, Navigation, HashNavigation]}
        className="mySwiper my-5 flex flex-wrap gap-[25px]"
      >
        {productFeatures.map((productFeature) => {
          // const colorVariants = productFeature.variants
          //   .flatMap((variant) =>
          //     variant.attribute_values
          //       .filter((attr) => attr?.attribute?.type === "color")
          //       .map((attr) => attr.value)
          //   )
          //   .filter((value, index, self) => self.indexOf(value) === index);
          const colorVariantsImages= GroupVariantsByColor(productFeature.variants)
          return (
            <SwiperSlide className="pb-1 px-0.5" key={productFeature.id}>
              <CardProductAll
                imageProduct={productFeature.images[0]}
                nameProduct={productFeature.name}
                colorVariantsImages={colorVariantsImages as []}
                variants={productFeature.variants}
                is_featured={productFeature.is_featured === 1 ? true : false}
                is_good_deal={productFeature.is_good_deal === 1 ? true : false}
                id_Product={productFeature.id!}
                category={productFeature?.category?.slug}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <ButtonSeeMore link="/product-feature" />
    </section>
  );
};

export default ProductFeature;
