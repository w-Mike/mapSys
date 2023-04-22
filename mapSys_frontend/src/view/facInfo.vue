<template>
  <div class="facinfo">
    <h3>设施名：</h3> 
    <p>{{ facinfo.faciname }}</p>
    <h3>设施描述</h3>
    <p>{{ facinfo.facidesc }}</p>
    <h3>设施类别</h3>
    <p>{{ facinfo.facitype }}</p>
    <divider class="divider"></divider>

    <h3>设施图片</h3>
    <p>未上传</p>

    <h3>设施数据</h3>

    <div class="list">
      <div v-for="file in files" :key="file.id" class="fileRow" >
        <div class="content">
          
          <div>
            <span>{{ file.name }}</span>
            <el-tag class="elTag" type="success">{{ file.category }}</el-tag>
          </div>

        </div>
        <hr class="divider">
      </div>
    </div>

  </div>
</template>

<script>
import { getfacinfobyid } from '@/utils/api'
import Divider  from '@/components/divider.vue'
export default {
  name:'facInfo',
  data(){
    return{
      facinfo: this.$route.params,
      files:[],
    }
  },
  components:{
    Divider
  },
  methods:{
    getData(fid){
      let item = null
      if(item = sessionStorage.getItem(fid)){
        // console.log(JSON.stringify(item))
        let parseItem =JSON.parse(item)
        console.log(parseItem)
        this.facinfo=parseItem.facinfo
        this.files=parseItem.files
      }else{
        getfacinfobyid({"id": fid}).then(res=>{
          console.log(res.data)
          this.facinfo = res.data.facinfo
          this.files =res.data.docinfo
          sessionStorage.setItem(fid,JSON.stringify({
            "facinfo":res.data.facinfo,
            "files":res.data.docinfo
          }))
        })
      }

      // getfacbyid({"id": fid}).then(res=>{
      //   this.facinfo = res.data
      // })
      // getdocbyfid({"id": fid}).then(res=>{
      //   console.log(res.data)
      //   this.files = res.data
      // })
    },

  },
  created(){
    this.getData( this.$route.params.fid)
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        // 对路由变化做出响应...
        console.log(toParams.fid)
        this.getData(toParams.fid)
      }
    )
  }
}
</script>

<style lang="scss" scoped>
.facinfo{
  background-color: #fcfbf8;
  padding: 20px;
  h3{
    margin:0;
    margin-top: 20px;
  }
  p{
    margin: 0;
  }
  .divider{
    width: 100%;
    background: black;
  }
  .list {
    margin-top: 10px;
    width: 95%;
    box-shadow: 0 0 3px rgba(1, 0, 1, 0.3);
    border-radius: 5%;
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
      padding: 7px 5px;
    }
    .content:hover{
      background-color: #faf8f1;
    }
    .divider{
      width: 94%;
      margin: 0 auto;
    }
  }
}



</style>>