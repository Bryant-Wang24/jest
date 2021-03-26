<template>
  <Layout :use-head="true" :use-foot="false" :auto-height="true">
    <!-- 顶部筛选 -->
    <FilterForm slot="head" :search-keys="filterProp.searchKeys" :filter-keys="filterProp.filterKeys" @search="handleSearch" @reset="handleReset" />
    <!-- title -->
    <MainTitle title="客户管理" />
    <!-- 表格 -->
    <div v-loading="loading">
      <TablePager
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
            <el-button
              type="text"
              size="small"
              @click="handleView(scope.row)"
            >查看详情</el-button>
            <el-button
              v-if="hasRoleUserPermission('Management_edit', scope.row.createBy && scope.row.createBy.id)"
              type="text"
              size="small"
              @click="handleEdit(scope.row)"
            >编辑资料</el-button>
          </template>
        </el-table-column>
      </TablePager>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
import moment from 'moment'
import FilterForm from '@/components/FilterForm/FilterForm2'
import TablePager from '@/components/base/TablePager'
import { mapGetters } from 'vuex'
import {
  COMPANY_NATURE,
  STATE,
  COMPANY_NATURE_ARRAY
} from '@/common/customerMsg'
import pageMixin from '@/views/mixins/page'
import MainTitle from '@/components/base/MainTitle'
export default {
  name: 'Management',
  components: {
    FilterForm,
    TablePager,
    MainTitle,
    Layout
  },
  mixins: [pageMixin],
  data() {
    return {
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
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
            return obj?.label || ''
          }
        },
        {
          key: 'name',
          text: '联系人'
        },
        {
          key: 'phone',
          text: '联系电话'
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
          // { value: 'state', label: '状态', children: STATE_ARRAY },
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
  watch: {
    // CUSTOMER_INDUSTRY: {
    //   handler(v) {
    //     // debugger
    //     this.fliterList[1].components[0].options[3].children = v
    //   },
    //   immediate: true
    // },
    // CUSTOMER_TYPE_ARRAY: {
    //   handler(v) {
    //     // debugger
    //     this.fliterList[1].components[0].options[1].children = v
    //   },
    //   immediate: true
    // }
  },
  mounted() {
    const params = {
      pageIndex: 1,
      pageSize: 10,
      customerSimple: {
        customerRequest: {
          state: 'APPROVED'
        }
      }
    }
    this._getList(params)
  },
  methods: {
    handleReset() {
      // 清除筛选，重新请求数据
      const params = {
        pageIndex: 1,
        pageSize: 10,
        customerSimple: {
          customerRequest: {
            state: 'APPROVED'
          }
        }
      }
      this.filterParams = {}
      this._getList(params)
    },
    handleSearch(form) {
      // 整合请求数据
      const { searchKey, searchValue, filterKey, filterValue } = form
      const params = {
        pageIndex: 1,
        pageSize: 10,
        customerSimple: {
          customerRequest: {
            state: 'APPROVED'
          },
          constructCompany: {}
        }
      }
      if (searchValue) {
        searchKey && (params['customerSimple']['constructCompany'][searchKey] = searchValue)
      }
      switch (filterKey) {
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
      console.log(row)
      const { id } = row
      this.$router.push({
        name: `ManagementCustomerInfo`,
        query: { id, source: 'view' }
      })
    },
    handleReview(row) {
      console.log(row)
    },
    handleEdit(row) {
      console.log(row)
      const { id } = row
      this.$router.push({
        name: 'ManagementEditCustomer',
        query: { id, source: 'managementEdit' }
      })
    },
    handleDelete(row) {
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pagination.currentPage = 1
      const params = {
        ...this.filterParams,
        pageIndex: this.pagination.currentPage,
        pageSize: val,
        customerSimple: {
          customerRequest: {
            state: 'APPROVED'
          }
        }
      }
      console.log(params)
      this._getList(params)
    },
    handleCurrentChange(page) {
      const params = {
        ...this.filterParams,
        pageIndex: page.currentPage,
        pageSize: this.pagination.pageSize,
        customerSimple: {
          customerRequest: {
            state: 'APPROVED'
          }
        }
      }
      console.log(params)
      this._getList(params)
    },
    initTableData(list) {
      const talbeData = []
      for (let i = 0; i < list.length; i++) {
        const row = list[i]
        const { idNum, companyName, customerType, id } = row.constructCompany
        const { companyNature, industry } = row.constructBusinessInfo
        const { state } = row.customerRequest
        const { phone, name } = row.defaultConstructInfo
        const {
          createBy,
          operateBy,
          operateByName = '默认提交人',
          operateDate
        } = row.customerRequest
        talbeData.push({
          id, // 用于删除
          idNum,
          companyName,
          customerType,
          customerTypeText: this.CUSTOMER_TYPE_OBJECT[customerType],
          companyNature,
          companyNatureText: COMPANY_NATURE[companyNature],
          industry,
          // industryText: industry ? INDUSTRY[industry.split(',')[0]] : '',
          createBy,
          operateBy,
          operateByName,
          operateDate,
          operateDateText: moment(operateDate).format('YYYY-MM-DD'),
          state,
          stateText: STATE[state],
          phone,
          name
        })
      }
      return talbeData
    },
    _getList(params) {
      this.loading = true
      this.$api.customerMsg.getlist(params).then(res => {
        this.loading = false

        // if (res.success) {
        const { count, list, pageNo, pageSize } = res
        this.pagination.currentPage = pageNo
        this.pagination.pageSize = pageSize
        this.pagination.total = count
        this.tableData = this.initTableData(list)
        // }
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
</style>
