import base from './base'
import axios from '@/utils/http'
// import qs from 'qs'

const content = {
  // 管理 - 获取结点树，types中指定的结点类型列表(英文逗号分隔)，可以根据资料库结点类型进行筛选；若不指定types，则表示不限制类型
  treeType: params => {
    return axios.get(`${base.hall}api/hall/rest/datalib/node/tree?types=` + params.types, params)
  },
  // 管理 - 分页查询
  datalibList: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/node/page`, params)
  },
  // 管理 - 通过id获取详情（通过资料库结点id获取结点详情，其中depth表示递归寻找子结点的深度，0表示不寻找，1表示找到一级子代，以此类推）
  datalibEdit: params => {
    return axios.get(`${base.hall}api/hall/rest/datalib/node/` + params.id + '/' + params.depth, params)
  },
  // 管理 - 创建
  datalibAdd: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/node`, params)
  },
  // 管理 - 重命名
  datalibReplace: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/node/rename`, params)
  },
  // 管理 - 预览
  datalibPreview: params => {
    return axios.get(`${base.hall}api/hall/rest/datalib/node/preview/` + params.id, params)
  },
  // 管理 - 批量删除
  datalibDelete: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/node/batch/delete`, params)
  },
  // 管理 - 批量上传
  datalibUpload: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/node/batch/upload`, params)
  },
  // 管理 - 批量下载
  datalibDownload: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/node/batch/download`, params)
  },
  downloadFiles: (ids) => {
    return `http://${window.location.host}${base.hall}api/hall/rest/datalib/node/batch/download?ids=${ids}`
  },
  // 管理 - 批量内部移动/复制
  datalibCopy: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/node/batch/copy/` + params.pid + '/' + params.keepSource, params)
  },
  // 权限 - 获取成员树
  permissionConfigTree: params => {
    return axios.get(`${base.hall}api/hall/rest/datalib/permissionConfig/tree/` + params.type + '/' + params.userIncluded, params)
  },
  // 权限 - 查询
  permissionConfigQuery: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/permissionConfig/query`, params)
  },
  // 权限 - 获取资料库结点的用户权限
  permissionConfigNodeId: nodeId => {
    return axios.get(`${base.hall}api/hall/rest/datalib/permissionConfig/` + nodeId)
  },
  // 权限 - 获取权限组配置信息
  groupConfig: params => {
    return axios.get(`${base.hall}api/hall/rest/datalib/permissionConfig/` + params.id + '/groupConfig', params)
  },
  // 权限 - 更新权限组的下载权限
  groupConfigDownload: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/permissionConfig/` + params.id + '/groupConfig', params.json)
  },
  // 权限 - 修改资料库结点的权限组成员配置
  distributionByGroup: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/permissionConfig/` + params.id + '/groupMember/' + params.groupKey, params.members)
  },
  // 权限 - 修改权限(未启用)
  permissionConfigEdit: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/permissionConfig/` + params.id, params)
  },
  // 申请 - 分页查询
  applicationList: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/application/page`, params)
  },
  // 申请 - 根据id获取详情
  applicationNew: params => {
    return axios.get(`${base.hall}api/hall/rest/datalib/application/` + params.id, params)
  },
  // 申请 - 提交
  applicationAdd: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/application`, params)
  },
  // 申请 - 审核
  applicationAudit: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/application/review`, params)
  },
  // 申请 - 作废
  applicationDelete: params => {
    return axios.delete(`${base.hall}api/hall/rest/datalib/application/` + params.id, params)
  },
  // 申请 - 获取申请人列表
  applicantList: params => {
    return axios.get(`${base.hall}api/hall/rest/datalib/application/applicant?operationTypes=` + params.operationTypes, params)
  },
  // 申请 - 获取审批流信息
  progress: params => {
    return axios.get(`${base.hall}api/hall/rest/datalib/application/review/progress/` + params.id, params)
  },
  // 申请 - 查询申请节点
  applicationNodeQuery: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/applicationNode/query`, params)
  },
  // 日志 - 分页查询
  operationLog: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/operationLog/page`, params)
  },
  // 日志 - 查询
  operationLogBoth: params => {
    return axios.post(`${base.hall}api/hall/rest/datalib/operationLog/query`, params)
  },
  // 日志 - 获取操作人列表
  operatorList: params => {
    return axios.get(`${base.hall}api/hall/rest/datalib/operationLog/operator?operationTypes=` + params.operationTypes, params)
  }

}
export default content
