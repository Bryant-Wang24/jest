
export const REFUND_STATUS = {
  ALL: 'ALL',
  FOR_REFUND: 'FOR_REFUND',
  WAITING_REFUND: 'WAITING_REFUND',
  INVALID_REFUND: 'INVALID_REFUND',
  HAS_REFUND: 'HAS_REFUND',
  APPROVING: 'APPROVING',
  REJECTED: 'REJECTED'
}

export const REFUND_STATUS_TEXT = {
  ALL: '全部',
  FOR_REFUND: '待退款',
  WAITING_REFUND: '退款中',
  INVALID_REFUND: '已作废',
  HAS_REFUND: '已退款',
  APPROVING: '审核中',
  REJECTED: '审核拒绝'
}

export const REFUND_STATUS_OPTIONS = [
  {
    value: 'ALL',
    label: '全部'
  },
  {
    value: 'FOR_REFUND',
    label: '待退款'
  },
  {
    value: 'WAITING_REFUND',
    label: '退款中'
  },
  {
    value: 'INVALID_REFUND',
    label: '已作废'
  },
  {
    value: 'HAS_REFUND',
    label: '已退款'
  },
  {
    value: 'APPROVING',
    label: '审核中'
  },
  {
    value: 'REJECTED',
    label: '审核拒绝'
  }
]

export const RADIO = {
  ALL: 'ALL',
  PENDING_REVIEW: 'PENDING_REVIEW',
  COMPLETE: 'COMPLETE',
  PENDING_REFUND: 'PENDING_REFUND'
}

export const REFUND_TYPE = {
  DEPOSIT_REFUND: {
    value: 'DEPOSIT_REFUND',
    label: '押金退款'
  },
  ORDER_REFUND: {
    value: 'ORDER_REFUND',
    label: '订单退款'
  }
}
