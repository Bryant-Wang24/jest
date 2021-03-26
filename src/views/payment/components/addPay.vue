<template>
  <div>
    <row-text style="margin-bottom:20px" text="待收款列表"><span class="rowSpan">选择付款通知书明细项</span></row-text>
    <div class="ul">
      <div class="li" style="width:40%">
        <div class="name"><span>*</span>选择账期：</div>
        <div class="input">
          <el-select
            v-model="payPeriod"
            size="small"
            placeholder="请选择"
            @change="get_payPeriod"
          >
            <WrapOption v-for="(item,index) of accountList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <div class="li">
        <div class="input" style="width:100%">
          <el-table ref="moviesTable" :loading="tableLoading" max-height="300" :row-key="getRowKeys" :data="tableData" style="width:100%" @selection-change="changeList" @row-click="clickRow">
            <el-table-column type="selection" width="50" :reserve-selection="true" :selectable="checkSelectable" />
            <el-table-column v-for="(item,index) of tableHeader" :key="index" :min-width="item.minWidth" :align="item.align||'left'" :label="item.text" :prop="item.key" :show-overflow-tooltip="true" />
          </el-table>
          <!-- <table-page
            :height="300"
            :table-loading="tableLoading"
            :table-data="tableData"
            :table-header="tableHeader"
            :multiple-selection="submission"
            row-key="id"
            @selection-change="changeList"
          /> -->
        </div>
      </div>
      <div class="li">
        <div class="name">已选择<span> {{ submission.length }} </span>笔款项，共<span> {{ projectNameLength }} </span>个商铺，确认后将生成<span> {{ submission.length }} </span>份付款通知书</div>
      </div>
    </div>
    <row-text style="margin-bottom:20px" text="完善信息" />
    <el-form
      ref="customer"
      :rules="rules"
      :model="from"
      size="small"
      label-width="150px"
      label-position="right"
      class="demo-ruleForm"
    >
      <el-form-item label="开始日期：" prop="beginDate">
        <el-date-picker
          v-model="from.beginDate"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="款项类型：" prop="paymentType">
        <el-select
          v-model="from.paymentType"
          placeholder="请选择"
        >
          <WrapOption v-for="(item,index) of paymentList" :key="index" :label="item.label" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="缴费截止日期：" prop="finalDate">
        <el-date-picker
          v-model="from.finalDate"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          :picker-options="pickerOptions1"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="结束日期：" prop="finishDate">
        <el-date-picker
          v-model="from.finishDate"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          :picker-options="pickerOptions1"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
    </el-form>
    <div class="footBtn">
      <el-button
        size="small"
        type="primary"
        @click="sureBtn('确定')"
      >确定</el-button>
      <el-button
        size="small"
        @click="sureBtn('取消')"
      >取消</el-button>
    </div>
  </div>
