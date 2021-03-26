import base from './base'
import axios from '@/utils/http'
// import qs from 'qs'

const contract = {
  // 合同 - 获取合同编号前缀列表
  contractCodePrefixList: params => {
    return axios.get(
      `${base.hall}api/hall/rest/businessmanagement/contract/contractCodePrefixList`,
      params
    )
  },
  // 合同 - 获取手册列表
  manualList: params => {
    return axios.get(
      `${base.hall}api/hall/rest/businessmanagement/contract/manualList`,
      params
    )
  },
  // 合同 - 根据订单id获取关联合同列表
  contractsListByOrder: params => {
    return axios.get(
      `${base.hall}api/hall/rest/businessmanagement/contract/listByOrder/` +
        params.id,
      params
    )
  },
  // 合同 - 审核
  contractsApprove: params => {
    return axios.put(
      `${base.hall}api/hall/rest/businessmanagement/contract/approve`,
      params
    )
  },
  // 合同 - 审核批量通过
  contractsBatchPass: params => {
    return axios.put(
      `${base.hall}api/hall/rest/businessmanagement/contract/batchPass`,
      params
    )
  },
  // 合同 - 保存并提交(附加合同提交)
  saveAndSubmit: params => {
    return axios.post(
      `${base.hall}api/hall/rest/businessmanagement/contract/saveAndSubmit`,
      params
    )
  },
  // 合同 - 保存
  contractsSave: params => {
    return axios.post(
      `${base.hall}api/hall/rest/businessmanagement/contract/save`,
      params
    )
  },
  // 合同 - 提交
  contractsSubmit: params => {
    return axios.put(
      `${base.hall}api/hall/rest/businessmanagement/contract/submit`,
      params
    )
  },

  // 合同 - 添加回传文件
  contractsReturnFile: params => {
    return axios.post(
      `${base.hall}api/hall/rest/businessmanagement/contract/returnFile`,
      params
    )
  },
  // 合同 - 删除回传文件
  contractsReturnFileId: params => {
    return axios.delete(
      `${base.hall}api/hall/rest/businessmanagement/returnFile/` + params.id
    )
  },
  // 合同 - 获取合同全部信息
  contractInfo: params => {
    return axios.get(
      `${base.hall}api/hall/rest/businessmanagement/contract/info/` + params.id
    )
  },
  // 合同 - 获取合同基本信息
  contractId: params => {
    return axios.post(
      `${base.hall}api/hall/rest/businessmanagement/contract/` + params.id
    )
  },
  // 合同 - 作废
  contractDeleteId: params => {
    return axios.delete(
      `${base.hall}api/hall/rest/businessmanagement/contract/` + params.id
    )
  },
  // 合同 - 获取审批流
  contractApprove: params => {
    return axios.get(
      `${base.hall}api/hall/rest/businessmanagement/contract/approve_progress/` +
        params.id
    )
  },

  // 合同 - 分页查询
  contractList: params => {
    return axios.post(
      `${base.hall}api/hall/rest/businessmanagement/contract/page`,
      params
    )
  },
  // 合同 - 获取合同模板
  contractTemplates: params => {
    return axios.post(`${base.hall}api/hall/rest/businessmanagement/contract/templates`, params)
  },
  // 场地销售列表
  projectList: params => {
    return axios.post(
      `${base.hall}api/hall/rest/sale/page`,
      params
    )
  },
  // 通过id查询场地销售信息
  projectId: params => {
    return axios.get(
      `${base.hall}api/hall/rest/sale?id=` + params.id,
      params
    )
  },

  // 合同 - 获取项目下所有生效的主合同
  effectiveMainContracts: params => {
    return axios.get(
      `${base.hall}api/hall/rest/businessmanagement/contract/effectiveMainContracts/` + params.id,
      params
    )
  },
  // 获取文件信息
  getAttachment: params => {
    return axios.get(
      `${base.hall}a/api/ossfile/getAttachment?fileId=` + params.id,
      params
    )
  },
  // 合同模板
  downloadInAttachmentWay: params => {
    return axios.get(
      `${base.hall}api/hall/rest/businessmanagement/contract/downloadInAttachmentWay?id=` + params.id + '&type=' + params.type,
      params
    )
  },
  // 合同 - 获取订单所有收款账户信息
  accountList: params => {
    return axios.get(
      `${base.hall}api/hall/rest/businessmanagement/contract/orderCollectionAccountInfo/` + params.id,
      params
    )
  },
  // 获取合同补充参数中配套服务的默认值
  defaultSupportingServices: params => {
    return axios.get(
      `${base.hall}api/hall/rest/businessmanagement/contract/supplementaryParamValues/defaultSupportingServices`,
      params
    )
  },
  // 合同 - 获取DOCX文档或ZIP包（返回流）
  downloadInStreamWay: params => {
    return axios.get(
      `${base.hall}api/hall/rest/businessmanagement/contract/downloadInStreamWay?ids=` + params.id,
      params
    )
  },
  // 合同 - 以图片形式下载合同
  downloadInImageWay: params => {
    return axios.get(
      `${base.hall}api/hall/rest/businessmanagement/contract/downloadInImageWay?id=` + params.id,
      params
    )
  },
  // 查看合同回传文件
  returnFileInfo: id => {
    return axios.get(`${base.hall}api/hall/rest/businessmanagement/contract/contractReturn/${id}`)
  },
  // 保存回传
  saveReturnInfo: params => {
    return axios.put(`${base.hall}api/hall/rest/businessmanagement/contract/contractReturn`, params)
  },
  downloadReturnFile: ids => {
    return axios.get(`${base.hall}api/hall/rest/businessmanagement/contract/contractReturn/export?ids=` + ids)
  }
}
export default contract
