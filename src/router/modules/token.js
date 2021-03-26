import Layout from '@/layout'
const Cockpit = [
  {
    path: '/Token',
    component: Layout,
    redirect: '/Token/TokenCreate',
    name: 'Token',
    meta: { title: '口令工具' },
    children: [
      {
        path: 'TokenCreate',
        component: () => import('@/views/Token/TokenCreate'),
        name: 'TokenCreate',
        meta: { title: '口令工具' }
      }
    ]
  }
]

export default Cockpit
