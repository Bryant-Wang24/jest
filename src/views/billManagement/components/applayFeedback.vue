<template>
  <div class="feedback">
    <submit-result @back="back" @view="view" />
  </div>
</template>

<script>
import submitResult from '@/components/submitResult'
export default {
  components: {
    submitResult
  },
  methods: {
    back() {
    //   console.log('back')
      const isInvoice = !!Number(this.$route.query.isInvoice)
      this.$store.dispatch('tagsView/delView', this.$route)
      if (isInvoice) {
        this.$router.push({ name: 'BillManagement', query: { activeName: 'invoiceList' }})
      } else {
        this.$router.push({ name: 'BillManagement', query: { activeName: 'receiptList' }})
      }
    },
    view() {
      const isInvoice = !!Number(this.$route.query.isInvoice)
      this.$store.dispatch('tagsView/delView', this.$route)
      if (isInvoice) {
        this.$router.push({ name: 'catInvoice', query: {
          isCat: 1,
          invoiceId: this.$route.query.invoiceId
        }})
      } else {
        this.$router.push({
          name: 'catReceipt',
          query: {
            isCat: 1,
            receiptId: this.$route.query.receiptId
          }
        })
      }
    }
  }
}
</script>

<style>

</style>
