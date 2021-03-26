<template>
  <div class="approvalLine" :class="vertical ? 'vertical' : ''">
    <el-scrollbar :vertical="true">
      <span class="title">审批流程</span>
      <span v-if="!list.length" class="no-data">暂无审批流程</span>
      <div v-else class="row-line">
        <div v-for="(item, index) in list" :key="index" class="row-line-item" :class="className[item.state]">
          <div class="row-line-item_tail" />
          <div class="row-line-item_node">
            <i v-if="item.state === STATE_TEXT.PASSED " class="el-icon-check node-icon" />
            <i v-if="item.state === STATE_TEXT.REFUSE " class="el-icon-close node-icon" />
            <i v-if="item.state === STATE_TEXT.REVERSED || item.state === STATE_TEXT.BACKED " class="el-icon-minus node-icon" />
            <div v-if="item.state === STATE_TEXT.ACTIVE" class="round" />
          </div>
          <div class="row-line-item_wrap">
            <div class="row-line-item_wrap-approve">
              <span class="approve-tip">{{ `${item.title}：` }}</span>
              <span class="approve-name">{{ item.approverName }}</span>
              <span class="approve-affix">
                {{ (STATE_TIP[item.state] || '') + (item.nextName || '') }}
              </span>
            </div>
            <div class="row-line-item_wrap-time">{{ item.createDate }}</div>
            <div class="row-line-item_wrap-opinion">
              {{ item.remark ? `审批意见：${item.remark}` : '' }}
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
const STATE_TIP = {
  ACTIVE: '审核中',
  REFUSE: '已拒绝',
  REVERSED: '已转审',
  BACKED: '退至'
}
const STATE_TEXT = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  REFUSE: 'REFUSE',
  PASSED: 'PASSED',
  REVERSED: 'REVERSED',
  BACKED: 'BACKED'
}
const className = {
  PENDING: 'pending', // 审核中
  ACTIVE: 'active', // 审核中
  REFUSE: 'refush', // 拒绝
  PASSED: 'passed', // 通过
  REVERSED: 'reversed', // 转审
  BACKED: 'backed' // 退回
}
// action为后端定义的，这里转成前端定义的变量
const ACTION = {
  PASS: 'PASSED',
  REJECT: 'REFUSE',
  REVERSE: 'BACKED',
  TRANSFER: 'REVERSED',
  ADDITION: 'PASSED'
}
export default {
  name: 'ApprovalLine',
  props: {
    vertical: {
      type: Boolean,
      default: false
    },
    approveId: {
      type: [Number, String],
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      STATE_TIP,
      STATE_TEXT,
      className,
      activeNodeId: null,
      logs: [],
      list: []
    }
  },
  watch: {
    approveId: {
      handler: function(v) {
        !v && (this.list = [])
        v && this._initData(v)
      },
      immediate: true
    }
  },
  mounted() {
    // this._initData(this.approveId)
  },
  methods: {
    // 刷新数据
    refresh() {
      this._initData(this.approveId)
      // this._getApprovalFromId(this.approveId)
    },
    sortNodes(arr, nodesObj, id) {
      const approverId = nodesObj[id]?.approverId
      const approverName = nodesObj[id]?.approverName
      const state = nodesObj[id]?.state
      if (state === 'PENDING') {
        arr.push({
          approverId,
          approverName,
          state: id === this.activeNodeId ? STATE_TEXT.ACTIVE : state,
          remark: '',
          createDate: '',
          title: '审批人'
        })
      }
      if (nodesObj[id]?.nextId) {
        this.sortNodes(arr, nodesObj, nodesObj[id].nextId)
      }
    },
    initNodes(nodes, activeNodeId) {
      if (!activeNodeId) return []
      const nodesObj = {}
      const arr = []
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        nodesObj[node.id] = node
      }
      this.sortNodes(arr, nodesObj, activeNodeId)
      return arr
    },
    initLogs(logsRes, nodes) {
      const logs = logsRes.map(t => {
        const { operatorId: approverId, operatorName: approverName, action, remark, createDate, objectId } = t
        let nextName = ''
        if (ACTION[action] === STATE_TEXT.BACKED) {
          const node = nodes.filter(k => String(k.id) === String(objectId))
          nextName = node[0]?.approverName
        }
        return {
          action,
          approverId,
          approverName,
          state: ACTION[action],
          nextName,
          remark,
          createDate,
          title: '审批人'
        }
      })
      return logs.filter(t => {
        return t.action !== 'ADDITION'
      })
    },
    async _initData(id) {
      if (!id) return
      const logsRes = await this._getLogs(id)
      const approvalRes = await this._getApprovalFromId(id)
      const { nodes, creatorName, createDate, activeNodeId, creatorId } = approvalRes
      this.activeNodeId = activeNodeId
      const list = [{
        approverId: creatorId,
        approverName: creatorName,
        state: 'PASSED',
        remark: '',
        createDate: createDate,
        title: '发起人'
      }, ...this.initLogs(logsRes, nodes), ...this.initNodes(nodes, activeNodeId)]
      this.list = list
    },
    _getLogs(id) {
      return this.$api.approve.getLogs(id)
    },
    _getApprovalFromId(id) {
      return this.$api.approve.getApprovalFromId(id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";

.approvalLine {
  text-align: left;
  background-color: #FAFAFA;
  .title {
    display: block;
    padding: 20px 20px 0 20px;
    font-size: 16px;
    color: #000;
    // margin-bottom: 20px;
  }
  .no-data {
    display: block;
    padding: 20px;
    font-size: 14px;
  }
  .row-line {
    padding: 20px;
    display: flex;
    .row-line-item {
      position: relative;
      z-index: 1;
      &:last-child {
        .row-line-item_tail {
          display: none;
        }
      }
      &.passed {
        .row-line-item_tail {
          background-color: $--custom--color--primary;
        }
        .row-line-item_node{
          background-color: $--custom--color--primary;
          border-color: $--custom--color--primary;
        }
      }
      &.refush {
        .row-line-item_node{
          background-color: #c40000;
          border-color: #c40000;
        }
      }
      &.reversed,&.backed {
        .row-line-item_tail {
          background-color: $--custom--color--primary;
        }
        .row-line-item_node{
          background-color: #faad14;
          border-color: #faad14;
        }
      }
      &.active {
        .row-line-item_node{
          background-color: #fff;
          border-color: $--custom--color--primary;
        }
      }
      .row-line-item_tail {
        position: absolute;
        top: 7px;
        width: 100%;
        height: 2px;
        background-color: #CCCCCC;
        z-index: -1;
      }
      .row-line-item_node {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 16px;
        height: 16px;
        margin-bottom: 10px;
        box-sizing: border-box;
        border: 1px solid #CCCCCC;
        border-radius: 50%;
        background-color: #fff;
        color: #fff;
        .node-icon {
          line-height: 16px;
          font-size: 12px;
        }
        .round {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: $--custom--color--primary;
        }
      }
      .row-line-item_wrap {
        width: 280px;
        padding-left: 2px;
        font-size: 14px;
        .row-line-item_wrap-approve {
          margin-bottom: 6px;
          color: #000;
          .approve-affix {
            color: #666666;
          }
        }
        .row-line-item_wrap-time {
          margin-bottom: 6px;
          color: #666666;
        }
        .row-line-item_wrap-opinion {
          line-height: 20px;
          color: #666666;
          word-wrap: break-word;
        }
      }
    }
  }
}
.approvalLine.vertical {
  .row-line{
    flex-direction: column;
    .row-line-item {
      .row-line-item_tail{
        top: 0;
        left: 7px;
        width: 2px;
        height: 100%;
      }
      .row-line-item_wrap {
        position: relative;
        top: -26px;
        width: inherit;
        padding-left: 26px;
      }
    }
  }
}
</style>
