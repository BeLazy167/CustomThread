import {
    UserButton,
    SignInButton,
    SignUpButton,
    useUser,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, ArrowLeft, Menu, X } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useLocation, useNavigate } from "react-router-dom";
import { CartDropdown } from "./cart/cart-dropdown";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Extracted ThemeToggle component for better organization
const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            className="bg-transparent border-none focus:ring-2 focus:ring-primary/20"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            <SunIcon className="absolute h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-black dark:text-white" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-black dark:text-white" />
        </Button>
    );
};

// Extracted AuthButtons component
const AuthButtons = () => (
    <div className="flex items-center gap-2">
        <SignInButton mode="modal">
            <Button variant="ghost" className="text-sm">
                Sign in
            </Button>
        </SignInButton>
        <SignUpButton mode="modal">
            <Button className="text-sm">Sign up</Button>
        </SignUpButton>
    </div>
);

export default function Nav() {
    const { isSignedIn } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    const isDesignPage = location.pathname.includes("/design");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (isDesignPage) {
        return (
            <header className="fixed top-0 left-0 z-50 p-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 shadow-sm"
                >
                    <ArrowLeft className="h-6 w-6" />
                    <span className="sr-only">Go back</span>
                </Button>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
            <div className="container mx-auto px-4">
                <nav className="flex h-16 items-center justify-between">
                    <a
                        href="/"
                        className="text-xl font-bold bg-gradient-to-r from-purple-600 via-primary to-teal-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-primary dark:to-teal-400"
                    >
                        CustomThreads
                    </a>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <CartDropdown />
                        {isSignedIn ? (
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-8 h-8",
                                    },
                                }}
                            />
                        ) : (
                            <div className="hidden md:block">
                                <AuthButtons />
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </nav>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t bg-background"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                            {!isSignedIn && (
                                <div className="flex flex-col gap-2">
                                    <AuthButtons />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
