import Layout from '@/components/base/Layout'
import MainTitle from '@/components/base/MainTitle'
import TablePager from '@/components/base/TablePager'
import DialogTree from '@/components/base/DialogTree'
import InlineForm from '@/components/base/InlineForm'
import ConfirmButton from '@/components/ConfirmButton'

import keepaliveRefresh from '@/mixins/ems/keepaliveRefresh'

export default {
  mixins: [keepaliveRefresh],
  data() {
    return {
      page: {
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  components: {
    Layout,
    MainTitle,
    TablePager,
    DialogTree,
    InlineForm,
    ConfirmButton
  },
  watch: {
    page: {
      immediate: true,
      deep: true,
      handler() {
        this.getList()
      }
    }
  },
  methods: {
    // minxins keepaliveRefresh
    refresh() {
      this.getList()
      this.initDataFn()
    },
    resetPage() {
      // 重复赋值新对象才能触发watch
      this.page = {
        pageNo: 1,
        pageSize: 10
      }
    },
    getPage(page) {
      this.page.pageNo = page.currentPage
      this.page.pageSize = page.pageSize
    },
    // 重写getList方法
    getList() {},
    // 重写initDataFn方法
    initDataFn() {},
    isNull(row, value, cellValue) {
      return (<span domPropsInnerHTML={cellValue || '-'} />)
    },
    toRouter(routerName, query, isNeedRefresh = true) {
      this.$router.push({
        name: routerName,
        query: query || {}
      })
      this.$store.commit('global/toggleRefreshStatus', isNeedRefresh)
    }
  }
}
