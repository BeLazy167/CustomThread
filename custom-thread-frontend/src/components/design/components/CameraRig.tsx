import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { Group } from "three";

interface CameraRigProps {
    children: React.ReactNode;
}

export function CameraRig({ children }: CameraRigProps) {
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
