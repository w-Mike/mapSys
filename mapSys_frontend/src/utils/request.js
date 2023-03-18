import axios from "axios"

const req =  axios.create({
  baseURL: '/api',
  timeout: 2000,
})
req.interceptors.request.use(
  config=>{
    console.log(config)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default req