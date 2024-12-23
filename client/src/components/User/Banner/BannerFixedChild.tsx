import { Image } from "antd";
import { IBanner } from "../../../interfaces/IBanners";
type Prop = {
  banners: IBanner[];
};
const BannerFixedChild = ({ banners }: Prop) => {
  return (
    <div className="hidden lg:max-w-[25%] w-full space-y-3 lg:flex flex-row lg:flex-col items-center">
      <Image.PreviewGroup>
        {banners
          .filter((banner) => banner?.id !== undefined)
          .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
          .slice(5, 8)
          .map((banner) => (
            <Image
              key={banner.id}
              className="object-cover rounded-lg w-full h-full max-h-[125px]"
              src={banner.image}
              preview={{
                mask: "Xem",
                maskClassName: "text-md lg:text-lg",
              }}
            />
          ))}
      </Image.PreviewGroup>
    </div>
  );
  
};

export default BannerFixedChild;
