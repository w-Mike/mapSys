<template>
  <div>
    <el-menu class="navMenu el-menu-vertical-demo"  :collapse="true">
      <el-menu-item index="1" @click="$router.push({'name':'upload'})">
        <i class="el-icon-document"></i>
        <span slot="title">文件</span>
      </el-menu-item>

      <el-menu-item index="2" @click="sysMode = 'none'">
        <i class="el-icon-guide"></i>
        <span slot="title">设施</span>
      </el-menu-item>

      <el-menu-item index="3" @click="sysMode = 'edit'">
        <i class="el-icon-edit"></i>
        <span slot="title">添加设施</span>
      </el-menu-item>

      <el-menu-item index="4" @click="sysMode = 'corre'">
        <i class="el-icon-connection"></i>
        <span slot="title">添加关联</span>
      </el-menu-item>
    </el-menu>

    <div id="map"></div>

    <div class="toggleLayer menuToggle" :class="isShowTab ? 'menuShow' : 'menuHidden'"  @click="showTab">
      <img src="@/assets/layers.svg" alt="layers" />
    </div>

    <div class="menu menuZoom" :class="isShowTab ? 'menuShow' : 'menuHidden'">
      <div class="menuItem" @click="zoomIn">
        <p>+</p>
      </div>
      <div class="menuItem" @click="zoomOut">
        <p>-</p>
      </div>
    </div>

    <tab
      class="tab"
      v-show="isShowTab"
      :class="isShowTab ? 'tabShow' : 'tabHidden'"
    ></tab>

    <div id="mouse-position" class="coor"></div>

    <div class="modeDiv editDiv" v-if="sysMode == 'edit'" >
      <el-select v-model="editType" placeholder="请选择">
        <el-option
          label="点要素"
          value="Point">
        </el-option>
        <el-option
          label="线要素"
          value="LineString">
        </el-option>
        <el-option
          label="面要素"
          value="Polygon">
        </el-option>
      </el-select>
      <el-button-group class="btns">
        <el-button icon="el-icon-edit" @click="drawFeature"></el-button>
        <el-button icon="el-icon-refresh-left" @click="undoFeature"></el-button>
        <!-- <el-button icon="el-icon-delete" @click="dltFeature" :disabled="isDrawing"></el-button> -->
        <!-- <el-button type="primary" icon="el-icon-upload2" @click="uploadFeature" ></el-button> -->
      </el-button-group>
    </div>

    <div class="modeDiv correDiv" v-if="sysMode == 'corre'">
      <el-select placeholder="请选择要关联的设施">
        <el-option
          label="点要素"
          value="Point">
        </el-option>
      </el-select>
      <el-button-group class="btns">
        <el-button icon="el-icon-mouse" @click="chooseFeatures">选择路段</el-button>
        <el-button type="primary" icon="el-icon-connection" @click="makeCorre">关联设施</el-button>
      </el-button-group>
    </div>


    <div class="upfeatureForm" v-if="upfeatureForm">
      <el-form class="formContent" ref="form" :model="featureForm" :action="onfeatureSubmit" label-width="80px">
        <!-- id  设施名  设施描述  设施类别  要素类别  几何要素 -->

        <el-form-item label="设施名">
          <el-input v-model="featureForm.faciname"></el-input>
        </el-form-item>

        <el-form-item label="设施描述">
          <el-input v-model="featureForm.facidesc"></el-input>
        </el-form-item>

        <el-form-item label="设施类别">
          <el-select v-model="featureForm.facitype">
            <el-option v-for="(type,index) in faciType" :label="type" :value="type" :key="index"></el-option>
          </el-select>
        </el-form-item>
        
        <div class="formbtns">
          <el-button @click="dltFeature">取消</el-button>
          <el-button type="primary" @click="onfeatureSubmit">提交</el-button>
        </div>

      </el-form>
    </div>
  </div>
</template>
<script>
import tab from "@/components/tab.vue";
import {request} from '@/utils/request'
import {postFeature} from "@/utils/api"

// 引入openlayer的包
import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Style, Stroke } from "ol/style";
import View from "ol/View.js";
import WKB from "ol/format/WKB.js";
import XYZ from "ol/source/XYZ";
import MousePosition from "ol/control/MousePosition.js";
import { createStringXY } from "ol/coordinate.js";
import { defaults as defaultControls } from "ol/control.js";
import WKT from 'ol/format/WKT.js';
import {Draw, Modify, Snap, Select} from 'ol/interaction.js';
import {get} from "ol/proj";



// 矢量 卫星 地形
const vecUrl = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=m&gl=CN&x={x}&y={y}&z={z}";
const imgUrl = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=y,m&gl=CN&x={x}&y={y}&z={z}";
const terUrl = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=p,m&gl=CN&x={x}&y={y}&z={z}";

