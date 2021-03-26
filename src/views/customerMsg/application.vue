<template>
  <Layout :use-head="true" :use-foot="false" :auto-height="true">

    <!-- 顶部筛选 -->
    <FilterForm slot="head" :search-keys="filterProp.searchKeys" :filter-keys="filterProp.filterKeys" @search="search" @reset="reset" />
    <!-- title -->
    <MainTitle title="客户申请列表" />
    <!-- 页面操作按钮 -->
    <div class="operate">
      <el-button type="primary" @click="addCustomer">添加客户</el-button>
    </div>
    <!-- 表格 -->
    <div v-loading="loading">
      <TablePager
        ref="TablePager"
        :data="tableData"
        :total="pagination.total"
        :to="pagination.pageSize"
        :current-page="pagination.currentPage"
        @page="handleCurrentChange"
      >
        <el-table-column
          v-for="item in tableHeader"
          :key="item.key"
          align="left"
          show-overflow-tooltip
          :prop="item.key"
          :label="item.text"
          reserve-selection
          :formatter="item.formatter"
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleView(scope.row)">查看</el-button>
            <el-button
              v-show="scope.row.state == 'SUBMITTED' && isApprovalAuth(scope.row.currentApproverId)"
              type="text"
              @click="handleReview(scope.row)"
            >审核</el-button>
            <el-button
              v-if="hasRoleUserPermission('Application_edit',scope.row.createBy && scope.row.createBy.id)"
              v-show="scope.row.state == 'REJECTED' || scope.row.state == 'SAVED'"
              type="text"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="hasRoleUserPermission('Application_delete', scope.row.createBy && scope.row.createBy.id)"
              v-show="scope.row.state == 'REJECTED' || scope.row.state == 'SAVED'"
              type="text"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </TablePager>
    </div>

  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
import FilterForm from '@/components/FilterForm/FilterForm2'
import MainTitle from '@/components/base/MainTitle'
import TablePager from '@/components/base/TablePager'
import { mapGetters } from 'vuex'
import {
  COMPANY_NATURE,
  STATE,
  STATE_ARRAY,
  COMPANY_NATURE_ARRAY
} from '@/common/customerMsg'
import { isApprovalAuth } from '@/common/approve'
import pageMixin from '@/views/mixins/page'

