import type React from "react"
import { useEffect, useState } from "react"

const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#CDDC39",
    "#FFEB3B",
    "#FFC107",
    "#FF9800",
    "#FF5722",
]

const Confetti: React.FC = () => {
    const [pieces, setPieces] = useState<React.ReactNode[]>([])
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        setVisible(true) // Reset visibility on re-mount
        const newPieces = Array.from({ length: 100 }, (_, i) => (
            <div
                key={i}
                className="confetti-piece absolute w-2 h-2 opacity-80"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: "-10px",
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animation: `fall ${Math.random() * 3 + 2}s linear ${Math.random() * 2}s infinite`,
                }}
            />
        ))
        setPieces(newPieces)

        const timer = setTimeout(() => {
            setVisible(false) // Hide after 5 seconds
        }, 5000)

        return () => clearTimeout(timer)
    }, [])

    if (!visible) return null

    return (
        <>
            <style>
                {`
                    @keyframes fall {
                        0% {
                            transform: translateY(0) rotate(0deg);
                        }
                        100% {
                            transform: translateY(100vh) rotate(360deg);
                        }
                    }
                `}
            </style>
            <div className="confetti-container fixed inset-0 pointer-events-none z-50">{pieces}</div>
        </>
    )
}

export default Confetti
