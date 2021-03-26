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
        <el-form-item label="key">
          <el-select v-model="ruleForm.key" clearable filterable>
            <el-option
              v-for="item in sysConfigList"
              :key="item.id"
              :label="item.key"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="展会">
          <el-select v-model="ruleForm.exhibitionId" clearable filterable>
            <el-option
              v-for="item in exhibitionList"
              :key="item.id"
              :label="item.exhibitionName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-button
          type="primary"
          icon="el-icon-search"
          @click="searchPage"
        >搜索</el-button>
        <el-button @click="resetForm">重置</el-button>
      </InlineForm>
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
        <el-table-column :formatter="isNull" label="key" prop="key" />
        <el-table-column :formatter="isNull" label="键值" prop="value" />
        <el-table-column :formatter="isNull" label="数值" prop="usage" />
        <el-table-column :formatter="isNull" label="展会id" prop="exhibitionId" />
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
import exhibitionMixins from '@/mixins/ems/exhibition'
import api from '@/api/index'
export default {
  name: 'KeepAlive',
  components: {},
  mixins: [ListMixins, exhibitionMixins],
  data() {
    return {
      tableData: [],
      sysConfigList: [],
      exhibitionList: [],
      ruleForm: {
        key: '',
        exhibitionId: ''
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
      this.getSysConfigList()
      this.getExhibitionData()
    },
    searchPage() {
      this.resetPage()
    },
    resetForm() {
      this.ruleForm = {
        key: '',
        exhibitionId: ''
      }
    },
    getList() {
      this.params = Object.assign({}, this.ruleForm, this.page)
      this.params = JSON.parse(JSON.stringify(this.params))
      this.loading = true
      api.systemManagement.sysConfigPage(this.params).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.loading = false
      })
    },
    toEdit(row) {
      this.toRouter('SystemManagementSysConfigEdit', { id: row.id })
    },
    toDetail(row) {
      this.toRouter('SystemManagementSysConfigDetail', { id: row.id })
    },
    toAdd() {
      this.toRouter('SystemManagementSysConfigAdd')
    },
    deleteRow(row) {
      api.systemManagement.deleteSysConfig(row.id).then(res => {
        this.getList()
      })
    },
    getSysConfigList() {
      api.systemManagement.sysConfigList().then(res => {
        this.sysConfigList = res
      })
    }
  }
}
</script>

<style></style>
