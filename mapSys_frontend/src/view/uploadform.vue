<template>
  <div class="upForm">
    <b-form @submit="onSubmit" v-if="show" >
      <b-form-group
        class="formItem input1"
        id="input-group-1"
        label="数据类型:"
        label-for="input-1"
      >
        <b-form-select
          id="input-1"
          v-model="form.fileClass"
          :options="fileClass"
          class="mb-3 select"
        >
          <!-- This slot appears above the options from 'options' prop -->
          <template #first>
            <b-form-select-option :value="null" disabled
              >-- 选择一种文件类型 --</b-form-select-option
            >
          </template>
        </b-form-select>
      </b-form-group>

      <!-- <b-form-file v-model="form.file" class="mt-3 fileSelect" plain required ></b-form-file> -->
      <b-form-group
        class="formItem input2"
        id="input-group-2"
        label="名称:"
        label-for="input-2"
      >
        <b-form-input
          id="input-2"
          v-model="form.name"
          placeholder="输入名称"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        class="formItem input3"
        id="input-group-3"
        label="类别:"
        label-for="input-3"
      >
        <b-form-input
          id="input-3"
          v-model="form.docClass"
          placeholder="输入类别"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        class="formItem input4"
        id="input-group-4"
        label="描述:"
        label-for="input-4"
        required
      >
        <b-form-textarea
          id="input-4"
          v-model="form.description"
          placeholder="输入数据的描述信息"
          rows="3"
          max-rows="6"
        ></b-form-textarea>
      </b-form-group>

      <b-form-group
        class="formItem input5"
        id="input-group-5"
        label="选择日期:"
        label-for="input-5"
        required
      >
      <b-form-datepicker
        id="input-5"
        v-model="form.date"
        class="mb-2"
      ></b-form-datepicker>
      </b-form-group>

      <b-form-group
        class="formItem input6"
        id="input-group-6"
        label="输入时间:"
        label-for="input-6"
      >
        <b-form-input
          id="input-6"
          type="time"
          v-model="form.time"
          placeholder="输入"
          required
        ></b-form-input>
      </b-form-group>

      <div class="formItem">
        <div class="form-buttons">
          <b-button class="form-button1" type="submit" variant="primary">Submit</b-button>
        </div>
      </div>
    </b-form>

    <b-alert
      :show="dismissCountDown"
      variant="success"
      @dismissed="dismissCountDown=0"
      class="alert"
    >
      <p>上传成功</p>
    </b-alert>

    <b-alert
      :show="errordisMissedCount"
      variant="danger"
      @dismissed="errordisMissedCount=0"
      class="alert"
    >
      <p>上传失败</p>
    </b-alert>

  </div>
</template>

<script>
import { postFile } from "@/utils/api";
import { BIcon, BIconXSquare } from "bootstrap-vue";
export default {
  components: {
    BIcon,
    BIconXSquare,
  },
  data() {
    return {
      form: {
        name: "",
        docClass: "",
        description: "",
        localpath: "",
        date: "",
        time:"",
        location: "",

        file: "",
        fileClass: "null",
      },
      fileClass: [
        "文档",
        "数据",
        "样本",
        "算法",
        "案例",
      ],
      show: true,
      dismissCountDown:0,
      errordisMissedCount:0
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      let result = this.form
      result.dateTime = this.form.date + " " + this.form.time
      // alert(JSON.stringify(this.form));
      postFile(result).then(
        response=>{console.log(response)
        this.dismissCountDown = 3
        // reset()
      }).catch(error=>{
        console.log(error)
        this.errordisMissedCount = 3        
      })
    },
    reset(){
      this.form = {
        name: "",
        docClass: "",
        description: "",
        localpath: "",
        date: "",
        time:"",
        location: "",

        file: [],
        fileClass: "null",
      }
    }
  },
};
</script>

<style>
.closeButt {
  position: absolute;
  right: 2.2em;
  top: 1em;
}

.form-buttons button{
  margin-top: 1em;
  margin-left: 2em;
  float:right;
}
.select{
  width: 100%;
  height: 2em;
  border: solid grey 1px;
}
.formItem{
  width: 70%;
  margin: 1em auto
}
.alert{
  position: fixed;
  top:10%;
  z-index: 3;
  width: 10%;
  height: 60px;
  margin: 0 auto;
  text-align: center;
}
.fileSelect{
  margin-left:15%;
}
</style>
