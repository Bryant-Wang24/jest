<template>
  <div id="approveFlow" ref="approveFlow">
    <div class="top">
      <div class="top-left">
        <span>{{ nodeConfig.eventName }}</span>
      </div>
      <!-- <div class="top-left" @click="showDialog({component: DIALOG.setBasicInfo})">
        <span class="title">未命名审批流</span>
        <span class="desc">添加流程说明……</span>
      </div> -->
      <div class="top-right">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <div class="dingflow-design">
      <div class="zoom">
        <div :class="'zoom-out'+ (nowVal==50?' disabled':'')" @click="zoomSize(1)">
          <i class="el-icon-remove-outline" />
        </div>
        <span>{{ nowVal }}%</span>
        <div :class="'zoom-in'+ (nowVal==300?' disabled':'')" @click="zoomSize(2)">
          <i class="el-icon-circle-plus-outline" />
        </div>
      </div>
      <div id="box-scale" class="box-scale" :style="'transform: scale('+nowVal/100+'); transform-origin: 50% 0px 0px;'">
        <!-- flow-content -->
        <nodeWrap :node-config.sync="nodeConfig" />
        <!-- end node -->
        <div class="end-node">
          <div class="end-node-circle" />
          <div class="end-node-text">流程结束</div>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="720px"
      destroy-on-close
    >
      <UserTree v-if="dialog.visible" ref="userTree" :ids="dialog.ids" />
      <div class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="dialogOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { Loading } from 'element-ui'
// import setBasicInfo from './components/dialog/setBasicInfo'
import nodeWrap from './components/nodeWrap'
import UserTree from '@/components/UserTree'
import { ApproveEvent, Branch, Condition, Approver, treeToArray } from '@/common/approve'
import { SET_BRANCH_IDS, SET_APPROVE_FIELDS, SET_PRIORITYS } from '@/common/approve'
import { deepClone, uniqueArr } from '@/utils'
import { EventBus } from '@/utils/event-bus'
const DIALOG = {
  // setBasicInfo: 'setBasicInfo'
}

