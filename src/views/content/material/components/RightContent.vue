<template>
  <div class="wrapper">
    <div class="title mb-20">{{ currentNode.name || '' }}</div>

    <div class="filterForm mb-20">
      <label class="label">文件名称：</label>
      <ElInput v-model="filterForm.name" class="input" placeholder="请输入" />
      <ElButton @click="search">查 询</ElButton>
      <ElButton @click="reset">重 置</ElButton>
    </div>

    <div class="control mb-20">
      <div class="left">
        <!-- <ElButton type="primary">上 传</ElButton> -->
        <UploadImage
          class="upload"
          :disabled="!hasUploadPermission"
          :upload-url="`a/api/ossfile/upload`"
          :multiple="true"
          :button-text="'上 传'"
          :button-size="'medium'"
          :list.sync="fileList"
          :data="data"
          :show-file-list="false"
          :show-progress-float="true"
          :message-success-text="''"
          @onSuccess="onSuccess"
          @onDone="onDone"
        />
        <ElButton :disabled="!hasCreateFolderPermission" @click="AddFolder">新 建</ElButton>
        <ElButton :disabled="!hasDirectlyDownloadPermission" @click="MultipleDownload">下 载</ElButton>
        <ElButton :disabled="!hasDeletePermission" @click="MultipleDelete">批量删除</ElButton>
      </div>

      <div class="right">
        <ElRadioGroup v-model="listStyle">
          <ElRadioButton :label="LIST_STYLE['BLOCK']"><i class="el-icon-menu" /></ElRadioButton>
          <ElRadioButton :label="LIST_STYLE['LIST']"><i class="el-icon-s-operation" /></ElRadioButton>
        </ElRadioGroup>
      </div>
    </div>

    <div ref="content" class="content">
      <div v-if="listStyle === LIST_STYLE['BLOCK']" class="multiple mb-20">
        <ElCheckbox v-model="checkBox.checked" :indeterminate="isIndeterminate" @change="checkAll">全选</ElCheckbox>
        <span class="num">已选择 {{ checkTotal }} 项内容</span>
        <ElButton type="text" @click="cancelCheck">取消选择</ElButton>
      </div>

      <div class="list mb-20">
        <StyleList
          ref="StyleList"
          :folders="folders"
          :files="files"
          :list-style="listStyle"
          @listCheckBoxChange="listCheckBoxChange"
          @download="download"
          @Rename="Rename"
          @Permission="Permission"
          @DeleteFolder="DeleteFolder"
          @View="View"
          @nodeClick="nodeClick"
        />
      </div>

      <PaginationPage
        :total="page.total"
        :to="page.size"
        :current-page="page.index"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>

  </div>
</template>

<script>
import NP from 'number-precision'
import StyleList from './StyleList'
import UploadImage from '@/components/Upload/UploadImage'
import PaginationPage from '@/components/Pagination/index'
import { TYPE, LIST_STYLE, DOWNLOAD_TYPE, PERMISSION } from '@/common/material'
import { bytesToSize, getFileType } from '@/utils/common'

