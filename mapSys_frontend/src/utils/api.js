import { reqFile, request,reqfeature } from "@/utils/request"

// Post 文件信息给服务端
export const postFile = data => {
  return reqFile({
    method: 'post',
    url: 'gisdocs',
    data
  })
}

// 获取文件信息
export const reqFiles = ()=>{
  return request({
    method:'get',
    url:'gisdocs',
  })
}

// 绘制的要素传递给服务端

export const postFeature = data =>{
  return reqfeature({
    method:"POST",
    url:"facilities",
    data
  })
}

// 将关联信息（设施id和路段ids）上传至服务器
export const postCorre = data => {
  return request({
    method:"POST",
    url:"corre",
    data
  })
}

// 获取某一设施关联的所有路段
export const getSidsforfid = params =>{
  return request({
    method:"GET",
    url:"corre",
    params
  })
}

// 获取设施的id和名
export const getfidNames=()=>{
  return request({
    method:"GET",
    url:"fidnames",
  })
}

// 删除文件信息
export const dltfilebyId = (data)=>{
  return request({
    method:"DELETE",
    url:"gisdocs",
    data
  })
}

// 通过设施id获取设施信息
export const getfacinfobyid = (params)=>{
  return request({
    method:"GET",
    url: "facbyid",
    params
  })
}

// 通过设施id获取关联文件信息
export const getdocbyfid=(params)=>{
  return request({
    method:"GET",
    url:"docbyfid",
    params
  })
}

// // 获取几何要素的信息
// export const reqFeatures = ()=>{
//   return request({
//     method:'get',
//     url:'splitline'
//   })
// }
