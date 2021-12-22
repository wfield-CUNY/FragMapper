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

const country = new Style({
    stroke: new Stroke({
        color: 'gray',
        width: 1,
    }),
    fill: new Fill({
        color: 'rgba(200,200,200,0.9)',
    }),
});

//const tileUrl = 'https://www.urbanresearchmaps.org/NJ-Redistrict-API/v1/mvt/cong_current_all/{z}/{x}/{y}?geom_column=geom&columns=geoid'
const tileUrl = 'https://api.mapbox.com/v4/mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2,cunycur.dafp1f9f,cunycur.5a5xu1x4,cunycur.4ku9480m,cunycur.22eyn04s/{z}/{x}/{y}.vector.pbf?sku=101Po7LuGwr0M&access_token=pk.eyJ1IjoiY3VueWN1ciIsImEiOiJfQmNSMF9NIn0.uRgbcFeJbw2xyTUZY8gYeA'
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

////////////////////
/// THREE.JS
////////////////////
let camera, scene, renderer, mesh, material, drawingCanvas, canvasTex;

setTimeout(() => {
    init();
    setupCanvasDrawing();
    animate();

}, 1000);

function init() {

    const width = 512 //window.innerWidth;
    const height = 512 //window.innerHeight;
    camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    camera.position.z = 500;
    scene = new THREE.Scene();

    drawingCanvas = document.querySelector('#map > div > div.ol-unselectable.ol-layers > div > canvas');
    canvasTex = new THREE.CanvasTexture(drawingCanvas);
    // material = new THREE.MeshBasicMaterial();



    material = new THREE.ShaderMaterial({
        uniforms: {
            map: {
                value: canvasTex
            }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,
        fragmentShader: `

            uniform sampler2D map;
            varying vec2 vUv;

            void main() {

            vec2 sampleUV = vUv;
            vec4 color = texture2D( map, sampleUV, 0.0 );

            gl_FragColor = vec4( color.x,color.y,color.z, 1.0 );

            }

        `,
        depthTest: false
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

function setupCanvasDrawing() {

    material.map = canvasTex;
    drawingCanvas.addEventListener('pointerdown', function (e) {
        material.map.needsUpdate = true;
    });

    drawingCanvas.addEventListener('pointermove', function (e) {
        material.map.needsUpdate = true;
    });

    drawingCanvas.addEventListener('wheel', function (e) {
        material.map.needsUpdate = true;
    });

}



function animate() {

    requestAnimationFrame(animate);
    renderer.render(scene, camera);

}