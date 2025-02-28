import { Dialog, DialogContent } from "@/components/ui/dialog";
import tShirt from "@/assets/tShirt.webp"; // Importing the T-shirt image
import { useState } from "react";

interface ZoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    decalSrc?: string;
}

export function ZoomModal({
    isOpen,
    onClose,
    imageSrc,
    decalSrc,
}: ZoomModalProps) {
    const [activeImage, setActiveImage] = useState<string>(imageSrc);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] sm:max-w-[90vw] max-h-[90vh] p-2 sm:p-4 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-full h-full">
                    <img
                        src={activeImage || tShirt}
                        alt="Zoomed product view"
                        className="max-w-full max-h-[60vh] sm:max-h-[70vh] w-auto h-auto object-contain"
                        onError={(e) => {
                            e.currentTarget.src = tShirt;
                            e.currentTarget.onerror = null;
                        }}
                    />
                </div>

                {decalSrc && (
                    <div className="flex gap-2 sm:gap-4 mt-2 sm:mt-4">
                        <div
                            className={`border-2 rounded-md p-1 cursor-pointer ${
                                activeImage === imageSrc
                                    ? "border-primary"
                                    : "border-gray-300"
                            }`}
                            onClick={() => setActiveImage(imageSrc)}
                        >
                            <img
                                src={imageSrc || tShirt}
                                alt="Main view"
                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = tShirt;
                                    e.currentTarget.onerror = null;
                                }}
                            />
                        </div>
                        <div
                            className={`border-2 rounded-md p-1 cursor-pointer ${
                                activeImage === decalSrc
                                    ? "border-primary"
                                    : "border-gray-300"
                            }`}
                            onClick={() => setActiveImage(decalSrc)}
                        >
                            <img
                                src={decalSrc}
                                alt="Decal view"
                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = tShirt;
                                    e.currentTarget.onerror = null;
                                }}
                            />
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
