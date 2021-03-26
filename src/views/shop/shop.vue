<template>
  <Layout :use-head="true" :use-foot="false" :auto-height="true">
    <FilterForm slot="head" :search-keys="filterProp.searchKeys" :filter-keys="filterProp.filterKeys" @search="submitForm" @reset="handleReset" />
    <MainTitle title="商铺管理" />
    <div class="mb-20">
      <el-button v-if="hasRolePermission('Shop_add')" type="primary" @click="addPriceList('ADD_SHOP')">添加商铺</el-button>
      <el-button v-if="hasRolePermission('Shop_notice')" @click="addPriceList('NOTICE')">付款通知书</el-button>
    </div>
    <TablePager
      ref="TablePager"
      v-loading="tableLoading"
      :data="tableData"
      :total="page.total"
      :to="page.pageSize"
      :current-page="page.pageNum"
      @page="handleCurrentChange"
    >
      <el-table-column
        v-for="item in tableHeader"
        :key="item.key"
        align="left"
        show-overflow-tooltip
        :min-width="item.minWidth"
        :prop="item.key"
        :label="item.label"
        :formatter="item.formatter"
      />
      <el-table-column label="操作" width="240" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="clickBtn(scope.row, 'SHOP_INFO')">商铺信息</el-button>
          <el-button type="text" @click="clickBtn(scope.row, 'ORDER_MANAGEMENT')">订单管理</el-button>
          <el-button type="text" @click="clickBtn(scope.row, 'OLLECTION_LIST')">收款列表</el-button>
        </template>
      </el-table-column>
    </TablePager>
  </Layout>
</template>
<script>
import TablePager from '@/components/base/TablePager'
import Layout from '@/components/base/Layout'
import FilterForm from '@/components/FilterForm/FilterForm2'
import MainTitle from '@/components/base/MainTitle'
export default {
  name: 'Shop',
  components: {
    Layout,
    FilterForm,
    MainTitle,
    TablePager
  },
  data() {
    return {
      siteTypeList: [
        {
          value: 'FOOD',
          label: '美食广场'
        },
        {
          value: 'STREET',
          label: '商业街'
        },
        {
          value: 'OTHER',
          label: '其他'
        }
      ],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      tableLoading: false,
      enabledList: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      tableData: [],
      tableHeader: [
        { key: 'projectName', label: '商铺名称', minWidth: '150' },
        { key: 'companyName', label: '客户名称', minWidth: '150' },
        { key: 'siteTypeName', label: '场地类型', minWidth: '100' },
        { key: 'siteName', label: '场地', minWidth: '100' },
        { key: 'area', label: '面积(㎡)', minWidth: '100', align: 'right' },
        { key: 'timeBoth', label: '起止时间', minWidth: '160' },
        { key: 'contact', label: '联系人', minWidth: '100' },
        { key: 'phone', label: '联系电话', minWidth: '150' },
        { key: 'enableName', label: '是否启用', minWidth: '100' }
      ],
      filterParams: {}
    }
  },
  computed: {
    filterProp() {
      return {
        searchKeys: [
          { value: 'projectName', label: '商铺名称' },
          { value: 'companyName', label: '客户名称' },
          { value: 'contactName', label: '联系人' }
        ],
        filterKeys: [
          { value: 'siteType', label: '场地类型', children: this.siteTypeList || [] },
          { value: 'enable', label: '是否启用', children: this.enabledList || [] }
        ]
      }
    }

  },

  created() {
    this.getShopList()
  },
  methods: {
    // 重置
    handleReset() {
      this.filterParams = {}
      this.getShopList()
      // 清除筛选，重新请求数据
    },
    // 搜索
    submitForm(form) {
      this.filterParams = {}
      const { searchKey, searchValue, filterKey, filterValue } = form
      searchKey ? this.filterParams[searchKey] = searchValue : null
      filterKey ? this.filterParams[filterKey] = filterValue : null
      this.getShopList()
    },

    // 价目表表格数据
    getShopList() {
      this.tableLoading = true
      const json = {
        ...this.filterParams,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize
      }

      this.$api.shop.shopList(json).then(res => {
        console.log(res)
        if (res) {
          this.tableLoading = false
          var list = res.list
          for (var i in list) {
            list[i]['siteTypeName'] = list[i].siteType === 'FOOD' ? '美食广场' : list[i].siteType === 'STREET' ? '商业街' : '其他'
            list[i]['timeBoth'] = '从' + list[i].startDate + '至' + list[i].endDate
            list[i]['enableName'] = list[i].enable === 1 ? '是' : '否'
          }
          this.tableData = list
          this.page.pageNum = res.pageNum
          this.page.total = res.total
        }
      })
    },
    // 分页
    handleCurrentChange({ currentPage }) {
      this.page.pageNum = currentPage
      this.getShopList()
    },
    // 新增
    addPriceList(val) {
      switch (val) {
        case 'ADD_SHOP': // 添加商铺
          this.$router.push({ name: 'shopAdd' })
          break
        case 'NOTICE': // 通知书
          this.$router.push({ name: 'payment' })
          break
      }
    },
    clickBtn(row, type) {
      switch (type) {
        case 'SHOP_INFO': // 商铺信息
          this.$router.push({ name: 'shopEdit', params: { id: row.id }})
          break
        case 'ORDER_MANAGEMENT': // 订单管理
          this.$router.push({ name: 'sale', params: { id: row.id, type: row.projectName }, query: { entrance: 'shop' }})
          break
        case 'OLLECTION_LIST': // 收款列表
          this.$router.push({ name: 'ShopCollection', params: { id: row.id }, query: { projectName: row.projectName }})
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
