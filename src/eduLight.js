import * as THREE from "three";
import gsap from "gsap";

class EduLight{
    constructor(world, cubeLeft){

        console.log(world, cubeLeft);
        const spotLightDown = new THREE.SpotLight(0xffffff, 100);
            spotLightDown.position.set(1.5, 20, 7.5);
            spotLightDown.angle = 0.314;
            spotLightDown.penumbra = 0.4;
            spotLightDown.distance = 0;
            spotLightDown.castShadow = true;
            spotLightDown.target = cubeLeft;
            spotLightDown.shadow.mapSize.width = 2048;
            spotLightDown.shadow.mapSize.height = 2048;

            const s1Helper = new THREE.SpotLightHelper(spotLightDown);
            world.scene.add(spotLightDown);

            gsap.to(spotLightDown.position, {
                duration: 8,
                y: 0.3,
                repeat: -1,
                yoyo: true,
                // ease: "Circ.easeInOut"
            });

            world.scene.add( new THREE.HemisphereLight (0x443333, 0x111122, 25) );
    }
}

export default EduLight;