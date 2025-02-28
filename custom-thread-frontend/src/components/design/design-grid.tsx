import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Design {
    id: string;
    name: string;
    price: number;
    image: string;
    designer: string;
    likes: number;
    isLiked?: boolean;
}

interface DesignGridProps {
    designs: Design[];
    onLikeDesign?: (designId: string) => void;
}

export default function DesignGrid({ designs, onLikeDesign }: DesignGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {designs.map((design) => (
                <div
                    key={design.id}
                    className="group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                    <Link to={`/designs/${design.id}`}>
                        <div className="aspect-square overflow-hidden">
                            <img
                                src={design.image}
                                alt={design.name}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </Link>
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                    {design.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    by {design.designer}
                                </p>
                            </div>
                            <p className="text-sm font-semibold">
                                ${design.price.toFixed(2)}
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                onClick={() =>
                                    onLikeDesign && onLikeDesign(design.id)
                                }
                            >
                                <Heart
                                    className={`h-4 w-4 mr-1 ${
                                        design.isLiked
                                            ? "fill-red-500 text-red-500"
                                            : ""
                                    }`}
                                />
                                <span className="text-xs">{design.likes}</span>
                            </Button>
                            <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                Custom Design
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
