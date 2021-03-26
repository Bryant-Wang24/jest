<template>
  <div class="add-branch-btn-box">
    <div class="add-branch-btn">
      <span v-if="type === 0" class="btn" @click="addType('branch')">添加条件</span>
      <el-popover
        v-else
        v-model="visible"
        placement="right-start"
        width="200"
      >
        <div class="add-node-popover-body">
          <div class="approver" @click="addType('approver')">
            <i class="el-icon-user-solid" />
            <span>审批人</span>
          </div>
        </div>
        <button slot="reference" class="plus-btn">
          <i class="el-icon-plus" />
        </button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { Branch, Condition, Approver } from '@/common/approve'
import { SET_BRANCH_IDS } from '@/common/approve'
export default {
  props: {
    type: {
      type: Number,
      default: () => {
        return null
      }
    },
    childNodeP: {
      type: Object,
      default: () => {
        return null
      }
    },
    nodeConfig: { type: Object, default: () => {} }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    addType(type) {
      this.visible = false
      let data = null
      if (type === 'branch') {
        if (!this.childNodeP || this.childNodeP.type !== 4) { // 单分支加分支 || 单分支加条件块
          if (!this.childNodeP || this.childNodeP.type === 1) { // 单分支加条件块
            const branchId = this.childNodeP?.branchId
            if (branchId) { SET_BRANCH_IDS(branchId, 'UPDATE') }
            // if (!branchId) { SET_BRANCH_IDS(null, 'DELETE', true) }
            data = new Condition('条件', 1, null, [], this.childNodeP, branchId || null)
          } else if (this.childNodeP.type === 3) { // 单分支加分支
            const branchList = [
              { 'childNode': this.childNodeP },
              { 'childNode': new Condition('条件', 2, null, [], null, null) }
            ]
            data = new Branch(null, branchList)
          }
        } else { // 多分支，加分支
          data = {
            ...this.childNodeP,
            branchList: [
              ...(this.childNodeP.branchList || []),
              { childNode: new Condition('条件', this.childNodeP.branchList.length + 1, null, [], null, null) }
            ]
          }
        }
      } else if (type === 'approver') {
        const { branchId } = this.nodeConfig
        if (branchId) { // 有branchId，标记update
          SET_BRANCH_IDS(branchId, 'UPDATE')
        }
        data = new Approver(null, null, false, false, false, [], [], false, this.childNodeP, branchId || null)
      }
      this.$emit('update:childNodeP', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-branch-btn-box {
  position: relative;
  display: inline-flex;
  width: 320px;
  z-index: 0;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 2px;
    height: 100%;
    margin: auto;
    z-index: -1;
    background-color: #CCCCCC;
  }
  .add-branch-btn {
    padding: 20px 0;
    display: flex;
    width: 320px;
    height: 88px;
    justify-content: center;
    align-items: center;
    .btn {
      display: block;
      width: 140px;
      line-height: 40px;
      text-align: center;
      color: #0045FF;
      background-color: #fff;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
      cursor: pointer;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
.add-node-popover-body {
  display: flex;
  .approver {
    display: flex;
    flex-direction: column;
    text-align: center;
    cursor: pointer;
    i {
      transform: none;
    }
  }
}
.plus-btn {
  outline: none;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
  width: 30px;
  height: 30px;
  background-color: #ABB8C2;
  border: none;
  border-radius: 50%;
  color: #fff;
  transition: all .3s cubic-bezier(.645, .045, .355, 1);
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
}
</style>
