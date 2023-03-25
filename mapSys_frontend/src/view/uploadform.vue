<template>
  <div class="Container">

    <div class="showFiles">
      <files></files>
    </div>

    <el-form class="formContent" ref="form" :model="form" label-width="80px">
      <div class="selectDiv">
        <el-form-item label="文件类型">
          <el-select v-model="form.category" placeholder="请选择文件类型">
            <el-option label="文档" value="doc"></el-option>
            <el-option label="数据" value="data"></el-option>
            <el-option label="样本" value="sample"></el-option>
            <el-option label="算法" value="algorithm"></el-option>
            <el-option label="案例" value="case"></el-option>
            <!-- "文档", "数据", "样本", "算法", "案例" -->
          </el-select>
        </el-form-item>

        <el-upload
          class="upload-demo"
          :on-change="fileChange">
          <el-button type="success">点击上传</el-button>   <span>(小于1Mb)</span>
        </el-upload>
      </div>

      <el-form-item label="文件名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="文件描述">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>

      <el-form-item label="创建时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.date" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">
          <p class="divider">-</p>
        </el-col>
        <el-col :span="11">
          <el-time-picker placeholder="选择时间" v-model="form.time" style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>


      <el-form-item class="buttonDiv">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button type="warning" @click="onReset">重写</el-button>
      </el-form-item>


    </el-form>

  </div>
</template>

<script>
import { postFile } from "@/utils/api";
import Files from '@/components/files.vue'
export default {
  components: {
    Files,
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
      },
 
      show: true,
      dismissCountDown: 0,
      errordisMissedCount: 0,
    };
  },
  methods: {
    fileChange(event) {
      this.form.file = event.target.files[0];
    },
    onSubmit(event) {
      event.preventDefault();
      this.form.dateTime = this.form.date + " " + this.form.time;
      let formData = new FormData();
      let keys = Object.keys(this.form);
      keys.forEach((key) => {
        if (key !== "date" && key !== "time") {
          formData.append(key, this.form[key]);
        }
      });
      let config = {
        headers: {},
      };
      postFile(formData).then(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    reset() {
      this.form = {
        name: "",
        docClass: "",
        description: "",
        localpath: "",
        date: "",
        time: "",
        location: "",

        file: [],
        fileClass: "null",
      };
    },
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
  padding-top: 10%;
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
  flex-direction: row-reverse;
}
</style>
