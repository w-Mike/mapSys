<template>
  
  <div>
    <h2 style="margin-top:20px; margin-left:20px;">文件列表：</h2>
    <div class="filesList">
      <div class="list" v-loading="isloading">
        <div v-for="file in files" :key="file.id" class="fileRow" >
          <div class="content">
            <div>
              <span @click="editFile(file)" class="filename" >{{ file.name }}</span>
              <el-tag class="elTag" type="success">{{ file.faciname }}</el-tag>
            </div>
            <div class="buttons">
              <em>{{ $dayjs(file.dateTime).format("YYYY-MM-DD") }}</em>
              <div>
                <el-button class="elbutton" size="small" type="primary" @click="downloadFile(file.correfid.trim(), file.id.trim())">  下载</el-button>
                <el-button size="small" type="danger" @click="dltFile(file.id.trim(), file.correfid.trim())">删除</el-button>
              </div>
            </div>
          </div>
          <hr class="divider">
        </div>
      </div>

    </div>

    <el-drawer
      title="编辑文件信息"
      size="40%"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose">

      <el-form class="formContent" ref="form" :model="form" :action="onSubmit" label-width="80px">
        <div class="outter">
          <div class="selectDiv">
            <el-form-item label="文件类型" required>
              <el-select v-model="form.category" placeholder="请选择文件类型">
                <el-option label="描述文档" value="doc"></el-option>
                <el-option label="文献论文" value="paper"></el-option>
                <el-option label="新闻报道" value="news"></el-option>
                <el-option label="解译标志文档" value="symdoc"></el-option>
              </el-select>
            </el-form-item>
          </div>

          <el-form-item label="关联设施" required>
            <el-select v-model="form.correfid" placeholder="选择文件关联的设施">
              <el-option v-for="(item) in fidNames" :key="item.fid" :label="item.faciname" :value="item.fid"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="关联路段">
            <el-select multiple collapse-tags v-model="form.segids">
              <el-option v-for="(item) in segs" :key="item.key" :label="item.segName" :value="item.sid"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="文件名称" required>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="文件描述" required>
            <el-input type="textarea" v-model="form.description" rows="6"></el-input>
          </el-form-item>

          <el-form-item label="创建时间" required>
            <div class="timePicker">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.date" style="width: 40%;margin-right:5px;"></el-date-picker>
              <el-time-picker placeholder="选择时间" v-model="form.time" style="width: 40%;"></el-time-picker>
            </div>
          </el-form-item>
          
          <el-form-item class="buttonDiv">
            <el-button type="warning" @click="onReset">重写</el-button>
            <el-button type="primary" @click="onSubmit">提交</el-button>
          </el-form-item>
        </div>
      </el-form>

    </el-drawer>
  </div>

</template>

<script>
import { dltfilebyId, reqFiles, getSidsforfid, getfidNames} from "@/utils/api";


export default {
  data(){
    return {
      files:[],
      isloading:true,
      drawer: false,

      fidNames:[],
      segs:[],
      form: {
        category: "",

        name: "",
        description: "",
        date: "",
        time: "",

        correfid:"",
        segids:[],
      },
    }
  },

  watch:{
    'form.correfid':{
      handler:function(newVal){
        getSidsforfid({"fid":newVal}).then(res=>{
          this.segs = res.data.data
        })
      }
    }
  },
  methods:{

    clearForm(){
      this.form = {
        category: "",

        name: "",
        description: "",
        date: "",
        time: "",
        file: "", 
        correfid:"",
        segids:[],
      };
    },
    onSubmit(event){
      event.preventDefault();
      this.form.date = this.$dayjs(this.form.date).format("YYYY-MM-DD")
      this.form.time = this.$dayjs(this.form.time).format("HH:mm:ss")
      this.form.dateTime = this.form.date + " " + this.form.time;
      let formData = new FormData();
      let keys = Object.keys(this.form);
      keys.forEach((key) => {
        if (key !== "date" && key !== "time") {
          formData.append(key, this.form[key]);
        }
      });
      //  向服务端发起更改信息请求

      console.log(this.form)
    },
    onReset(){
      this.clearForm()
    },
    handleClose(done){
      this.clearForm()
      done()
    },
    editFile(file){
      let keys = Object.keys(file)
      console.log(file)
      keys.forEach((key)=>{
        if(key!=='webURL' && key!=='deleted' && key!=='correfid' && key!== 'id' &&key!=='dateTime' &&key!=='faciname'){
          this.form[key] = file[key]
        }else{
          if(key === 'dateTime'){
            this.form['date'] = file[key]
            this.form['time'] = file[key]
          }
        }
      })
      this.drawer = true
    },
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
    getfidNames().then(res=>{
      this.fidNames = res.data.data
      console.log(this.fidNames)
    }).catch(err=>{
      console.log(err)
    })
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
    flex-direction: column;
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

    .filename:hover{
      cursor: pointer;
    }
    .buttons{
      display: flex;
      justify-content: space-between;
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
.formContent{
  position: relative;;
  margin-left: 30px;
  width: 90%;
  .buttonDiv{
    position: absolute;
    right: 0%;
  }
  .el-form-item{
    margin-bottom:30px;
  }
}
</style>