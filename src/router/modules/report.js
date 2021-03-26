import Layout from '@/layout'
const report = [
  {
    path: '/report',
    component: Layout,
    redirect: '/report/reportProject',
    name: 'report',
    meta: {
      title: '报表中心'
    },
    children: [
      {
        path: 'reportProject',
        component: () => import('@/views/report/reportProject'),
        name: 'reportProject',
        meta: { title: '项目数据汇总' }
      },
      {
        path: 'reportScheduling',
        component: () => import('@/views/report/reportScheduling'),
        name: 'reportScheduling',
        meta: { title: '项目排期汇总' }
      },
      {
        path: 'reportContract',
        component: () => import('@/views/report/reportContract'),
        name: 'reportContract',
        meta: { title: '合同/服务单收款记录' }
      },
      {
        path: 'reportInvoice',
        component: () => import('@/views/report/reportInvoice'),
        name: 'reportInvoice',
        meta: { title: '开票记录' }
      },
      {
        path: 'reportCredentials',
        component: () => import('@/views/report/reportCredentials'),
        name: 'reportCredentials',
        meta: { title: '证件购买统计' }
      }
    ]
  }
]

export default report
