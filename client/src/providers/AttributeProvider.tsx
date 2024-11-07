import { useEffect, useReducer } from "react";
import { AttributeContext, Props } from "../contexts/AttributeContext";
import { IAttribute } from "../interfaces/IAttribute";
import AttributeReducer from "../reducer/AttributeReducer";
import instance from "../instance/instance";

const AttributeProvider = (props: Props) => {
  const [attributes, dispatch] = useReducer(
    AttributeReducer,
    [] as IAttribute[]
  );
  useEffect(() => {
    (async () => {
      try {
        const { data: { data: { data: response } } } = await instance.get('attribute')
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
    <AttributeContext.Provider value={{ attributes, dispatch }}>
      {props.children}
    </AttributeContext.Provider>
  );
};

export default AttributeProvider;
