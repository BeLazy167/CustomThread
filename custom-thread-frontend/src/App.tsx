import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";
import Nav from "./components/nav";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import { Home } from "./components/home";
import "./App.css";
import Product from "./pages/Product";

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
            <BrowserRouter>
                <div className="min-h-screen bg-background mx-auto flex flex-col justify-center">
                    <Nav />
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
                                <Route path="/profile" element={<Profile />} />
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
