<template>
  <div class="CollectionRecord">
    <!-- 模拟 -->
    <!-- <el-button @click="recall({id: 1, invoices: [1,2,3]})">2</el-button> -->
    <el-table
      :data="tableData"
      border
      :header-cell-style="{
        background: '#FAFAFA',
        color: '#000000',
        width: '100%'
      }"
      :cell-style="{color:'#000000'}"
    >
      <el-table-column prop="createDate" label="操作时间" width="200" :resizable="false" show-overflow-tooltip />
      <el-table-column prop="payeeNo" show-overflow-tooltip label="订单编号" width="200" :resizable="false" />
      <el-table-column prop="subPayeeNo" label="应收款编号" width="160" :resizable="false" show-overflow-tooltip />
      <el-table-column prop="title" label="款项名称" width="240" :resizable="false" show-overflow-tooltip />
      <el-table-column prop="projectName" label="所属项目" width="200" :resizable="false" show-overflow-tooltip />
      <el-table-column prop="amount" label="收款金额" align="right" width="160" :resizable="false" show-overflow-tooltip />
      <el-table-column prop="operatorName" label="操作人" width="160" :resizable="false" show-overflow-tooltip />
      <el-table-column label="操作" :resizable="false" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button v-if="hasRolePermission('DepositList_order')" type="text" @click="recall(scope.row)">撤回</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    projectId: {
      type: [Number, String],
      default: () => {
        return null
      }
    }
  },
  methods: {
    async recall(row) {
      const { payeeId, id } = row
      const orderRes = await this.getOrderDetail(payeeId)
      const projectId = orderRes.projectId
      const customerId = orderRes.customerId
      const params = { projectId, customerId }
      const InvoiceRes = await this.getInvoices(params)
      const invoices = InvoiceRes?.list.map(t => t.checkState !== 'CANCEL')
      let html = ''
      if (invoices.length > 0) {
        html = `<div class="confirm">
          <span class="title">此项目客户已申请发票，确定撤回此次收款吗</span>
          <span class="tip">撤回后金额将从订单重新返回押金中</span>
        </div>`
      } else {
        html = `<div class="confirm">
          <span class="title">确定撤回此次收款吗</span>
          <span class="tip">撤回后金额将从订单重新返回押金中</span>
        </div>`
      }
      this.$confirm(html, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'recall-confirm'
        // type: 'warning'
      }).then(() => {
        this.$emit('recall', id)
      }).catch(() => {
      })
    },
    // 查询订单获取用户id和项目id
    getOrderDetail(params) {
      return this.$api.depositMsg.getOrderDetail(params)
    },
    // 发票列表
    getInvoices(params) {
      return this.$api.billApi.getInvoiceList(params)
    }
  }
}
</script>

<style lang='scss'>
.recall-confirm {
  .confirm {
    padding: 20px 0;
    text-align: center;
    .title {
      display: block;
      font-size: 16px;
    }
    .tip {
      display: block;
      color: #999;
    }
  }
}
</style>
