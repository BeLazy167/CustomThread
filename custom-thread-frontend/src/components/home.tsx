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

export function Home() {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <section className="text-center mb-24 relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary/20 via-accent/10 to-primary/5 py-24">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
                <div className="max-w-3xl mx-auto px-4">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
                        CustomThreads
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground mb-12">
                        Transform Your Ideas into Wearable Art
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="gap-2 text-lg px-8 py-6">
                            <Palette className="w-5 h-5" />
                            Start Designing
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="gap-2 text-lg px-8 py-6"
                        >
                            <Sparkles className="w-5 h-5" />
                            Explore Designs
                        </Button>
                    </div>
                </div>
            </section>

            {/* Value Propositions */}
            <section className="mb-24">
                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="p-8 group hover:border-secondary/50 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors">
                                <Rocket className="w-7 h-7 text-secondary" />
                            </div>
                            <h3 className="text-2xl font-semibold">
                                Fast Production
                            </h3>
                        </div>
                        <p className="text-muted-foreground text-lg">
                            Premium quality printing with 3-5 day worldwide
                            shipping
                        </p>
                    </Card>
                    <Card className="p-8 group hover:border-accent/50 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-accent/10 rounded-full group-hover:bg-accent/20 transition-colors">
                                <Shield className="w-7 h-7 text-accent" />
                            </div>
                            <h3 className="text-2xl font-semibold">
                                Quality Guaranteed
                            </h3>
                        </div>
                        <p className="text-muted-foreground text-lg">
                            100% satisfaction guarantee with every order
                        </p>
                    </Card>
                    <Card className="p-8 group hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                <Zap className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-2xl font-semibold">
                                Easy Design Tools
                            </h3>
                        </div>
                        <p className="text-muted-foreground text-lg">
                            Intuitive design interface for all skill levels
                        </p>
                    </Card>
                </div>
            </section>

            {/* How It Works */}
            <section className="mb-24">
                <h2 className="text-3xl font-bold text-center mb-12">
                    How It Works
                </h2>
                <div className="max-w-5xl mx-auto relative">
                    <div className="absolute left-16 right-16 top-1/2 h-0.5 bg-gradient-to-r from-secondary via-accent to-primary -z-10" />
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                step: "Design",
                                desc: "Create your unique design",
                            },
                            { step: "Preview", desc: "See it come to life" },
                            { step: "Sell", desc: "Share with the world" },
                            { step: "Deliver", desc: "We handle the rest" },
                        ].map((item, index) => (
                            <div key={item.step} className="text-center">
                                <div className="w-16 h-16 mb-6 mx-auto bg-background border-2 border-primary rounded-full flex items-center justify-center text-primary font-bold text-xl shadow-lg">
                                    {index + 1}
                                </div>
                                <h3 className="font-semibold text-xl mb-2">
                                    {item.step}
                                </h3>
                                <p className="text-muted-foreground">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Model */}
            <section className="mb-16">
                <Card className="p-12 bg-gradient-to-br from-secondary/10 via-accent/5 to-primary/10 border-0 shadow-xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                Transparent Pricing
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-secondary/10 rounded-full">
                                        <BadgePercent className="w-6 h-6 text-secondary" />
                                    </div>
                                    <span className="text-lg">
                                        10% designer commission
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-accent/10 rounded-full">
                                        <Truck className="w-6 h-6 text-accent" />
                                    </div>
                                    <span className="text-lg">
                                        Free shipping on orders over $50
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-background rounded-xl p-8 shadow-lg border border-border/50">
                            <div className="flex gap-4 items-baseline mb-2">
                                <span className="text-5xl font-bold">
                                    $19.99
                                </span>
                                <span className="text-muted-foreground text-lg">
                                    base price
                                </span>
                            </div>
                            <p className="text-muted-foreground mb-6">
                                Starting price for basic t-shirts
                            </p>
                            <Button className="w-full py-6 text-lg">
                                See Pricing Details
                            </Button>
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    );
}
