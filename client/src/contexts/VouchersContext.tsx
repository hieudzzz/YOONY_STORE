import { createContext, ReactNode, useEffect, useReducer } from "react";
import { IVoucher } from "../interfaces/IVouchers";
import voucherReducer from "../reducer/VoucherReducer";
import instance from "../instance/instance";

interface Prop {
    children: ReactNode
}

export const VoucherContext = createContext({} as {
    vouchers: IVoucher[],
    dispatch: any
})

const VoucherProvider = (props: Prop) => {
    const [vouchers, dispatch] = useReducer(voucherReducer, [] as IVoucher[]);
    useEffect(() => {
        (async () => {
            try {
                const { data } = await instance.get("coupon");
                dispatch({
                    type: "LIST",
                    payload: data.data.data,
                });
            } catch (error) {
                console.error("Failed to fetch vouchers:", error);
            }
        })();
    }, []);

    return (
        <VoucherContext.Provider value={{ vouchers, dispatch }}>
            {props.children}
        </VoucherContext.Provider>
    )
}
export default VoucherProvider