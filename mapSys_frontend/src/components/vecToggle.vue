<template>
  <div class="outter">
    <h5>切换地图</h5>
    <div class="tileMap" >
      <div class="vector" @click="changeBasemap('vector_map')" >
        <span>矢量图</span>
      </div>
      <div class="topographic" @click="changeBasemap('relief_map')">
        <span>地形图</span>
      </div>
      <div class="satellite" @click="changeBasemap('image_map')">
        <span>卫星图</span>
      </div>
    </div>
    <hr class="divider">
    <div class="vecMap">
      <h5>矢量图层</h5>
      <el-checkbox-group v-model="vecLayerList" @change="onChange" class="checkboxes">
        <el-checkbox class="checkbox" label="缓冲区矢量图层"></el-checkbox>
        <el-checkbox class="checkbox" label="设施矢量图层"></el-checkbox>
        <el-checkbox class="checkbox" label="路段矢量图层"></el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  name:'tab',

  data(){
    return{

      vecLayerList:["缓冲区矢量图层","设施矢量图层","路段矢量图层"],
    }
  },
  methods:{
    onChange(){
      console.log(this.vecLayerList)
      this.$eventBus.$emit("chgVecLayer", this.vecLayerList)
    },
    changeBasemap(mapType) {
      this.$eventBus.$emit("chgTileMap", mapType);
    },
  }
}
</script>

<style scoped>
.tileMap{
  color: black;
}
.tileMap div{
  width: 100%;
  color: black;
}
.tileMap div{
  width: 90%;
  height: 90px;
  margin: 10px auto;
  color:#0a360e;
  border-radius: 3%;
}
.tileMap div:hover{
  border: solid 1px grey;
  cursor: pointer;
}
.tileMap span{
  background-color: #fff;;
}
.divider{
  width: 100%;
  background: black;
}
.vector{
  background-image: url(../assets/vector.png);
  background-position: center;
  background-size: cover;
}
.topographic{
  background-image: url(../assets/dixing.png);
  background-position: center;
  background-size: cover;
}
.satellite{
  background-image: url(../assets/weixing.png);
  background-position: center;
  background-size: cover;
}
.outter{
  padding: 20px;
}
.checkboxes{
  display: flex;
  flex-direction: column;
}
.checkboxes .checkbox{
  margin: 5px;
}
</style>