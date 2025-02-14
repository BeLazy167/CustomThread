import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
    AnimatePresence,
    MotionValue,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSnapshot } from "valtio";
import { state } from "@/components/design/store";
import * as THREE from "three";
import { useTheme } from "@/components/theme-provider";

type DockItem = {
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
};

export const FloatingDock = ({
    items,
    desktopClassName,
    mobileClassName,
}: {
    items: DockItem[];
    desktopClassName?: string;
    mobileClassName?: string;
}) => {
    return (
        <>
            <FloatingDockDesktop items={items} className={desktopClassName} />
            <FloatingDockMobile items={items} className={mobileClassName} />
        </>
    );
};

const FloatingDockMobile = ({
    items,
    className,
}: {
    items: DockItem[];
    className?: string;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div
            className={cn(
                "relative block md:hidden",
                "fixed bottom-4 left-4 right-4 z-50",
                className
            )}
        >
            <AnimatePresence>
                {open && (
                    <motion.div
                        layoutId="nav"
                        className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2"
                    >
                        {items.map((item, idx) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{
                                    opacity: 0,
                                    y: 10,
                                    transition: { delay: idx * 0.05 },
                                }}
                                transition={{
                                    delay: (items.length - 1 - idx) * 0.05,
                                }}
                            >
                                <button
                                    onClick={item.onClick}
                                    className="w-full h-12 rounded-lg bg-background/95 backdrop-blur-sm border border-border flex items-center justify-between px-4"
                                >
                                    <span className="text-sm font-medium">
                                        {item.title}
                                    </span>
                                    <div className="h-5 w-5">{item.icon}</div>
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            <button
                onClick={() => setOpen(!open)}
                className="w-full h-12 rounded-lg bg-background/95 backdrop-blur-sm border border-border flex items-center justify-center"
            >
                <IconLayoutNavbarCollapse className="h-5 w-5 text-foreground/70" />
            </button>
        </div>
    );
};

const FloatingDockDesktop = ({
    items,
    className,
}: {
    items: DockItem[];
    className?: string;
}) => {
    const mouseX = useMotionValue(Infinity);
    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "mx-auto hidden md:flex h-16 gap-4 items-end  rounded-2xl bg-gray-50 dark:bg-neutral-900 px-4 pb-3",
                className
            )}
        >
            {items.map((item) => (
                <IconContainer mouseX={mouseX} key={item.title} {...item} />
            ))}
        </motion.div>
    );
};

function IconContainer({
    mouseX,
    title,
    icon,
    href,
    onClick,
}: {
    mouseX: MotionValue;
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const snap = useSnapshot(state);
    const { theme } = useTheme();

    const getColorString = (color: THREE.Color) => {
        if (color && typeof color.getHexString === "function") {
            return `#${color.getHexString()}`;
        }
        return theme === "dark" ? "#2a2a2a" : "#f5f5f5";
    };

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? {
            x: 0,
            width: 0,
        };
        return val - bounds.x - bounds.width / 2;
    });

    const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const heightTransform = useTransform(
        distance,
        [-150, 0, 150],
        [40, 80, 40]
    );

    const widthTransformIcon = useTransform(
        distance,
        [-150, 0, 150],
        [20, 40, 20]
    );
    const heightTransformIcon = useTransform(
        distance,
        [-150, 0, 150],
        [20, 40, 20]
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

    const widthIcon = useSpring(widthTransformIcon, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });
    const heightIcon = useSpring(heightTransformIcon, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const [hovered, setHovered] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    const Container = href ? Link : "button";

    return (
        <Container
            to={href ?? ""}
            onClick={handleClick}
            className={cn("relative group", !href && "cursor-pointer")}
        >
            <motion.div
                ref={ref}
                style={{
                    width,
                    height,
                    backgroundColor:
                        title === "Color Picker"
                            ? getColorString(snap.color)
                            : undefined,
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={cn(
                    "rounded-full",
                    "flex items-center justify-center relative",
                    "transition-all duration-200",
                    title === "Color Picker"
                        ? "ring-2 ring-offset-2 ring-offset-background ring-border"
                        : "bg-muted hover:bg-muted/80 dark:bg-muted/20 dark:hover:bg-muted/30"
                )}
            >
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, x: "-50%" }}
                            animate={{ opacity: 1, y: 0, x: "-50%" }}
                            exit={{ opacity: 0, y: 2, x: "-50%" }}
                            className="px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
                        >
                            {title}
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.div
                    style={{ width: widthIcon, height: heightIcon }}
                    className="flex items-center justify-center"
                >
                    {icon}
                </motion.div>
            </motion.div>
        </Container>
    );
}
