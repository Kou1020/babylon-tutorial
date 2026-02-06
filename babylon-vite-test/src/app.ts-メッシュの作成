import "@babylonjs/inspector";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, CreateAudioEngineAsync, CreateStreamingSoundAsync, Tools } from "@babylonjs/core";

class App {
	constructor() {
		// 描画するcanvas
		const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;

		// シーンとエンジンの初期設定。
		const engine = new Engine(canvas, true);
		const scene = new Scene(engine);

		// カメラの設定。
		// const camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
		const camera: ArcRotateCamera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 0, 0), scene);
		camera.attachControl(canvas, true);

		// ライトの設定。
		// const light: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
		const light: HemisphericLight = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

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

		// メッシュの生成。
		// const sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene); // 球体
		// const box: Mesh = MeshBuilder.CreateBox("box", {}, scene); // boxを生成。
		// box.position.y = 0.5; // boxの高さを上げる。

		// スケールの変更
		// const box = MeshBuilder.CreateBox("box", { width: 2, height: 1.5, depth: 3 }); // メッシュ生成時にオプションでスケール変更。
		const box1 = MeshBuilder.CreateBox("box1", {});
		// box1.scaling.x = 2;
		// box1.scaling.y = 1.5;
		// box1.scaling.z = 3;
		box1.scaling = new Vector3(1, 1, 1); // 上記と同じ結果になる。

		// 表示位置の変更
		// box1.position.x = -2;
		// box1.position.y = 4.2;
		// box1.position.z = 0.1;
		box1.position = new Vector3(0, 0.5, 0); // 上記と同じ結果になる。

		// オブジェクトを増やす。
		// const box2 = MeshBuilder.CreateBox("box2");
		// box2.scaling = new Vector3(2, 1.5, 3);
		// box2.position = new Vector3(-3, 0.75, 0);

		// const box3 = MeshBuilder.CreateBox("box3");
		// box3.scaling = new Vector3(2, 1.5, 3);
		// box3.position = new Vector3(3, 0.75, 0);

		// boxの回転
		// box1.rotation.y = Math.PI / 4;
		// box2.rotation.y = Tools.ToRadians(45);

		// 円柱を使って屋根を作成。
		const roof = MeshBuilder.CreateCylinder("roof", { diameter: 2, height: 1.2, tessellation: 3 });
		roof.scaling.x = 0.55;
		roof.rotation.y = Math.PI / 2;
		roof.rotation.z = Math.PI / 2;
		roof.position.y = 1.2;

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
