const CardProductWishList = () => {
    return (
        <div className="min-h-[354px] group max-w-[220px] w-full bg-util rounded-lg overflow-hidden shadow-[0px_1px_4px_0px_rgba(255,_138,_0,_0.25)] cursor-pointer">
            <div className="relative z-40 group">
                <img
                    src="../../../../src/assets/images/product-image.png"
                    alt="product-image"
                />
                <div className="absolute top-2 right-2 z-30 text-primary/70 cursor-pointer">
                    <div className="rounded-full bg-primary/30 p-2"> 
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                        </svg>
                    </div>
                </div>
                <div className="bg-primary/25 absolute top-0 z-40 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:cursor-pointer">
                    <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-util p-2 rounded-full hover:cursor-pointer text-primary transition-all">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width={20}
                            height={20}
                            color={"currentColor"}
                            fill={"none"}
                        >
                            <path
                                d="M8 16H15.2632C19.7508 16 20.4333 13.1808 21.261 9.06904C21.4998 7.88308 21.6192 7.2901 21.3321 6.89503C21.1034 6.58036 20.7077 6.51633 20 6.5033"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                            <path
                                d="M9 6.5H17M13 10.5V2.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                            <path
                                d="M8 16L5.37873 3.51493C5.15615 2.62459 4.35618 2 3.43845 2H2.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                            <path
                                d="M8.88 16H8.46857C7.10522 16 6 17.1513 6 18.5714C6 18.8081 6.1842 19 6.41143 19H17.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle
                                cx="10.5"
                                cy="20.5"
                                r="1.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <circle
                                cx="17.5"
                                cy="20.5"
                                r="1.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-2 -mt-3.5 z-50 relative">
                <span className="p-3 rounded-full bg-util border border-primary"></span>
                <span className="p-3 rounded-full bg-primary border border-primary"></span>
                <span className="p-3 rounded-full bg-secondary border border-primary"></span>
            </div>
            <div className="px-5 space-y-2">
                <p className="line-clamp-1 mt-4 font-medium text-sm  md:text-base">
                    Áo Polo Bo Dệt Sọc Đẹp Như Cô Gái Mới Lớn
                </p>
                <div className="flex gap-2 text-sm justify-center">
                    <span className="line-through">450.000 Đ</span>
                    <span className="text-primary font-medium">300.000 Đ</span>
                </div>
            </div>
        </div>
    )
}
export default CardProductWishList