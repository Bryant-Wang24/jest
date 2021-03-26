<template>
  <Layout :use-head="false">
    <DialogTree
      title="选择机构"
      :show-checkbox="false"
      :visible.sync="treeDialogVisible"
      :data="officeData"
      @getCurrentNode="getCurrentNode"
    />
    <div>
      <MainTitle />
      <div>
        <InlineForm
          ref="ruleForm"
          :model="ruleForm"
        >
          <el-form-item label="手机号码">
            <el-input v-model="ruleForm.mobile" />
          </el-form-item>
          <el-form-item label="登录名">
            <el-input v-model="ruleForm.loginName" />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="ruleForm.email" />
          </el-form-item>
          <el-form-item label="机构名称">
            <el-input
              v-model="ruleForm.office.label"
              readonly
              @focus="toggleTreeDialog"
            >
              <el-button
                slot="append"
                type="primary"
                icon="el-icon-search"
                @click="toggleTreeDialog"
              />
            </el-input>
          </el-form-item>
        </InlineForm>
      </div>
      <TablePager
        :current-page="page.pageNo"
        :is-pagination="false"
        :data="tableData"
        :total="30"
        @page="getPage"
      >
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column label="姓名" prop="name" width="180" />
        <el-table-column show-overflow-tooltip prop="address" label="地址" />
        <el-table-column label="传真">
          <el-input />
        </el-table-column>
      </TablePager>
      <div>
        <el-button size="mini" icon="el-icon-plus">添加</el-button>

      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
import MainTitle from '@/components/base/MainTitle'
import TablePager from '@/components/base/TablePager'
import DialogTree from '@/components/base/DialogTree'
import InlineForm from '@/components/base/InlineForm'
import api from '@/api/index'
export default {
  name: 'SystemManagementUser',
  components: {
    Layout,
    MainTitle,
    TablePager,
    DialogTree,
    InlineForm
  },
  data() {
    return {
      tableData: [
        {
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          id: 1232,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          id: 123332,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          id: 122232,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      officeData: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1',
              disabled: true
            },
            {
              id: 6,
              disabled: true,
              label: '二级 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2'
            }
          ]
        }
      ],
      page: {
        pageNo: 1,
        pageSize: 10
      },
      ruleForm: {
        office: {
          id: '',
          label: ''
        },
        loginName: '',
        name: '',
        email: '',
        mobile: ''
      },
      treeDialogVisible: false
    }
  },
  watch: {
    page: {
      immediate: true,
      deep: true,
      handler() {
        this.getList()
      }
    }
  },
  methods: {
    resetPage() {
      // 重复赋值新对象才能触发watch
      this.page = {
        pageNo: 1,
        pageSize: 10
      }
    },
    getPage(page) {
      this.page.pageNo = page.currentPage
      this.page.pageSize = page.pageSize
    },
    resetForm() {
      this.ruleForm = {
        office: {
          id: '',
          label: ''
        },
        loginName: '',
        name: '',
        email: '',
        mobile: ''
      }
    },
    getList() {
      api.systemManagement
        .userPage({ ...this.page, ...this.ruleForm })
        .then(res => {
          console.log(res)
        })
    },
    toggleTreeDialog(isOpen) {
      this.treeDialogVisible = !!isOpen
    },
    getCurrentNode(row) {
      this.ruleForm.office = row
      this.toggleTreeDialog(false)
    }
  }
}
</script>

<style></style>
