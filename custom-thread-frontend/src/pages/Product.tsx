"use client"

import { useState } from "react";
import ProductInfo from "../components/Products/Components/ProductInfo";
import { ZoomModal } from "../components/Products/Components/ZoomModal";
import tShirt from "../assets/tShirt.webp";

export default function Product() {
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const imageSrc = tShirt

  const handleAddToCart = (size: string) => {
    console.log(`Added to cart: UltraComfort Tee, Size: ${size}`)
    // Here you would typically update your cart state or send a request to your backend
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <img src={tShirt} />
          <ProductInfo onAddToCart={handleAddToCart} />
        </div>
      </div>
      <ZoomModal isOpen={isZoomOpen} onClose={() => setIsZoomOpen(false)} imageSrc={imageSrc} />
    </div>
  )
}

