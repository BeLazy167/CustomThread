import { useState } from "react";
import DesignGrid from "@/components/design/design-grid";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

// Mock data - replace with actual API call
const mockDesigns = [
    {
        id: "1",
        name: "Urban Street Art",
        price: 39.99,
        image: "/designs/urban-street.jpg",
        designer: "StreetArtist92",
        likes: 156,
        isLiked: false,
    },
    {
        id: "2",
        name: "Minimalist Logo",
        price: 29.99,
        image: "/designs/minimalist-logo.jpg",
        designer: "MinimalDesigner",
        likes: 89,
        isLiked: true,
    },
    // Add more mock designs...
];

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("popular");
    const [priceRange, setPriceRange] = useState("all");
    const [designs, setDesigns] = useState(mockDesigns);

    const handleLikeDesign = (designId: string) => {
        setDesigns((prevDesigns) =>
            prevDesigns.map((design) =>
                design.id === designId
                    ? {
                          ...design,
                          isLiked: !design.isLiked,
                          likes: design.isLiked
                              ? design.likes - 1
                              : design.likes + 1,
                      }
                    : design
            )
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Explore Designs
                </h1>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search designs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Filter & Sort</SheetTitle>
                            </SheetHeader>
                            <div className="space-y-4 mt-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Sort by
                                    </label>
                                    <Select
                                        value={sortBy}
                                        onValueChange={setSortBy}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sort by..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="popular">
                                                Most Popular
                                            </SelectItem>
                                            <SelectItem value="recent">
                                                Most Recent
                                            </SelectItem>
                                            <SelectItem value="price-low">
                                                Price: Low to High
                                            </SelectItem>
                                            <SelectItem value="price-high">
                                                Price: High to Low
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Price Range
                                    </label>
                                    <Select
                                        value={priceRange}
                                        onValueChange={setPriceRange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Price range..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
                                            <SelectItem value="under-20">
                                                Under $20
                                            </SelectItem>
                                            <SelectItem value="20-50">
                                                $20 - $50
                                            </SelectItem>
                                            <SelectItem value="over-50">
                                                Over $50
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <DesignGrid designs={designs} onLikeDesign={handleLikeDesign} />
        </div>
    );
}
