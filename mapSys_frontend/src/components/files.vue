<template>
  <div>
    <div class="list">
      <div  v-for="file in files" :key="file.id" class="fileRow">
        <div class="content">
          
          <div>
            <router-link :to="{}">
              <span>{{ file.name }}</span>
            </router-link>
            <el-tag class="elTag" type="success">{{ file.name }}</el-tag>
          </div>
        
          <div>
            <em>{{ $dayjs(file.dateTime).format("YYYY-MM-DD") }}</em>
            <el-button class="elbutton" size="small" type="primary">下载文件</el-button>
            <el-button size="small" type="danger">删除文件</el-button>
          </div>

        </div>
        <divider class="divider" style="margin:10px;padding:0;"></divider>
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
      // console.log(response.data.gisdocs);
    });
  },
  components: {
    divider,
  },
};
</script>

<style lang="scss">

.list {
  padding: 20px;
  margin: 10px 20px;
  width: 95%;
  box-shadow: 0 0 3px rgba(1, 0, 1, 0.3);
}

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
</style>
