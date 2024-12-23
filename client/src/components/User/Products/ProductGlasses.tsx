import CardProductAll from "./CardProductAll";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, HashNavigation } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import ButtonSeeMore from "../Button/ButtonSeeMore";
import { Link } from "react-router-dom";
import { IProduct } from "../../../interfaces/IProduct";
import GroupVariantsByColor from "../Show/GroupVariantsByColor";
type Prop = {
  productGlasses: IProduct[];
};
const ProductGlasses = ({productGlasses}:Prop) => {
  return (
    <section className="py-10 flex gap-5">
      <div className="w-2/3">
        <h2 className="text-base md:text-xl lg:text-2xl font-medium uppercase text-center py-5 gap-2">
          KÍNH THỜI TRANG NAM
        </h2>
        <div className="w-full">
          <Swiper
            slidesPerView={3.5}
            spaceBetween={20}
            freeMode={true}
            hashNavigation={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            navigation={true}
            modules={[FreeMode, Navigation, HashNavigation, Autoplay]}
            className="mySwiper my-5"
          >
            {productGlasses.map((productGlasse) => {
              // const colorVariants = productFeature.variants
              //   .flatMap((variant) =>
              //     variant.attribute_values
              //       .filter((attr) => attr?.attribute?.type === "color")
              //       .map((attr) => attr.value)
              //   )
              //   .filter((value, index, self) => self.indexOf(value) === index);
              const colorVariantsImages = GroupVariantsByColor(
                productGlasse.variants
              );
              return (
                <SwiperSlide className="pb-1 px-0.5" key={productGlasse.id}>
                  <CardProductAll
                    imageProduct={productGlasse.images[0]}
                    nameProduct={productGlasse.name}
                    colorVariantsImages={colorVariantsImages as []}
                    variants={productGlasse.variants}
                    is_featured={
                      productGlasse.is_featured === 1 ? true : false
                    }
                    is_good_deal={
                      productGlasse.is_good_deal === 1 ? true : false
                    }
                    id_Product={productGlasse.id!}
                    category={productGlasse?.category?.slug}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
          {productGlasses.length >5 && <ButtonSeeMore link="search?category=kinh-thoi-trang-nam" />}
        </div>
      </div>
      <div className="w-1/3 group relative">
        <img
          src="../../../../src/assets/images/image-glasses.png"
          alt="image-glasses"
          className="w-full h-full"
        />
        <div className="absolute bg-custom-gradient-hover w-full h-full top-0 rounded-md bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:cursor-pointer">
          <Link
            to={"search?category=kinh-thoi-trang-nam"}
            className="px-5 py-2.5 bg-util hover:bg-primary hover:text-util transition-all duration-300 rounded-lg absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-xl font-medium text-primary"
          >
            XEM THÊM
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGlasses;
