<template>
  <div>
    <div class="navBar">

      <div class="title">
        <img class="sysIcon" src="@/assets/sysIcon.svg" alt=""> 
        <p class="SysName" @click="backHome">基于WebGIS的线状工程多源异构数据管理系统 </p>
      </div>

    </div>
  </div>



</template>

<script>

export default {
  methods: {
    backHome() {
      this.$eventBus.$emit("backHome")
    },
  },
};
</script>

<style lang="scss">
.navBar {
  height: 100%;
  position: relative;
  box-sizing: border-box;
  background-color: #609966;

  padding: 10px;

  display: flex;
  justify-content: space-between;

  .title{
    display: flex;
    p{
      white-space:nowrap; 
    }
    // flex-grow: 1;
  }
}
.SysName {
  color: #FAF8F1;
  font-size: 25px;
  font-weight: bold;
  margin: 0;
  margin-left: 5px;
  padding-top: 3px;
}

.title:hover{
  cursor: pointer;
}

</style>
