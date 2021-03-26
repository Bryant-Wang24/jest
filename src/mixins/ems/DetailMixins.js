import Layout from '@/components/base/Layout'
import MainTitle from '@/components/base/MainTitle'
import rowText from '@/components/rowText'
import DialogTree from '@/components/base/DialogTree'
import InlineForm from '@/components/base/InlineForm'
import CloseTabsButton from '@/components/base/CloseTabsButton'

import keepaliveRefresh from '@/mixins/ems/keepaliveRefresh'

export default {
  mixins: [keepaliveRefresh],
  data() {
    return {
      id: '',
      disabledForm: false,
      submitBtn: ''
    }
  },
  created() {
    // minxins keepaliveRefresh
    if (!this.isNeedRefresh) {
      this.initData()
      this.initDataFn()
    }
  },
  components: {
    Layout,
    MainTitle,
    rowText,
    DialogTree,
    InlineForm,
    CloseTabsButton
  },
  methods: {
    // minxins keepaliveRefresh
    refresh() {
      this.initData()
      this.initDataFn()
    },
    initData() {
      this.id = this.$route.query.id
      this.disabledForm = !!this.$route.meta.disabledForm
      this.submitBtn = this.$route.meta.title
      if (this.id) {
        this.getInfoById()
      }
    },
    // 重写-需要初始化数据的接口
    initDataFn() {},
    // 重写-获取详情接口
    getInfoById() {},
    formatInfo(target = {}, data = {}) {
      for (const i in target) {
        if (this.checkType(target[i]) === 'object') {
          target[i] = this.formatInfo(target[i], data[i])
        } else {
          target[i] = data[i]
        }
      }
      return target
    },
    checkType(param) {
      return Object.prototype.toString.call(param).slice(8, -1).toLowerCase()
    },
    resetForm(formName = 'ruleForm') {
      this.$refs[formName] && this.$refs[formName].resetFields()
    }
  }
}
