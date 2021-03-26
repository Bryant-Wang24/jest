<template>
  <Layout :use-head="false" :use-foot="true" :auto-height="true">
    <!-- <div class="shopAdd"> -->
    <div class="add_new">
      <!-- <div class="add_title">添加客户</div> -->
      <MainTitle :title="routerType === 'editNew' ? '查看详情' :'添加客户'" />
      <RowText style="margin-bottom:20px" text="客户信息 " />
      <CustomerPage ref="customer" :customer="customer" />
      <RowText style="margin-bottom:20px" text="营业执照信息 " />
      <LicensePage ref="license" :customer="license" />
      <RowText style="margin-bottom:20px" text="联系人信息 " />
      <ContactPage ref="contact" :model="contactData" />
      <RowText style="margin-bottom:20px" text="发票信息 " />
      <InvoicePage ref="invoice" :invoice="invoice" />
    </div>
    <div slot="foot">
      <el-button @click="submitFrom('取消')">{{ routerType === 'editNew' ? '返回' : '取消' }}</el-button>
      <el-button
        v-if="routerType!=='editNew'"
        type="primary"
        :loading="btnLoading"
        @click="submitFrom('提交')"
      >提交</el-button>
    </div>

    <!-- </div> -->
  </Layout>
</template>
<script>
import Layout from '@/components/base/Layout'
import { mapGetters } from 'vuex'
import RowText from '@/components/rowText'
import pageMixin from '@/views/mixins/page'
import CustomerPage from './components/customer'
import LicensePage from './components/license'
import ContactPage from './components/contact'
import InvoicePage from './components/invoice'
import MainTitle from '@/components/base/MainTitle'
export default {
  name: 'ShopListAdd',
  components: { Layout, RowText, CustomerPage, LicensePage, ContactPage, InvoicePage, MainTitle },
  mixins: [pageMixin],
  data() {
    return {
      constructBusinessInfoId: '',
      customerInvoiceId: '',
      attachments: [], // 客户信息的附件
      businessLicense: [], // 客户的营业执照
      contactData: null, // 联系人信息数据
      // 客户信息
      customer: {
        bodyType: 'INDIVIDUAL',
        customerName: '',
        industry: '',
        industry_name: '',
        country: '中国', // 默认中国
        region: '',
        remarks: '',
        provinceArr: '',
        provinceArrName: ''
      },
      // 营业执照信息
      license: {
        companyName: '',
        registerCode: '',
        legalPerson: '',
        registerAddress: '',
        registerCapital: '',
        businessTime: '',
        businessScope: ''
      },
      // 发票信息
      invoice: {
        type: 'VAT_INVOICE',
        invoiceTitle: '',
        taxCode: '',
        companyAddress: '',
        bankName: '',
        companyPhone: '',
        bankAccount: ''
      },

      routerType: '',
      routerId: '',
      btnLoading: false,
      obj: {
        width: '100%',
        background: 'white',
        height: document.documentElement.clientHeight - 125 + 'px'
      }
      // active: 2,
      // stepList: [
      //   { date: '2020-11-03 16:42:13',
      //     message: null,
      //     role: '发起人',
      //     state: null

      //   },
      //   { date: '2020-11-03 16:42:13',
      //     message: null,
      //     role: '发起人',
      //     state: null
      //   },
      //   { date: '2020-11-03 16:42:13',
      //     message: null,
      //     role: '发起人',
      //     state: null
      //   },
      //   { date: '2020-11-03 16:42:13',
      //     message: null,
      //     role: '发起人',
      //     state: null
      //   }
      // ]
    }
  },
  computed: {
    ...mapGetters({
      CUSTOMER_INDUSTRY: 'CUSTOMER_INDUSTRY'
    })
  },
  watch: {
    $route() {
      this.routerStyle()
    }
  },
  created() {
    this.routerStyle()
    // console.log('CUSTOMER_INDUSTRY', this.CUSTOMER_INDUSTRY)
  },
  methods: {
    routerStyle() {
      this.routerType = this.$route.params.type || 'add'
      switch (this.routerType) {
        case 'add':
          break
        case 'edit':
          this.routerId = this.$route.params.id
          this.get_shopCustomerId()
          break
        case 'editNew':
          this.routerId = this.$route.params.id
          this.get_shopCustomerId()
          break
      }
    },
    submitFrom(type) {
      switch (type) {
        case '取消' || '返回':
          this.$router.push({ name: 'shopList' })
          break
        case '提交':
          this.get_shopCustomerAdd()
          break
      }
    },
    industry_name(industry) {
      const obj = this.CUSTOMER_INDUSTRY.find(item => {
        return industry === item.value
      })
      return obj?.label || ''
    },
    // 商铺客户信息
    get_shopCustomerId() {
      this.$api.shopCustomer.shopCustomerId({ id: this.routerId }).then(res => {
        if (res) {
          var constructCompany = res.constructCompany
          var constructBusinessInfo = res.constructBusinessInfo // 营业执照信息
          this.constructBusinessInfoId = res.constructBusinessInfo.constructionId
          this.customerInvoiceId = res.customerInvoice.constructCompanyId
          var customerInvoice = res.customerInvoice // 客户的发票信息
          this.contactData = res.constructInfos
          this.customer.country = constructBusinessInfo.country
          this.customer.industry = constructBusinessInfo.industry
          this.customer.industry_name = this.industry_name(constructBusinessInfo.industry)
          this.customer.region = constructBusinessInfo.region
          this.customer.provinceArr = constructBusinessInfo.country === '中国' ? (constructBusinessInfo.province !== '' && constructBusinessInfo.city !== '') ? [constructBusinessInfo.province, constructBusinessInfo.city] : [] : []
          this.customer.provinceArrName = (constructBusinessInfo.province !== '' && constructBusinessInfo.province !== null) ? constructBusinessInfo.province + '/' + constructBusinessInfo.city : ''
          this.customer.customerName = constructCompany.customerName
          this.license.companyName = constructCompany.companyName
          this.customer.bodyType = constructCompany.bodyType
          this.customer.remarks = constructCompany.remarks
          // 营业执照信息
          this.license.registerCode = constructBusinessInfo.registerCode
          this.license.legalPerson = constructBusinessInfo.legalPerson
          this.license.registerAddress = constructBusinessInfo.registerAddress
          this.license.registerCapital = constructBusinessInfo.registerCapital
          this.license.businessTime = constructBusinessInfo.businessTime
          this.license.businessScope = constructBusinessInfo.businessScope
          // 客户的发票信息
          this.invoice.type = customerInvoice.type
          this.invoice.invoiceTitle = customerInvoice.invoiceTitle
          this.invoice.taxCode = customerInvoice.taxCode
          this.invoice.companyAddress = customerInvoice.companyAddress
          this.invoice.bankName = customerInvoice.bankName
          this.invoice.companyPhone = customerInvoice.companyPhone
          this.invoice.bankAccount = customerInvoice.bankAccount
          // 客户信息的附件
          if (!!res.attachments && res.attachments.length !== 0) {
            var attachments = res.attachments
            this.$refs.customer.fileList = []
            for (var k in attachments) {
              this.$refs.customer.fileList.push({
                name: attachments[k].name,
                url: attachments[k].address,
                response: {
                  resultCode: 0,
                  data: [{
                    imageId: attachments[k].imageId,
                    address: attachments[k].address
                  }]
                }
              })
            }
          }
          // 客户的营业执照
          if ('businessLicense' in res) {
            var businessLicense = res.businessLicense
            this.$refs.license.fileList = []
            this.$refs.license.fileList.push({
              name: businessLicense.name,
              url: businessLicense.address,
              response: {
                resultCode: 0,
                data: [{
                  imageId: businessLicense.imageId,
                  address: businessLicense.address
                }]
              }
            })
          }
        }
      })
    },
    // 获取图片
    // push_fileImgList(id) {
    //   this.$api.siteList.tupianID(id).then((res) => {
    //     if (res.data !== null) {
    //       const json = {
    //         name: res.data.name,
    //         url: res.data.address,
    //         response: {
    //           data: [{
    //             imageId: res.data.imageId
    //           }]
    //         }
    //       }
    //       return json
    //     }
    //   })
    // },
    get_shopCustomerAdd() {
      // var customer = false // 客户信息
      // var license = false // 营业执照信息
      // var contact = false // 联系人信息
      // var invoice = false // 发票信息
      const customer = new Promise((resolve, reject) => {
        this.$refs['customer'].$refs['ruleForm'].validate((valid, errObj) => {
          if (valid) {
            resolve()
          } else {
            console.log('errObj', errObj)
            reject()
          }
        })
      })
      const license = new Promise((resolve, reject) => {
        this.$refs['license'].$refs['ruleForm'].validate((valid, errObj) => {
          if (valid) {
            resolve()
          } else {
            console.log('errObj', errObj)
            reject()
          }
        })
      })
      const contact = new Promise((resolve, reject) => {
        this.$refs['contact'].$refs['form'].validate((valid, errObj) => {
          if (valid) {
            resolve()
          } else {
            console.log('errObj', errObj)
            reject()
          }
        })
      })
      const invoice = new Promise((resolve, reject) => {
        this.$refs['invoice'].$refs['ruleForm'].validate((valid, errObj) => {
          if (valid) {
            resolve()
          } else {
            console.log('errObj', errObj)
            reject()
          }
        })
      })
      Promise.all([customer, license, contact, invoice]).then(() => {
        var constructInfos = []
        constructInfos = this.$refs.contact.form.tableData
        for (var j in constructInfos) {
          delete constructInfos[j].createDate
          delete constructInfos[j].updateDate
          delete constructInfos[j].createBy
          delete constructInfos[j].updateBy
        }
        var isDefault_index = 0
        for (var n in constructInfos) {
          constructInfos[n].delFlag = (constructInfos[n].delFlag).toString()
          constructInfos[n].isDefault = (constructInfos[n].isDefault).toString()
          if (constructInfos[n].delFlag === '0') {
            isDefault_index++
            if (isDefault_index === 1) {
              constructInfos[n].isDefault = '0'
            } else {
              constructInfos[n].isDefault = '1'
            }
          }
        }
        var businessLicense = this.$refs.license.fileList
        var businessLicense_imageId = null
        if (businessLicense.length !== 0) {
          businessLicense_imageId = businessLicense[0].response.data[0].imageId
        }

        var attachments = []
        var attachmentList = this.$refs.customer.fileList
        if (attachmentList.length !== 0) {
          for (var k in attachmentList) {
            attachments.push({
              imageId: attachmentList[k].response.data[0].imageId
            })
          }
        }

        var customerFrom = this.customer
        // var region = ''
        // if (customerFrom.region.length !== 0) {
        //   for (var i in customerFrom.region) {
        //     region += customerFrom.region[i] + '/'
        //   }
        //   region = region.substring(0, region.length - 1)
        // }
        var licenseFrom = this.license
        var invoiceFrom = this.invoice
        const json = {
          constructCompany: {
            customerName: customerFrom.customerName,
            companyName: licenseFrom.companyName,
            bodyType: customerFrom.bodyType,
            remarks: customerFrom.remarks,
            taxCode: licenseFrom.registerCode
          },
          constructBusinessInfo: {
            industry: customerFrom.industry,
            country: customerFrom.country,
            region: customerFrom.region,
            registerCode: licenseFrom.registerCode,
            legalPerson: licenseFrom.legalPerson,
            registerAddress: licenseFrom.registerAddress,
            registerCapital: licenseFrom.registerCapital,
            businessTime: licenseFrom.businessTime,
            businessScope: licenseFrom.businessScope
          },
          customerInvoice: {
            companyPhone: invoiceFrom.companyPhone,
            type: invoiceFrom.type,
            invoiceTitle: invoiceFrom.invoiceTitle,
            taxCode: invoiceFrom.taxCode,
            companyAddress: invoiceFrom.companyAddress,
            bankName: invoiceFrom.bankName,
            bankAccount: invoiceFrom.bankAccount
          },
          businessLicense: {
            imageId: businessLicense_imageId
          },
          attachments: attachments,
          constructInfos: constructInfos
        }
        if (this.customer.country === '中国') {
          json.constructBusinessInfo['province'] = Number(this.customer.provinceArr.length) !== 0 ? this.customer.provinceArr[0] : ''
          json.constructBusinessInfo['city'] = Number(this.customer.provinceArr.length) !== 0 ? this.customer.provinceArr[1] : ''
        }
        if (this.routerType === 'add') {
          json.constructCompany['customerType'] = '9'
          this.set_shopCustomerAdd(json)
        } else {
          json.constructCompany['id'] = this.routerId
          json.constructBusinessInfo['constructionId'] = this.constructBusinessInfoId
          json.customerInvoice['constructCompanyId'] = this.customerInvoiceId
          this.get_shopCustomerEdit(json)
        }
      }).catch(e => {})
    },
    // 新增
    set_shopCustomerAdd(json) {
      this.$api.shopCustomer.shopCustomerAdd(json).then(res => {
        if (res) {
          this.$router.push({ name: 'ShopResult', params: { id: res.constructCompany.id }})
        }
      })
    },
    // 编辑
    get_shopCustomerEdit(json) {
      this.$api.shopCustomer.shopCustomerEdit(json).then(res => {
        if (res) {
          this.$router.push({ name: 'ShopResult', params: { id: res.constructCompany.id }})
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

// .foot {
//   width: 100%;
//   position: fixed;
//   left: 0;
//   bottom: 0;
//   height: 64px;
//   padding: 0 56px;
//   padding-left: 200px;
//   box-sizing: border-box;
//   line-height: 64px;
//   background: white;
//   text-align: center;
//   font-size: 14px;
//   box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
//   // .el-button {
//     // width: 96px;
//   // }
// }

</style>
