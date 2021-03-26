<template>
  <div v-loading="loading" class="dataList">
    <div v-if="!dataItemList.length" class="noData">暂无数据</div>
    <div v-for="(item,index) in dataItemList" :key="index" class="dataItem">
      <div class="dataItemTitle">
        <!-- <warning v-if="item.stateType==='RESCINDED'" /> -->
        <span class="left">{{ item.projectName }}</span>
        <span class="right">{{ sendTip(item) }}</span>
      </div>
      <div class="dataItemContent">
        <div class="sponsor">
          <span class="sponsorTitle">主办方: </span>
          <el-tooltip :content="item.hostCompany">
            <span class="topSpan">{{ item.hostCompany }}</span>
          </el-tooltip>
        </div>
        <div class="planMan">
          <span class="sponsorTitle">统筹负责人: </span>
          <span>{{ item.coordinator ? item.coordinator : '-' }}</span>
        </div>
        <div class="bookStatus">
          <span class="sponsorTitle">任务书状态: </span>
          <span>{{ item.taskBookState ? TASK_BOOK_STATE_TEXT[item.taskBookState] : TASK_BOOK_STATE_TEXT['NO_GENERATED'] }}</span>
        </div>
      </div>
      <div class="dataItemBtn">
        <el-button v-if="isShowTaskTrack(item)" size="mini" type="text" @click="taskUp(item.id)">任务跟踪</el-button>
        <el-button v-if="isEditable(item)" size="mini" type="text" @click="modificationBook(item.id)">修改任务书</el-button>
        <el-button v-if="isWritable(item)" size="mini" type="text" @click="compileBook(item.id)">编写任务书</el-button>
        <el-button v-if="isHandoverVisible(item)" size="mini" type="text" @click="lookBill(item.id)">查看交接单</el-button>
        <el-button v-if="isTaskBookVisible(item)" size="mini" type="text" @click="lookBook(item)">查看任务书</el-button>
        <el-button v-if="isSendable(item)" :disabled="isRescinded(item)" size="mini" type="text" @click="sendBook(item)">下发任务书</el-button>
        <el-button size="mini" type="text" @click="toProjectDataFiles(item)">相关文件</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import warning from '@/components/warning.vue'
import { TASK_BOOK_STATE, TASK_BOOK_STATE_TEXT } from '@/common/taskBook'
import { DIALOG_TYPE } from '@/common/taskBook'

export default {
  // components: { warning },
  props: {
    // 列表数据
    dataItemList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 生成任务书数据
      createTaskID: {},
      TASK_BOOK_STATE,
      TASK_BOOK_STATE_TEXT
    }
  },
  methods: {
    modificationBook(id) {
      this.$router.push({
        name: 'CompileBook',
        query: { id, source: 'modification' }
      })
    },
    lookBook(item) {
      this.$router.push({
        name: 'LookBook',
        query: item
      })
    },
    sendBook(item) {
      const { taskBookId } = item
      this.$emit('parentEvent', {
        taskBookId, type: DIALOG_TYPE['SEND_BOOK'],
        isPaid: this.isPaid(item),
        isRescinded: this.isRescinded(item)
      })
    },
    compileBook(id) {
      this.$router.push({
        name: 'CompileBook',
        query: { id, source: 'compile' }
      })
    },
    lookBill(id) {
      this.$emit('parentEvent', { handoverSlipId: id, type: DIALOG_TYPE['SHOW_HANDOVER'] })
    },
    taskUp(id) {
      this.$router.push({
        name: 'TaskTail',
        query: { id }
      })
    },
    // 是否可编写
    isWritable(item) {
      return (item.taskBookState === 'NO_GENERATED' || !item.taskBookState) && this.hasRolePermission('TaskBookAdmin_write')
    },
    // 是否可修改
    isEditable(item) {
      return item.taskBookState === TASK_BOOK_STATE['HAS_GENERATED'] && this.hasRolePermission('TaskBookAdmin_edit')
    },
    // 是否显示任务跟踪
    isShowTaskTrack(item) {
      return item.taskBookState === TASK_BOOK_STATE['HAS_ISSUED']
    },
    // 是否可查看交接单
    isHandoverVisible(item) {
      // return !item.taskBookState || item.taskBookState === 'NO_GENERATED' || item.taskBookState === 'HAS_ISSUED' || item.taskBookState === 'HAS_GENERATED'
      return item.taskBookState !== TASK_BOOK_STATE['HAS_GENERATED']
    },
    // 是否可查看任务书
    isTaskBookVisible(item) {
      return item.taskBookState === TASK_BOOK_STATE['HAS_GENERATED'] || item.taskBookState === TASK_BOOK_STATE['HAS_ISSUED']
    },
    // 是否可下发任务书
    isSendable(item) {
      return item.taskBookState === TASK_BOOK_STATE['HAS_GENERATED'] && this.hasRolePermission('TaskBookAdmin_send')
    },
    // 款项是否结清
    isPaid(item) {
      return !(!item.settled && item.taskBookState === TASK_BOOK_STATE['HAS_GENERATED'])
    },
    // 是否撤销
    isRescinded(item) {
      return item.stateType === 'RESCINDED'
    },
    sendDisable() {
      return false
    },
    sendTip(item) {
      let tip = ''

      if (!this.isPaid(item)) {
        tip = '款项未结清'
      }

      if (this.isRescinded(item)) {
        tip = '项目已撤销'
      }

      return tip
    },
    toProjectDataFiles(item) {
      console.log(item)
      const { projectId: id } = item
      this.$router.push({
        name: 'projectData',
        query: { id, activeName: 'file' }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .dataList {
    display: flex;
    flex-wrap: wrap;
    .noData {
      flex: 1;
      text-align: center;
      line-height: 50px;
    }
    .dataItem {
      width: 32%;
      min-width: 300px;
      background: #FFFFFF;
      border: 1px solid #E7EAEC;
      margin-bottom: 20px;
      margin-right: 1.3%;
      .dataItemTitle {
        display: flex;
        background: #FAFAFA;
        border-bottom: 1px solid #E7EAEC;
        font-size: 14px;
        height: 42px;
        line-height: 42px;
        padding: 0 16px;
        .left {
          flex: 1;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
        }
        .right {
          padding-left: 16px;
          color: #666;
        }
      }
      .dataItemContent {
        padding: 16px;
        border-bottom: 1px solid #E7EAEC;
        font-size: 14px;
        .planMan {
          margin: 16px 0;
        }
        .sponsorTitle {
          color: #666;
          margin-right: 8px;
        }
      }
      .dataItemBtn {
        line-height: 42px;
        padding-left: 16px;
      }
    }
  }
  .sponsor {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
  }
  .textClass {
    font-size: 12px;
    color: #666;
    margin-left: 10px;
  }
</style>
