<template>
  <Layout :use-head="true" :use-foot="false" :auto-height="true">
    <div slot="head">
      <FilterForm :search-keys="filterProp.searchKeys" :filter-keys="filterProp.filterKeys" @search="submitForm" @reset="handleReset" />
    </div>
    <MainTitle title="价目表" />
    <div>
      <el-button type="primary" @click="addPriceList">添加价目表</el-button>
    </div>
    <TablePager
      ref="TablePager"
      :data="tableData"
      :total="total"
      :to="pageSize"
      :current-page="pageNum"
      @page="handleCurrentChange"
    >
      <el-table-column
        v-for="item in tableHeader"
        :key="item.key"
        align="left"
        show-overflow-tooltip
        :prop="item.key"
        :label="item.label"
        :formatter="item.formatter"
      />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="clickBtn(scope.row, '查看')"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            @click="clickBtn(scope.row, '编辑')"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            @click="clickBtn(scope.row, '价目表明细')"
          >价目表明细</el-button>
          <el-button
            size="mini"
            type="text"
            @click="clickBtn(scope.row, '删除')"
          >删除</el-button>
        </template>
      </el-table-column>
    </TablePager>
    <DialogPage
      :dialog-show="dialogShow"
      width="600px"
      :title="dialogTitle"
      @handleCancel="handleCancel"
    >
      <div>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          :readonly="true"
        >
          <el-form-item v-if="dialogTitle!=='添加价目表'" label="价目表编号：">
            <el-input v-model="ruleForm.code" :disabled="fromReadonly()" :readonly="true" />
          </el-form-item>
          <el-form-item label="价目表名称：" prop="name">
            <el-input v-model.trim="ruleForm.name" :disabled="fromReadonly()" />
          </el-form-item>
          <el-form-item label="是否启用：">
            <el-radio-group
              v-model="ruleForm.enabled"
              :disabled="fromReadonly()"
            >
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              v-model="ruleForm.remark"
              type="textarea"
              :disabled="fromReadonly()"
            />
          </el-form-item>
          <el-form-item v-if="dialogTitle === '查看价目表'" label="创建人：">
            {{ ruleForm.createBy!==null?ruleForm.createBy.name:'-' }}
          </el-form-item>
          <el-form-item v-if="dialogTitle === '查看价目表'" label="创建时间：">
            {{ ruleForm.createDate }}
          </el-form-item>
        </el-form>
        <div class="footBtn">
          <el-button
            v-if="dialogTitle != '查看价目表'"
            type="primary"
            :loading="btnLoading"
            @click="onSubmit"
          >确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
        <!-- <div v-else class="footBtn">
          <el-button @click="handleCancel">取消</el-button>
        </div> -->
      </div>
    </DialogPage>

  </Layout>
