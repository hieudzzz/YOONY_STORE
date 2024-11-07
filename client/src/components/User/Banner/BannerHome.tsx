import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation,Autoplay } from "swiper/modules";

const BannerHome = () => {
  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        autoplay={
            {
                delay: 2500,
                disableOnInteraction:false
            }
        }
        navigation={true}
        modules={[Pagination, Navigation,Autoplay]}
        className="mySwiper max-h-[400px] w-full lg:w-[75%] h-full rounded-lg"
      >
        <SwiperSlide>
            <img src="../../../src/assets/images/yoony-banner-1.jpeg" alt="yoony-banner-1" className="w-full h-full object-cover hover:cursor-pointer" />
        </SwiperSlide>
        <SwiperSlide>
            <img src="../../../src/assets/images/yoony-banner-2.jpeg" alt="yoony-banner-2" className="w-full h-full object-cover hover:cursor-pointer" />
        </SwiperSlide>
        <SwiperSlide>
            <img src="../../../src/assets/images/yoony-banner-3.jpeg" alt="yoony-banner-3" className="w-full h-full object-cover hover:cursor-pointer" />
        </SwiperSlide>
        <SwiperSlide>
            <img src="../../../src/assets/images/yoony-banner-4.jpeg" alt="yoony-banner-4" className="w-full h-full object-cover hover:cursor-pointer" />
        </SwiperSlide>
        <SwiperSlide>
            <img src="../../../src/assets/images/yoony-banner-5.jpeg" alt="yoony-banner-5" className="w-full h-full object-cover hover:cursor-pointer" />
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default BannerHome;
