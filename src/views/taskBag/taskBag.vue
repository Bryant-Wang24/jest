<template>
  <Layout :use-head="true" :use-foot="false" :auto-height="true">
    <!-- 搜索组件 -->
    <FilterForm slot="head" :search-keys="filterProp.searchKeys" :filter-keys="filterProp.filterKeys" @search="submitForm" @reset="handleReset" />
    <!-- </div> -->
    <MainTitle title="任务包配置" />
    <div class="mb-20">
      <el-button type="primary" @click="addBtn">添加任务包</el-button>
    </div>
    <!-- 表格组件 -->
    <TablePager
      ref="TablePager"
      v-loading="tableLoading"
      :data="tableData"
      :total="page.total"
      :to="page.pageSize"
      :current-page="page.pageNum"
      @page="handleCurrentChange"
    >
      <el-table-column
        v-for="item in tableHeader"
        :key="item.key"
        align="left"
        show-overflow-tooltip
        :prop="item.key"
        :label="item.label"
        reserve-selection
        :formatter="item.formatter"
      />
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="text" @click="clickBtn(scope.row,'VIEW')">查看</el-button>
          <el-button type="text" @click="clickBtn(scope.row,'EDIT')">编辑</el-button>
          <el-button type="text" @click="clickBtn(scope.row,'DETAIL')">任务明细</el-button>
          <el-button type="text" @click="clickBtn(scope.row,'DELETE')">删除</el-button>
        </template>
      </el-table-column>
    </TablePager>
    <!-- 弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
      @close="resetFields"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :disabled="dialogTitle==='查看任务包'"
      >
        <el-form-item label="适用部门 :" prop="departmentCode">
          <el-select v-model="ruleForm.departmentCode" placeholder="请选择">
            <WrapOption v-for="(item,index) in siteTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务包名称 :" prop="name">
          <el-input v-model.trim="ruleForm.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="是否启用 :">
          <el-radio-group v-model="ruleForm.enable">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注 :">
          <el-input v-model="ruleForm.remark" type="textarea" placeholder="(选填)" />
        </el-form-item>
      </el-form>
      <div v-if="dialogTitle === '查看任务包'" slot="footer" class="dialog-footer text-center">
        <el-button @click="closeSite">返 回</el-button>
      </div>
      <div v-else slot="footer" class="dialog-footer text-center">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="call">取 消</el-button>
      </div>
    </el-dialog>
  </Layout>
</template>

