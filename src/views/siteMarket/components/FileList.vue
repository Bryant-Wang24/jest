<template>
  <div class="FilterForm">
    <div class="paneTitle">{{ currentInfo.label }}</div>
    <el-form ref="fliterForm" :inline="true" :model="fliterForm">
      <el-form-item label="文件名: " prop="filename" style="width:370px">
        <el-input v-model="fliterForm.filename" placeholder="请输入" />
      </el-form-item>
      <el-form-item v-if="currentInfo.children && currentInfo.children.length > 1" label="文件类别: " prop="module">
        <el-select v-model="fliterForm.module" placeholder="全部">
          <WrapOption
            v-for="item in currentInfo.children"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <div>
      <el-button type="primary" @click="dialogVisible = true">上传文件</el-button>
      <template v-if="hasOperate">
        <el-button @click="deleteFiles">删除文件</el-button>
        <el-button @click="setPublicConfig(PUBLIC_VALUE.PUBLIC)">设置公开</el-button>
        <el-button @click="setPublicConfig(PUBLIC_VALUE.NO_PUBLIC)">设置不公开</el-button>
      </template>
    </div>
    <!-- 弹框 -->
    <el-dialog
      title="上传文件"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
      width="30%"
      center
    >
      <el-form ref="dialogForm" :model="dialogForm" label-width="120px" :rules="rules">
        <el-form-item label="文件类别: " prop="module">
          <el-select v-model="dialogForm.module" :disabled="currentInfo.value !== 'ALL'">
            <WrapOption
              v-for="item in typeMenusOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="二级类别: " prop="typeInModule">
          <el-select v-model="dialogForm.typeInModule" placeholder="请选择类别">
            <WrapOption
              v-for="item in typeInModuleOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="选择文件: " prop="fileIds">
          <div class="uplaod">
            <UploadImage v-if="dialogVisible" :data="data" :preview="false" :upload-url="api.uploadUrl" :delete-url="api.deleteUrl" @onProgress="onProgress" @onSuccess="onSuccess" @onRemove="onRemove" />
          </div>
        </el-form-item>

        <el-form-item label="是否公开: " prop="isPublic">
          <el-radio-group v-model="dialogForm.isPublic">
            <el-radio :label="PUBLIC_VALUE.PUBLIC">公开</el-radio>
            <el-radio :label="PUBLIC_VALUE.NO_PUBLIC">不公开</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="uploading" @click="closeDialog">取 消</el-button>
        <el-button :loading="uploading" type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>

    <transition name="el-fade-in-linear">
      <TablePager v-if="!loading" :ref="'TablePager'" :data="list" :total="page.total" :current-page="page.pageNum" @page="getPage" @selection-change="handleSelectionChange">
        <el-table-column :selectable="hasSelfOperate" type="selection" width="55" />
        <el-table-column
          v-for="item in tableHeader"
          :key="item.key"
          align="left"
          show-overflow-tooltip
          :prop="item.key"
          :label="item.text"
          :formatter="item.formatter"
          :sortable="item.sortable"
          :sort-method="item['sort-method'] || null"
        />
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="download(scope.row)">下载</el-button>
            <ConfirmButton
              v-if="hasSelfOperate(scope.row)"
              title="确定删除回传文件吗？"
              confirm-text="确定"
              cancel-text="取消"
              @onConfirm="deleteItem(scope.row)"
            >
              删除
            </ConfirmButton>
          <!-- <el-button type="text" @click="deleteItem(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </TablePager>
    </transition>
  </div>
</template>

<script>
// import UploadFile from './UploadFile'
import TablePager from '@/components/base/TablePager'
import UploadImage from '@/components/Upload/UploadImage'
import ConfirmButton from '@/components/ConfirmButton'
import fileApi from '@/api/file'
import WrapOption from '@/components/base/WrapOption'
import { hasRolePermission, isSameUser } from '@/utils/permission'

const PERMISSION = {
  own_operate: 'own_operate', // 全部可操作
  self_operate: 'self_operate' // 仅可操作本人数据
}

const SOURCE_TYPE = {
  USER_UPLOAD: '手动上传',
  SYSTEM_SYNC: '系统同步'
}

const PUBLIC_VALUE = {
  PUBLIC: 1,
  NO_PUBLIC: 0
}

