import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })
    return hasPermission
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

// 用来控制按钮的显示（主场角色配置）
export function hasRolePermission(permission) {
  const myBtns = store.getters.buttons
  return myBtns.includes(permission)
}

// 判断传入id是否和当前登录用户id一致，用于控制 "创建者可操作"
export function isSameUser(createId) {
  const userid = store.getters.userInfo.id
  return createId === userid
}

/**
 * "创建者可操作" 和 "角色按钮控制" 同时判断函数，
 * "角色按钮控制" 优先级高于 "创建者可操作"
 */
export function hasRoleUserPermission(permission, createId) {
  const myBtns = store.getters.buttons
  const userid = store.getters.userInfo.id
  if (!createId) return true // 如果不存在创建人id 默认有权限
  if (myBtns.includes(permission)) {
    return true
  } else if (String(createId) === String(userid)) {
    return true
  }
  return false
}
