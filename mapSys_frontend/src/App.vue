<template>
  <div id="app" >
    <div class="maincontent">
      <nav-bar></nav-bar>
      <map-content class="map"></map-content>  
      <router-view class="routerview"></router-view>
    </div>
    <!-- <upload-form
        class="upForm" 
        v-if="store.formFlag"
    ></upload-form> -->
  </div>
</template>

<script>
import NavBar from '@/components/navBar.vue'
import MapContent from "@/components/mapContent.vue"

export default {
  name:'App',
  components:{
    NavBar,
    MapContent
  },
  data(){
    return{
    }
  },

};
</script>

<style lang="scss" scoped>
* {
  --main-bg-color: rgb(42, 154, 230);
  margin: 0;
}
.map {
  width: 100%;
  height: 100%;
  position: relative;
}
.maincontent {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  height: 935px;
}
.routerview {
  position: absolute;
  top: 56px;
  width: 100%; 
  height: 935px;
  background-color: #fff;
  padding: 2em;
  padding-top: 2em;
  z-index: 2;
}

</style>
