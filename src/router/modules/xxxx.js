import Layout from '@/layout'
const Cockpit = [
  {
    path: '/Xxxx',
    component: Layout,
    meta: { title: '会议管理' },
    children: [
      {
        path: 'test1',
        component: () => import('@/views/xxxx/xxxx'),
        name: 'Xxxx1',
        meta: { title: '我的会议' }
      },
      {
        path: 'test2',
        component: () => import('@/views/xxxx/xxxx2'),
        name: 'Xxxx2',
        meta: { title: '会议编辑' }
      }
    ]
  }
]

export default Cockpit
