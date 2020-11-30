// 引入gzip压缩插件
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const cdn = {
    // 忽略打包的第三方库
    externals: {
        vue: 'Vue',
        vuex: 'Vuex',
        'vue-router': 'VueRouter',
        axios: 'axios'
    },

    // 通过cdn方式使用
    js: [
        'https://cdn.bootcss.com/vue/2.6.11/vue.runtime.min.js'
    ],

    css: []
}
module.exports = {
    // 部署路径
    publicPath: './',
    // 打包目录
    outputDir: 'dist',
    // 资源文件夹
    assetsDir: 'static',
    indexPath: 'index.html',
    // 文件哈希值
    filenameHashing: true,
    // 是否在保存的时候使用 `eslint-loader` 进行检查。 有效的值：`ture` | `false` | `"error"`  当设置为 `"error"` 时，检查出的错误会触发编译失败。
    lintOnSave: true,
    productionSourceMap: false,
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        proxy: {
            '/api': {
                target: 'xxxx',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    configureWebpack: config => {
        // 忽略打包配置
        config.externals = cdn.externals
        config.plugins.push(
            new CompressionWebpackPlugin({
                test: /\.js$|\.html$|\.css/, // 匹配文件名
                threshold: 1024, // 对超过1K的数据进行压缩
                deleteOriginalAssets: false // 是否删除原来文件
            })
        )
    },
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].cdn = cdn
            return args
        })
    }
}
