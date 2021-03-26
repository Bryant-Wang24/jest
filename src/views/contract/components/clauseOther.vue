<template>
  <div class="other">
    <div v-if="type === 'CONFERENCE_LEASING'" class="other_new">
      <div class="other_title">时间安排&保证金</div>
      <div class="other_ul">
        <div class="other_li">
          <div class="li_name"><span class="name_new">*</span>保证金：</div>
          <div class="li_input">
            <el-input v-model="obj.deposit" oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}" size="small" />
          </div>
          <div class="li_name_width_span">元</div>
        </div>
        <div class="other_li other_li_min_width" style="width:50%">
          <div class="li_name">彩排时间：</div>
          <div class="li_input" :class="{'rehearsalShow' :rehearsalShow}">
            <el-date-picker
              v-model="obj.rehearsalFromTime"
              size="small"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              type="datetime"
              placeholder="选择日期"
              @change="rehearsalShowNo"
            />
            <span>~</span>
            <el-date-picker
              v-model="obj.rehearsalToTime"
              size="small"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              type="datetime"
              placeholder="选择日期"
              @change="rehearsalShowNo"
            />
            <div v-if="rehearsalShow" class="title">开始时间不能大于结束时间</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="type === 'CONFERENCE_LEASING' && (contractTypeId==='3' || contractTypeId==='4')" class="other_new">
      <div class="other_title">宴会配置服务</div>
      <div class="other_ul">
        <div class="other_li" style="width:40%">
          <div class="li_name"><span class="name_new">*</span>配置服务：</div>
          <div class="li_input">
            <el-input
              v-model="obj.supportingServices"
              size="small"
              type="textarea"
            />
          </div>
        </div>
        <div v-if="contractTypeId==='4'" class="other_li" style="width:50%">
          <div class="li_name"><span class="name_new">*</span>额外收费的配置服务：</div>
          <div class="li_input">
            <el-input
              v-model="obj.extraSupportingServices"
              size="small"
              type="textarea"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="type === 'CONFERENCE_LEASING' && contractTypeId==='4'" class="other_new ">
      <div class="other_title">宴会服务条款：</div>
      <div class="other_li other_ulOrder">
        乙方应于宴会举办七日前与甲方确认用餐围数，并确保最低围数为<el-input
          v-model="obj.banquetTableStandards[0]"
          oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
          size="mini"
        />围<el-input
          v-model="obj.banquetTableStandards[1]"
          oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
          size="mini"
        />人；若实际用餐围数低于<el-input
          v-model="obj.banquetTableStandards[2]"
          oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
          size="mini"
        />围<el-input
          v-model="obj.banquetTableStandards[3]"
          oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
          size="mini"
        />人，则按<el-input
          v-model="obj.banquetTableStandards[4]"
          oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
          size="mini"
        />围<el-input
          v-model="obj.banquetTableStandards[5]"
          oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
          size="mini"
        />人结算；若实际围数超过<el-input
          v-model="obj.banquetTableStandards[6]"
          oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
          size="mini"
        />围<el-input
          v-model="obj.banquetTableStandards[7]"
          oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
          size="mini"
        />人，则甲方应按照乙方的要求增加供餐，并按照实际的供餐围数结算
      </div>
    </div>
    <div v-if="type === 'ADV_PRODUCTION_LEASING'" class="other_new">
      <div class="other_title">时间安排</div>
      <div class="other_ul">
        <div class="other_li" style="width:50%">
          <div class="li_name"><span class="name_new">*</span>发布时间：</div>
          <div class="li_input" :class="{'rehearsalShow' :rehearsalShow}">
            <el-date-picker
              v-model="obj.publishFromDate"
              size="small"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="rehearsalShowNo"
            />
            <span>~</span>
            <el-date-picker
              v-model="obj.publishToDate"
              size="small"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="rehearsalShowNo"
            />
            <div v-if="rehearsalShow" class="title">开始时间不能大于结束时间</div>
          </div>
        </div>
        <div class="other_li">
          <div class="li_name"><span class="name_new">*</span>回收时间：</div>
          <div class="li_input">
            <el-date-picker
              v-model="obj.recoveryDate"
              size="small"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="type === 'SHOP_LEASING' && (contractTypeId==='12' || contractTypeId==='13')" class="other_new">
      <div class="other_title">费用及缴纳方式</div>
      <div
        v-for="(item, index) of obj.leasingPaymentPlan"
        :key="index"
        class="other_ul"
      >
        <div class="other_li" style="width:50%">
          <div class="li_name"><span class="name_new">*</span>起止时间：</div>
          <div class="li_input" :class="{'rehearsalShow' :item.show}">
            <el-date-picker
              v-model="item.fromDate"
              size="small"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="leasingPaymentPlan(index)"
            />
            <span>~</span>
            <el-date-picker
              v-model="item.toDate"
              size="small"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="leasingPaymentPlan(index)"
            />
            <div v-if="item.show" class="title">开始时间不能大于结束时间</div>
          </div>
        </div>
        <div class="other_li" style="width:48%">
          <div class="li_name"><span class="name_new">*</span>每月租金（元/月）：</div>
          <div class="li_input">
            <el-input v-model="item.amountPerMonth" size="small" oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}" />
          </div>
          <div class="span" style="width:20%">
            <el-button
              v-if="index === 0"
              size="small"
              type="text"
              @click="add_leasingPaymentPlan"
            >增加起止时间</el-button>
            <el-button
              v-else
              size="small"
              type="text"
              @click="delete_leasingPaymentPlan(index)"
            >删除</el-button>
          </div>
        </div>
      </div>
      <div class="other_ul">
        <div class="other_li" style="width:50%">
          <div class="li_name"><span class="name_new">*</span>租赁押金：</div>
          <div class="li_input">
            <el-input v-model="obj.leasingDeposit" oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}" size="small" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="type === 'SHOP_LEASING' && contractTypeId==='12'" class="other_new">
      <div class="other_title">交付房屋装修日期和条件</div>
      <div class="other_ul">
        <div class="other_li" style="width:50%">
          <div class="li_name"><span class="name_new">*</span>交付日期：</div>
          <div class="li_input">
            <el-date-picker
              v-model="obj.deliveryDate"
              size="small"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="type === 'SHOP_LEASING' && (contractTypeId==='15' || contractTypeId==='14')" class="other_new">
      <div class="other_title">收费标准</div>
      <div class="other_ul" style="width:100%">
        <div class="other_li other_li_width">
          <div class="li_name li_name_width"><span class="name_new">*</span>计费面积（㎡）：</div>
          <div class="li_input">
            <el-input v-model="obj.actualArea" oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}" size="small" />
          </div>
        </div>
        <div v-if="contractTypeId==='14'" class="other_li other_li_width">
          <div class="li_name li_name_width"><span class="name_new">*</span>物业用途：</div>
          <div class="li_input">
            <el-input v-model="obj.propertyUse" size="small" />
          </div>
        </div>
        <div class="other_li other_li_width">
          <div class="li_name li_name_width"><span class="name_new">*</span>起止时间：</div>
          <div class="li_input" :class="{'rehearsalShow' :rehearsalShow}">
            <el-date-picker
              v-model="obj.leasingFromDate"
              size="small"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="rehearsalShowNo"
            />
            <span>~</span>
            <el-date-picker
              v-model="obj.leasingToDate"
              size="small"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="rehearsalShowNo"
            />
            <div v-if="rehearsalShow" class="title">开始时间不能大于结束时间</div>
          </div>
        </div>
        <div class="other_li other_li_width">
          <div class="li_name li_name_width"><span class="name_new">*</span>每平米每月管理费（元/月）：</div>
          <div class="li_input">
            <el-input
              v-model="obj.managementFeePerSquareMeterPerMonth"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
              size="small"
            />
          </div>
        </div>
        <div class="other_li other_li_width">
          <div class="li_name li_name_width"><span class="name_new">*</span>每月应交管理费（元/月）：</div>
          <div class="li_input">
            <el-input
              v-model="obj.managementFeePerMonth"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
              size="small"
            />
          </div>
        </div>
        <div class="other_li other_li_width">
          <div class="li_name li_name_width"><span class="name_new">*</span>水电周转金：</div>
          <div class="li_input">
            <el-input
              v-model="obj.workingCapitalForWaterAndElectricity"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
              size="small"
            />
          </div>
          <div class="li_name_width_span">元</div>
        </div>
        <div class="other_li other_li_width">
          <div class="li_name li_name_width"><span class="name_new">*</span>管理保证金：</div>
          <div class="li_input">
            <el-input v-model="obj.managementDeposit" oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}" size="small" />
          </div>
          <div class="li_name_width_span">元</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    obj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      type: '',
      contractTypeId: '',
      rehearsalShow: false

    }
  },
  created() {
    this.type = this.$route.query.contractType
    this.contractTypeId = this.$route.query.contractTypeId.toString()
    // if (this.type === 'CONFERENCE_LEASING' && (this.contractTypeId === '3' || this.contractTypeId === '4')) return this.get_defaultSupportingServices()
  },
  methods: {
    timeVerification(starts, ends) {
      const start = new Date(starts)
      const end = new Date(ends)
      const startNum = start.getTime()
      const endNum = end.getTime()
      if (Number(startNum) > Number(endNum)) {
        return true
      }
      return false
    },
    rehearsalShowNo() {
      this.rehearsalShow = false
    },
    leasingPaymentPlan(index) {
      const obj = this.obj.leasingPaymentPlan[index]
      if (obj.fromDate === null || obj.toDate === null) return
      if (this.timeVerification(obj.fromDate, obj.toDate) && obj.fromDate) {
        this.obj.leasingPaymentPlan[index].show = true
      } else {
        this.obj.leasingPaymentPlan[index].show = false
      }
    },
    add_leasingPaymentPlan() {
      const json = {
        fromDate: null,
        toDate: null,
        amountPerMonth: ''
      }
      this.$emit('add_leasingPaymentPlan', json)
    },
    delete_leasingPaymentPlan(index) {
      this.$emit('delete_leasingPaymentPlan', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.rehearsalShow{
  ::v-deep .el-date-editor{
    .el-input__inner{
      border-color: red;
    }
  }

}
.el-date-editor{
  width: 100%;
  min-width: 134px;
}
.li_name_width_span{
  line-height: 32px;
  margin-left: 5px;
}
.other {
  width: 100%;
  display: inline-table;
  padding: 24px;
  box-sizing: border-box;
  .other_new {
    width: 100%;
    display: inline-table;
    .other_title {
      width: 100%;
      line-height: 32px;
      font-size: 16px;
      margin-bottom: 16px;
    }
    .other_ul {
      width: 80%;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .other_li {
        width: 32%;
        margin-bottom: 16px;
        display: flex;
        .li_name {
          font-size: 14px;
          line-height: 32px;
        }
        .name_new{
          color: red;
          margin-right: 2px;
        }
        .li_input {
          flex: 1;
          display: flex;
          justify-content: space-between;
          position: relative;
          span{
            line-height: 32px;
            margin: 0 5px;
          }
          .title{
            position: absolute;
            font-size: 12px;
            color: red;
            left: 0;
            bottom: -16px;
          }

        }
        .span {
          margin-left: 5px;
        }
      }
      .other_li_min_width{
        min-width: 440px;
      }
      .other_li_width {
        width: 48%;
        max-width: 50%;
        .li_name_width {
          width: 35%;
          min-width: 200px;
          text-align: right;
        }

      }
    }
    .other_ulOrder {
      width: 100%;
      border: 1px solid #e7eaec;
      padding: 9px 16px;
      box-sizing: border-box;
      font-size: 14px;
      line-height: 32px;
      .el-input {
        width: 50px;
        margin: 0 5px;
        ::v-deep .el-input__inner {
          padding: 0 5px;
          text-align: center;
        }
      }
    }
  }
}
</style>
