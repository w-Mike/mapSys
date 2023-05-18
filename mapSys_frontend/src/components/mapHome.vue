<template>
  <div class="container">
    <div class="left">
      <el-menu class="navMenu el-menu-vertical-demo" style="background-color:#faf8f1"  :collapse="true">
        <el-menu-item index="1" @click="filesToggle">
          <i class="el-icon-document"></i>
          <span slot="title">文件列表</span>
        </el-menu-item>

        <el-menu-item index="2" @click="updocToggle">
          <i class="el-icon-upload2"></i>
          <span slot="title">上传文件</span>
        </el-menu-item>

        <el-menu-item index="3" @click="facsToggle">
          <i class="el-icon-guide"></i>
          <span slot="title">设施列表</span>
        </el-menu-item>

        <el-menu-item index="4" @click="sysMode = 'edit'">
          <i class="el-icon-edit"></i>
          <span slot="title">添加设施</span>
        </el-menu-item>

        <el-menu-item index="5" @click="()=>{sysMode = 'corre'; isDrawing = false;}" >
          <i class="el-icon-connection"></i>
          <span slot="title">添加关联</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right">
      <div id="map"></div>

      <template>
        <div id="mouse-position" class="coor"></div>

        <div class="toggleLayer menuToggle" :class="isShowRightTab ? 'menuShow' : 'menuHidden'"  @click="isShowRightTab=!isShowRightTab">
          <img src="@/assets/layers.svg" alt="layers" />
        </div>
        <vec-toggle
          class="tab"
          v-show="isShowRightTab"
        ></vec-toggle>

        <div class="menuZoom menu" :class="isShowRightTab ? 'menuShow' : 'menuHidden'">
          <div class="menuItem" @click="zoomIn">
            <p>+</p>
          </div>
          <div class="menuItem" @click="zoomOut">
            <p>-</p>
          </div>
        </div>
        
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
            <el-button icon="el-icon-refresh-left" @click="undoDrawing"></el-button>
          </el-button-group>
        </div>

        <div class="upFeatureFormCon" v-show="upfeaFormFlag">
          <div class="upfeatureForm">
            <el-form class="formContent" ref="form" :model="featureForm" :action="onfeatureSubmit" label-width="80px">
              <el-form-item label="设施名">
                <el-input v-model="featureForm.faciname"></el-input>
              </el-form-item>

              <el-form-item label="设施描述">
                <el-input 
                  v-model="featureForm.facidesc"
                  rows="3"
                  type="textarea"
                ></el-input>
              </el-form-item>

              <el-form-item label="设施类别">
                <el-select v-model="featureForm.facitype">
                  <el-option v-for="(type,index) in faciType" :label="type" :value="type" :key="index"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="设施图片" required>
                <el-upload
                  action=""

                  :before-remove="beforeRemove"
                  :on-remove="handleRemove"
                  :on-change="fileChange"

                  :auto-upload="false"
                  :multiple="false" 
                  :limit="1"

                  :file-list="featureForm.file"
                  >
                  <el-button type="success">选择文件</el-button>   <span>(仅允许上传一个图片)</span>
              </el-upload>
              </el-form-item>
                
              <div class="formbtns">
                <el-button @click="dltDrawedFeature">取消</el-button>
                <el-button type="primary" @click="onfeatureSubmit">提交</el-button>
              </div>
            </el-form>
          </div>
        </div>

        <div class="modeDiv correDiv" v-if="sysMode == 'corre'">
          <el-select v-model="isCorreingFaciId" placeholder="请选择要关联的设施">
            <el-option v-for="(faci, index) in facInfos" :label="faci.faciname"  :value="faci.fid" :key="index"> </el-option>
          </el-select>
          <el-button-group class="btns">
            <el-button icon="el-icon-mouse" @click="chooseFeatures">选择路段</el-button>
            <el-button type="primary" icon="el-icon-connection" @click="makeCorre">关联设施</el-button>
          </el-button-group>
        </div>
      </template>

      <div class="leftTab" v-show="showLeftTabFlag">
        <router-view :facInfos="facInfos"></router-view>
      </div>

      <!-- 设施信息 -->
      <div class="facInfoCon" v-show="facInfoShowFlag" @click="facInfoShowFlag = !facInfoShowFlag">
        <div class="temp" @click.stop="">
          <fac-info class="facinfo" :facinfoId="facinfoId" :reqData="facInfoShowFlag" @dltFaci="handleDltFaci"></fac-info>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import VecToggle from "@/components/vecToggle.vue"
