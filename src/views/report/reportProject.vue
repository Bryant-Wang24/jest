<template>
  <div class="content_new">
    <div class="tableList">
      <MainTitle title="项目数据汇总" />
      <div v-if="hasRolePermission('field_area') || hasRolePermission('field_other')" class="ul">
        <div class="ul_title">场地数据汇总</div>
        <div v-for="(item,index) of fieldList" :key="index">
          <div v-if="item.show" class="li">
            <div class="li_title">{{ item.title }}</div>
            <div class="li_title li_new">{{ item.remark }}</div>
            <el-button type="primary" @click="exportBtn('场地数据汇总',item)">导出</el-button>
          </div>
        </div>
      </div>
      <div v-if="hasRolePermission('money_rent') || hasRolePermission('money_fund')|| hasRolePermission('money_project')|| hasRolePermission('money_order')" class="ul ul_flex">
        <div class="ul_title">金额数据统计</div>
        <div class="li_flex ">
          <div v-for="(item,index) of moneyList" :key="index" style="width:24%" class="li_span">
            <div v-if="item.show" class="li_div">
              <div class="li_title">{{ item.title }}</div>
              <div class="li_title li_new">{{ item.remark }}</div>
              <el-button type="primary" @click="exportBtn('金额数据统计',item)">导出</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="hasRolePermission('collection_order') || hasRolePermission('collection_payment')" class="ul">
        <div class="ul_title">项目应收&实收统计表</div>
        <div v-for="(item,index) of projectList" :key="index">
          <div v-if="item.show" class="li">
            <div class="li_title">{{ item.title }}</div>
            <div class="li_title li_new">{{ item.remark }}</div>
            <el-button type="primary" @click="exportBtn('项目应收&实收统计表',item)">导出</el-button>
          </div>
        </div>
      </div>
    </div>
    <DialogPage ref="dialog" :site-type-options="siteTypeOptions" :dialog-type="DIALOG_TYPE" :current-data="currentData" :dialog-show="dialogShow" :title="title" :show="show" @submitForm="submitForm" @handleCancel="handleCancel" />
  </div>
</template>
<script>
import DialogPage from './components/dialog'
import MainTitle from '@/components/base/MainTitle'
import qs from 'qs'
import { mapState } from 'vuex'

const SITE_TYPE = {
  fieldOther: 'MEETING',
  moneyOrder: 'EXHIBITION'
}

const DIALOG_TYPE = {
  fieldArea: 'fieldArea',
  fieldOther: 'fieldOther',
  moneyRent: 'moneyRent',
  moneyFund: 'moneyFund',
  moneyProject: 'moneyProject',
  moneyOrder: 'moneyOrder',
  collectionOrder: 'collectionOrder',
  collectionPayment: 'collectionPayment'
}

