import store from '@/store'
import { Message } from 'element-ui'
import approveApi from '@/api/approve'
const NODE_NAME = {
  EVENT: '事件'
}
export function ApproveEvent(eventKey, eventName) {
  this.type = 0
  this.nodeName = NODE_NAME.EVENT
  this.priority = null
  this.eventKey = eventKey
  this.eventName = eventName
  this.branchList = []
  this.conditions = []
  this.addable = null
  this.transferable = null
  this.reversible = null
  this.approverIds = []
  this.approveGroupIds = []
  this.childNode = null
}
export function Branch(eventKey, branchList) {
  this.type = 4
  this.nodeName = '分支盒子'
  this.priority = null
  this.eventKey = eventKey
  this.eventName = ''
  this.branchList = branchList
  this.conditions = []
  this.addable = null
  this.transferable = null
  this.reversible = null
  this.approverIds = []
  this.approveGroupIds = []
  this.childNode = null
}
export function Condition(name, priority, eventKey, conditions = [], childNode = null, branchId = null) {
  this.branchId = branchId
  this.type = 3
  this.nodeName = name
  this.priority = priority
  this.eventKey = eventKey
  this.eventName = ''
  this.branchList = []
  this.conditions = conditions
  this.addable = null
  this.transferable = null
  this.reversible = null
  this.approverIds = []
  this.approveGroupIds = []
  this.childNode = childNode
}
export function Approver(eventKey, approveId, addable = false, transferable = false, reversible = false, approverIds = [], approveGroupIds = [], isMultiple = false, childNode, branchId = null) {
  this.branchId = branchId
  this.type = 1
  this.approveId = approveId
  this.nodeName = '审批人'
  this.priority = null
  this.eventKey = eventKey
  this.eventName = ''
  this.branchList = []
  this.conditions = []
  this.addable = addable
  this.transferable = transferable
  this.reversible = reversible
  this.approverIds = approverIds
  this.approveGroupIds = approveGroupIds
  this.childNode = childNode

  this.isMultiple = isMultiple
}

// 逻辑关系
export const LOGICS_ZH = {
  EQUAL: '等于',
  NOT_EQUAL: '不等于',
  GREATER_THAN: '大于',
  LESS_THAN: '小于',
  GREATER_THAN_OR_EQUAL: '大于等于',
  LESS_THAN_OR_EQUAL: '小于等于',
  BETWEEN: '介于',
  IN: '为',
  NOT_IN: '不为',
  BELONG: '属于',
  NOT_BELONG: '不属于'
}
export const LOGICS_EN = {
  EQUAL: 'EQUAL',
  NOT_EQUAL: 'NOT_EQUAL',
  GREATER_THAN: 'GREATER_THAN',
  LESS_THAN: 'LESS_THAN',
  GREATER_THAN_OR_EQUAL: 'GREATER_THAN_OR_EQUAL',
  LESS_THAN_OR_EQUAL: 'LESS_THAN_OR_EQUAL',
  BETWEEN: 'BETWEEN',
  IN: 'IN',
  NOT_IN: 'NOT_IN',
  BELONG: 'BELONG',
  NOT_BELONG: 'NOT_BELONG'
}

// 条件类型
export const CONDITION_TYPE = {
  'STRING': 'STRING',
  'NUMBER': 'NUMBER',
  'DATE': 'DATE',
  'USER': 'USER',
  'MULTI_STRING': 'MULTI_STRING'
}

// userTree类型
export const USER_TREE_TYPE = {
  OFFICE: 'OFFICE',
  ROLE: 'ROLE',
  USER: 'USER'
}

// 设置store的branchId
export const SET_BRANCH_IDS = (branchId, status, isEmpty = false) => {
  const branchIds = store.state.approve.branchIds
  if (isEmpty) {
    for (const key in branchIds) {
      branchIds[key] = 'DELETE'
    }
    store.commit('approve/SET_BRANCH_IDS', { ...branchIds })
  } else {
    store.commit('approve/SET_BRANCH_IDS', { ...branchIds, [branchId]: status })
  }
}

