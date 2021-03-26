<template>
  <div>
    <RowText class="rowText" text="基础信息" />
    <ElRow :gutter="20" type="flex" align="middle">
      <ElCol ref="Col" :span="12" style="text-align: center">
        <ElImage
          :style="imageStyle"
          :src="nodeInfo.url"
          fit="contain"
        />
      </ElCol>
      <ElCol :span="12">
        <ListItem :list="list" :label-width="80" />
      </ElCol>
    </ElRow>
    <RowText class="rowText" text="下载记录" />
    <Timeline :list="logs">
      <template v-slot="{row}">
        <span>{{ row.user }} 下载了素材</span>
      </template>
    </Timeline>
  </div>
</template>

<script>
import RowText from '@/components/rowText'
import ListItem from '@/components/base/ListItem'
import Timeline from '@/components/timeline'
import { bytesToSize, getFileType } from '@/utils/common'
import { getImage } from '@/common/material'
export default {
  components: { RowText, ListItem, Timeline },
  props: {
    currentEditNode: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      imageStyle: {
        height: 'initial'
      },
      nodeInfo: {},
      operationLog: []
    }
  },
  computed: {
    list() {
      const { node, nodeType } = this.nodeInfo
      const { name, size, createBy, createDate } = node || {}
      const downloadTime = this.operationLog.length || 0
      return [
        { label: '文件名称：', value: name },
        { label: '文件大小：', value: bytesToSize(size) },
        { label: '文件类型：', value: nodeType },
        { label: '创建人：', value: createBy?.name },
        { label: '创建时间：', value: createDate },
        { label: '下载次数：', value: downloadTime }
      ]
    },
    logs() {
      return this.operationLog.map(t => {
        const { operationTime: timestamp, operator } = t
        return { timestamp, user: operator.name }
      })
    }
  },
  watch: {
    currentEditNode: {
      handler(node) {
        this.initView(node)
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.imageStyle.height = this.$refs.Col.$el.clientWidth + 'px'
  },
  methods: {
    initView(node) {
      this.getNodeInfo(node)
      this.getNodeOperationLog(node)
    },
    getNodeInfo(node) {
      const params = { id: node.id, depth: 0 }
      this.$api.content.datalibEdit(params).then(res => {
        const { node, resLink } = res
        const nodeType = getFileType(node?.name || null)
        const url = getImage(nodeType, resLink)
        this.nodeInfo = { ...res, nodeType, url }
      })
    },
    getNodeOperationLog() {
      const params = {
        query: {
          node: { id: this.currentEditNode.id },
          operationTypes: ['DIRECTLY_DOWNLOAD', 'APPLY_TO_DOWNLOAD']
        },
        index: 0,
        size: 0
      }
      this.$api.content.operationLog(params).then(res => {
        this.operationLog = res.list
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
