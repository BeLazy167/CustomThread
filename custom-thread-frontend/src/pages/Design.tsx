import DesignerCanvas from "../components/design/designer-canvas";

export default function Design() {
    return (
        <div className="w-full h-screen absolute top-0 left-0">
            {/* <div className="">
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold">
                        Design auhsfasuofso ufhaoufhaoueaouihfaeofhaofhaouh
                        aihfoahfoahouahouaehouae
                    </h1>
                </div>
            </div> */}
            <DesignerCanvas />
        </div>
    );
}
