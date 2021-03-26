<template>
  <Layout class="shopAddPage" :use-head="false" :use-foot="false" :auto-height="true">

    <MainTitle :title="title" />

    <RowText text="商铺基础信息" />
    <CustomerPage ref="customer" :is-edit="isEdit" :customer.sync="customer" />

    <RowText text="经营信息" />
    <ManagementPage ref="management" :is-edit="isEdit" :site-type="customer.siteType" :eh-shop-domain="ehShopDomain" />

    <div class="buttomBtn">
      <el-button
        v-if="hasRolePermission('shopEdit_save')"
        type="primary"
        :loading="loadingBtn"
        @click="onSubmit"
      >确定</el-button>
      <el-button @click="back">返回列表</el-button>
    </div>
  </Layout>
</template>
<script>
import Layout from '@/components/base/Layout'
import RowText from '@/components/rowText'
import CustomerPage from './components/CustomerPage'
import ManagementPage from './components/management'
import pageMixin from '@/views/mixins/page'
import MainTitle from '@/components/base/MainTitle'
import { SITE_TYPE_ENUM } from '@/common/site'
import { deleteTagsView } from '@/utils/common'
export default {
  name: 'ShopAdd',
  components: { RowText, CustomerPage, ManagementPage, MainTitle, Layout },
  mixins: [pageMixin],
  data() {
    return {
      id: '',
      siteSaleId: '',
      delFlag: '',
      customer: {
        area: '',
        device: '简易装修',
        siteType: SITE_TYPE_ENUM.FOOD,
        projectName: '',
        // siteMessageIds: [],
        time: [],
        hostId: '',
        contact: '',
        phone: '',
        enable: 1,
        siteNo: ''
      },
      ehShopDomain: {
        brand: '',
        businessScope: '',
        businessTime: '',
        businessType: '',
        remarks: ''
      },
      loadingBtn: false

    }
  },
  computed: {
    isEdit() {
      return this.$route.name === 'shopEdit'
    },
    title() {
      return this.isEdit ? '商铺详情' : '添加商铺'
    }
  },
  mounted() {
    this.initPage()
  },
  methods: {
    initPage() {
      if (this.isEdit) {
        this.getShopEdit()
      }
    },
    // 获取详情数据
    getShopEdit() {
      const shopId = this.$route.params.id
      this.$api.shop.shopEdit({ id: shopId }).then(res => {
        if (res) {
          const { siteType, area, projectName, startDate, endDate, hostId, contact, phone, siteId, siteNo } = res.ehSiteInfoDomain
          const { device, enable, brand, businessScope, businessTime, businessType, remarks, siteSaleId, delFlag, id } = res.ehShopDomain
          // const siteMessageIds = siteMessages.map(t => t.id)

          this.customer = {
            area,
            device,
            siteType,
            projectName,
            time: [startDate, endDate],
            hostId,
            contact,
            phone,
            enable,
            siteId,
            siteNo
            // siteMessageIds
          }
          this.ehShopDomain = {
            brand,
            businessScope,
            businessTime,
            businessType,
            remarks
          }
          this.siteSaleId = siteSaleId
          this.delFlag = delFlag
          this.id = id
          this.$refs.customer.setGetSite(this.customer.siteType)
        }
      })
    },
    onSubmit() {
      this.request()
    },
    back() {
      deleteTagsView(this.$route)
      this.$router.push({ name: 'Shop' })
    },
    request() {
      const customerForm = this.$refs.customer.validate()
      const managementForm = this.$refs.customer.validate()

      Promise.all([customerForm, managementForm]).then(() => {
        const { enable, device } = this.customer
        const ehShopDomain = { ...this.ehShopDomain }

        ehShopDomain['enable'] = enable
        ehShopDomain['device'] = device

        const ehSiteInfoDomain = { ...this.customer }
        const { siteType, time } = ehSiteInfoDomain

        // const { siteMessageIds } = ehSiteInfoDomain
        // const siteMessages = siteMessageIds.map(id => {
        //   return { id, siteType }
        // })

        // ehSiteInfoDomain['siteMessages'] = siteMessages
        ehSiteInfoDomain['startDate'] = time[0]
        ehSiteInfoDomain['endDate'] = time[1]

        if (siteType === SITE_TYPE_ENUM.FOOD) {
          Reflect.deleteProperty(ehShopDomain, 'businessTime')
          // delete ehShopDomain.businessTime
        } else {
          Reflect.deleteProperty(ehShopDomain, 'device')
          // delete ehShopDomain.device
        }

        // delete ehSiteInfoDomain.siteType
        // delete ehSiteInfoDomain.enable
        // delete ehSiteInfoDomain.device
        // delete ehSiteInfoDomain.time
        // delete ehSiteInfoDomain.siteMessageIds
        Reflect.deleteProperty(ehSiteInfoDomain, 'enable')
        Reflect.deleteProperty(ehSiteInfoDomain, 'device')
        Reflect.deleteProperty(ehSiteInfoDomain, 'time')

        const params = { ehShopDomain, ehSiteInfoDomain }
        this.loadingBtn = true
        if (this.$route.name === 'shopAdd') {
          this.$api.shop.shopAdd(params).then(res => {
            if (res) {
              this.loadingBtn = false
              this.$router.push({ name: 'Shop' })
            }
          }).finally(() => { this.loadingBtn = false })
        } else {
          params.ehShopDomain['id'] = this.id
          params.ehShopDomain['siteSaleId'] = this.siteSaleId
          params.ehShopDomain['delFlag'] = this.delFlag
          this.$api.shop.shopId(params).then(res => {
            if (res) {
              this.loadingBtn = false
              this.$router.push({ name: 'Shop' })
            }
          }).finally(() => { this.loadingBtn = false })
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.shopAddPage {
  .buttomBtn {
    margin-left: 150px;
  }
}

</style>
