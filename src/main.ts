import * as THREE from 'three';
import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { update } from 'three/examples/jsm/libs/tween.module.js';
import gsap from 'gsap';


interface size {
  width: number,
  height: number
}

const sizes: size = {
  width: window.innerWidth,
  height: window.innerHeight
}


//scene
const scene = new THREE.Scene();

//mesh
const geometry = new THREE.TorusKnotGeometry( 10, 3, 64, 8, 12, 3 ); 
const material = new THREE.MeshStandardMaterial( { color: 0x4287f5, roughness: 0 } ); 
const torusKnot = new THREE.Mesh( geometry, material ); scene.add( torusKnot );

//lights
const pointLight = new THREE.PointLight(0xffffff, 10, 1000);
pointLight.position.z = 1;
pointLight.intensity = 5;
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff)
directionalLight.position.z = 30
directionalLight.position.y = 30
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.07);scene.add(ambientLight);


//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
scene.add(camera);
camera.position.z = 50;

//resize
window.addEventListener("resize", ()=>{

  //update sizes
  sizes.width = window.innerWidth,
  sizes.height = window.innerHeight

  console.log(sizes.width, sizes.height)

  //update camera
  camera.aspect = sizes.width/sizes.height;
  camera.updateProjectionMatrix();  
  renderer.setSize( sizes.width, sizes.height );

})

//renderer
const canvas = document.querySelector('.webgl') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize( sizes.width, sizes.height );
renderer.render(scene, camera);

//controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.autoRotate = true;
controls.enablePan = false;
controls.enableZoom = false;



//GSAP timeline
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(torusKnot.scale, {x:0, y:0, z:0}, {x:1, y:1, z:1})
tl.fromTo(torusKnot.rotation, 
  { z: 0 }, 
  { z: Math.PI * 2 },     
  "<" // This makes it start at the same time as the previous animation
)
tl.fromTo("nav", { y: '-100%', opacity: 0 }, { y: '0%', opacity: 1 })
tl.fromTo(".title", { y: '100%', opacity: 0 }, { y: '0%', opacity: 1 })

//mouse events
let rgb: number[] = [];
let mouseDown = false;
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

window.addEventListener('mousemove', (e) => {

  if(mouseDown){

    rgb = [
      Math.round(( e.pageX / sizes.width ) * 255),
      Math.round(( e.pageY / sizes.height ) * 255),
      Math.round(( (e.pageX + e.pageY) / (sizes.width + sizes.height) * 255))

    ];

    let newColor = new THREE.Color(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
    newColor.setHSL(0.0, 0.5, 0.5);
    gsap.to(torusKnot.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b
    });
  }
})


//animate  
const animate = () =>{
  controls.update()

  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  
};animate();
