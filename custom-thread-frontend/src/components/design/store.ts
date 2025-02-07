import { proxy } from "valtio";
import * as THREE from "three";

interface State {
    intro: boolean;
    color: THREE.Color;
    decal: string;
}

export const state = proxy<State>({
    intro: true,
    color: new THREE.Color("#EFBD48"),
    decal: "b", // or whatever your default decal is
});
