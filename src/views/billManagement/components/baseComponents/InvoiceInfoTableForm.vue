<template>
  <div class="invoiceInfoTable">
    <!-- <div class="title">开票信息</div> -->
    <template>
      <el-form ref="tableForm" :model="tableForm" inline-message>
        <el-table
          :data="tableForm.invoiceDetails"
          :header-cell-style="{
            color: '#333',
            fontWeight: 'normal',
            fontSize: '14px',
            background: '#FAFAFA'
          }"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form
                label-position="left"
                class="demo-table-expand"
              >
                <el-form-item label="订单创建人:">
                  <span>{{ props.row.orderCreatorName }}</span>
                </el-form-item>
                <el-form-item label="订单创建时间:">
                  <span>{{ props.row.orderCreateTime }}</span>
                </el-form-item>
                <el-form-item label="订单总额:">
                  <span>￥{{ props.row.orderAmount }}</span>
                </el-form-item>
                <el-form-item :label="`应开票总额:`">
                  <span>{{ initAmountDetail(props.row.actualAmountDetail) }}</span>
                </el-form-item>
                <el-form-item :label="`已开票总额:`">
                  <span>{{ initAmountDetail(props.row.invoicedAmountDetail) }}</span>
                </el-form-item>
                <el-form-item :label="`可开票总额:`">
                  <span>{{ initAmountDetail(props.row.availableAmountDetail) }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="orderNo" label="订单编号" width="200" />
          <el-table-column prop="actualAmount" label="实收客户金额(元)" :formatter="(row) => { return `￥${Number(row.actualAmount).toFixed(2)}` }" width="180" class="tooltip" align="right">
            <template slot="header">
              <span class="headerLeft">实收客户金额(元)</span>
              <el-tooltip
                class="item"
                effect="dark"
                content="当前客户的实付款金额"
                placement="top"
              >
                <i class="el-icon-info" />
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="invoicedAmount" label="已开票金额(元)" :formatter="(row) => { return `￥${Number(row.invoicedAmount).toFixed(2)}` }" width="180" align="right" />

          <el-table-column prop="unavailableAmount" label="不可开票金额(元)" :formatter="(row) => { return `￥${Number(row.unavailableAmount).toFixed(2)}` }" width="180" class="tooltip" align="right">
            <template slot="header">
              <span class="headerLeft">不可开票金额(元)</span>
              <el-tooltip
                class="item"
                effect="dark"
                placement="top"
              >
                <div slot="content">
                  此部分金额已开收据，需先回收收据
                </div>
                <i class="el-icon-info" />
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="remainingAmount" width="180" label="剩余应开票金额(元)" :formatter="(row) => { return `￥${Number(row.remainingAmount).toFixed(2)}` }" align="right" />

          <el-table-column prop="invoicableAmount" label="可开票金额(元)" width="180" :formatter="(row) => { return `￥${Number(row.invoicableAmount).toFixed(2)}` }" class="tooltip" align="right">
            <template slot="header">
              <span class="headerLeft">可开票金额(元)</span>
              <el-tooltip
                class="item"
                effect="dark"
                placement="top"
              >
                <div slot="content">
                  按当前所选开票内容匹配<br>
                  此订单的剩余可开票余额
                </div>
                <i class="el-icon-info" />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="本次开票金额(元)">
            <template slot-scope="scope">
              <div class="btn">
                <el-form-item style="width: 185px;" :prop="`invoiceDetails.${scope.$index}.amount`" :rules="[{ max: scope.row.invoicableAmount ,validator: validateInvoicAmount, trigger: 'blur' }]">
                  <el-input
                    v-model="scope.row.amount"
                    :disabled="!scope.row.invoicableAmount"
                    placeholder="请输入"
                    type="text"
                    @keyup.native="scope.row.amount = restrict(scope.row.amount)"
                  />
                </el-form-item>
                <el-button type="text" :disabled="!scope.row.invoicableAmount" style="margin-left: 10px" @click="setRowInvoicableAmount(scope.row)">全部</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </template>
  </div>
</template>

<script>
import { isNumber } from '@/utils/validate'
import { limitNumberInput } from '@/utils/common'
export default {
  props: {
    tableForm: {
      type: Object,
      default: () => {
        return { invoiceDetails: [] }
      }
    }
  },
  data() {
    return {
      // tableForm: {
      //   invoiceDetails: []
      // }
    }
  },
  methods: {
    restrict(value) {
      const amount = limitNumberInput(value, 2)
      return amount
    },
    validateInvoicAmount(rule, value, callback) {
      if (value === '' || value === null) {
        callback()
        return
      }
      if (Number(value) === 0 || Number(value) < 0) {
        callback(new Error('开票金额需大于0'))
        return
      }
      if (Number(value) > Number(rule.max)) {
        callback(new Error('申请金额不能大于可开票金额'))
        return
      }
      if (!isNumber(Number(value))) {
        callback(new Error('请输入数字类型'))
        return
      }
      callback()
    },
    setRowInvoicableAmount(row) {
      const { invoicableAmount } = row
      row.amount = invoicableAmount
    },
    // 拼接开票总额
    initAmountDetail(AmountDetail) {
      const { totalAmount, typeGroupAmount } = AmountDetail
      const { SERVICE, RENT } = typeGroupAmount
      return `￥${totalAmount}（租金：￥${RENT || 0} / 服务费：￥${SERVICE || 0}）`
    },
    validate(cb) {
      this.$refs.tableForm.validate(cb)
    }
  }
}
</script>

<style lang="scss" scoped>
.invoiceInfoTable {
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .btn {
    display: flex;
  }
  .headerLeft {
    margin-right: 4px;
    & + i {
      color: #999;
    }
  }
}
</style>
