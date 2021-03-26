export default {
  components: {
    // 用户管理
    '/views/systemManagement/user': () => import('@/views/systemManagement/user'),
    '/views/systemManagement/info/userInfo': () => import('@/views/systemManagement/info/userInfo'),

    // 角色管理
    '/views/systemManagement/role': () => import('@/views/systemManagement/role'),
    '/views/systemManagement/info/roleInfo': () => import('@/views/systemManagement/info/roleInfo'),

    // 字典管理
    '/views/systemManagement/dictionary': () => import('@/views/systemManagement/dictionary'),
    '/views/systemManagement/info/dictionaryInfo': () => import('@/views/systemManagement/info/dictionaryInfo'),

    // 第三方配置管理
    '/views/systemManagement/sysConfig': () => import('@/views/systemManagement/sysConfig'),
    '/views/systemManagement/info/sysConfigInfo': () => import('@/views/systemManagement/info/sysConfigInfo'),

    // 机构管理
    '/views/systemManagement/office': () => import('@/views/systemManagement/office'),
    '/views/systemManagement/info/officeInfo': () => import('@/views/systemManagement/info/officeInfo')

  },
  name: {
    // 用户管理
    '/systemManagement/user': 'SystemManagementUser',
    '/systemManagement/userDetail': 'SystemManagementUserDetail',
    '/systemManagement/userEdit': 'SystemManagementUserEdit',
    '/systemManagement/userAdd': 'SystemManagementUserAdd',

    // 角色管理
    '/systemManagement/role': 'SystemManagementRole',
    '/systemManagement/roleDetail': 'SystemManagementRoleDetail',
    '/systemManagement/roleEdit': 'SystemManagementRoleEdit',
    '/systemManagement/roleAdd': 'SystemManagementRoleAdd',

    // 字典管理
    '/systemManagement/dictionary': 'SystemManagementDictionary',
    '/systemManagement/dictionaryDetail': 'SystemManagementDictionaryDetail',
    '/systemManagement/dictionaryEdit': 'SystemManagementDictionaryEdit',
    '/systemManagement/dictionaryAdd': 'SystemManagementDictionaryAdd',

    // 第三方配置管理
    '/systemManagement/sysConfig': 'SystemManagementSysConfig',
    '/systemManagement/sysConfigDetail': 'SystemManagementSysConfigDetail',
    '/systemManagement/sysConfigEdit': 'SystemManagementSysConfigEdit',
    '/systemManagement/sysConfigAdd': 'SystemManagementSysConfigAdd',

    // 机构管理
    '/systemManagement/office': 'SystemManagementOffice',
    '/systemManagement/officeDetail': 'SystemManagementOfficeDetail',
    '/systemManagement/officeEdit': 'SystemManagementOfficeEdit',
    '/systemManagement/officeAdd': 'SystemManagementOfficeAdd'

  }
}
