import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../UserContext";

const PrivateRoutes = () => {
    const { currentUser } = useCurrentUser();
    if(typeof currentUser?.loggedIn !== 'boolean'){
        return null;
    }
    return (currentUser?.loggedIn ? <Outlet /> : <Navigate to="/login" replace />); 
};

export default PrivateRoutes;
