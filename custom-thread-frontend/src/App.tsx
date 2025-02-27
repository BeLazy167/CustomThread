import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";
import Nav from "./components/nav";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import { Home } from "./components/home";
import Design from "./pages/Design";
import Product from "./pages/Product";
import ProfilePage from "./components/profile/ProfilePage";
import ProductsPage from "./components/product_list/Products";
import CheckoutPage from "./components/checkout/CheckoutPage";
// import Sidebar from "./components/sidebar/Sidebar";\
import Receipt from "./components/receipt /Receipt";


function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
            <BrowserRouter>
                <Nav />
                <div className="min-h-screen bg-background mx-auto flex flex-col justify-center pt-16 ">
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
                            <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />
                            <Route element={<ProtectedRoute />}>
                                <Route path="/design" element={<Design />} />
                            </Route>
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/product-info/:id" element={<Product />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            {/* <Route index={true} element={<Sidebar />} /> */}
                            <Route path="/receipt" element={<Receipt />} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
