<template>
  <div class="actualRecord">
    <div class="actualRecordTitle">
      <span>项目名称: {{ invoiceInfo.projectName }}</span>
      <span class="client">客户名称: {{ invoiceInfo.customerName }}</span>
    </div>
    <TablePager
      border
      :data="actualRecordData"
      :default-sort="{prop: 'createDate', order: 'descending'}"
      :sort-method="(a, b) => {
        return new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
      }"
      :is-pagination="false"
    >
      <el-table-column
        v-for="item in tableHeader"
        :key="item.key"
        align="left"
        show-overflow-tooltip
        :prop="item.key"
        :label="item.label"
        :width="item.width"
        :formatter="item.formatter"
        :sortable="item.sortable"
      />
      <el-table-column label="来源台账/押金">
        <template slot-scope="scope">
          <el-button type="text" @click="gotoOrder(scope.row)">
            {{ TYPE_TEXT[scope.row.payerType] + (scope.row.payerNo || '') }}
          </el-button>
        </template>
      </el-table-column>
    </TablePager>
    <!-- 台账弹框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="70%"
    >
      <template v-if="type === TYPE.STANDING_BOOK">
        <AccountDetail v-if="dialogVisible" :account-id="id" />
      </template>
      <template v-if="type === TYPE.DEPOSIT">
        <DepositDetail v-if="dialogVisible" :deposit-id="id" />
      </template>
    </el-dialog>

  </div>

</template>
<script>
import AccountDetail from '@/views/accountMangement/components/AccountDetail'
import DepositDetail from '@/views/depositMsg/components/DepositDetail'
import TablePager from '@/components/base/TablePager'

const TYPE = {
  STANDING_BOOK: 'STANDING_BOOK',
  DEPOSIT: 'DEPOSIT'
}

const TYPE_TEXT = {
  STANDING_BOOK: '台账',
  DEPOSIT: '押金'
}

export default {
  components: {
    AccountDetail,
    DepositDetail,
    TablePager
  },
  props: {
    invoiceInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    actualRecordData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      TYPE,
      TYPE_TEXT,
      type: '',
      id: null,
      projectidlist: {},
      dialogVisible: false,
      tableHeader: [
        { key: 'createDate', label: '操作时间', sortable: true },
        { key: 'payeeNo', label: '订单编号' },
        { key: 'subPayeeNo', label: '应收款编号', sortable: true },
        { key: 'title', label: '款项名称' },
        { key: 'amount', label: '实收款金额', width: 100 },
        { key: 'operatorName', label: '操作人', width: 100 }
      ]
    }
  },
  methods: {
    gotoOrder(row) {
      this.dialogVisible = true
      this.type = row.payerType
      this.id = row.payerId
      // console.log(this.type)
      // console.log(333333333)
    }
    // orderDetails(row) {
    //   // console.log(row)
    //   this.$router.push({
    //     name: 'saleDetails',
    //     params: { id: 66 },
    //     query: { entrance: this.invoiceInfo.dataSource === 1 ? 'siteMarket' : 'shop' }
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.actualRecord{
  .actualRecordTitle{
    // color: #c5c5c5;
    display: flex;
    flex-direction:column;
    font-size: 14px;
    // flex-wrap: wrap;
    .client{
      margin: 12px 0;
    }
  }
}

</style>
