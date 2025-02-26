import { useEffect, useMemo } from "react";
import { MeshProps, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, Decal } from "@react-three/drei";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { state } from "../store";
import { Mesh } from "three";

export function ShirtModel(props: MeshProps) {
    const snap = useSnapshot(state);

    // Load textures first
    const logo = useTexture(snap.logoDecal || "/src/assets/a.png");
    const full = useTexture(snap.fullDecal || "/src/assets/a.png");

    // Then memoize the loaded textures
    const logoTexture = useMemo(() => logo, [logo]);
    const fullTexture = useMemo(() => full, [full]);

    // Use the appropriate texture based on state
    const activeTexture = snap.isLogoTexture ? logoTexture : fullTexture;

    // Load the current clothing model
    const { nodes, materials } = useGLTF(
        snap.clothingModels[snap.clothingType]
    );

    useFrame((_state, delta) => {
        easing.dampC(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (materials.lambert1 as any).color,
            snap.color,
            0.25,
            delta
        );
    });

    // Configure texture properties
    useEffect(() => {
        if (activeTexture) {
            activeTexture.anisotropy = 16;
            activeTexture.needsUpdate = true;
        }
    }, [activeTexture]);

    return (
        <mesh
            castShadow
            geometry={(nodes.T_Shirt_male as Mesh).geometry}
            material={materials.lambert1}
            material-roughness={1}
            {...props}
            dispose={null}
        >
            <Decal
                position={[0, 0.04, 0.15]}
                rotation={[0, 0, 0]}
                scale={0.15}
                map={activeTexture}
            />
        </mesh>
    );
}

// Preload all clothing models
Object.values(state.clothingModels).forEach((path) => {
    useGLTF.preload(path);
});

// Preload default texture
useTexture.preload("/src/assets/a.png");
