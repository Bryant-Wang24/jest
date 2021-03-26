<template>
  <div>
    <RowText :text="'项目同步信息'" />
    <div v-loading="loading" class="content">
      <div v-for="(item) in list" :key="item.id" class="box">
        <div class="left">
          <span class="title mb-20">{{ TYPE[item.targetType].title }}</span>
          <span class="status">状态：{{ STATUS[item.state] }}</span>
        </div>
        <div class="right">
          <ElButton :disabled="isRescinded" type="primary" @click="handleClick(item.targetType)">手动同步</ElButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RowText from '@/components/rowText'

const TYPE = {
  EMS: {
    title: '同步至服务商系统',
    type: 'EMS'
  },
  ELC: {
    title: '同步至门禁系统',
    type: 'ELC'
  }
}

const STATUS = {
  NOT_SYNC: '未同步',
  SUCCESS: '已同步',
  FAIL: '同步失败'
}

export default {
  components: { RowText },
  props: {
    isRescinded: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      TYPE,
      STATUS,
      projectId: null,
      loading: false,
      list: []
    }
  },
  mounted() {
    this.projectId = this.$route.query.id
    this.getSyncInfo()
  },
  methods: {
    handleClick(targetType) {
      this.openLoading()
      const params = {
        projectId: this.projectId,
        targetType
      }
      this.$api.siteMarketList.syncProject(params).then(res => {
        console.log(res)
        if (res?.data?.state === 'SUCCESS') {
          this.$message.success('同步成功')
        } else {
          this.$message.error(`同步失败${res?.failureMessage || ''}`)
        }
        this.getSyncInfo()
      }).finally(() => {
        this.closeLoading()
      })
    },
    getSyncInfo() {
      this.$api.siteMarketList.getSyncList(this.projectId).then(res => {
        this.list = res
      })
    },
    openLoading() {
      this.loading = true
    },
    closeLoading() {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  .box {
    display: flex;
    justify-content: space-between;
    width: 400px;
    padding: 20px;
    margin-right: 20px;
    border: 1px solid #DCDFE6;
    font-size: 14px;
    .left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      span {
        display: block;
      }
      .status {
        font-size: 12px;
        color: #888;
      }
    }
    .right {
      display: flex;
      align-items: center;
    }
  }
}
</style>
