const BannerFixedChild = () => {
  return (
    <div className="hidden lg:max-w-[25%] w-full space-y-3 lg:flex flex-row lg:flex-col items-center ">
        <img src="../../../src/assets/images/banner1.png" className="object-cover rounded-lg w-full h-full max-h-[125px]" alt="banner-1-child" />
        <img src="../../../src/assets/images/banner2.png" className="object-cover rounded-lg w-full h-full max-h-[125px]" alt="banner-2-child" />
        <img src="../../../src/assets/images/banner2.png" className="object-cover rounded-lg w-full h-full max-h-[125px]" alt="banner-2-child" />
    </div>
  )
}

export default BannerFixedChild