const arrayToObject = (list) => {
  const obj = {}
  for (let i = 0; i < list.length; i++) {
    const selection = list[i]
    const { label, value } = selection
    obj[value] = label
  }
  return obj
}

// 设置审批流字段
export const SET_APPROVE_FIELDS = (conditions) => {
  const fields = {}
  // const selections = {}
  conditions.map(t => {
    const { fieldName, label, selections, typeUsableRelations, type } = t
    fields[fieldName] = {}
    fields[fieldName].label = label
    fields[fieldName].fieldName = fieldName
    fields[fieldName].type = type
    fields[fieldName].selections = arrayToObject(selections || [])
    fields[fieldName].typeUsableRelations = arrayToObject(typeUsableRelations || [])
  })
  store.commit('approve/SET_APPROVE', { key: 'fields', value: fields })
}

// 设置vuex优先级option
export const SET_PRIORITYS = (nodeConfig) => {
  if (!nodeConfig.childNode) return
  const prioritys = store.state.approve.prioritys
  if (nodeConfig.childNode.type === 3) {
    // 设置优先级option
    if (prioritys === 1) return
    store.commit('approve/SET_APPROVE', { key: 'prioritys', value: 1 })
  } else if (nodeConfig.childNode.type === 4) {
    // 设置优先级option
    const { branchList } = nodeConfig.childNode
    if (prioritys === branchList.length) return
    store.commit('approve/SET_APPROVE', { key: 'prioritys', value: branchList.length })
  }
}

// 将userTree转数组
export const treeToArray = (tree = [], obj = {}) => {
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i]
    const { type, id, childrenList, entity } = item
    // arr.push({ type, id, entity })
    obj[id] = { type, id, entity }
    if (childrenList && childrenList.length > 0) {
      treeToArray(childrenList, obj)
    }
  }
  return obj
}

// 根据id获取item 从userTree
export const getOffice = (ids) => {
  const offices = store.state.approve.offices
  const _offices = []
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]
    if (offices[id]) {
      _offices.push(offices[id])
    }
  }
  return _offices
}
// 根据id获取name
export const getOfficeName = (ids) => {
  const offices = store.state.approve.offices
  const names = []
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]
    const name = offices[id]?.entity?.name || id
    names.push(name)
  }
  return names
}

// 校验条件抽屉字段填写
export const validateConditionConfig = (config) => {
  const prioritys = store.state.approve.prioritys
  const { name, priority, conditions } = config
  if (!name) {
    Message.warning('请设置条件名')
    return false
  }
  if (!priority) {
    Message.warning('请设置优先级')
    return false
  }
  if (priority > prioritys) {
    Message.warning('请重新设置优先级')
    return false
  }
  if (conditions.length > 0) {
    const is = conditions.some(t => {
      const { fieldName, relation, objectValue } = t
      return (!fieldName || !relation ||
        (!objectValue.values && !objectValue.min && !objectValue.max && !objectValue.value && !objectValue.valueList?.length && (!objectValue.userIds?.length && !objectValue.groupIds?.length && !objectValue.roleIds?.length)))
    })
    if (is) {
      Message.warning('请设置完整条件项')
      return false
    } else {
      return true
    }
  }
  return true
}

// 判断当前用户是否有审批权限
export const isApprovalAuth = (approverId) => {
  if (!approverId) return false
  const userid = store.getters.userInfo.id
  return approverId === userid
}

/**
 * @method 批量审核
 * @param {Array} list { approvalFlowId, currentApproverId }
 * @description list为审核中的选中列表
 */
export const batchPass = (list) => {
  return new Promise((resolve, reject) => {
    if (!list.length) {
      return
    }
    const userid = store.getters.userInfo.id
    const ids = []
    for (let i = 0; i < list.length; i++) {
      const t = list[i]
      if (t.currentApproverId === userid) {
        ids.push(t.approvalFlowId)
      }
    }
    const params = {
      approvalFlowIds: ids,
      remark: ''
    }
    // 请求数据
    approveApi.batchPass(params).then((res) => {
      if (res.operatedCount !== 0) {
        resolve()
      } else {
        reject()
      }
    }).catch(e => {
      reject()
    })
  })
}
