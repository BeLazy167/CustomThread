import { Html, useProgress } from "@react-three/drei";

export function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center">
                <div className="w-32 h-32 border-4 border-primary rounded-full animate-spin border-t-transparent" />
                <p className="mt-4 text-sm text-muted-foreground">
                    {progress.toFixed(0)}% loaded
                </p>
            </div>
        </Html>
    );
}
