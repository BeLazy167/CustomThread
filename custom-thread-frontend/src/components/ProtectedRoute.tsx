import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
    const { isLoaded, isSignedIn } = useUser();
    const location = useLocation();

    if (!isLoaded) {
        return null;
    }

    if (!isSignedIn) {
        return <Navigate to="/sign-in" replace />;
    }

    if (isSignedIn && ["/sign-in", "/sign-up"].includes(location.pathname)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
