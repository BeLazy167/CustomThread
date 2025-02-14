import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AccumulativeShadows, RandomizedLight } from "@react-three/drei";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { state } from "../store";

export function Backdrop() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shadows = useRef<any>(null);
    const snap = useSnapshot(state);

    useFrame((_, delta) => {
        if (shadows.current) {
            easing.dampC(
                shadows.current.getMesh().material.color,
                snap.color,
                0.25,
                delta
            );
        }
    });

    return (
        <AccumulativeShadows
            ref={shadows}
            temporal
            frames={30}
            alphaTest={0.85}
            scale={5}
            resolution={1024}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0, -0.14]}
        >
            <RandomizedLight
                amount={3}
                radius={9}
                intensity={0.55 * Math.PI}
                ambient={0.25}
                position={[5, 5, -10]}
            />
            <RandomizedLight
                amount={3}
                radius={5}
                intensity={0.25 * Math.PI}
                ambient={0.55}
                position={[-5, 5, -9]}
            />
        </AccumulativeShadows>
    );
}
