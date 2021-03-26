import Layout from '@/layout'
const siteMarket = [
  {
    path: '/SiteMarket',
    component: Layout,
    redirect: '/SiteMarket/SiteReserve',
    name: 'SiteMarket',
    meta: { title: '场地销售' },
    children: [
      {
        path: 'SiteReserve',
        component: () => import('@/views/SiteReserve/SiteReserve'),
        name: 'SiteReserve',
        meta: { title: '场地预订申请', noCache: true }
      },
      {
        path: 'SiteReserve/AddSiteProjectForm',
        component: () => import('@/views/SiteReserve/AddSiteProjectForm'),
        name: 'AddSiteProjectForm',
        meta: { title: '添加预订', noCache: true },
        hidden: true
      },
      {
        path: 'SiteReserve/EditSiteProjectForm',
        component: () => import('@/views/SiteReserve/EditSiteProjectForm'),
        name: 'EditSiteProjectForm',
        meta: { title: '编辑预定', noCache: true },
        hidden: true
      },
      {
        path: 'SiteReserve/ChangeSiteProjectForm',
        component: () => import('@/views/SiteReserve/ChangeSiteProjectForm'),
        name: 'ChangeSiteProjectForm',
        meta: { title: '档期变更', noCache: true },
        hidden: true
      },
      {
        path: 'SiteReserve/SiteReserveInfo',
        component: () => import('@/views/SiteReserve/siteReserveInfo'),
        name: 'SiteReserveInfo',
        meta: { title: '查看详情', noCache: true, activeMenu: '/SiteMarket/SiteReserve' },
        hidden: true
      },
      {
        path: 'ScheduleView',
        component: () => import('@/views/customerMsg/scheduleview'),
        name: 'ScheduleView',
        meta: { title: '排期视图', noCache: true, activeMenu: '/SiteMarket/SiteReserve' }
      },
      {
        path: 'RankingInforMation',
        component: () => import('@/views/SiteReserve/rankingInforMation'),
        name: 'RankingInforMation',
        meta: { title: '排期信息发布', noCache: true }
      },
      {
        path: 'RankingInforMationInfo/:id',
        component: () => import('@/views/SiteReserve/components/rankingInforMationInfo'),
        name: 'RankingInforMationInfo',
        meta: { title: '项目详情', noCache: true },
        hidden: true
      }
    ]
  }
]

export default siteMarket
