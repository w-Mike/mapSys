<template>
<div>
  <div class="facInfoContainer">
    <div class="basicinfo">
      <div class="info">
        <div class="stitems">
          <div class="stitem">
            <p style="font-weight:bold;">设施名</p> 
            <el-input
              v-model="facinfo.faciname"
              :disabled="readOnly">
            </el-input>
          </div>
          <div class="stitem" >
            <p style="font-weight:bold;">设施类别</p>
            <el-input
              v-model="facinfo.facitype"
              :disabled="readOnly">
            </el-input>
          </div>
        </div>
        <div class="longitem">
          <p style="font-weight:bold;">设施描述</p>
          <el-input
            rows="6"
            type="textarea"
            v-model="facinfo.facidesc"
            :disabled="readOnly">
          </el-input>
        </div>
      </div>

      <div class="infobuttons">
        <el-button type="primary" class="renewFacButton" >更新信息</el-button>
        <div class="checkPic">
          <el-popover
            placement="top"
            width="400"
            trigger="click"
            show="setImgUrl"
          >
            <img style="width: 400px;height:auto;object-fit:contain;" :src="imgUrl" alt="网络出错">
            <el-button slot="reference">查看设施图片</el-button>
          </el-popover>
        </div>
      </div>

    </div>

    <div class="correFileList">
      <el-link size="small" type="danger" class="dltFacLink" @click="dltFaci">删除设施</el-link>
      <p style="font-weight:bold;">关联文件</p>
      <div class="facinfolist">
        <div v-for="file in files" :key="file.id" class="fileRow" >
          <div class="content">
            
            <div>
              <el-popover
                placement="left"
                width="300"
                trigger="hover"
                :show="showfileImg(file)">
                <p> <span style="font-weight:bold">文件描述：</span> {{ file.description }}</p>
                <img v-if="file.category==='pic'" style="width: 300px;height:auto;object-fit:contain;" :src="fileImgUrl" alt="网络出错">
                <span slot="reference" class="nameSpan">{{ file.name }}</span>
              </el-popover>
              <el-tag class="elTag" type="success">{{ fileCategory(file.category) }}</el-tag>
            </div>

            <div class="buttons">
              <el-link class="downbutton" size="small" type="primary" @click="downloadFile(file.correfid.trim(), file.id.trim())">下载</el-link>
              <el-link class="dltbutton" size="small" type="danger" @click="dltFile(file.id.trim(), file.correfid.trim())">删除</el-link>
            </div>

          </div>
          <hr class="listDivider">
        </div>
      </div>
    </div>

  </div>
</div>

</template>

<script>
import { getfacinfobyid, dltfilebyId} from '@/utils/api'
export default {
  name:'facInfo',
  props:['facinfoId','reqData'],
  data(){
    return{
      facinfo: {},
      files: [],
      readOnly:false,
      urlprefix:"http://localhost:9999/",
      imgUrl:"",
      fileImgUrl:"",
    }
  },
  methods:{
    showfileImg(file){
      if(file.category==='pic'){
        this.fileImgUrl=file.webURL
        console.log(this.fileImgUrl)
      }
    },
    fileCategory(category){
      let mapping = {
        "doc":"描述文档",
        "paper":"文献论文",
        "news":"新闻报道",
        "symdoc":"解译标志文档",
        "pic":"图片",
      }
      return mapping[category]
    },
    dltFaci(){

      this.$confirm("确定删除该设施吗？（设施关联文件将被保留）", '提示', {
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type: 'warning'
      }).then(()=>{
        this.$emit("dltFaci", this.facinfoId)
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
    getData(fid){
      let item = null
      if(item = sessionStorage.getItem(fid)){
        let parseItem =JSON.parse(item)
        this.facinfo=parseItem.facinfo
        this.files=parseItem.files
      }else{
        getfacinfobyid({"id": fid}).then(res=>{
          this.facinfo = res.data.facinfo
          this.files =res.data.docinfo
          sessionStorage.setItem(fid, JSON.stringify({
            "facinfo":res.data.facinfo,
            "files":res.data.docinfo
          }))
        })
      }
    },
    setImgUrl(){
      this.imgUrl = this.urlprefix + String(this.facinfoId) +'/picture.png'
    },
    downloadFile(correfid,docid){
      let folderPath = `http://localhost:9999/${correfid}/${docid}`
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
  watch:{
    facinfoId:function(newVal){
      this.getData(newVal)
      this.setImgUrl(newVal)
    },
    reqData:function(newVal){
      if(newVal){
        this.getData(this.facinfoId)
        this.setImgUrl(this.facinfoId)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.facInfoContainer{
  height: 100%;
  box-sizing: border-box;
  display: flex;
  background-color: #fcfbf8;
  padding: 20px;
  .basicinfo{
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: relative;
    .info{
      display: flex;
      justify-content: space-between;
      .stitems{
        flex-grow: 3;
      }
      .longitem{
        flex-grow: 4;
        margin-left: 30px;
      }
    }
    .infobuttons{
      display: flex;
      flex-direction: row-reverse;
      &>button{
        margin-left: 8px;
      }
    }
  }
  .correFileList{
    flex-grow: 4;
    margin-left: 50px;
    position: relative;
    .dltFacLink{
      position: absolute;
      right: 0%;
    }
    .dltFacLink:hover{
      font-weight: bold;
    }
    .facinfolist {
      box-shadow: 0 0 3px rgba(1, 0, 1, 0.3);
      margin-top: 10px;
      height: 80%;
      overflow-y:scroll;

      .content {
        display: flex;
        justify-content: space-between;
        margin: 3px auto;
        padding: 10px 18px;

        .downbutton {
          color: #609966;
        }
        .dltbutton{
          margin-left: 1em;
          color: red;
        }
        a {
          text-decoration: none;
          color: black;
          font: italic;
        }
        &:hover{
          background-color: #faf8f1;
        }
        .nameSpan:hover{
          cursor: pointer;
        }
        .elTag{
          margin-left: 10px;
        }
      }
      
      .listDivider{
        width: 94%;
        margin: 0 auto;
      }
    }
  }

}



</style>>