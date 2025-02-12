import React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import tShirt from "../../assets/tShirt.webp"

const products = [
    {
    id: "5128",
    name: "Hoodie",
    price: "$65.00",
    image: tShirt,
    category: "Hoodies",
    description: "Premium quality hoodie with striking venom design.",
    },
    {
    id: "8049",
    name: "Black Tee",
    price: "$42.00",
    image: tShirt,
    category: "T-shirts",
    soldOut: true,
    description: "Stylish twofer with unique tree camo pattern.",
    },
    {
    id: "5125",
    name: "The Dawn Collection - Hoodies",
    price: "$55.00",
    image: tShirt,
    category: "Hoodies",
    description: "Part of the Dawn Collection featuring skull artwork.",
    },
    {
    id: "2117",
    name: "The Dawn Collection - T-shirts",
    price: "$55.00",
    image: tShirt,
    category: "T-shirts",
    description: "Premium sweatpants from the Dawn Collection.",
    },
]

const ProductsPage: React.FC = () => {
    const navigate = useNavigate()

    const handleProductClick = (product: typeof products[0]) => {
    navigate(`/product-info/${product.id}`)
    }

return (
    <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
            <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="group cursor-pointer"
                onClick={() => handleProductClick(product)}
            >
                <div className="relative">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    {product.soldOut && (
                    <div className="absolute top-2 left-2 bg-white text-black px-2 py-1 text-xs font-medium rounded">
                        SOLD OUT
                    </div>
                )}
                </div>
                <div className="mt-4 space-y-2">
                    <h2 className="text-sm font-medium text-gray-900 dark:text-white">
                    {product.id} - {product.name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-300">{product.price}</p>
                </div>
                </div>
            </motion.div>
        ))}
        </div>
    </div>
    </div>
)
}

export default ProductsPage
