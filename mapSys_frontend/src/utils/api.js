import request from "@/utils/request"

// Post 文件信息给服务端
export const postFile = data => {
  return request({
    method: 'post',
    url: 'gisdocs',
    data
  })
}