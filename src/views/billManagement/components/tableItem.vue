<template>
  <div class="tableItem">
    <TablePager
      v-if="isInvoice"
      border
      :data="tableData"
      :is-pagination="false"
    >
      <el-table-column
        v-for="item in invoiceTableHeader"
        :key="item.key"
        show-overflow-tooltip
        :prop="item.key"
        :label="item.label"
        :width="item.width"
        :formatter="item.formatter"
      >
        <template slot-scope="scope">
          <el-link v-if="item.slot" :underline="false" @click="gotoOrder(item.arg, scope.row)">{{ item.formatter ? item.formatter(scope.row) : scope.row[item.key] }}</el-link>
          <span v-else>{{ scope.row[item.key] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="说明">
        <template slot-scope="scope">
          <span v-if="Object.keys(scope.row.accountGroupAmountMap).length>=2">
            其中
            <span v-for="(value, key) in scope.row.accountGroupAmountMap" :key="key">
              {{ `${key}: ${value || 0}元` }}
            </span>
          </span>
        </template>
      </el-table-column>
    </TablePager>

    <TablePager
      v-else
      ref="multipleTable"
      border
      row-key="id"
      :data="tableData"
      :is-pagination="false"
      @cell-click="showMessage"
      @selection-change="handleSelectionChange"
    >
      <div slot="empty">请先选择项目名称、客户</div>
      <el-table-column v-if="isReceiptCat" type="selection" :selectable="selectable" :reserve-selection="true" width="55" />
      <el-table-column
        v-for="item in receiptTableHeader"
        :key="item.key"
        show-overflow-tooltip
        :resizable="false"
        :prop="item.key"
        :label="item.label"
        :formatter="item.formatter"
        :width="item.width"
        :align="item.align || 'left'"
      />
    </TablePager>
  </div>
</template>
<script>
import base from '@/api/base'
import TablePager from '@/components/base/TablePager.vue'
import { TYPE } from '@/common/deposit'

export default {
  components: {
    TablePager
  },
  props: {
    invoiceInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    isInvoice: {
      type: Boolean,
      defautl() {
        return false
      }
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    isReceiptCat: {
      type: Boolean,
      default() {
        return true
      }
    },
    multipleSelection: {
      type: Array,
      default() {
        return []
      }
    },
    filesInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      TYPE,
      base,
      getRowKeys: '',
      invoiceTableHeader: [
        { key: 'idNum', label: '合同/服务单编号', width: 200, slot: false },
        { key: 'contractTemplateName', label: '合同/服务单名称', slot: true, arg: 1,
          formatter: (row) => {
            return this.contractInfo(row)
          }
        },
        { key: 'contractReturnFile', label: '回传合同文件', slot: true, arg: 2,
          formatter: (row) => {
            return this.returnFileInfo(row)
          }
        },
        { key: 'orderNo', label: '关联订单编号', width: 180, slot: true, arg: 0 },
        { key: 'amount', label: '合同金额', width: 120, slot: false }
      ],
      receiptTableHeader: [
        { key: 'code', label: '押金编号' },
        { key: 'depositType', label: '押金类别',
          formatter: (row) => {
            return TYPE[row.depositType]
          }
        },
        { key: 'accountNameAs', label: '收款账户' },
        { key: 'totalAmount', label: '押金总额' },
        { key: 'usedAmount', label: '已用押金' },
        { key: 'availableAmount', label: '可开收据' },
        { key: 'remark', label: '备注' }
      ]
    }
  },
  watch: {
    tableData: function() {
      // this.$refs.multipleTable.clearSelection()
      this.setSelect()
      // this.handleSelectionChange(this.multipleSelection)
      // debugger
      // this.handleSelectionChange()
    }
  },
  mounted() {
  },
  methods: {
    contractInfo(row) {
      const { contractTemplateName, amount, orderNo } = row
      const { projectAbbreviation, projectName } = this.filesInfo
      const left = projectAbbreviation || projectName
      if (orderNo && contractTemplateName && amount !== undefined) {
        return `${left}(${contractTemplateName})_${amount}元`
      }
      return ''
    },
    returnFileInfo(row) {
      const { contractReturnFile = '' } = row
      if (!contractReturnFile) return ''
      const { contractTemplateName, amount } = row
      const { projectAbbreviation, projectName } = this.filesInfo
      const left = projectAbbreviation || projectName
      let fileType = ''
      const fileNameArray = contractReturnFile.split('.')
      if (fileNameArray.length > 0) {
        fileType = fileNameArray[fileNameArray.length - 1]
      }
      if (contractTemplateName && amount !== undefined) {
        return `${left}(${contractTemplateName})_${amount}元.${fileType}`
      }
      return ''
    },
    handleSelectionChange(val) {
      // this.multipleSelection = val
      this.$emit('handleSelect', val)
    },
    rowKey(row) {
      return row.id
    },
    setSelect() {
      const mulLength = this.multipleSelection.length
      if (mulLength > 0) {
        // console.log(this.multipleSelection)
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.$refs.multipleTable.toggleRowSelection(this.multipleSelection[i], true)
        }
      } else {
        this.$refs.multipleTable?.clearSelection()
      }
    },
    // 是否可选
    selectable(row, index) {
      const { availableAmount } = row
      return !(availableAmount === 0)
    },
    //
    showMessage(row, column, cell, event) {
      console.log(row, column, cell, event)
      const { availableAmount } = row
      if (availableAmount === 0) this.$message.warning('该押金已退款，无法选中')
    },
    gotoOrder(index, row) {
      const { orderId, contractId, contractReturnFile } = row
      // 2
      if (index === 2) {
        window.open(contractReturnFile)
        return
      }
      // 1
      const routeArr = [
        {
          name: 'saleDetails',
          params: { id: orderId },
          query: { entrance: this.invoiceInfo.dataSource === 1 ? 'siteMarket' : 'shop' }
        },
        {
          name: 'contractEdit',
          params: { id: contractId }
        }
      ]
      this.$router.push(routeArr[index])
    }
  }
}
</script>

<style>
.el-link--inner{
  color: #035751;
}
</style>
