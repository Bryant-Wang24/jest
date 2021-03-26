<template>
  <Layout :use-head="false" :use-foot="false" :auto-height="true">

    <MainTitle :title="row.name" />

    <el-tabs v-model="activeName" class="mb-20" @tab-click="handleTabClick">
      <el-tab-pane v-for="(item,index) in tabsHeader" :key="index" :label="item.label" :name="item.name">
        <div class="btn">
          <el-button @click="addTask">添加任务</el-button>
          <el-button @click="batchSave(index)">保存修改</el-button>
          <el-button @click="batchDelete(index)">批量删除</el-button>
        </div>
        <div class="table">
          <el-form
            ref="tableForm"
            :model="item.tableForm"
          >
            <el-table
              ref="linkTable"
              v-loading="tableLoading"
              :data="item.tableForm.tableData"
              style="width: 65%"
              :header-cell-style="{color: '#333',fontWeight:'normal',fontSize: '16px',backgroundColor: '#FAFAFA'}"
              :cell-style="{color: '#000', fontSize: '14px'}"
              :header-cell-class-name="star"
              border
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                min-width="50px"
              />
              <el-table-column prop="departmentName" show-overflow-tooltip label="部门" min-width="124px" />
              <el-table-column label="工作项" min-width="472px">
                <template slot-scope="scope" class="item">
                  <el-form-item
                    :prop="`tableData.${scope.$index}.workItem`"
                    :rules="rules.workItem"
                  >
                    <el-input v-model.trim="scope.row.workItem" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="100px">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click.stop="clickBtn(scope.row, '删除',scope.$index,index)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="bottom_btn">
      <el-button @click="back">返回列表</el-button>
    </div>

  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
