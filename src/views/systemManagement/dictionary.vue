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
        <el-form-item label="类型">
          <el-select v-model="ruleForm.type" clearable filterable>
            <el-option
              v-for="(item,index) in dictionaryTypeList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="ruleForm.label" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="ruleForm.description" />
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
        <el-table-column :formatter="isNull" label="键值" prop="value" />
        <el-table-column :formatter="isNull" label="标签" prop="label" />
        <el-table-column :formatter="isNull" label="类型" prop="type" />
        <el-table-column :formatter="isNull" label="归属部门" prop="office.name" />
        <el-table-column :formatter="isNull" label="描述" prop="description" />
        <el-table-column :formatter="isNull" label="备注" prop="remarks" />
        <el-table-column label="操作" width="180">
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
  name: 'KeepAlive',
  components: {},
  mixins: [ListMixins, officeMixins],
  data() {
    return {
      tableData: [],
      dictionaryTypeList: [],
      ruleForm: {
        office: {
          name: '',
          id: ''
        },
        label: '',
        description: '',
        type: ''
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
      this.getDictionaryTypeList()
      this.getOfficeTreeData()
    },
    searchPage() {
      this.resetPage()
    },
    resetForm() {
      this.ruleForm = {
        office: {
          name: '',
          id: ''
        },
        label: '',
        description: '',
        type: ''
      }
    },
    getList() {
      this.params = Object.assign({}, this.ruleForm, this.page)
      this.params = JSON.parse(JSON.stringify(this.params))
      delete this.params.office.name
      this.loading = true
      api.systemManagement.dictionaryPage(this.params).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.loading = false
      })
    },
    toEdit(row) {
      this.toRouter('SystemManagementDictionaryEdit', { id: row.id })
    },
    toDetail(row) {
      this.toRouter('SystemManagementDictionaryDetail', { id: row.id })
    },
    toAdd() {
      this.toRouter('SystemManagementDictionaryAdd')
    },
    deleteRow(row) {
      api.systemManagement.deleteDictionary(row.id).then(res => {
        this.getList()
      })
    },
    getDictionaryTypeList() {
      api.systemManagement.dictionaryTypeList().then(res => {
        this.dictionaryTypeList = res
      })
    }
  }
}
</script>

<style></style>