</template>
<script>
import RowText from '@/components/rowText'
import WrapOption from '@/components/base/WrapOption'
// import TablePage from '@/components/table/table'
export default {
  components: { RowText, WrapOption },
  props: {
    accountList: {
      type: Array,
      default: () => []
    }
    // from: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   }
    // }
  },
  data() {
    return {
      tableLoading: false,
      projectNameLength: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      pickerOptions1: {
        disabledDate: this.disabledDate
      },
      // accountList: [],
      submission: [], // table选择数据
      tableData: [],
      payPeriod: '',
      tableHeader: [
        { key: 'paymentPlanItem.payIdNum', text: '应收款编号', minWidth: '120' },
        { key: 'projectName', text: '商铺名称', minWidth: '120' },
        { key: 'paymentPlanItem.name', text: '款项名称', minWidth: '120' },
        { key: 'amount_num', text: '应收金额', minWidth: '100', align: 'right' },
        { key: 'paymentPlanItem.payDate', text: '应收日期', minWidth: '100' },
        { key: 'payStateName', text: '收款状态', minWidth: '100' }
      ],
      from: {
        beginDate: '',
        finishDate: '',
        paymentType: '',
        finalDate: ''
      },
      rules: {
        beginDate: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        finishDate: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        paymentType: [
          { required: true, message: '请选择款项类型', trigger: 'change' }
        ],
        finalDate: [
          { required: true, message: '请选择缴费截止日期', trigger: 'change' }
        ]
      },
      paymentList: [
        { id: 'RENTFEE', label: '租金' },
        { id: 'LATEFEE', label: '滞纳金' }
      ],
      getRowKeys(row) {
        return row.id
      },
      // 0为未创建过，1为创建过
      checkSelectable(row) {
        return row.used !== 1
      }
    }
  },
  watch: {
    // payPeriod(val) {
    //   this.get_paymentPeriod(val)
    // }
  },
  created() {
    // this.get_paymentnotice()
  },
  methods: {
    get_payPeriod(val) {
      this.get_paymentPeriod(val)
    },
    clickRow(row) {
      if (row.used !== 1) {
        this.$refs.moviesTable.toggleRowSelection(row)
      } else {
        this.$message.warning('付款计划项已创建过,不可勾选')
      }
    },
    disabledDate(time) {
      if (this.from.beginDate !== '') {
        return time.getTime() < new Date(this.from.beginDate)
      } else {
        return time.getTime() < Date.now() - 8.64e7
      }
    },
    sureBtn(val) {
      switch (val) {
        case '确定':
          this.$refs.customer.validate((valid) => {
            if (valid) {
              if (this.submission.length === 0) return this.$message.warning('请选择付款通知书明细')
              var beginDate = (new Date(this.from.beginDate)).getTime()
              var finishDate = (new Date(this.from.finishDate)).getTime()
              var finalDate = (new Date(this.from.finalDate)).getTime()
              if (Number(beginDate) > Number(finishDate)) return this.$message.warning('开始日期必须大于结束日期')
              if (Number(beginDate) > Number(finalDate)) return this.$message.warning('缴费截止日期必须大于开始日期')
              var list = JSON.stringify(this.submission)
              var arr = JSON.parse(list)
              var paymentPlanModels = []
              for (var i in arr) {
                paymentPlanModels.push({
                  paymentPlanItem: {
                    id: arr[i].paymentPlanItem.id,
                    amount: arr[i].paymentPlanItem.amount
                  },
                  projectName: arr[i].projectName,
                  siteSaleId: arr[i].siteSaleId
                })
              }
              const json = {
                paymentPlanModels: paymentPlanModels,
                beginDate: this.from.beginDate,
                finishDate: this.from.finishDate + ' 23:59:59',
                paymentType: this.from.paymentType,
                finalDate: this.from.finalDate + ' 23:59:59',
                payPeriod: this.payPeriod
              }
              this.$emit('paymentAdd', json)
            }
          })
          break
        case '取消':
          this.$emit('handleCancel')
          this.submission = []
          this.$refs.moviesTable.clearSelection()
          break
      }
    },
    // // 账期数据
    // get_paymentnotice() {
    //   this.$api.payment.paymentnotice().then(res => {
    //     if (res) {
    //       this.accountList = res
    //     }
    //   })
    // },
    // 表格数据（付款通知书明细）
    get_paymentPeriod(val) {
      this.tableLoading = true
      this.$api.payment.paymentPeriod({ id: val }).then(res => {
        if (res) {
          this.tableLoading = false
          var list = res.paymentPlanModels
          for (var i in list) {
            list[i]['payStateName'] = list[i].paymentPlanItem.payState === 'UNPAID' ? '未付款' : list[i].paymentPlanItem.payState === 'PARTIAL_PAID' ? '部分付款' : '已付款'
            list[i]['amount_num'] = '￥' + list[i].paymentPlanItem.amount
          }
          this.tableData = res.paymentPlanModels
          this.submission = []
          this.$refs.moviesTable.clearSelection()
        }
      })
    },
    newList(data) {
      const res = new Map()
      return data.filter(item => !res.has(item.projectName) && res.set(item.projectName, 1))
    },
    changeList(val) {
      var arr = this.newList(val)
      this.projectNameLength = Number(arr.length)
      this.submission = val
    }
  }
}
</script>
<style lang="scss" scoped>

  ::v-deep .el-table{
    border-top: 1px solid #dfe6ec;
    border-left: 1px solid #dfe6ec;
    th{
      font-size: 14px;
      color: #000000;
      font-weight: 500;
    }
    th,td{
      border-right: 1px solid #dfe6ec;
    }
  }

.footBtn{
  width: 100%;
  text-align: center;
  margin-top: 30px;
  .el-button{
    width: 96px;
  }
}
.el-date-editor{
  width: 100%;
}
.el-form {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-form-item {
    width: 48%;
    float: left;
    ::v-deep .el-form-item__label {
      color: #000000;
      font-size: 14px;
      font-weight: 400;
    }
  }
}
.rowSpan{
  margin-left: 10px;
  color: #999999;
  font-size: 12px;
  line-height: 40px;
}
.ul{
  width: 100%;
  // display: inline-table;
  .li{
    width: 100%;
    display: flex;
    margin-bottom: 13px;
    .name{
      font-size: 14px;
      color: #000000;
      line-height: 32px;
      margin-right: 6px;
      span{
        color: #FF0000;
      }
    }
    .input{
      flex: 1;
    }
  }
}
</style>
