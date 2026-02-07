import "@babylonjs/inspector";
import {
	//
	Engine,
	Scene,
	ArcRotateCamera,
	Vector3,
	HemisphericLight,
	Mesh,
	MeshBuilder,
	CreateAudioEngineAsync,
	CreateStreamingSoundAsync,
	Tools,
	StandardMaterial,
	Color3,
	Texture,
	Vector4,
} from "@babylonjs/core";

class App {
	constructor() {
		// 描画するcanvas
		const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;

		// シーンとエンジンの初期設定。
		const engine = new Engine(canvas, true);
		const scene = new Scene(engine);

		// カメラの設定。
		const camera: ArcRotateCamera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 0, 0), scene);
		camera.attachControl(canvas, true);

		// ライトの設定。
		const light: HemisphericLight = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

		// サウンドの設定。
		async function initAudio() {
			// 初期設定。
			const audioEngine = await CreateAudioEngineAsync();
			await audioEngine.unlockAsync();
			CreateStreamingSoundAsync("backgroundMusic", "https://amf-ms.github.io/AudioAssets/cc-music/electronic/Soulsonic--No.mp3", { autoplay: true, loop: true }, audioEngine);
		}
		// initAudio(); // サウンド関数の実行。

		// ===================
		// マテリアル。テクスチャの設定
		// ===================

		// 地面用のマテリアル作成。
		const groundMaterial = new StandardMaterial("groundMaterial", scene); // マテリアルオブジェクト生成。
		groundMaterial.diffuseColor = new Color3(0, 1, 0); // マテリアルオブジェクトの設定。

		// ボックスのマテリアル設定。
		const boxMaterial = new StandardMaterial("boxMaterial", scene);
		boxMaterial.diffuseTexture = new Texture("/texture/cubehouse.png", scene);
		const faceUV = [];
		faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
		faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
		faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
		faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side

		// ボックスのマテリアル設定。
		const boxLargeMaterial = new StandardMaterial("boxLargeMaterial", scene);
		boxLargeMaterial.diffuseTexture = new Texture("/texture/semihouse.png", scene);
		const faceUV_Large = [];
		faceUV_Large[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
		faceUV_Large[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
		faceUV_Large[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
		faceUV_Large[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side

		// 屋根のマテリアル設定。
		const roofMaterial = new StandardMaterial("roofMaterial", scene);
		roofMaterial.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);

		// ===================
		// ワールドオブジェクト生成
		// ===================

		// 地面の生成。
		const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
		ground.material = groundMaterial; // マテリアルをアタッチ。

		// ボックスの生成。
		const box1 = MeshBuilder.CreateBox("box1", { faceUV: faceUV, wrap: true }, scene);
		box1.scaling = new Vector3(1, 1, 1); // スケール変更。
		box1.position = new Vector3(-3, 0.5, 0); // 表示位置の変更。
		box1.material = boxMaterial; // マテリアルをアタッチ。

		// 屋根を作成。
		const roof = MeshBuilder.CreateCylinder("roof", { diameter: 1.3, height: 1.2, tessellation: 3 }, scene);
		roof.scaling.x = 0.75;
		roof.rotation.z = Math.PI / 2;
		roof.position.x = -3;
		roof.position.y = 1.22;
		roof.material = roofMaterial;

		// メッシュの結合
		const house = Mesh.MergeMeshes([box1, roof], true, false, null, false, true); // 二番目のパラメータがtrueだと元のメッシュが破棄され、最後のパラメータがtrueだと元のマテリアルが個別に適用できるらしい。

		// 大きいボックス。
		const boxLarge = MeshBuilder.CreateBox("boxLarge", { faceUV: faceUV_Large, wrap: true }, scene);
		boxLarge.scaling = new Vector3(2, 1, 1); // スケール変更。
		boxLarge.position = new Vector3(0, 0.5, 0); // 表示位置の変更。
		boxLarge.material = boxLargeMaterial; // マテリアルをアタッチ。
		// 大きい屋根を作成。
		const roofLarge = MeshBuilder.CreateCylinder("roofLarge", { diameter: 1.3, height: 2.2, tessellation: 3 }, scene);
		roofLarge.scaling.x = 0.75;
		roofLarge.rotation.z = Math.PI / 2;
		roofLarge.position.y = 1.22;
		roofLarge.material = roofMaterial;

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
