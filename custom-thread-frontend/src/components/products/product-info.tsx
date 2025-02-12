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
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="sticky top-8 space-y-6 max-w-md mx-auto">
      {/* Product Title and Price */}
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-white">UltraComfort Tee</h1>
        <p className="text-xl font-bold mt-1 text-black dark:text-white">$29.99</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Art. No. 0123456789</p>
      </div>

      {/* Size Selection */}
      <div>
        <h2 className="text-sm font-semibold mb-2 text-black dark:text-white">Select size</h2>
        <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex gap-3 flex-wrap">
          {sizes.map((size) => (
            <div key={size}>
              <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
              <Label
                htmlFor={`size-${size}`}
                className={`flex items-center justify-center w-16 h-16 border text-sm uppercase cursor-pointer transition-all
                  ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "border-gray-400 text-black hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                  }`}
              >
                {size}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {!selectedSize && <p className="text-red-500 text-sm mt-2">Please select a size</p>}
      </div>

      {/* Add to Cart and Wishlist Button */}
      <div className="flex flex-col gap-3">
        <Button
          size="lg"
          className="w-full bg-black text-white hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed border border-black dark:border-white"
          disabled={!selectedSize}
          onClick={() => selectedSize && onAddToCart(selectedSize)}
        >
          Add to bag
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className="w-full border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white"
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Heart className={`h-5 w-5 mr-2 ${isFavorited ? 'text-red-500 fill-red-500' : 'text-black dark:text-white'}`} /> Save to favorites
        </Button>
      </div>

      {/* Product Description */}
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>The UltraComfort Tee redefines comfort, one thread at a time. Made from 100% organic cotton, it's kind to your skin and the planet.</p>
        <p className="mt-3 font-semibold">Details</p>
        <p className="mt-1">100% organic cotton · Crew neck · Short sleeves · Regular fit</p>
      </div>
    </div>
  );
}
