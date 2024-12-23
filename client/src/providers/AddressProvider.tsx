import { useEffect, useReducer } from "react";
import instance from "../instance/instance";
import { IAddress } from "../interfaces/IAddress";
import AddressReducer from "../reducer/AddressReducer";
import { AddressContext, Props } from "../contexts/AddressContext";

const AddressProvider = (props: Props) => {
  const [addresses, dispatch] = useReducer(
    AddressReducer,
    [] as IAddress[]
  );
  useEffect(() => {
    (async () => {
      try {
        const {data:{data:response}} = await instance.get('get-all-address')
        dispatch({
          type:"LIST",
          payload:response
        })
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])
  return (
    <AddressContext.Provider value={{ addresses, dispatch }}>
      {props.children}
    </AddressContext.Provider>
  );
};

export default AddressProvider;
