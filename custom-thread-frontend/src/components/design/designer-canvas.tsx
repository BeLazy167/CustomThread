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
} from "@react-three/drei";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { state } from "./store";
import { Group, Material } from "three";

interface AppProps {
    position?: [number, number, number];
    fov?: number;
}

const DesignerCanvas: React.FC<AppProps> = ({
    position = [0, 0, 2.5],
    fov = 25,
}) => (
    <Canvas
        shadows
        camera={{ position, fov }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        eventPrefix="client"
        className="w-full h-full"
        style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
    >
        <ambientLight intensity={0.5 * Math.PI} />
        <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
        <CameraRig>
            <Backdrop />
            <Center>
                <Shirt />
            </Center>
        </CameraRig>
    </Canvas>
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
    const snap = useSnapshot(state);
    const { camera, pointer, viewport } = useThree();

    useFrame((state, delta) => {
        easing.damp3(
            camera.position,
            [snap.intro ? -viewport.width / 4 : 0, 0, 2],
            0.25,
            delta
        );
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
    const texture = useTexture(`/src/assets/${snap.decal}.svg`);

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
["/react.svg"].forEach(useTexture.preload);

export default DesignerCanvas;
