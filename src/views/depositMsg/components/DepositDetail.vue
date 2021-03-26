<template>
  <div>
    <!-- 押金信息部分 -->
    <div class="info_space">
      <RowText :text="'押金信息'" />
      <div class="info_list_div">
        <ul class="info_list">
          <li>押金编号：<span>{{ renderLookOverInfo.code }}</span></li>
          <li>项目名称：<span>{{ renderLookOverInfo.projectName }}</span></li>
          <li>客户名称：<span>{{ renderLookOverInfo.customerName }}</span></li>
          <li>客户编号：<span>{{ renderLookOverInfo.code }}</span></li>
          <li>押金类别：
            <span v-if="renderLookOverInfo.depositType === 'ADVANCE_PAYMENT'">预付款</span>
            <span v-if="renderLookOverInfo.depositType === 'DEPOSIT'">押金</span>
            <span v-if="renderLookOverInfo.depositType === 'CONSTRUCTION_BOND'">施工保证金</span>
            <span v-if="renderLookOverInfo.depositType === 'STORE_DEPOSIT'">商铺押金</span>
          </li>
          <li>收款账户：<span>{{ renderLookOverInfo.accountName }}</span></li>
          <li>应收金额：<span>￥{{ renderLookOverInfo.totalAmount }}</span></li>
          <li>已收金额：<span>￥{{ renderLookOverInfo.receiveAmount }}</span></li>
          <li>入账状态：
            <span v-if="renderLookOverInfo.billingState === 'NO_BILLING'">未入账</span>
            <span v-if="renderLookOverInfo.billingState === 'HAS_BILLING'">已入账</span>
            <span v-if="renderLookOverInfo.billingState === 'SOME_BILLING'">部分入账</span>
          </li>
          <li>创建人：<span>{{ renderLookOverInfo.createBy ? renderLookOverInfo.createBy.name : '' }}</span></li>
          <li>创建时间：<span>{{ renderLookOverInfo.createDate }}</span></li>
          <li>备注：<span>{{ renderLookOverInfo.remark }}</span></li>
        </ul>
      </div>
    </div>
    <!-- 押金使用记录部分 -->
    <div class="info_space" style="margin-top: 20px">
      <RowText :text="'押金使用记录'" />
      <DepositUseRecord :record-table-data="renderOwnRecordTableData" style="margin-top:20px" />
    </div>
    <!-- 入账记录 -->
    <EntryRecord :table-data="renderOwnEntryRecords" :show-button="showButton" @recall="recall" />
    <!-- 操作日志部分 -->
    <div class="info_space" style="margin-top: 20px">
      <RowText :text="'操作日志'" />
      <div class="info_list_div" style="margin-top: 20px">
        <div class="info_list_div_time">
          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="(item, index) in renderOwnActivities"
              :key="index"
              placement="top"
            >
              <div v-if="item.action === ACTION.INSERT" class="operation_div">
                <div class="operation_desc_time">
                  {{ item.createDate }}
                </div>
                <span class="operation_peo">{{ item.createBy ? item.createBy.name : '' }}创建了押金单</span>
                <div class="operation_desc">应收金额：￥{{ item.amount }}</div>
                <div class="operation_desc">备注：{{ item.remark }}</div>
              </div>
              <div v-if="item.action === ACTION.BILLING_DEPOSIT" class="operation_div">
                <div class="operation_desc_time">{{ item.createDate }}</div>
                <span class="operation_peo">{{ item.createBy ? item.createBy.name : '' }}对押金{{ item.receiverNo }}进行了入账</span>
                <div class="operation_desc">入账金额：￥{{ item.amount }}</div>
              </div>
              <div v-if="item.action === ACTION.PAY_ORDER" class="operation_div">
                <div class="operation_desc_time">{{ item.createDate }}</div>
                <span class="operation_peo">{{ item.createBy ? item.createBy.name : '' }}对订单{{ item.receiverNo }}进行了收款处理</span>
                <div class="operation_desc">款项名称：{{ item.title }}</div>
                <div class="operation_desc">收款金额：￥{{ item.amount }}</div>
              </div>
              <div v-if="item.action === ACTION.TURN_DEPOSIT" class="operation_div">
                <div class="operation_desc_time">
                  {{ item.createDate }}
                </div>
                <span v-if="item.createBy" class="operation_peo">{{ item.createBy.name }}对押金进行了转款</span>
                <span v-else class="operation_peo">对押金进行了转款</span>
                <div class="operation_desc">
                  项目名称：{{ item.projectName }}
                </div>
                <div class="operation_desc">
                  转款金额：￥{{ item.amount }}
                </div>
                <div class="operation_desc">
                  备注：{{ item.remark }}
                </div>
              </div>
              <div v-if="item.action === ACTION.INSERT_BY_TURN" class="operation_div">
                <div class="operation_desc_time">{{ item.createDate }}</div>
                <span class="operation_peo">{{ item.createBy ? item.createBy.name : '' }}创建了押金单（从押金{{ item.receiverNo }}转款）</span>
                <div class="operation_desc">应收金额：￥{{ item.amount }}</div>
                <div class="operation_desc">备注：{{ item.remark }}</div>
              </div>
              <div v-if="item.action === ACTION.WITHDRAW_DEPOSIT" class="operation_div">
                <div class="operation_desc_time">{{ item.createDate }}</div>
                <span class="operation_peo">{{ item.createBy ? item.createBy.name : '' }} 对入账进行了撤回</span>
                <div class="operation_desc">台账编号：{{ item.receiverNo }}</div>
                <div class="operation_desc">撤回金额：￥{{ item.amount }}</div>
              </div>
              <div v-if="item.action === ACTION.WITHDRAW_ORDER" class="operation_div">
                <div class="operation_desc_time">{{ item.createDate }}</div>
                <span class="operation_peo">{{ item.createBy ? item.createBy.name : '' }} 对订单进行了撤回</span>
                <div class="operation_desc">应收金额：￥{{ item.amount }}</div>
                <div class="operation_desc">备注：{{ item.remark }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DepositUseRecord from './DepositUseRecord'
import EntryRecord from './EntryRecord'
import RowText from '@/components/rowText'
import { ACTION } from '@/common/deposit'
export default {
  components: {
    DepositUseRecord,
    EntryRecord,
    RowText
  },
  props: {
    depositId: {
      type: [Number, String],
      default: () => null
    },
    lookOverInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    recordTableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    entryRecords: {
      type: Array,
      default: () => {
        return []
      }
    },
    reverse: {
      type: Boolean,
      default: () => true
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
      ACTION,
      ownLookOverInfo: {},
      ownRecordTableData: [],
      ownEntryRecords: [],
      ownActivities: []
    }
  },
  computed: {
    showButton() {
      return !this.depositId
    },
    renderLookOverInfo() {
      return this.depositId ? this.ownLookOverInfo : this.lookOverInfo
    },
    renderOwnRecordTableData() {
      return this.depositId ? this.ownRecordTableData : this.recordTableData
    },
    renderOwnEntryRecords() {
      return this.depositId ? this.ownEntryRecords : this.entryRecords
    },
    renderOwnActivities() {
      return this.depositId ? this.ownActivities : this.activities
    }
  },
  watch: {
    depositId: {
      handler(depositId) {
        if (!depositId) return
        this.init(depositId)
      },
      immediate: true
    }
  },
  methods: {
    recall(paymentId) {
      this.$emit('recall', paymentId)
    },
    init(depositId) {
      this.getDepositRecord(depositId)
      this.getDepositEntryRecord(depositId)
    },
    getDepositRecord(depositId) {
      this.$api.depositMsg.getDepositRecord(depositId).then(res => {
        const depositOperations = res.depositOperations
        // 这里《使用记录》先拼接《操作记录》里面的转款，后面再拼接《收款记录》的数据
        this.ownRecordTableData = []
        for (let i = 0; i < depositOperations.length; i++) {
          const row = depositOperations[i]
          if (row.action === ACTION.TURN_DEPOSIT) {
            this.ownRecordTableData.push({ ...row, payeeNo: row.receiverNo, operatorName: row.createBy.name })
          }
        }
        // 押金信息 弹窗用
        this.ownLookOverInfo = res.deposit
        // 操作日志
        this.ownActivities = depositOperations
        // 押金信息
        this.$api.depositMsg.getDepostitPayment(depositId).then(res => {
          this.ownRecordTableData = [...this.ownRecordTableData, ...res] || []
        })
      })
    },
    getDepositEntryRecord(depositId) {
      // 入账记录
      this.$api.depositMsg.getDepositEntryRecord(depositId).then(res => {
        this.ownEntryRecords = res || []
      })
    }
  }

}
</script>

<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
.info_space{
  overflow: hidden;
  .title_div{
    position: relative;
    background: #FAFAFA;
    height: 40px;
    margin-bottom: 20px;
    span{
        padding-left: 10px;
        line-height: 40px;
    }
    .title_line{
        position: absolute;
        left: 0;
        top: 12px;
        width: 4px;
        height: 16px;
        background: $--custom--color--primary;
    }
  }
  .info_list_div{
    .info_list{
      li{
        list-style: none;
        float: left;
        width: 50%;
        font-size: 14px;
        line-height: 24px;
        color: #666666;
        span{
          color: #000000;
        }
      }
    }
    .el-form-item{
      width: 100%;
    }
  }
  .info_list_div{
    .info_list_div_time{
      padding-left: 130px;
      box-sizing: border-box;
      ::v-deep .el-timeline-item__wrapper{
        .operation_div{
          margin-top: -13px;
          position: relative;
          .operation_peo{
            line-height: 20px;
            margin-top: 4px;
            color: #000000;
          }
          .operation_desc{
            line-height: 20px;
            margin-top: 4px;
            color: #999999;
          }
          .operation_desc_time{
            line-height: 20px;
            margin-top: 4px;
            color: #000000;
            position: absolute;
            top: -4px;
            left: -175px;
          }
        }
      }
    }
  }
}
</style>
