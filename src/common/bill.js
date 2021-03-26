import { hasRolePermission } from '@/utils/permission'

export const CONTENT_OPTIONS = [
  {
    label: '展览服务费',
    value: 'EXHIBITION',
    type: 'SERVICE'
  },
  {
    label: '会议服务费',
    value: 'MEETING',
    type: 'SERVICE'
  },
  {
    label: '灯箱服务费',
    value: 'LIGHT',
    type: 'SERVICE'
  },
  {
    label: '有偿服务费',
    value: 'PAID',
    type: 'SERVICE'
  },
  {
    label: '租金',
    value: 'RENT',
    type: 'RENT'
  }
]

export const CONTENT_OPTIONS_TYPE = {
  EXHIBITION: 'SERVICE',
  MEETING: 'SERVICE',
  LIGHT: 'SERVICE',
  PAID: 'SERVICE',
  RENT: 'RENT'
}
export const CONTENT_OPTIONS_TYPE_ZH = {
  RENT: '租金',
  EXHIBITION: '展览服务费',
  MEETING: '会议服务费',
  LIGHT: '灯箱服务费',
  PAID: '有偿服务费'
}

export const CONTENT_TYPE = {
  SERVICE: 'SERVICE',
  RENT: 'RENT'
}

export const CHECK_STATE = {
  REVIEW: '审核中',
  REJECTED: '已拒绝',
  PASSED: '已通过',
  CANCEL: '已作废',
  CANCELED: '已取消'
}

export const CHECK_STATE_ARRAY = [
  { label: 'REVIEW', value: '审核中' },
  { label: 'PASSED', value: '已通过' },
  { label: 'REJECTED', value: '已拒绝' },
  { label: 'CANCEL', value: '已作废' },
  { label: 'CANCELED', value: '已取消' }
]
export const RADIO = {
  ALL: 'ALL',
  PENDING: 'PENDING',
  COMPLETE: 'COMPLETE'
}

export const INVOICE_STATE = {
  UNBILLED: '未开票',
  INVOICED: '已开票'
}

export const RECEIPT_STATE = {
  NORECEIPT: '未开收据',
  RECEIPTED: '已开收据',
  RECOVER: '已回收'
}

export const RECEIPT_STATE_OPTIONS = [
  { value: 'NORECEIPT', label: '未开收据' },
  { value: 'RECEIPTED', label: '已开收据' },
  { value: 'RECOVER', label: '已回收' }
]

export const isShowApplyBtn = (row) => {
  return row.checkState === 'PASSED'
}

export const isShowConfirm = (row) => {
  return row.checkState === 'PASSED' && row.invoiceState === 'UNBILLED' && hasRolePermission('applayForm_confirm')
}

export const isShowCancel = (row) => {
  return hasRolePermission('applayForm_void') && row.checkState === 'PASSED'
}

export const isShowMore = (row) => {
  return isShowApplyBtn(row) || isShowApplyBtn(row) || isShowCancel(row)
}
