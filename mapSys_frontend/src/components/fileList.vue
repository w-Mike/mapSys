<template>
  <div>
    <div class="list">
      <div v-for="file in files" :key="file.id" class="fileRow" >
        <div class="content">
          <div>
            <span>{{ file.name }}</span>
            <el-tag class="elTag" type="success">{{ file.category }}</el-tag>
            <el-tag class="elTag" type="success">{{ file.faciname }}</el-tag>
          </div>
          <div>
            <em>{{ $dayjs(file.dateTime).format("YYYY-MM-DD") }}</em>
            <el-button class="elbutton" size="small" type="primary">下载文件</el-button>
            <el-button size="small" type="danger" @click="dltFile(file.id, file.correfid)">删除文件</el-button>
          </div>
        </div>
        <hr class="divider">
      </div>
    </div>
  </div>
</template>

<script>
import divider from "@/components/divider.vue";
import { dltfilebyId } from "@/utils/api";
export default {
  name: "files",
  props:['files'],
  data() {
    return {

    };
  },
  methods:{
    dltFile(id, correfid){
      this.$confirm("确定删除该文件吗？", '提示', {
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type: 'warning'
      }).then(()=>{
        console.log(id)
        let dltObj = {id}
        dltfilebyId(dltObj).then(res=>{
          console.log(res)
          let dltindex=this.files.forEach((item, index)=>{
          if(item.id === id){
              return index
            }
          })
          this.files.splice(dltindex, 1)
        }).catch(err=>{
          console.log(err)
        })

        this.$eventBus.$emit("fileChange", correfid.trim())
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


    }
  },
  created() {

  },
  components: {
    divider,
  },
};
</script>

<style lang="scss" scoped>
.list {
  margin: 10px 20px;
  width: 95%;
  box-shadow: 0 0 3px rgba(1, 0, 1, 0.3);
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
    background-color: #faf8f1;
  }
  .divider{
      width: 96%;
      margin: 0 auto;
  }
}



</style>
