<template>
  <div>
    <div class="navBar">

      <div class="title">
        <img class="sysIcon" src="@/assets/sysIcon.svg" alt=""> 
        <p class="SysName" @click="backHome">基于WebGIS的线状工程多源异构数据管理系统 </p>
      </div>

      <div class="navItems">
        <div class="navItem login">
          <span> 登录 </span>
        </div>
        <div class="navItem register">
          <span> 注册 </span>
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
  height: 60px;
  display: flex;
  justify-content: space-between;
  .title{
    display: flex;
  }
}
.SysName {
  color: #40513b;
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
  height: 2em;
  display: flex;
  margin-top: 0.2em;

  .navItem{
    /* border-radius: 5px; */
    border: solid 1px #609966;
    border-right: none;
    color: #70a375;
    transition: background-color 0.5s;
    padding: 0.2em 1em;
    display: flex;
    span{
      display: block;
      margin: auto;
      font-size: 15px;
    }
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
    cursor:pointer;
  }
  .navItem a {
    color: #609966;
    text-decoration: none;
    margin: 0 auto;
  }
  .login {
    color: #fff;
    background-color: #609966;
  }
}


</style>
