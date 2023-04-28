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
            <div>
              <!-- <el-button size="small" type="success" @click.stop="editFeature">编辑</el-button> -->
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
    fileChange(file,fileList) {
      this.featureForm.file = file.raw
    },
    beforeRemove(file, fileList){
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    chooseFile(params){
      this.featureForm.file = params.file!==null ? params.file.raw : null
    },
    handleRemove(){},

    editFeature(){

    },
    movetoFaci(facid){
      console.log(facid)
      this.$eventBus.$emit("movetoFaci", facid)
    }
  },
  created(){
    console.log(this.facInfos)
  }
}
</script>
<style lang="scss">
.list {
  position: relative;
  margin: 10px 20px;
  width: 95%;
  box-shadow: 0 0 3px rgba(1, 0, 1, 0.3);
  height: 90%;
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