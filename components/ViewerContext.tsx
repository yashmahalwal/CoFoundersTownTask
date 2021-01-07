import { createContext, useContext } from "react";
import { ErrorType } from "../server/api-types";
import { ViewerPayload } from "../server/users/types";

export interface ViewerContextProps {
    viewer: Exclude<ViewerPayload, ErrorType>["user"];
}
const ViewerContext = createContext<ViewerContextProps["viewer"]>(null);

export const ViewerProvider: React.FunctionComponent<ViewerContextProps> = (
    props
) => {
    return (
        <ViewerContext.Provider value={props.viewer}>
            {props.children}
        </ViewerContext.Provider>
    );
};

export function useViewer(): ViewerContextProps["viewer"] {
    return useContext(ViewerContext);
}
