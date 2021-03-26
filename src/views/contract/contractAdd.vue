<template>
  <div class="content_new">
    <div class="contract_add">
      <div class="table_title">补充信息</div>
      <row-text style="margin-bottom:20px" :text="'合同信息'" />
      <div class="conteact_new">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          size="small"
          class="demo-ruleForm"
        >
          <el-form-item v-if="(contractTypeId !== '14' && contractTypeId !== '15')" label="合同编号：" :prop="(contractTypeId === '14' && contractTypeId === '15') ? '':'code'">
            <el-select v-model="ruleForm.code" placeholder="请选择合同编号">
              <WrapOption
                v-for="(item, index) of codeList"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="show()" label="场馆服务手册：" :prop="show()?'manual':''">
            <el-select v-model="ruleForm.manual" placeholder="请选择">
              <WrapOption
                v-for="(item, index) of manualList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="show()?'客户名称：':'合同客户：'" prop="customerId">
            <el-select
              v-model="ruleForm.customerId"
              filterable
              multiple
              placeholder="请选择客户"
              class="customerId"
            >
              <WrapOption
                v-for="(item, index) of customerList"
                :key="index"
                :disabled="item.id===customerId"
                :label="entrance!=='shop'?item.companyName:item.customerName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="show()" label="合同性质：" :prop="show()?'nature':''">
            <el-select v-model="ruleForm.nature" placeholder="请选择">
              <WrapOption
                v-for="(item, index) of natureList"
                :key="index"
                :disabled="true"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="contractTypeId === '2'"
            label="主合同编号："
            :prop="contractTypeId === '2' ? 'attachTo' : ''"
          >
            <el-select v-model="ruleForm.attachTo" placeholder="请选择">
              <WrapOption
                v-for="(item, index) of effectiveList"
                :key="index"
                :label="item.idNum"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <row-text :text="'付款计划'" />
      <pay-new ref="payNew" :account-list="accountList" @tablePay_click="tablePay_click" />
      <row-text :text="'账户信息'" />
      <div class="account">
        <div v-for="(item, index) of accountList" :key="index" class="ul" :class="{'ul_border' : index < accountList.length-1}">
          <div class="li">
            <div class="name">收款户名：</div>
            <div class="input">
              <el-input :value="item.bank_name" size="small" />
            </div>
          </div>
          <div class="li">
            <div class="name">开户行：</div>
            <div class="input">
              <el-input :value="item.bankName" size="small" />
            </div>
          </div>
          <div class="li">
            <div class="name">收款账号：</div>
            <div class="input">
              <el-input :value="item.account" size="small" />
            </div>
          </div>
        </div>
      </div>
      <row-text style="margin-bottom:20px" :text="'补充部分条款参数'" />
      <clause-page
        v-if="type==='VENUE_LEASING'"
        ref="clause"
        class="clause"
        :clause-from="clauseFrom"
        :num="Num"
      />
      <clause-other v-else ref="clauseOther" :obj="obj" @delete_leasingPaymentPlan="delete_leasingPaymentPlan" @add_leasingPaymentPlan="add_leasingPaymentPlan" />
    </div>
    <div class="foot">
      <el-button @click="submitFrom('返回')">返回</el-button>
      <el-button
        v-if="contract_type()"
        v-loading.fullscreen="btnLoading"
        type="primary"
        @click="submitFrom('生成合同')"
      >生成合同</el-button>
    </div>
  </div>
