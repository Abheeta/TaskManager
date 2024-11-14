import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../UserContext";

const GuestRoutes = () => {
    const { currentUser } = useCurrentUser();
    if(typeof currentUser?.loggedIn !== 'boolean'){
        return null;
    }
    return (!currentUser?.loggedIn ? <Outlet /> : <Navigate to="/board" replace />); 
};

export default GuestRoutes;
