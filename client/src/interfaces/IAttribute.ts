type AttributeValue = {
    id: number;
    value: string;
    attribute_id: number;
    created_at: string;
    updated_at: string;
  };
  
enum AttributeType {
    Select = 'select',
    Color = 'color',
    Button = 'button',
    Radio = 'radio',
}

export interface IAttribute {
    id?: number,
    name: string,
    slug: string,
    type?: AttributeType
    attribute_values?: AttributeValue[];
}



