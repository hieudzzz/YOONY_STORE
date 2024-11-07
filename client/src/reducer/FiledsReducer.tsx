import { IFileds } from "../interfaces/IFileds";

type Action =
    | { type: 'SET_COLOR', payload: string[] }
    | { type: 'SET_SIZE', payload: string[] }
    | { type: 'SET_PRICE_RANGE', payload: { min: number; max: number } };

const FiledReducer = (state: IFileds, action: Action): IFileds => {
    switch (action.type) {
        case 'SET_COLOR':
            return { ...state, color: action.payload };
        case 'SET_SIZE':
            return { ...state, size: action.payload };
        case 'SET_PRICE_RANGE':
            return { ...state, priceRange: action.payload };
        default:
            return state;
    }
};

export default FiledReducer;
