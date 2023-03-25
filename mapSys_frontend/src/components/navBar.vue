<template>
  <div>
    <div class="navBar">

      <img class="sysIcon" src="@/assets/sysIcon.svg" alt=""> 
      <p class="SysName" @click="backHome">WebGIS数据管理系统 </p>

      <div class="navItems">
        <div class="navItem" @click="$router.push({'name':'upload'})">
          <span> 文件信息 </span>
        </div>
        <div class="navItem">
          <span>设施信息</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  methods: {
    backHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss">
.navBar {
  position: relative;
  box-sizing: border-box;
  background-color: #FAF8F1;
  padding: 10px;
  display: flex;
  border-bottom: 2px solid #609966;
}
.SysName {
  color: #40513b;
  margin-right: 65%;
  font-size: 25px;
  font-weight: bold;
  margin-left: 5px;
  padding-top: 3px;
}

.SysName:hover{
  cursor: pointer;
}
.navbarItems {
  display: flex;
  justify-content: space-around;
  a {
    color: #609966;
    text-decoration: none;
  }
}
.navItems{
  display: flex;
  .navItem{
    /* border-radius: 5px; */
    padding: 8px 10px;
    border: solid 1px #609966;
    border-right: none;
    color: #70a375;
    text-align: center;
    transition: background-color 0.5s;
  }
  .navItem:first-child{
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .navItem:last-child{
    border-right: solid 1px #609966;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .navItem:hover{
    color: #fff;
    background-color: #609966;
    cursor:pointer;
  }
  .navItem a {
    color: #609966;
    text-decoration: none;
    margin: 0 auto;
  }
}

</style>
