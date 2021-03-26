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
            v-model="ruleForm.office.name"
            readonly
            @focus="toggleOfficeTreeDialog"
          >
            <el-button
              slot="append"
              type="primary"
              icon="el-icon-search"
              @click="toggleOfficeTreeDialog"
            />
          </el-input>
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="searchPage"
        >搜索</el-button>
        <el-button @click="resetForm">重置</el-button>
      </InlineForm>
      <DialogTree
        title="选择机构"
        :show-checkbox="false"
        :visible.sync="officeTreeDialogVisible"
        :data="officeTreeData"
        @getCurrentNode="getCurrentNode"
      />
    </div>
    <div>
      <MainTitle />
      <div>
        <el-button icon="el-icon-plus" @click="toAdd">添加</el-button>
      </div>
      <TablePager
        v-loading="loading"
        :current-page="page.pageNo"
        :data="tableData"
        :total="total"
        @page="getPage"
      >
        <el-table-column :formatter="isNull" show-overflow-tooltip prop="loginName" label="登录名" width="110" />
        <el-table-column :formatter="isNull" label="姓名" prop="name" width="110" />
        <el-table-column :formatter="isNull" label="手机" prop="mobile" width="110" />
        <el-table-column :formatter="isNull" label="电话" prop="phone" width="110" />
        <el-table-column :formatter="isNull" label="邮箱" prop="email" />
        <el-table-column :formatter="isNull" label="归属公司" prop="company.name" />
        <el-table-column :formatter="isNull" label="归属部门" prop="office.name" />
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="toDetail(scope.row)">详情</el-button>
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
import ListMixins from '@/mixins/ems/ListMixins'
import officeMixins from '@/mixins/ems/office'
import api from '@/api/index'
export default {
  name: 'SystemManagementUser',
  components: {},
  mixins: [ListMixins, officeMixins],
  data() {
    return {
      tableData: [],
      ruleForm: {
        office: {
          id: '',
          name: ''
        },
        loginName: '',
        name: '',
        email: '',
        mobile: ''
      },
      loading: false,
      total: 0,
      params: {}
    }
  },
  created() {
    this.initDataFn()
  },
  methods: {
    initDataFn() {
      this.getOfficeTreeData()
    },
    searchPage() {
      this.resetPage()
    },
    resetForm() {
      this.ruleForm = {
        office: {
          id: '',
          name: ''
        },
        loginName: '',
        name: '',
        email: '',
        mobile: ''
      }
    },
    getList() {
      this.params = Object.assign({}, this.ruleForm, this.page)
      this.params = JSON.parse(JSON.stringify(this.params))
      delete this.params.office.name
      this.loading = true
      api.systemManagement
        .userPage(this.params)
        .then(res => {
          this.tableData = res.list
          this.total = res.total
          this.loading = false
        })
    },
    toEdit(row) {
      this.toRouter('SystemManagementUserEdit', { id: row.id })
    },
    toDetail(row) {
      this.toRouter('SystemManagementUserDetail', { id: row.id })
    },
    toAdd() {
      this.toRouter('SystemManagementUserAdd')
    },
    getCurrentNode(row) {
      const { name, id } = row
      this.ruleForm.office = { name, id }
      this.toggleOfficeTreeDialog(false)
    },
    deleteRow(row) {
      api.systemManagement.deleteUser(row.id).then(res => {
        this.getList()
      })
    }
  }
}
</script>

<style></style>
