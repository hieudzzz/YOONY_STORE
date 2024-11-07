import { useContext } from "react";
import CartContext from "../../../contexts/CartContext";
import { Link } from "react-router-dom";
import { IAttributeValue } from "../../../interfaces/IAttributeValue";
const ShowMiniCart = () => {
  const { carts } = useContext(CartContext);
  return (
    <div>
      {carts.length === 0 ? (
        <div className="flex flex-col justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-12"
            viewBox="0 0 64 41"
          >
            <g fill="none" fillRule="evenodd" transform="translate(0 1)">
              <ellipse cx="32" cy="33" fill="#f5f5f5" rx="32" ry="7"></ellipse>
              <g fillRule="nonzero" stroke="#d9d9d9">
                <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                <path
                  fill="#fafafa"
                  d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                ></path>
              </g>
            </g>
          </svg>
          <span className="text-sm text-slate-300">Chưa có sản phẩm</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {carts.slice(0, 5).map((cart) => {
            const price = cart.variant.sale_price
              ? cart.variant.sale_price * cart.quantity
              : cart.variant.price * cart.quantity;
            return (
              <div
                key={cart.id}
                className="flex gap-2 shadow-sm p-2 rounded-md justify-between"
              >
                <img
                  src={cart.variant.image || cart.variant.product.images[0]}
                  className="max-w-10 w-full h-10 object-cover rounded-md"
                />
                <div>
                  <Link
                    to={`/${cart.variant.product.category?.slug}/${cart.variant.product.slug}`}
                  >
                    <p className="line-clamp-1 text-sm">
                      {cart.variant.product.name}
                    </p>
                  </Link>
                  <div className="flex gap-2">
                    <span className="text-xs">
                      Size: {""}
                      {cart.variant.attribute_values.find(
                        (item: IAttributeValue) =>
                          item.attribute?.slug === "size"
                      )?.value || "N/A"}
                    </span>
                    <span className="text-xs">
                      Màu: {""}
                      {cart.variant.attribute_values.find(
                        (item: IAttributeValue) =>
                          item.attribute?.slug === "color"
                      )?.value || "N/A"}
                    </span>
                    <span className="text-xs">SL: {cart.quantity}</span>
                  </div>
                </div>
                <div>
                  <span className="text-primary">
                    {price
                      .toLocaleString("vi-VN", {
                        useGrouping: true,
                        maximumFractionDigits: 0,
                      })
                      .replace(/,/g, ".")}
                  </span>
                </div>
              </div>
            );
          })}
          <div className="flex justify-between items-center mt-5 mb-2">
            <div>
              <span className="text-sm text-primary/75">
                {carts.length>5 ? `${carts.length - 5} Thêm Hàng Vào Giỏ` : '' } 
              </span>
            </div>
            <button>
              <Link to={"/gio-hang"} className="py-2 px-4 bg-primary hover:text-util text-util rounded-sm">Xem giỏ hàng</Link>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowMiniCart;
