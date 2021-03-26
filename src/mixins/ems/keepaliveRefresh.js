import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      isNeedRefresh: store => store.global.isNeedRefresh
    })
  },
  activated() {
    if (this.isNeedRefresh) {
      this.refresh()
      this.$store.commit('global/toggleRefreshStatus')
    }
  },
  methods: {
    // 重写-需要刷新时的处理
    refresh() {}
  }
}
