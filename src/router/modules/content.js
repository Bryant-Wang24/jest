import Layout from '@/layout'
const content = [
  {
    path: '/content',
    component: Layout,
    redirect: '/content/material',
    name: 'content',
    meta: {
      title: '内容管理'
    },
    alwaysShow: true,
    children: [
      {
        path: 'material',
        component: () => import('@/views/content/material/material'),
        name: 'material',
        meta: { title: '素材库', noCache: true }
      },
      {
        path: 'download',
        component: () => import('@/views/content/download/download'),
        name: 'download',
        meta: { title: '下载中心', noCache: true }
      },
      {
        path: 'downloadEdit/:id/:type',
        component: () => import('@/views/content/download/downloadEdit'),
        name: 'downloadEdit',
        hidden: true,
        meta: { title: '下载申请', noCache: true }
      }

    ]
  }
]

export default content
