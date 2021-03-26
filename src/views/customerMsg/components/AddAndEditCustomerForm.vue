<template>
  <div id="addCustomer">
    <Layout :use-head="false" :use-foot="!result.visible">
      <div v-if="!result.visible" class="container">
        <!-- title -->
        <MainTitle :title="pageTitle" />

        <RowText :text="'公司信息'" />
        <CompanyInfoForm ref="companyInfoForm" :model="companyInfoData" />

        <RowText :text="'联系人信息'" />
        <ContactForm ref="contactForm" :model="contactData" />

        <RowText :text="'发票信息'" />
        <InvoiceForm ref="invoiceForm" :model="invoiceData" />
      </div>
      <div v-if="!result.visible" slot="foot" class="bottom">
        <el-button @click="back">返回</el-button>
        <el-button v-loading.fullscreen="loading" @click="keep">保存</el-button>
        <el-button
          v-show="source !== 'managementEdit'"
          v-loading.fullscreen="loading"
          type="primary"
          @click="submit"
        >提交</el-button>
      </div>

      <SubmitResult v-if="result.visible" :info="result.info" @back="resultBack" @view="resultView" />
    </Layout>
  </div>
</template>

<script>
import Layout from '@/components/base/Layout'
import RowText from '@/components/rowText'
import ContactForm from './contact/form'
import InvoiceForm from './invoice/form'
import CompanyInfoForm from './company/form'
import SubmitResult from '@/components/submitResult'
import MainTitle from '@/components/base/MainTitle'

import { mapGetters } from 'vuex'

const PAGE_TITLE = {
  applicationEdit: '修改客户资料',
  managementEdit: '修改客户资料'
}

