const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  publicPath: './',
  devServer:{
    proxy:{
      '/api':{
        ws:false,
        target:"http://localhost:5000",
        changeOrigin: true,
        pathRewrite:{
          '^/api':''
        }
      },
    }
  }
})
