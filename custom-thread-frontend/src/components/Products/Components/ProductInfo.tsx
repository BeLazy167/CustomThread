import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";

interface ProductInfoProps {
  onAddToCart: (size: string) => void;
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductInfo({ onAddToCart }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState("M");

  return (
    <div className="sticky top-8 space-y-6">
      <div>
        <h1 className="text-3xl font-normal mb-2 text-black dark:text-white">UltraComfort Tee</h1>
        <p className="text-2xl font-semibold text-black dark:text-white">$29.99</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Art. No. 0123456789</p>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-2 text-black dark:text-white">Size</h2>
        <RadioGroup
          value={selectedSize}
          onValueChange={setSelectedSize}
          className="flex flex-wrap gap-2 justify-center items-center"
        >
          {sizes.map((size) => (
            <div key={size}>
              <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
              <Label
                htmlFor={`size-${size}`}
                className={`flex items-center justify-center w-12 h-12 border cursor-pointer transition-colors
                  ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "border-gray-300 text-black hover:bg-gray-200 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                  }`}
              >
                {size}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {!selectedSize && <p className="text-red-500 text-sm mt-2">Please select a size</p>}
      </div>

      <div className="flex gap-4">
        <Button
          size="lg"
          className="flex-grow bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!selectedSize}
          onClick={() => selectedSize && onAddToCart(selectedSize)}
        >
          {selectedSize ? "Add" : "Select a Size"}
        </Button>
        <Button size="lg" variant="outline" className="aspect-square p-0">
          <Heart className="h-6 w-6 text-black dark:text-white" />
        </Button>
      </div>

      <div className="text-sm space-y-4 text-black dark:text-white">
        <p>
          The UltraComfort Tee redefines comfort, one thread at a time. Made from 100% organic cotton, it's kind to your
          skin and the planet.
        </p>
        <ul className="list-disc list-inside">
          <li className="text-black dark:text-white">100% organic cotton</li>
          <li className="text-black dark:text-white">Crew neck</li>
          <li className="text-black dark:text-white">Short sleeves</li>
          <li className="text-black dark:text-white">Regular fit</li>
        </ul>
      </div>
    </div>
  );
}
