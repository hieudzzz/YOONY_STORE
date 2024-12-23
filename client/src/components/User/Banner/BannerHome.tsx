import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { IBanner } from "../../../interfaces/IBanners";
type Prop={
  banners:IBanner[]
}
const BannerHome = ({banners}:Prop) => {
  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay]}
        className={`mySwiper max-h-[400px] w-full ${banners.length <=3?'lg:w-full' : 'lg:w-[75%]'} h-full rounded-lg`}
      >
        {banners
        .sort((a: IBanner, b: IBanner) => a?.id - b?.id)
        .slice(0, 5).map((banner,index) => (
          <SwiperSlide key={index+1}>
            <img
              src={banner.image}
              alt="yoony-banner-1"
              className="w-full h-full object-cover hover:cursor-pointer"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default BannerHome;
