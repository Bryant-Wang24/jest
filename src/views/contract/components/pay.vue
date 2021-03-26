<template>
  <div class="pay_new">
    <div class="ui">
      <div class="li">
        <div class="name">
          合同应收金额：<span>{{ orderNew.amount || 0 }}元</span>
        </div>
      </div>
      <div class="li">
        <div class="name">
          优惠金额：<span>{{ orderNew.discount || 0 }}元</span>
        </div>
      </div>
      <div class="li">
        <div class="name">
          合同总金额（人民币大写）：<span>{{ moneyToChinese(orderNew.amount || 0) }}</span>
        </div>
      </div>
      <div class="li">
        <div class="name">
          场地租金：<span>{{ orderNew.RENT }}元</span>
        </div>
      </div>
      <div class="li">
        <div class="name">
          服务费：<span>{{ orderNew.SERVICE }}元</span>
        </div>
      </div>
    </div>
    <div class="search">
      <div v-for="(item, index) of data_new" :key="index" class="ul">
        <div class="li" style="margin-top:16px;width:35%">
          <el-form
            ref="ruleForm"
            :model="item.ruleForm"
            label-width="120px"
            size="small"
            class="demo-ruleForm"
          >
            <el-form-item
              label="付款计划："
              :rules="[
                { required: true, message: '请选择付款计划', trigger: 'change' }
              ]"
            >
              <el-select
                v-model="item.ruleForm.payId"
                class="payIdSelect"
                placeholder="请选择付款计划"
                @change="change_index_id(index, item.ruleForm.payId)"
              >
                <WrapOption
                  v-for="(pay, i) of item.payList"
                  :key="i"
                  :label="pay.label"
                  :value="pay.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="item.ruleForm.payId === '9'" class="li">
          <div class="name">付款笔数：</div>
          <div class="input">
            <el-input
              v-model.number="item.strokes"
              style="width:200px"
              placeholder="请输入笔数"
              size="small"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
              onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"
              @blur="inputValue('strokes', item.strokes, index)"
            />
            <span>笔</span>
          </div>
        </div>
        <div
          v-if="item.ruleForm.payId === '9'"
          class="li"
          style="margin-bottom:0"
        >
          <div class="name">应收款日期：</div>
          <div class="input">
            <el-radio-group v-model="item.radioPay">
              <el-radio
                :label="1"
              >每月固定<el-input
                v-model="item.radioPayDay"
                :disabled="item.radioPay != '1'"
                style="width:100px;margin-left:10px"
                placeholder="请输入"
                size="small"
              /><span>号，起始时间 </span><el-date-picker
                v-model="item.radioPayDate"
                class="radioPayDate"
                size="small"
                type="date"
                :disabled="item.radioPay != '1'"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期"
              />
              </el-radio>
              <el-radio :label="2">自定义</el-radio>
            </el-radio-group>
            <el-button
              size="small"

              @click="sureOk(index)"
            >确定</el-button>
          </div>
        </div>
        <el-button
          type="primary"
          size="small"
          style="margin-bottom:10px"
          @click="batch(index)"
        >批量填充</el-button>
        <table-page
          class="tableDataHeader tableDataHeaderK"
          :table-data="tableDataHeader"
          :table-header="[]"
        >
          <el-table-column
            v-for="(header, k) of tableHeader"
            :key="k"
            :min-width="header.width"
            :prop="header.key"
          >
            <template slot-scope="scope">
              <el-select
                v-if="header.key === 'name'"
                v-model="item.resName"
                multiple
                collapse-tags
                placeholder="请选择款项名称（可多选）"
                size="small"
                @change="resName_index(item.resName,index)"
              >
                <WrapOption
                  v-for="(search, m) of item.nameList"
                  :key="m"
                  :label="search.name"
                  :value="search.name"
                />
              </el-select>
              <el-input
                v-if="header.key === 'ratio'"
                v-model="item.resRatio"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                :disabled="!tableStyle(index,scope)"
                placeholder="请输入付款比例"
                size="small"
              />
              <el-input
                v-if="header.key === 'amount'"
                v-model="item.resAmount"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                :disabled="!tableStyle(index,scope)"
                placeholder="请输入付款金额（元）"
                size="small"
              />
              <el-input
                v-if="header.key === 'remarks'"
                v-model="item.resRemarks"
                :disabled="item.ruleForm.payId === ''"
                placeholder="备注"
                size="small"
              />
              <el-date-picker
                v-if="header.key === 'payDate'"
                v-model="item.resPayDate"
                size="small"
                :disabled="item.ruleForm.payId === ''"
                type="date"

                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              />

            </template>
          </el-table-column>
        </table-page>
        <table-page
          class="tableDataHeader"
          style="margin-top:0"
          :height="tabHeight"
          :table-loading="item.tableLoading"
          :table-data="item.tablePay"
          :table-header="[]"
        >
          <el-table-column prop="name" />
          <el-table-column v-if="contractType!=='SHOP_LEASING'" prop="ratio">
            <template slot-scope="scope">
              <div v-if="item.ruleForm.payId === '9'">
                <el-input
                  v-model="scope.row.ratio"
                  oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  placeholder="请输入"
                  size="small"
                /><span>%</span>
              </div>
              <div v-else>{{ scope.row.ratio }}%</div>
            </template>
          </el-table-column>
          <el-table-column prop="amount">
            <template slot-scope="scope">
              <el-input
                v-if="item.ruleForm.payId === '9'"
                v-model="scope.row.amount"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                placeholder="请输入"
                size="small"
              />
              <div v-else>{{ scope.row.amount }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="payDate">
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.payDate"
                size="small"
                :disabled="scope.row.disabled"

                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />
            </template>
          </el-table-column>
          <el-table-column prop="remarks">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.remarks"
                placeholder="备注"
                size="small"
              />
            </template>
          </el-table-column>
        </table-page>
        <div class="amount_money">付款总额：<span class="span">{{ item.amount }}</span></div>
      </div>
    </div>
  </div>
</template>
<script>
import WrapOption from '@/components/base/WrapOption'
import TablePage from '@/components/table/table'
import { payList, get_time } from '@/utils/payList'
// import { clipPointsByRect } from 'echarts/lib/util/graphic'
export default {
  components: { TablePage, WrapOption },
  props: {
    accountList: {
      type: Array,
      default: () => {
        return []
      }
    }

    // accountAmountMap: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   }
    // }
  },
  data() {
    return {
      tabHeight: document.documentElement.clientHeight - 300,
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() < Date.now() - 8.64e7
      //   }
      // },

      // ruleForm: {
      //   payId: ""
      // },
      // payList: [],
      // strokes: "", //输入笔数
      // tableList: [], //付款计划表格数据
      tableDataHeader: [{}],
      nameList: [], // 付款计划表格数据（包含动态查询数据）
      tableHeader: [
        { key: 'name', text: '', minwidth: '150' },
        { key: 'ratio', text: '', minwidth: '150' },
        { key: 'amount', text: '', minwidth: '150' },
        { key: 'payDate', text: '', minwidth: '160' },
        { key: 'remarks', text: '', minwidth: '150' }
      ],
      // resName: [],
      // resRatio: '',
      // resAmount: '',
      // resRemarks: '',
      // resPayDate: '',
      // tablePay: [], // 付款计划表格数据
      // radioPay: 1, // 付款自定义--方式
      // radioPayDay: '', // 固定几号
      // radioPayDate: '', // 自定义日期
      orderNew: {},
      type: '',
      data_new: [],
      templateName: '',
      contractType: ''
    }
  },
  watch: {
    $route() {
      this.routerStyle()
    },
    accountList(val) {
      const data_new = []
      for (var i in val) {
        data_new.push({
          abbreviation: val[i].abbreviation,
          tableLoading: false,
          ruleForm: {
            payId: ''
          },
          amount: val[i].totalAmount,
          accountId: val[i].id,
          payList: payList(val[i].totalAmount, val[i].abbreviation, this.templateName),
          strokes: '',
          radioPay: '',
          radioPayDay: '',
          radioPayDate: '',
          resPayDate: '',
          resRatio: '',
          resAmount: '',
          resRemarks: '',
          tablePay: [],
          nameList: [],
          resName: []
        })
      }
      for (var k in data_new) {
        if (Number(data_new[k].amount) !== 0) {
          this.data_new.push(data_new[k])
        }
      }
    }
  },

  created() {
    this.routerStyle()
    // this.get_orderItem()
  },
  methods: {
    routerStyle() {
      // 如果合同模板类型contractType为SHOP_LEASING，说明合同人口为商铺反之是场地销售
      this.type = this.$route.params.type
      this.templateName = this.$route.query.templateName
      this.contractType = this.$route.query.contractType
      if (this.contractType !== 'SHOP_LEASING') return false
      for (var i in this.tableHeader) {
        if (this.tableHeader[i].key === 'ratio') {
          this.tableHeader.splice(i, 1)
        }
      }
      // if (this.type === 'editNew') return false
      // this.get_orderItem()
    },
    resName_index(val, index) {
      if (val.length === 0) return (this.data_new[index].tablePay = this.data_new[index].nameList)
      this.data_new[index].tablePay = []
      var list = this.data_new[index].nameList
      for (var i in val) {
        for (var j in list) {
          if (val[i] === list[j].name) {
            this.data_new[index].tablePay.push(list[j])
          }
        }
      }
    },
    // 选择价目表编号
    change_index_id(index, id) {
      var list = this.data_new[index].payList
      if (id.toString() === '9') { return this.strokesList(this.data_new[index].strokes, index) }
      for (var i in list) {
        if (list[i].value === id) {
          this.payTable(list[i], index)
          // this.data_new[index].tablePay = list[i].payTable
          this.data_new[index].radioPay = 1
          this.data_new[index].nameList = list[i].payTable
          this.$emit('tablePay_click', this.get_tablePay())
          return
        }
      }
    },
    // 非自定义付款计划最后一笔金额
    payTable(obj, index) {
      var arr = obj.payTable
      var amountNum = obj.amountNum
      var amountMoney = 0
      for (var i in arr) {
        if (Number(i) !== Number(arr.length) - Number(1)) {
          amountMoney = (Number(amountMoney) + Number(arr[i].amount)).toFixed(2)
        }
      }
      arr[arr.length - 1].amount = (Number(amountNum) - Number(amountMoney)).toFixed(2)
      this.data_new[index].tablePay = arr
    },
    // changeTime(index){
    //   for(var i=index;i<this.tablePay.length;i++){
    //     if(i === index){
    //       this.tablePay[i+1].payDateRange = this.tablePay[i].payDate
    //     }
    //     if(i===index+1){
    //       this.tablePay[i].disabled = false
    //     }
    //   }
    // },
    // 判断日期是否属于当月
    isSameMonth(time) {
      var nowDate = new Date()
      return !!(nowDate.getFullYear() === time.getFullYear() &&
        nowDate.getMonth() === time.getMonth())
    },
    // 订单详情
    get_orderItem() {
      this.$api.sale.orderItem({ id: this.$route.params.id }).then(res => {
        console.log(res)
        res['RENT'] = 'RENT' in res.typeAmountMap ? res.typeAmountMap.RENT : 0
        res['SERVICE'] =
          'SERVICE' in res.typeAmountMap ? res.typeAmountMap.SERVICE : 0
        this.orderNew = res
        this.customerId = res.customerId
        // this.payList = payList(res.amount);
      })
    },
    tableStyle(index, style) {
      return !(this.data_new[index].ruleForm.payId === '' ||
        this.data_new[index].ruleForm.payId !== '9')
    },
    // 项款名称存在情况下
    projectList(index) {
      var arr = this.data_new[index].nameList
      var list = this.data_new[index].tablePay
      for (var i in arr) {
        for (var j in list) {
          if (arr[i].name === list[j].name) {
            arr[i] = list[j]
          }
        }
      }
      this.data_new[index].nameList = arr
      this.data_new[index].tablePay = list
    },
    get_tablePay() {
      var tablePay = []
      for (var i in this.data_new) {
        for (var j in this.data_new[i].tablePay) {
          tablePay.push(this.data_new[i].tablePay[j])
        }
      }
      return tablePay
    },
    // 付款计划自定义--付款笔数
    strokesList(num, index) {
      var myDate = new Date()
      // const new_data = new Promise((resolve, reject) => {
      // this.data_new[index].tableLoading = true
      this.data_new[index].tablePay = []
      var n = 1
      var key = 0
      for (var i = 0; i < num; i++) {
        key = i
        this.data_new[index].tablePay.push({
          name: '【' + this.data_new[index].abbreviation + '】 ' + this.templateName + '第' + n++ + '笔费用',
          amount: this.data_new[index].resAmount,
          payDate: this.data_new[index].radioPayDate === '' ? '' : i === 0 ? this.data_new[index].radioPayDate
            : get_time(this.data_new[index].tablePay[key - 1].payDate, this.data_new[index].radioPayDay !== '' ? this.data_new[index].radioPayDay : myDate.getDate().toString()),
          ratio: this.data_new[index].resRatio,
          remarks: this.data_new[index].resRemarks
        })
        this.data_new[index].nameList = this.data_new[index].tablePay
        // if (key === Number(num) - Number(1)) {
        //   console.log('4444')
        //   resolve()
        // } else {
        //   reject()
        // }
      }
      // })
      // Promise.all([new_data]).then(() => {
      //   console.log('333')
      // this.data_new[index].nameList = this.data_new[index].tablePay
      // this.data_new[index].tableLoading = false
      // })
      // this.data_new[index].tablePay = []
      // var n = 1
      // var key = 0
      // for (var i = 0; i < num; i++) {
      //   key = i
      //   this.data_new[index].tablePay.push({
      //     name: '【' + this.data_new[index].abbreviation + '】 ' + this.templateName + '第' + n++ + '笔费用',
      //     amount: this.data_new[index].resAmount,
      //     payDate: this.data_new[index].radioPayDate === '' ? '' : i === 0 ? this.data_new[index].radioPayDate
      //       : get_time(this.data_new[index].tablePay[key - 1].payDate, this.data_new[index].radioPayDay),
      //     ratio: this.data_new[index].resRatio,
      //     remarks: this.data_new[index].resRemarks
      //   })
      // }
      // this.$emit("tablePay_click", this.tablePay);

      // this.$emit('tablePay_click', this.get_tablePay())
    },
    inputValue(type, data, index) {
      switch (type) {
        case 'strokes':
          if (!Number.isInteger(data)) { return this.$message.warning('请输入数字值') }
          if (this.strokes < 0) { return this.$message.warning('请输入大于0的数字') }
          //   this.strokesList(data, index)
          break
      }
    },
    // 确定
    sureOk(index) {
      if (this.data_new[index].radioPay === '2') return false
      if (this.data_new[index].strokes === '' || !Number.isInteger(this.data_new[index].strokes)) return false
      this.strokesList(this.data_new[index].strokes, index)
      //   var key = 0
      //   var list = this.data_new[index].tablePay
      //   for (var i in list) {
      //     key = i
      //     list[i].payDate =
      //       i === 0
      //         ? this.data_new[index].radioPayDate
      //         : get_time(list[key - 1].payDate, this.data_new[index].radioPayDay)
      //   }
      if (this.data_new[index].resName.length !== 0) { return this.projectList(index) }
    },
    // 批量填充
    batch(index) {
      var obj = this.data_new[index]
      if (obj.ruleForm.payId !== '9') {
        if (obj.resPayDate === '' || obj.resPayDate === null) return false
        for (var i in obj.tablePay) {
          // obj.tablePay[i].amount = obj.resAmount
          obj.tablePay[i].payDate = obj.resPayDate
          obj.tablePay[i].remarks = obj.resRemarks
        }
        this.data_new[index].tablePay = obj.tablePay
        return false
      } else {
        if (
          obj.resAmount === '' ||
          (obj.resPayDate === '' && obj.radioPay === '2')
        ) { return false }
        if (obj.tablePay.length === '0' && obj.strokes !== '') {
          this.strokesList(obj.strokes, index)
          return false
        }
        for (var j in obj.tablePay) {
          obj.tablePay[j].amount = obj.resAmount
          obj.radioPay === '1'
            ? ''
            : obj.resPayDate !== ''
              ? (obj.tablePay[j].payDate = obj.resPayDate)
              : ''
          obj.tablePay[j].ratio = obj.resRatio
          obj.tablePay[j].remarks = obj.resRemarks
        }
        this.data_new[index].tablePay = obj.tablePay
        if (obj.resName.length !== 0) return this.projectList(index)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-date-editor{
  width: 100%;
}
.radioPayDate{
  max-width: 220px;
}
.payIdSelect{
  min-width: 200px;
}
.el-button {
  width: 96px;
}
.cell {
  div {
    display: flex;
    justify-content: space-between;
    span {
      line-height: 32px;
      margin-left: 10px;
    }
  }
}
.search {
  width: 100%;
  .ul {
    width: 100%;
    display: inline-table;
    background: #fafafa;
    padding: 16px 0;
    box-sizing: border-box;
    .amount_money{
      padding: 0 10px;
      margin-top: 15px;
      width: 100%;
      font-size: 14px;
      line-height: 32px;
      color: #666666;
      .span{
        line-height: 32px;
        font-size: 18px;
        color: #FF0000;
      }
    }
    .li {
      width: 100%;
      line-height: 32px;
      font-size: 14px;
      font-weight: 400;
      display: flex;
      padding: 0 32px;
      margin-bottom: 16px;
      .name {
        text-align: right;
        min-width: 90px;
        max-width: 120px;
        margin-right: 10px;
      }
      .input {
        flex: 1;
        span {
          line-height: 32px;
          margin-left: 10px;
        }
        .el-radio-group {
          width: 100%;
          .el-radio {
            width: 100%;
            line-height: 32px;
          }
        }
      }
    }
  }
}
.tableDataHeader {
  ::v-deep .el-table {
    .el-table__header-wrapper {
      display: none;
    }
  }
}
.tableDataHeaderK {
  ::v-deep .el-table__body-wrapper {
    tr {
      background: #f5f7fa;
    }
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: #f5f7fa;
  }
}
// .tableHeader{
//   ::v-deep .el-table {
//     .el-table__header-wrapper {
//       display: block;
//     }
//   }
// }
.el-form {
  width: 100%;
  ::v-deep .el-form-item {
    .el-form-item__label {
      color: #000000;
      font-size: 14px;
      font-weight: 400;
    }
  }
}
.pay_new {
  width: 100%;
  display: inline-table;
  padding: 24px 16px;
  box-sizing: border-box;
  .ui {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-end;
    .li {
      width: 33%;
      // float: left;
      .name {
        font-size: 14px;
        color: #666666;
        line-height: 32px;
        font-weight: 400;
        span {
          color: #000000;
          line-height: 32px;
        }
      }
    }
  }
}
</style>
