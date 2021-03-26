
export const STATE = {
  SAVED: '待提交',
  SUBMITTED: '审核中',
  APPROVED: '审核通过',
  REJECTED: '已拒绝'
}
export const STATE_ARRAY = [
  {
    label: '待提交',
    value: 'SAVED'
  },
  {
    label: '审核中',
    value: 'SUBMITTED'
  },
  {
    label: '审核通过',
    value: 'APPROVED'
  },
  {
    label: '已拒绝',
    value: 'REJECTED'
  }
]

export const COMPANY_NATURE = {
  STATE_ENTERPRISE: '国有企业',
  JOINT_VENTURE: '合资企业',
  PRIVATE_ENTERPRISE: '民营企业',
  PUBLIC_INSTITUTION: '事业单位',
  FOREIGN_ENTERPRISE: '外资企业',
  ASSOCIATION: '协会组织',
  GOVERNMENT: '政府单位'
}

export const COMPANY_NATURE_ARRAY = [
  {
    label: '国有企业',
    value: 'STATE_ENTERPRISE'
  },
  {
    label: '合资企业',
    value: 'JOINT_VENTURE'
  },
  {
    label: '民营企业',
    value: 'PRIVATE_ENTERPRISE'
  },
  {
    label: '事业单位',
    value: 'PUBLIC_INSTITUTION'
  },
  {
    label: '外资企业',
    value: 'FOREIGN_ENTERPRISE'
  },
  {
    label: '协会组织',
    value: 'ASSOCIATION'
  },
  {
    label: '政府单位',
    value: 'GOVERNMENT'
  }
]

export const GENDER = [
  { value: 'MALE', label: '男' },
  { value: 'FEMALE', label: '女' }
]
export const GENDER_OBJECT = { MALE: '男', FEMALE: '女' }

export const INVOICE_TYPE_OBJECT = {
  VAT_INVOICE: '增值税专用发票',
  ORDINARY: '普通发票'
}
export const INVOICE_TYPE = [
  { value: 'VAT_INVOICE', label: '增值税专用发票' },
  { value: 'ORDINARY', label: '普通发票' }
]
