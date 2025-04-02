// Global type declarations
declare global {
    interface Window {
        Clerk?: {
            session?: {
                getToken: () => Promise<string | null>;
            };
            signOut?: () => Promise<void>;
        };
    }
}

export {};
