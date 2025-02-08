import {
    UserButton,
    SignInButton,
    SignUpButton,
    useUser,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, ArrowLeft } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useLocation, useNavigate } from "react-router-dom";

// Extracted ThemeToggle component for better organization
const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    );
};

// Extracted AuthButtons component
const AuthButtons = () => (
    <div className="flex items-center gap-3">
        <SignInButton mode="modal">
            <Button variant="ghost">Sign in</Button>
        </SignInButton>
        <SignUpButton mode="modal">
            <Button>Sign up</Button>
        </SignUpButton>
    </div>
);

export default function Nav() {
    const { isSignedIn } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    const isDesignPage = location.pathname.includes("/design");

    if (isDesignPage) {
        return (
            <header className="fixed top-0 left-0 z-50 p-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                >
                    <ArrowLeft className="h-6 w-6" />
                    <span className="sr-only">Go back</span>
                </Button>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200/30 bg-transparent dark:border-neutral-800/30">
            <div className="max-w-[1920px] px-4 mx-auto">
                <nav className="flex h-16 items-center justify-between">
                    <a
                        href="/"
                        className="text-xl font-bold bg-gradient-to-r from-purple-600 via-primary to-teal-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-primary dark:to-teal-400"
                    >
                        CustomThreads
                    </a>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        {isSignedIn ? (
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10",
                                    },
                                }}
                            />
                        ) : (
                            <AuthButtons />
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
