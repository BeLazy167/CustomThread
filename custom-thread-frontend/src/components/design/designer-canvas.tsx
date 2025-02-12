import { useRef } from "react";
import { Canvas, MeshProps, useFrame, useThree } from "@react-three/fiber";
import {
    useGLTF,
    useTexture,
    AccumulativeShadows,
    RandomizedLight,
    Decal,
    Environment,
    Center,
    PresentationControls,
} from "@react-three/drei";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { state } from "./store";
import { Group, Material } from "three";
import { motion } from "framer-motion";
import { FloatingDock } from "../ui/floating-dock";
import {
    IconPalette,
    IconUpload,
    IconRotate360,
    IconDownload,
} from "@tabler/icons-react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

interface AppProps {
    position?: [number, number, number];
    fov?: number;
}

const DesignerCanvas: React.FC<AppProps> = ({
    position = [0, 0, 2.5],
    fov = 25,
}) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-full"
    >
        <Canvas
            shadows
            camera={{ position, fov }}
            gl={{ preserveDrawingBuffer: true, antialias: true }}
            eventPrefix="client"
            className="w-full h-full"
            style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
        >
            <ambientLight intensity={0.5 * Math.PI} />
            <PresentationControls
                global
                config={{ mass: 2, tension: 500 }}
                snap={{ mass: 4, tension: 1500 }}
                rotation={[0, 0.3, 0]}
                polar={[-Math.PI / 3, Math.PI / 3]}
                azimuth={[-Math.PI / 1.4, Math.PI / 2]}
            >
                <Environment preset="city" />
                <Backdrop />
                <CameraRig>
                    <Center>
                        <Shirt />
                    </Center>
                </CameraRig>
            </PresentationControls>
        </Canvas>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-8 left-0 right-0 flex justify-center px-4"
        >
            <FloatingDock
                desktopClassName="w-half max-w-2xl bg-background/80 dark:bg-background/50 backdrop-blur-md border border-border shadow-lg "
                mobileClassName="w-full max-w-[90%] mx-auto"
                items={[
                    {
                        title: "Color Picker",
                        icon: (
                            <IconPalette
                                className={cn(
                                    "h-full w-full",
                                    "transition-colors duration-200",
                                    "text-foreground/80 dark:text-foreground/70"
                                )}
                            />
                        ),
                        onClick: () => {
                            const input = document.createElement("input");
                            input.type = "color";
                            input.value = `#${state.color.getHexString()}`;
                            input.addEventListener("input", (e) => {
                                state.color = new THREE.Color(
                                    (e.target as HTMLInputElement).value
                                );
                            });
                            input.click();
                        },
                    },
                    {
                        title: "Upload Logo",
                        icon: (
                            <IconUpload className="h-full w-full text-neutral-500 dark:text-neutral-300" />
                        ),
                        onClick: () => {
                            /* implement later */
                        },
                    },
                    {
                        title: "Rotate View",
                        icon: (
                            <IconRotate360 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
                        ),
                        onClick: () => {
                            /* implement later */
                        },
                    },
                    {
                        title: "Download",
                        icon: (
                            <IconDownload className="h-full w-full text-neutral-500 dark:text-neutral-300" />
                        ),
                        onClick: () => {
                            /* implement later */
                        },
                    },
                ]}
            />
        </motion.div>
    </motion.div>
);

function Backdrop() {
    const shadows = useRef<{ getMesh: () => { material: { color: string } } }>(
        null!
    );
    useFrame((state, delta) => {
        if (shadows.current) {
            easing.dampC(
                // @ts-expect-error eslint-disable-line
                shadows.current.getMesh().material.color,
                // @ts-expect-error eslint-disable-line

                state.color,
                0.25,
                delta
            );
        }
    });
    return (
        <AccumulativeShadows
            // @ts-expect-error eslint-disable-line

            ref={shadows}
            temporal
            frames={60}
            alphaTest={0.85}
            scale={5}
            resolution={2048}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0, -0.14]}
        >
            <RandomizedLight
                amount={4}
                radius={9}
                intensity={0.55 * Math.PI}
                ambient={0.25}
                position={[5, 5, -10]}
            />
            <RandomizedLight
                amount={4}
                radius={5}
                intensity={0.25 * Math.PI}
                ambient={0.55}
                position={[-5, 5, -9]}
            />
        </AccumulativeShadows>
    );
}

function CameraRig({ children }: { children: React.ReactNode }) {
    const group = useRef<Group>(null!);
    const { camera, pointer } = useThree();

    useFrame((state, delta) => {
        easing.damp3(camera.position, [0, 0, 2.5], 0.25, delta);
        easing.dampE(
            group.current.rotation,
            [pointer.y / 10, pointer.x / 5, 0],
            0.25,
            delta
        );
    });

    return <group ref={group}>{children}</group>;
}

function Shirt(props: MeshProps) {
    const snap = useSnapshot(state);
    const texture = useTexture(`/src/assets/${snap.decal}.png`);

    const { nodes, materials } = useGLTF(
        "/src/assets/shirt_baked_collapsed.glb"
    );

    useFrame((state, delta) => {
        easing.dampC(
            // @ts-expect-error eslint-disable-line

            (materials.lambert1 as Material).color,
            snap.color,
            0.25,
            delta
        );
    });

    return (
        <mesh
            castShadow
            // @ts-expect-error eslint-disable-line

            geometry={nodes.T_Shirt_male.geometry}
            material={materials.lambert1}
            material-roughness={1}
            {...props}
            dispose={null}
        >
            <Decal
                position={[0, 0.04, 0.15]}
                rotation={[0, 0, 0]}
                scale={0.15}
                map={texture}
            />
        </mesh>
    );
}

useGLTF.preload("../../assets/shirt_baked.glb");
["/react.png"].forEach(useTexture.preload);

export default DesignerCanvas;
