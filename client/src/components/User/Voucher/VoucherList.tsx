import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay } from "swiper/modules";

const VoucherList = () => {
  const vouchers = [
    {
      name: "Voucher 50K",
      desc: "Giảm 50k cho hóa đơn từ 999k",
      timeEnd: "HSD: 2024-08-03",
    },
    {
      name: "Voucher 30K",
      desc: "Giảm 30k cho hóa đơn từ 999k",
      timeEnd: "HSD: 2024-08-03",
    },
    {
      name: "Voucher 70K",
      desc: "Giảm 100K cho hóa đơn từ 999k",
      timeEnd: "HSD: 2024-08-03",
    },
    {
      name: "Voucher 50K",
      desc: "Giảm 100K cho hóa đơn từ 999k",
      timeEnd: "HSD: 2024-08-03",
    },
    {
      name: "Voucher 50K",
      desc: "Giảm 100K cho hóa đơn từ 999k",
      timeEnd: "HSD: 2024-08-03",
    },
  ];
  return (
    <Swiper
      slidesPerView={4}
      spaceBetween={15}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      loop={true}
      modules={[Autoplay]}
      className="mySwiper"
      breakpoints={{
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        360: {
          slidesPerView: 1.2,
          spaceBetween: 10,
        },
        414: {
          slidesPerView: 1.5,
          spaceBetween: 10,
        },
        568: {
          slidesPerView: 2.2,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 3.2,
          spaceBetween: 10,
        },
        1114: {
          slidesPerView: 4,
        },
      }}
    >
      {vouchers.length > 0 &&
        vouchers.map((voucher, index) => {
          return (
            <SwiperSlide
              className="py-2 px-0.5 hover:cursor-pointer"
              key={index + 1}
            >
              <div className="flex gap-5 w-full md:w-fit justify-center items-center mx-auto shadow-[0px_0px_4px_0px_rgba(255,_153,_0,_0.50)] bg-util rounded-lg py-2.5 px-4">
                <div className="space-y-2">
                  <div className="space-y-2">
                    <span className="text-base font-medium">
                      {voucher.name}
                    </span>
                    <p className="font-light text-xs line-clamp-1">
                      {voucher.desc}
                    </p>
                  </div>
                  <span className="mt-5 block text-[#848484] text-xs lg:text-sm">
                    {voucher.timeEnd}
                  </span>
                </div>
                <div className="border h-[70px] border-dashed border-primary/50 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20"
                    className="absolute -top-[20px] -left-2.5 rounded-full"
                  >
                    <g filter="url(#filter0_i_489_1164)">
                      <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill="#fff"
                        transform="rotate(180 10 10)"
                      ></circle>
                    </g>
                    <defs>
                      <filter
                        id="filter0_i_489_1164"
                        width="20"
                        height="22"
                        x="0"
                        y="-2"
                        colorInterpolationFilters="sRGB"
                        filterUnits="userSpaceOnUse"
                      >
                        <feFlood
                          floodOpacity="0"
                          result="BackgroundImageFix"
                        ></feFlood>
                        <feBlend
                          in="SourceGraphic"
                          in2="BackgroundImageFix"
                          result="shape"
                        ></feBlend>
                        <feColorMatrix
                          in="SourceAlpha"
                          result="hardAlpha"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        ></feColorMatrix>
                        <feOffset dy="-2"></feOffset>
                        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                        <feComposite
                          in2="hardAlpha"
                          k2="-1"
                          k3="1"
                          operator="arithmetic"
                        ></feComposite>
                        <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.540816 0 0 0 0 0.00177409 0 0 0 0.25 0"></feColorMatrix>
                        <feBlend
                          in2="shape"
                          result="effect1_innerShadow_489_1164"
                        ></feBlend>
                      </filter>
                    </defs>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20"
                    className="absolute -bottom-[20px] -left-2.5 rounded-full"
                  >
                    <g filter="url(#filter0_i_489_1162)">
                      <circle cx="10" cy="10" r="10" fill="#fff"></circle>
                    </g>
                    <defs>
                      <filter
                        id="filter0_i_489_1162"
                        width="20"
                        height="22"
                        x="0"
                        y="0"
                        colorInterpolationFilters="sRGB"
                        filterUnits="userSpaceOnUse"
                      >
                        <feFlood
                          floodOpacity="0"
                          result="BackgroundImageFix"
                        ></feFlood>
                        <feBlend
                          in="SourceGraphic"
                          in2="BackgroundImageFix"
                          result="shape"
                        ></feBlend>
                        <feColorMatrix
                          in="SourceAlpha"
                          result="hardAlpha"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        ></feColorMatrix>
                        <feOffset dy="2"></feOffset>
                        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                        <feComposite
                          in2="hardAlpha"
                          k2="-1"
                          k3="1"
                          operator="arithmetic"
                        ></feComposite>
                        <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.540816 0 0 0 0 0.00177409 0 0 0 0.25 0"></feColorMatrix>
                        <feBlend
                          in2="shape"
                          result="effect1_innerShadow_489_1162"
                        ></feBlend>
                      </filter>
                    </defs>
                  </svg>
                </div>
                <div>
                  <button className="bg-primary py-2 px-[10px] text-util rounded-md md:text-sm lg:text-base">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-7"
                      color={"currentColor"}
                      fill={"none"}
                    >
                      <path
                        d="M12 22C16.4183 22 20 18.4183 20 14C20 8 12 2 12 2C11.6117 4.48692 11.2315 5.82158 10 8C8.79908 7.4449 8.5 7 8 5.75C6 8 4 11 4 14C4 18.4183 7.58172 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 17L14 13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 13H10.009M13.991 17H14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};

export default VoucherList;
