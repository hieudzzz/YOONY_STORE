
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
}