import FacInfo from "@/components/facInfo.vue"

import {request} from '@/utils/request'
import {postFeature, postCorre, getfacinfobyid, dltfacbyId} from "@/utils/api"
import { nanoid } from 'nanoid'

// 引入openlayer的包
import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Style, Stroke, Circle, Icon} from "ol/style";

import View from "ol/View.js";
import WKB from "ol/format/WKB.js";
import XYZ from "ol/source/XYZ";
import { createStringXY } from "ol/coordinate.js";
import WKT from 'ol/format/WKT.js';
import {Draw, Select} from 'ol/interaction.js';
import { click, platformModifierKeyOnly } from 'ol/events/condition';
import {Control,  defaults as defaultControls, FullScreen, OverviewMap, ScaleLine, ZoomSlider, ZoomToExtent, MousePosition} from 'ol/control.js';

// 设施id  

// 矢量 卫星 地形
const vecUrl = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=m&gl=CN&x={x}&y={y}&z={z}";
const imgUrl = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=y,m&gl=CN&x={x}&y={y}&z={z}";
const terUrl = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=p,m&gl=CN&x={x}&y={y}&z={z}";

export default {
  name: "mapHome",
  components: {
    VecToggle,
    FacInfo
  },
  data() {
    return {
      featureForm:{
        fid:"",
        faciname:"",
        facidesc:"",
        facitype:"",
        featuretype:"",
        geom:"",

        file:[],
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
      facilitySource:{},

      facInfos:[
        
      ],

      isShowRightTab: false,

      // select: null,
      mousePositionControl: null,

      addSegLayersFlag: true,
      loading:null,

      // 绘制功能数据
      editVecSource:null,
      editVecLayer:null,
      draw:null,      
      drawingFeature:null,
      editType:'Point',
      editBtnText:"编辑",
      isDrawing:false,

      sysMode:'none',
      upfeaFormFlag:false,


      // 关联功能数据
      isCorreingFaciId:"",
      vecLayerCorre:null,
      vecSourceCorre:null,
      correSelect:null,
      correDraw:null,
      selectedFeatureIDs:[],
      postCorreData:{
        "fid": "",
        "segIds": new Set()
      },

      // 设施信息显示功能
      facSelect:null,
      
      showLeftTabFlag:false,

      facinfoId:"",

      facInfoShowFlag:false,
    };
  },
  mounted() {
    this.$eventBus.$on("dltFeature", (fid)=>{
      this.handleDltFaci(fid)
      this.removeHlLayer()
    })
    this.$eventBus.$on("movetoFaci", (facid)=>{
        this.clearCorreDraw()
        let feature = this.getFaciFeatureById(facid)
        this.positionExtent(feature)
    })
    this.$eventBus.$on("chgTileMap", (mapType) => this.changeBasemap(mapType));

    this.$eventBus.$on("chgVecLayer", (vecLayerList)=>{
      let vecLayermapping = {
        "缓冲区矢量图层":this.vecLayer_buffer,
        "设施矢量图层":this.vecLayer_facilities,
        "路段矢量图层":this.vecLayer_line_segs,
      }
      for(let key in vecLayermapping){
        if(vecLayermapping.hasOwnProperty(key)){
          vecLayerList.includes(key)? 
          vecLayermapping[key].setVisible(true) : vecLayermapping[key].setVisible(false)
        }
      }
    })

    this.$eventBus.$on("dltFile", (facid, docid)=>{
      let sessionitem
      if(sessionitem = JSON.parse(sessionStorage.getItem(facid))){
        let dltindex
        sessionitem.files.forEach((item, index)=>{
          if(item.id == docid){
            dltindex = index
          }
        }) 

        if(dltindex !== undefined){
          sessionitem.files.splice(dltindex, 1)
        }
        sessionStorage.setItem(facid, JSON.stringify(sessionitem))
      }
    })
    this.$eventBus.$on("addFile",(facid)=>{
      getfacinfobyid({"id": facid}).then(res=>{
        sessionStorage.setItem(facid, JSON.stringify({
          "facinfo":res.data.facinfo,
          "files":res.data.docinfo
        }))
      })
    })

    this.$eventBus.$on("backHome", ()=>{
      this.showLeftTabFlag = false
      this.isShowRightTab = false
      this.sysMode='none'
    })

    this.initMap();
  },
  watch:{
    sysMode:{
      handler(newVal){
        if(newVal === "none"){
          this.clearCorreDraw()
          this.removeHlLayer()
          this.isDrawing=false
        }
        if(newVal == 'edit' || newVal =='corre'){
          this.showLeftTabFlag = false
        }

        // leftTab Router: files facs upfile  
        if(newVal !== "files"){

        }
        if(newVal !== "facs"){
          this.removeHlLayer()
        }
        if(newVal !== "upfile"){

        }
        // edit corre

        if(newVal !== "edit"){
          this.isDrawing=false
        }
        if(newVal !== "corre"){

          this.clearCorreDraw()
          if(this.facSelect === null){
            this.selectConfig()
          }
        }
        
        if(newVal === "corre"){
          this.map.removeInteraction(this.facSelect)
          this.facSelect = null
        }
      }
    },
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
    },
    isCorreingFaciId:{
      handler(newVal, oldVal){
        this.clearCorreDraw()
        let feature = this.getFaciFeatureById(newVal)
        this.postCorreData.fid = newVal
        this.positionExtent(feature)
      }
    }
  },
  methods: {
    handleDltFaci(facid){
      console.log("自定义事件中", facid)

      // 在设施图层中找到设施id为facid的设施要素，并将该要素移除图层
      this.facilitySource.removeFeature(this.getFaciFeatureById(facid))
      // facInfos是传输给设施列表路由组件的一个props,为一个数组，因为删除了该设施，故应该将facInfos中的该设施也删除。
      // facInfos的属性有 fid faciname facitype 和 facidesc
      let faciToRemoveId = this.facInfos.findIndex(obj => obj.fid === facid)
      if(faciToRemoveId !== -1){
        this.facInfos.splice(faciToRemoveId, 1)
      }
      console.log(this.facInfos)
      // facinfo的窗口显示flag应该被置false
      this.facInfoShowFlag = false
      // 删除localstorage中设施信息
      localStorage.removeItem(facid)

      // 删除高亮图层
      this.removeHlLayer()

      // 向后端发送请求，删除设施表中该设施
      dltfacbyId({'id':facid}).then(res=>{
        console.log("删除设施成功")

      }).catch(error=>{
        console.log("删除设施失败")
      })
    },
    fileChange(file,fileList) {
      this.featureForm.file.push(file.raw)
    },
    beforeRemove(file, fileList){
      this.featureForm.file.pop()
      return this.$confirm(`确定移除 ${ file.name }？`).then(()=>{
        this.featureForm.file.pop()
      }).catch(()=>{
        console.log("error")
      });
    },

    handleRemove(file, fileList){
      console.log(fileList)
    },
    facsToggle(){
      this.sysMode = 'facs'

      if(this.$route.name !== 'facs' && this.showLeftTabFlag){
        this.$router.push({'name':'facs'})
      }else{
        if(this.$route.name !== 'facs'){
          this.$router.push({'name':'facs'})
        }
        this.showLeftTabFlag = !this.showLeftTabFlag
      }
    },
    filesToggle(){
      this.sysMode = 'files'
      
      if(this.$route.name !== 'files' && this.showLeftTabFlag){
        this.$router.push({'name':'files'})
      }else{
        if(this.$route.name !== 'files'){
          this.$router.push({'name':'files'})
        }
        this.showLeftTabFlag = !this.showLeftTabFlag
      }
    },
    updocToggle(){
      this.sysMode = 'upfile'
      if(this.$route.name !== 'updoc' && this.showLeftTabFlag){
        this.$router.push({'name':'updoc'})
      }else{
        if(this.$route.name !== 'updoc'){
          this.$router.push({'name':'updoc'})
        }
        this.showLeftTabFlag = !this.showLeftTabFlag
      }
    },
    // ****添加设施功能****
    onfeatureSubmit(){
      let strwkt = new WKT().writeFeature(this.drawingFeature, {
        dataProjection: "EPSG:4326",  
        featureProjection: "EPSG:3857",
      });

      this.featureForm.geom = strwkt
      this.featureForm.featuretype = this.drawingFeature.getGeometry().getType()
      this.featureForm.fid = nanoid(10)

      let formData = new FormData();
      let keys = Object.keys(this.featureForm);

      keys.forEach((key) => {
        if(key !== "file"){
          formData.append(key, this.featureForm[key]);
        }else{
          if(this.featureForm[key].length!=0){
            formData.append(key, this.featureForm[key][0])
          }
        }
      });

      postFeature(formData).then(res=>{
        this.$message({message:'设施成功上传至数据库', type:'success'});

        this.upfeaFormFlag = false

        this.setFaciProperties(this.drawingFeature, this.featureForm)
        this.drawingFeature.setId(this.featureForm.fid)
        this.facilitySource.addFeature(this.drawingFeature)
        this.editVecSource.removeFeature(this.drawingFeature)

        this.featureForm = {
          fid:"",
          faciname:"",
          facidesc:"",
          facitype:"",
          featuretype:"",
          geom:"",

          file:[],
        }
      }).catch(error=>{
        console.log(error)
        this.$message({message:'设施添加失败，终端查看错误信息', type:'error'});
      })

    },
    drawFeature(){
      this.isDrawing = !this.isDrawing
      if(this.isDrawing){
        // 配置 Draw
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

          this.isDrawing = false
          this.upfeaFormFlag=true
        });
      }
    },
    undoDrawing(){
      if(this.draw){
        this.draw.removeLastPoint();
      }
    },
    dltDrawedFeature(){
      this.editVecSource.removeFeature(this.drawingFeature)
      this.upfeaFormFlag =false

      this.featureForm = {
          fid:"",
          faciname:"",
          facidesc:"",
          facitype:"",
          featuretype:"",
          geom:"",

          file:[],
        }
    },

    // ****设置关联功能****
    chooseFeatures(){
      if(this.isCorreingFaciId === ""){
        this.$message({message:'未选择要进行关联的设施', type:'error'});
        return 0
      }

      this.postCorreData['fid'] = this.isCorreingFaciId

      let isCorreingFaciFeature = this.getFaciFeatureById(this.isCorreingFaciId)
      let featureType = isCorreingFaciFeature.getGeometry().getType()

      this.postCorreData.segIds = new Set()
      if(featureType === "LineString" || featureType === "Point"){
        this.correSelect = new Select({
          condition: click,
          toggleCondition: platformModifierKeyOnly,
          layers:[this.vecLayer_line_segs],
          style: new Style({
            image: new Circle({
              radius: 3,
              fill: new Fill({
                  color: 'blue'
              })
            }),
            stroke: new Stroke({
              color: 'rgba(255,92,92)',
              // lineDash: [5],
              width: 10
            })
          })
        });

        this.map.addInteraction(this.correSelect)

        this.correSelect.on('select', (e) => {
          e.target.getFeatures().getArray().forEach(item=>{
            this.postCorreData.segIds.add(item.getId())
          })
        });

      }else if(featureType === "Polygon"){
        this.vecSourceCorre = new VectorSource()
        this.vecLayerCorre = new VectorLayer({
          source: this.vecSourceCorre,
          style: new Style({
            fill: new Fill({
              color: "rgba(56, 124, 73, 0.4)",
            }),
            stroke: new Stroke({
              color: 'rgba(255,92,92)',
              width: 8
            }),
          }),
        })
        this.map.addLayer(this.vecLayerCorre) 
        this.correSelect = new Select({
          style: new Style({
            stroke: new Stroke({
              color: 'rgba(22,92,92)',
              width: 3
            }),
          })
        })
        this.correDraw = new Draw({
          source: this.vecSourceCorre,
          type:"Polygon"
        })
        this.correDraw.on('drawstart', ()=>{
          this.correSelect.getFeatures().clear()
          this.vecLayerCorre.getSource().clear()
        })
    
        this.correDraw.on('drawend', (e)=>{
          let polygon = e.feature.getGeometry()
          let extent = polygon.getExtent()
          this.vecLayer_line_segs.getSource().forEachFeatureIntersectingExtent(extent, feature=>{
            this.correSelect.getFeatures().push(feature)
            this.vecLayerCorre.getSource().addFeature(feature)
            this.postCorreData["segIds"].add(feature.getId())
          })
        })
        this.map.addInteraction(this.correSelect)
        this.map.addInteraction(this.correDraw)
      }

 
    },
    makeCorre(){
      let postData =
      {
        fid:this.postCorreData.fid,
        segIds: Array.from(this.postCorreData.segIds)
      }
      
      postCorre(postData).then(res=>{
        this.$message({message:'成功添加关联', type:'success'});
      }).catch(error=>{
        this.$message({message:'添加关联失败', type:'error'});
        console.log(error)
      })

      this.postCorreData = {
        "fid": "",
        "segIds": new Set()
      }
      this.removeHlLayer()
      this.clearCorreDraw()
    },
    positionExtent(feature){
      // 移除高亮
      this.removeHlLayer()
      // 定位到该要素并高亮显示它
      let view = this.map.getView()
      view.fit(feature.getGeometry().getExtent(), {
        duration: 2000,//动画的持续时间,
        callback: function () {
        },
      })
      let highlightLayer = new VectorLayer({
        source:new VectorSource({
          features:[feature]
        }),
        style: new Style({
          fill: new Fill({
            color: "rgba(255,0,0,0.3)"
          }),
          stroke: new Stroke({
            color: "rgba(0, 255, 255)",
            width: 2
          }),
      
          image: new Circle({
            radius: 5,//半径
            fill: new Fill({//填充样式
            color: '#ff6688',
            })
          })

        })
      })
      highlightLayer.set("id", "hlLayer")
      this.map.addLayer(highlightLayer)
    },
    removeHlLayer(){
      let layerArr = this.map.getLayers().array_
      let oldLayer = {}
      layerArr.forEach(item=>{
        if(item.get("id") == "hlLayer"){
          oldLayer = item
        }
      })
      if(oldLayer){
        this.map.removeLayer(oldLayer)
      }
    },

    // ****更换底图功能****
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
    // ****方法函数****
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
    setFaciProperties(feature, faci){
      feature.set('faciname', faci.faciname)
      feature.set("facitype", faci.facitype)
      feature.set("facidesc", faci.facidesc)
      this.facInfos.push({
          "fid":faci.fid,
          "faciname":faci.faciname,
          "facitype": faci.facitype,  
          "facidesc":faci.facidesc        
      })
      localStorage.setItem(faci.fid, faci.faciname)
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
        this.setFaciProperties(feature, faci)
        return feature
      })
    },
    getFaciFeatureById(id){
      let retFeature = null
      this.facilitySource.getFeatures().forEach((item,index)=>{
        if(item.getId() === id){
          retFeature = item
        }
      })
      return retFeature
    },
    clearCorreDraw(){
      if(this.correSelect ){
        this.correSelect.getFeatures().clear()
      }
      if(this.vecLayerCorre){
        this.vecLayerCorre.getSource().clear()
      } 
      if(this.correSelect){
        this.map.removeInteraction(this.correSelect)
      }
      if(this.correDraw){
        this.map.removeInteraction(this.correDraw)
      }
    },
    
    // ****其他****
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
    
    // ****初始化使用的函数****
    async initMap() {
      // 加载图层， 设置鼠标坐标
      this.loadTileLayer();
      this.loadVecLayer();
      this.funcInitConfig()
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
              color: "#fea23d",
              width: 10,
            }),
          }),
        })
      }

      let facilitiesRes = await request.get('/facilities')

      this.facilityFeatures = this.faci_wkbHandler(facilitiesRes.data);
      this.facilitySource = new VectorSource({
          features: this.facilityFeatures,
          style: new Style({
            fill: new Fill({
              color: "rgb(12, 32, 134)",
            }),
            stroke: new Stroke({
              color: "rgb(254, 255, 134)",
              width: 3,
              // lineCap: "round",
              // lineJoin: "round",
            }),
          }),
        })
      this.vecLayer_facilities = new VectorLayer({
        source: this.facilitySource,
      })

      this.map = new Map({
        layers: [
          this.tileLayer_vec,
          this.tileLayer_img,
          this.tileLayer_ter,

          this.vecLayer_buffer,
          
        ],
        target: "map",
        view: new View({
          center: [10895116, 3563181],
          zoom: 7,
        }),
        controls: defaultControls({"zoom":false, "rotate":false}).extend(
          [
            this.mousePositionControl,
            // new FullScreen(),
            // new OverviewMap(),
            // new ScaleLine(),
            // new ZoomSlider(),
            // new ZoomToExtent()
          ]),
      });
      this.map.removeControl
      this.selectConfig()

      if(this.addSegLayersFlag){
        this.map.addLayer(this.vecLayer_line_segs)
      }
      this.map.addLayer(this.vecLayer_facilities)
      this.map.addLayer(this.editVecLayer)

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
    funcInitConfig(){
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
    selectConfig(){
      this.facSelect = new Select({
        condition: click,
        layers:[this.vecLayer_facilities],
        style: new Style({
          image: new Icon({
            src: '/location.svg',
          }),
          stroke: new Stroke({
            color: '#609966',
            width: 3
          }),
          fill: new Fill({ color: "#4e98f444" }),
        })
      });
      this.map.addInteraction(this.facSelect)

      this.facSelect.on('select', (e) => {
        let slFeature = e.target.getFeatures().getArray()[0]
        if(slFeature){
          // this.$router.push({name:'facinfo', params: {fid: slFeature.getId()} })
          if(!this.facInfoShowFlag){
            this.facInfoShowFlag = !this.facInfoShowFlag
          }
          this.facinfoId = slFeature.getId()
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

$mapheight: 671px;
* {
  --main-bg-color: rgb(42, 154, 230);
  margin: 0;
}

.container{
  min-width: 400px;
  height: 100%;
  display: flex;
  .right{
    position: relative;
    flex: 1;
  }
  .left{
    width: 65px;
    background-color: #faf8f1;    
  }
}

#map {
  width: 100%;
  // height: $mapheight;
  height: 100%;
}
/* #map:focus {
  outline: #4a74a8 solid 0.15em;
} */
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
  height: 100%;
  top: 0;
  box-sizing: border-box;
  background-color: #fcfbf8;
}
.coor {
  position: absolute;
  width: auto;
  color: rgb(64, 81, 59);

  right: 3%;
  bottom: 1%;
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
.modeDiv{
  position: absolute;
  top: 5%;
  display: flex;

  left: 50%;
  transform: translateX(-50%);
}
.btns{
  margin-left: 10px;
}
.upfeatureForm{
  width: 30%;
  height: 50%;

  position: absolute;
  top: 50%;
  left: 50%;
  transform:translate(-50%, -50%);

  border-radius: 30px;
  box-shadow: 0 0 3px rgba(1, 0, 1, 0.3);

  background-color: #fff;

  display: flex;
  padding: 50px;
  
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
.leftTab{
  position: absolute;
  top: 0%;
  left:0%;

  width: 40%;
  height: 100%;
  background-color: #fff;

  border-top-right-radius: 3%;
  border-bottom-right-radius: 3%;
  box-shadow: 0 0 3px rgba(1, 0, 1, 0.3);

  transition: all 0.2s ease;
}

.leftTabShow{
  transform: translateX(0);
  z-index: 5;
}
.facInfoCon{
  position: absolute;
  top: 0%;
  left: 0%;
  height: 100%;
  width: 100%;

  background: rgba(0,0,0,0.7);
}
.upFeatureFormCon{
  position: absolute;
  top: 0%;
  left: 0%;
  height: 100%;
  width: 100%;

  background: rgba(255,255,255,0.5);
}
.facinfo{
  opacity: 1;

  box-sizing: border-box;
  position: absolute;
  bottom:0%;
  width: 100%;
  height: 50%;
  // transform: translate(-50%, -50%);

  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
}

</style>
