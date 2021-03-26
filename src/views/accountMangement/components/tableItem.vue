<template>
  <div class="tableItem" style="min-width: 1500px">
    <el-table
      v-if="index === 0"
      :data="tableData.list"
      :header-cell-style="{
        background: '#FAFAFA',
        color: '#000000',
        width: '100%'
      }"
      :cell-style="{ color: '#000000' }"
    >
      <template slot="empty">
        <div />
      </template>
      <el-table-column align="center" fixed prop="accountId" label="应收款编号" width="120" />
      <el-table-column align="center" prop="name" label="款项名称" width="340" />
      <el-table-column align="center" prop="province" label="应收金额" width="140" />
      <el-table-column align="center" prop="city" label="已收金额" width="140" />
      <el-table-column align="center" label="剩余应收" width="140" />
      <el-table-column align="center" prop="payDate" label="应收日期" width="160" />
      <el-table-column align="center" prop="payState" label="收款状态" width="80" />
      <el-table-column align="center" prop="remark" label="款项备注" />
      <el-table-column align="center" label="本次收款金额(元)" width="160" />
      <el-table-column align="center" prop="address" label="操作" width="100" />
    </el-table>
    <div v-else>
      <el-row v-if="lastTable.length !== 0" class="title">

        <el-col :lg="12" :sm="24" :xs="24" class="customer">
          <span class="row-item">
            <span class="label">客户：</span>
            <span class="content">
              {{ tableData.customerName }}
              (客户编号：{{ tableData.customerNo }})
            </span>
          </span>
          <span class="row-item">
            <span class="label">订单总额：</span>
            <span class="content">￥{{ tableData.amount }}</span>
          </span>
          <el-tooltip class="item" effect="dark" :content="accountAmounts.join('')" placement="top">
            <i class="el-icon-info tip-icon" />
          </el-tooltip>
        </el-col>

        <el-col :lg="12" :sm="24" :xs="24" class="orderCode">
          <span class="row-item">
            <span class="label">订单编号：</span>
            <span class="content blue pointer" @click="jump">{{ tableData.orderNo }}</span>
          </span>
          <span class="row-item">
            <span class="label">订单创建人：</span>
            <span class="content">{{ tableData.createBy.name }}（{{ tableData.createBy.office ? tableData.createBy.office.name : '无' }}）</span>
          </span>
          <span class="row-item">
            <span class="label">创建时间：</span>
            <span class="content">{{ tableData.createDate }}</span>
          </span>
        </el-col>

      </el-row>

      <el-table
        v-if="lastTable.length !== 0"
        :data="lastTable"
        :show-header="false"
        border
        :header-cell-style="{
          background: '#FAFAFA',
          color: '#000000',
          width: '100%'
        }"
        :cell-style="{ color: '#000000' }"
      >
        <el-table-column prop="payIdNum" label="应收款编号" width="120" />
        <el-table-column prop="name" show-overflow-tooltip label="款项名称" width="340" />
        <el-table-column prop="amount" label="应收金额" align="right" width="140">
          <template slot-scope="scope">
            <div>￥{{ scope.row.amount }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="paidAmount" label="已收金额" align="right" width="140">
          <template slot-scope="scope">
            <div>￥{{ scope.row.paidAmount }}</div>
          </template>
        </el-table-column>
        <el-table-column label="剩余应收" align="right" width="140">
          <template slot-scope="scope">￥{{
            scope.row.receivableBalance
          }}</template>
        </el-table-column>
        <el-table-column label="应收日期" :formatter="formatter" width="160" align="center" />
        <el-table-column prop="payState" label="收款状态" align="center" width="80">
          <template slot-scope="scope">
            {{ scope.row.payState | formatPayState }}
          </template>
        </el-table-column>
        <el-table-column prop="remarks" show-overflow-tooltip label="款项备注" align="center">
          <!-- <template slot-scope="scope">
            <el-tooltip class="remarks" effect="dark" :content="scope.row.remarks" placement="top">
              <div>{{ scope.row.remarks }}</div>
            </el-tooltip>
          </template> -->
        </el-table-column>
        <el-table-column prop="paramsAmount" label="本次收款金额" width="160">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.num"
              :disabled="scope.row.amount === scope.row.paidAmount"
              @keyup.native="scope.row.num = limitNumberInput(scope.row.num)"
            />
            <!-- oninput="value=value.replace(/[^0-9.]/g,'')" -->
          </template>
        </el-table-column>
        <el-table-column width="100" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.amount !== scope.row.paidAmount" type="text" @click="getPayments(scope.row)">确认收款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { DEPARTMENT_ZH } from '@/common/user'
import { deepClone } from '@/utils'
import moment from 'moment'
import { limitNumberInput } from '@/utils/common'
import { isZero } from '@/utils/validate'
export default {
  filters: {
    formatPayState(state) {
      const payObj = {
        UNPAID: '未付款',
        PARTIAL_PAID: '部分付款',
        PAID: '已付款'
      }
      return payObj[state]
    }
  },
  props: {
    index: {
      type: Number,
      default: 2
    },
    tableData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      DEPARTMENT_ZH,
      lastTable: [],
      accountAmounts: []
      // paramsAmount: '12'
    }
  },
  watch: {
    'tableData': function() {
      this.getTableData()
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    limitNumberInput(v) {
      return limitNumberInput(v, 2)
    },
    jump() {
      this.$router.push({ name: 'saleDetails', params: { id: this.tableData.id }})
    },
    formatter(row) {
      return row.payDate ? moment(row.payDate).format('YYYY-MM-DD') : ''
    },
    getTableData() {
      const { paymentPlanGroups } = this.tableData
      if (this.tableData.accountAmounts) {
        this.accountAmounts = this.tableData.accountAmounts.reduce((acc, cur) => {
          acc.push(`${cur.accountName}:￥${cur.amount}\n`)
          return acc
        }, [])
      }
      if (paymentPlanGroups) {
        const lastTable = paymentPlanGroups.reduce((acc, cur) => {
          if (cur.items) {
            return acc.concat(cur.items)
          }
        }, [])
        // this.lastTable = lastTable.sort((a, b) => {
        //   return a.order - b.order
        // })
        this.lastTable = this.sort(lastTable)
      }
    },
    sort(data) {
      const _data = deepClone(data) || []

      const paidList = _data.filter(t => t.payState === 'PAID')
      const paidListSort = paidList.sort((a, b) => {
        return a.order - b.order
      })
      const unPaidList = _data.filter(t => t.payState !== 'PAID')
      const unPaidListSort = unPaidList.sort((a, b) => {
        return a.order - b.order
      })
      return [...unPaidListSort, ...paidListSort]
    },
    getPayments(item) {
      if (!item.num) {
        this.$message.warning('请填写收款金额')
        return
      } else if (isZero(item.num)) {
        this.$message.warning('填写金额需大于0')
        return
      }
      this.$emit('getPayments', item)
    }
  }
}
</script>

<style lang='scss' scoped>
.tableItem {
  .remarks {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  margin-top: 10px;
  ::v-deep .el-table__empty-block {
    min-height: 0px;
    // border:none;
    border-bottom: transparent;
  }
  .title {
    border: 1px solid #e7eaec;
    border-bottom: none;
    background: #fafafa;
    line-height: 42px;
    font-size: 14px;
    font-weight: 400;
    .customer {
      padding-left: 10px;
      // .row-item {
      //   padding-right: 10px;
      // }
    }
    .orderCode {
      text-align: right;
      padding-right: 10px;
    }
    .row-item {
      padding-right: 10px;
      .label {
        color: #000;
      }
      .content {
        color: #666;
      }
      .blue {
        color: #0045FF;
      }
      .pointer {
        cursor: pointer;
      }
      &:last-child {
        padding-right: 0;
      }
    }
  }

@media only screen and (min-width: 768px) and (max-width: 1200px) {
  .orderCode {
    text-align: left !important;
    padding-left: 10px;
  }
}
  // .title {
  //   padding: 0 5px;
  //   display:flex;
  //   justify-content: space-between;
  //   border: 1px solid #e7eaec;
  //   border-bottom: none;
  //   background: #fafafa;
  //   line-height: 42px;
  //   font-size: 14px;
  //   font-weight: 400;
  //   height: 42px;
  //   .customer {
  //     // padding: 0 15px;
  //     color: #000000;
  //     .row-item {
  //       margin:0 10px;
  //     }
  //     .tip-icon {
  //       color: #999;
  //     }
  //   }
  //   .orderCode {
  //     color: #666666;
  //     margin-right: 5px;
  //     .row-item {
  //       margin: 10px;
  //       &:last-child{
  //         margin-right: 10px;
  //       }
  //     }
  //   }
  // }
}
</style>
