<template>
  <div class="sysContainer">
    <div class="navBar">
      <p class="title">基于WebGIS的多源异构数据管理系统</p>
    </div>

    <div id="map" class="map" tabindex="0">
      <div class="docManageBar">
        <b-button-group vertical>
          <b-button variant="primary" size="lg" @click="formFlag = true" no-caret>
            <b-icon icon="upload"></b-icon> <span>上传数据</span>
          </b-button>

          <b-dropdown
            variant="primary"
            size="lg"
            id="dropdown-dropright"
            dropright
            no-caret
          >
            <template #button-content> <b-icon icon="brush"></b-icon> 编辑要素 </template>
            <b-dropdown-item>添加高铁线路</b-dropdown-item>
            <b-dropdown-item>添加线路站点</b-dropdown-item>
          </b-dropdown>
          <!-- <b-dropdown variant="primary" size="lg" id="dropdown-dropright" dropright no-caret>
              <b-dropdown-item>上传数据</b-dropdown-item>
              <b-dropdown-item>上传文本</b-dropdown-item>
              <b-dropdown-item>上传样本</b-dropdown-item>
              <b-dropdown-item>上传算法</b-dropdown-item>
              <b-dropdown-item>上传案例</b-dropdown-item>
            </b-dropdown> -->
        </b-button-group>
      </div>
      <div class="changeMap">
        <b-dropdown
          size="lg"
          variant="light"
          toggle-class="text-decoration-none"
          no-caret
        >
          <template #button-content> <b-icon icon="map"></b-icon> </template>
          <b-dropdown-item @click="changeBasemap('relief_map')">地形图</b-dropdown-item>
          <b-dropdown-item @click="changeBasemap('image_map')">卫星图</b-dropdown-item>
          <b-dropdown-item @click="changeBasemap('vector_map')">矢量图</b-dropdown-item>
        </b-dropdown>
      </div>
      <b-button-group class="zoom-buttons" vertical>
        <b-button variant="light" @click="zoomIn">+</b-button>
        <b-button variant="light" @click="zoomOut">-</b-button>
      </b-button-group>
    </div>

    <upload-form
      class="upForm"
      @close-form="formFlag = false"
      v-if="formFlag"
    ></upload-form>
  </div>
</template>

<script>
import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import * as olProj from "ol/proj";
import { Fill, Stroke, Style, Icon, Circle, Text } from "ol/style";
import View from "ol/View.js";
import XYZ from "ol/source/XYZ";
import WMTS from "ol/source/WMTS";
import { BIcon, BIconMap, BIconUpload, BIconBrush } from "bootstrap-vue";
import UploadForm from "./uploadform.vue";

// import OSM from "ol/source/OSM";
// import Tile from "ol/Tile";

const key = "39cf8c6b5e6e18abe0d8ce6b63edd2bd";
// 矢量 
const vecUrl =
  "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s,m&gl=CN&x={x}&y={y}&z={z}";
// 卫星
const imgUrl =
  "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s,m&gl=CN&x={x}&y={y}&z={z}";
// 地形
const terUrl =
  "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=p,m&gl=CN&x={x}&y={y}&z={z}";


export default {
  name: "mapHome",
  components: {
    BIcon,
    BIconMap,
    BIconUpload,
    BIconBrush,
    UploadForm,
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
          center: olProj.transform([104.06, 30.67], 'EPSG:4326', 'EPSG:3857'),
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
.map {
  width: 100%;
  height: 100%;
  position: relative;
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
.changeMap {
  position: absolute;
  right: 3%;
  top: 5%;
  z-index: 2;
}
.changeMap button {
  font-size: 1.5rem;
}
.sysContainer {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  height: 800px;
}
.diTuDrop button {
  background-color: var(--main-bg-color);
}
.navBar {
  display: flex;
  align-items: center;
  width: 100%;
  height: 80px;
  background-color: var(--main-bg-color);
}
.title {
  color: white;
  font-size: 2rem;
  margin-left: 1rem;
}
.docManageBar {
  position: absolute;
  bottom: 50%;
  left: 2%;
  z-index: 2;
}
.docManageBar button {
}
.docManageBar button:hover {
  background: lightblue;
}
.upForm {
  position: absolute;
  left: 20%;
  top: 20%;
  width: 60%;
  height: auto;
  background-color: #fff;
  padding: 2em;
  padding-top: 3em;
  border-radius: 0.3em;
  z-index: 3;
}
</style>