export default {
  components: {
    TablePager,
    UploadImage,
    ConfirmButton,
    WrapOption
    // UploadFile
  },
  props: {
    typeMenus: {
      type: Array,
      default: () => []
    },
    typeMenusObject: {
      type: Object,
      default: () => {}
    },
    currentInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var fileIdsRequired = (rule, value, callback) => {
      if (value.length === 0) {
        return callback(new Error('请上传文件'))
      } else {
        callback()
      }
    }
    return {
      PERMISSION,
      PUBLIC_VALUE,
      api: {
        uploadUrl: fileApi.uploadFileApi,
        deleteUrl: fileApi.deleteFileApi
      },

      projectId: this.$route.query.id,
      list: [],
      tableHeader: [
        {
          key: 'filename',
          text: '文件名'
        },
        {
          key: 'module',
          text: '文件类别',
          formatter: (row, column, cellValue, index) => {
            const { module } = row
            return this.typeMenusObject?.[module]?.label || ''
          },
          sortable: true
        },
        {
          key: 'typeInModule',
          text: '二级类别',
          formatter: (row, column, cellValue, index) => {
            const { typeInModule, module } = row
            return this.typeMenusObject?.[module]?.childrenObj?.[typeInModule] || ''
          },
          sortable: true,
          'sort-method': (a, b) => {
            const Atext = this.typeMenusObject?.[a.module]?.childrenObj?.[a.typeInModule] || ''
            const Btext = this.typeMenusObject?.[b.module]?.childrenObj?.[b.typeInModule] || ''
            return Atext.localeCompare(Btext)
          }
        },
        {
          key: 'sourceType',
          text: '文件来源',
          formatter: (row, column, cellValue, index) => {
            const { sourceType } = row
            return SOURCE_TYPE[sourceType] || ''
          },
          sortable: true
        },
        {
          key: 'fileType',
          text: '文件类型',
          formatter: (row, column, cellValue, index) => {
            const { filename } = row
            const arr = filename?.split('.') || []
            return arr[arr.length - 1] || '-'
          }
        },
        {
          key: 'isPublic',
          text: '对外权限',
          formatter: (row, column, cellValue, index) => {
            const { isPublic } = row
            return isPublic ? '公开' : '不公开'
          },
          sortable: true
        },
        {
          key: 'creatorName',
          text: '创建人'
        },
        {
          key: 'createDate',
          text: '创建时间',
          sortable: true
        }
      ],
      loading: false,
      uploading: false,
      selections: [],
      fliterForm: {
        filename: null,
        module: null
      },
      page: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      dialogForm: {
        module: '',
        typeInModule: '',
        fileIds: [],
        isPublic: 1
      },
      rules: {
        module: [
          { required: true, message: '请选择文件类别', trigger: 'change' }
        ],
        typeInModule: [
          { required: true, message: '请选择文件类别', trigger: 'change' }
        ],
        fileIds: [{ required: true, validator: fileIdsRequired, trigger: 'change' }],
        isPublic: [
          { required: true, message: '请选择是否公开', trigger: 'change' }
        ]
      },
      dialogVisible: false,
      data: {
        type: 'EXHHALL_PROJECT_FILE' // 图片type
      }
    }
  },
  computed: {
    isALl() {
      return this.currentInfo.value === 'ALL'
    },
    typeMenusOptions() {
      return this.typeMenus.filter(t => t.value !== 'ALL')
    },
    typeInModuleOptions() {
      const options = this.typeMenusObject[this.dialogForm.module]?.children || []
      return options
    },
    // 权限相关， 是否拥有操作权限
    hasOperate() {
      return hasRolePermission(PERMISSION.own_operate) || hasRolePermission(PERMISSION.self_operate)
    }
  },
  watch: {
    currentInfo: {
      handler: function(currentInfo) {
        const { value } = currentInfo
        !value && (this.list = [])
        value && this.initPage()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    initPage() {
      this.initFilterFrom()
      this.initDialogFrom()
      this.getFileList()
    },
    initFilterFrom() {
      this.$refs.fliterForm.resetFields()
    },
    initDialogFrom() {
      this.dialogForm.module = this.isALl ? null : this.currentInfo.value
    },
    getFileList() {
      this.loading = true
      this.clearSelection()
      const { pageNum, pageSize } = this.page
      const { filename, module } = this.fliterForm
      const currentType = this.currentInfo.value
      const params = {
        projectId: this.projectId,
        pageNum,
        pageSize
      }

      if (currentType === 'ALL') {
        module && (params.module = module)
      } else {
        params.module = currentType
        module && (params.typeInModule = module)
      }
      filename && (params.filename = filename)
      this.$api.ProjectFile.getProjectFiles(params).then(res => {
        const { total, list } = res
        this.page.total = total
        this.list = list
      }).finally(() => { this.loading = false })
      //
    },
    handleSearch() {
      this.page.pageNum = 1
      this.getFileList()
    },
    // 重置
    handleReset() {
      this.$refs.fliterForm.resetFields()
      this.getFileList()
    },
    closeDialog() {
      this.$refs.dialogForm.resetFields()
      this.dialogVisible = false
    },
    onProgress() {
      this.uploading = true
    },
    onSuccess({ response, file, fileList }) {
      const { data } = response
      const fileId = data[0]?.fileId
      this.uploading = false

      this.dialogForm.fileIds.push(fileId)
      // 手动触发上传校验
      this.$refs.dialogForm.validateField('fileIds')
    },
    onRemove({ file, fileList }) {
      const { data } = file.response
      const fileId = data[0]?.fileId
      const fileIds = this.dialogForm.fileIds.filter(t => t !== fileId)

      this.dialogForm.fileIds = [...fileIds]
    },
    handleSelectionChange(val) {
      this.selections = val
    },
    clearSelection() {
      this.selections = []
    },
    download(row) {
      const id = row.id
      this.$api.ProjectFile.download(id)
    },
    // 批量删除按钮
    deleteFiles() {
      if (this.selections.length === 0) return this.$message.warning('请选择至少一条的数据')

      const ids = this.selections.map(t => t.id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._delete(ids)
      })
    },
    // 单一删除
    deleteItem(row) {
      const ids = [row.id]
      this._delete(ids)
    },
    _delete(ids) {
      this.$api.ProjectFile.deleteFile(ids).then(res => {
        if (res) {
          this.$message.success('操作成功')
          this.handleSearch()
        } else {
          this.$message.success('操作失败')
        }
      })
    },
    // 批量设置公开字段
    setPublicConfig(isPublic) {
      if (this.selections.length === 0) return this.$message.warning('请选择至少一条的数据')

      const ids = this.selections.map(t => t.id)
      const params = { ids, isPublic }
      this.$api.ProjectFile.update(params).then(res => {
        if (res) {
          this.$message.success('操作成功')
          this.initPage()
        } else {
          this.$message.success('操作失败')
        }
      })
    },
    onSubmit() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          const params = {
            projectId: this.projectId,
            ...this.dialogForm
          }
          this.$api.ProjectFile.uploadFile(params).then(() => {
            this.$refs.dialogForm.resetFields()
            this.dialogVisible = false
            this.initPage()
          })
        } else {
          return false
        }
      })
    },
    getPage(page) {
      const { currentPage } = page
      this.page.pageNum = currentPage
      this.getFileList()
    },
    // row是否可选可删除
    hasSelfOperate(row) {
      const { creatorId } = row

      if (!this.hasOperate) return false

      if (!hasRolePermission(PERMISSION.own_operate) && hasRolePermission(PERMISSION.self_operate) && !isSameUser(creatorId)) {
        return false
      }
      return true
    }

  }
}
</script>

<style lang="scss" scoped>
.FilterForm {
  height: 100%;
    ::v-deep {
      .el-form-item__content {
        width: 300px;
      }
      .el-button--small {
        padding: 9px 15px;
        font-size: 14px;
        border-radius: 3px;
      }
      .el-table__row{
          text-align: left;
      }
    }
  .inlineblock {
    display: inline-block;
    margin-right: 10px;
    font-size: 14px;
  }
  .paneTitle {
    margin-bottom: 20px;
    font-weight: bold;
  }
  .project {
  .uplaod {
    display: flex;
    .uplaodTitle {
      margin-left: 15px;
      color: #c4c4c4;
    }
  }
  .uplaodTitleone{
    color: #c4c4c4;
  }
}
// ::v-deep .el-input__inner {
//   width: 312px !important;
// }
}
</style>
