import { useContext, useEffect } from "react";
import instance from "../../../instance/instance";
import CartContext from "../../../contexts/CartContext";

const CARTLOCAL_KEY = "cartLocal";
type Props={
  idUser:number;
}
const useAddCartLocal = ({idUser}:Props) => {
  const { dispatch: dispatchCart } = useContext(CartContext);

  useEffect(() => {
    const addCartLocal = async () => {
      let existingCart = [];
      try {
        existingCart = JSON.parse(localStorage.getItem(CARTLOCAL_KEY)) || [];
      } catch (error) {
        console.error("Error parsing local cart data:", error);
        return;
      }

      if (existingCart.length === 0) return;

      const formattedCart = existingCart
        .filter(item => item?.variant_id && item?.quantity)
        .map(item => ({
          variant_id: item.variant_id,
          quantity: item.quantity
        }));

      try {
        const { data } = await instance.post(`addcartMultil/${idUser}`, { local_cart: formattedCart });
        dispatchCart({ type: "ADD", payload: data.data });
        localStorage.removeItem(CARTLOCAL_KEY);
      } catch (error) {
        console.error("Error adding cart items to server:", error);
      }
    };

    addCartLocal();
  }, []);

  return null;
};

export default useAddCartLocal;
