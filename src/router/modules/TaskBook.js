import Layout from '@/layout'
const TaskBook = [
  {
    path: '/TaskBook',
    component: Layout,
    redirect: '/TaskBook/TaskBookAdmin',
    name: 'TaskBook',
    meta: {
      title: '项目统筹'
    },
    alwaysShow: true,
    children: [
      // 资料交接
      {
        path: 'handoverSlipMgmt',
        component: () => import('@/views/handoverSlipMgmt/index'),
        name: 'handoverSlipMgmt',
        meta: {
          title: '资料交接'
        }
      },
      // 任务书管理
      {
        path: 'TaskBookAdmin',
        component: () => import('@/views/taskBook/taskBookAdmin'),
        name: 'TaskBookAdmin',
        meta: { title: '任务书管理', noCache: true }
      },
      {
        path: 'TaskBookAdmin/CompileBook',
        component: () => import('@/views/taskBook/compileBook'),
        name: 'CompileBook',
        meta: { title: '编写任务书', noCache: true },
        hidden: true
      },
      {
        path: 'TaskBookAdmin/lookbook',
        component: () => import('@/views/taskBook/lookTaskBook'),
        name: 'LookBook',
        meta: { title: '查看任务书', noCache: true },
        hidden: true
      },
      {
        path: 'TaskBookAdmin/TaskTail',
        component: () => import('@/views/taskBook/taskTail'),
        name: 'TaskTail',
        meta: { title: '任务跟踪', noCache: true },
        hidden: true
      },
      {
        path: 'TaskBookAdmin/CompileBook/taskParticulars',
        component: () => import('@/views/taskBook/taskParticulars'),
        name: 'TaskParticulars',
        meta: { title: '任务明细', noCache: true },
        hidden: true
      }
    ]
  }
]

export default TaskBook
