<template>
  <div>
    <b-button variant="danger" size="sm" class="closeButt" @click="$emit('close-form')"
      ><b-icon icon="x-square"></b-icon
    ></b-button>

    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        class="formItem input1"
        id="input-group-1"
        label="数据类型:"
        label-for="input-1"
      >
        <b-form-select
          id="input-1"
          v-model="form.fileClass"
          :options="dataClass"
          class="mb-3"
        >
          <!-- This slot appears above the options from 'options' prop -->
          <template #first>
            <b-form-select-option :value="null" disabled
              >-- Please select an option --</b-form-select-option
            >
          </template>
        </b-form-select>
      </b-form-group>

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

      <b-form-file v-model="form.file" class="mt-3" plain required></b-form-file>

      <div class="form-buttons">
        <b-button class="form-button1" type="submit" variant="primary">Submit</b-button>
        <b-button class="form-button2" type="reset" variant="danger">Reset</b-button>
      </div>
    </b-form>

    <!-- <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card> -->
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
        fileClass: "",
      },
      dataClass: [
        "文档",
        "数据",
        "样本",
        "算法",
        "案例",
      ],
      show: true,
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      let result = this.form
      result.dateTime = this.form.date + " " + this.form.time
      // alert(JSON.stringify(this.form));
      postFile(result).then(response=>console.log(response)).catch(error=>console.log(error))
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.name = "";
      this.form.docClass = "";
      this.form.description = null;
      this.form.dateTime = "";
      this.form.location = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

<style>
.closeButt {
  position: absolute;
  right: 2.2em;
  top: 1em;
}
.formItem {
  margin-top: 0.6em;
}
.form-buttons {
  margin-top: 1em;
  display: flex;
  justify-content: space-between;
}
</style>
