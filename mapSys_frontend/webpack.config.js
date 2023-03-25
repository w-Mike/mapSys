module.exports = {
  module: {
    rules: [
      // 普通的 `.scss` 文件和 `*.vue` 文件中的
      // `<style lang="scss">` 块都应用它
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              // 你也可以从一个文件读取，例如 `variables.scss`
              // 如果 sass-loader 版本 = 8，这里使用 `prependData` 字段
              // 如果 sass-loader 版本 < 8，这里使用 `data` 字段
              additionalData: `$color: red;`
            }
          }
        ]
      }
    ]
  },
}