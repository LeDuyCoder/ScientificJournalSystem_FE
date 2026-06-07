import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../shared/utils/auth";

export default function ProtectedRoute() {
    const location = useLocation();

    if (!isAuthenticated()) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );
    }

    return <Outlet />;
}

export const LoginRouteCheck = () => {
    if (isAuthenticated()) {
        return (
            <Navigate
                to="/dashboard"
                replace
                state={{
                    from: location.pathname + location.search,
                }}
            />
        );
    }

    return <Outlet />;

}