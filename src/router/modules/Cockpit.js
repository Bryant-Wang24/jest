import Layout from '@/layout'
const Cockpit = [
  {
    path: '/Cockpit',
    component: Layout,
    redirect: '/Cockpit/CockpitExhibition',
    name: 'Cockpit',
    meta: { title: '管理驾驶舱' },
    children: [
      {
        path: 'CockpitExhibition',
        component: () => import('@/views/CockpitExhibition/CockpitExhibition'),
        name: 'CockpitExhibition',
        meta: { title: '展会数据中心' }
      },
      {
        path: 'ConferenceDataCenter',
        component: () => import('@/views/CockpitExhibition/ConferenceDataCenter'),
        name: 'ConferenceDataCenter',
        meta: { title: '会议数据中心' }
      },
      {
        path: 'CockpitFinance',
        component: () => import('@/views/CockpitExhibition/CockpitFinance'),
        name: 'CockpitFinance',
        meta: { title: '财务数据中心' }
      }
    ]
  }
]

export default Cockpit
