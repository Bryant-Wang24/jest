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
          @click="resetPage"
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
        row-key="id"
        :current-page="page.pageNo"
        :data="tableData"
        :tree-props="{ children: 'childItems', hasChildren: 'hasChildren' }"
        :is-pagination="false"
        @page="getPage"
      >
        <el-table-column :formatter="isNull" label="机构名称" prop="name" />
        <el-table-column :formatter="isNull" label="机构编码" prop="code" />
        <el-table-column :formatter="officeType" label="机构类型" prop="type" width="80px" />
        <el-table-column label="操作" width="250">
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
              @click="toAddByOffice(scope.row)"
            >添加下级机构</el-button>
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
      ruleForm: {
        office: {
          id: '',
          name: ''
        }
      },
      loading: false,
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
          name: '',
          id: '',
          parentIds: '',
          type: ''
        }
      }
    },
    getCurrentNode(row) {
      const { name, id, parentIds, type } = row
      this.ruleForm.office = { name, id, parentIds, type }
      console.log(this.ruleForm)
      this.toggleOfficeTreeDialog(false)
    },
    getList() {
      this.loading = true
      api.systemManagement.officeTreeData().then(res => {
        this.tableData = res
        this.loading = false
      })
    },
    toEdit(row) {
      this.toRouter('SystemManagementOfficeEdit', { id: row.id })
    },
    toAddByOffice(row) {
      this.toRouter('SystemManagementOfficeAdd', {
        pId: row.id,
        pIds: row.parentIds,
        pName: row.name
      })
    },
    toDetail(row) {
      this.toRouter('SystemManagementOfficeDetail', { id: row.id })
    },
    toAdd() {
      this.toRouter('SystemManagementOfficeAdd')
    },
    deleteRow(row) {
      api.systemManagement.deleteOffice(row.id).then(res => {
        this.getList()
      })
    },
    officeType(row) {
      let result = ''
      if (row.type === '1') {
        result = '公司'
      } else if (row.type === '2') {
        result = '部门'
      } else if (row.type === '3') {
        result = '小组'
      } else {
        result = '-'
      }
      return result
    }
  }
}
</script>

<style></style>
