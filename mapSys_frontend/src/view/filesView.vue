<template>
  
  <div>
    <h2 style="margin-top:20px; margin-left:20px;">文件列表：</h2>
    <div class="filesList">
      <div class="list" v-loading="isloading">
        <div v-for="file in files" :key="file.id" class="fileRow" >
          <div class="content">
            <div>
              <el-popover
                placement="bottom"
                width="200"
                trigger="click"
                title="文件描述"
                :content="file.description">
                <span slot="reference" class="nameSpan">{{ file.name }}</span>
              </el-popover>
              <el-tag class="elTag" type="success">{{ file.category }}</el-tag>
              <el-tag class="elTag" type="success">{{ file.faciname }}</el-tag>
            </div>
            <div>
              <em>{{ $dayjs(file.dateTime).format("YYYY-MM-DD") }}</em>
              <el-button class="elbutton" size="small" type="primary" @click="downloadFile(file.correfid.trim(), file.id.trim())">下载</el-button>
              <el-button size="small" type="danger" @click="dltFile(file.id.trim(), file.correfid.trim())">删除</el-button>
              <el-button size="small" type="warning">编辑</el-button>
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
        console.log("发送了网络请求，请求内容为文件列表的信息")
        this.isloading=false
        let resData = response.data.gisdocs

        resData.forEach((item)=>{
          if(!(item.faciname = localStorage.getItem(item.correfid.trim()))){
            item.faciname = "设施已被删除"
          }
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
    margin: 2px auto;
    padding: 10px 18px;
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
    .nameSpan:hover{
      cursor: pointer;
    }
  }
  .elTag{
    margin-left: 10px;
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