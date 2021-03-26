<template>
  <div class="info">
    <div v-if="editData.handoverSlip.state !== 'PASSED'" class="errorInfo">
      <span>审核未通过</span>
      <!-- <span>审核意见：{{ editData.handoverSlip ? editData.handoverSlip.approvalIdea : '' }}</span> -->
      <span>审核意见：{{ text }}</span>
    </div>
    <AddHandoverSlip ref="form" :edit-data="editData" :is-edit="true" />
  </div>
</template>

<script>
import AddHandoverSlip from '../addHandoverSlip'
export default {
  components: { AddHandoverSlip },
  props: {
    editData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    text() {
      const { operationList } = this.editData
      const list = operationList?.filter(t => t.action === 'EXAMINE') || []
      // debugger
      return list?.[list.length - 1 ]?.auditOpinion || ''
    }
  },
  mounted() {
  },
  methods: {
    getFromData() {
      return this.$refs.form.validate()
    }
  }
}
</script>
<style lang="scss" scoped>
.errorInfo{
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-left: 2px solid #f53939;
  background-color: #fddbdb;
  color: #000;
  span {
    line-height: 24px;
  }
}
</style>