export default {
  name: "mapHome",
  components: {
    tab,
  },
  data() {
    return {
      featureForm:{
        faciname:"",
        facidesc:"",
        facitype:"",
        featuretype:"",
        geom:"",
      },
      facilitiesName:[],
      faciType:[
        "路基","隧道","桥梁","轨道",
        "车站","信号设备","通信设备",
        "安全监控设备","检测设备","自然灾害预报与防治设备",
      ],

      map: null,
      tileLayer_vec: null,
      tileLayer_img: null,
      tileLayer_ter: null,
      vecLayer_buffer: {},
      vecLayer_line_segs: {},
      vecLayer_facilities:{},

      lineSegFeatures: {},
      facilityFeatures:{},


      isShowTab: false,

      select: null,
      mousePositionControl: null,

      addSegLayersFlag: false,
      loading:null,


      editVecSource:null,
      editVecLayer:null,
      draw:null,      
      drawingFeature:null,
      editType:'Point',
      editBtnText:"编辑",
      isDrawing:false,

      sysMode:'none',
      upfeatureForm:false,
    };
  },
  mounted() {
    this.$eventBus.$on("chgTileMap", (mapType) => this.changeBasemap(mapType));
    this.$eventBus.$on("showTab", () => this.isShowTab = !this.isShowTab);
    this.$eventBus.$on("chgVecLayer", (vecLayerList)=>{
      let vecLayermapping = {
        "缓冲区矢量图层":this.vecLayer_buffer,
        "设施矢量图层":this.vecLayer_facilities,
        // "路段矢量图层":this.vecLayer_line_segs,
      }
      for(let key in vecLayermapping){
        if(vecLayermapping.hasOwnProperty(key)){
          vecLayerList.includes(key)? 
          vecLayermapping[key].setVisible(true) : vecLayermapping[key].setVisible(false)
        }
      }
    })
    this.initMap();
  },
  watch:{
    editType:{
      handler(){
        this.isDrawing=false
      }
    },
    isDrawing:{
      handler(newVal, oldVal){
        if(!newVal){
          this.map.removeInteraction(this.draw);
          this.draw = null;
        }
      }
    }
  },
  methods: {
    onfeatureSubmit(){
      let strwkt = new WKT().writeFeature(this.drawingFeature, {
        dataProjection: "EPSG:4326",  
        featureProjection: "EPSG:3857",
      });
      this.featureForm.geom = strwkt
      this.featureForm.featuretype = this.drawingFeature.getGeometry().getType()

      postFeature(this.featureForm).then(res=>{
        console.log(res)
        this.$message({message:'设施成功上传至数据库', type:'success'});
        this.upfeatureForm = false
      }).catch(error=>{
        console.log(error)
        this.$message({message:'设施添加失败，终端查看错误信息', type:'error'});
      })

    },
    drawFeature(){
      this.isDrawing = !this.isDrawing
      if(this.isDrawing){
        this.draw = new Draw({
          source: this.editVecSource,
          type: this.editType,
        });
        this.map.addInteraction(this.draw);
      // 绘制完成
        this.draw.on("drawend", e => {
          this.drawingFeature =  e.feature
          this.map.removeInteraction(this.draw);
  
          this.featureForm.geom = new WKT().writeFeature(this.drawingFeature, {
            dataProjection: "EPSG:4326",  
            featureProjection: "EPSG:3857",
          });
          console.log(this.featureForm.geom)
          this.draw = null;
          this.isDrawing = false
          this.upfeatureForm=true
        });
      }
    },
    undoFeature(){
      if(this.draw){
        this.draw.removeLastPoint();
      }
    },
    dltFeature(){
      this.editVecSource.removeFeature(this.drawingFeature)
      console.log(this.editVecSource.getFeatures())
      this.upfeatureForm =false
    },
    lineSegs_wkbHandler(lineSegments) {
      return lineSegments.map((wkbItem) => {
        const format = new WKB();
        let feature = format.readFeature(wkbItem.geom, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        });
        feature.setId(wkbItem.gid);
        feature.set("length", wkbItem["shape_leng"]);
        return feature;
      });
    },
    faci_wkbHandler(facilities){
      return facilities.map((faci) => {
        const format = new WKB()
        let feature = format.readFeature(
          faci.geom, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",}
        )
        feature.setId(faci.fid);
        feature.set('faciname', faci.faciname)
        feature.set("facitype", faci.facitype)
        feature.set("facidesc", faci.facidesc)
        return feature
      })
    },
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
    showTab() {
      this.$eventBus.$emit("showTab");
    },
    funcConfig(){
      this.loading = this.$loading.service({
          lock: true,
          text: '绘制矢量数据中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
      });
      this.mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: "EPSG:4326",
        target: document.getElementById("mouse-position"),
      });
    },
    loadEditLayer(){
      this.editVecSource = new VectorSource({wrapX:false})
      this.editVecLayer = new VectorLayer({source:this.editVecSource})
    },

    // createVecLayer(config){
    //   // config: source(features)  style
    //   return new VectorLayer({
    //     source: new VectorSource({
    //       features:config.features,
    //     }),
    //     style: config.style
    //   })
    // },
    async initMap() {

      // 加载图层， 设置鼠标坐标
      this.loadTileLayer();
      this.loadVecLayer();
      this.funcConfig()
      this.loadEditLayer()
      if(this.addSegLayersFlag){
        let res = await request.get('/splitline')
        this.lineSegFeatures = this.lineSegs_wkbHandler(res.data);
        this.vecLayer_line_segs = new VectorLayer({
          source: new VectorSource({
            features: this.lineSegFeatures,
          }),
          style: new Style({
            stroke: new Stroke({
              color: "rgb(254, 255, 134)",
              width: 3,
              lineCap: "round",
              lineJoin: "round",
            }),
          }),
        })
      }

      let facilitiesRes = await request.get('/facilities')

      this.facilityFeatures = this.faci_wkbHandler(facilitiesRes.data);
      // console.log(facilityFeatures)
      this.vecLayer_facilities = new VectorLayer({
        source: new VectorSource({
          features: this.facilityFeatures,
          style: new Style({
            fill: new Fill({
              color: "rgb(12, 32, 134)",
            }),
            stroke: new Stroke({
              color: "rgb(254, 255, 134)",
              width: 3,
              lineCap: "round",
              lineJoin: "round",
            }),
          }),
        })
      })



      this.map = new Map({
        layers: [
          this.tileLayer_vec,
          this.tileLayer_img,
          this.tileLayer_ter,

          this.vecLayer_buffer,
          this.vecLayer_facilities,

          this.editVecLayer
        ],
        target: "map",
        view: new View({
          center: [10895116, 3563181],
          zoom: 7,
        }),
        controls: defaultControls().extend([this.mousePositionControl]),
      });

      if(this.addSegLayersFlag){
        this.map.addLayer(this.vecLayer_line_segs)
      }

      this.changeBasemap("vector_map");
      this.loading.close()
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
          url: "./data/buff50km.json",
          format: new GeoJSON(),
        }),
        style: new Style({
          fill: new Fill({
            color: "rgba(165, 215, 232, 0.7)",
          }),
          stroke: new Stroke({
            color: "rgb(87, 108, 188)",
            width: 1,
          }),
        }),
      })
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
* {
  --main-bg-color: rgb(42, 154, 230);
  margin: 0;
}
#map {
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
.ol-zoom {
  visibility: hidden;
}
.ol-rotate {
  visibility: hidden;
}

