<template>
  <div id="app">

    <div class="container">
      <nav-bar class="header"></nav-bar>
      <keep-alive include="home">
        <router-view class="content"></router-view>
      </keep-alive>
    </div>


  </div>
</template>

<script>
import NavBar from "@/components/navBar.vue";
import tab from "@/components/tab.vue";

export default {
  name: "App",
  components: {
    NavBar,
    tab,
  },
  data() {
    return {
      isShowTab: false,
    };
  },
  mounted() {
    this.$eventBus.$on("showTab", () => {
      this.isShowTab = !this.isShowTab;
    });
  },
};
</script>

<style lang="scss" scoped>
* {
  --main-bg-color: rgb(42, 154, 230);
}
#app{
  width: 100%;
  height: auto
}
// 整体布局
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}

.container .header{
  height: 60px;
}
.container .content{
  width: 100%;
  margin: 0;
  flex: 1;
}

</style>
