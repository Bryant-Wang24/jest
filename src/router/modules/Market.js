import Layout from '@/layout'
const Market = [
  {
    path: '/market',
    component: Layout,
    name: 'Market',
    hidden: false,
    meta: {
      title: '销售管理'
    },
    children: [
      {
        path: 'sale/:id/:type',
        component: () => import('@/views/sale/sale'),
        name: 'sale',
        meta: { title: '订单管理' },
        hidden: true
      },
      {
        path: 'saleAdd/:id/:type',
        component: () => import('@/views/sale/saleAdd'),
        name: 'saleAdd',
        meta: {
          title: '创建订单'

        },
        hidden: true
      }, {
        path: 'saleEdit/:id/:type',
        component: () => import('@/views/sale/saleAdd'),
        name: 'saleEdit',
        meta: {
          title: '修改订单'

        },
        hidden: true
      },
      {
        path: 'saleDetails/:id',
        component: () => import('@/views/sale/saleDetails'),
        name: 'saleDetails',
        meta: {
          title: '订单详情'

        },
        hidden: true
      },
      {
        path: 'siteMarket',
        component: () => import('@/views/siteMarket/siteMarket'),
        name: 'siteMarket',
        meta: { title: '项目管理', noCache: true }
      },
      {
        path: 'siteMarket/siteMarketTime',
        component: () => import('@/views/siteMarket/siteMarketTime'),
        name: 'siteMarketTime',
        meta: {
          title: '场地时间安排',
          noCache: true,
          activeMenu: '/market/siteMarket'
        },
        hidden: true
      },
      {
        path: 'siteMarket/projectData',
        component: () => import('@/views/siteMarket/projectData'),
        name: 'projectData',
        meta: {
          title: '项目资料',
          noCache: true,
          activeMenu: '/market/siteMarket'
        },
        hidden: true
      },
      {
        path: 'shop',
        component: () => import('@/views/shop/shop'),
        name: 'Shop',
        meta: { title: '商铺管理', noCache: true }
      },
      {
        path: 'shopAdd',
        component: () => import('@/views/shop/shopAdd'),
        name: 'shopAdd',
        meta: { title: '添加商铺', noCache: true, activeMenu: '/market/shop' },
        hidden: true
      },
      {
        path: 'shopEdit/:id',
        component: () => import('@/views/shop/shopAdd'),
        name: 'shopEdit',
        meta: { title: '商铺详情', noCache: true },
        hidden: true
      },
      {
        path: 'payment',
        component: () => import('@/views/payment/payment'),
        name: 'payment',
        meta: { title: '付款通知书', noCache: true }
      },
      {
        path: 'paymentEdit/:id',
        component: () => import('@/views/payment/paymentEdit'),
        name: 'paymentEdit',
        meta: { title: '查看付款通知书', noCache: true },
        hidden: true
      },
      {
        path: 'collection/:id',
        component: () => import('@/views/shop/collection'),
        name: 'ShopCollection',
        meta: { title: '收款列表', noCache: true },
        hidden: true
      },
      // 合同/服务订单
      {
        path: 'contract',
        component: () => import('@/views/contract/contract'),
        name: 'contract',
        meta: { title: '合同与服务单' }
      },
      {
        path: 'contractAdd/:id/:type',
        component: () => import('@/views/contract/contractAdd'),
        name: 'contractAdd',
        meta: { title: '生成合同' },
        hidden: true
      },
      {
        path: 'contractEdit/:id',
        component: () => import('@/views/contract/contractEdit'),
        name: 'contractEdit',
        meta: { title: '查看合同', noCache: false },
        hidden: true
      }, {
        path: 'contractAudit/:id',
        component: () => import('@/views/contract/contractEdit'),
        name: 'contractAudit',
        meta: { title: '合同审批' },
        hidden: true
      }
    ]
  }
]

export default Market
