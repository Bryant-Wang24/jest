<template>
  <div class="catAccount">
    <div class="accountInfo">
      <RowText class="rowText" text="台账信息" style="margin-top:0;" />
      <div class="accountBase">
        <div class="name">
          台账编号：<span>{{ renderOwnFormData.code }}</span>
        </div>
        <div class="name">
          客户名称：<span>{{ renderOwnFormData.customerName }}</span>
        </div>
        <div class="name">
          收款账户：<span>{{ renderOwnFormData.shortAccountName }}</span>
        </div>
        <div class="name">
          收款总额：<span>{{ renderOwnFormData.totalAmount }}</span>
        </div>
        <div class="name">
          到账日期：<span>{{ renderOwnFormData.receiveTime }}</span>
        </div>
        <div class="name">
          录入人：<span>{{ renderOwnFormData.createBy ? renderOwnFormData.createBy.name : '' }}</span>
        </div>
        <div class="name">
          录入时间：<span>{{ renderOwnFormData.createDate }}</span>
        </div>
        <div class="name">
          备注：<span>{{ renderOwnFormData.remark }}</span>
        </div>
      </div>
    </div>
    <div class="opreateRecords">
      <RowText class="rowText" text="台账使用记录" />
      <el-table
        :data="renderOwnRecordData"
        border
        :header-cell-style="{
          background: '#FAFAFA',
          color: '#000000',
          width: '100%'
        }"
      >
        <el-table-column prop="createDate" label="操作时间" width="160" />
        <el-table-column prop="payeeType" label="用途" :width="100">
          <template slot-scope="scope">
            <!-- {{ scope.row.payeeType === "PAY_ORDER"?'订单收款':'押金入账' }} -->
            {{ PAYEE_TYPE[scope.row.payeeType] || '' }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right" />
        <el-table-column prop="payeeNo" label="订单编号/押金编号" show-overflow-tooltip width="180" />
        <el-table-column prop="projectName" label="所属项目" show-overflow-tooltip width="200" />
        <el-table-column
          label="操作人"
          prop="operatorName"
          :width="120"
        />
      </el-table>
    </div>
    <div class="operateLog">
      <RowText class="rowText" text="操作日志" />
      <Timeline :list="renderOwnActivities">
        <template v-slot="{row}">
          <div class="content">
            <template v-if="row.action === ACTION.INSERT">
              <span class="title">{{ row.createBy ? row.createBy.name : '' }} 录入了台账</span>
              <span class="text">收款金额：￥{{ row.amount }}</span>
              <span class="text">备注：{{ row.remark }}</span>
            </template>
            <template v-if="row.action === ACTION.UPDATE">
              <span class="title">{{ row.createBy ? row.createBy.name : '' }} 对台账进行了修改</span>
              <span class="text">收款金额：￥{{ row.amount }}</span>
              <span class="text">备注：{{ row.remark }}</span>
            </template>
            <template v-if="row.action === ACTION.PAY_DEPOSIT">
              <span class="title">{{ row.createBy ? row.createBy.name : '' }} 对押金{{ row.receiverNo }}进行了入账</span>
              <span class="text">入账金额：{{ row.amount }}</span>
            </template>
            <template v-if="row.action === ACTION.PAY_ORDER">
              <span class="title">{{ row.createBy ? row.createBy.name : '' }} 对订单{{ row.receiverNo }}进行了收款处理</span>
              <span class="text">款项名称：{{ row.title }}</span>
              <span class="text">收款金额：￥{{ row.amount }}</span>
            </template>
            <template v-if="row.action === ACTION.WITHDRAW_ORDER">
              <span class="title">{{ row.createBy ? row.createBy.name : '' }} 对订单收款进行撤回</span>
              <span class="text">订单编号：{{ row.receiverNo }}</span>
              <span class="text">撤回金额：￥{{ row.amount }}</span>
            </template>
            <template v-if="row.action === ACTION.WITHDRAW_DEPOSIT">
              <span class="title">{{ row.createBy ? row.createBy.name : '' }} 对已入账的押金的金额进行撤回</span>
              <span class="text">押金编号：{{ row.receiverNo }}</span>
              <span class="text">撤回金额：￥{{ row.amount }}</span>
            </template>
          </div>
        </template>
      </Timeline>
    </div>
  </div>
</template>

<script>
import RowText from '@/components/rowText'
import Timeline from '@/components/timeline'
import { ACTION } from '@/common/account'
import { deepClone } from '@/utils'
const PAYEE_TYPE = { // 收款方式
  ORDER_PAYMENT_PLAN_ITEM: '订单收款', // 订单付款计划项
  DEPOSIT: '押金入账 ' // 押金
}

export default {
  components: {
    RowText,
    Timeline
  },
  props: {
    accountId: { // 有accountId传入则手动获取数据
      type: Number,
      default: () => {
        return null
      }
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    recordData: {
      type: Array,
      default: () => {
        return []
      }
    },
    activities: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      PAYEE_TYPE,
      ACTION,
      ownFormData: {},
      ownRecordData: [],
      ownActivities: []
    }
  },
  computed: {
    renderOwnFormData() {
      return this.accountId ? this.ownFormData : this.formData
    },
    renderOwnRecordData() {
      return this.accountId ? this.ownRecordData : this.recordData
    },
    renderOwnActivities() {
      return this.accountId ? this.ownActivities : this.activities
    }
  },
  watch: {
    accountId: {
      handler(accountId) {
        if (!accountId) return
        this.init(accountId)
      },
      immediate: true
    }
  },
  methods: {
    init(accountId) {
      this.getAccountInfo(accountId)
      this.getUsageRecord(accountId)
      this.getOperatinLog(accountId)
    },
    getAccountInfo(accountId) {
      this.$api.account.findAccountById(accountId).then(res => {
        this.ownFormData = res
      })
    },
    getUsageRecord(accountId) {
      this.$api.account.getPaymentLog(accountId).then(res => {
        this.ownRecordData = res
      })
    },
    getOperatinLog(accountId) {
      this.$api.account.getOperationLog(accountId).then(res => {
        this.ownActivities = deepClone(res).map(item => {
          item.timestamp = item.createDate
          return item
        }).reverse()
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.catAccount {
  .accountInfo {
    .title {
      font-size: 16px;
      margin-bottom: 30px;
      color: #000;
      padding-left: 10px;
      border-left: 4px solid black;
    }
    .accountBase {
      display: flex;
      flex-wrap: wrap;
      .name {
        margin-left: 10px;
        margin-top: 10px;
        width: 48%;
        font-size: 14px;
        color: #666;
        span {
          color: #000;
        }
      }
    }
  }
  .opreateRecords{
      .title {
      font-size: 16px;
      margin: 30px 0px;
      color: #000;
      padding-left: 10px;
      border-left: 4px solid black;
    }
  }
  .operateLog {
    .content {
      display: flex;
      flex-direction: column;
      .title {
        margin-bottom: 10px;
      }
      .text {
        color: #666;
        line-height: 24px;
      }
    }
    // .logTitle {
    //   font-size: 16px;
    //   margin: 30px 0px;
    //   color: #000;
    //   padding-left: 10px;
    //   border-left: 4px solid black;
    // }
  }
  .log{
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 20px;
    color: #666666;
    opacity: 1;
    .title{
      color:#000000;
      margin-bottom:10px;
    }
  }
  .rowText {
    margin: 20px 0;
  }
}
</style>
