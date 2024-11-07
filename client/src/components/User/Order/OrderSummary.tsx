import { useContext, useEffect, useState } from "react";
import CartContext from "../../../contexts/CartContext";
import { ICart } from "../../../interfaces/ICart";
import { Link } from "react-router-dom";
import { IAttributeValue } from "../../../interfaces/IAttributeValue";


const OrderSummary = () => {
  const { carts } = useContext(CartContext);
  const [listSelectCartItem, setListSelectCartItem] = useState<ICart[]>([]);
  const [orderData, setOrderData] = useState();
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const idCarts = JSON.parse(localStorage.getItem("id_cart")!);
    const OrderFormData = JSON.parse(
      localStorage.getItem("addressOrderFormData")!
    );
    const methodPayment = JSON.parse(localStorage.getItem("methodPayment")!);
    OrderFormData.payment_method = methodPayment;
    OrderFormData.selected_items = idCarts;
    const cartList = idCarts.flatMap((idCart: number) => {
      return carts.filter((cart) => {
        return cart.id === idCart;
      });
    });
    setListSelectCartItem(cartList);

    const total = cartList.reduce((sum, item) => {
      return (
        sum + item.quantity * (item.variant.sale_price || item.variant.price)
      );
    }, 0);

    setTotalAmount(total);
    setOrderData({
      ...OrderFormData,
    });
  }, [carts]);

  useEffect(() => {
    if (orderData) {
      localStorage.setItem("orderData", JSON.stringify(orderData));
    }
  }, [orderData]);

  return (
    <div className="space-y-5">
      <h3 className="font-medium">Tổng quan đơn hàng</h3>
      <table className="table w-full text-left">
        <thead>
          <tr>
            <th className="font-normal text-secondary/65">Sản phẩm</th>
            <th className="font-normal text-secondary/65">Đơn giá</th>
            <th className="font-normal text-secondary/65 text-center">
              Số lượng
            </th>
            <th className="font-normal text-secondary/65 text-center">
              Thành tiền
            </th>
          </tr>
        </thead>
        <tbody className="my-5">
          {listSelectCartItem.map((itemCart) => {
            return (
              <tr key={itemCart.id} className="border-b border-[#f2f2f2]">
                <td className="py-3 text-sm">
                  <div className="flex gap-3 items-center w-fit ">
                    <img
                      src={
                        itemCart.variant.image ||
                        itemCart.variant.product.images[0]
                      }
                      className="w-14 h-14 object-cover rounded-lg"
                      alt={itemCart.variant.product?.name}
                    />
                    <div className="space-y-1">
                      <Link
                        to={`/${itemCart.variant.product.category?.slug}/${itemCart.variant.product.slug}`}
                        className="line-clamp-1 hover:text-primary text-sm"
                      >
                        {itemCart.variant.product?.name}
                      </Link>
                      <div className="flex gap-2 text-secondary/50 text-sm">
                        <span>
                          Size:{" "}
                          {itemCart.variant.attribute_values.find(
                            (item: IAttributeValue) =>
                              item.attribute.slug === "size"
                          )?.value || "N/A"}
                        </span>
                        <span>
                          Màu:{" "}
                          {itemCart.variant.attribute_values.find(
                            (item: IAttributeValue) =>
                              item.attribute.slug === "color"
                          )?.value || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-sm">
                  <span>
                    {(itemCart.variant.sale_price || itemCart.variant.price)
                      .toLocaleString("vi-VN", {
                        useGrouping: true,
                        maximumFractionDigits: 0,
                      })
                      .replace(/,/g, ".")}{" "}
                    đ
                  </span>
                </td>
                <td className="py-3 text-sm text-center">
                  <span>{itemCart.quantity}</span>
                </td>
                <td className="py-3 text-sm text-center">
                  <span>
                    {(
                      itemCart.quantity *
                      (itemCart.variant.sale_price || itemCart.variant.price)
                    )
                      .toLocaleString("vi-VN", {
                        useGrouping: true,
                        maximumFractionDigits: 0,
                      })
                      .replace(/,/g, ".")}{" "}
                    đ
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex gap-5 border-t border-[#f2f2f2] pt-4">
        <div className="space-y-3">
          <h3 className="font-medium">Địa chỉ nhận hàng</h3>
          <div className="flex justify-between items-center gap-5 bg-[#f7f7f8] py-3 px-4 rounded-lg">
            <div className="space-y-1">
              <label htmlFor="" className="block text-sm font-medium">
                Lee Dinh An
              </label>
              <div className="text-sm text-secondary/75 space-y-1">
                <p className="line-clamp-1">Hung tien- nam -dan nfnfn</p>
                <span className="block">0981184358</span>
              </div>
            </div>
            <button className="flex items-center gap-1 bg-primary py-1 text-util rounded-sm px-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-4"
                color={"currentColor"}
                fill={"none"}
              >
                <path
                  d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>{" "}
              Sửa
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="font-medium">Địa chỉ nhận hàng</h3>
          <div className="flex justify-between items-center gap-5 bg-[#f7f7f8] py-3 px-4 rounded-lg">
            <div className="space-y-1">
              <label htmlFor="" className="block text-sm font-medium">
                Lee Dinh An
              </label>
              <div className="text-sm text-secondary/75 space-y-1 ">
                <p className="line-clamp-1">Hung tien- nam -dan nfnfn</p>
                <span className="block">0981184358</span>
              </div>
            </div>
            <button className="flex items-center gap-1 bg-primary py-1 text-util rounded-sm px-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-4"
                color={"currentColor"}
                fill={"none"}
              >
                <path
                  d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>{" "}
              Sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