.menu {
  width: 40px;
  position: absolute;
  right: 0%;
  div {
    display: flex;
    align-items: center;
    height: 40px;
    color: white;
    text-align: center;
    opacity: 60%;
    background-color: black;
  }
  p {
    font-size: 27px;
    margin: 0 auto;
  }
  div:hover {
    background-color: rgb(9, 139, 9);
    opacity: 100%;
  }
  img {
    margin: 0 auto;
  }
  div:first-child {
    border-top-left-radius: 15%;
  }
  div:last-child {
    border-bottom-left-radius: 15%;
  }
}
.menuZoom{
  top: 80%;
}


.menuShow {
  right: 20%;
}
.menuHidden {
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
.coor {
  position: absolute;
  width: auto;
  height: 20px;
  left: 45%;
  bottom: 1%;
  border: 1px solid white;
  border-radius: 15px;
  text-align: center;
  padding: 5px;
  background-color: rgba(219, 228, 198, 0.7);
  color: rgb(64, 81, 59);
}

.toggleLayer{
  width: 40px;
  height: 40px;

  position: absolute;
  top: 20%;
  display: flex;

  background-color: black;
  opacity: 60%;
  border-top-left-radius: 15%;
  border-bottom-left-radius: 15%;

  img{
    margin: auto;
  }
}

.toggleLayer:hover{
  background-color: rgb(9, 139, 9);
  opacity: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.modeDiv{
  position: absolute;
  top: 10%;
  display: flex;
}
.btns{
  margin-left: 10px;
}

.correDiv{
  left: 35%;
}

.editDiv{
  left: 40%;
}

.upfeatureForm{
  width: 30%;
  height: 45%;
  position: absolute;
  top: 27%;
  left: 35%;
  background-color: #fff;
  display: flex;
  padding-top: 30px;
  
  .formContent{
    margin: 0;
    position:relative;
    flex-grow: 1;
  }
  .formbtns{
    display: flex;
    justify-content: right;
  }
}
</style>
