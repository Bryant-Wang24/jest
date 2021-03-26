<template>
  <Layout :use-head="true" :use-foot="false" :auto-height="true">

    <FilterForm slot="head" :search-keys="filterProp.searchKeys" :filter-keys="filterProp.filterKeys" @search="submitForm" @reset="handleReset" />

    <MainTitle title="场地销售列表" />
    <TablePager
      ref="TablePager"
      v-loading="loading"
      :data="tableData"
      :total="page.total"
      :to="page.pageSize"
      :current-page="page.pageNo"
      @page="handleCurrentChange"
    >
      <el-table-column prop="projectName" label="项目名称" min-width="280px">
        <template slot-scope="scope">
          <el-tooltip
            class="item tooltip_new tooltip_projectName"
            effect="dark"
            :content="scope.row.projectName || '无'"
            placement="bottom"
          >
            <el-button type="text"><warning v-show="scope.row.state ==='RESCINDED'" />  {{ scope.row.projectName }}</el-button>
          </el-tooltip>

          <el-tooltip
            class="item tooltip_new "
            effect="dark"
            :disabled="!scope.row.hostCompany"
            :content="'主办方:'+scope.row.hostCompany"
            placement="bottom"
          >
            <el-button
              type="text"
              style="color:#666666"
            >主办方: {{ scope.row.hostCompany || "-" }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in tableHeader"
        :key="item.key"
        align="left"
        show-overflow-tooltip
        :prop="item.key"
        :label="item.label"
        reserve-selection
        :width="item.width"
        :min-width="item.minWidth"
        :formatter="item.formatter"
      />
      <el-table-column fixed="right" label="操作" min-width="225px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="clickBtn(scope.row, '项目资料')"
          >项目资料</el-button>
          <el-button
            size="mini"
            type="text"
            @click="clickBtn(scope.row, '场地时间安排')"
          >场地时间安排</el-button>
          <el-button
            size="mini"
            type="text"
            @click="clickBtn(scope.row, '订单管理')"
          >订单管理</el-button>
        </template>
      </el-table-column>
    </TablePager>

  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
// 搜索组件
import FilterForm from '@/components/FilterForm/FilterForm2'
import TablePager from '@/components/base/TablePager'
// 分页组件
// import PaginationPage from '@/components/Pagination/index'
import pageMixin from '@/views/mixins/page'
import MainTitle from '@/components/base/MainTitle'
import { mapState } from 'vuex'
export default {
  name: 'SiteMarket',
  components: { Layout, FilterForm, MainTitle, TablePager },
  mixins: [pageMixin],
  data() {
    return {
      loading: false, // 加载效果
      page: {
        // 当前页
        pageNo: 1,
        // 每页返回的数量
        pageSize: 10,
        // 总条目数
        total: 0
      },
      // 表格数据
      tableData: [{}],
      // 获取场地销售列表数据
      getSiteMarketList: {
        projectName: null,
        type: null,
        hostName: null
      },
      filterParams: {},
      tableHeader: [
        {
          key: 'type',
          label: '类型',
          width: 120,
          formatter: (row, column, cellValue, index) => {
            const { type } = row
            return this.RESERVATION_TYPE_VALUE_ZH[type] || ''
          }
        },
        {
          key: 'field',
          label: '场地',
          minWidth: 250
        },
        {
          key: 'area',
          label: '展出面积(㎡)',
          minWidth: 120
        },
        {
          key: 'startStopTime',
          label: '起止时间',
          width: 200,
          formatter: (row, column, cellValue, index) => {
            const { startDate, endDate } = row
            return (
              <div>
                <div>从{startDate}</div>
                <div>至{endDate}</div>
              </div>
            )
          }
        },
        {
          key: 'launchDate',
          label: '开展时间',
          minWidth: 180
        }
      ]
    }
  },
  computed: {
    ...mapState({
      allTypes: state => state.site.allTypes,
      RESERVATION_TYPE_VALUE_ZH: state => state.site.RESERVATION_TYPE_VALUE_ZH
    }),
    filterProp() {
      return {
        searchKeys: [
          { value: 'projectName', label: '项目名称' },
          { value: 'hostName', label: '主办方名称' }
        ],
        filterKeys: [
          { value: 'type', label: '类型', children: this.allTypes || [] }
        ]
      }
    }
  },
  created() {
    this.get_siteMarket()
  },
  methods: {
    // 获取列表
    get_siteMarket() {
      this.loading = true
      const json = {
        ...this.filterParams,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      }
      this.$api.siteMarketList.getSiteMarket(json).then(res => {
        this.loading = false
        this.tableData = res.list
        this.page.pageNo = res.pageNum
        this.page.pageSize = res.pageSize
        this.page.total = res.total
        // console.log(this.tableData)
      })
    },
    // 搜索
    submitForm(form) {
      this.page.pageNo = 1
      this.page.pageSize = 10
      this.filterParams = {}
      const { searchKey, searchValue, filterKey, filterValue } = form
      searchKey ? this.filterParams[searchKey] = searchValue : null
      filterKey ? this.filterParams[filterKey] = filterValue : null
      this.get_siteMarket()
    },
    // 重置
    handleReset() {
      this.page.pageNo = 1
      this.page.pageSize = 10
      this.filterParams = {}
      this.get_siteMarket()
    },
    // 点击页码
    handleCurrentChange({ currentPage }) {
      this.page.pageNo = currentPage
      this.get_siteMarket()
    },
    // 按钮类型
    clickBtn(row, type) {
      const { id } = row
      switch (type) {
        case '订单管理':
          this.$router.push({ name: 'sale', params: { id: row.id, type: row.projectName }, query: { entrance: 'siteMarket' }})
          break
        case '项目资料':
          this.$router.push({
            name: 'projectData',
            query: { id: id }
          })
          break
        case '场地时间安排':
          this.$router.push({
            name: 'siteMarketTime',
            query: { id: id }
          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tooltip_new {
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  padding:4px 0 ;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #000000;
}

</style>
