import api from '@/api/index'
export default {
  data() {
    return {
      officeTreeData: [],
      officeTreeDialogVisible: false
    }
  },
  methods: {
    getOfficeTreeData() {
      api.systemManagement.officeTreeData().then(res => {
        this.officeTreeData = res
      })
    },
    getCurrentNode(row) {
      const { name, id } = row
      this.ruleForm.office = { name, id }
      this.toggleOfficeTreeDialog(false)
    },
    toggleOfficeTreeDialog(isOpen) {
      this.officeTreeDialogVisible = !!isOpen
    }
  }
}
