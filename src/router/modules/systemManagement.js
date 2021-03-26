import Layout from '@/layout'
const SystemManagement = [
  {
    path: '/systemManagement',
    component: Layout,
    redirect: 'noRedirect',
    name: 'SystemManagement',
    alwaysShow: true,
    meta: {
      title: '系统管理'
    },
    children: [
      {
        path: 'menu',
        component: () => import('@/views/systemManagement/menu'),
        name: 'SystemManagementMenu',
        meta: { title: '菜单管理', noCache: false }
      },
      {
        path: 'menuDetail',
        component: () => import('@/views/systemManagement/info/menuInfo'),
        name: 'SystemManagementMenuDetail',
        meta: { title: '菜单详情', disabledForm: true },
        hidden: true
      },
      {
        path: 'menuEdit',
        component: () => import('@/views/systemManagement/info/menuInfo'),
        name: 'SystemManagementMenuEdit',
        meta: { title: '编辑菜单', noCache: false },
        hidden: true
      },

      {
        path: 'user',
        component: () => import('@/views/systemManagement/user'),
        name: 'SystemManagementUser',
        meta: { title: '用户管理', noCache: false }
      },
      {
        path: 'userDetail',
        component: () => import('@/views/systemManagement/info/userInfo'),
        name: 'SystemManagementUserDetail',
        meta: { title: '用户详情', disabledForm: true },
        hidden: true
      },
      {
        path: 'userEdit',
        component: () => import('@/views/systemManagement/info/userInfo'),
        name: 'SystemManagementUserEdit',
        meta: { title: '编辑用户', noCache: false },
        hidden: true
      },
      {
        path: 'userAdd',
        component: () => import('@/views/systemManagement/info/userInfo'),
        name: 'SystemManagementUserAdd',
        meta: { title: '新增用户', noCache: false },
        hidden: true
      },

      {
        path: 'role',
        component: () => import('@/views/systemManagement/role'),
        name: 'SystemManagementRole',
        meta: { title: '角色管理', noCache: false }
      },
      {
        path: 'roleDetail',
        component: () => import('@/views/systemManagement/info/roleInfo'),
        name: 'SystemManagementRoleDetail',
        meta: { title: '角色详情', disabledForm: true },
        hidden: true
      },
      {
        path: 'roleEdit',
        component: () => import('@/views/systemManagement/info/roleInfo'),
        name: 'SystemManagementRoleEdit',
        meta: { title: '编辑角色', noCache: false },
        hidden: true
      },
      {
        path: 'roleAdd',
        component: () => import('@/views/systemManagement/info/roleInfo'),
        name: 'SystemManagementRoleAdd',
        meta: { title: '新增角色', noCache: false },
        hidden: true
      },

      {
        path: 'office',
        component: () => import('@/views/systemManagement/office'),
        name: 'SystemManagementOffice',
        meta: { title: '机构管理', noCache: false }
      },
      {
        path: 'officeDetail',
        component: () => import('@/views/systemManagement/info/officeInfo'),
        name: 'SystemManagementOfficeDetail',
        meta: { title: '机构详情', disabledForm: true },
        hidden: true
      },
      {
        path: 'officeEdit',
        component: () => import('@/views/systemManagement/info/officeInfo'),
        name: 'SystemManagementOfficeEdit',
        meta: { title: '编辑机构', noCache: false },
        hidden: true
      },
      {
        path: 'officeAdd',
        component: () => import('@/views/systemManagement/info/officeInfo'),
        name: 'SystemManagementOfficeAdd',
        meta: { title: '新增机构', noCache: false },
        hidden: true
      },

      {
        path: 'dictionary',
        component: () => import('@/views/systemManagement/dictionary'),
        name: 'SystemManagementDictionary',
        meta: { title: '字典管理', noCache: false }
      },
      {
        path: 'dictionaryDetail',
        component: () => import('@/views/systemManagement/info/dictionaryInfo'),
        name: 'SystemManagementDictionaryDetail',
        meta: { title: '字典详情', disabledForm: true },
        hidden: true
      },
      {
        path: 'dictionaryEdit',
        component: () => import('@/views/systemManagement/info/dictionaryInfo'),
        name: 'SystemManagementDictionaryEdit',
        meta: { title: '编辑字典', noCache: false },
        hidden: true
      },
      {
        path: 'dictionaryAdd',
        component: () => import('@/views/systemManagement/info/dictionaryInfo'),
        name: 'SystemManagementDictionaryAdd',
        meta: { title: '新增字典', noCache: false },
        hidden: true
      },

      {
        path: 'thirdManagement',
        component: () => import('@/views/systemManagement/thirdManagement'),
        name: 'SystemManagementThirdManagement',
        meta: { title: '第三方系统管理', noCache: false }
      },
      {
        path: 'thirdManagementDetail',
        component: () => import('@/views/systemManagement/info/thirdManagementInfo'),
        name: 'SystemManagementThirdManagementDetail',
        meta: { title: '查看第三方系统管理', disabledForm: true },
        hidden: true
      },
      {
        path: 'thirdManagementEdit',
        component: () => import('@/views/systemManagement/info/thirdManagementInfo'),
        name: 'SystemManagementThirdManagementEdit',
        meta: { title: '修改第三方系统管理', noCache: false },
        hidden: true
      },
      {
        path: 'thirdManagementAdd',
        component: () => import('@/views/systemManagement/info/thirdManagementInfo'),
        name: 'SystemManagementThirdManagementAdd',
        meta: { title: '新增第三方系统管理', noCache: false },
        hidden: true
      },

      {
        path: 'sysConfig',
        component: () => import('@/views/systemManagement/sysConfig'),
        name: 'SystemManagementSysConfig',
        meta: { title: '系统配置管理', noCache: false }
      },
      {
        path: 'sysConfigDetail',
        component: () => import('@/views/systemManagement/info/sysConfigInfo'),
        name: 'SystemManagementSysConfigDetail',
        meta: { title: '查看系统配置', disabledForm: true },
        hidden: true
      },
      {
        path: 'sysConfigEdit',
        component: () => import('@/views/systemManagement/info/sysConfigInfo'),
        name: 'SystemManagementSysConfigEdit',
        meta: { title: '修改系统配置', noCache: false },
        hidden: true
      },
      {
        path: 'sysConfigAdd',
        component: () => import('@/views/systemManagement/info/sysConfigInfo'),
        name: 'SystemManagementSysConfigAdd',
        meta: { title: '新增系统配置', noCache: false },
        hidden: true
      },

      {
        path: 'synchroExhibitor',
        component: () => import('@/views/systemManagement/synchroExhibitor'),
        name: 'SystemManagementSynchroExhibitor',
        meta: { title: '同步展商信息', noCache: false }
      }

    ]
  }
]

export default SystemManagement
