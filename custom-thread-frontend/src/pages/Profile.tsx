import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Package,
    Clock,
    Check,
    Truck,
    XCircle,
    AlertCircle,
    ShoppingCart,
} from "lucide-react";
import { useUserOrders } from "@/hooks/use-user-orders";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const OrderStatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case "pending":
            return (
                <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800 border-yellow-200"
                >
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                </Badge>
            );
        case "processing":
            return (
                <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 border-blue-200"
                >
                    <Package className="h-3 w-3 mr-1" />
                    Processing
                </Badge>
            );
        case "shipped":
            return (
                <Badge
                    variant="outline"
                    className="bg-indigo-100 text-indigo-800 border-indigo-200"
                >
                    <Truck className="h-3 w-3 mr-1" />
                    Shipped
                </Badge>
            );
        case "delivered":
            return (
                <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 border-green-200"
                >
                    <Check className="h-3 w-3 mr-1" />
                    Delivered
                </Badge>
            );
        case "cancelled":
            return (
                <Badge
                    variant="outline"
                    className="bg-red-100 text-red-800 border-red-200"
                >
                    <XCircle className="h-3 w-3 mr-1" />
                    Cancelled
                </Badge>
            );
        default:
            return (
                <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-800 border-gray-200"
                >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {status}
                </Badge>
            );
    }
};

export default function Profile() {
    const { isLoaded, isSignedIn, user } = useUser();
    const {
        orders,
        loading,
        error,
        pagination,
        cancelOrder,
        fetchNextPage,
        fetchPreviousPage,
        isCancelling,
    } = useUserOrders();
    const { toast } = useToast();

    if (!isLoaded) return null;

    if (!isSignedIn) {
        return <Navigate to="/sign-in" replace />;
    }

    const handleCancelOrder = async (orderId) => {
        try {
            await cancelOrder(orderId);
            toast({
                title: "Order Cancelled",
                description: "Your order has been successfully cancelled.",
                variant: "default",
            });
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err.message ||
                    "Unable to cancel order. Only pending orders can be cancelled.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container py-10">
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label>Full name</Label>
                                <p className="text-sm text-muted-foreground">
                                    {user?.firstName || ""}{" "}
                                    {user?.lastName || ""}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <Label>Email address</Label>
                                <p className="text-sm text-muted-foreground">
                                    {user?.primaryEmailAddress?.emailAddress ||
                                        ""}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="orders">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Order History
                            </CardTitle>
                            <CardDescription>
                                View and manage your orders
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="border rounded-lg p-4"
                                        >
                                            <Skeleton className="h-6 w-1/3 mb-4" />
                                            <div className="flex gap-4 mb-4">
                                                <Skeleton className="h-20 w-20" />
                                                <div className="flex-1">
                                                    <Skeleton className="h-4 w-2/3 mb-2" />
                                                    <Skeleton className="h-4 w-1/2 mb-2" />
                                                    <Skeleton className="h-4 w-1/4" />
                                                </div>
                                            </div>
                                            <div className="flex justify-between">
                                                <Skeleton className="h-6 w-20" />
                                                <Skeleton className="h-6 w-24" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="text-center py-8">
                                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium">
                                        Error Loading Orders
                                    </h3>
                                    <p className="text-muted-foreground mt-1">
                                        {error.message}
                                    </p>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-8">
                                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium">
                                        No Orders Yet
                                    </h3>
                                    <p className="text-muted-foreground mt-1">
                                        When you place orders, they will appear
                                        here
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div
                                            key={order._id}
                                            className="border rounded-lg p-4"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="font-medium">
                                                        Order #
                                                        {order._id.slice(-6)}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Placed{" "}
                                                        {formatDistanceToNow(
                                                            new Date(
                                                                order.createdAt
                                                            ),
                                                            { addSuffix: true }
                                                        )}
                                                    </p>
                                                </div>
                                                <OrderStatusBadge
                                                    status={order.status}
                                                />
                                            </div>

                                            <div className="space-y-4 mb-4">
                                                {order.items.map((item) => (
                                                    <div
                                                        key={item._id}
                                                        className="flex gap-4"
                                                    >
                                                        <div className="h-20 w-20 bg-slate-100 rounded">
                                                            {item.design.images
                                                                ?.length >
                                                                0 && (
                                                                <img
                                                                    src={
                                                                        item
                                                                            .design
                                                                            .images[0]
                                                                    }
                                                                    alt={
                                                                        item
                                                                            .design
                                                                            .title
                                                                    }
                                                                    className="h-full w-full object-cover rounded"
                                                                />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium">
                                                                {
                                                                    item.design
                                                                        .title
                                                                }
                                                            </h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                Size:{" "}
                                                                {item.size},
                                                                Color:{" "}
                                                                {item.color}
                                                            </p>
                                                            <p className="text-sm">
                                                                $
                                                                {
                                                                    item.design
                                                                        .price
                                                                }{" "}
                                                                x{" "}
                                                                {item.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-between items-center border-t pt-4">
                                                <div>
                                                    <p className="font-medium">
                                                        Total: $
                                                        {order.totalAmount.toFixed(
                                                            2
                                                        )}
                                                    </p>
                                                </div>
                                                {order.status === "pending" && (
                                                    <Button
                                                        variant="outline"
                                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                                        onClick={() =>
                                                            handleCancelOrder(
                                                                order._id
                                                            )
                                                        }
                                                        disabled={isCancelling}
                                                    >
                                                        {isCancelling ? (
                                                            <>
                                                                <span className="animate-spin mr-2">
                                                                    ○
                                                                </span>
                                                                Cancelling...
                                                            </>
                                                        ) : (
                                                            "Cancel Order"
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {pagination.totalPages > 1 && (
                                        <div className="flex justify-center gap-2 mt-6">
                                            <Button
                                                variant="outline"
                                                onClick={fetchPreviousPage}
                                                disabled={pagination.page === 1}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={fetchNextPage}
                                                disabled={
                                                    pagination.page ===
                                                    pagination.totalPages
                                                }
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
