import { ReactNode, createContext, useReducer } from "react";
import { IFileds } from "../interfaces/IFileds";
import FiledReducer from "../reducer/FiledsReducer";

interface Props {
    children: ReactNode;
}

// Định nghĩa context với fileds là một đối tượng IFileds
export const FiledContext = createContext<{
    fileds: IFileds;
    dispatch: React.Dispatch<any>;
}>({} as {
    fileds: IFileds;
    dispatch: React.Dispatch<any>;
});

const FiledsProvider = (props: Props) => {
    const initialState: IFileds = {
        color: [],
        size: [],
        priceRange: {
            min: 0,
            max: 100,
        },
        
    };

    const [fileds, dispatch] = useReducer(FiledReducer, initialState);

    return (
        <FiledContext.Provider value={{ fileds, dispatch }}>
            {props.children}
        </FiledContext.Provider>
    );
};

export default FiledsProvider;