export default {
  name: 'ApproveFlow',
  components: { nodeWrap, UserTree },
  data() {
    return {
      DIALOG,
      eventKey: '',
      eventName: '',
      dialog: {
        title: '',
        visible: false,
        component: '',
        ids: []
      },
      nowVal: 100,
      isSave: false,
      eventConditions: [],
      nodeConfig: {
      },
      callback: null,
      error: ''
    }
  },
  computed: {
    ...mapState({
      offices: state => state.approve.offices,
      branchIds: state => state.approve.branchIds,
      userlist: state => state.approve.userlist,
      prioritys: state => state.approve.prioritys
    })
  },
  watch: {
    nodeConfig: {
      handler: function(val, oldVal) {
        if (val.childNode === null) { // 如果无分支，标记branchId为DELETE
          SET_BRANCH_IDS(null, 'DELETE', true)
        }
        // 设置优先级option
        SET_PRIORITYS(val)
      },
      deep: true
    }
  },
  async mounted() {
    const loadingInstance = Loading.service({
      target: this.$refs.approveFlow
    })
    const { eventKey } = this.$route.params
    const { eventName } = this.$route.query
    this.eventKey = eventKey
    this.eventName = eventName
    this.controlHeader(false)
    await this._getConditions(eventKey)
    await this._getUserTree()
    this.getUserList()
    this._getBranchs(eventKey)
    EventBus.$on('user_tree', (cb, ids = []) => {
      this.callback = cb
      this.showDialog({ title: '选择', ids })
    })
    this.$nextTick(() => {
      loadingInstance.close()
    })
  },
  destroyed() {
    this.controlHeader(true)
  },
  methods: {
    ...mapActions('approve', ['getUserList']),
    zoomSize(type) {
      if (type === 1) {
        if (this.nowVal === 50) {
          return
        }
        this.nowVal -= 10
      } else {
        if (this.nowVal === 300) {
          return
        }
        this.nowVal += 10
      }
    },
    // show dialog
    showDialog(prop) {
      this.dialog.visible = true
      this.dialog.title = prop.title
      this.dialog.ids = prop.ids
    },
    // dialog footer confirm button
    dialogOk() {
      const nodes = this.$refs.userTree.nodes()
      this.callback(nodes) // 回调
      this.callback = null
      this.dialog.visible = false
    },
    cancel() {
      if (!this.isSave) {
        this.$confirm('确定离开编辑页面吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({ name: 'Approve' })
        }).catch(() => {
        })
      }
    },
    save() {
      this.error = null

      const _nodeConfig = deepClone(this.nodeConfig)
      const obj = {}
      this.mapNodeConfig(_nodeConfig, obj)
      const params = this.initParams(obj) // 拼接保存参数
      if (this.error) {
        this.$message.error(this.error)
        return
      }

      this.$api.approve.saveBranchs(this.eventKey, params).then(res => {
        // refresh 数据
        // this._getBranchs(this.eventKey)
        this.$message.success('保存成功')
        this.$router.push({ name: 'Approve' })
      })
    },
    mapNodeConfig(nodeConfig, obj, isSingle = false) {
      if (!nodeConfig) return null
      if (nodeConfig.type === 0) {
        const { eventKey, childNode } = nodeConfig
        if (childNode === null) {
          this.error = '请添加审批节点或条件节点'
          return
        }
        obj['eventKey'] = eventKey
        if (childNode) {
          this.mapNodeConfig(childNode, obj, childNode.type !== 4)
        }
      }
      if (nodeConfig.type === 4) {
        const { branchList } = nodeConfig
        const arr = uniqueArr(branchList.map(t => t.childNode.priority))
        if (branchList.length !== arr.length) {
          this.error = '分支优先级不能重复'
          return
        }
        obj['branch'] = []
        for (let i = 0; i < branchList.length; i++) {
          const branch = branchList[i]
          this.mapNodeConfig(branch.childNode, obj)
        }
      }
      if (nodeConfig.type === 3) {
        const { conditions, branchId, nodeName, priority, childNode } = nodeConfig
        if (!childNode) {
          this.error = '分支条件至少配置一个审批节点'
          return
        }
        if (Object.prototype.hasOwnProperty.call(obj, 'branch')) { // 多分支
          if (conditions.length === 0 || !conditions) {
            this.error = '分支条件不能为空'
            return
          }
          const approverNodes = this.mapNodeConfig(childNode, [])
          obj['branch'].push({
            id: branchId,
            name: nodeName,
            priority,
            conditions,
            approverNodes
          })
        } else { // 单分支
          const approverNodes = this.mapNodeConfig(childNode, [])
          obj['branch'] = [{
            id: branchId,
            name: nodeName,
            priority,
            conditions,
            approverNodes
          }]
        }
      }
      if (nodeConfig.type === 1) {
        // const arr = []
        const { branchId, approveId, nodeName, reversible, transferable, addable, approverIds, childNode } = nodeConfig
        if (isSingle) { // 单分支且第一个节点为审批人节点(无条件)
          if (Object.prototype.hasOwnProperty.call(obj, 'branch')) {
            obj['branch'][0]['approverNodes'].push({ id: approveId, name: nodeName, reversible, transferable, addable, approverIds })
            if (childNode) {
              this.mapNodeConfig(childNode, obj, true)
            }
          } else {
            obj['branch'] = [{
              id: branchId,
              name: '条件',
              priority: 1,
              conditions: [],
              approverNodes: [{ id: approveId, name: nodeName, reversible, transferable, addable, approverIds }]
            }]
            if (approverIds.length === 0) {
              this.error = '审批人不能为空'
              return
            }
            if (childNode) {
              this.mapNodeConfig(childNode, obj, true)
            }
          }
        } else {
          obj.push({ id: approveId, name: nodeName, reversible, transferable, addable, approverIds })
          if (approverIds.length === 0) {
            this.error = '审批人不能为空'
            return
          }
          if (childNode) {
            this.mapNodeConfig(childNode, obj)
          }
          return obj
        }
      }
    },
    // 拼接保存参数
    initParams(obj) {
      const branch = obj.branch || []
      const newBranch = branch.map(t => {
        let operationFlag = ''
        const { id } = t
        if (!id) {
          operationFlag = 'ADD'
        } else {
          operationFlag = this.branchIds[id] ? this.branchIds[id] : 'DO_NOTHING'
        }
        return { ...t, operationFlag }
      })
      for (const key in this.branchIds) {
        if (this.branchIds[key] === 'DELETE') {
          newBranch.push({ id: Number(key), operationFlag: 'DELETE' })
        }
      }
      return newBranch
    },
    // setBasicInfo() {
    //   this.$refs[DIALOG.setBasicInfo].$refs['form'].validate((valid) => {
    //     if (valid) {
    //       // request
    //       const params = { ...this.$refs[DIALOG.setBasicInfo].form }
    //       console.log(params)
    //       this.dialog.visible = false
    //     }
    //   })
    // },
    // 控制页面header显隐
    controlHeader(v) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'headerView',
        value: v
      })
    },
    spliceApproverNode(approverNodes, branchId) {
      var obj = {}
      for (let i = approverNodes.length - 1; i >= 0; i--) {
        const approver = approverNodes[i]
        const { addable, transferable, reversible, id: approveId, approverIds, approveGroupIds } = approver
        const isMultiple = approverIds.length > 1
        if (i === approverNodes.length - 1) {
          obj = { ...new Approver(this.eventKey, approveId, addable, transferable, reversible, approverIds, approveGroupIds, isMultiple, null, branchId), childNode: null }
        } else {
          obj = { ...new Approver(this.eventKey, approveId, addable, transferable, reversible, approverIds, approveGroupIds, isMultiple, null, branchId), childNode: obj }
        }
      }
      return obj
    },
    spliceChildNode(name, priority, eventKey, conditions, approverNodes, branchId) {
      let child = null
      if (conditions && conditions.length > 0) { // has condition 有条件
        child = new Condition(name, priority, eventKey, conditions, null, branchId)
        child['childNode'] = this.spliceApproverNode(approverNodes, branchId)
      } else if (conditions && conditions.length === 0) { // no condition 无条件
        child = this.spliceApproverNode(approverNodes, branchId)
      }
      // console.log('spliceChildNode', child)
      return child
    },
    initBranchList(branchs) {
      const branchList = []
      const branchIds = {}
      for (let i = 0; i < branchs.length; i++) {
        const branch = branchs[i]
        const { conditions, approverNodes, name, priority, id: branchId } = branch
        branchIds[branchId] = null
        const config = this.spliceChildNode(name, priority, this.eventKey, conditions, approverNodes, branchId)
        branchList.push({ childNode: config })
      }
      this.SET_BRANCH_IDS({ ...this.branchIds, ...branchIds })
      // console.log('initBranchList', branchList)
      return branchList
    },
    initNodeConfig(res) {
      const nodeConfig = new ApproveEvent(this.eventKey, this.eventName)
      if (res.length === 0) { // 初始化审批流
        nodeConfig.childNode = new Approver(this.eventKey, null, false, false, false, [], [], false, null)
      }
      if (res.length === 1) { // 单分支
        const { conditions, approverNodes, name, priority, id: branchId } = res[0]
        nodeConfig.childNode = this.spliceChildNode(name, priority, this.eventKey, conditions, approverNodes, branchId)
        this.SET_BRANCH_IDS({ ...this.branchIds, [branchId]: null })
      } else if (res.length > 1) { // 多分支
        const branchList = this.initBranchList(res)
        nodeConfig.childNode = new Branch(this.eventKey, branchList)
      }
      console.log('initNodeConfig', nodeConfig)
      this.nodeConfig = nodeConfig
    },
    initEventConditions(res, resolve) {
      this.eventConditions = res
      this.SET_CONDITION_OPTION(res)
      SET_APPROVE_FIELDS(res)
      resolve()
    },
    _getConditions(eventKey) {
      return new Promise((resolve, reject) => {
        this.$api.approve.getConditions(eventKey).then(res => {
          this.initEventConditions(res, resolve)
        })
      })
    },
    _getBranchs(eventKey) {
      this.SET_BRANCH_IDS({})
      this.$api.approve.getBranchs(eventKey).then(res => {
        const _res = res.sort((a, b) => {
          return a.priority - b.priority
        })
        this.initNodeConfig(_res)
      })
    },
    async _getUserTree() {
      if (Object.keys(this.offices).length === 0) {
        const { childrenList: organization } = await this.$api.user.getUserTree({ type: 'OFFICE', userIncluded: true })
        const { childrenList: role } = await this.$api.user.getUserTree({ type: 'ROLE', userIncluded: false })

        const offices = { ...treeToArray(organization), ...treeToArray(role) }
        this.SET_APPROVE({ key: 'offices', value: offices })
      }
    },
    ...mapMutations('approve', {
      SET_CONDITION_OPTION: 'SET_CONDITION_OPTION',
      SET_BRANCH_IDS: 'SET_BRANCH_IDS',
      SET_APPROVE: 'SET_APPROVE'
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@import "~@/styles/custom-theme.scss";
#approveFlow {
  // position: relative;
  width: 100%;
  height: 100vh;
  padding-top: 80px;
  .top {
    position: fixed;
    width: calc(100vw - #{$sideBarWidth});
    top:0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #fff;
    z-index: 2;
    transition: width 0.28s;
    .top-left {
      display: flex;
      flex-direction: column;
      font-size: 18px;
      font-weight: bold;
      // cursor: pointer;
      // .title {
      //   font-size: 18px;
      //   font-weight: bold;
      //   margin-bottom: 6px;
      // }
      // .desc {
      //   font-size: 12px;
      //   color: #999;
      // }
    }
  }
  .dingflow-design {
    position: relative;
    width: 100%;
    height: calc(100vh - 80px);
    overflow-y: auto;
    .zoom {
      position: fixed;
      display: flex;
      width: 125px;
      right: 20px;
      margin-top: 20px;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
      font-size: 14px;
      .zoom-out,
      .zoom-in {
        width: 30px;
        height: 30px;
        // background: #fff;
        color: #c1c1cd;
        background-size: 100%;
        background-repeat: no-repeat;
        font-size: 30px;
        cursor: pointer;
        transition: all .5s;
        &:hover {
          color: $--custom--color--primary;
        }
      }
    }
    .box-scale {
      min-width: 100%;
      width: fit-content;
      padding-top: 80px;
      padding-bottom: 80px;
      // height: 100vh;
      .end-node {
        .end-node-circle {
          width: 10px;
          height: 10px;
          margin: auto;
          border-radius: 50%;
          background: #ABB8C2;
        }
        .end-node-text {
          width: 160px;
          line-height: 64px;
           margin: auto;
          background-color: #fff;
          text-align: center;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
        }
      }
    }
  }
}

.dialog-footer {
  text-align: center;
}
</style>