</template>
<script>
import ClausePage from './components/clause'
import ClauseOther from './components/clauseOther'
import RowText from '@/components/rowText'
import PayNew from './components/pay'
import WrapOption from '@/components/base/WrapOption'
export default {
  components: { RowText, PayNew, ClausePage, ClauseOther, WrapOption },
  data() {
    return {
      clauseFrom: {
        arr1: '180',
        arr2: '180',
        arr3: '180',
        arr4: '180',
        arr5: '180',
        arr6: '180',
        arr7: '180',
        arr8: '180'
      },
      showOk: true,
      Num: '1',
      btnLoading: false,
      accountList: [], // 收款账户
      // accountAmountMap: {}, // 订单下所有收款账号所对应的收款金额
      accountId: '',
      // 合同编号
      codeList: [],
      manualList: [],
      // 合同性质
      natureList: [
        { label: '主合同', value: 'MAIN' },
        { label: '补充合同', value: 'SUPPLEMENTARY' }
      ],
      customerList: [], // 客户列表
      ruleForm: {
        code: '',
        nature: '',
        manual: '',
        customerId: [],
        attachTo: ''
      },
      customerId: '',
      Form: {
        accountId: '',
        bankName: '',
        account: ''
      },
      rules: {
        code: [
          { required: true, message: '请选择合同编号', trigger: 'change' }
        ],
        attachTo: [
          { required: true, message: '请选择合同编号', trigger: 'change' }
        ],
        nature: [
          { required: true, message: '请选择场馆服务手册', trigger: 'change' }
        ],
        manual: [
          { required: true, message: '请选择合同客户', trigger: 'change' }
        ],
        customerId: [
          { required: true, message: '请选择客户名称', trigger: 'change' }
        ],
        accountId: [
          { required: true, message: '请选择收款户名', trigger: 'change' }
        ]
      },

      orderNew: {}, // 付款计划详情
      type: '', // 合同类型
      contractType: '',
      orderId: '', // 订单id
      // orderNew:'',//付款计划详情
      contractTypeId: '', // 合同模板id
      effectiveList: [], // 合同性质为补充合同的情况下有效合同列表
      obj: {
        leasingFromDate: null,
        leasingToDate: null,
        supportingServices: '',
        banquetTableStandards: [1, 10, 1, 10, 1, 10, 1, 10],
        leasingPaymentPlan: [
          { fromDate: null, show: false, toDate: null, amountPerMonth: '' },
          { fromDate: null, show: false, toDate: null, amountPerMonth: '' },
          { fromDate: null, show: false, toDate: null, amountPerMonth: '' }
        ] // 租赁付款计划（目前可能用于商业街和美食广场租赁）
      },
      projectId: '', // 项目id
      entrance: ''
    }
  },
  computed: {
    customerIds() {
      return this.ruleForm.customerId
    }
  },
  watch: {
    $route() {
      this.routerStyle()
    },
    customerIds(arr) {
      if (Number(arr.length) === 0) {
        this.ruleForm.customerId.splice(0, 0, this.customerId)
      }
    }
  },
  created() {
    this.routerStyle()
  },

  methods: {
    get_orderItem() {
      this.$api.sale.orderItem({ id: this.$route.params.id }).then(res => {
        res['RENT'] = 'RENT' in res.typeAmountMap ? res.typeAmountMap.RENT : 0
        res['SERVICE'] =
          'SERVICE' in res.typeAmountMap ? res.typeAmountMap.SERVICE : 0
        this.orderNew = res
        this.$refs.payNew.orderNew = res
        this.customerId = res.customerId
        this.ruleForm.customerId.push(this.customerId)
      })
    },
    show() {
      if (this.contractTypeId === '12' || this.contractTypeId === '13' || this.contractTypeId === '14' || this.contractTypeId === '15') {
        return false
      } else {
        return true
      }
    },
    // 租赁付款计划（目前可能用于商业街和美食广场租赁）
    add_leasingPaymentPlan(val) {
      this.obj.leasingPaymentPlan.push(val)
    },
    delete_leasingPaymentPlan(val) {
      this.obj.leasingPaymentPlan.splice(val, 1)
    },

    tablePay_click(val) {
      if (val.length === 0) return (this.Num = '1')
      this.Num = val.length > 1 ? '1' : '0'
    },
    routerStyle() {
      this.entrance = this.$route.query.entrance
      this.projectId = this.$route.query.projectId
      this.orderId = this.$route.params.id
      this.contractType = this.$route.params.type
      this.type = this.$route.query.contractType
      this.contractTypeId = this.$route.query.contractTypeId.toString()

      this.get_customerList()
      this.get_accountList()
      this.get_manualList()
      this.get_contractCodePrefixList()
      // this.get_orderItem()
      if (this.contractTypeId === '2') {
        this.ruleForm.nature = 'SUPPLEMENTARY'
        this.get_effectiveMainContracts()
      } else {
        this.ruleForm.nature = 'MAIN'
      }
      if (this.contractTypeId === '3' || this.contractTypeId === '4') return this.get_defaultSupportingServices()
      if (this.contractType === 'editNew') return this.get_contractInfo()
    },
    // 合同 - 获取项目下所有生效的主合同
    get_effectiveMainContracts() {
      this.$api.contract.effectiveMainContracts({ id: this.projectId }).then(res => {
        if (res) {
          this.effectiveList = res
        }
      })
    },
    // 合同 - 获取合同全部信息(源于查看操作)
    get_contractInfo() {
      console.log(this.$refs.payNew.orderNew)
      this.$api.contract.contractInfo({ id: 1000 }).then(res => {
        if (res) {
          this.ruleForm.code = res.contract.code
          this.ruleForm.manual = res.contract.manual
          this.ruleForm.nature = res.contract.nature
          var contractCustomers = res.contractCustomers
          this.ruleForm.customerId = []
          // 客户
          for (var i in contractCustomers) {
            this.ruleForm.customerId.push(contractCustomers[i].customerId)
          }
          // 付款计划
          this.$refs.payNew.orderNew = res.contractPaymentPlanGroup
          this.$refs.payNew.tablePay = res.contractPaymentPlanItems
          this.$refs.payNew.nameList = res.contractPaymentPlanItems
          this.Num = res.contractPaymentPlanItems.length > 1 ? '1' : '0'
          // 账户信息
          this.Form.accountId = res.contract.account.id
          this.Form.bankName = res.contract.account.abbreviation
          this.Form.account = res.contract.account.account
          if (this.Num === '1') {
            this.clauseFrom.arr1 = res.partA[0]
            this.clauseFrom.arr2 = res.partA[1]
            this.clauseFrom.arr3 = res.partA[2]
            this.clauseFrom.arr4 = res.partA[3]
            this.clauseFrom.arr5 = res.partB[0]
            this.clauseFrom.arr6 = res.partB[1]
            this.clauseFrom.arr7 = res.partB[2]
            this.clauseFrom.arr8 = res.partB[3]
          } else {
            this.clauseFrom.arr3 = res.partA[0]
            this.clauseFrom.arr4 = res.partA[1]
            this.clauseFrom.arr7 = res.partB[0]
            this.clauseFrom.arr8 = res.partB[1]
          }
        }
      })
    },
    contract_type() {
      return this.contractType === 'add'
    },
    // 合同 - 获取手册列表
    get_manualList() {
      this.$api.contract.manualList().then(res => {
        if (res) {
          this.manualList = res
        }
      })
    },
    // 合同 - 获取合同编号前缀列表
    get_contractCodePrefixList() {
      this.$api.contract.contractCodePrefixList().then(res => {
        if (res) {
          this.codeList = res
        }
      })
    },
    // 账户列表
    get_accountList() {
      this.$api.contract.accountList({ id: this.orderId }).then(res => {
        if (res) {
          var arr = []
          for (var i in res) {
            res[i].receiptsAccount['bank_name'] =
              '【' + res[i].receiptsAccount.abbreviation + '】' + res[i].receiptsAccount.name
            res[i].receiptsAccount['totalAmount'] = res[i].totalAmount
            arr.push(res[i].receiptsAccount)
          }
          this.accountList = arr
          // this.accountAmountMap = res.accountAmountMap
        }
      })
    },

    get_customerList() {
      this.customerList = []
      if (this.entrance === 'shop') {
        this.$api.shopCustomer.shopCustomer({ customerType: '9' }).then(res => {
          this.customerList = res.list
        })
      } else {
        const json = {
          pageIndex: null,
          pageSize: null,
          customerSimple: {
            customerRequest: {
              state: 'APPROVED'
            }
          }
        }
        this.$api.customerMsg.getlist(json).then(res => {
          if (res) {
            var companyList = res.list
            for (var i in companyList) {
              this.customerList.push({
                id: Number(companyList[i].constructCompany.id),
                companyName: companyList[i].constructCompany.companyName,
                name: companyList[i].defaultConstructInfo.name,
                phone: companyList[i].defaultConstructInfo.phone
              })
            }
          }
        })
      }
      this.get_orderItem()
      // const params = {
      //   pageIndex: null,
      //   pageSize: null
      // }
      // this.$api.customerMsg.getlist(params).then(res => {
      //   this.customerList = res.list
      // })
    },
    submitFrom(type) {
      switch (type) {
        case '生成合同':
          this.$refs.ruleForm.validate(valid => {
            if (valid) {
              this.get_contractsSubmit()
            }
          })
          break
        case '返回':
          this.$router.go(-1)
          break
      }
    },
    // 获取合同补充参数中配套服务的默认值
    get_defaultSupportingServices() {
      this.$api.contract.defaultSupportingServices().then(res => {
        this.obj.supportingServices = res
      })
    },
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

    // 生成合同
    get_contractsSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          var contractPaymentPlanGroups = []
          const dataNew = JSON.stringify(this.$refs.payNew.data_new)
          var list = JSON.parse(dataNew)
          console.log(list)
          for (var n in list) {
            if (list[n].ruleForm.payId === '') return this.$message.warning('请完善付款计划')
            var ratio = 0
            var amount = 0
            var list_tablePay = list[n].nameList

            for (var k in list_tablePay) {
              if (list_tablePay[k].payDate === '' && Number(k) !== 0) return this.$message.warning('请完善付款计划')
              if (this.type !== 'SHOP_LEASING') {
                ratio = Math.floor((Number(ratio) * 1000 + Number(list_tablePay[k].ratio) * 1000)) / 1000
              } else {
                if (Number(list[n].ruleForm.payId) === 9) {
                  list_tablePay[k].ratio = null
                }
              }
              list_tablePay[k].payDate = list_tablePay[k].payDate !== null ? list_tablePay[k].payDate + ' 23:59:59' : null
              amount = Math.floor((Number(amount) * 1000 + Number(list_tablePay[k].amount) * 1000)) / 1000
            }

            if (Number(ratio) !== 100 && this.type !== 'SHOP_LEASING') {
              this.$message.warning('付款总占比必须为100%')
              return
            }
            if (Number(amount) !== Number(list[n].amount)) {
              this.$message.warning('付款总金额占比必须为应付款总额')
              return
            }
            contractPaymentPlanGroups.push({
              type: list[n].ruleForm.payId !== '9' ? 'PREDEFINED' : 'CUSTOM',
              accountId: list[n].accountId,
              items: list[n].nameList,
              payDateType: list[n].ruleForm.payId === '9'
                ? list[n].radioPay === 1
                  ? 'FIXED_MONTHLY'
                  : 'CUSTOM'
                : null
            })
          }
          var contractCustomers = []
          var arr = this.ruleForm.customerId

          for (var j in arr) {
            contractCustomers.push({ customerId: arr[j] })
          }
          // this.orderNew = this.$refs.payNew.orderNew
          var supplementaryParams = {}
          switch (this.type) {
            // 场馆租赁合同、场馆租赁补充合同
            case 'VENUE_LEASING':
              if (this.clauseFrom.arr3 === '' || this.clauseFrom.arr4 === '' || this.clauseFrom.arr7 === '' || this.clauseFrom.arr8 === '') return this.$message.warning('请完善补充部分条款参数')
              if (this.Num === '1') {
                if (this.clauseFrom.arr1 === '' && this.clauseFrom.arr2 === '' && this.clauseFrom.arr5 === '' && this.clauseFrom.arr6 === '') return this.$message.warning('请完善补充部分条款参数')
                supplementaryParams['venueLeasingBreachClauseParams'] = [
                  this.clauseFrom.arr1,
                  this.clauseFrom.arr2,
                  this.clauseFrom.arr3,
                  this.clauseFrom.arr4,
                  this.clauseFrom.arr5,
                  this.clauseFrom.arr6,
                  this.clauseFrom.arr7,
                  this.clauseFrom.arr8
                ]
              } else {
                supplementaryParams['venueLeasingBreachClauseParams'] = [
                  this.clauseFrom.arr3,
                  this.clauseFrom.arr4,
                  this.clauseFrom.arr7,
                  this.clauseFrom.arr8
                ]
              }
              break
              // 纯会议合同、纯宴会合同、纯展厅租赁合同、会议服务合同（展厅+会议厅）
            case 'CONFERENCE_LEASING':
              console.log(this.obj)
              if (!('deposit' in this.obj) && this.obj.deposit === '') return this.$message.warning('请输入保证金')
              // if (!('rehearsal' in this.obj) || this.obj.rehearsal === '') return this.$message.warning('请输入彩排时间')
              if (this.obj.rehearsalFromTime !== null && this.obj.rehearsalToTime !== null && this.timeVerification(this.obj.rehearsalFromTime, this.obj.rehearsalToTime)) {
                this.$message.error('开始时间不能大于结束时间')
                this.$refs.clauseOther.rehearsalShow = true
                return
              }

              if ((!('supportingServices' in this.obj) || this.obj.supportingServices === '') && (this.contractTypeId === '3' || this.contractTypeId === '4')) return this.$message.warning('请输入配置服务')
              if ((!('extraSupportingServices' in this.obj) || this.obj.extraSupportingServices === '') && this.contractTypeId === '4') return this.$message.warning('请输入额外收费的配置服务')
              if ((!('banquetTableStandards' in this.obj) || this.obj.banquetTableStandards.length === '8') && this.contractTypeId === '4') return this.$message.warning('请完善宴会服务条款')
              supplementaryParams['deposit'] = this.obj.deposit
              supplementaryParams['rehearsalFromTime'] = this.obj.rehearsalFromTime
              supplementaryParams['rehearsalToTime'] = this.obj.rehearsalToTime
              supplementaryParams['supportingServices'] = this.obj.supportingServices
              if (this.contractTypeId === '4') {
                supplementaryParams['extraSupportingServices'] = this.obj.extraSupportingServices
                supplementaryParams['banquetTableStandards'] = this.obj.banquetTableStandards
              }
              break
              // 广告订单合同
            case 'ADV_PRODUCTION_LEASING':
              if (!('publishFromDate' in this.obj) || this.obj.publishFromDate === null) return this.$message.warning('请选择发布开始时间')
              if (!('publishToDate' in this.obj) || this.obj.publishToDate === null) return this.$message.warning('请选择发布结束时间')
              if (this.timeVerification(this.obj.publishFromDate, this.obj.publishToDate)) {
                this.$message.error('开始时间不能大于结束时间')
                this.$refs.clauseOther.rehearsalShow = true
                return
              }
              if (!('recoveryDate' in this.obj) || this.obj.recoveryDate === null) return this.$message.warning('请选择回收时间')
              supplementaryParams['publishFromDate'] = this.obj.publishFromDate
              supplementaryParams['publishToDate'] = this.obj.publishToDate
              supplementaryParams['recoveryDate'] = this.obj.recoveryDate
              break
              // 商业街租赁经营合同、美食广告租赁经营合同、商业街物管协议、美食广场物管协议
            case 'SHOP_LEASING':
              if (this.contractTypeId === '12' || this.contractTypeId === '13') {
                var listS = this.obj.leasingPaymentPlan
                var leasingPaymentPlan = []
                for (var i in listS) {
                  if (listS[i].fromDate === null || listS[i].toDate === null || listS[i].amountPerMonth === '') {
                    this.$message.warning('请完善费用及缴纳方式')
                    return
                  }
                  if (this.timeVerification(listS[i].fromDate, listS[i].toDate)) {
                    this.$message.error('开始时间不能大于结束时间')
                    for (const k in listS) {
                      if (this.timeVerification(listS[k].fromDate, listS[k].toDate)) {
                        listS[k].show = true
                      }
                    }
                    return
                  }
                  leasingPaymentPlan.push({
                    fromDate: listS[i].fromDate,
                    toDate: listS[i].toDate,
                    amountPerMonth: listS[i].amountPerMonth
                  })
                }
                if (!('leasingDeposit' in this.obj) || this.obj.leasingDeposit === '') return this.$message.warning('请输入租赁押金')
                if ((!('deliveryDate' in this.obj) || this.obj.deliveryDate === '' || this.obj.deliveryDate === null) && this.contractTypeId === '12') return this.$message.warning('请选择交付日期')
              } else {
                if (!('actualArea' in this.obj) || isNaN(this.obj.actualArea)) return this.$message.warning('请输入有效计费面积值')
                if ((!('propertyUse' in this.obj) || this.obj.propertyUse === '') && this.contractTypeId === '14') return this.$message.warning('请输入物业用途')
                if (this.obj.leasingFromDate === null || this.obj.leasingToDate === null) return this.$message.warning('请选择起止时间')
                if (!('managementFeePerSquareMeterPerMonth' in this.obj) || isNaN(this.obj.managementFeePerSquareMeterPerMonth)) return this.$message.warning('请输入有效的每平米每月管理费')
                if (!('managementFeePerMonth' in this.obj) || isNaN(this.obj.managementFeePerMonth)) return this.$message.warning('请输入有效的每月应交管理费')
                if (!('workingCapitalForWaterAndElectricity' in this.obj) || isNaN(this.obj.workingCapitalForWaterAndElectricity)) return this.$message.warning('请输入有效的水电周转金')
                if (!('managementDeposit' in this.obj) || isNaN(this.obj.managementDeposit)) return this.$message.warning('请输入有效的管理保证金')
                if (this.timeVerification(this.obj.leasingFromDate, this.obj.leasingToDate)) {
                  this.$refs.clauseOther.rehearsalShow = true
                  this.$message.error('开始时间不能大于结束时间')
                  return
                }
              }
              if (this.contractTypeId === '12' || this.contractTypeId === '13') {
                supplementaryParams['leasingPaymentPlan'] = leasingPaymentPlan
                supplementaryParams['deposit'] = this.obj.leasingDeposit
                if (this.contractTypeId === '12') {
                  supplementaryParams['deliveryDate'] = this.obj.deliveryDate
                }
              } else {
                supplementaryParams['actualArea'] = this.obj.actualArea
                supplementaryParams['leasingFromDate'] = this.obj.leasingFromDate
                supplementaryParams['leasingToDate'] = this.obj.leasingToDate
                supplementaryParams['managementFeePerSquareMeterPerMonth'] = this.obj.managementFeePerSquareMeterPerMonth
                supplementaryParams['managementFeePerMonth'] = this.obj.managementFeePerMonth
                supplementaryParams['workingCapitalForWaterAndElectricity'] = this.obj.workingCapitalForWaterAndElectricity
                supplementaryParams['deposit'] = this.obj.managementDeposit
                if (this.contractTypeId === '14') {
                  supplementaryParams['propertyUse'] = this.obj.propertyUse
                }
              }
              break
          }
          var userInfo = JSON.parse(localStorage.getItem('userInfo'))
          this.btnLoading = true
          const json = {
            // 合同基本信息
            contract: {
              orderId: this.orderId,
              // code: this.ruleForm.code,
              type: this.type,
              // nature: this.ruleForm.nature,
              // manual: this.ruleForm.manual,
              template: {
                id: this.contractTypeId
              },
              attachTo: this.ruleForm.attachTo || null,
              // 项目信息
              project: {
                id: this.orderNew.projectId
              },
              // 更新人
              updateBy: {
                id: userInfo.id
              },
              supplementaryParams: supplementaryParams
            },
            // 合同客户信息
            contractCustomers: contractCustomers,
            // 合同付款计划组信息
            paymentPlanGroups: contractPaymentPlanGroups
          }
          if (this.show()) {
            json.contract['nature'] = this.ruleForm.nature
            json.contract['manual'] = this.ruleForm.manual
          }
          if (this.contractTypeId !== '14' && this.contractTypeId !== '15') {
            json.contract['code'] = this.ruleForm.code
          }

          this.$api.contract.contractsSave(json).then(res => {
            if (res) {
              this.btnLoading = false
              this.$router.go(-1)
            }
          }).finally(() => {
            this.btnLoading = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .customerId{
  .el-select__tags{
    span :first-child .el-tag__close{
      display: none;
    }
  }
}
.clause{
  padding: 0 13px;
}
.account {
  width: 100%;
  padding: 24px 40px;
  box-sizing: border-box;
  .ul {
    width: 100%;
    padding: 0 100px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .li {
      width: 45%;
      display: flex;
      margin-bottom: 16px;
      .name {
        font-size: 14px;
        line-height: 32px;
        color: #070707;
        font-weight: 400;
      }
      .input {
        flex: 1;
      }
    }
  }
  .ul_border{
    margin-bottom: 16px;
    border-bottom:1px solid #C0C4CC
  }
}
.el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  ::v-deep .el-form-item {
    width: 45%;
    .el-form-item__label {
      color: #070707;
      font-weight: 400;
    }

  }
}
.contract_add {
  width: 100%;
  margin-bottom: 74px;
  display: inline-table;
  box-sizing: border-box;
  padding: 20px;
  background: white;
  .table_title {
    width: 100%;
    font-size: 18px;
    line-height: 25px;
    margin-bottom: 20px;
  }
  .conteact_new {
    width: 100%;
    padding: 20px 104px;
    display: inline-table;
  }
}
.foot {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  height: 64px;
  padding: 0 56px;
  padding-left: 200px;
  box-sizing: border-box;
  line-height: 64px;
  background: white;
  text-align: center;
  font-size: 14px;
  z-index: 1000;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
  .el-button {
    width: 96px;
  }
}
</style>
