const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true, // 设置这个参数可以避免跨域
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}

