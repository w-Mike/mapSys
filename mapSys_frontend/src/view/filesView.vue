<template>
  
  <div>
    <h2 v-show="files.length" style="margin-top:20px; margin-left:20px;">文件列表：</h2>
    <div class="filesList">
      <div class="list" v-loading="isloading">
        <div v-for="file in files" :key="file.id" class="fileRow" >
          <div class="content">
            <div>
              <span>{{ file.name }}</span>
              <el-tag class="elTag" type="success">{{ file.category }}</el-tag>
              <el-tag class="elTag" type="success">{{ file.faciname }}</el-tag>
            </div>
            <div>
              <em>{{ $dayjs(file.dateTime).format("YYYY-MM-DD") }}</em>
              <el-button class="elbutton" size="small" type="primary" @click="downloadFile(file.correfid.trim(), file.id.trim())">下载</el-button>
              <el-button size="small" type="danger" @click="dltFile(file.id.trim(), file.correfid.trim())">删除</el-button>
            </div>
          </div>
          <hr class="divider">
        </div>
      </div>

    </div>
  </div>

</template>

<script>
import { dltfilebyId, reqFiles} from "@/utils/api";


export default {
  data(){
    return {
      files:[],
      isloading:true,
    }
  },
  methods:{
    downloadFile(correfid,docid){
      let folderPath = `http://localhost:9999/${correfid}/${docid}`
      console.log(folderPath)
      let parser 
      let doc 
      let link
      let filename 

      fetch(folderPath)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
          return response.text();
      })
      .then(html => {
        parser = new DOMParser();
        doc = parser.parseFromString(html, 'text/html');
        link = doc.querySelector('a:nth-child(2)'); // Assuming there's only one file in the folder
        filename = link.textContent.trim();
        console.log(`${folderPath}/${filename}`)
        return fetch(`${folderPath}/${filename}`);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        // Do something with the blob
        console.log(blob)
        if(blob.size > 0){
          const downloadLink = document.createElement('a')
          downloadLink.download = filename
          downloadLink.style.display = "none"
          downloadLink.href = URL.createObjectURL(blob)
          document.body.appendChild(downloadLink)
          downloadLink.click()
          URL.revokeObjectURL(downloadLink.href)
          document.body.removeChild(downloadLink)
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
    },

    getFiles(){
      reqFiles().then((response) => {
        this.isloading=false
        let resData = response.data.gisdocs

        resData.forEach((item, index)=>{
          item.faciname = localStorage.getItem(item.correfid.trim())
        })

        this.files = resData;
      }).catch(error=>{
        this.$message({message:'读取文件失败，请检查网络', type:'error'});
        this.isloading=false
      });
    },

    dltFile(id, correfid){
      this.$confirm("确定删除该文件吗？", '提示', {
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type: 'warning'
      }).then(()=>{
        let dltObj = {id}
        dltfilebyId(dltObj).then(res=>{
          let dltindex=this.files.forEach((item, index)=>{
          if(item.id === id){
              return index
            }
          })
          this.files.splice(dltindex, 1)
        }).catch(err=>{
          console.log(err)
        })

        this.$eventBus.$emit("dltFile", correfid.trim(), id)
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
  created(){
    this.getFiles()
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
    background-color: #faf8f1;
  }
  .divider{
      width: 96%;
      margin: 0 auto;
  }
}
.warnInfo{
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%,-50%);
  color: red;
}
</style>