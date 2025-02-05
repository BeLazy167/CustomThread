import {
    UserButton,
    SignInButton,
    SignUpButton,
    useUser,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "./theme-provider";

export default function Nav() {
    const { isSignedIn } = useUser();
    const { theme, setTheme } = useTheme();

    return (
        <div className=" top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto">
                <nav className="w-full max-w-5xl mx-auto flex h-16 items-center justify-between ">
                    <div className="flex-shrink-0">
                        <a
                            href="/"
                            className="text-xl font-bold bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent"
                        >
                            CustomThreads
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                        >
                            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
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
                            <div className="flex items-center gap-3">
                                <SignInButton mode="modal">
                                    <Button variant="ghost">Sign in</Button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <Button>Sign up</Button>
                                </SignUpButton>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </div>
    );
}
