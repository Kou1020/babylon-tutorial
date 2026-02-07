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
		const createScene = () => {
			// 描画するcanvas
			const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;

			// シーンとエンジンの初期設定。
			const engine = new Engine(canvas, true);
			const scene: Scene = new Scene(engine);

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

			// オブジェクトの生成。
			buildGround(scene); // フィールド生成関数。
			buildHouse(scene, 1); // 家生成関数。

			// レンダーループ
			engine.runRenderLoop(() => {
				scene.render();
			});

			// ウィンドウのリサイズに対応。
			window.addEventListener("resize", function () {
				engine.resize();
			});
			return scene;
		};

		createScene();

		// ===================
		// オブジェクト生成関数
		// ===================
		// -------------------
		// フィールド生成。
		// -------------------
		// const buildGround = () => {
		function buildGround(scene: Scene): void {
			// 地面用のマテリアル作成。
			const groundMaterial = new StandardMaterial("groundMaterial", scene); // マテリアルオブジェクト生成。
			groundMaterial.diffuseColor = new Color3(0, 1, 0); // マテリアルオブジェクトの設定。

			// 地面の生成。
			const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
			ground.material = groundMaterial; // マテリアルをアタッチ。
		}

		// -------------------
		// ボックスの生成。
		// -------------------
		// const buildBox = (size: number = 1) => {
		function buildBox(scene: Scene, size: number): Mesh {
			// ボックスのマテリアル設定。
			const boxMaterial = new StandardMaterial("boxMaterial", scene);

			// サイズによって読み込むテクスチャを変更。
			if (size === 2) {
				boxMaterial.diffuseTexture = new Texture("./texture/semihouse.png", scene);
			} else {
				boxMaterial.diffuseTexture = new Texture("./texture/cubehouse.png", scene);
			}

			// サイズによってテクスチャの読み込み座標を変更。
			const faceUV = [];
			if (size === 2) {
				faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
				faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
				faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
				faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
			} else {
				faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
				faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
				faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
				faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
			}

			// ボックスの生成。
			const box = MeshBuilder.CreateBox("box", { faceUV: faceUV, wrap: true }, scene);
			box.scaling = new Vector3(size, 1, 1); // スケール変更。
			box.position = new Vector3(0, 0.5, 0); // 表示位置の変更。
			box.material = boxMaterial; // マテリアルをアタッチ。

			return box;
		}

		// -------------------
		// 屋根の生成。
		// -------------------
		// const buildRoof = (size) => {
		function buildRoof(scene: Scene, size: number): Mesh {
			// 屋根のマテリアル設定。
			const roofMaterial = new StandardMaterial("roofMaterial", scene);
			roofMaterial.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);

			// 屋根を作成。
			const roof = MeshBuilder.CreateCylinder("roof", { diameter: 1.3, height: 1.2, tessellation: 3 }, scene);
			roof.scaling = new Vector3(0.75, size, 1);
			roof.position = new Vector3(0, 1.22, 0);
			roof.rotation.z = Math.PI / 2;
			roof.material = roofMaterial;

			return roof;
		}

		// -------------------
		// 家の生成。
		// -------------------
		// const buildHouse = (size: number = 1) => {
		function buildHouse(scene: Scene, size: number = 1): Mesh | null {
			const box = buildBox(scene, size);
			const roof = buildRoof(scene, size);

			return Mesh.MergeMeshes([box, roof], true, false, null, false, true); // 二番目のパラメータがtrueだと元のメッシュが破棄され、最後のパラメータがtrueだと元のマテリアルが個別に適用できるらしい。
		}
	}
}
new App();
