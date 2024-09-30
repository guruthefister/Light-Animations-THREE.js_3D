import * as THREE from "three";
import World from "./world";
import EduLight from "./eduLight";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { InteractionManager } from "three.interactive";
import gsap from "gsap";

class EduNinja {
  constructor() {

    this.jumpFinished = true;

    this.world = new World({
      showCameraPos: true,
      setCameraPos: [0.1, 0.7, 7],
      showGrid: false,
      ambientLight: false,
      ambientStrength: 0,
      orbitcontrols: true,
      showFloor: true,
    });

    const interactionManager = new InteractionManager(
      this.world.renderer,
      this.world.camera,
      this.world.renderer.domElement
    );

    const geometryWall = new THREE.PlaneGeometry(30, 10);
    const materialWall = new THREE.MeshPhongMaterial({
      color: 0xb67500,
      side: THREE.DoubleSide,
    });

    const wall = new THREE.Mesh(geometryWall, materialWall);
    wall.receiveShadow = true;
    wall.position.set(0, 5, -2);
    wall.rotation.x = 0;
    this.world.scene.add(wall);

    const textureLeft = new THREE.TextureLoader().load("assets/IMG/one.png");
    const geometryCubeLeft = new THREE.BoxGeometry(1, 1, 10);
    const materialCubeLeft = new THREE.MeshPhongMaterial({ map: textureLeft });
    let cubeLeft = new THREE.Mesh(geometryCubeLeft, materialCubeLeft);

    cubeLeft.castShadow = true;
    cubeLeft.receiveShadow = true;
    this.world.scene.add(cubeLeft);
    cubeLeft.visible = false;
    cubeLeft.position.set(0, 0.5, 2.5);

    new EduLight(this.world, cubeLeft);

    const loader = new GLTFLoader();
            let modelAnim;
        loader.load("assets/little1.glb", (gltf) => {
        modelAnim = gltf.scene;
        modelAnim.position.set(0.1, 0.55, 3.5);
        modelAnim.rotation.y = 0.3;
        modelAnim.scale.set(0.4, 0.4, 0.4);
        modelAnim.traverse((n) => {
        if (n.isMesh) {
            n.castShadow = true;
            n.receiveShadow = true;
        }
    });

      this.world.scene.add(modelAnim);

      this.mixer = new THREE.AnimationMixer(modelAnim);
      this.clips = gltf.animations;

      const clip = THREE.AnimationClip.findByName(this.clips, "breath");
      const breath = this.mixer.clipAction(clip);
      console.log(breath);
      breath.play();
    });

    loader.load("assets/button_jump.glb", (gltf) => {
      let buttonJump = gltf.scene;
      buttonJump.position.set(1, 0.35, 5);
      buttonJump.scale.set(0.3, 0.3, 0.3);
      buttonJump.rotation.set(0, -1.5, 0);

      this.world.interactionManager.add(buttonJump);

      buttonJump.traverse((n) => {
        if (n.isMesh) {
          n.castShadow = true;
          n.receiveShadow = true;
        } //END if
      }); //END traverse

      buttonJump.addEventListener("click", (event) => {

        if (this.jumpFinished == true) {
            
          if (this.actionJump) this.actionJump.reset();

          const clipJump = THREE.AnimationClip.findByName(this.clips, "jump");
          this.actionJump = this.mixer.clipAction(clipJump);
          this.actionJump.clampWhenFinished = true;
          this.actionJump.setLoop(THREE.LoopOnce);
          this.actionJump.play();

          gsap.to(modelAnim.position, {
            duration: 0.5,
            y: 0.8,
            repeat: 1,
            yoyo: true, 
            //ease: "Circ.easeInOut"

            onComplete: () => {
              this.jumpFinished = true;
            }, //END onComplte
          }); //END Gsap position

          gsap.to(modelAnim.rotation, {
            delay: 0.01,
            duration: 0.5,
            y: -0.7, //this.jumpto,  
            repeat: 1,
            yoyo: true
          });//END Gsap rotation

          this.jumpFinished = false;
        } //END if
      }); //END eventlistener
      this.world.scene.add(buttonJump);
    });

    this.world.renderer.setAnimationLoop((time) => this.myAnimation(time));
    this.clock = new THREE.Clock();

    const myDiv = document.createElement('div');
    myDiv.id = "myView";
    myDiv.textContent = "Ninja";
    document.body.appendChild(myDiv);

  } //END constructor

  myAnimation(time) {
    if (this.mixer) {
      //is our mixer ready
      this.mixer.update(this.clock.getDelta());
    }

    this.world.interactionManager.update();

    this.world.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.world.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.world.renderer.render(this.world.scene, this.world.camera);
  }
} //END class

export default EduNinja;
