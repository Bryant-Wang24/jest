import Layout from '@/layout'
const Agreement = [
  {
    path: '/agreement',
    component: Layout,
    name: 'Agreement',
    meta: {
      title: '财务管理',
      icon: ''
    },
    alwaysShow: true,
    children: [
      // 合同
      // {
      //   path: 'contract',
      //   component: () => import('@/views/contract/contract'),
      //   name: 'contract',
      //   meta: { title: '合同与服务单' }
      // },
      // {
      //   path: 'contractAdd/:id/:type',
      //   component: () => import('@/views/contract/contractAdd'),
      //   name: 'contractAdd',
      //   meta: { title: '生成合同' },
      //   hidden: true
      // },
      // {
      //   path: 'contractEdit/:id',
      //   component: () => import('@/views/contract/contractEdit'),
      //   name: 'contractEdit',
      //   meta: { title: '查看合同' },
      //   hidden: true
      // }, {
      //   path: 'contractAudit/:id',
      //   component: () => import('@/views/contract/contractEdit'),
      //   name: 'contractAudit',
      //   meta: { title: '合同审批' },
      //   hidden: true
      // },
      // // 资料交接
      // {
      //   path: 'handoverSlipMgmt',
      //   component: () => import('@/views/handoverSlipMgmt/index'),
      //   name: 'handoverSlipMgmt',
      //   meta: {
      //     title: '资料交接'
      //   }
      // },
      // 台账管理
      {
        path: 'AccountManage',
        // component: Layout,
        // redirect: '/AccountManage/account/accoutList',
        component: () => import('@/views/accountMangement/account'),
        name: 'AccountManage',
        meta: {
          title: '台账管理'
        }
      },
      {
        path: 'collection',
        component: () => import('@/views/accountMangement/collection'),
        name: 'collection',
        hidden: true,
        meta: { title: '订单收款' }
      },
      // 押金管理
      {
        path: 'depositList',
        component: () => import('@/views/depositMsg/depositList'),
        name: 'DepositList',
        meta: { title: '押金管理', noCache: true }
      },
      {
        path: 'collectionPro',
        component: () => import('@/views/depositMsg/collectionPro'),
        name: 'CollectionPro',
        meta: { title: '收款处理', noCache: true },
        hidden: true
      },
      // 退款管理
      {
        path: 'refund',
        component: () => import('@/views/refund/refund'),
        name: 'refund',
        meta: { title: '退款管理' }
      }, {
        path: 'refundEdit/:id',
        component: () => import('@/views/refund/refundEdit'),
        name: 'refundEdit',
        meta: { title: '查看呈批件' },
        hidden: true
      }, {
        path: 'refundEditNew/:id',
        component: () => import('@/views/refund/refundEditNew'),
        name: 'refundEditNew',
        meta: { title: '修改退款申请' },
        hidden: true
      }, {
        path: 'refundAudit/:id',
        component: () => import('@/views/refund/refundEdit'),
        name: 'refundAudit',
        meta: { title: '审核呈批件' },
        hidden: true
      },
      // 票据管理
      {
        path: 'BillManagement',
        // component: Layout,
        // redirect: '/BillManagement/bill/invoiceList',
        component: () => import('@/views/billManagement/bill'),
        name: 'BillManagement',
        meta: { title: '票据管理' }
        // children: [
        // ]
      },
      {
        path: 'billEdit/:id',
        // component: Layout,
        // redirect: '/BillManagement/bill/invoiceList',
        component: () => import('@/views/billManagement/billEdit'),
        name: 'billEdit',
        meta: { title: '查看申请表' },
        hidden: true
        // children: [
        // ]
      },
      {
        // 申请发票
        path: 'applayForm',
        component: () => import('@/views/billManagement/components/applayInvoiceForm'),
        name: 'ApplayInvoiceForm',
        hidden: true,
        meta: { title: '申请发票' }
      },
      {
        // 修改发票
        path: 'editInvoiceForm',
        component: () => import('@/views/billManagement/components/editInvoiceForm'),
        name: 'EditInvoiceForm',
        hidden: true,
        meta: { title: '修改发票申请' }
      },
      {
        // 申请收据
        path: 'applayReceipt',
        component: () => import('@/views/billManagement/components/applayReceiptForm'),
        name: 'ApplayReceiptForm',
        hidden: true,
        meta: { title: '申请收据' }
      },
      {
        // 修改申请收据
        path: 'editReceiptForm',
        component: () => import('@/views/billManagement/components/editReceiptForm'),
        name: 'EditReceiptForm',
        hidden: true,
        meta: { title: '修改申请收据' }
      },
      {
        // 查看发票
        path: 'catInvoice',
        component: () => import('@/views/billManagement/components/catInvoice'),
        name: 'catInvoice',
        hidden: true,
        meta: { title: '查看发票' }
      },
      {
        // 查看收据
        path: 'catReceipt',
        component: () => import('@/views/billManagement/components/catReceipt'),
        name: 'catReceipt',
        hidden: true,
        meta: { title: '查看收据' }
      },
      {
        // 申请发票反馈页面
        path: 'applayFeedback',
        component: () => import('@/views/billManagement/components/applayFeedback'),
        name: 'applayFeedback',
        hidden: true,
        meta: { title: '申请发票反馈' }
      }

    ]
  }
]

export default Agreement
