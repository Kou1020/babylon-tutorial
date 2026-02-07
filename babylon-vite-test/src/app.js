var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "@babylonjs/inspector";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, CreateAudioEngineAsync, CreateStreamingSoundAsync, StandardMaterial, Color3, Texture, } from "@babylonjs/core";
class App {
    constructor() {
        const canvas = document.getElementById("game-canvas");
        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);
        const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, true);
        const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
        function initAudio() {
            return __awaiter(this, void 0, void 0, function* () {
                const audioEngine = yield CreateAudioEngineAsync();
                yield audioEngine.unlockAsync();
                CreateStreamingSoundAsync("backgroundMusic", "https://amf-ms.github.io/AudioAssets/cc-music/electronic/Soulsonic--No.mp3", { autoplay: true, loop: true }, audioEngine);
            });
        }
        const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
        const groundMaterial = new StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseColor = new Color3(0, 1, 0);
        ground.material = groundMaterial;
        const box1 = MeshBuilder.CreateBox("box1", {}, scene);
        box1.scaling = new Vector3(1, 1, 1);
        box1.position = new Vector3(0, 0.5, 0);
        const roof = MeshBuilder.CreateCylinder("roof", { diameter: 2, height: 1.2, tessellation: 3 }, scene);
        roof.scaling.x = 0.55;
        roof.rotation.y = Math.PI / 2;
        roof.rotation.z = Math.PI / 2;
        roof.position.y = 1.2;
        const roofMaterial = new StandardMaterial("roofMaterial", scene);
        roofMaterial.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);
        roof.material = roofMaterial;
        const boxMaterial = new StandardMaterial("boxMaterial", scene);
        boxMaterial.diffuseTexture = new Texture("/texture/cubehouse.png", scene);
        box1.material = boxMaterial;
        engine.runRenderLoop(() => {
            scene.render();
        });
        window.addEventListener("resize", function () {
            engine.resize();
        });
    }
}
new App();
