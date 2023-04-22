<template>
  <div id="app">
    <nav-bar class="header"></nav-bar>
    <keep-alive include="home">
      <router-view class="content"></router-view>
    </keep-alive>

  </div>
</template>

<script>
import NavBar from "@/components/navBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
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
