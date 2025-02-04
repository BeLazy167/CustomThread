import { useAuth } from "@clerk/clerk-react";

export async function fetchProtectedData() {
    const { getToken } = useAuth();
    const token = await getToken();

    const response = await fetch("your-api-endpoint", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.json();
}