import MainTitle from '@/components/base/MainTitle'
import { deleteTagsView } from '@/utils/common'
export default {
  name: 'TaskDetail',
  components: { Layout, MainTitle },
  data() {
    return {
      taskDetailList: [], // 批量删除数组
      row: {}, // 任务包数据
      siteTypeList: [], // 部门数组
      activeName: '', // tabs默认值
      // tabs数据
      tabsHeader: [],
      flag: false,
      // 表格验证
      rules: {
        workItem: [{ required: true, message: '请输入工作项', trigger: 'blur' }]
      },
      tableLoading: false
    }
  },
  watch: {
    $route() {
      this.routerStyle()
    }
  },
  created() {
    this.routerStyle()
  },
  mounted() {
    this.get_taskDetail() // 获取所有明细
  },
  methods: {
    routerStyle() {
      const obj = decodeURIComponent(this.$route.query.obj)
      const { row, siteTypeList } = JSON.parse(obj)
      this.row = row
      this.siteTypeList = siteTypeList
      console.log('this.siteTypeList', row)
      // this.forDepartment()
      this.activeName = this.siteTypeList[0].value
    },
    // 批量保存
    batchSave(index) {
      this.$refs.tableForm[index].validate((valid) => {
        if (valid) {
          const newArr = this.tabsHeader[index].tableForm.tableData.map(item => {
            return item
          })
          const arr = []
          for (let i = 0; i < newArr.length; i++) {
            const { id, packageId, departmentName, workItem } = newArr[i]
            const obj = {
              id,
              packageId,
              departmentCode: this.activeName,
              departmentName,
              workItem
            }
            arr.push(obj)
            const json = {
              taskPackageDetail: arr,
              departmentCode: this.activeName,
              packageId: this.row.id
            }
            this.$api.taskBagList.batchDeleteAPI(json).then(res => {
              if (res) {
                this.$message.success('已保存')
                this.get_taskDetail()
              }
            })
          }
        }
      })
    },
    // 批量删除
    batchDelete(index) {
      if (this.taskDetailList.length > 0) {
        this.$confirm('是否删除此数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const tableData = this.tabsHeader[index].tableForm.tableData
          const taskPackageDetail = []
          const noCheckAndHasIdList = tableData.filter(item => {
            return !this.taskDetailList.includes(item) && item.id
          })
          for (let i = 0; i < noCheckAndHasIdList.length; i++) {
            const { id, packageId, departmentCode, departmentName, workItem } = noCheckAndHasIdList[i]
            const obj = {
              id,
              packageId,
              departmentCode,
              departmentName,
              workItem
            }
            taskPackageDetail.push(obj)
          }
          const json = {
            taskPackageDetail,
            departmentCode: this.activeName,
            packageId: this.row.id
          }
          this.$api.taskBagList.batchDeleteAPI(json).then(res => {
            if (res) {
              // tableData.map(item => {
              //   if (tableData.length === 1 && item.id === '') {
              //     this.$message.warning('至少填写一条数据')
              //     this.flag = true
              //   }
              // })
              this.$message.success('已删除')
              const filterData = tableData.filter(item => {
                return !this.taskDetailList.includes(item)
              })
              this.tabsHeader[index].tableForm.tableData = filterData
              if (this.tabsHeader[index].tableForm.tableData.length === 0) {
                this.tabsHeader[index].tableForm.tableData.push({
                  id: '',
                  departmentName: this.tabsHeader[index].label,
                  workItem: '',
                  createBy: '',
                  createTime: '',
                  departmentCode: this.tabsHeader[index].value,
                  packageId: this.row.id,
                  updateBy: '',
                  updateTime: ''
                })
              }
            }
          })
        })
      } else {
        this.$message.warning('请选择数据')
      }
    },
    // 选项发生改变
    handleSelectionChange(val) {
      console.log(val)
      this.taskDetailList = val
    },
    // 循环部门渲染
    forDepartment() {
      this.tabsHeader = []
      for (let i = 0; i < this.siteTypeList.length; i++) {
        const item = this.siteTypeList[i]
        this.tabsHeader.push({
          label: item.label,
          name: item.value,
          tableForm: {
            tableData: [{
              id: '',
              departmentName: item.label,
              workItem: '',
              createBy: '',
              createTime: '',
              departmentCode: item.value,
              packageId: this.row.id,
              updateBy: '',
              updateTime: ''
            }]
          }
        })
      }
    },
    // table表头红色*号
    star({ columnIndex }) {
      if (columnIndex === 2) {
        return 'star'
      }
    },
    // 获取任务明细列表
    get_taskDetail() {
      this.forDepartment()
      this.tableLoading = true
      const json = {
        packageId: this.row.id
      }
      this.$api.taskBagList.queryTaskDetail(json).then(res => {
        console.log('任务明细', res)
        this.tableLoading = false
        const { list } = res
        const obj = {}
        for (let i = 0; i < list.length; i++) {
          const { departmentCode } = list[i]
          if (!Object.prototype.hasOwnProperty.call(obj, departmentCode)) {
            obj[departmentCode] = [list[i]]
          } else {
            obj[departmentCode].push(list[i])
          }
        }
        for (const key in obj) {
          for (let i = 0; i < this.tabsHeader.length; i++) {
            if (key === this.tabsHeader[i].name) {
              this.tabsHeader[i].tableForm.tableData = [...obj[key]]
            }
          }
        }
      })
    },
    // 返回列表
    back() {
      deleteTagsView(this.$route)
      this.$router.back(-1)
    },
    // 添加任务
    addTask() {
      // console.log('this.tabsHeader', this.tabsHeader)
      for (let i = 0; i < this.tabsHeader.length; i++) {
        const item = this.tabsHeader[i]
        if (item.name === this.activeName) {
          item.tableForm.tableData.push({
            id: '',
            departmentName: item.label,
            workItem: '',
            createBy: '',
            createTime: '',
            departmentCode: item.name,
            packageId: this.row.id,
            updateBy: '',
            updateTime: ''
          })
        }
      }
    },
    // 操作按钮
    clickBtn(row, type, index, pindex) {
      var obj = JSON.stringify(row)
      var res = JSON.parse(obj)
      switch (type) {
        case '保存':
        case '删除':
          this.$confirm('是否删除此数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (res.id !== '') {
              if (this.tabsHeader[pindex].tableForm.tableData.length === 1) {
                this.tabsHeader[pindex].tableForm.tableData.splice(index, 1)
                this.$api.taskBagList.deleteTaskBagDetail(res.id).then(res => {
                  this.$message.success('已删除')
                  this.get_taskDetail()
                })
              } else {
                this.tabsHeader[pindex].tableForm.tableData.splice(index, 1)
                this.$api.taskBagList.deleteTaskBagDetail(res.id).then(res => {
                  this.$message.success('已删除')
                // this.get_taskDetail()
                })
              }
            } else {
              if (this.tabsHeader[pindex].tableForm.tableData.length === 1 && res.id === '') {
                this.$message.warning('至少填写一条数据')
              } else {
                this.tabsHeader[pindex].tableForm.tableData.splice(index, 1)
                this.$message.success('已删除')
                // this.get_taskDetail()
              }
            }
          }
          ).catch(() => {})
          break
      }
    },
    // 切换tab时清空选中
    handleTabClick() {
      for (let i = 0; i < this.tabsHeader.length; i++) {
        this.$refs.linkTable[i].clearSelection()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  margin-bottom: 20px;
}
.copyTitle {
  color: #999;
}
.copyForm {
  margin-top: 30px;
  margin-bottom: 60px;
}
::v-deep .el-dialog__footer {
    text-align: center;
  }
  .el-select {
    width: 75%;
}
::v-deep .el-form-item__label {
    margin-left: 30px;
}
.el-form-item {
    margin-top: 16.5px;
    margin-bottom: 16.5px;
}
::v-deep .el-table table th.star div:before{
  content: '*';
  color:red;
  }
::v-deep .el-table--border td, .el-table--border th {
    padding: 0 !important;
}
</style>
