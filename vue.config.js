//对webpack默认配置做修改
module.exports = {
    //使用chainWebpak自定义打包入口
    chainWebpack: config => {
        //发布模式（生成环境）
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js') //先删除原有入口再添加
            //配置external节点来优化文件导入
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })
            //首页内容定制
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })
        //开发模式（开发环境）
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js') //先删除原有入口再添加
            //首页内容定制
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}