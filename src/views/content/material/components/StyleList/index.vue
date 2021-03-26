<template>
  <div>

    <div v-show="listStyle === LIST_STYLE['BLOCK']" class="block">
      <div v-if="isEmpty" class="empty">暂无数据</div>
      <div class="folders">
        <div v-for="item in folders" :key="item.node.id" class="box">
          <ElDropdown class="dropdown" trigger="click" @command="handleCommand($event, item.node)">
            <i class="el-icon-more" />
            <ElDropdownMenu slot="dropdown">
              <ElDropdownItem :disabled="!hasPermission(PERMISSION.RENAME,item)" :command="DIALOG_TYPE.RENAME.type">重命名</ElDropdownItem>
              <ElDropdownItem :disabled="!hasPermission(PERMISSION.MANAGE,item)" :command="DIALOG_TYPE.PERMISSION.type">管理权限</ElDropdownItem>
              <ElDropdownItem :disabled="!hasPermission(PERMISSION.DELETE,item)" :command="DIALOG_TYPE.DELETE.type">删除文件夹</ElDropdownItem>
            </ElDropdownMenu>
          </ElDropdown>
          <div class="image" @dblclick="openChildrenFolder(item.node)">
            <img :src="images.folderImage" alt="">
          </div>
          <span class="name">{{ item.node.name }}</span>
        </div>
      </div>

      <div class="files">
        <div v-for="item in files" :key="item.node.id" class="box">
          <ElCheckbox v-model="item.checked" class="checkbox" @change="checkboxChange($event, item.node.id)" />
          <i
            v-show="hasPermission(PERMISSION.DIRECTLY_DOWNLOAD, item) || hasPermission(PERMISSION.APPLY_TO_DOWNLOAD, item)"
            class="el-icon-download download"
            @click="download(item)"
          />
          <ElDropdown class="dropdown" trigger="click" @command="handleCommand($event, item.node)">
            <i class="el-icon-more" />
            <ElDropdownMenu slot="dropdown">
              <ElDropdownItem :disabled="!hasPermission(PERMISSION.VIEW,item)" :command="DIALOG_TYPE.VIEW.type">查看详情</ElDropdownItem>
              <ElDropdownItem :disabled="!hasPermission(PERMISSION.RENAME,item)" :command="DIALOG_TYPE.RENAME.type">重命名</ElDropdownItem>
              <ElDropdownItem :disabled="!hasPermission(PERMISSION.DELETE,item)" :command="DIALOG_TYPE.DELETE.type">删除素材</ElDropdownItem>
            </ElDropdownMenu>
          </ElDropdown>
          <div class="image">
            <img :class="isPicture(item.node.nodeType) ? 'pic' : 'icon'" :src="image(item.node.nodeType, item.resLink)" alt="">
          </div>
          <span class="name">{{ item.node.name }}</span>
        </div>
      </div>
    </div>

    <div v-show="listStyle === LIST_STYLE['LIST']" class="list">
      <TablePager
        ref="multipleTable"

        :is-pagination="false"
        :data="FoldersAndFiles"
        @selection-change="handleSelectionChange"
      >
        <el-table-column :resizable="false" type="selection" :selectable="selectable" width="55" />
        <el-table-column label="文件名" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="row">
              <div v-if="scope.row.node.type==='FOLDER'" class="fileIcon" />
              <span class="name">{{ scope.row.node.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="item in tableHeader"
          :key="item.key"
          align="left"
          show-overflow-tooltip
          :resizable="false"
          :prop="item.key"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column prop="operate" label="操作" width="220" fixed="right">
          <template slot-scope="scope">
            <ElButton :disabled="!hasPermission(PERMISSION.RENAME, scope.row)" type="text" @click="handleCommand(DIALOG_TYPE.RENAME.type, scope.row.node)">重命名</ElButton>
            <ElButton :disabled="!hasPermission(PERMISSION.DELETE, scope.row)" type="text" @click="handleCommand(DIALOG_TYPE.DELETE.type, scope.row.node)">删除</ElButton>
            <ElButton v-if="isFile(scope.row.node.type)" :disabled="!hasPermission(PERMISSION.VIEW, scope.row)" type="text" @click="handleCommand(DIALOG_TYPE.VIEW.type, scope.row.node)">详情</ElButton>
            <ElButton v-if="isFile(scope.row.node.type)" :disabled="!(hasPermission(PERMISSION.DIRECTLY_DOWNLOAD, scope.row) || hasPermission(PERMISSION.APPLY_TO_DOWNLOAD, scope.row))" type="text" @click="download(scope.row)">下载</ElButton>
          </template>
        </el-table-column>
      </TablePager>
    </div>
  </div>
</template>

<script>
import TablePager from '@/components/base/TablePager.vue'
import { LIST_STYLE, DIALOG_TYPE, PERMISSION, getImage, images, pictureType, TYPE } from '@/common/material'
import { bytesToSize } from '@/utils/common'

export default {
  components: { TablePager },
  props: {
    folders: {
      type: Array,
      default: () => []
    },
    files: {
      type: Array,
      default: () => []
    },
    listStyle: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      TYPE,
      PERMISSION,
      LIST_STYLE,
      DIALOG_TYPE,
      pictureType,
      images,
      checkList: [],
      tableHeader: [
        // { label: '文件名', key: 'node.name' },
        { label: '文件类型', key: 'node.nodeType',
          formatter: (row) => {
            const { node } = row
            const { nodeType } = node
            return nodeType || '-'
          }
        },
        { label: '文件大小', key: 'node.size',
          formatter: (row) => {
            const { node } = row
            const { size } = node
            return size ? bytesToSize(size) : '-'
          }
        },
        { label: '创建人', key: 'node.createBy',
          formatter: (row) => {
            const { node } = row
            const { createBy } = node
            return createBy.name || '-'
          }
        },
        { label: '创建时间', key: 'node.createDate' }
      ]
    }
  },
  computed: {
    isEmpty() {
      return this.FoldersAndFiles.length === 0
    },
    FoldersAndFiles() {
      return [...this.folders, ...this.files]
    }
  },
  methods: {
    hasPermission(type, item) {
      const { permissionConfig } = item
      const { permissions } = permissionConfig
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
    selectable(row) {
      const { node } = row
      const { type } = node
      return type === TYPE.FILE
    },
    handleSelectionChange(multipleSelection) {
      // if(multipleSelection) {

      // }
      const checkedIds = multipleSelection.map(t => t.node.id)

      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i]
        const { node } = file
        if (checkedIds.includes(node.id)) {
          this.files[i].checked = true
        } else {
          this.files[i].checked = false
        }
      }
    },
    openChildrenFolder(node) {
      console.log(node)
      this.$emit('nodeClick', { ...node })
    },
    handleCommand(v, node) {
      switch (v) {
        case DIALOG_TYPE.RENAME.type: {
          this.$emit('Rename', node)
          break
        }
        case DIALOG_TYPE.PERMISSION.type: {
          this.$emit('Permission', node)
          break
        }
        case DIALOG_TYPE.DELETE.type: {
          this.$emit('DeleteFolder', node)
          break
        }
        case DIALOG_TYPE.VIEW.type: {
          this.$emit('View', node)
          break
        }

        default:
          break
      }
    },
    checkboxChange() {
      // this.$emit('listCheckBoxChange')
    },
    download(fileItem) {
      // const { node, permissionConfig } = fileItem
      // const { id } = node
      this.$emit('download', fileItem)
      // window.location.href = `http://${window.location.host}${base.hall}api/hall/rest/datalib/node/batch/download?ids=` + id
    },
    isPicture(nodeType) {
      return pictureType?.includes(nodeType)
    },
    image(nodeType, url) {
      return getImage(nodeType, url)
      // if (pictureType.includes(nodeType)) {
      //   return EncodeURIFilter(url)
      // }
      // return images[nodeType] || images['unknown']
    },
    isFile(type) {
      return type === TYPE['FILE']
    }
  }
}
</script>

