import { state } from "@/components/design/store";
export const changeLogoDecal = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const objectUrl = URL.createObjectURL(file);

    state.logoDecal = objectUrl;
};
