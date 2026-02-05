import "@babylonjs/inspector";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, CreateAudioEngineAsync, CreateStreamingSoundAsync } from "@babylonjs/core";

class App {
	constructor() {
		// 描画するcanvas
		const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;

		// シーンとエンジンの初期設定。
		const engine = new Engine(canvas, true);
		const scene = new Scene(engine);

		// カメラの設定。
		// const camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
		const camera: ArcRotateCamera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 0, 0));
		camera.attachControl(canvas, true);

		// ライトの設定。
		// const light: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
		const light: HemisphericLight = new HemisphericLight("light", new Vector3(1, 1, 0));

		// サウンドの設定。
		async function initAudio() {
			// 初期設定。
			const audioEngine = await CreateAudioEngineAsync();
			await audioEngine.unlockAsync();
			CreateStreamingSoundAsync("backgroundMusic", "https://amf-ms.github.io/AudioAssets/cc-music/electronic/Soulsonic--No.mp3", { autoplay: true, loop: true }, audioEngine);
		}
		// initAudio(); // サウンド関数の実行。

		// 地面の生成。
		const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 });

		// オブジェクトの生成。
		// const sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene); // 球体
		const box: Mesh = MeshBuilder.CreateBox("box", {}); // boxを生成。
		box.position.y = 0.5; // boxの高さを上げる。

		// レンダーループ
		engine.runRenderLoop(() => {
			scene.render();
		});

		// ウィンドウのリサイズに対応。
		window.addEventListener("resize", function () {
			engine.resize();
		});
	}
}
new App();
