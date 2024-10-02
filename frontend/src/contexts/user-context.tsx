// import {
//     createContext,
//     useContext,
//     useEffect,
//     useState
// } from "react";

// const UserContext = createContext({});

// const UserProvider = ({ children }) => {

//     const [customer, setCustomer] = useState(null);


//     useEffect(() => {
//         setCustomerFromToken()
//     }, [])

//     return (
//         <UserContext.Provider value={{
//             customer,
//         }}>
//             {children}
//         </UserContext.Provider>
//     )
// }

// export const useUser = () => useContext(UserContext);

// export default UserProvider;