export default {
  /**
   * @description 此页面有3种状态 { 新客户申请：[新增,编辑applicationEdit], 客户管理: [编辑managementEdit] }
   */
  // name: 'AddCustomer',
  components: { Layout, RowText, ContactForm, InvoiceForm, CompanyInfoForm, SubmitResult, MainTitle },
  data() {
    return {
      loading: false,
      pageTitle: '新增客户',
      id: null,
      source: '', // 页面状态
      defaultFromData: '', // 用于检查是否修改过当前页
      companyInfoData: null, // 公司信息数据
      contactData: null, // 联系人信息数据
      invoiceData: null, // 发票信息数据
      result: {
        visible: false,
        info: [],
        id: null
      }
    }
  },
  computed: {
    ...mapGetters({
      CUSTOMER_TYPE_OBJECT: 'CUSTOMER_TYPE_OBJECT'
    })
  },
  mounted() {
    const { id, source } = this.$route.query
    this.id = id
    this.source = source
    if (source) {
      this.pageTitle = PAGE_TITLE[source]
      this.getFormDataFromId(id)
    }
    // 保存初始数据
    this.$nextTick(() => {
      this.defaultFromData = this.getFormData('string')
    })
  },
  methods: {
    resultBack() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: 'Application' })
    },
    resultView() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        name: `ApplicationCustomerInfo`,
        query: { id: this.result.id, source: 'view' }
      })
    },
    getFormDataFromId(id) {
      //
      this.$api.customerMsg.getCustomInfoFormId(id).then(res => {
        // if (res.success) {
        const { constructBusinessInfo, constructCompany, constructInfos, customerInvoice, businessLicense, attachments: form_attachments } = res
        const {
          country,
          registerAddress,
          legalPerson,
          registerCapital,
          industry,
          businessScope,
          website,
          region,
          registerAddressEN,
          businessTime,
          companyNature,
          scale,
          briefIntroduction,
          activeState,
          postcode,
          province,
          city
        } = constructBusinessInfo
        const {
          id,
          companyName,
          taxCode,
          customerType,
          starLevel,
          abbreviation,
          nameEN,
          remarks
        } = constructCompany
        const companyInfoFormData = {
          id,
          companyName,
          taxCode,
          customerType,
          country,
          registerAddress,
          legalPerson,
          registerCapital,
          industry,
          businessScope,
          starLevel,
          website,
          abbreviation,
          nameEN,
          region,
          registerAddressEN,
          businessTime,
          companyNature,
          scale,
          briefIntroduction,
          activeState,
          postcode,
          remarks,
          businessLicense, // 营业执照数据
          form_attachments, // 附件资料
          province,
          city
        }
        //
        const contactFormData = constructInfos
        //
        const invoiceFormData = { ...customerInvoice }

        this.companyInfoData = companyInfoFormData
        this.contactData = contactFormData
        this.invoiceData = invoiceFormData
        this.$nextTick(() => {
          this.defaultFromData = this.getFormData('string')
        })
        // }
      })
    },
    // 获取3个表单的data，用于比较是否修改过
    getFormData(type) {
      const companyInfoFormData = this.$refs['companyInfoForm'].getFormData()
      const contactFormData = this.$refs['contactForm'].getFormData()
      const invoiceFormData = this.$refs['invoiceForm'].form
      if (type === 'string') {
        return (
          JSON.stringify(companyInfoFormData) +
          JSON.stringify(contactFormData) +
          JSON.stringify(invoiceFormData)
        )
      }
      return {
        companyInfoFormData,
        contactFormData,
        invoiceFormData
      }
    },
    submit() {
      // console.log(this.$refs['companyInfoForm'].$refs[])
      const companyInfoForm = new Promise((resolve, reject) => {
        this.$refs['companyInfoForm'].$refs['form'].validate((valid, errObj) => {
          if (valid) {
            resolve()
          } else {
            console.log('errObj', errObj)
            reject()
          }
        })
      })
      const contactForm = new Promise((resolve, reject) => {
        this.$refs['contactForm'].$refs['form'].validate((valid, errObj) => {
          if (valid) {
            resolve()
          } else {
            console.log('errObj', errObj)
            reject()
          }
        })
      })
      const invoiceForm = new Promise((resolve, reject) => {
        this.$refs['invoiceForm'].$refs['form'].validate((valid, errObj) => {
          if (valid) {
            resolve()
          } else {
            console.log('errObj', errObj)
            reject()
          }
        })
      })
      Promise.all([companyInfoForm, contactForm, invoiceForm]).then(() => {
        const form = this.getFormData()
        const params = this.initFormDataToParams(form)

        this.loading = true

        this.$api.customerMsg.newSubmit(params).then(res => {
          if (res.success) {
            const { id, customerType, companyName, updateDate } = res.customer.constructCompany
            // 展示成功
            const data = [
              { label: '客户类型', value: this.CUSTOMER_TYPE_OBJECT[customerType] },
              { label: '公司名称', value: companyName },
              { label: '提交人', value: this.$store.state.user.user?.name },
              { label: '提交时间', value: updateDate }
            ]
            this.showSubmitResult(id, data)
          } else {
            this.$message.error('提交失败，请重试')
          }
        }).finally(() => {
          this.loading = false
        })
      }).catch(e => {
        this.$message.warning('提交失败，请重试')
      })
    },
    showSubmitResult(id, data) {
      this.result.visible = true
      this.result.info = data
      this.result.id = id
    },
    // 按照接口格式化数据
    initFormDataToParams({
      companyInfoFormData,
      contactFormData,
      invoiceFormData
    }) {
      const {
        id,
        companyName,
        taxCode,
        customerType,
        country,
        registerAddress,
        legalPerson,
        registerCapital,
        industry,
        businessScope,
        starLevel,
        website,
        abbreviation,
        nameEN,
        region,
        registerAddressEN,
        businessTime,
        companyNature,
        scale,
        briefIntroduction,
        activeState,
        postcode,
        remarks,
        license, // 营业执照
        attachments: form_attachments, // 附件资料
        province,
        city
      } = companyInfoFormData
      const constructCompany = {
        id,
        companyName,
        taxCode,
        customerType,
        starLevel,
        abbreviation,
        nameEN,
        remarks
      }
      const constructBusinessInfo = {
        country,
        registerAddress,
        legalPerson,
        registerCapital,
        industry,
        businessScope,
        website,
        region,
        registerAddressEN,
        businessTime,
        companyNature,
        scale,
        briefIntroduction,
        activeState,
        postcode,
        province,
        city
      }
      //
      const { tableData } = contactFormData
      const constructInfos = this.deleteCreateAndUpdate([...tableData], 'array')
      //
      const customerInvoice = this.deleteCreateAndUpdate({
        ...invoiceFormData
      })
      const businessLicense = {
        imageId: license
      }
      const attachments = [
        ...form_attachments
      ]
      return {
        constructCompany,
        constructBusinessInfo,
        constructInfos,
        customerInvoice,
        businessLicense,
        attachments
      }
    },
    // 删除createBy和updateBy
    deleteCreateAndUpdate(target, type) {
      if (type === 'array') {
        for (let i = 0; i < target.length; i++) {
          const element = target[i]
          Reflect.deleteProperty(element, 'createBy')
          Reflect.deleteProperty(element, 'createDate')
          Reflect.deleteProperty(element, 'updateBy')
          Reflect.deleteProperty(element, 'updateDate')
        }
      } else {
        Reflect.deleteProperty(target, 'createBy')
        Reflect.deleteProperty(target, 'createDate')
        Reflect.deleteProperty(target, 'updateBy')
        Reflect.deleteProperty(target, 'updateDate')
      }
      return target
    },
    // 保存
    keep() {
      const formdata = this.getFormData('string')
      this.defaultFromData = formdata
      // 获取表单数据并格式化
      const form = this.getFormData()
      const params = this.initFormDataToParams(form)

      if (this.source === 'managementEdit') { // 客户管理-已审核通过的编辑
        const companyInfoForm = new Promise((resolve, reject) => {
          this.$refs['companyInfoForm'].$refs['form'].validate((valid, errObj) => {
            if (valid) {
              resolve()
            } else {
              console.log('errObj', errObj)
              reject()
            }
          })
        })
        const contactForm = new Promise((resolve, reject) => {
          this.$refs['contactForm'].$refs['form'].validate((valid, errObj) => {
            if (valid) {
              resolve()
            } else {
              console.log('errObj', errObj)
              reject()
            }
          })
        })
        const invoiceForm = new Promise((resolve, reject) => {
          this.$refs['invoiceForm'].$refs['form'].validate((valid, errObj) => {
            if (valid) {
              resolve()
            } else {
              console.log('errObj', errObj)
              reject()
            }
          })
        })
        Promise.all([companyInfoForm, contactForm, invoiceForm]).then(() => {
          this.loading = true

          this.$api.customerMsg.saveDontChangeState(params, true).then(res => {
            if (res.success) {
              const { id } = res.customer.constructCompany
              this.getFormDataFromId(id)
              this.$message.success('客户资料已保存')
              // this.get
            } else {
              this.$message.error('保存失败，请重试')
            }
          }).finally(() => {
            this.loading = false
          })
        }).catch(e => {
          this.$message.warning('保存失败')
        })
      } else { // 新客户-未审核通过的编辑
        this.$refs['companyInfoForm'].$refs['form'].validateField('companyName', (e) => { // 新增客户保存只校验名称
          if (!e) {
            // 保存，改状态
            // params.keepState = false

            this.loading = true

            this.$api.customerMsg.save(params, false).then(res => {
              if (res.success) {
                const { id } = res.customer.constructCompany
                this.getFormDataFromId(id)
                this.$message.success('客户资料已保存')
              } else {
                this.$message.error('保存失败，请重试')
              }
            }).finally(() => {
              this.loading = false
            })
          } else {
            this.$message.warning(e)
          }
        })
      }
    },
    back() {
      const formData = this.getFormData('string')
      const { name } = this.$route
      console.log(name)
      // 判断是否有改动表单
      if (this.defaultFromData !== formData) {
        this.$confirm('当前资料未保存，是否确认返回', '确认信息', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          if (name === 'ManagementEditCustomer') {
            this.$router.push({ name: 'Management' })
          } else if (name === 'AddCustomer' || name === 'EditCustomer') {
            this.$router.push({ name: 'Application' })
          }
        })
          .catch(() => {})
      } else {
        if (name === 'ManagementEditCustomer') {
          this.$router.push({ name: 'Management' })
        } else if (name === 'AddCustomer' || name === 'EditCustomer') {
          this.$router.push({ name: 'Application' })
        }
        // this.$router.push({ name: 'Application' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
