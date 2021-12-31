import * as THREE from 'three';
let camera, scene, renderer, mesh, material, drawingCanvas, canvasTex;
import vert_simple from '../shaders/vert_simple.vert';
import frag_chrom_abberation from '../shaders/frag_chrom_abberation.frag'
export function init(map, bg) {

    const width = 512 //window.innerWidth;
    const height = 512 //window.innerHeight;
    camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    camera.position.z = 500;
    scene = new THREE.Scene();

    drawingCanvas = document.querySelector('#map > div > div.ol-unselectable.ol-layers > div > canvas');
    canvasTex = new THREE.CanvasTexture(drawingCanvas);
    canvasTex.minFilter = THREE.NearestFilter;
    canvasTex.magFilter = THREE.NearestFilter;
    canvasTex.needsUpdate = true;
    // material = new THREE.MeshBasicMaterial();

    material = new THREE.ShaderMaterial({
        uniforms: {
            map: {
                value: canvasTex
            },
            background:{
                value: bg/255
            }
        },
        vertexShader: vert_simple,
        fragmentShader: frag_chrom_abberation,
        depthTest: false
    });
    material.map = canvasTex;
    map.on('rendercomplete',()=>{
        material.map.needsUpdate = true;
        //console.log(map.getProperties().view.getZoom())
        //console.log(map.getProperties().view.targetCenter_)
    })

    mesh = new THREE.Mesh(new THREE.PlaneGeometry(512, 512), material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    document.getElementById('three-holder').appendChild(renderer.domElement);

}



export function animate() {

    requestAnimationFrame(animate);
    renderer.render(scene, camera);

}