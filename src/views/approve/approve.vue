<template>
  <Layout id="appliction" :use-head="false" :use-foot="false" :auto-height="true">

    <MainTitle title="审批流配置" />
    <!-- 页面操作按钮 -->
    <!-- <div class="operate">
        <el-button type="primary" @click="add">添加</el-button>
        <el-button type="primary" @click="edit">修改</el-button>
      </div> -->
    <div class="checkbox-wrap">
      <div class="row">
        <span class="label">事件分类:</span>
        <CheckableTag v-for="(item, index) in eventType" :key="index" class="tag" :tag-key="item" :checked="eventTypeChecked.includes(item)" @onChange="eventChange">
          {{ item }}
        </CheckableTag>
      </div>
      <!-- <div class="row">
          <span class="label">是否启用:</span>
          <CheckableTag v-for="(item, index) in actives" :key="index" class="tag" :tag-key="item.value" :checked="activesChecked.includes(item.value)" @onChange="activeChange">
            {{ item.label }}
          </CheckableTag>
        </div> -->
    </div>
    <!-- event list -->
    <div class="event-list">
      <div v-for="(item, index) in list" :key="item.eventKey" class="event-box">
        <span class="name">{{ item.eventName }}</span>
        <span class="edit-btn" @click="toEditFlow(item)">编辑</span>
        <div class="operate" @click="eventSwitchClick(index)">
          <!-- <span class="status">{{ item.enabled ? '启用' : '未启用' }}</span>
            <el-switch
              v-model="item.enabled"
              active-color="#13ce66"
              @change="eventSwitchChange($event, item)"
            /> -->
        </div>
      </div>
    </div>
    <!-- 临时展示 -->
    <!-- <el-button @click="refresh">刷新</el-button>
      <ApprovalLine ref="approve" :approve-id="approveId" /> -->
    <!-- </div>
    </div> -->
  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
import CheckableTag from '@/components/CheckableTag'
import MainTitle from '@/components/base/MainTitle'
// import ApprovalLine from '@/components/ApprovalLine'

export default {
  name: 'Approve',
  components: {
    Layout,
    CheckableTag,
    MainTitle
    // ApprovalLine
  },
  data() {
    return {
      approveId: 1002, // 临时展示
      events: {}, // 事件分类对象
      eventType: ['全部'],
      eventTypeChecked: [],
      actives: [{ label: '全部', value: 2 }, { label: '启用', value: true }, { label: '未启用', value: false }],
      activesChecked: [2, true, false],
      list: [] // 页面渲染的事件块
    }
  },
  computed: {
  },
  watch: {

  },
  mounted() {
    this._getEvents()
  },
  methods: {
    refresh() { // 临时
      this.$refs.approve.refresh()
    },
    eventChange(tag, checked) {
      if (tag === '全部') {
        this.eventTypeChecked = checked ? [...this.eventType] : []
      } else {
        this.eventTypeChecked = checked ? ([...this.eventTypeChecked, tag].length === this.eventType.length - 1 ? [...this.eventType] : [...this.eventTypeChecked, tag]) : this.eventTypeChecked.filter(t => {
          return (t !== '全部' && t !== tag)
        })
      }
      this.initEventList()
    },
    activeChange(tag, checked) {
      if (tag === 2) {
        this.activesChecked = checked ? this.actives.map(t => t.value) : []
      } else {
        this.activesChecked = checked ? ([...this.activesChecked, tag].length === (this.actives.length - 1) ? this.actives.map(t => t.value) : [...this.activesChecked, tag]) : this.activesChecked.filter(t => {
          return (t !== 2 && t !== tag)
        })
      }
      this.initEventList()
    },
    eventSwitchChange(val, item) {
      if (!val) {
        item.enabled = true
        this.$confirm('确定将此审批流停用吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message.success(`已停用 ${item.eventName}`)
          item.enabled = false
        }).catch(() => {
        })
      } else {
        this.$message.success(`已启用 ${item.eventName}`)
      }
    },
    eventSwitchClick(i) {
    },
    initEventList() {
      let arr = []
      this.eventTypeChecked.map(t => {
        arr = [...arr, ...(this.events?.[t] || [])]
      })
      const list = arr.filter(t => {
        return this.activesChecked.includes(t.enabled)
      })
      this.list = list
    },
    toEditFlow(item) {
      this.$router.push({
        name: 'ApproveFlow',
        params: { eventKey: item.eventKey },
        query: { eventName: item.eventName }
      })
    },
    initEvents(_events) {
      const obj = {}
      for (let i = 0; i < _events.length; i++) {
        const event = _events[i]
        const { category } = event
        if (Object.prototype.hasOwnProperty.call(obj, category)) {
          obj[category].push({ ...event, enabled: true })
        } else {
          obj[category] = [{ ...event, enabled: true }]
        }
      }
      this.events = obj
      this.eventType = ['全部', ...Object.keys(obj)]
      this.eventTypeChecked = Object.keys(obj)
      this.initEventList()
    },
    _getEvents() {
      this.$api.approve.getEvents().then(res => {
        this.initEvents(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
#appliction {
  // padding: 20px;
  // .container {
    // padding: 20px;
    // margin-bottom: 20px;
    // background-color: #ffffff;
    .title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .checkbox-wrap {
      .row {
        margin-bottom: 10px;
        font-size: 14px;
        .label {
          margin-right: 12px;
        }
        .tag {
          margin-right: 16px;
        }
      }
    }
    .event-list {
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      .event-box {
        position: relative;
        width: 380px;
        height: 84px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border: 1px solid #E7EAEC;
        margin-bottom: 20px;
        margin-right: 20px;
        .edit-btn {
          color: $--custom--color--primary;
          cursor: pointer;
        }
        .operate {
          position: absolute;
          right: 16px;
          top: 16px;
          .status {
            margin-right: 8px;
            color: #999999;
          }
        }
      }
    }
  // }
}
</style>
