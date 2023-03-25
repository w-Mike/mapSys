<template>
  <div>
    <div id="map"></div>

    <div class="menu" :class="isShowTab? 'menuShow':'menuHidden'">
      <div class="menuItem" @click="zoomIn">
        <p>+</p>
      </div>
      <div class="menuItem" @click="zoomOut">
        <p>-</p>
      </div>
      <div class="menuItem" @click="showTab">
        <img src="@/assets/layers.svg" alt="layers" >
      </div>
    </div>

    <tab class="tab" v-show="isShowTab" :class="isShowTab ? 'tabShow' : 'tabHidden'"></tab>
  </div>
</template>
<script>
import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";

import * as olProj from "ol/proj";
import { Fill,  Style } from "ol/style";
import View from "ol/View.js";
import XYZ from "ol/source/XYZ";
import tab from '@/components/tab.vue'

// 矢量 卫星 地形
const vecUrl = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=m&gl=CN&x={x}&y={y}&z={z}";
const imgUrl = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=y,m&gl=CN&x={x}&y={y}&z={z}";
const terUrl = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=p,m&gl=CN&x={x}&y={y}&z={z}";

export default {
  name: "mapHome",
  components: {
    tab
  },
  data() {
    return {
      map:null,
      tileLayer_vec: null,
      tileLayer_img: null,
      tileLayer_ter: null,

      vecLayer_buffer: null,
      vectorLayer_centerLine: null,
      VectorLayer_centerLine_seg: null,
      vectorLayer_allLine_seg: null,

      isShowTab:false
    };
  },
  mounted() {
    this.initMap(); 
    this.changeBasemap('vector_map')

    this.$eventBus.$on('chgTileMap', (mapType) => this.changeBasemap(mapType))
    this.$eventBus.$on('showTab', () => {this.isShowTab= !this.isShowTab})
  },
  methods: {

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
        this.tileLayer_ter.setVisible(true);
        this.tileLayer_img.setVisible(false);
        this.tileLayer_vec.setVisible(false);
      } else if (main_basemap_type == "image_map") {
        this.tileLayer_ter.setVisible(false);
        this.tileLayer_img.setVisible(true);
        this.tileLayer_vec.setVisible(false);
      } else if (main_basemap_type == "vector_map") {
        this.tileLayer_ter.setVisible(false);
        this.tileLayer_img.setVisible(false);
        this.tileLayer_vec.setVisible(true);
      }
    },
    showTab(){
      this.$eventBus.$emit('showTab')      
    },
    initMap() {
      this.loadTileLayer();
      this.loadVecLayer();
      this.map = new Map({
        layers: [
          this.tileLayer_vec,
          this.tileLayer_img,
          this.tileLayer_ter,
        ],
        target: "map",
        view: new View({
          center: olProj.transform([104.06, 30.67], "EPSG:4326", "EPSG:3857"),
          zoom: 6,
        }),
      });
    },
    loadTileLayer() {
      this.tileLayer_vec = new TileLayer({
        name: "矢量图",
        source: new XYZ({
          url: vecUrl,
        }),
      });

      this.tileLayer_img = new TileLayer({
        name: "卫星图",
        source: new XYZ({
          url: imgUrl,
        }),
      });

      this.tileLayer_ter = new TileLayer({
        name: "地形图",
        source: new XYZ({
          url: terUrl,
        }),
      });
    },
    loadVecLayer() {
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
    },
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
* {
  --main-bg-color: rgb(42, 154, 230);
  margin: 0;
}
#map{
  width: 100%;
  height: 661px;
}
/* #map:focus {
  outline: #4a74a8 solid 0.15em;
} */
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
.ol-zoom{
  visibility: hidden;
}
.ol-rotate{
  visibility: hidden;
}

.menu{
  width: 40px;
  position: absolute;
  top:30%;
  right: 0%;
  div{
    display: flex;
    align-items: center;
    height: 40px;
    color: white;
    text-align: center;
    opacity: 60%;
    background-color:black;
  }
  p{
    font-size: 27px;
    margin: 0 auto;
  }
  div:hover{
    background-color: rgb(9, 139, 9);
    opacity: 100%;
  }
  img{
    margin:0 auto;
  }
  div:first-child{
    border-top-left-radius: 15%;
  }
  div:last-child{
    border-bottom-left-radius: 15%;
  }
}

.menuShow{
  right: 20%;
}
.menuHidden{
  right: 0%;
}

// 关于tab的样式
.tab {
  position: absolute;
  left: 80%;
  width: 20%;
  height: 661px;
  top: 60px;
  box-sizing: border-box;
  background-color: #fcfbf8;
}
.tabShow {
  left: 80%;
}
.tabHidden {
  left: 80%;
}
</style>
