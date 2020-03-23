//发布阶段所需要用到的babel插件
const prodPlugins=[]
if(process.env.NODE_ENV=='production'){  //当前是发布阶段
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    // 'transform-remove-console'改为发布模式下生效
    ...prodPlugins,
    //路由的懒加载
    '@babel/plugin-syntax-dynamic-import'
  ]
}