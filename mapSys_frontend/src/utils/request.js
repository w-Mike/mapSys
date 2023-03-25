import axios from "axios"

const request = axios.create({
  baseURL: '/api',
  timeout: 2000,
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

export { reqFile, request }