import { proxy } from "valtio";
interface State {
    intro: boolean;
    colors: string[];
    decals: string[];
    color: string;
    decal: string;
}

const state = proxy<State>({
    intro: false,
    colors: ["#ccc", "#EFBD4E", "#80C670", "#726DE8", "#EF674E", "#353934"],
    decals: ["react"],
    color: "#80C670",
    decal: "react",
});

export { state, type State };
