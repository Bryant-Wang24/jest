import Layout from '@/layout'
const CustomerMsg = [
  {
    path: '/CustomerMsg',
    component: Layout,
    redirect: '/CustomerMsg/Application',
    name: 'CustomerMsg',
    meta: {
      title: '客户管理'
    },
    children: [
      {
        path: 'Application',
        component: () => import('@/views/customerMsg/application'),
        name: 'Application',
        meta: { title: '客户申请', noCache: true }
      },
      {
        path: 'Application/AddCustomer',
        component: () => import('@/views/customerMsg/AddCustomer'),
        name: 'AddCustomer',
        meta: {
          title: '添加客户',
          noCache: false
        },
        hidden: true
      },
      {
        path: 'Application/EditCustomer',
        component: () => import('@/views/customerMsg/EditCustomer'),
        name: 'EditCustomer',
        meta: {
          title: '编辑客户',
          noCache: false
        },
        hidden: true
      },
      {
        path: 'Application/CustomerInfo',
        component: () => import('@/views/customerMsg/customerInfo'),
        name: 'ApplicationCustomerInfo',
        meta: {
          title: '查看客户',
          noCache: true,
          activeMenu: '/CustomerMsg/Application'
        },
        hidden: true
      },
      // 客户管理
      {
        path: 'Management',
        component: () => import('@/views/customerMsg/management'),
        name: 'Management',
        meta: { title: '客户管理', noCache: true }
      },
      {
        path: 'Management/CustomerInfo',
        component: () => import('@/views/customerMsg/customerInfo'),
        name: 'ManagementCustomerInfo',
        meta: {
          title: '查看客户',
          noCache: true,
          activeMenu: '/CustomerMsg/Management'
        },
        hidden: true
      },
      {
        path: 'Management/EditCustomer',
        component: () => import('@/views/customerMsg/ManagementEditCustomer'),
        name: 'ManagementEditCustomer',
        meta: {
          title: '修改客户资料',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'shopList',
        component: () => import('@/views/shopCustomers/shopList'),
        name: 'shopList',
        meta: { title: '商铺客户', noCache: true }
      },
      {
        path: 'shopListAdd',
        component: () => import('@/views/shopCustomers/shopListAdd'),
        name: 'ShopListAdd',
        hidden: true,
        meta: { title: '添加客户', noCache: true }
      },
      {
        path: 'shopListEdit/:id/:type',
        component: () => import('@/views/shopCustomers/shopListAdd'),
        name: 'shopListEdit',
        hidden: true,
        meta: { title: '查看详情', noCache: true }
      },
      {
        path: 'result/:id',
        component: () => import('@/views/shopCustomers/result'),
        name: 'ShopResult',
        hidden: true,
        meta: { title: '商铺客户详情', noCache: true }
      }
    ]
  }
]

export default CustomerMsg
