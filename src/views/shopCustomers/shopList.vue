<template>
  <Layout :use-head="true" :use-foot="false" :auto-height="true">

    <FilterForm slot="head" :search-keys="filterProp.searchKeys" :filter-keys="filterProp.filterKeys" @search="submitForm" @reset="handleReset" />

    <MainTitle title="商铺客户" />
    <div class=" mb-20">
      <el-button
        v-if="hasRolePermission('shopList_add')"
        type="primary"
        @click="addPriceList"
      >添加客户</el-button>
    </div>

    <div v-loading="tableLoading">
      <TablePager
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
          :label="item.text"
          reserve-selection
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="clickBtn(scope.row, '查看详情')"
            >查看详情</el-button>
            <el-button
              v-if="hasRoleUserPermission('shopList_add', scope.row.createBy ? scope.row.createBy.id : null)"
              size="mini"
              type="text"
              @click="clickBtn(scope.row, '编辑资料')"
            >编辑资料</el-button>
          </template>
        </el-table-column>
      </TablePager>

    </div>

  </Layout>
</template>
<script>
import Layout from '@/components/base/Layout'
import { mapGetters } from 'vuex'
import FilterForm from '@/components/FilterForm/FilterForm2'
import pageMixin from '@/views/mixins/page'
import MainTitle from '@/components/base/MainTitle'
import TablePager from '@/components/base/TablePager'
const BODY_TYPE = {
  COMPANY: '企业',
  INDIVIDUAL: '个体工商户'
}

export default {
  name: 'ShopList',
  components: {
    FilterForm,
    MainTitle,
    TablePager,
    Layout
  },
  mixins: [pageMixin],
  data() {
    return {
      pageSize: 10,
      tableLoading: false,
      pageNum: 1,
      total: 0,
      tableData: [],
      tableHeader: [
        { key: 'idNum', text: '客户编号', minWidth: '150' },
        { key: 'customerName', text: '客户名称', minWidth: '150' },
        { key: 'bodyTypeName', text: '主体类型', minWidth: '100' },
        { key: 'industry', text: '所属行业', formatter: (row, column, cellValue, index) => {
          const obj = this.CUSTOMER_INDUSTRY.find(item => {
            return row.industry === item.value
          })
          return obj?.label || ''
        }, minWidth: '100' },
        { key: 'name', text: '联系人', minWidth: '100' },
        { key: 'phone', text: '联系电话', minWidth: '150' },
        { key: 'userName', text: '添加人', formatter: (row, column, cellValue, index) => {
          return row.createBy ? row.createBy.name : '-'
        }, minWidth: '100' },
        { key: 'createDateName', text: '添加时间', width: '160' }
      ],
      bodyTypeList: [
        {
          value: 'COMPANY',
          label: '企业'
        },
        {
          value: 'INDIVIDUAL',
          label: '个体工商户'
        }
      ], // 主体类型
      filterParams: {}
    }
  },
  computed: {
    filterProp() {
      return {
        searchKeys: [
          { value: 'idNum', label: '客户编号' },
          { value: 'companyName', label: '公司名称' },
          { value: 'name', label: '联系人' },
          { value: 'createBy', label: '添加人' }
        ],
        filterKeys: [
          { value: 'bodyType', label: '主体类型', children: this.bodyTypeList },
          { value: 'industry', label: '所属行业', children: this.CUSTOMER_INDUSTRY || [] }
        ]
      }
    },
    ...mapGetters({
      CUSTOMER_INDUSTRY: 'CUSTOMER_INDUSTRY'
    })
  },
  created() {
    this.get_shopCustomer()
  },
  methods: {
    // 时间戳
    // conversion(){

    // },
    // 重置
    handleReset() {
      this.filterParams = {}
      this.get_shopCustomer()
      // 清除筛选，重新请求数据
    },
    // 搜索
    submitForm(form) {
      this.filterParams = {}
      const { searchKey, searchValue, filterKey, filterValue } = form
      searchKey ? this.filterParams[searchKey] = searchValue : null
      filterKey ? this.filterParams[filterKey] = filterValue : null

      this.pageNum = 1
      this.get_shopCustomer()
    },

    // 价目表表格数据
    get_shopCustomer() {
      this.tableLoading = true
      const json = {
        ...this.filterParams,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        customerType: '9'
      }
      this.$api.shopCustomer.shopCustomer(json).then(res => {
        if (res) {
          this.tableLoading = false
          var list = res.list
          for (var i in list) {
            list[i]['createDateName'] = this.conversion(list[i].createDate)
            list[i]['bodyTypeName'] = BODY_TYPE[list[i].bodyType]
          }
          this.tableData = list
          this.pageNum = res.pageNum
          this.pageSize = res.pageSize
          this.total = res.total
        }
      })
    },
    // 分页
    handleCurrentChange(page) {
      this.pageNum = page.currentPage
      this.get_shopCustomer()
    },
    // 新增
    addPriceList() {
      this.$router.push({ name: 'ShopListAdd' })
    },
    clickBtn(row, type) {
      switch (type) {
        case '查看详情':
          this.$router.push({ name: 'shopListEdit', params: { id: row.id, type: 'editNew' }})
          break
        case '编辑资料':
          this.$router.push({ name: 'shopListEdit', params: { id: row.id, type: 'edit' }})
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