</template>
<script>
import Layout from '@/components/base/Layout'
import TablePager from '@/components/base/TablePager'
import FilterForm from '@/components/FilterForm/FilterForm2'
import DialogPage from '@/components/dialog/dialog'
import pageMixin from '@/views/mixins/page'
import MainTitle from '@/components/base/MainTitle'
export default {
  name: 'PriceList',
  components: {
    Layout,
    TablePager,
    FilterForm,
    DialogPage,
    MainTitle
  },
  mixins: [pageMixin],
  data() {
    return {
      enabled: '',
      fuzzyName: '',
      fuzzyCode: '',
      pageSize: 10,
      tableLoading: false,
      pageNum: 1,
      total: 0,
      btnLoading: false, // 表单防刷
      enabledList: [
        {
          value: 'true',
          label: '是'
        },
        {
          value: 'false',
          label: '否'
        }
      ],
      tableData: [],
      tableHeader: [
        { key: 'code', label: '价目表编号' },
        { key: 'name', label: '价目表名称' },
        { key: 'enableds', label: '是否启用' },
        { key: 'remark', label: '备注' },
        { key: 'createBy.name', label: '创建人' },
        { key: 'createDate', label: '创建时间' }
      ],
      dialogShow: false, // 弹窗开启关闭
      dialogTitle: '', // 弹窗标题
      ruleForm: {
        name: '',
        enabled: true,
        remark: '',
        code: ''
      },
      // 表单校验
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      filterParams: {}
    }
  },
  computed: {
    filterProp() {
      return {
        searchKeys: [
          { value: 'fuzzyCode', label: '价目表编号' },
          { value: 'fuzzyName', label: '价目表名称' }
        ],
        filterKeys: [
          { value: 'enabled', label: '是否启用', children: this.enabledList }
        ]
      }
    }
  },
  created() {
    this.get_priceList()
  },
  methods: {
    handleCancel() {
      this.dialogShow = false
      this.btnLoading = false
      this.ruleForm = {
        createBy: {
          name: ''
        }
      }
      this.$refs.ruleForm.resetFields()
    },
    // 重置
    handleReset() {
      this.pageNum = 1
      this.filterParams = {}
      this.get_priceList()
      // 清除筛选，重新请求数据
    },
    // 搜索
    submitForm(form) {
      this.pageNum = 1
      this.filterParams = {}
      const { searchKey, searchValue, filterKey, filterValue } = form
      searchKey ? this.filterParams[searchKey] = searchValue : null
      filterKey ? this.filterParams[filterKey] = filterValue : null
      this.get_priceList()
    },
    //
    fromReadonly() {
      return this.dialogTitle === '查看价目表'
    },
    // 价目表表格数据
    get_priceList() {
      this.tableLoading = true
      const json = {
        ...this.filterParams,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }

      this.$api.priceList.priceData(json).then(res => {
        if (res) {
          this.tableLoading = false
          var list = res.list
          for (var i in list) {
            list[i]['enableds'] = list[i].enabled === true ? '是' : '否'
          }
          this.tableData = list
          this.pageNum = res.pageNum
          this.pageSize = res.pageSize
          this.total = res.total
        }
      })
    },
    // 分页
    handleCurrentChange({ currentPage }) {
      this.pageNum = currentPage
      this.get_priceList()
    },
    // 新增
    addPriceList() {
      this.btnLoading = false
      this.dialogTitle = '添加价目表'
      this.dialogShow = true
      this.ruleForm = {
        enabled: true,
        id: ''
      }
    },
    clickBtn(row, type) {
      this.ruleForm = {
        id: ''
      }
      var obj = JSON.stringify(row)
      var ros = JSON.parse(obj)
      switch (type) {
        case '查看':
          this.dialogTitle = '查看价目表'
          this.dialogShow = true
          this.ruleForm = ros
          break
        case '编辑':
          this.dialogTitle = '编辑'
          this.dialogShow = true
          this.ruleForm = ros
          break
        case '价目表明细':
          this.$router.push({
            name: 'detailed',
            params: { id: ros.id },
            query: { name: ros.name }
          })
          break
        case '删除':
          this.$confirm('此操作将永久删除价目表编号为' + ros.code + ', 是否继续?', '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            this.get_priceDelete(ros.id)
          }).catch(() => {})
          break
      }
    },
    // 表单提交
    onSubmit() {
      this.btnLoading = false
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.ruleForm.id !== '' ? this.get_priceEdit() : this.get_priceAdd()
        }
      })
    },
    // 添加
    get_priceAdd() {
      const json = {
        enabled: this.ruleForm.enabled,
        name: this.ruleForm.name,
        remark: this.ruleForm.remark
      }
      this.$api.priceList.priceAdd(json).then(res => {
        if (res) {
          this.btnLoading = false
          this.dialogShow = false
          this.$message.success('添加成功！')
          this.get_priceList()
        }
      })
    },
    // 修改
    get_priceEdit() {
      const json = {
        code: this.ruleForm.code,
        id: this.ruleForm.id,
        name: this.ruleForm.name,
        remark: this.ruleForm.remark,
        enabled: this.ruleForm.enabled
      }
      this.$api.priceList.priceEdit(json).then(res => {
        if (res) {
          this.btnLoading = false
          this.dialogShow = false
          this.$message.success('修改成功！')
          this.get_priceList()
        }
      })
    },
    // 删除
    get_priceDelete(delId) {
      this.$api.priceList.priceDelete({ id: delId }).then(res => {
        if (res) {
          this.tableData.length === 1 && this.pageNum !== 1
            ? this.pageNum--
            : ''
          this.$message.success('删除成功！')
          this.get_priceList()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  padding: 20px;
  margin-bottom: 20px;
  background-color: #ffffff;
}
.footBtn {
  width: 100%;
  display: inline-block;
  text-align: center;
  button {
    width: 96px;
  }
}
.el-form {
  width: 100%;
  display: inline-table;
  .el-form-item {
    ::v-deep .el-form-item__label {
      color: #000000;
      font-size: 14px;
      font-weight: 400;
    }
  }
}
</style>
