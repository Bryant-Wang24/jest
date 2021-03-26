import Layout from '@/layout'
const Example = [
  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: '基础配置'
    },
    children: [
      {
        path: 'priceList',
        component: () => import('@/views/priceList/priceList'),
        name: 'priceList',
        meta: { title: '价目表' }
      },
      {
        path: 'detailed/:id?',
        component: () => import('@/views/priceList/detailed'),
        name: 'detailed',
        meta: {
          title: '价目表明细',
          noCache: true,
          activeMenu: '/priceList/priceList'
        },
        hidden: true
      },
      {
        path: 'site',
        component: () => import('@/views/site/Site'),
        name: 'Site',
        meta: { title: '场地管理', noCache: true }
      },
      {
        path: 'taskBag',
        component: () => import('@/views/taskBag/taskBag'),
        name: 'taskBag',
        meta: { title: '任务包配置', noCache: true }
      },
      {
        path: 'taskBag/taskDetail',
        component: () => import('@/views/taskBag/taskDetail'),
        name: 'taskDetail',
        meta: { title: '任务明细', noCache: true },
        hidden: true
      },
      {
        path: 'approve',
        component: () => import('@/views/approve/approve'),
        name: 'Approve',
        meta: { title: '审批流', noCache: true }
      },
      {
        path: 'approveFlow/:eventKey',
        component: () => import('@/views/approve/approveFlow'),
        name: 'ApproveFlow',
        meta: { title: '审批流设计', noCache: true, activeMenu: '/example/approve', affix: false },
        hidden: true
      }
    ]
  }
]

export default Example
