import { proxy } from "valtio";
import * as THREE from "three";

export type ClothingType = "t-shirt" | "hoodie";

interface State {
    intro: boolean;
    color: THREE.Color;
    decal: string;
    isLogoTexture: boolean;
    logoDecal: string | null;
    fullDecal: string | null;
    clothingType: ClothingType;
    clothingModels: Record<ClothingType, string>;
}

export const state = proxy<State>({
    intro: true,
    color: new THREE.Color("#EFBD48"),
    decal: "a", // or whatever your default decal is
    isLogoTexture: true,
    logoDecal: "/src/assets/a.png",
    fullDecal: null,
    clothingType: "t-shirt",
    clothingModels: {
        "t-shirt": "/src/assets/shirt_baked_collapsed.glb",
        "hoodie": "/src/assets/shirt_baked_2.glb",
    },
});

// Helper functions to update state
export const updateLogoDecal = (url: string) => {
    state.logoDecal = url;
};

export const updateFullDecal = (url: string) => {
    state.fullDecal = url;
};

export const toggleDecal = () => {
    state.isLogoTexture = !state.isLogoTexture;
};

export const cycleClothingType = () => {
    state.clothingType =
        state.clothingType === "t-shirt" ? "hoodie" : "t-shirt";
};
