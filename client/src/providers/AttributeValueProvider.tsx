import { useEffect, useReducer } from "react";
import instance from "../instance/instance";
import { IAttributeValue } from "../interfaces/IAttributeValue";
import { AttributeValueContext, Props } from "../contexts/AttributeValueContext";
import AttributeValueReducer from "../reducer/AttributeValueReducer";

const AttributeValueProvider = (props: Props) => {
  const [attributeValues, dispatch] = useReducer(
    AttributeValueReducer,
    [] as IAttributeValue[]
  );
  useEffect(() => {
    (async () => {
      try {
        const { data: { data: { data: response } } } = await instance.get('attribute-value')
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
    <AttributeValueContext.Provider value={{ attributeValues, dispatch }}>
      {props.children}
    </AttributeValueContext.Provider>
  );
};

export default AttributeValueProvider;
