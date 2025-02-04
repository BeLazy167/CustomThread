import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Profile() {
    const { isLoaded, isSignedIn, user } = useUser();
    console.log(user);
    if (!isLoaded) return null;

    if (!isSignedIn) {
        return <Navigate to="/sign-in" replace />;
    }

    return (
        <div className="container py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <Label>Full name</Label>
                        <p className="text-sm text-muted-foreground">
                            {user?.firstName || ""} {user?.lastName || ""}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <Label>Email address</Label>
                        <p className="text-sm text-muted-foreground">
                            {user?.primaryEmailAddress?.emailAddress || ""}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
