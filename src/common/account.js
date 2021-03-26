export const ACTION = {
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  PAY_DEPOSIT: 'PAY_DEPOSIT',
  PAY_ORDER: 'PAY_ORDER',
  WITHDRAW_ORDER: 'WITHDRAW_ORDER',
  WITHDRAW_DEPOSIT: 'WITHDRAW_DEPOSIT'
}

export const ACTION_TEXT = {
}

export const SURPLUS_OPTIONS = [
  { value: 1, label: '大于0' },
  { value: 0, label: '等于0' }
]

export const TYPE = {
  INSERT: '录入',
  UPDATE: '修改',
  PAY_DEPOSIT: '入账', // 支付押金
  PAY_ORDER: '收款处理' // 支付订单
}

export const RECE_TYPE = [
  {
    value: 'BANK_PAY',
    label: '银行汇款'
  },
  {
    value: 'CASH_PAY',
    label: '现金'
  },
  {
    value: 'POS_PAY',
    label: 'POS'
  },
  {
    value: 'WX_PAY',
    label: '微信'
  },
  {
    value: 'ALI_PAY',
    label: '支付宝'
  }
]
