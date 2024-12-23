import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import { IVoucher } from "../interfaces/IVouchers";
import voucherReducer from "../reducer/VoucherReducer";
import instance from "../instance/instance";
import { IMeta } from "../interfaces/IMeta";
import { useSearchParams } from "react-router-dom";

interface Prop {
  children: ReactNode;
}

export const VoucherContext = createContext<{
  vouchers: IVoucher[];
  dispatch: any;
  meta: IMeta | null;
  page: number;
  setSearchParams: (params: Record<string, string | number | boolean>) => void;
}>({
  vouchers: [],
  dispatch: () => {},
  meta: null,
  page: 1,
  setSearchParams: () => {},
});

const VoucherProvider = (props: Prop) => {
  const [vouchers, dispatch] = useReducer(voucherReducer, [] as IVoucher[]);
  const [meta, setMeta] = useState<IMeta | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    (async () => {
      try {
        setSearchParams({ page: String(page) });
        const { data } = await instance.get("coupon", {
          params: { page },
        });

        dispatch({
          type: "LIST",
          payload: data.data.data,
        });

        setMeta(data.data);
        // console.log(data.data);
      } catch (error) {
        console.error("Failed to fetch vouchers:", error);
      }
    })();
  }, [page]);

  const updateSearchParams = (
    params: Record<string, string | number | boolean>
  ) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      newParams.set(key, String(value));
    });
    setSearchParams(newParams);
  };

  return (
    <VoucherContext.Provider
      value={{
        vouchers,
        dispatch,
        meta,
        page,
        setSearchParams: updateSearchParams,
      }}
    >
      {props.children}
    </VoucherContext.Provider>
  );
};

export default VoucherProvider;
