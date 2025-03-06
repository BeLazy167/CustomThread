import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    Rocket,
    Palette,
    BadgePercent,
    Truck,
    Shield,
    Zap,
    ShoppingBag,
    ChevronRight,
    Star,
    TrendingUp,
} from "lucide-react";
import { AnimatedTestimonials } from "./ui/animated-testimonials";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function Home() {
    const navigate = useNavigate();
    const featuredProducts = [
        {
            id: "1",
            name: "Urban Minimalist",
            image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop",
            price: 24.99,
            tag: "Bestseller",
        },
        {
            id: "2",
            name: "Artistic Expression",
            image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2069&auto=format&fit=crop",
            price: 29.99,
            tag: "New",
        },
        {
            id: "3",
            name: "Vintage Vibes",
            image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=1974&auto=format&fit=crop",
            price: 22.99,
            tag: "Popular",
        },
    ];

    const testimonials = [
        {
            quote: "The quality of the custom designs and the quick turnaround time exceeded my expectations. Highly recommend!",
            name: "Sarah Chen",
            designation: "Fashion Designer",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop",
        },
        {
            quote: "CustomThreads has transformed how I create and sell my designs. The platform is incredibly user-friendly.",
            name: "Michael Rodriguez",
            designation: "Independent Artist",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
        },
        {
            quote: "The support team is amazing, and the quality of the prints is consistently excellent. A game-changer for my brand.",
            name: "Emily Watson",
            designation: "Brand Owner",
            image: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
        },
    ];

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const parallaxOffset = scrollY * 0.2;

    return (
        <div className="flex flex-col items-center justify-center">
            {/* Hero Section with Parallax Effect */}
            <section className="w-full relative h-[50vh] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=2127&auto=format&fit=crop')",
                        transform: `translateY(${parallaxOffset}px)`,
                        filter: "brightness(0.7)",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />

                <div className="relative container mx-auto flex flex-col items-center justify-center h-full text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <Badge className="mb-4 py-1 px-3">
                            Premium Custom Apparel
                        </Badge>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
                            Wear Your{" "}
                            <span className="bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
                                Imagination
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-200 mb-6 max-w-2xl mx-auto">
                            Transform your ideas into high-quality custom
                            t-shirts with our intuitive design tools
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                size="default"
                                className="gap-2 px-6 bg-primary hover:bg-primary/90"
                                onClick={() => navigate("/design")}
                            >
                                <Palette className="w-4 h-4" />
                                Start Designing
                                <ArrowRight className="w-3 h-3" />
                            </Button>
                            <Button
                                size="default"
                                variant="secondary"
                                className="gap-2 px-6"
                                onClick={() => navigate("/products")}
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Shop Collection
                            </Button>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
            </section>

            <div className="container mx-auto max-w-7xl space-y-20 py-16 px-4">
                {/* Featured Products Section */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl font-bold">
                                Featured Designs
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                Discover our most popular custom designs
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            className="mt-4 md:mt-0"
                            onClick={() => navigate("/products")}
                        >
                            View All <ChevronRight className="ml-1 w-4 h-4" />
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {featuredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                            >
                                <Card
                                    className="overflow-hidden group cursor-pointer"
                                    onClick={() =>
                                        navigate(`/product-info/${product.id}`)
                                    }
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <Badge
                                                variant="secondary"
                                                className="font-medium"
                                            >
                                                {product.tag}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-semibold text-lg">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="ml-1 text-sm">
                                                    4.9
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold">
                                                ${product.price}
                                            </p>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="p-0 h-auto"
                                            >
                                                <ShoppingBag className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Features Section */}
                <section className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl" />
                    <div className="relative py-16 px-8 rounded-3xl">
                        <div className="text-center mb-16">
                            <Badge variant="outline" className="mb-4">
                                Why Choose Us
                            </Badge>
                            <h2 className="text-4xl font-bold mb-4">
                                The CustomThreads Difference
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                We combine cutting-edge technology with premium
                                materials to deliver exceptional custom apparel
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="p-6 bg-background/80 backdrop-blur-sm border-none shadow-lg">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-secondary/10 rounded-full">
                                        <Rocket className="w-6 h-6 text-secondary" />
                                    </div>
                                    <h3 className="text-xl font-semibold">
                                        Fast Production
                                    </h3>
                                </div>
                                <p className="text-muted-foreground">
                                    Premium quality printing with 3-5 day
                                    worldwide shipping and real-time order
                                    tracking
                                </p>
                            </Card>
                            <Card className="p-6 bg-background/80 backdrop-blur-sm border-none shadow-lg">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-accent/10 rounded-full">
                                        <Shield className="w-6 h-6 text-accent" />
                                    </div>
                                    <h3 className="text-xl font-semibold">
                                        Quality Guaranteed
                                    </h3>
                                </div>
                                <p className="text-muted-foreground">
                                    100% satisfaction guarantee with every order
                                    and premium materials that last
                                </p>
                            </Card>
                            <Card className="p-6 bg-background/80 backdrop-blur-sm border-none shadow-lg">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-primary/10 rounded-full">
                                        <Zap className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold">
                                        Easy Design Tools
                                    </h3>
                                </div>
                                <p className="text-muted-foreground">
                                    Intuitive design interface for all skill
                                    levels with advanced customization options
                                </p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section>
                    <div className="text-center mb-16">
                        <Badge variant="outline" className="mb-4">
                            Simple Process
                        </Badge>
                        <h2 className="text-4xl font-bold mb-4">
                            How It Works
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Creating your custom apparel is easy with our
                            streamlined process
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-muted -translate-y-1/2 z-0" />

                        {[
                            {
                                step: "1",
                                title: "Design",
                                description:
                                    "Create your custom design using our intuitive tools",
                                icon: <Palette className="w-6 h-6" />,
                            },
                            {
                                step: "2",
                                title: "Order",
                                description:
                                    "Choose your size, quantity, and complete checkout",
                                icon: <ShoppingBag className="w-6 h-6" />,
                            },
                            {
                                step: "3",
                                title: "Receive",
                                description:
                                    "Get your high-quality custom apparel delivered",
                                icon: <Truck className="w-6 h-6" />,
                            },
                        ].map((item, index) => (
                            <div key={index} className="relative z-10">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
                                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                                            {item.icon}
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold">
                                            {item.step}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-muted-foreground text-center">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Testimonials Section */}
                <section>
                    <div className="text-center mb-12">
                        <Badge variant="outline" className="mb-4">
                            Testimonials
                        </Badge>
                        <h2 className="text-4xl font-bold mb-4">
                            What Our Users Say
                        </h2>
                        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                            Join thousands of satisfied customers who have
                            brought their creative visions to life
                        </p>
                    </div>
                    <AnimatedTestimonials
                        testimonials={testimonials}
                        autoplay
                    />
                </section>

                {/* Stats Section */}
                <section className="py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: "10K+", label: "Happy Customers" },
                            { value: "5K+", label: "Unique Designs" },
                            { value: "98%", label: "Satisfaction Rate" },
                            { value: "24/7", label: "Customer Support" },
                        ].map((stat, index) => (
                            <div key={index} className="p-6">
                                <p className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    {stat.value}
                                </p>
                                <p className="text-muted-foreground">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section>
                    <Card className="p-12 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-none shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                        <div className="relative flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1">
                                <Badge variant="secondary" className="mb-4">
                                    Limited Time Offer
                                </Badge>
                                <h2 className="text-3xl font-bold mb-4">
                                    Start Creating Today
                                </h2>
                                <p className="text-muted-foreground mb-6 text-lg">
                                    Join thousands of creators and bring your
                                    designs to life with premium quality custom
                                    apparel
                                </p>
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3">
                                        <BadgePercent className="w-5 h-5 text-secondary" />
                                        <span>
                                            15% off your first order with code{" "}
                                            <span className="font-semibold">
                                                WELCOME15
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-5 h-5 text-accent" />
                                        <span>
                                            Free shipping on orders over $50
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                        <span>
                                            10% designer commission on every
                                            sale
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    size="lg"
                                    className="gap-2 text-lg px-8"
                                    onClick={() => navigate("/design")}
                                >
                                    Start Creating
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex-shrink-0 text-center bg-background/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
                                <div className="mb-4">
                                    <div className="text-sm text-muted-foreground mb-1">
                                        Starting at
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <span className="text-4xl font-bold">
                                            $19.99
                                        </span>
                                        <span className="text-muted-foreground ml-2 text-sm">
                                            per shirt
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        Volume discounts available
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate("/products")}
                                >
                                    View Pricing
                                </Button>
                            </div>
                        </div>
                    </Card>
                </section>
            </div>
        </div>
    );
}