export default {
  components: { DialogPage, MainTitle },
  data() {
    return {
      DIALOG_TYPE,
      dialogShow: false,
      title: '',
      show: '0',
      siteType: null,
      currentData: {},
      fieldList: [
        { type: 'fieldArea', title: '按面积统计', remark: '按面积统计项目所使用的场地', show: this.hasRolePermission('field_area') },
        { type: 'fieldOther', title: '按天数/节数/场次统计', remark: '按天数/节数/场次统计项目所使用的场地', show: this.hasRolePermission('field_other') }
      ],
      moneyList: [
        { type: 'moneyRent', title: '场租金额汇总', remark: '统计月度/年度项目场租金额', show: this.hasRolePermission('money_rent') },
        { type: 'moneyFund', title: '款项统计表', remark: '统计项目应收款、已收、未收、开票金额等数据', show: this.hasRolePermission('money_fund') },
        { type: 'moneyProject', title: '项目各类别费用统计', remark: '统计项目在水、电、气等类别的费用', show: this.hasRolePermission('money_project') },
        { type: 'moneyOrder', title: '合同/服务单金额统计', remark: '统计项目所有合同/服务订单、广告的金额', show: this.hasRolePermission('money_order') }
      ],
      projectList: [
        { type: 'collectionOrder', title: '订单应收&实收统计表', remark: '汇总项目订单应收&实收金额、时间', show: this.hasRolePermission('collection_order') },
        { type: 'collectionPayment', title: '预付款/押金应收&实收统计表', remark: '汇总项目预付款/押金的应收&实收金额、时间', show: this.hasRolePermission('collection_payment') }
      ]
    }
  },
  computed: {
    ...mapState({
      allTypes: state => state.site.allTypes
    }),
    siteTypeOptions() {
      let options = this.allTypes
      if (this.siteType) {
        options = this.allTypes.filter(t => {
          return t.type === this.siteType
        })
      }
      return options
    }
  },

  watch: {
  },
  created() {
    // console.log(this.fieldList)
  },
  methods: {
    submitForm(val) {
      switch (this.show) {
        case '0':
          var month = val.month !== '0' ? val.month : '12'
          var d = new Date(Number(val.year), Number(month), 0)
          var json = {
            projectType: val.projectType,
            startDate: val.year + '-' + (month !== '12' ? month : '01') + '-01 00:00:00',
            endDate: val.year + '-' + month + '-' + d.getDate() + ' 23:59:59',
            receiptedAccountId: val.receiptedAccountId
          }
          this.currentData.type === 'collectionOrder' ? this.getReportOrder(json) : this.getDepositsOrder(json)

          break
        case '1':
          var obj = {
            projectTypes: String(val.projectType),
            year: val.year
          }
          var sum = {
            typesIncluded: val.projectType,
            year: val.year,
            projectSiteStatisticsType: this.currentData.type === 'fieldArea' ? 'BY_AREA' : 'BY_TIME'
          }
          var agr = {
            year: val.year
          }
          var titleNew = this.currentData.type
          switch (titleNew) {
            case 'fieldArea':
              this.getExportOrder(sum)
              break
            case 'fieldOther':
              this.getExportOrder(sum)
              break
            case 'moneyRent':
              this.getSiteRentOrder(val)
              break
            case 'moneyFund':
              this.getPaymentSummaryOrder(obj)
              break
            case 'moneyProject':
              this.getpriceItemTypeOrder(obj)
              break
            case 'moneyOrder':
              this.getcontractAmountOrder(agr)
              break
          }
          break
      }
    },
    // 订单应收&实收统计表
    getReportOrder(json) {
      this.$api.report.reportOrder(json)
      this.handleCancel()
    },
    // 预付款/押金应收&实收统计表
    getDepositsOrder(json) {
      this.$api.report.depositsOrder(json)
      this.handleCancel()
    },
    // 场租金额汇总
    getSiteRentOrder(obj) {
      const { projectType = [], year } = obj
      const projectTypes = qs.stringify({ projectTypes: projectType }, { arrayFormat: 'repeat' })
      const params = {
        projectTypes,
        year
      }
      this.$api.report.siteRentOrder(params)
      this.handleCancel()
    },
    // 项目款项统计报表
    getPaymentSummaryOrder(obj) {
      this.$api.report.paymentSummaryOrder(obj)
      this.handleCancel()
    },
    // 项目各类别费用统计
    getpriceItemTypeOrder(obj) {
      this.$api.report.priceItemTypeOrder(obj)
      this.handleCancel()
    },
    // 项目合同金额统计
    getcontractAmountOrder(agr) {
      this.$api.report.contractAmountOrder(agr)
      this.handleCancel()
    },
    // 场地数据汇总
    getExportOrder(sum) {
      this.$api.report.exportOrder(sum)
      this.handleCancel()
    },
    handleCancel() {
      this.dialogShow = false
    },
    exportBtn(val, data) {
      const { title, type } = data
      this.currentData = data
      this.dialogShow = true
      this.title = title
      switch (val) {
        case '场地数据汇总':
          this.show = '1'
          break
        case '金额数据统计':
          this.show = '1'
          break
        case '项目应收&实收统计表':
          this.show = '0'
          break
      }

      this.siteType = SITE_TYPE[type] || null
    }
  }
}
</script>
<style lang="scss" scoped>
.content_new{
  background: white;
}

.tableList{
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  display: inline-table;
  .ul{
    width: 100%;
    margin-bottom: 20px;
    box-sizing: border-box;
    display: inline-table;
    .ul_title{
      width: 100%;
      font-size: 14px;
      line-height: 32px;
      margin-bottom: 13px;
    }
    .li_flex{
      width: 100%;
      display: flex;
      justify-content: space-between;
      .li_span{
        width: 24%;
      }
    }
    .li,.li_div{
      width: 24%;
      display: inline-table;
      float: left;
      padding: 13px;
      margin-right:13px;
      box-sizing: border-box;
      background: #F5F5F5;
      .li_title{
        font-size: 14px;
        font-weight: 400;
        line-height: 28px;
      }
      .li_new{
        color: #888888;
        margin-bottom: 13px;
      }
    }
    .li_div{
      width: 100%;
    }
  }

}
</style>