export default {
  components: { StyleList, PaginationPage, UploadImage },
  props: {
    page: {
      type: Object,
      default: () => {}
    },
    currentNode: {
      type: Object,
      default: () => {}
    },
    currentEditNode: {
      type: Object,
      default: () => {}
    },
    currentNodeInfo: {
      type: Object,
      default: () => {}
    },
    folderChildrens: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      LIST_STYLE,
      // PROGRESS,
      filterForm: {
        name: null
      },
      listStyle: LIST_STYLE.BLOCK,
      checkBox: {
        checked: false
      },
      folders: [],
      files: [],
      data: {
        type: 'EXHHALL_DATA_LIB_NODE'
      },
      fileList: [],
      uploadProgressVisible: false,
      pendingObject: {}
    }
  },
  computed: {
    isIndeterminate() {
      const checkList = this.files.filter(t => t.checked)
      return checkList.length > 0 && checkList.length !== this.files.length
    },
    checkTotal() {
      return this.files.filter(t => t.checked).length || 0
    },
    multipleCheckedList() {
      return this.files.filter(t => t.checked)
    },
    hasCreateFolderPermission() {
      const { permissions } = this.currentNodeInfo
      return permissions?.includes(PERMISSION.CREATE_FOLDER)
    },
    hasDirectlyDownloadPermission() {
      const { permissions } = this.currentNodeInfo
      return permissions?.includes(PERMISSION.DIRECTLY_DOWNLOAD) || permissions?.includes(PERMISSION.APPLY_TO_DOWNLOAD)
    },
    hasUploadPermission() {
      const { permissions } = this.currentNodeInfo
      return permissions?.includes(PERMISSION.UPLOAD)
    },
    hasDeletePermission() {
      const { permissions } = this.currentNodeInfo
      return permissions?.includes(PERMISSION.DELETE)
    }
  },
  watch: {
    folderChildrens: {
      handler() {
        this.folders = this.folderChildrens.filter(t => t.node.type === TYPE.FOLDER)
        const files = []
        for (let i = 0; i < this.folderChildrens.length; i++) {
          const item = this.folderChildrens[i]
          const { node } = item
          if (node.type === TYPE.FILE) {
            node['nodeType'] = getFileType(node.name)
            files.push({ ...item, node, checked: false })
          }
        }
        this.files = files
      },
      immediate: true
    }
  },
  methods: {
    nodeClick(node) {
      this.$emit('nodeClick', node)
    },
    AddFolder() {
      const parentId = this.currentNode.id

      if (parentId) {
        this.$emit('AddFolder', { parentId })
      }
    },

    Rename(node) {
      this.$emit('Rename', node)
    },
    Permission(node) {
      this.$emit('Permission', node)
    },
    DeleteFolder(node) {
      this.$emit('DeleteFolder', node)
    },
    View(node) {
      this.$emit('View', node)
    },
    checkAll(isChecked) {
      this.files = this.files.map(t => {
        return { ...t, checked: isChecked }
      })
    },
    cancelCheck() {
      this.files = this.files.map(t => {
        return { ...t, checked: false }
      })
      this.checkBox.checked = false
    },
    download(fileItem) {
      const { node, permissionConfig } = fileItem
      const { id: ids } = node
      const { permissions = [] } = permissionConfig
      const _permissions = permissions.split(',') || []

      this.$emit('download', { type: DOWNLOAD_TYPE.SINGLE, ids, permissions: _permissions, node })
    },
    MultipleDownload() {
      const hasItemChecked = this.multipleCheckedList.length > 0

      if (!hasItemChecked) {
        this.$message.warning('请选择要下载的数据')
        return
      }
      const ids = this.multipleCheckedList.map(t => t.node.id)?.join(',') || ''
      const { permissions } = this.currentNodeInfo
      const _permissions = permissions.split(',') || []

      this.$emit('download', { type: DOWNLOAD_TYPE.MULTIPLE, ids, permissions: _permissions })
    },
    MultipleDelete() {
      const hasItemChecked = this.multipleCheckedList.length > 0

      if (!hasItemChecked) {
        this.$message.warning('请选择要删除的数据')
        return
      }
      const ids = this.multipleCheckedList.map(t => t.node.id)
      this.$emit('DeleteMultipleFiles', ids)
    },
    listCheckBoxChange() {
    },
    onSuccess(response, file, fileList) {
      console.log('onSuccess', response)
    },
    onDone(responeses) {
      const parentId = this.currentNode.id
      const idNodes = responeses.map(t => {
        const id = t?.response?.data[0].fileId
        const size = t.size
        return { id, type: 'FILE', size }
      })
      const params = {
        parentId,
        permissionConfigCopyParam: null,
        idNodes: idNodes
      }
      // console.log('onDone', params)
      this.$emit('upload', params)
    },
    search() {
      this.$emit('search', { ...this.filterForm })
    },
    reset() {
      this.filterForm.name = null
      this.$emit('reset')
    },
    handleCurrentChange(val) {
      const page = {
        index: val,
        size: this.page.size
      }
      this.$emit('handleCurrentChange', { ...page, ...this.filterForm })
    },
    uploadingSize(file) {
      const { percentage, progressStatus, size } = file
      if (progressStatus === 'success') {
        return `${bytesToSize(size)} / ${bytesToSize(size)}`
      } else {
        return `${bytesToSize(NP.times(NP.divide(percentage, 100), size))} / ${bytesToSize(size)}`
      }
    },
    bytesToSize(bytes) {
      return bytesToSize(bytes)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
  .title {
    font-size: 18px;
  }
  .filterForm {
    display: flex;
    .label {
      line-height: 36px;
      font-size: 14px;
      color: #606266;
    }
    .input{
      width: 240px;
      margin-right: 20px;
    }
  }
  .control {
    display: flex;
    justify-content: space-between;
    .left {
      .upload {
        margin-right: 10px;
        display: inline-block;
      }
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    .list {
      flex: 1;
      overflow: auto;
    }
    .multiple {
      padding: 0 10px;
      background-color: #fafafa;
      font-size: 14px;
      .num {
        margin: 0 10px;
      }
    }
  }
}
</style>
