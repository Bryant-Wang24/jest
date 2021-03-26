<template>
  <div class="tableList">
    <el-table

      ref="moviesTable"
      :loading="tableLoading"
      :data="tableData"
      :row-key="getRowKeys"
      :max-height="height"
      @row-dblclick="openDetails"
      @selection-change="handleSelectionChange"
      @row-click="clickRow"
    >
      <el-table-column type="selection" width="55" :reserve-selection="true" :selectable="checkSelectable" />
      <el-table-column label="文件名" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="scope_span">
            <div v-if="scope.row.node.type==='FOLDER'" class="login" />
            <div class="tooltip">{{ scope.row.node.name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-for="(item,index) in tableHeader" :key="index" show-overflow-tooltip :label="item.text" :prop="item.key" :min-width="item.minWidth" />
      <el-table-column prop="operate" label="操作" min-width="220" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="'4' in scope.row.permissions"
            type="text"
            size="mini"
            @click="clickBtn(scope.row, '重命名')"
          >重命名</el-button>
          <!-- <el-button
            v-if="'10' in scope.row.permissions"
            type="text"
            size="mini"
            @click="clickBtn(scope.row, '移动')"
          >移动</el-button> -->
          <!-- <el-button
            v-if="'0' in scope.row.permissions && scope.row.node.type!=='FOLDER'"
            type="text"
            size="mini"
            @click="clickBtn(scope.row, '权限管理')"
          >权限管理</el-button> -->
          <el-button
            v-if="'3' in scope.row.permissions"
            type="text"
            size="mini"
            @click="clickBtn(scope.row, '删除')"
          >删除</el-button>
          <el-button
            v-if="'6' in scope.row.permissions && scope.row.node.type!=='FOLDER'"
            type="text"
            size="mini"
            @click="clickBtn(scope.row, '详情')"
          >详情</el-button>
          <el-button
            v-if="('8' in scope.row.permissions || '9' in scope.row.permissions) && scope.row.node.type!=='FOLDER'"
            type="text"
            size="mini"
            @click="clickBtn(scope.row, '下载')"
          >下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination-page
      style="margin-top:20px"
      :total="total"
      :to="pageSize"
      layout="prev, pager, next,sizes"
      :current-page="pageIndex"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
    <PopupPage :id="node_id" ref="popup" :title-name="titleName" :parent-id="parentId" :dialog-show="dialogShow" @get_applicationAdd="get_applicationAdd" @get_datalibDelete="get_datalibDelete" @refresh="refresh" @handleCancel="dialogShow=false" />
    <PowerPage :id="node_id" ref="power" :title-name="titleName" :power-visible="powerVisible" @handleCancel="powerVisible=false" />
  </div>
</template>
<script>
import base from '@/api/base'
import PopupPage from './popup'
import PowerPage from './power'
import PaginationPage from '@/components/Pagination/index'
export default {
  components: { PaginationPage, PopupPage, PowerPage },
  props: {
    parentId: {
      type: Number,
      default: () => {
        return 0
      }
    },
    permissions: {
      type: Object,
      default: () => {
        return {}
      }
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      base: base,
      node_id: 0,
      busy: false,
      height: document.documentElement.clientHeight - 360,
      getRowKeys(row) {
        return row.node.id
      },
      checkSelectable(row) {
        return row.node_type !== '-'
      },
      dialogShow: false,
      powerVisible: false,
      titleName: '',
      total: 0,
      pageSize: 15,
      pageIndex: 1,
      tableLoading: false,
      tableHeader: [
        // { key: 'node.name', text: '文件名', minWidth: '150' },
        { key: 'node_type', text: '文件类型', minWidth: '100' },
        { key: 'file_size', text: '文件大小', minWidth: '100' },
        { key: 'node.createBy.name', text: '创建人', minWidth: '100' },
        { key: 'node.createDate', text: '创建时间', minWidth: '160' }
      ],
      tableData: [],
      changeList: [],
      delete_id: '' // 单体删除
    }
  },
  watch: {
    parentId(val) {
      this.pageIndex = 1
      this.pageSize = 15
      if (Number(val) === 0) return false
      this.get_datalibList()
    }
  },
  created() {
    // if (Number(this.parentId) !== 0) {
    //   this.get_datalibList()
    // }
  },
  methods: {
    // 双击事件
    openDetails(val) {
      if (val.node.type === 'FOLDER') return this.$emit('openDetails', val.node)
    },

    // 单体删除
    get_datalibDelete() {
      this.dialogShow = false
      this.pageIndex = 1
      this.pageSize = 15
      this.get_datalibList()
    },
    refresh(val) {
      this.$emit('refresh', val)
    },
    // 选中的数据
    handleSelectionChange(val) {
      this.changeList = val
    },
    // 获取文件类型
    get_file_type(name) {
      if (name.includes('.')) {
        const num = name.substring(name.lastIndexOf('.') + 1)
        return num
      }
      return '-'
    },
    clickRow(row, column) {
      const { property } = column
      if (property === 'operate') { // 操作区域不做多选
        return
      }
      if (row.node.type !== 'FOLDER') {
        this.$refs.moviesTable.toggleRowSelection(row)
      }
    },
    get_permissions(arr) {
      const list = arr.split(',')
      const json = {}
      for (const i in list) {
        json[list[i]] = list[i]
      }
      return json
    },
    get_datalibList() {
      const json = {
        query: {
          parentId: this.parentId
        },
        index: this.pageIndex,
        size: this.pageSize
      }
      if (this.name !== '') {
        json.query['name'] = this.name
        json.index = 1
        json.size = 15
      }
      this.$api.content.datalibList(json).then(res => {
        if (res) {
          const arr = res.list
          for (const i in arr) {
            arr[i]['file_size'] = this.fileSize('size' in arr[i].node ? Number(arr[i].node.size) : 0)
            arr[i]['permissions'] = arr[i].permissionConfig.permissions !== '' ? this.get_permissions(arr[i].permissionConfig.permissions) : []
            arr[i]['node_type'] = this.get_file_type(arr[i].node.name)
          }
          this.tableData = arr
          // console.log(this.tableData)
          this.pageIndex = res.pageNum
          this.total = res.total
        }
      })
    },
    clickBtn(row, val) {
      // console.log(row)
      // console.log(val)
      this.node_id = row.node.id
      switch (val) {
        case '重命名':
          this.titleName = '重命名'
          this.dialogShow = true
          this.$nextTick(() => {
            this.$refs.popup.get_datalibEdit()
          })
          break
        case '移动':
          this.titleName = '移动'
          this.dialogShow = true
          this.$refs.popup.get_treeType()
          break
        case '权限管理':
          this.titleName = '权限管理'
          this.$nextTick(() => {
            this.$refs.power.get_groupConfig()
          })
          this.powerVisible = true
          break
        case '删除':
          this.$nextTick(() => {
            this.titleName = '删除'
            this.dialogShow = true
            this.delete_id = row.node.id
          })
          break
        case '详情':
          this.$nextTick(() => {
            this.titleName = '查看详情'
            this.dialogShow = true
            this.$refs.popup.get_datalibEdit()
            this.$refs.popup.get_operationLogBoth()
          })
          break
        case '下载':
          this.$refs.popup.addForm = {}
          if ('9' in this.permissions) {
            this.titleName = '下载文件'
            this.dialogShow = true
          } else {
            this.get_datalibDownload(row.node.id)
          }
          break
      }
    },
    // 不需要申请可以直接下载
    get_datalibDownload(id) {
      window.location.href =
        `http://${window.location.host}${base.hall}api/hall/rest/datalib/node/batch/download?ids=` + id
    },
    // 需要申请下载
    get_applicationAdd(val) {
      const json = {
        application: { purpose: val },
        applicationNodes: [{ id: this.node_id }]
      }
      this.$api.content.applicationAdd(json).then(res => {
        if (res) {
          this.dialogShow = false
        }
      })
    },
    handleCancel() {
      this.dialogShow = false
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.get_datalibList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.get_datalibList()
    }

  }
}
</script>
<style scoped lang="scss">
::v-deep.scope_span{
  width: 100%;
  display: flex;
}
.tableList{
  width: 100%;
  .el-table{
    display: grid;
  }

}

.login{
  width:16px;
  height: 16px;
  display: inline-table;
  margin-top: 2px;
  margin-right: 4px;
  background-size: 100% 100%;
  background : url('~@/assets/gongge_images/table_file.png') no-repeat;
}
.tooltip{
  flex: 1;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}

</style>
