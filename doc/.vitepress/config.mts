import { defineConfig } from 'vitepress'
const other = [
  {
    text: '简介',
    items: [
      { text: '快速开始', link: '/guide/started' },
    ]
  },
  {
    text: '组件',
    items: [
      { text: 'LBWTable 表格', link: '/components/LBWTable' },
      { text: 'LBWForm 表单', link: '/components/LBWFormItem' },
    ]
  },
  {
    text: 'API',
    items: [
      { text: 'index 请求', link: '/api/index' },
    ]
  },
  {
    text: 'utils',
    items: [
      { text: 'index 工具', link: '/utils/index' },
      { text: "global 全局变量", link: '/utils/global' },
    ]
  }
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/KaiDiCommon/",
  title: "内部组件库",
  description: "vue3微前端管理后台内部组件库",
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '快速入门', link: '/guide/started' },
      { text: '模版', link: '/template/tableTemplate' },
    ],

    sidebar: {
      '/template/': [
        {
          text: '各个模版',
          items: [
            { text: 'table模版', link: '/template/tableTemplate' },
            { text: '弹框form模版', link: '/template/modalForm' },
            { text: 'api请求模版', link: '/template/apiTemplate' },
          ]
        }
      ],
      '/guide/': other,
      '/components/': other,
      '/api/': other,
      '/utils/': other,
    }

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  }
})
