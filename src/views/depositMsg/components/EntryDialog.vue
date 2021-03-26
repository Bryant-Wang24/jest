<template>
  <div class="EntryDialog">
    <!-- 押金信息部分 -->
    <span class="title">所属项目：{{ lookOverInfo.projectName }}</span>
    <TablePager
      ref="TablePager"
      :data="[lookOverInfo]"
      :is-pagination="false"
      border
    >
      <el-table-column
        v-for="item in tableHeader"
        :key="item.key"
        show-overflow-tooltip
        :resizable="false"
        :prop="item.key"
        :label="item.text"
        :formatter="item.formatter"
        :width="item.width"
        :align="item.align || 'left'"
      />
    </TablePager>
    <!-- 入账操作部分 -->
    <RowText text="入账" />
    <div class="info_list_div" style="margin-top: 20px">
      <TablePager
        ref="entryTable"
        :data="entryTableData"
        :is-pagination="false"
        border
      >
        <el-table-column
          v-for="item in entryTableHeader"
          :key="item.key"
          show-overflow-tooltip
          :resizable="false"
          :prop="item.key"
          :label="item.text"
          :formatter="item.formatter"
          :width="item.width"
          :align="item.align || 'left'"
        />
        <el-table-column
          :resizable="false"
          label="本次入账金额"
          width="120"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.thisTimeAmount" placeholder="请输入" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" />
          </template>
        </el-table-column>
      </TablePager>
    </div>
    <div class="totalEntryAmount">入账总额：<span>￥{{ totalEntryAmount }}</span></div>
  </div>
</template>

<script>
import NP from 'number-precision'
import TablePager from '@/components/base/TablePager'
import RowText from '@/components/rowText'
import { TYPE } from '@/common/deposit'
export default {
  components: { TablePager, RowText },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    lookOverInfo: {
      type: Object,
      default: () => {}
    },
    entryTableData: {
      type: Array,
      default: () => []
    }

  },
  data() {
    return {
      tableHeader: [
        {
          key: 'code',
          text: '押金编号',
          width: 120
        },
        {
          key: 'customerName',
          text: '客户名称',
          width: 180
        },
        {
          key: 'depositType',
          text: '押金类别',
          width: 120,
          formatter: (row) => {
            return TYPE[row.depositType] || ''
          }
        },
        {
          key: 'accountNameAs',
          text: '收款账户'
        },
        {
          key: 'totalAmount',
          text: '应收金额',
          align: 'right',
          formatter: (row) => {
            return `￥${row.totalAmount}` || ''
          }
        },
        {
          key: 'receiveAmount',
          text: '已收金额',
          align: 'right',
          formatter: (row) => {
            return `￥${row.receiveAmount}` || ''
          }
        },
        {
          // key: '',
          text: '剩余应收',
          align: 'right',
          formatter: (row) => {
            return `￥${NP.minus(row.totalAmount, row.receiveAmount)}`
          }
        },
        {
          key: 'remark',
          text: '备注',
          width: 120
        }
      ],
      entryTableHeader: [
        {
          key: 'code',
          text: '台账编号',
          width: 120
        },
        {
          key: 'customerName',
          text: '客户名称',
          width: 180
        },
        {
          key: 'shortAccountName',
          text: '收款账户'
        },
        {
          key: 'totalAmount',
          text: '收款总额',
          align: 'right',
          formatter: (row) => {
            return `￥${row.totalAmount}`
          }
        },
        {
          key: 'availableAmount',
          text: '可用余额',
          align: 'right',
          formatter: (row) => {
            return `￥${row.availableAmount}`
          }
        },
        {
          key: 'receiveTime',
          text: '到账日期',
          width: 100
        },
        {
          key: 'remark',
          text: '备注',
          width: 120
        }
      ]
    }
  },
  computed: {
    totalEntryAmount() {
      let sum = 0
      for (let i = 0; i < this.entryTableData.length; i++) {
        if (this.entryTableData[i].thisTimeAmount > 0) {
          sum = NP.plus(sum, Number(this.entryTableData[i].thisTimeAmount))
        }
      }
      return sum
    }
  }
}
</script>

<style lang="scss" scoped>
.EntryDialog {
  .title{
    color: #000000;
    font-size: 14px;
  }
  .totalEntryAmount{
    text-align: right;
    margin-top: 20px;
    font-size: 14px;
    color: #000000;
    line-height: 30px;
    padding-right: 20px;
    span{
      font-size: 18px;
      line-height: 30px;
    }
  }
}
</style>
