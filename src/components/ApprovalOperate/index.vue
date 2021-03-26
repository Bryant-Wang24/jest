<template>
  <div v-if="visible" class="approvalOperate">
    <el-dropdown v-if="transferable || addable || reversible" class="approvalOperate-dropdown" placement="top-start" trigger="click" @command="handleCommand">
      <el-button>更多...</el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="transferable" :disabled="disabledMore" class="down-item" :command="TYPES.TRANSFER">转审</el-dropdown-item>
        <el-dropdown-item v-if="addable" :disabled="disabledMore" class="down-item" :command="TYPES.ADD">加签</el-dropdown-item>
        <el-dropdown-item v-if="reversible" :disabled="disabledMore" class="down-item" :command="TYPES.BACKED">退回</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button :disabled="disabledReject" @click="handleDialogShow(TYPES.REFUSE)">拒绝审核</el-button>
    <el-button :disabled="disabledPass" type="primary" @click="handleDialogShow(TYPES.PASS)">审核通过</el-button>
    <!-- dialog -->
    <el-dialog
      :visible.sync="dialog.visible"
      :title="dialog.dialogTitle"
      width="30%"
      :destroy-on-close="true"
      custom-class="dialog-wrap"
      :modal-append-to-body="false"
      append-to-body
    >
      <component :is="comp" ref="form" :options="userList" :pass-options="passUserList" />
      <div slot="footer">
        <el-button @click="handleDialogCancel">取消</el-button>
        <el-button type="primary" @click="handleDialogOk">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import REFUSE from './components/RejectFrom'
import PASS from './components/PassFrom'
import TRANSFER from './components/TransferFrom'
import BACKED from './components/BackedFrom'
import ADD from './components/AddFrom'
import { mapGetters } from 'vuex'

// const STATE = {
//   REFUSED: 'REFUSED',
//   PASSED: 'PASSED',
//   BACKED: 'BACKED'
// }
const TYPES = {
  REFUSE: 'REFUSE',
  PASS: 'PASS',
  TRANSFER: 'TRANSFER',
  BACKED: 'BACKED',
  ADD: 'ADD'
}
const DIALOG_TITLE = {
  REFUSE: '拒绝申请',
  PASS: '审核通过确认',
  TRANSFER: '转审',
  BACKED: '退回',
  ADD: '加签'
}
export default {
  components: { REFUSE, PASS, TRANSFER, BACKED, ADD },
  props: {
    approveId: { // 必传参数，审批流id
      type: [Number, String],
      default: () => {
        return null
      }
    },
    visible: { // 必传参数，默认传false
      type: Boolean,
      default: () => {
        return false
      }
    },
    disabledPass: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    disabledReject: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    disabledMore: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      TYPES,
      nodes: {},
      activeNodeId: null,
      addable: false,
      transferable: false,
      reversible: false,
      dialog: {
        visible: false,
        dialogTitle: ''
      },
      comp: '',
      userList: [],
      passUserList: []
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  watch: {
    approveId(id) {
      this._getApprovalFromId(id)
    }
  },
  async mounted() {
    await this._getUserList()
    this._getApprovalFromId(this.approveId)
  },
  methods: {
    refresh() {
      this._getApprovalFromId(this.approveId)
      this.handleDialogCancel()
      this.$emit('refresh')
    },
    handleDialogShow(type) {
      this.dialog.visible = true
      this.dialog.dialogTitle = DIALOG_TITLE[type]
      this.comp = type
    },
    handleDialogOk() {
      this.$refs.form.validate().then(data => {
        switch (this.comp) {
          case TYPES.REFUSE: {
            this.$api.approve.reject(this.activeNodeId, { remark: data.text }).then(res => {
              this.refresh()
              // this._getApprovalFromId(this.approveId)
              // this.handleDialogCancel()
            })
            break
          }
          case TYPES.PASS: {
            this.$api.approve.pass(this.activeNodeId, { remark: data.text }).then(res => {
              this.refresh()
              // this.handleDialogCancel()
            })
            break
          }
          case TYPES.TRANSFER: {
            this.$api.approve.transfer(this.activeNodeId, {
              // id: this.activeNodeId,
              remark: data.text,
              heirId: data.userid,
              addable: this.addable,
              transferable: this.transferable,
              reversible: this.reversible
            }).then(res => {
              this.refresh()
              // this.handleDialogCancel()
            })
            break
          }
          case TYPES.BACKED: {
            this.$api.approve.backed(this.activeNodeId, { reverseNodeId: data.userid, remark: data.text }).then(res => {
              this.refresh()
              // this.handleDialogCancel()
            })
            break
          }
          case TYPES.ADD: {
            const { userid } = data
            const nodes = userid.map(t => {
              return {
                userId: t,
                addable: false,
                transferable: false,
                reversible: false
              }
            })

            this.$api.approve.add(this.activeNodeId, { nodes }).then(res => {
              this.refresh()
              // this.handleDialogCancel()
            })
            break
          }
          default:
            break
        }
      }).catch(() => {
        console.log('error')
      })
    },
    handleDialogCancel() {
      this.$refs.form.reset()
      this.dialog.visible = false
    },
    handleCommand(type) {
      this.handleDialogShow(type)
    },
    initNodes(nodes) {
      const nodesObj = {}
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        nodesObj[node.id] = node
      }
      this.nodes = nodesObj
    },
    // 获取已通过的审批节点
    initPassOptions(nodes) {
      const passUserList = []
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const { state, id, approverName } = node
        if (state === 'PASSED') {
          passUserList.push({ id, name: approverName })
        }
      }
      this.passUserList = passUserList
    },
    _getApprovalFromId(id) {
      if (!id) {
        this.$emit('update:visible', false)
        return
      }
      this.$api.approve.getApprovalFromId(id).then(res => {
        const { nodes, activeNodeId } = res
        this.activeNodeId = activeNodeId
        this.initNodes(nodes)
        this.initPassOptions(nodes)
        const { approverId, addable, transferable, reversible } = this.nodes[activeNodeId]
        this.addable = addable
        this.transferable = transferable
        this.reversible = reversible

        this.$emit('update:visible', approverId === this.userInfo.id)
      })
    },
    async _getUserList() {
      this.userList = await this.$api.user.getUserList()
    }
  }
}
</script>

<style lang="scss" scoped>
.approvalOperate {
  display: inline-block;
  margin: 0 10px;
  // line-height: 36px;
}
.approvalOperate-dropdown {
  margin-right: 10px;
  line-height: 36px;
}
.down-item {
  min-width: 80px;
}
.dialog-wrap {
  .tip {
    color: #999;
  }
}
</style>
