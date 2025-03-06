// after Stripe is successfulllll

"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const deliveryStages = [
    { id: 1, label: "Order Placed", icon: Package },
    { id: 2, label: "Shipped", icon: Truck },
    { id: 3, label: "Out for Delivery", icon: Truck },
    { id: 4, label: "Delivered", icon: CheckCircle },
];

export default function LivePackageJourney() {
    const [currentStage, setCurrentStage] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentStage < deliveryStages.length - 1) {
                setCurrentStage((prev) => prev + 1);
                setProgress((prev) => prev + 33.33); // Update progress
            } else {
                clearInterval(interval);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [currentStage]);

    return (
        <div className="container mx-auto px-4 max-w-7xl mt-10">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-center">
                        Live Package Journey 📦
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full h-10 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                        {/* Progress Bar */}
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-green-500"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1 }}
                        />
                    </div>

                    {/* Delivery Stages */}
                    <div className="flex justify-between mt-6 px-12 w-full max-w-7xl mx-auto">
                        {deliveryStages.map((stage, index) => {
                            const Icon = stage.icon;
                            return (
                                <div
                                    key={stage.id}
                                    className="flex flex-col items-center space-y-2 mx-6"
                                >
                                    <Icon
                                        className={`h-10 w-10 ${
                                            index <= currentStage
                                                ? "text-green-500"
                                                : "text-gray-400 dark:text-gray-500"
                                        }`}
                                    />
                                    <p
                                        className={`text-base font-medium mt-2 ${
                                            index <= currentStage
                                                ? "text-black dark:text-white"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {stage.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Restart Animation Button */}
                    <Button
                        onClick={() => {
                            setCurrentStage(0);
                            setProgress(0);
                        }}
                        className="w-full mt-6 bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-300"
                    >
                        Restart Journey
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
