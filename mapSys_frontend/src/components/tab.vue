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
    <divider class="divider"></divider>
    <div class="vecMap">
      <h5>矢量地图</h5>
    </div>
  </div>
</template>

<script>
import divider from '@/components/divider.vue'
export default {
  name:'tab',
  components:{
    divider
  },
  data(){
    return{

    }
  },
  methods:{
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
</style>