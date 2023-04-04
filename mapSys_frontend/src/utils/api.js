import { reqFile, request } from "@/utils/request"

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
  return request({
    method:"POST",
    url:"facilities",
    data
  })
}

// // 获取几何要素的信息
// export const reqFeatures = ()=>{
//   return request({
//     method:'get',
//     url:'splitline'
//   })
// }
