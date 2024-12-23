import { Swiper, SwiperSlide } from "swiper/react";
import { ICategory } from "../../../interfaces/ICategory";
import { Link } from "react-router-dom";
type Prop = {
  categoryLists: ICategory[];
};
const CategorysList = ({categoryLists}:Prop) => {

  return (
    <section className="py-7">
      <h2 className="text-base md:text-xl lg:text-2xl font-semibold text-center">
        DANH MỤC
      </h2>
      <div className="max-w-md mx-auto">
        <Swiper
          watchSlidesProgress={true}
          slidesPerView={5}
          className="mySwiper flex flex-nowrap justify-center mt-5"
          spaceBetween={20}
          loop={false}
          breakpoints={{
            320: {
              slidesPerView: 3,
            },
            360: {
              slidesPerView: 3.5,
            },
            414: {
              slidesPerView: 4,
            },
            768: {
              slidesPerView: 5,
            },
          }}
        >
          {categoryLists.length > 0 &&
            categoryLists.map((category, index) => {
              return (
                <SwiperSlide
                  key={index + 1}
                  className="bg-primary/20 rounded-full mx-auto !h-[75px] !leading-[75px] flex justify-center items-center hover:cursor-pointer"
                >
                  <Link to={`search?category=${category.slug}`}>
                    <div className="flex justify-center items-center h-full w-full rounded-full overflow-hidden">
                      <img src={category.image} alt="" />
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    </section>
  );
};

export default CategorysList;
