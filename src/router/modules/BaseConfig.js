import Layout from '@/layout'
const BaseConfig = [
  {
    path: '/baseConfig',
    component: Layout,
    redirect: 'noRedirect',
    name: 'BaseConfig',
    alwaysShow: true,
    meta: {
      title: '基础信息'
    },
    children: [
      {
        path: '/baseConfig/hall',
        component: () => import('@/views/baseConfig/hall'),
        name: 'BaseConfigHall',
        meta: { title: '展馆', noCache: false }
      }, {
        path: '/baseConfig/hallDetail',
        component: () => import('@/views/baseConfig/info/hallInfo'),
        name: 'BaseConfigHallDetail',
        meta: { title: '展馆详情', disabledForm: true },
        hidden: true
      },
      {
        path: '/baseConfig/hallEdit',
        component: () => import('@/views/baseConfig/info/hallInfo'),
        name: 'BaseConfigHallEdit',
        meta: { title: '编辑展馆', noCache: false },
        hidden: true
      },
      {
        path: '/baseConfig/hallAdd',
        component: () => import('@/views/baseConfig/info/hallInfo'),
        name: 'BaseConfigHallAdd',
        meta: { title: '新增展馆', noCache: false },
        hidden: true
      },
      {
        path: '/baseConfig/hallConfig',
        component: () => import('@/views/baseConfig/info/hallConfig'),
        name: 'BaseConfigHallConfig',
        meta: { title: '展馆号配置', noCache: false },
        hidden: true
      }
    ]
  }
]

export default BaseConfig
