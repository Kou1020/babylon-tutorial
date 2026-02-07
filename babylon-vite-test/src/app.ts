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

			// フィールドと家の生成。
			buildDwellings(scene);

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
		function buildGround(scene: Scene, width: number, height: number): void {
			// 地面用のマテリアル作成。
			const groundMaterial = new StandardMaterial("groundMaterial", scene); // マテリアルオブジェクト生成。
			groundMaterial.diffuseColor = new Color3(0, 1, 0); // マテリアルオブジェクトの設定。

			// 地面の生成。
			const ground = MeshBuilder.CreateGround("ground", { width: width, height: height }, scene);
			ground.material = groundMaterial; // マテリアルをアタッチ。
		}

		// -------------------
		// ボックスの生成。
		// -------------------
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
		function buildHouse(scene: Scene, size: number = 1): Mesh | null {
			const box = buildBox(scene, size);
			const roof = buildRoof(scene, size);

			return Mesh.MergeMeshes([box, roof], true, false, null, false, true); // 二番目のパラメータがtrueだと元のメッシュが破棄され、最後のパラメータがtrueだと元のマテリアルが個別に適用できるらしい。
		}

		// -------------------
		// 複数の家インスタンスの生成。
		// -------------------
		function buildDwellings(scene) {
			// フィールドの生成。
			const ground = buildGround(scene, 15, 16); // フィールド生成関数。引数：scene, width, height

			// 家インスタンスの元になるオブジェクト。
			const house_small = buildHouse(scene, 1);
			house_small.rotation.y = -Math.PI / 16;
			house_small.position.x = -6.8;
			house_small.position.z = 2.5;

			const house_large = buildHouse(scene, 2);
			house_large.rotation.y = -Math.PI / 16;
			house_large.position.x = -4.5;
			house_large.position.z = 3;

			// 家インスタンスの配置・回転設定配列。
			const places = []; // 配列：[size, rotation, x, z]
			places.push([1, -Math.PI / 16, -6.8, 2.5]);
			places.push([2, -Math.PI / 16, -4.5, 3]);
			places.push([2, -Math.PI / 16, -1.5, 4]);
			places.push([2, -Math.PI / 3, 1.5, 6]);
			places.push([2, (15 * Math.PI) / 16, -6.4, -1.5]);
			places.push([1, (15 * Math.PI) / 16, -4.1, -1]);
			places.push([2, (15 * Math.PI) / 16, -2.1, -0.5]);
			places.push([1, (5 * Math.PI) / 4, 0, -1]);
			places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3]);
			places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5]);
			places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
			places.push([2, Math.PI / 1.9, 4.75, -1]);
			places.push([1, Math.PI / 1.95, 4.5, -3]);
			places.push([2, Math.PI / 1.9, 4.75, -5]);
			places.push([1, Math.PI / 1.9, 4.75, -7]);
			places.push([2, -Math.PI / 3, 5.25, 2]);
			places.push([1, -Math.PI / 3, 6, 4]);

			// 家インスタンスの生成。
			const houses = [];
			for (let i = 0; i < places.length; i++) {
				if (places[i][0] === 1) {
					houses[i] = house_small.createInstance("house" + i);
				} else {
					houses[i] = house_large.createInstance("house" + i);
				}
				houses[i].rotation.y = places[i][1];
				houses[i].position.x = places[i][2];
				houses[i].position.z = places[i][3];
			}
		}
	}
}
new App();
