import { useEffect, Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Center, PresentationControls } from "@react-three/drei";
import { state, cycleClothingType } from "./store";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { Upload, Send, Info } from "lucide-react";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { changeLogoDecal } from "@/hooks/use-upload-image";
import { useToast } from "@/hooks/use-toast";
import { useMobileDetect } from "@/hooks/use-mobile-detect";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { useStore } from "@/store";
import { useSubmitDesign } from "@/mutations/use-submit-design";

// Import our new components
import { Backdrop } from "./components/Backdrop";
import { CameraRig } from "./components/CameraRig";
import { ShirtModel } from "./components/ShirtModel";
import { DockItem } from "./components/DockItem";
import { Loader } from "./components/Loader";
import { DesignDetailsModal } from "./components/DesignDetailsModal";

interface AppProps {
    position?: [number, number, number];
    fov?: number;
}

const DesignerCanvas: React.FC<AppProps> = ({
    position = [0, 0, 2.5],
    fov = 25,
}) => {
    const { toast } = useToast();
    const isMobile = useMobileDetect();
    const navigate = useNavigate();
    const mouseX = useMotionValue(Infinity);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const { details, saveDetails } = useStore();
    const submitDesignMutation = useSubmitDesign();

    useEffect(() => {
        if (isMobile) {
            toast({
                title: "Desktop Recommended",
                description:
                    "Please use a desktop browser for the best experience.",
                variant: "default",
                action: (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/")}
                    >
                        Go Home
                    </Button>
                ),
            });
        }
    }, [isMobile, navigate, toast]);

    const handleFileUpload = useMemo(
        () => (event: Event) => {
            const input = event.target as HTMLInputElement;
            const file = input.files?.[0];
            if (!file) return;

            // Check if file is an image
            if (!file.type.startsWith("image/")) {
                toast({
                    title: "Error",
                    description: "Please upload an image file",
                    variant: "destructive",
                });
                return;
            }

            // Check file size (e.g., 5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Error",
                    description: "File size should be less than 5MB",
                    variant: "destructive",
                });
                return;
            }

            changeLogoDecal(file);
        },
        [toast]
    );

    const handleSaveDetails = () => {
        saveDetails();
        toast({
            title: "Details Saved",
            description: "Your design details have been saved successfully.",
        });
    };

    const handleSubmitDesign = async () => {
        try {
            // Capture the canvas as a base64 image
            const canvas = document.querySelector("canvas");
            if (!canvas) throw new Error("Canvas not found");

            const imageData = canvas.toDataURL("image/png");
            await submitDesignMutation.mutateAsync(imageData);
        } catch (error) {
            console.error("Failed to submit design:", error);
        }
    };

    if (isMobile) {
        return (
            <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    Desktop Version Required
                </h1>
                <p className="text-muted-foreground mb-8">
                    Our 3D designer requires a desktop browser for the best
                    experience. Please switch to a desktop device to continue.
                </p>
                <Button onClick={() => navigate("/")}>Return to Home</Button>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
            >
                <Canvas
                    shadows
                    camera={{ position, fov }}
                    gl={{
                        preserveDrawingBuffer: true,
                        antialias: true,
                        powerPreference: "high-performance",
                        alpha: false,
                    }}
                    eventPrefix="client"
                    className="w-full h-full"
                    style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
                >
                    <Suspense fallback={<Loader />}>
                        <ambientLight intensity={0.5 * Math.PI} />
                        <PresentationControls
                            global
                            config={{ mass: 2, tension: 500 }}
                            snap={{ mass: 4, tension: 1500 }}
                            rotation={[0, 0.3, 0]}
                            polar={[-Math.PI / 3, Math.PI / 3]}
                            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
                        >
                            <Environment preset="city" />
                            <Backdrop />
                            <CameraRig>
                                <Center>
                                    <ShirtModel />
                                </Center>
                            </CameraRig>
                        </PresentationControls>
                    </Suspense>
                </Canvas>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute bottom-16 left-0 right-0 flex justify-center px-4"
                >
                    <motion.div
                        onMouseMove={(e) => mouseX.set(e.pageX)}
                        onMouseLeave={() => mouseX.set(Infinity)}
                        className={cn(
                            "flex items-center gap-4 p-4 rounded-2xl",
                            "bg-background/80 dark:bg-background/50 backdrop-blur-md border border-border shadow-lg"
                        )}
                    >
                        {[
                            {
                                title: "Color",
                                icon: (
                                    <ColorPicker
                                        value={`#${state.color.getHexString()}`}
                                        onChange={(color) => {
                                            state.color = new THREE.Color(
                                                color
                                            );
                                        }}
                                        className="w-full h-full"
                                    />
                                ),
                            },
                            {
                                title: "Upload Logo",
                                icon: <Upload className="w-full h-full" />,
                                onClick: () => {
                                    const input =
                                        document.createElement("input");
                                    input.type = "file";
                                    input.accept = "image/*";
                                    input.addEventListener(
                                        "change",
                                        handleFileUpload
                                    );
                                    input.click();
                                },
                            },
                            // {
                            //     title: `Switch to ${
                            //         state.clothingType === "t-shirt"
                            //             ? "Hoodie"
                            //             : "T-Shirt"
                            //     }`,
                            //     icon: (
                            //         <div
                            //             className={cn(
                            //                 "w-full h-full transition-transform duration-300",
                            //                 {
                            //                     "rotate-0":
                            //                         state.clothingType ===
                            //                         "t-shirt",
                            //                     "rotate-90":
                            //                         state.clothingType ===
                            //                         "hoodie",
                            //                 }
                            //             )}
                            //         >
                            //             <ShirtIcon className="w-full h-full" />
                            //         </div>
                            //     ),
                            //     onClick: cycleClothingType,
                            // },
                            {
                                title: "Details",
                                icon: <Info className="w-full h-full" />,
                                onClick: () => setDetailsOpen(true),
                            },
                            {
                                title: "Submit",
                                icon: <Send className="w-full h-full" />,
                                onClick: handleSubmitDesign,
                                disabled:
                                    submitDesignMutation.isPending ||
                                    !details.title,
                            },
                        ].map((item) => (
                            <DockItem
                                key={item.title}
                                mouseX={mouseX}
                                {...item}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
            <DesignDetailsModal
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                onSave={handleSaveDetails}
            />
        </AnimatePresence>
    );
};

export default DesignerCanvas;
