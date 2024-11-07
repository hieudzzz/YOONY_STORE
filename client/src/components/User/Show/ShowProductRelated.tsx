import { IProduct } from "../../../interfaces/IProduct";
import CardProductAll from "../Products/CardProductAll";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, HashNavigation } from "swiper/modules";
import GroupVariantsByColor from "./GroupVariantsByColor";
type Prop = {
  related_products: IProduct[];
};
const ShowProductRelated = ({ related_products }: Prop) => {
  return (
    <section>
      <h2 className="text-base md:text-lg lg:text-xl font-medium uppercase flex items-center gap-2">
        Sản phẩm bạn có thể thích
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
        {related_products.map((related_product) => {
          const colorVariantsImages = GroupVariantsByColor(
            related_product.variants
          );
          return (
            <SwiperSlide className="pb-1 px-0.5" key={related_product.id}>
              <CardProductAll
                imageProduct={related_product.images[0]}
                nameProduct={related_product.name}
                colorVariantsImages={colorVariantsImages as []}
                variants={related_product.variants}
                is_featured={related_product.is_featured === 1 ? true : false}
                is_good_deal={related_product.is_good_deal === 1 ? true : false}
                id_Product={related_product.id!}
                category={related_product?.category?.slug}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default ShowProductRelated;
