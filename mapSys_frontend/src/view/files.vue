<template>
  <div>
    <div class="list">
      <div v-for="file in files" :key="file.id">
        <div class="file">
          <router-link :to="{}">
            <span>{{ file.name }}</span>
          </router-link>
          <div>
            <span>{{ $dayjs(file.dateTime).format("YYYY-MM-DD") }}</span>
            <b-button variant="primary">下载文件</b-button>
            <b-button variant="danger">删除文件</b-button>
          </div>
        </div>
        <divider class="divider"></divider>
      </div>
    </div>
  </div>
</template>

<script>
import divider from "@/components/divider.vue";
import { reqFiles } from "@/utils/api";
export default {
  name: "files",
  data() {
    return {
      files: "",
    };
  },
  created() {
    reqFiles().then((response) => {
      this.files = response.data.gisdocs;
      console.log(response.data.gisdocs);
    });
  },
  components: {
    divider,
  },
};
</script>

<style>
.file {
  display: flex;
  justify-content: space-between;
  margin: 0.5em auto;
}
.file button {
  margin-left: 2em;
}
.file a {
  text-decoration: none;
  color: black;
  font: italic;
}
.divider {
  width: 60%;
}

.list {
  padding: 20px;
  margin: 0 auto;
  width: 60%;
  box-shadow: 0 0 3px rgba(1, 0, 1, 0.3);
}
</style>
