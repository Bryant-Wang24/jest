<template>
  <div class="info">
    <rowText :text="'操作日志'" />
    <el-row class="row">
      <timeline :list="list">
        <template v-slot="{row}">
          <div class="content">
            <span class="title">{{ row.createName }} {{ TYPE[row.action] }}了交接单</span>
            <template v-if="row.action === 'RECEIVE'">
              <span class="text">统筹负责人：{{ row.coordinator }}</span>
              <span class="text">面积复核人：{{ row.areaChecker }}</span>
            </template>
            <template v-if="row.action === 'EXAMINE'">
              <span class="text">审核结果：{{ row.auditResult }}</span>
              <span class="text">审核意见：{{ row.auditOpinion }}</span>
            </template>
            <template
              v-if="row.action === 'INSERT' ||
                row.action === 'UPDATE' ||
                row.action === 'CANCEL'"
            >
              <span class="text">状态：{{ STATE[row.state] }}</span>
            </template>
          </div>
        </template>
      </timeline>
    </el-row>
  </div>
</template>

<script>
import timeline from '@/components/timeline'
import rowText from '@/components/rowText'
import { STATE } from '@/common/handoverSlipMgmt'
import { deepClone } from '@/utils'
const TYPE = {
  INSERT: '提交',
  RECEIVE: '接收',
  EXAMINE: '审核',
  UPDATE: '修改',
  CANCEL: '作废'
}
export default {
  components: { rowText, timeline },
  props: {
    logsInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      TYPE,
      STATE
    }
  },
  computed: {
    list() {
      deepClone
      const { operationList = [] } = this.logsInfo
      const list = deepClone(operationList).map(item => {
        item.timestamp = item.createDate
        return item
      })
      return list.reverse()
    }
  },
  mounted() {
    // console.log('exhInfo', this.logsInfo)
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.el-input {
  width: 130px;
}
.info {
//   padding: 20px 0;
  font-size: 14px;
  .row{
    padding: 20px;
    .content {
      display: flex;
      flex-direction: column;
      .title {
        margin-bottom: 10px;
      }
      .text {
        color: #666;
        line-height: 24px;
      }
    }
  }
}

</style>
