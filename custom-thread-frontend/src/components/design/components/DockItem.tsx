import { useRef, useState } from "react";
import {
    motion,
    AnimatePresence,
    MotionValue,
    useSpring,
    useTransform,
} from "framer-motion";

interface DockItemProps {
    title: string;
    icon: React.ReactNode;
    onClick?: () => void;
    mouseX: MotionValue;
}

export function DockItem({ mouseX, title, icon, onClick }: DockItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? {
            x: 0,
            width: 0,
        };
        return val - bounds.x - bounds.width / 2;
    });

    const widthTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40]);
    const heightTransform = useTransform(
        distance,
        [-150, 0, 150],
        [40, 60, 40]
    );
    const iconSizeTransform = useTransform(
        distance,
        [-150, 0, 150],
        [16, 24, 16]
    );

    const width = useSpring(widthTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });
    const height = useSpring(heightTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });
    const iconSize = useSpring(iconSizeTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    return (
        <motion.div
            ref={ref}
            style={{ width, height }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
            className="relative flex items-center justify-center rounded-full bg-gray-200/80 dark:bg-neutral-800/80 hover:bg-gray-300/80 dark:hover:bg-neutral-700/80 cursor-pointer transition-colors"
        >
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 2, x: "-50%" }}
                        className="absolute left-1/2 -top-8 px-2 py-0.5 text-xs rounded-md bg-background/80 border backdrop-blur-md"
                    >
                        {title}
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                style={{ width: iconSize, height: iconSize }}
                className="flex items-center justify-center"
            >
                {icon}
            </motion.div>
        </motion.div>
    );
}
