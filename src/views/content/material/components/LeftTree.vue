<template>
  <div class="wrapper">
    <div class="top">
      <span class="title">文件夹</span>
      <ElButton type="text" icon="el-icon-circle-plus" @click="AddFolder">新建</ElButton>
    </div>
    <div class="menu">
      <ElTree
        :data="folderList"
        :props="defaultProps"
        accordion
        @node-click="handleNodeClick"
      >
        <div slot-scope="{ data }" :class="`customTreeNode ${currentNode.id === data.id ? 'check' : ''}`">
          <!-- <span class="icon"><i class="el-icon-folder" /></span> -->
          <span class="icon" />
          <span class="name">{{ data.name }}</span>
          <ElDropdown class="dropdown" trigger="click" @command="handleCommand($event, data)" @click.native="getChild(data)">
            <i class="el-icon-setting" />
            <ElDropdownMenu slot="dropdown">
              <ElDropdownItem :disabled="!hasPermission(PERMISSION.RENAME, currentNodeInfo)" :command="DIALOG_TYPE.RENAME.type">重命名</ElDropdownItem>
              <ElDropdownItem :disabled="!hasPermission(PERMISSION.MANAGE, currentNodeInfo)" :command="DIALOG_TYPE.PERMISSION.type">管理权限</ElDropdownItem>
              <ElDropdownItem :disabled="!hasPermission(PERMISSION.DELETE, currentNodeInfo)" :command="DIALOG_TYPE.DELETE.type">删除文件夹</ElDropdownItem>
            </ElDropdownMenu>
          </ElDropdown>
        </div>
      </ElTree>
    </div>
  </div>
</template>

<script>
import { DIALOG_TYPE, PERMISSION } from '@/common/material'
// const COMMAND = {
//   RENAME: 'RENAME',
//   PERMISSION: 'PERMISSION',
//   DELETE: 'DELETE'
// }
// const COMMAND_FUNC = {
//   RENAME: 'rename',
//   PERMISSION: 'permission',
//   DELETE: 'delete'
// }
export default {
  props: {
    folderList: {
      type: Array,
      default: () => []
    },
    currentNode: {
      type: Object,
      default: () => {}
    },
    currentNodeInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      DIALOG_TYPE,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      PERMISSION: PERMISSION
    }
  },
  methods: {
    AddFolder() {
      this.$emit('AddFolder')
    },
    handleNodeClick(data) {
      this.$emit('nodeClick', data)
    },
    getChild() {
      console.log('getChild')
    },
    hasPermission(type, currentNodeInfo) {
      const { permissions } = currentNodeInfo

      let is = false
      switch (type) {
        case PERMISSION.RENAME: {
          is = permissions?.includes(PERMISSION.RENAME)
          break
        }
        case PERMISSION.MANAGE: {
          is = permissions?.includes(PERMISSION.MANAGE)
          break
        }
        case PERMISSION.DELETE: {
          is = permissions?.includes(PERMISSION.DELETE)
          break
        }
        case PERMISSION.VIEW: {
          is = permissions?.includes(PERMISSION.VIEW)
          break
        }
        case PERMISSION.DIRECTLY_DOWNLOAD: {
          is = permissions?.includes(PERMISSION.DIRECTLY_DOWNLOAD)
          break
        }
        case PERMISSION.APPLY_TO_DOWNLOAD: {
          is = permissions?.includes(PERMISSION.APPLY_TO_DOWNLOAD)
          break
        }

        default:
          break
      }

      return is
    },
    handleCommand(v, data) {
      switch (v) {
        case DIALOG_TYPE.RENAME.type: {
          this.$emit('Rename')
          break
        }
        case DIALOG_TYPE.PERMISSION.type: {
          this.$emit('Permission')
          break
        }
        case DIALOG_TYPE.DELETE.type: {
          this.$emit('DeleteFolder')
          break
        }

        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
.wrapper {
  padding: 20px;
  background-color: #fff;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 16px;
    }
  }
  .menu {
    // padding-right: 20px;
    margin-top: 10px;
    ::v-deep.is-current {
      > .el-tree-node__content {
        background-color: #F5F7FA;
      }
    }
    .customTreeNode {
      display: flex;
      flex: 1;
      font-size: 14px;
      overflow: hidden;
      .icon {
        display: inline-block;
        vertical-align: top;
        width: 20px;
        height: 16px;
        background: url('~@/assets/gongge_images/file_no.png') no-repeat;
        margin-right: 6px;
      }
      .name {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .dropdown {
        // float: right;
        // right: 6px;
      //   position: absolute;
      //   right: -20px;
      }
    }
    .check {
      color: $--custom--color--primary;
      .icon {
        background: url('~@/assets/gongge_images/file_ok.png') no-repeat;
      }
      // background-color: #F5F7FA;
    }
    ::v-deep.el-tree-node__content {
      height: 30px;
    }
  }
}
</style>
