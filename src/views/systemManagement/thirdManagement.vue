<template>
  <Layout>
    <div slot="head">
      <InlineForm
        ref="ruleForm"
        :model="ruleForm"
        label-width="70px"
        form-item-width="270px"
        form-item-content-width="200px "
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
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="resetPage"
        >搜索</el-button>
        <el-button @click="resetForm">重置</el-button>
      </InlineForm>
      <DialogTree
        title="选择机构"
        :show-checkbox="false"
        :visible.sync="treeDialogVisible"
        :data="officeData"
        @getCurrentNode="getCurrentNode"
      />
    </div>
    <div>
      <MainTitle />
      <div>
        <el-button icon="el-icon-plus" @click="toAdd">添加</el-button>
        <el-button icon="el-icon-plus">导入</el-button>
        <el-button icon="el-icon-plus">导出</el-button>
        <el-button @click="toInfo('SystemManagementUserEdit')">编辑</el-button>
        <el-button
          @click="toInfo('SystemManagementUserDetail')"
        >详情</el-button>
      </div>
      <TablePager
        :current-page="page.pageNo"
        :data="tableData"
        :total="30"
        @page="getPage"
      >
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column label="姓名" prop="name" width="180" />
        <el-table-column show-overflow-tooltip prop="address" label="地址" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="toDetail(scope.row)">详情</el-button>
            <el-button size="mini" @click="toEdit(scope.row)">编辑</el-button>
            <ConfirmButton
              size="mini"
              type="danger"
              @onConfirm="deleteRow(scope.row)"
            >删除</ConfirmButton>
          </template>
        </el-table-column>
      </TablePager>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
import MainTitle from '@/components/base/MainTitle'
import TablePager from '@/components/base/TablePager'
import DialogTree from '@/components/base/DialogTree'
import InlineForm from '@/components/base/InlineForm'
import ConfirmButton from '@/components/ConfirmButton'
import api from '@/api/index'
export default {
  name: 'SystemManagementUser',
  components: {
    Layout,
    MainTitle,
    TablePager,
    DialogTree,
    ConfirmButton,
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
    toInfo(routerName, query) {
      this.$router.push({
        name: routerName,
        query: query || {}
      })
    },
    toDetail(row) {
      console.log(row)
      this.toInfo('SystemManagementThirdManagementDetail', { id: row.id })
    },
    toEdit(row) {
      console.log(row)
      this.toInfo('SystemManagementThirdManagementEdit', { id: row.id })
    },
    toAdd() {
      this.toInfo('SystemManagementThirdManagementAdd')
    },
    toggleTreeDialog(isOpen) {
      this.treeDialogVisible = !!isOpen
    },
    getCurrentNode(row) {
      this.ruleForm.office = row
      this.toggleTreeDialog(false)
    },
    deleteRow(row) {
      console.log(row)
    }
  }
}
</script>

<style></style>
