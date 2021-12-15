import L from 'leaflet';
import vectorTileLayer from 'leaflet-vector-tile-layer';
import { toCanvas } from 'html-to-image';


let map = L.map('map', {
    zoomControl: false
}).setView([38, -80], 5);

const url = "https://dev.urbanresearchmaps.org/US-Redistrict-API/v1/mvt/cong_current_all/{z}/{x}/{y}?geom_column=geom"
const tileLayer = vectorTileLayer(url, {
    style: {
        stroke: true,
        color: 'rgb(0,200,200)',
        fill: true,
        fillColor: 'rgb(200,0,0)',
        fillOpacity: 1
    }
}).addTo(map);

map.on("moveend",() => {
    setTimeout(()=>{
    toCanvas(document.getElementById('map'))
        .then(function (canvas) {
            var element = document.getElementsByTagName("canvas"), index;

            for (index = element.length - 1; index >= 0; index--) {
                element[index].parentNode.removeChild(element[index]);
            }
            document.body.appendChild(canvas);
        });
    },250)
})