export default {
  name: 'Application',
  components: {
    FilterForm,
    MainTitle,
    TablePager,
    Layout
  },
  mixins: [pageMixin],
  data() {
    return {
      isApprovalAuth,
      STATE: STATE,
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      filterParams: {}, // 保存顶部筛选数据，用于分页查询时获取筛选
      tableHeader: [
        {
          key: 'idNum',
          text: '客户编号'
        },
        {
          key: 'companyName',
          text: '公司名称'
        },
        {
          key: 'customerTypeText',
          text: '客户类型'
        },
        {
          key: 'companyNatureText',
          text: '公司性质'
        },
        {
          key: 'industry',
          text: '所属行业',
          formatter: (row, column, cellValue, index) => {
            const obj = this.CUSTOMER_INDUSTRY.find(item => {
              return row.industry === item.value
            })
            return obj?.label || '-'
          }
        },
        {
          key: 'operateByName',
          text: '提交人'
        },
        {
          key: 'operateDateText',
          text: '提交时间'
        },
        {
          key: 'stateText',
          text: '状态'
        }
      ],
      tableData: []
    }
  },
  computed: {
    filterProp() {
      return {
        searchKeys: [
          { value: 'idNum', label: '客户编号' },
          { value: 'companyName', label: '公司名称' }
        ],
        filterKeys: [
          { value: 'state', label: '状态', children: STATE_ARRAY },
          { value: 'customerType', label: '客户类型', children: this.CUSTOMER_TYPE_ARRAY || [] },
          { value: 'companyNature', label: '公司性质', children: COMPANY_NATURE_ARRAY || [] },
          { value: 'industry', label: '所属行业', children: this.CUSTOMER_INDUSTRY || [] }
        ]
      }
    },
    ...mapGetters({
      CUSTOMER_INDUSTRY: 'CUSTOMER_INDUSTRY',
      CUSTOMER_TYPE_ARRAY: 'CUSTOMER_TYPE_ARRAY',
      CUSTOMER_TYPE_OBJECT: 'CUSTOMER_TYPE_OBJECT'
    })
  },
  mounted() {
    const params = {
      pageIndex: 1,
      pageSize: 10
    }
    this._getList(params)
  },
  methods: {
    // 顶部filter，重置按钮
    reset() {
      // 清除筛选，重新请求数据
      const params = {
        pageIndex: 1,
        pageSize: 10
      }
      this.filterParams = {}
      this._getList(params)
    },
    // 顶部filter，查询按钮
    search(form) {
      this.filterParams = {}
      // 整合请求数据
      const { searchKey, searchValue, filterKey, filterValue } = form
      const params = {
        pageIndex: 1,
        pageSize: 10,
        customerSimple: {
          constructCompany: {}
        }
      }
      if (searchValue) {
        searchKey && (params['customerSimple']['constructCompany'][searchKey] = searchValue)
      }
      switch (filterKey) {
        case 'state':
          params['customerSimple']['customerRequest'] = {
            [filterKey]: filterValue
          }
          break
        case 'customerType':
          params['customerSimple']['constructCompany'][filterKey] = filterValue
          break
        case 'companyNature':
        case 'industry':
          params['customerSimple']['constructBusinessInfo'] = {
            [filterKey]: filterValue
          }
          break
        default:
          break
      }
      this.filterParams = params
      this._getList(params)
    },
    // 查看
    handleView(row) {
      const { id } = row
      this.$router.push({
        name: `ApplicationCustomerInfo`,
        query: { id, source: 'view' }
      })
    },
    // 审核
    handleReview(row) {
      const { id } = row
      this.$router.push({
        name: `ApplicationCustomerInfo`,
        query: { id, source: 'review' }
      })
    },
    // 编辑
    handleEdit(row) {
      const { id } = row
      this.$router.push({
        name: 'EditCustomer',
        query: { id, source: 'applicationEdit' }
      })
    },
    // 删除
    handleDelete(row) {
      const { id } = row
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.customerMsg.deleteCustomer(id).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              const params = {
                ...this.filterParams,
                pageIndex: this.pagination.currentPage,
                pageSize: this.pagination.pageSize
              }
              this._getList(params)
            } else {
              this.$message({
                type: 'error',
                message: '删除失败，请重试!'
              })
            }
          }).catch(e => { this.$message.error('请求出错') })
        })
        .catch(() => {})
    },
    handleCurrentChange(page) {
      const params = {
        ...this.filterParams,
        pageIndex: page.currentPage,
        pageSize: this.pagination.pageSize
      }
      this._getList(params)
    },
    addCustomer() {
      this.$router.push({ name: 'AddCustomer' })
    },
    initTableData(list = []) {
      const talbeData = []
      for (let i = 0; i < list.length; i++) {
        const row = list[i]
        const { idNum, companyName, customerType, id } = row.constructCompany
        const { companyNature, industry } = row.constructBusinessInfo
        const { state, currentApproverId } = row.customerRequest
        const { createBy } = row.customerRequest
        talbeData.push({
          id, // 用于删除
          idNum,
          companyName,
          customerType,
          customerTypeText: this.CUSTOMER_TYPE_OBJECT[customerType],
          companyNature,
          companyNatureText: COMPANY_NATURE[companyNature],
          industry,
          createBy,
          operateByName: createBy?.name,
          operateDate: createBy?.createDate,
          operateDateText: createBy?.createDate,
          state,
          stateText: STATE[state],
          currentApproverId
        })
      }
      return talbeData
    },
    _getList(params) {
      this.loading = true
      this.$api.customerMsg.getlist(params).then(res => {
        this.loading = false

        const { count, list, pageNo, pageSize } = res
        this.pagination.currentPage = pageNo
        this.pagination.pageSize = pageSize
        this.pagination.total = count
        this.tableData = this.initTableData(list)
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// #appliction {
//   padding: 20px;
//   .container {
//     padding: 20px;
//     margin-bottom: 20px;
//     background-color: #ffffff;
//     .operate {
//       margin-bottom: 20px;
//     }
//     .pagination {
//       text-align: center;
//       margin: 20px 0;
//     }
//   }
// }
</style>
