<template>
  <div id="app">
    <nav-bar class="header"></nav-bar>
    <map-home class="content"></map-home>
  </div>
</template>

<script>
import NavBar from "@/components/navBar.vue";
import MapHome from "@/components/mapHome.vue"
export default {
  name: "App",
  components: {
    NavBar,
    MapHome,
  },
};
</script>

<style lang="scss" scoped>
* {
  --main-bg-color: rgb(42, 154, 230);
}
#app{
  width: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  .header{
    height: 60px;
  }
  .content{
    width: 100%;
    flex-grow: 1;
  }
}
</style>
