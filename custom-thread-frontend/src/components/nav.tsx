import { SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
    MoonIcon,
    SunIcon,
    ArrowLeft,
    Menu,
    X,
    User,
    Bell,
    Settings,
    LogOut,
    ChevronDown,
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useLocation, useNavigate } from "react-router-dom";
import { CartDropdown } from "./cart/cart-dropdown";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

// Custom UserProfile component with dropdown

export default function Nav() {
    const { isSignedIn, user } = useUser();
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
            <div className="container mx-auto px-4 max-w-7xl">
                <nav className="flex h-16 items-center justify-between">
                    <motion.a
                        href="/"
                        className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        CustomThreads
                    </motion.a>

                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                    >
                        <ThemeToggle />
                        <CartDropdown />
                        {isSignedIn ? (
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="hidden sm:flex items-center gap-2 dark:border-slate-700 dark:text-slate-300"
                                >
                                    <Bell className="h-4 w-4" />
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                                    </span>
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex items-center gap-2"
                                        >
                                            <Avatar className="h-8 w-8 border-2 border-white dark:border-slate-800 shadow-sm">
                                                <AvatarImage
                                                    src={user?.imageUrl}
                                                    alt={
                                                        user?.fullName || "User"
                                                    }
                                                />
                                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                                    {user?.fullName
                                                        ?.split(" ")
                                                        .map((n) => n[0])
                                                        .join("") || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="hidden sm:inline dark:text-white">
                                                {user?.username ||
                                                    user?.fullName ||
                                                    "User"}
                                            </span>
                                            <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-56 bg-white/90 backdrop-blur-md dark:bg-slate-900/90 dark:border-slate-800 shadow-lg rounded-xl"
                                    >
                                        <div className="flex items-center justify-start p-3">
                                            <div className="flex flex-col space-y-1 leading-none">
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {user?.username ||
                                                        user?.fullName ||
                                                        "User"}
                                                </p>
                                                <p className="w-[200px] truncate text-sm text-slate-500 dark:text-slate-400">
                                                    {user?.primaryEmailAddress
                                                        ?.emailAddress || ""}
                                                </p>
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator className="dark:border-slate-700" />
                                        <DropdownMenuItem
                                            onClick={() => navigate("/profile")}
                                            className="cursor-pointer flex items-center gap-2 p-2.5 text-slate-800 dark:text-white dark:hover:bg-slate-800/70"
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2 p-2.5 text-slate-800 dark:text-white dark:hover:bg-slate-800/70">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="dark:border-slate-700" />
                                        <DropdownMenuItem
                                            onClick={() => {
                                                // @ts-expect-error - Clerk is available globally
                                                window.Clerk?.signOut();
                                            }}
                                            className="cursor-pointer flex items-center justify-end gap-2 p-2.5 text-slate-800 dark:text-white dark:hover:bg-slate-800/70"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <div className="hidden md:block">
                                <AuthButtons />
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="md:hidden"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className="relative"
                            >
                                <AnimatePresence mode="wait">
                                    {isMobileMenuOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{
                                                opacity: 0,
                                                rotate: -90,
                                            }}
                                            animate={{ opacity: 1, rotate: 0 }}
                                            exit={{ opacity: 0, rotate: 90 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <X className="h-6 w-6" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ opacity: 0, rotate: 90 }}
                                            animate={{ opacity: 1, rotate: 0 }}
                                            exit={{ opacity: 0, rotate: -90 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Menu className="h-6 w-6" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </motion.div>
                    </motion.div>
                </nav>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-md"
                    >
                        <div className="container mx-auto px-4 max-w-7xl py-2">
                            {!isSignedIn && (
                                <div className="flex flex-col gap-2 py-2">
                                    <AuthButtons />
                                </div>
                            )}
                            {isSignedIn && (
                                <div className="flex flex-col py-2">
                                    <div className="px-2 py-3 border-b border-border/30 mb-2 flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                                            <AvatarImage
                                                src={user?.imageUrl}
                                                alt={user?.fullName || "User"}
                                            />
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                                {user?.fullName
                                                    ?.split(" ")
                                                    .map((n) => n[0])
                                                    .join("") || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {user?.username ||
                                                    user?.fullName ||
                                                    "User"}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                                                {user?.primaryEmailAddress
                                                    ?.emailAddress || ""}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        className="flex items-center justify-start py-2.5 px-3 hover:bg-slate-100 dark:hover:bg-slate-800/70 rounded-lg mb-1"
                                        onClick={() => {
                                            navigate("/profile");
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        <span className="font-medium text-slate-800 dark:text-white">
                                            Profile
                                        </span>
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className="flex items-center justify-start py-2.5 px-3 hover:bg-slate-100 dark:hover:bg-slate-800/70 rounded-lg"
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <Settings className="h-4 w-4 mr-2" />
                                        <span className="font-medium text-slate-800 dark:text-white">
                                            Settings
                                        </span>
                                    </Button>

                                    <div className="mt-2 pt-2 border-t border-border/30">
                                        <Button
                                            variant="ghost"
                                            className="w-full flex items-center justify-end py-2.5 px-3 hover:bg-slate-100 dark:hover:bg-slate-800/70 rounded-lg"
                                            onClick={() => {
                                                // @ts-expect-error - Clerk is available globally
                                                window.Clerk?.signOut();
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            <span className="font-medium text-slate-800 dark:text-white">
                                                Sign out
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
