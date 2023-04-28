import axios from "axios"

// 普通的 request
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})
request.interceptors.request.use(
  config => {
    // console.log(config)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

//  上传文件的request
const reqFile = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {  'Content-Type' : 'multipart/form-data' },
})

reqFile.interceptors.request.use(config => {
  // console.log(config)
  return config
}, error => {
  return Promise.reject(error)
})


// 上传设施的request
const reqfeature = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {  'Content-Type' : 'multipart/form-data' },
})

export { reqFile, request, reqfeature }