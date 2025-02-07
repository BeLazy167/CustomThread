import { Dialog, DialogContent } from "@/components/ui/dialog";
import tShirt from "../../../assets/tShirt.webp"; // Importing the T-shirt image

interface ZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
}

export function ZoomModal({ isOpen, onClose, imageSrc }: ZoomModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 flex items-center justify-center">
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={imageSrc || tShirt} // Use imported image
            alt="Zoomed product view"
            className="max-w-[500px] max-h-[500px] w-auto h-auto object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
