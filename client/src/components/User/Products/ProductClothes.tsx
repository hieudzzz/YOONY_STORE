import CardProductAll from "./CardProductAll";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  FreeMode,
  Navigation,
  HashNavigation,
} from "swiper/modules";
import ButtonSeeMore from "../Button/ButtonSeeMore";
import { IProduct } from "../../../interfaces/IProduct";
import GroupVariantsByColor from "../Show/GroupVariantsByColor";
type Prop = {
  productClothes: IProduct[];
};
const ProductClothes = ({productClothes}:Prop) => {
  return (
    <section className="py-5">
      <h2 className="text-base md:text-xl lg:text-2xl font-medium uppercase product-clothes flex items-center gap-2">
        Áo Nam
      </h2>
      <Swiper
        slidesPerView={5}
        spaceBetween={20}
        freeMode={true}
        hashNavigation={true}
        navigation={true}
        modules={[FreeMode, Navigation, HashNavigation]}
        className="mySwiper my-5"
      >
        {productClothes.map((productClothe) => {
          // const colorVariants = productFeature.variants
          //   .flatMap((variant) =>
          //     variant.attribute_values
          //       .filter((attr) => attr?.attribute?.type === "color")
          //       .map((attr) => attr.value)
          //   )
          //   .filter((value, index, self) => self.indexOf(value) === index);
          const colorVariantsImages= GroupVariantsByColor(productClothe.variants)
          return (
            <SwiperSlide className="pb-1 px-0.5" key={productClothe.id}>
              <CardProductAll
                imageProduct={productClothe.images[0]}
                nameProduct={productClothe.name}
                colorVariantsImages={colorVariantsImages as []}
                variants={productClothe.variants}
                is_featured={productClothe.is_featured === 1 ? true : false}
                is_good_deal={productClothe.is_good_deal === 1 ? true : false}
                id_Product={productClothe.id!}
                category={productClothe?.category?.slug}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      {productClothes.length >5 && <ButtonSeeMore link="search?category=quan-ao" />}
    </section>
  );
};

export default ProductClothes;
