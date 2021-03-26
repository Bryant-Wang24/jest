export const State = {
  data() {
    return {
      checkArr: [
        { label: 'REVIEW', value: '审核中' },
        { label: 'PASSED', value: '已通过' },
        { label: 'REJECTED', value: '已拒绝' },
        { label: 'CANCEL', value: '已作废' },
        { label: 'CANCELED', value: '已取消' }
      ]
    }
  },
  filters: {
    formatName: function(name) {
      const invoiceObj = {
        'VAT_INVOICE': '增值税专用发票',
        'ORDINARY': '普通发票'
      }
      return invoiceObj[name]
    },
    formatCheckState: function(state) {
      const checkObj = {
        'REVIEW': '审核中',
        'PASSED': '已通过',
        'REJECTED': '已拒绝',
        'CANCEL': '已作废',
        'CANCELED': '已取消'
      }
      return checkObj[state]
    },
    formatInvoiceState: function(state) {
      const invoiceObj = {
        'UNBILLED': '未开票',
        'INVOICED': '已开票'
      }
      return invoiceObj[state]
    }
  }
}

export const BaseReq = {
  data() {
    return {
      projectOptions: [],
      customerOptions: []
    }
  },
  created() {
    // 获取项目名称列表
    this.projectOptions = JSON.parse(sessionStorage.getItem('projectOptions'))
    console.log('projectoptions', this.projectOptions)
    // // 获取客户列表
    this.customerOptions = JSON.parse(sessionStorage.getItem('customerOptions'))
  }
}
