import componentJSP from '@/views/componentJSP/componentJSP'
import Layout from '@/layout'
import store from '@/store'
import router from '@/router/index'

let menuArr = []
export const initMenu = async data => {
  menuArr = []
  const menuData = setTreeData(setName(data))
  await store.dispatch('permission/addJspMenu', menuData)
  router.addRoutes(menuData)
  return menuData
}
const setName = data => {
  for (const i in data) {
    if (data[i]['parentId'] === 'root') {
    // root 为一级
      menuArr.push({
        path:
          data[i].href === '' || data[i].href === undefined || data[i].href === null
            ? `/${data[i].id}`
            : data[i].href,
        id: data[i].id,
        name: data[i].id,
        parentId: data[i].parentId,
        component: Layout,
        meta: { title: data[i].name, originalPath: data[i].href, isJsp: true }
      })
    } else {
      if (!data[i].href) {
        continue
      }
      menuArr.push({
        path:
              data[i].href === '' || data[i].href === undefined
                ? undefined
                : data[i].href,
        id: data[i].id,
        name: data[i].id,
        parentId: data[i].parentId,
        component: data[i].href === '' || data[i].href === undefined || data[i].href === null ? undefined : componentJSP,
        meta: { title: data[i].name, originalPath: data[i].href, isJsp: true }
      })
    }
    if (data[i].children.length > 0) {
      setName(data[i].children)
    }
  }
  return menuArr
}
const setTreeData = json => {
  // let cloneData = JSON.parse(JSON.stringify(json)) // 对源数据深度克隆
  const tree = json.filter(father => {
    // 循环所有项
    const branchArr = json.filter(child => {
      return father.id === child.parentId // 返回每一项的子级数组
    })
    if (branchArr.length > 0) {
      father.children = branchArr // 如果存在子级，则给父级添加一个children属性，并赋值
    }
    return father.parentId === 'root' // 返回第一层
  })
  return tree
}