<style lang="scss" scoped>

.row {
  display: flex;
  // align-items: center;
  .fileIcon {
    margin-top: 2px;
    margin-right: 6px;
    width:16px;
    height: 16px;
    background-size: 100% 100%;
    background : url('~@/assets/gongge_images/table_file.png') no-repeat;
  }
}

.empty {
  color: #909399;
  text-align: center;
}
.block {
  .folders,.files {
    display: flex;
    flex-wrap: wrap;
    .box {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      width: 200px;
      height: 160px;
      margin-right: 20px;
      margin-bottom: 20px;
      border: 1px solid #DCDFE6;
      .image {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 26px;
        width: 100%;
        height: calc(100% - 62px);
        user-select:none;
        .icon {
          width: 80px;
          height: 80px;
        }
        .pic {
          max-width: 100%;
          max-height: 100%;
        }
      }
      .dropdown {
        position: absolute;
        top: 6px;
        right: 10px;
        cursor: pointer;
      }
      .download {
        position: absolute;
        top: 6px;
        right: 32px;
        cursor: pointer;
      }
      .name {
        width: 100%;
        padding: 0 10px;
        text-align: center;
        height: 36px;
        line-height: 36px;
        box-sizing: border-box;
        font-size: 14px;
        color: #606266;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .files {
    .checkbox {
      position: absolute;
      top: 6px;
      left: 10px;
    }
  }
}

.list {
  padding-right: 20px;
  .name {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
