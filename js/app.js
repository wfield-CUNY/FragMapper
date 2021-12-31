import 'ol/ol.css';
import MVT from 'ol/format/MVT';
import Map from 'ol/Map';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import View from 'ol/View';
import {init, animate} from './threejsmap';

import {
    Fill,
    Stroke,
    Style
} from 'ol/style';
import {
    fromLonLat
} from 'ol/proj';



const bg = '70'

const country = new Style({
    //geometry: GeometryType.POLYGON,
    stroke: new Stroke({
        color: 'white',
        width: 1,
    }),
    fill: new Fill({
        color: `rgb(${bg},${bg},${bg})`,
    }),
});

const key = 'pk.eyJ1IjoiY3VueWN1ciIsImEiOiJfQmNSMF9NIn0.uRgbcFeJbw2xyTUZY8gYeA'
//const tileUrl = 'https://www.urbanresearchmaps.org/NJ-Redistrict-API/v1/mvt/cong_current_all/{z}/{x}/{y}?geom_column=geom&columns=geoid'
const tileUrl = 'https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?sku=101Po7LuGwr0M&access_token=pk.eyJ1IjoiY3VueWN1ciIsImEiOiJfQmNSMF9NIn0.uRgbcFeJbw2xyTUZY8gYeA'


const _center = [-74.67, 40];
const _centerMerc = fromLonLat(_center);

const map = new Map({
  //  layers:[],
   // layers: [vtLayer],
    target: 'map',
    view: new View({
        center: _centerMerc,
        zoom: 6.5,
        multiWorld: true,
    }),
});

const vtLayer = new VectorTileLayer({
    map: map,
    source: new VectorTileSource({
        maxZoom: 15,
        format: new MVT({
            idProperty: 'iso_a3',
        }),
        url: tileUrl,
    }),
    style: country,
});

//olms(map, 'https://api.mapbox.com/styles/v1/mapbox/bright-v9?access_token=' + key);

map.once('rendercomplete',()=>{
    init(map, bg);
    animate();
    
})


