<template>
  <div class="facinfo">
    <div class="basicInfo">
      
      <div class="shortInfo">
        <div class="stitem">
          <h3>设施名</h3> 
          <p>{{ facinfo.faciname }}</p>
        </div>
        <div class="stitem" style="margin-left:50px;">
          <h3>设施类别</h3>
          <p>{{ facinfo.facitype }}</p>
        </div>
      </div>

      <div class="longinfo">
        <h3>设施描述</h3>
        <p>{{ facinfo.facidesc }}</p>
        <h3>设施图片</h3>
        <img :src="imgUrl" alt="未上传" class="facimg">
      </div>
    </div>

    <div class="divider"></div>
   
    <div class="correFileList">
      <h3>关联文件</h3>
      <div class="list">
        <div v-for="file in files" :key="file.id" class="fileRow" >
          <div class="content">
            
            <div>
              <span>{{ file.name }}</span>
              <el-tag class="elTag" type="success">{{ file.category }}</el-tag>
            </div>

          </div>
          <hr class="listDivider">
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { getfacinfobyid } from '@/utils/api'
export default {
  name:'facInfo',
  props:['facinfoId','reqData'],
  data(){
    return{
      facinfo: {},
      files: [],

      urlprefix:"http://localhost:9999/",
      imgUrl:"",
    }
  },
  methods:{
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
    setImgUrl(fid){
      this.imgUrl = this.urlprefix + String(fid) +'/picture.png'
      console.log(this.imgUrl)
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
.facinfo{
  display: flex;
  background-color: #fcfbf8;
  padding: 20px;
  h3{
    margin:0;
    margin-top: 20px;
  } 
  p{
    margin: 0;
  }

  .basicInfo{
    flex-grow: 1;
    
  }
  
  .correFileList{
    flex-grow: 1;
  }

  .divider{
    width: 0;
    height: 90%;
    border: 1px solid rgb(216, 212, 212);
    margin: auto 20px;
  }


  .list {
    margin-top: 10px;
    width: 95%;
    box-shadow: 0 0 3px rgba(1, 0, 1, 0.3);

    height: 80%;
    overflow-y:scroll;

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
    .listDivider{
      width: 94%;
      margin: 0 auto;
    }
  }
  & > div{
    width: 50%;
  }
}
.facimg{
  width: 270px;
}
.shortInfo{
  display: flex;
}


</style>>