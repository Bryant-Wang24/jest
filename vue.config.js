'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
// const port = process.env.port || process.env.npm_config_port || 8080

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'view/exhibition-hall/static',
  lintOnSave: true,
  productionSourceMap: false,
  pages: {
    index: {
      chunks: ['chunk-vendors', 'chunk-common', 'index', 'chunk-libs', 'chunk-elementUI', 'chunk-commons'],
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'view/exhibition-hall/index.html'
    }
  },
  devServer: {
    // host: '0.0.0.0',
    // port: port,
    // disableHostCheck: true,
    // https: false,
    // hotOnly: false,
    // open: true,
    // overlay: {
    //   warnings: false,
    //   errors: true
    // },
    // before: require('./mock/mock-server.js'),
    // 代理
    proxy: {

      '^/admin': {
        // target: 'http://192.168.1.23:8091',
        // target: 'http://192.168.1.88:81', // 大晓

        // target: 'http://ci.exhibition-hall.jiuxiang.tech', // 23
        // target: 'http://192.168.1.23:8080', // 23
        // target: 'http://192.168.1.24:8080', // 24
        target: 'http://test.exhibition-hall.jiuxiang.tech', // 24域名
        changeOrigin: true,
        ws: true,
        // 重写路径  需要设置重写的话，要在后面的调用接口前加上/api 来代替target
        pathRewrite: {
          '^/admin': ''
        }
      },
      '^/elc': {
        // target: 'http://192.168.1.23:8091',
        // target: 'http://192.168.1.88:81', // 大晓

        // target: 'http://ci.exhibition-hall.jiuxiang.tech', // 23
        // target: 'http://192.168.1.23:8080', // 23
        // target: 'http://192.168.1.24:8080', // 24
        target: 'http://test.369zhan.com', // 24域名
        changeOrigin: true,
        ws: true,
        // 重写路径  需要设置重写的话，要在后面的调用接口前加上/api 来代替target
        pathRewrite: {
          '^/elc': ''
        }
      },
      '^/sso': {
        // target: 'http://192.168.1.86:81', // 江涛
        // target: 'http://192.168.1.101:81',// 玉成
        // target: 'http://192.168.1.23:8010', // 23
        // target: 'http://192.168.1.24:8010', // 24
        target: 'http://account.ems.369zhan.com', // 24域名
        changeOrigin: true,
        ws: true,
        // 重写路径  需要设置重写的话，要在后面的调用接口前加上/api 来代替target
        pathRewrite: {
          '^/sso': ''
        }
      }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          // config.optimization.runtimeChunk('single')
        }
      )
  }
}
