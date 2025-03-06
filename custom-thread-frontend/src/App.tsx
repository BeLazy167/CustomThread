import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";
import Nav from "./components/nav";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Home } from "./components/home";
import Design from "./pages/Design";
import Product from "./pages/Product";
import ProfilePage from "./components/profile/ProfilePage";
import ProductsPage from "./components/product_list/Products";
import LivePackageJourney from "./components/checkout/CheckoutPage";
import Receipt from "./components/receipt/Receipt";
// import ExploreDesigns from "./pages/ExploreDesigns";
import { QueryProvider } from "./providers/query-provider";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
            <QueryProvider>
                {/* <ReactQueryDevtools /> */}
                <BrowserRouter>
                    <div className="min-h-screen bg-background flex flex-col">
                        <Nav />
                        <Toaster />
                        <main className="flex-1">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route
                                    path="/sign-in"
                                    element={
                                        <SignIn
                                            routing="path"
                                            path="/sign-in"
                                        />
                                    }
                                />
                                <Route
                                    path="/sign-up"
                                    element={
                                        <SignUp
                                            routing="path"
                                            path="/sign-up"
                                        />
                                    }
                                />
                                <Route element={<ProtectedRoute />}>
                                    <Route
                                        path="/design"
                                        element={<Design />}
                                    />
                                    <Route
                                        path="/checkout"
                                        element={<Checkout />}
                                    />
                                    <Route
                                        path="/profile"
                                        element={<ProfilePage />}
                                    />
                                </Route>
                                <Route
                                    path="/products"
                                    element={<ProductsPage />}
                                />
                                <Route
                                    path="/product-info/:id"
                                    element={<Product />}
                                />
                                <Route
                                    path="/order-tracking"
                                    element={<LivePackageJourney />}
                                />
                                <Route
                                    path="/checkout/success"
                                    element={<CheckoutSuccess />}
                                />
                                <Route
                                    path="/checkout/cancel"
                                    element={<CheckoutCancel />}
                                />
                                <Route
                                    path="/explore-designs"
                                    element={
                                        <Navigate to="/products" replace />
                                    }
                                />
                                {/* <Route index={true} element={<Sidebar />} /> */}
                                <Route path="/receipt" element={<Receipt />} />
                            </Routes>
                        </main>
                    </div>
                </BrowserRouter>
            </QueryProvider>
        </ThemeProvider>
    );
}

export default App;