<script>
import TablePager from '@/components/base/TablePager'
import Layout from '@/components/base/Layout'
// 搜索组件
import FilterForm from '@/components/FilterForm/FilterForm2'
// 表格组件
// import TablePage from '@/components/table/table'
// 分页组件
// import PaginationPage from '@/components/Pagination/index'
import MainTitle from '@/components/base/MainTitle'
import WrapOption from '@/components/base/WrapOption'
export default {
  name: 'TaskBag',
  components: { FilterForm,
  // TablePage,
  // PaginationPage,
    MainTitle, WrapOption, TablePager, Layout },
  data() {
    return {
      // 列表表格加载状态
      tableLoading: false,
      page: {
        // 当前页
        pageNum: 1,
        // 每页返回的数量
        pageSize: 10,
        // 总条目数
        total: 0
      },
      // 弹窗form表单数据
      ruleForm: {
        id: '',
        name: '',
        departmentCode: '',
        remark: '',
        enable: ''
      },
      // 弹窗form表单数据验证
      rules: {
        name: [{ required: true, message: '请输入任务包名称', trigger: 'blur' }],
        departmentCode: [{ required: true, message: '请选择适用部门', trigger: 'change' }]
      },
      // 弹窗转态
      dialogVisible: false,
      // 弹窗title
      dialogTitle: '',
      // 表格数据
      tableData: [],
      // 表格头部数据
      tableHeader: [
        { label: '任务包编号', key: 'code', width: '190px' },
        { label: '任务包名称', key: 'name' },
        { label: '部门', key: 'departmentName' },
        { label: '是否启用', key: 'enable' },
        { label: '备注', key: 'remark' },
        { label: '创建人', key: 'createBy.name' },
        { label: '创建时间', key: 'createDate', width: '200px' }
      ],
      // 筛选匹配数据1
      enabledList: [
        {
          value: 0,
          label: '是'
        },
        {
          value: 1,
          label: '否'
        }
      ],
      // 筛选匹配数据2
      siteTypeList: [],
      filterParams: {}
    }
  },
  computed: {
    filterProp() {
      return {
        searchKeys: [
          { value: 'name', label: '任务包名称' },
          { value: 'createBy', label: '创建人' }
        ],
        filterKeys: [
          { value: 'departmentCode', label: '部门', children: this.siteTypeList },
          { value: 'enable', label: '是否启用', children: this.enabledList }
        ]
      }
    }
  },
  created() {
    // 获取任务包列表
    this.get_taskBagList()
    this.get_department()
  },
  methods: {
    // 弹窗返回
    closeSite() {
      this.dialogVisible = false
    },
    // 获取部门
    get_department() {
      this.$api.taskBagList.getDepartment().then(res => {
        for (let i = 0; i < res.length; i++) {
          const { code, name } = res[i]
          const obj = {
            label: name,
            value: code
          }
          this.siteTypeList.push(obj)
        }
      })
    },
    // 获取任务包列表
    get_taskBagList() {
      // this.tableLoading = true
      const json = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        ...this.filterParams
      }
      this.$api.taskBagList.getTaskBag(json).then(res => {
        console.log('列表数据', res)
        if (res) {
          this.tableLoading = false
          this.tableData = res.list
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].enable = this.tableData[i].enable === 0 ? '是' : '否'
          }
          this.page.pageNum = res.pageNum
          // this.pageSize = res.pageSize
          this.page.total = res.total
        }
      })
    },
    // 点击页码
    handleCurrentChange({ currentPage }) {
      this.page.pageNum = currentPage
      this.get_taskBagList()
    },
    // 关闭弹框的回调,清空验证
    resetFields() {
      this.$refs.ruleForm.resetFields()
    },
    // 弹窗取消按钮
    call() {
      this.dialogVisible = false
    },
    // 弹窗确定按钮
    confirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.ruleForm.id === '' ? this.addTaskBag() : this.compileBag()
        }
      })
    },
    // 查询按钮
    submitForm(form) {
      this.filterParams = {}
      const { searchKey, searchValue, filterKey, filterValue } = form
      searchKey ? this.filterParams[searchKey] = searchValue : null
      filterKey ? this.filterParams[filterKey] = filterValue : null
      this.page.pageNum = 1
      this.page.pageSize = 10
      this.get_taskBagList()
    },
    // 重置按钮
    handleReset() {
      // this.list.search.value = ''
      // this.list.fuzzyName.value = ''
      // this.list.screen.value = ''
      // this.list.isType.value = ''
      this.filterParams = {}
      this.page.pageNum = 1
      this.page.pageSize = 10
      this.get_taskBagList()
    },
    // 点击添加按钮改变弹窗
    addBtn() {
      this.dialogVisible = true
      this.dialogTitle = '添加任务包'
      this.ruleForm = {
        enable: 0,
        id: ''
      }
    },
    // 添加事件
    addTaskBag() {
      const json = {
        name: this.ruleForm.name,
        departmentCode: this.ruleForm.departmentCode,
        remark: this.ruleForm.remark,
        enable: this.ruleForm.enable
      }
      this.$api.taskBagList.addTaskBag(json).then(res => {
        if (res) {
          this.$message.success('添加成功!')
          this.dialogVisible = false
          this.get_taskBagList()
        }
      })
    },
    // 表格操作按钮
    clickBtn(row, type) {
      var obj = JSON.stringify(row)
      var res = JSON.parse(obj)
      if (res.enable === '是') {
        res.enable = 0
      } else {
        res.enable = 1
      }
      switch (type) {
        case 'VIEW':
          this.dialogTitle = '查看任务包'
          this.dialogVisible = true
          this.ruleForm = res
          break
        case 'EDIT':
          this.dialogTitle = '编辑任务包'
          this.dialogVisible = true
          this.ruleForm = res
          break
        case 'DETAIL':
          this.taskDetail(res)
          break
        case 'DELETE':
          this.$confirm('是否继续此操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteBag(res.id)
          }
          ).catch(() => {
            this.$message({
              showClose: true,
              type: 'info',
              message: '已取消'
            })
          })
          break
      }
    },
    // 编辑事件
    compileBag() {
      const id = this.ruleForm.id
      const json = {
        name: this.ruleForm.name,
        departmentCode: this.ruleForm.departmentCode,
        remark: this.ruleForm.remark,
        enable: this.ruleForm.enable
      }
      this.$api.taskBagList.compileTaskBag(id, json).then(res => {
        this.$message({
          showClose: true,
          message: '编辑成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.get_taskBagList()
      })
    },
    // 任务明细
    taskDetail(row) {
      const json = {
        row,
        siteTypeList: this.siteTypeList
      }
      const obj = JSON.stringify(json)
      this.$router.push({
        name: 'taskDetail',
        query: {
          obj: encodeURIComponent(obj)
        }
      })
    },
    // 删除
    deleteBag(id) {
      this.$api.taskBagList.deletetaskBag(id).then(res => {
        if (res) {
          this.tableData.length === 1 && this.page.pageNum !== 1
            ? this.page.pageNum--
            : ''
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.get_taskBagList()
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
