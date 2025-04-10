import { createContext, useState } from "react";

export const UserContext = createContext();
const UserContextProvider = (props) => {
    const [data, setData] = useState([]);
    const onSetData = (array) => {
        setData(array);
    };
    return (
        <UserContext.Provider value={{ data, onSetData }}>
            {props.children}
        </UserContext.Provider>
    );
};
export default UserContextProvider;
