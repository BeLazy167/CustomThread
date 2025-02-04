import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    Rocket,
    Palette,
    Sparkles,
    BadgePercent,
    Truck,
    Shield,
    Zap,
} from "lucide-react";
import { AnimatedTestimonials } from "./ui/animated-testimonials";

export function Home() {
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

    return (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-5xl space-y-24 py-12">
                {/* Hero Section */}
                <section>
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-secondary/20 via-accent/10 to-primary/5 py-24">
                        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
                        <div className="relative max-w-3xl mx-auto px-4 text-center">
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
                                CustomThreads
                            </h1>
                            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12">
                                Transform Your Ideas into Wearable Art
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" className="gap-2 text-lg">
                                    <Palette className="w-5 h-5" />
                                    Start Designing
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="gap-2 text-lg"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Explore Designs
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-6 bg-background/60 backdrop-blur-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-2 bg-secondary/10 rounded-full">
                                    <Rocket className="w-6 h-6 text-secondary" />
                                </div>
                                <h3 className="text-xl font-semibold">
                                    Fast Production
                                </h3>
                            </div>
                            <p className="text-muted-foreground">
                                Premium quality printing with 3-5 day worldwide
                                shipping
                            </p>
                        </Card>
                        <Card className="p-6 bg-background/60 backdrop-blur-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-2 bg-accent/10 rounded-full">
                                    <Shield className="w-6 h-6 text-accent" />
                                </div>
                                <h3 className="text-xl font-semibold">
                                    Quality Guaranteed
                                </h3>
                            </div>
                            <p className="text-muted-foreground">
                                100% satisfaction guarantee with every order
                            </p>
                        </Card>
                        <Card className="p-6 bg-background/60 backdrop-blur-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">
                                    Easy Design Tools
                                </h3>
                            </div>
                            <p className="text-muted-foreground">
                                Intuitive design interface for all skill levels
                            </p>
                        </Card>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">
                            What Our Users Say
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Hear from our community of designers and creators
                        </p>
                    </div>
                    <AnimatedTestimonials
                        testimonials={testimonials}
                        autoplay
                    />
                </section>

                {/* CTA Section */}
                <section>
                    <Card className="p-8 bg-gradient-to-br from-secondary/10 via-accent/5 to-primary/10">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-4">
                                    Ready to Start?
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <BadgePercent className="w-5 h-5 text-secondary" />
                                        <span>10% designer commission</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-5 h-5 text-accent" />
                                        <span>
                                            Free shipping on orders over $50
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink-0 text-center">
                                <div className="mb-4">
                                    <span className="text-4xl font-bold">
                                        $19.99
                                    </span>
                                    <span className="text-muted-foreground ml-2">
                                        base price
                                    </span>
                                </div>
                                <Button className="w-full sm:w-auto" size="lg">
                                    Start Creating
                                </Button>
                            </div>
                        </div>
                    </Card>
                </section>
            </div>
        </div>
    );
}
