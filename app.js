//const tileUrl = 'https://www.urbanresearchmaps.org/NJ-Redistrict-API/v1/mvt/cong_current_all/{z}/{x}/{y}?geom_column=geom&columns=geoid'

import 'ol/ol.css';
import MVT from 'ol/format/MVT';
import Map from 'ol/Map';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import View from 'ol/View';
import * as THREE from 'three';

import {
    Fill,
    Stroke,
    Style
} from 'ol/style';
import {
    fromLonLat
} from 'ol/proj';

// lookup for selection objects
let selection = {};

const country = new Style({
    stroke: new Stroke({
        color: 'gray',
        width: 1,
    }),
    fill: new Fill({
        color: 'rgba(200,200,200,0.9)',
    }),
});

const tileUrl = 'https://www.urbanresearchmaps.org/NJ-Redistrict-API/v1/mvt/cong_current_all/{z}/{x}/{y}?geom_column=geom&columns=geoid'

const vtLayer = new VectorTileLayer({
    declutter: true,
    source: new VectorTileSource({
        maxZoom: 15,
        format: new MVT({
            idProperty: 'iso_a3',
        }),
        url: tileUrl,
    }),
    style: country,
});

const _center = [-74.67, 40];
const _centerMerc = fromLonLat(_center);

const map = new Map({
    layers: [vtLayer],
    target: 'map',
    view: new View({
        center: _centerMerc,
        zoom: 6.5,
        multiWorld: true,
    }),
});

// Selection
const selectionLayer = new VectorTileLayer({
    map: map,
    renderMode: 'vector',
    source: vtLayer.getSource(),
    style: country
});



let camera, scene, renderer, mesh, material;
const drawStartPos = new THREE.Vector2();

setTimeout(()=>{
    init();
    setupCanvasDrawing();
    animate();
    
}, 1000)

function init() {

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 500;

    scene = new THREE.Scene();

    material = new THREE.MeshBasicMaterial();

    mesh = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 200), material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

}

// Sets up the drawing canvas and adds it as the material map

function setupCanvasDrawing() {

    // get canvas and context

    const drawingCanvas = document.querySelector('#map > div > div.ol-unselectable.ol-layers > div > canvas');
    
    const drawingContext = drawingCanvas.getContext('2d');

    // draw white background

 

    // set canvas as material.map (this could be done to any map, bump, displacement etc.)

    material.map = new THREE.CanvasTexture(drawingCanvas);

    // set the variable to keep track of when to draw

    let paint = false;

    // add canvas event listeners
    drawingCanvas.addEventListener('pointerdown', function (e) {

        paint = true;
        drawStartPos.set(e.offsetX, e.offsetY);

    });

    drawingCanvas.addEventListener('pointermove', function (e) {

        if (paint) draw(drawingContext, e.offsetX, e.offsetY);

    });

    drawingCanvas.addEventListener('wheel', function (e) {
        console.log('scroll')
        draw(drawingContext, e.offsetX, e.offsetY);

    });

    drawingCanvas.addEventListener('pointerup', function () {

        paint = false;

    });

    drawingCanvas.addEventListener('pointerleave', function () {

        paint = false;

    });

}

function draw(drawContext, x, y) {

    drawContext.moveTo(drawStartPos.x, drawStartPos.y);
    drawContext.strokeStyle = '#000000';
    drawContext.lineTo(x, y);
    drawContext.stroke();
    // reset drawing start position to current position.
    drawStartPos.set(x, y);
    // need to flag the map as needing updating.
    material.map.needsUpdate = true;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    //mesh.rotation.x += 0.01;
   // mesh.rotation.y += 0.01;

    renderer.render(scene, camera);

}