<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand href="#" @click="backHome">WebGIS多源异构数据管理系统</b-navbar-brand>
      <b-navbar-nav class="navbarItems">
        <b-nav-item>
          <b-icon icon="upload"></b-icon> 
            <router-link :to="{name:'upload'}">上传文件</router-link>
          </b-nav-item
        >
        <b-nav-item>
          <router-link :to="{name:'files'}">数据展示</router-link>
        </b-nav-item>

        <b-nav-item-dropdown text="编辑要素" right>
          <b-dropdown-item>添加高铁线路</b-dropdown-item>
          <b-dropdown-item>添加线路站点</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="编辑要素" right>
          <template #button-content> <b-icon icon="map"></b-icon> </template>
          <b-dropdown-item @click="changeBasemap('relief_map')">地形图</b-dropdown-item>
          <b-dropdown-item @click="changeBasemap('image_map')">卫星图</b-dropdown-item>
          <b-dropdown-item @click="changeBasemap('vector_map')">矢量图</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import { BIcon, BIconMap, BIconUpload, BIconBrush } from "bootstrap-vue";
export default {
  components: {
    BIcon,
    BIconMap,
    BIconUpload,
    BIconBrush,
  },
  methods:{
    backHome(){
      console.log('fawjifjwioa')
      this.$router.push("/")
    }
  },
};
</script>

<style>
.navbarItems a{
  color: rgb(233, 228, 228);
  text-decoration: none;
}
</style>