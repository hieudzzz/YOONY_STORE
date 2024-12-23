import HTMLReactParser from "html-react-parser";
import { useState } from "react";

type Prop = {
  descriptionProduct: string;
};

const ShowDescriptionProduct = ({ descriptionProduct }: Prop) => {
  const [isShowDesc, setIsShowDesc] = useState<boolean>(false);

  return (
    <div className="bg-white border border-[#f1f1f1] rounded-md p-5 space-y-5">
      <h2 className="text-base md:text-xl font-medium uppercase flex items-center gap-2">
        MÔ TẢ SẢN PHẨM
      </h2>
      <div>
        <div
          className={`
          max-w-[800px] w-full relative pb-[60px]
          ${
            isShowDesc ? "max-h-full" : "max-h-[300px] min-h-[100px] overflow-hidden relative"
          }
        `}
        >
          <div className="z-10 absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-white via-white/90 to-transparent"></div>
          {HTMLReactParser(descriptionProduct)}
        </div>
        <button
          onClick={() => {
            setIsShowDesc(!isShowDesc);
            window.scrollTo({
              top: 550,
              behavior: "smooth",
            });
          }}
          className="py-1.5 px-3.5 bg-primary text-white text-sm rounded-sm transition-all border border-primary hover:text-primary hover:border-primary hover:bg-transparent"
        >
          {isShowDesc ? "Ẩn bớt" : "Xem thêm"}
        </button>
      </div>
    </div>
  );
};

export default ShowDescriptionProduct;
