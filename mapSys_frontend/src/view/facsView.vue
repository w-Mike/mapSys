<template>
  <div>
    <h2 style="margin-top:20px; margin-left:20px;">设施列表：</h2>

    <div class="list">
        <div v-for="fac in facInfos" :key="fac.fid" class="fileRow" >
          <div class="content" @click="movetoFaci(fac.fid)">
            <div>
              <span>{{ fac.faciname }}</span>
              <el-tag class="elTag" type="success">{{ fac.facitype }}</el-tag>
            </div>
            <div class="facbuttons">
              <el-button size="small" type="danger" @click.stop="dltFeature(fac.fid)" >删除</el-button>
            </div>
          </div>
          <hr class="divider">
        </div>
      </div>
  </div>
</template>
<script>
export default {
  props:['facInfos'],
  data(){
    return{
      editForm:{

      },
      showFormFlag: false,
    }
  },
  methods:{
    dltFeature(fid){

      this.$confirm("确定删除该设施吗？（设施关联文件将被保留）", '提示', {
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type: 'warning'
      }).then(()=>{
        this.$eventBus.$emit("dltFeature", fid)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(()=>{
        this.$message({
          type: 'warning',
          message: '已取消删除'
        }); 
      })
    },
    movetoFaci(facid){
      this.$eventBus.$emit("movetoFaci", facid)
    }
  },
  created(){
  }
}
</script>
<style lang="scss" scoped>
.list {
  position: relative;
  margin: 10px 20px;
  width: 95%;
  box-shadow: 0 0 3px rgba(1, 0, 1, 0.3);
  height: 560px;
  overflow-y: scroll;
  .content {
    display: flex;
    justify-content: space-between;
    margin: 3px auto;
    .elbutton {
      margin-left: 2em;
    }
    a {
      text-decoration: none;
      color: black;
      font: italic;
    }
    &:hover{
      font-weight: bold;
    }
  }
  .elTag{
    margin-left: 10px;
  }
  .content{
    padding: 10px 18px;
  }
  .content:hover{
    cursor:pointer;
    background-color: #faf8f1;
  }
  .divider{
      width: 96%;
      margin: 0 auto;
  }
}
</style>