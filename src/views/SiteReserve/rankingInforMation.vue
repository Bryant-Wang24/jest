<template>
  <div class="rankingInforMation">
    <div class="container">
      <!-- 顶部筛选 -->
      <FilterForm :search-keys="filterProp.searchKeys" :filter-keys="filterProp.filterKeys" @search="search" @reset="reset" />
    </div>
    <div class="table">
      <MainTitle title="排期信息发布" />
      <div class="table_add">
        <el-button @click="addReserve(true)">对外公开</el-button>
        <el-button @click="lookSchedule(false)">对外隐藏</el-button>
      </div>
      <template>
        <TablePager
          border
          :data="tableData"
          :total="total"
          :to="page.pageSize"
          :current-page="page.pageNo"
          @page="getPage"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            v-for="item in tableHeader"
            :key="item.key"
            align="left"
            show-overflow-tooltip
            :label="item.text"
            :formatter="item.formatter"
            :sortable="item.sortable"
            :sort-method="item['sort-method'] || null"
            :prop="item.key"
          />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleView(scope.row)">项目详情</el-button>
            </template>
          </el-table-column>
        </TablePager>
      </template>
    </div>
  </div>
</template>
<script>
import FilterForm from '@/components/FilterForm/FilterForm2'
import MainTitle from '@/components/base/MainTitle'
import TablePager from '@/components/base/TablePager'
import moment from 'moment'

const OPEN_PROJECT = [
  {
    label: '公开',
    value: true
  },
  {
    label: '隐藏',
    value: false
  }
]

export default {
  name: 'RankingInforMation',
  components: {
    FilterForm,
    MainTitle,
    TablePager
  },
  data() {
    return {
      OPEN_PROJECT,
      // COMPANY_NATURE: COMPANY_NATURE,
      // STATE: STATE,
      total: 0,
      tableData: [],
      projectName: '',
      isPubliclist: [],
      page: {
        // 当前页
        pageNo: 1,
        // 每页返回的数量
        pageSize: 10
      },
      id: '',
      tableHeader: [
        {
          key: 'projectName',
          text: '项目名称'
          //   sortable: 'custom'
        },
        {
          key: 'hostCompany',
          text: '主办方'
        },
        {
          key: 'startDate',
          text: '开展时间',
          formatter: (row) => {
            let { startDate, endDate } = row
            startDate = moment(startDate).format('YYYY-MM-DD')
            endDate = moment(endDate).format('YYYY-MM-DD')
            return `${startDate} 至 ${endDate}`
          }
        },
        {
          key: 'exhibiton',
          text: '展馆'
        },
        {
          key: 'isPublic',
          text: '对外',
          formatter: (row) => {
            const { isPublic } = row
            return isPublic === false ? '隐藏' : '公开'
          }
        }
      ],
      filterParams: {} // 保存顶部筛选数据，用于分页查询时获取筛选
    }
  },
  computed: {
    filterProp() {
      return {
        searchKeys: [
          { value: 'projectName', label: '项目名称' }
          // { value: 'hostName', label: '主办名称' }
        ],
        filterKeys: [
          { value: 'isPublic', label: '对外', children: this.OPEN_PROJECT }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    handleSelectionChange(val) {
      this.isPubliclist = val
    },
    init() {
      this.getpageNation()
    },
    // 查看
    handleView(row) {
      const { id } = row
      this.id = id
      this.$router.push({
        name: `RankingInforMationInfo`,
        params: { id: this.id }
      })
    },
    // 分页
    getpageNation() {
      const params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        siteOrderState: 'LOCK'
      }
      this.$api.siteReserveList.pageNation(params).then(res => {
        this.tableData = res.list
        this.page.pageNo = res.pageNum
        this.page.pageSize = res.pageSize
        this.total = res.total
      })
    },
    // 查询
    search({ searchValue, filterValue }) {
      this.filterParams = {
        projectName: searchValue,
        isPublic: filterValue
      }

      const params = {
        pageNo: 1,
        pageSize: 10,
        ...this.filterParams,
        siteOrderState: 'LOCK'
      }
      this.page.pageNo = 1
      this.pageNation(params)
    },
    pageNation(params) {
      this.$api.siteReserveList.pageNation(params).then(res => {
        this.tableData = res.list
        this.page.pageNo = res.pageNum
        this.page.pageSize = res.pageSize
        this.total = res.total
      })
    },
    reset() {
      this.filterParams = {}
      this.page.pageNo = 1
      this.page.pageSize = 10
      this.getpageNation()
    },
    addReserve(val) {
      this.PublichideMethod(val)
    },
    lookSchedule(val) {
      this.PublichideMethod(val)
    },
    PublichideMethod(val) {
      var list = this.isPubliclist
      if (list.length === 0) return this.$message.warning('请选择对应的数据')
      var arr = []
      for (var i in list) {
        arr.push(list[i].id)
        if (val === true) {
          if (list[i].isPublic !== val) {
            const params = {
              true: arr
            }
            this.$api.siteReserveList.isPublicExternal(params).then(res => {
              this.reset()
            })
          }
        } else {
          if (list[i].isPublic !== val) {
            const params = {
              false: arr
            }
            this.$api.siteReserveList.isPublicExternal(params).then(res => {
              this.reset()
            })
          }
        }
      }
    },
    getPage(page) {
      this.page.pageNo = page.currentPage
      const params = {
        ...this.page,
        ...this.filterParams,
        siteOrderState: 'LOCK'
      }
      this.pageNation(params)
    }
  }
}
</script>
<style lang="scss" scoped>
.rankingInforMation {
  padding: 20px;
  .container {
    padding: 20px 20px 0 20px;
    margin-bottom: 20px;
    background-color: #fff;
  }
  .table {
    margin-top: 20px;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background: white;
  }
}
</style>
