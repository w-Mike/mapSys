<template>
  <div class="Container">

    <div class="showFiles">
      <file-list :files="files" v-loading="isloading"></file-list>
    </div>

    <el-form class="formContent" ref="form" :model="form" :action="onSubmit" label-width="80px">
      <div class="selectDiv">
        <el-form-item label="文件类型" required>
          <el-select v-model="form.category" placeholder="请选择文件类型">
            <el-option label="文档" value="doc"></el-option>
            <el-option label="数据" value="data"></el-option>
            <el-option label="样本" value="sample"></el-option>
            <el-option label="算法" value="algorithm"></el-option>
            <el-option label="案例" value="case"></el-option>
            <!-- "文档", "数据", "样本", "算法", "案例" -->
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="关联设施" required>
        <el-select v-model="form.correfid" placeholder="选择文件关联的设施">
          <el-option v-for="(item, index) in fidNames" :key="index" :label="item.faciname" :value="item.fid"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="关联路段">
        <el-select multiple collapse-tags v-model="form.segids">
          <el-option v-for="(item) in segs" :key="item.sid" :label="item.segName" :value="item.sid"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="文件名称" required>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="文件描述" required>
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>

      <el-form-item label="创建时间" required>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.date" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="1">
          <p class="divider">--</p>
        </el-col>
        <el-col :span="11">
          <el-time-picker placeholder="选择时间" v-model="form.time" style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>

      <el-form-item label="文件上传" required>
        <el-upload
          action=""
          :before-remove="beforeRemove"
          :on-remove="handleRemove"
          :multiple="false" 
          :limit="1"
          :on-change="fileChange"
          :file-list="fileList"
          :auto-upload="false"
          >
          <el-button type="success">选择文件</el-button>   <span>(小于1Mb)</span>
       </el-upload>
      </el-form-item>
      <el-form-item class="buttonDiv">
        <el-button type="warning" @click="onReset">重写</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
import { postFile, reqFiles, getSidsforfid, getfidNames } from "@/utils/api";
import FileList from '@/components/fileList.vue'
export default {
  components: {
    FileList,
  },
  data() { 
    return {
      form: {
        category: "",

        name: "",
        description: "",
        date: "",
        time: "",
        file: "",

        correfid:"",
        segids:[],
      },
      
      fileList:[],
      show: true,
      dismissCountDown: 0,
      errordisMissedCount: 0,

      files:'',
      isloading:true,

      // 设施路段关联部分
      fidNames:[],
      segs:[],
    };
  },
  watch:{
    'form.correfid':{
      handler:function(newVal){
        getSidsforfid({"fid":newVal}).then(res=>{
          // console.log(res.data)
          this.segs = res.data.data
        })
      }
    }
  },
  methods: {
    getFnameByid(fid){
      let rst = "none"
      if(this.fidNames.length !== 0){
        this.fidNames.forEach((item, index)=>{
          if(item.fid.trim() == fid.trim()){
            rst = item.faciname
          }
        })
      }
      return rst  
    },
    fileChange(file,fileList) {
      this.form.file = file.raw
      // console.log(this.form.file)
    },
    onSubmit(event) {
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
      postFile(formData).then(
        (res) => {
          this.$message({message:'上传成功', type:'success'});

          this.$eventBus.$emit("fileChange", this.form.correfid)
          this.onReset()
          this.getFiles()

        },
        (error) => {
          this.$message({message:'上传失败', type:'error'});
          console.log(error);
        }
      );
    },
    onReset() {
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
      this.fileList = []
    },
    beforeRemove(file, fileList){
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleRemove(file, fileList){
      // console.log(file)
      // console.log(fileList)
    },
    chooseFile(params){
      console.log("调用了chooseFIle")
      console.log(params)
      this.form.file = params.file!==null ? params.file.raw : null
    },
    getFiles(){
      reqFiles().then((response) => {
        this.isloading=false
        let resData = response.data.gisdocs
        resData.forEach((item, index)=>{
          console.log(item.correfid)
          item.faciname = this.getFnameByid(item.correfid)
          console.log(item.faciname)
        })
        this.files = resData;
        // console.log(response.data.gisdocs);
      }).catch(error=>{
        this.$message({message:'读取文件失败，请检查网络', type:'error'});
        this.isloading=false
      });
    },
    startLoading(){

    }
  },
  created() {
    getfidNames().then(res=>{
      this.fidNames = res.data.data
      this.getFiles()
    }).catch(err=>{
      console.log(err)
    })

  },
};
</script>

<style lang="scss">
.Container{
  position: relative;
  display: flex;
  width: 60%;
  height: 100%;
  overflow-y: scroll;
}
.formContent{
  width: 40%;
  margin: 0;
  height: 100%;
  padding: 50px;
  box-sizing: border-box;
  padding-top: 2%;
  position: fixed;
  right: 0%;
  .selectDiv{
    display: flex;
    justify-content: space-between;
  }
}

.showFiles{
  width: 60%;
  height: 100%;
}

.buttonDiv{
  display: flex;
  margin-top: 60px;
  flex-direction: row-reverse;
}
</style>
