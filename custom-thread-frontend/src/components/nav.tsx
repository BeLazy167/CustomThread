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
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            <SunIcon className="absolute h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
            <MoonIcon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
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
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="h-9 w-9 rounded-full border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
                >
                    <ArrowLeft className="h-[18px] w-[18px]" />
                    <span className="sr-only">Go back</span>
                </Button>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-lg shadow-sm">
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
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                    >
                        <ThemeToggle />
                        <CartDropdown />
                        {isSignedIn ? (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="relative hidden sm:flex h-9 w-9 rounded-full border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                    <Bell className="h-[18px] w-[18px]" />
                                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center">
                                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                    </span>
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-2 rounded-full border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors pl-1 pr-3 py-1.5"
                                        >
                                            <Avatar className="h-7 w-7 border border-border shadow-sm">
                                                <AvatarImage
                                                    src={user?.imageUrl}
                                                    alt={
                                                        user?.fullName || "User"
                                                    }
                                                />
                                                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                                                    {user?.fullName
                                                        ?.split(" ")
                                                        .map((n) => n[0])
                                                        .join("") || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="hidden sm:inline text-foreground text-sm font-medium">
                                                {user?.username ||
                                                    user?.fullName ||
                                                    "User"}
                                            </span>
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-56 bg-card/95 backdrop-blur-md border-border shadow-lg rounded-xl"
                                    >
                                        <div className="flex items-center justify-start p-3">
                                            <div className="flex flex-col space-y-1 leading-none">
                                                <p className="font-medium text-foreground">
                                                    {user?.username ||
                                                        user?.fullName ||
                                                        "User"}
                                                </p>
                                                <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                    {user?.primaryEmailAddress
                                                        ?.emailAddress || ""}
                                                </p>
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator className="border-border" />
                                        <DropdownMenuItem
                                            onClick={() => navigate("/profile")}
                                            className="cursor-pointer flex items-center gap-2 p-2.5 text-foreground hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        {(user?.publicMetadata?.role ===
                                            "admin" ||
                                            user?.username === "belazy167") && (
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    navigate("/reports/sales")
                                                }
                                                className="cursor-pointer flex items-center gap-2 p-2.5 text-foreground hover:bg-accent hover:text-accent-foreground"
                                            >
                                                <svg
                                                    className="mr-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M3 3v18h18"></path>
                                                    <path d="M18 9l-6-6-6 6"></path>
                                                    <path d="M6 9v4"></path>
                                                    <path d="M12 3v10"></path>
                                                    <path d="M18 9v9"></path>
                                                </svg>
                                                <span>Reports</span>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2 p-2.5 text-foreground hover:bg-accent hover:text-accent-foreground">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="border-border" />
                                        <DropdownMenuItem
                                            onClick={() => {
                                                // @ts-expect-error - Clerk is available globally
                                                window.Clerk?.signOut();
                                            }}
                                            className="cursor-pointer flex items-center justify-end gap-2 p-2.5 text-foreground hover:bg-accent hover:text-accent-foreground"
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
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className="relative h-9 w-9 rounded-full border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
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
                                            <X className="h-[18px] w-[18px]" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ opacity: 0, rotate: 90 }}
                                            animate={{ opacity: 1, rotate: 0 }}
                                            exit={{ opacity: 0, rotate: -90 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Menu className="h-[18px] w-[18px]" />
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
                        className="md:hidden border-t border-border bg-background/98 backdrop-blur-md shadow-md"
                    >
                        <div className="container mx-auto px-4 max-w-7xl py-2">
                            {!isSignedIn && (
                                <div className="flex flex-col gap-2 py-2">
                                    <AuthButtons />
                                </div>
                            )}
                            {isSignedIn && (
                                <div className="flex flex-col py-2">
                                    <div className="px-2 py-3 border-b border-border mb-2 flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
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
                                            <p className="font-medium text-foreground">
                                                {user?.username ||
                                                    user?.fullName ||
                                                    "User"}
                                            </p>
                                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                {user?.primaryEmailAddress
                                                    ?.emailAddress || ""}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        className="flex items-center justify-start py-2.5 px-3 hover:bg-accent hover:text-accent-foreground rounded-lg mb-1"
                                        onClick={() => {
                                            navigate("/profile");
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        <span className="font-medium text-foreground">
                                            Profile
                                        </span>
                                    </Button>

                                    {(user?.publicMetadata?.role === "admin" ||
                                        user?.username === "belazy167") && (
                                        <Button
                                            variant="ghost"
                                            className="flex items-center justify-start py-2.5 px-3 hover:bg-accent hover:text-accent-foreground rounded-lg mb-1"
                                            onClick={() => {
                                                navigate("/reports/sales");
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <svg
                                                className="h-4 w-4 mr-2"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M3 3v18h18"></path>
                                                <path d="M18 9l-6-6-6 6"></path>
                                                <path d="M6 9v4"></path>
                                                <path d="M12 3v10"></path>
                                                <path d="M18 9v9"></path>
                                            </svg>
                                            <span className="font-medium text-foreground">
                                                Reports
                                            </span>
                                        </Button>
                                    )}

                                    <Button
                                        variant="ghost"
                                        className="flex items-center justify-start py-2.5 px-3 hover:bg-accent hover:text-accent-foreground rounded-lg"
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <Settings className="h-4 w-4 mr-2" />
                                        <span className="font-medium text-foreground">
                                            Settings
                                        </span>
                                    </Button>

                                    <div className="mt-2 pt-2 border-t border-border">
                                        <Button
                                            variant="ghost"
                                            className="w-full flex items-center justify-end py-2.5 px-3 hover:bg-accent hover:text-accent-foreground rounded-lg"
                                            onClick={() => {
                                                // @ts-expect-error - Clerk is available globally
                                                window.Clerk?.signOut();
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            <span className="font-medium text-foreground">
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
