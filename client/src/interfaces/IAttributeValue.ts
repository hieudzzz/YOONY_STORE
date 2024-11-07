import { IAttribute } from "./IAttribute";

export interface IAttributeValue {
    id?: number,
    value?: string,
    attribute:IAttribute
    attribute_id?:IAttribute
    attribute_value_id?:IAttribute
}

