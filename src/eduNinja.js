import * as THREE from "three";
import World from "./world";
import EduLight from "./eduLight";

class EduNinja {
    constructor() {
        
        this.world = new World({
            showCameraPos: true,
            setCameraPos: [0.1, 0.7, 7],
            showGrid: false,
            ambientLight: false,
            ambientStrength: 0,
            orbitcontrols: true,
            showFloor: true
        });

        const textureLeft = new THREE.TextureLoader().load('assets/IMG/one.png');
        const geometryCubeLeft = new THREE.BoxGeometry(1, 1, 10);
        const materialCubeLeft = new THREE.MeshPhongMaterial({ map:textureLeft });
        let cubeLeft = new THREE.Mesh(geometryCubeLeft, materialCubeLeft);
        cubeLeft.castShadow = true;
        cubeLeft.receiveShadow = true;
        this.world.scene.add(cubeLeft);
        cubeLeft.visible = false;
        cubeLeft.position.set(0, 0.5, 2.5);

        new EduLight(this.world, cubeLeft);
        
        console.log("edu")

        this.world.renderer.setAnimationLoop((time) => this.myAnimation(time));
        this.clock = new THREE.Clock();

    }//END constructor

    myAnimation(time){
        this.world.renderer.outputEncoding = THREE.sRGBEncoding;
        this.world.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.world.renderer.render(this.world.scene, this.world.camera);
    }
}//END class

export default EduNinja;