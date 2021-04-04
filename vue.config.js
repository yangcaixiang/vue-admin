/*
 * @Author: your name
 * @Date: 2020-12-04 16:50:53
 * @LastEditTime: 2021-02-24 10:42:27
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \prison-practical-platform\web-common\config\vue.config.js
 */
const path = require('path')
function resolve(dir) {
  return path.resolve(__dirname, dir)
}
const COMMONPATH = resolve('..')

module.exports = {
  publicPath: '',
  productionSourceMap: false,
  devServer: {
    port: 9000,
    open: true,
    contentBase: COMMONPATH,
    proxy: {
      '/test': {
        target: 'http://192.168.50.245:8765',
        pathRewrite: {
          '^/test': '/api/',
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('common', COMMONPATH)
    config.plugins.delete('prefetch')

    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('gzip-plugin')
        .use('compression-webpack-plugin')
        .tap(() => [
          {
            test: /\.js$|\.json$/,
            cache: true,
            deleteOriginalAssets: true,
          },
        ])
        .end()
        .plugin('uglify-plugin')
        .use('webpack-parallel-uglify-plugin')
        .tap(() => [
          {
            cacheDir: '.cache/',
            uglifyES: {
              compress: {
                drop_console: false,
              },
            },
          },
        ])
        .end()
    }
  },
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        data: `@import "common/sass/ppp-global-style.scss";`,
      },
    },
  },
  configureWebpack: {
    externals: {
      './cptable': 'var cptable',
    },
  },
}
