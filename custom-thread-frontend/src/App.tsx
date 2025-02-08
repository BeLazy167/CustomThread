import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";
import Nav from "./components/nav";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import { Home } from "./components/home";
import Design from "./pages/Design";
import "./App.css";
import Product from "./pages/Product";

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
            <BrowserRouter>
                <Nav />
                <div className="min-h-screen bg-background mx-auto flex flex-col justify-center pt-16 ">
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/sign-in"
                                element={
                                    <SignIn routing="path" path="/sign-in" />
                                }
                            />
                            <Route
                                path="/sign-up"
                                element={
                                    <SignUp routing="path" path="/sign-up" />
                                }
                            />
                            <Route element={<ProtectedRoute />}>
                                <Route path="/design" element={<Design />} />
                            </Route>

                            <Route path="/product" element={<Product />} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
