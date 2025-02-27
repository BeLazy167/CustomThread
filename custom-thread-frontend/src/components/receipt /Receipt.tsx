import { useState } from "react"
import { CreditCard, MapPin, Clock, Home } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Confetti from "@/components/receipt /Confetti"
import TypingEffect from "@/components/receipt /Typingeffect"


export default function Receipt() {
    const [showConfetti, setShowConfetti] = useState(false)
    const [confettiKey, setConfettiKey] = useState(0) // Unique key for Confetti

    const handleBackToHome = () => {
        setShowConfetti(false) // Hide confetti
        setTimeout(() => {
            setShowConfetti(true)
            setConfettiKey(prevKey => prevKey + 1) // Force remount by changing key
        }, 100) // Small delay to reset state
        console.log("Navigating to homepage...")
    }

    return (
        <div className="w-full flex items-center justify-center bg-transparent p-4">
            <Card className="max-w-screen-xl shadow-lg border border-gray-300">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold font-mono text-center">RECEIPT</CardTitle>
                    <CardDescription className="text-sm text-center" id="order-id">
                        <TypingEffect text="Order ID: #12345" />
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 font-mono">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <CreditCard className="mr-2" size={16} />
                            <span>Payment Method:</span>
                        </div>
                        <span>Credit Card</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Clock className="mr-2" size={16} />
                            <span>Date:</span>
                        </div>
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <MapPin className="mr-2" size={16} />
                            <span>Location:</span>
                        </div>
                        <span>123 Main St, City</span>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Item 1</span>
                            <span>$10.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Item 2</span>
                            <span>$15.00</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>$25.00</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleBackToHome} className="w-full">
                        <Home className="mr-2" size={16} />
                        Back to Homepage
                    </Button>
                </CardFooter>
            </Card>
            {showConfetti && <Confetti key={confettiKey} />}
        </div>
    )
}