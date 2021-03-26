<template>
  <Layout>
    <div slot="head">
      <InlineForm
        ref="ruleForm"
        :model="ruleForm"
        label-width="100px"
        form-item-width="270px"
        form-item-content-width="170px "
      >
        <el-form-item label="角色中文名称">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="ruleForm.enname" />
        </el-form-item>
        <el-form-item label="数据范围">
          <el-select v-model="ruleForm.dataScope" clearable filterable>
            <el-option
              v-for="item in dataScopeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否可用">
          <el-select v-model="ruleForm.useable" clearable filterable>
            <el-option
              v-for="item in useableStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
        <el-table-column :formatter="isNull" label="角色名称" prop="name" />
        <el-table-column :formatter="isNull" label="英文名称" prop="enname" />
        <el-table-column
          :formatter="isNull"
          label="归属部门"
          prop="office.name"
        />
        <el-table-column
          :formatter="formatterDataScope"
          label="数据范围"
          prop="dataScope"
          width="170"
        />
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="toEdit(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="mini"
              @click="toDetail(scope.row)"
            >详情</el-button>
            <el-button
              type="text"
              size="mini"
            >权限设置</el-button>
            <el-button
              type="text"
              size="mini"
            >分配用户</el-button>
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
import theRoleMixins from '@/views/systemManagement/mixins/role'
import api from '@/api/index'
export default {
  name: 'KeepAlive',
  components: {},
  mixins: [ListMixins, theRoleMixins],
  data() {
    return {
      tableData: [],
      officeTreeData: [],
      ruleForm: {
        office: {
          id: '',
          name: ''
        },
        enname: '',
        name: '',
        dataScope: '',
        useable: '1'
      },
      treeDialogVisible: false,
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
        enname: '',
        name: '',
        dataScope: '',
        useable: '1'
      }
    },
    getList() {
      this.params = Object.assign({}, this.ruleForm, this.page)
      this.params = JSON.parse(JSON.stringify(this.params))
      delete this.params.office.name
      this.loading = true
      api.systemManagement.rolePage(this.params).then(res => {
        this.tableData = res.list
        this.total = res.total
        this.loading = false
      })
    },
    toEdit(row) {
      this.toRouter('SystemManagementRoleEdit', { id: row.id })
    },
    toDetail(row) {
      this.toRouter('SystemManagementRoleDetail', { id: row.id })
    },
    toAdd() {
      this.toRouter('SystemManagementRoleAdd')
    },
    getCurrentNode(row) {
      const { name, id } = row
      this.ruleForm.office = { name, id }
      this.toggleOfficeTreeDialog(false)
    },
    deleteRow(row) {
      api.systemManagement.deleteRole(row.id).then(res => {
        this.getList()
      })
    },
    formatterDataScope(row, value, cellValue) {
      const result = this.dataScopeList.filter(item => {
        return item.value === cellValue
      })
      return result[0].label || '-'
    }
  }
}
</script>

<style></style>
