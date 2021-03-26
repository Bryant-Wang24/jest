<template>
  <div id="result">
    <div class="container">
      <submitResult :info="data" @back="back" @view="view" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import submitResult from '@/components/submitResult'
import pageMixin from '@/views/mixins/page'
export default {
  name: 'Result',
  components: { submitResult },
  mixins: [pageMixin],
  data() {
    return {
      data: [
        { label: '主体类型', value: '' },
        { label: '客户名称', value: '' },
        { label: '提交人', value: '' },
        { label: '提交时间', value: '' }
      ],
      id: ''
    }
  },
  computed: {
    ...mapGetters({
      CUSTOMER_INDUSTRY: 'CUSTOMER_INDUSTRY'
    })
  },
  created() {
    this.id = this.$route.params.id
    this.get_shopCustomerId()
  },
  mounted() {
    // const { data, id } = this.$route.params
    // this.data = data
    // this.id = id
  },
  methods: {
    formatter(industry) {
      const obj = this.CUSTOMER_INDUSTRY.find(item => {
        return industry === item.value
      })
      return obj?.label || ''
    },
    get_shopCustomerId() {
      this.$api.shopCustomer.shopCustomerId({ id: this.id }).then(res => {
        if (res) {
          this.data[0].value = this.formatter(res.constructBusinessInfo.industry)
          this.data[1].value = res.constructCompany.customerName
          this.data[2].value = res.customerInvoice.createBy.name
          this.data[3].value = res.constructCompany.createDate
        }
      })
    },
    back() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: 'shopList' })
    },
    view() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        name: 'shopListEdit',
        params: {
          id: this.id,
          type: 'editNew'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#result {
  height: calc(100vh - 84px);
  padding: 20px;
  .container {
    position: relative;
    height: 100%;
    padding: 20px;
    margin-bottom: 16px;
    background-color: #ffffff;
  }
}
</style>
