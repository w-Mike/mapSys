<template>
  <div id="map" tabindex="0">
    <b-button-group class="zoom-buttons" vertical>
      <b-button variant="light" @click="zoomIn">+</b-button>
      <b-button variant="light" @click="zoomOut">-</b-button>
    </b-button-group>
  </div>
</template>
<script>
import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import OSM from "ol/source/OSM";

import * as olProj from "ol/proj";
import { Fill, Stroke, Style, Icon, Circle, Text } from "ol/style";
import View from "ol/View.js";
import XYZ from "ol/source/XYZ";

import { BIcon, BIconMap, BIconUpload, BIconBrush } from "bootstrap-vue";

// import OSM from "ol/source/OSM";
// import Tile from "ol/Tile";

// 天地图的key
const key = "39cf8c6b5e6e18abe0d8ce6b63edd2bd";
// 矢量 卫星 地形
const vecUrl = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s,m&gl=CN&x={x}&y={y}&z={z}";
const imgUrl = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s,m&gl=CN&x={x}&y={y}&z={z}";
const terUrl = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=p,m&gl=CN&x={x}&y={y}&z={z}";

export default {
  name: "mapHome",
  components: {
    BIcon,
    BIconMap,
    BIconUpload,
    BIconBrush,
  },
  data() {
    return {
      map: "",
      layer_vec: "",
      layer_img: "",
      layer_ter: "",

      vecLayer_buffer: "",
      vectorLayer_centerLine: "",
      VectorLayer_centerLine_seg: "",
      vectorLayer_allLine_seg: "",
      formFlag: false,
    };
  },
  methods: {
    initMap() {
      this.loadTileLayer();
      this.loadVecLayer();
      this.map = new Map({
        layers: [
          // this.layer_vec,
          // this.layer_img,
          // this.layer_ter,
          new TileLayer({
            source: new OSM(),
          }),
          this.vecLayer_buffer,
          // this.vectorLayer_centerLine_seg,
          this.vectorLayer_allLine_seg,
          this.vectorLayer_centerLine,
        ],
        target: "map",
        view: new View({
          center: olProj.transform([104.06, 30.67], "EPSG:4326", "EPSG:3857"),
          // center: [104.10,30.72],
          zoom: 6,
        }),
      });
    },
    loadTileLayer() {
      this.layer_vec = new TileLayer({
        name: "矢量图",
        source: new XYZ({
          url: vecUrl,
        }),
      });

      this.layer_img = new TileLayer({
        name: "卫星图",
        source: new XYZ({
          url: imgUrl,
        }),
      });

      this.layer_ter = new TileLayer({
        name: "地形图",
        source: new XYZ({
          url: terUrl,
        }),
      });
    },
    loadVecLayer() {
      this.clearGeoJSON();
      this.vecLayer_buffer = new VectorLayer({
        source: new VectorSource({
          url: "https://geo.datav.aliyun.com/areas_v3/bound/510000_full.json",
          // url: "./Data/缓冲区50km.json",
          format: new GeoJSON(),
        }),
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 0, 0, 0.8)",
          }),
        }),
      });
      // this.vectorLayer_centerLine_seg = new VectorLayer({
      //   source: new VectorSource({
      //     url: "./Data/示范区线路中线100m分段.json",
      //     format: new GeoJSON(),
      //   }),
      //   style: new Style({
      //     stroke: new Stroke({
      //       color: "blue",
      //       width: 2,
      //     }),
      //   }),
      // });
      this.vectorLayer_centerLine = new VectorLayer({
        source: new VectorSource({
          url: "./Data/示范区线路中线.json",
          format: new GeoJSON(),
        }),
        style: new Style({
          fill: new Stroke({
            color: "green",
            width: 3,
          }),
        }),
      });
      this.vectorLayer_allLine_seg = new VectorLayer({
        source: new VectorSource({
          url: "./Data/整路段100m分段.json",
          format: new GeoJSON(),
        }),
        style: new Style({
          fill: new Stroke({
            color: "purple",
            width: 2,
          }),
        }),
      });
    },
    clearGeoJSON() {},
    zoomOut() {
      const view = this.map.getView();
      const zoom = view.getZoom();
      view.setZoom(zoom - 1);
    },
    zoomIn() {
      const view = this.map.getView();
      const zoom = view.getZoom();
      view.setZoom(zoom + 1);
    },
    changeBasemap(type) {
      let main_basemap_type = type;
      if (main_basemap_type == "relief_map") {
        this.layer_ter.setVisible(true);

        this.layer_img.setVisible(false);

        this.layer_vec.setVisible(false);
      } else if (main_basemap_type == "image_map") {
        this.layer_ter.setVisible(false);

        this.layer_img.setVisible(true);

        this.layer_vec.setVisible(false);
      } else if (main_basemap_type == "vector_map") {
        this.layer_ter.setVisible(false);

        this.layer_img.setVisible(false);

        this.layer_vec.setVisible(true);
      }
    },
  },
  props: {},
  mounted() {
    this.initMap();
    this.layer_ter.setVisible(false);
    this.layer_img.setVisible(false);
    this.layer_vec.setVisible(true);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  --main-bg-color: rgb(42, 154, 230);
  margin: 0;
}
#map:focus {
  outline: #4a74a8 solid 0.15em;
}
.zoom-buttons {
  position: absolute;
  bottom: 2%;
  right: 3%;
  z-index: 2;
}
.zoom-buttons button {
  font-size: 1.5rem;
  padding: 0.1em 0.5em;
}
</style>
