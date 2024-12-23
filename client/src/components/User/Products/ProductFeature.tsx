import ButtonSeeMore from "../Button/ButtonSeeMore";
import CardProductAll from "./CardProductAll";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, HashNavigation } from "swiper/modules";
import { IProduct } from "../../../interfaces/IProduct";
import GroupVariantsByColor from "../Show/GroupVariantsByColor";
type Prop = {
  productFeatures: IProduct[];
};
const ProductFeature = ({productFeatures}:Prop) => {
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
        breakpoints={{
          0: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 3.3,
            spaceBetween: 10,
          },
          800: {
            slidesPerView: 3.5,
            spaceBetween: 10,
          },
          884: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 10,
          },
        }}
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
      {productFeatures.length >5 && <ButtonSeeMore link="search?filter=feature" />}
    </section>
  );
};

export default ProductFeature;
