<template>
  <div class="content_new">
    <div class="tableList">
      <MainTitle title="项目排期表" />
      <div class="ul">
        <div class="li">
          <div class="name">项目类型：</div>
          <div class="input">
            <el-select
              v-model="types"
              multiple
              placeholder="请选择"
            >
              <WrapOption v-for="item in typeList" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </div>
        </div>
        <div class="li">
          <div class="name">年份：</div>
          <div class="input">
            <el-date-picker
              v-model="year"
              format="yyyy 年"
              value-format="yyyy"
              type="year"
              placeholder="选择年"
            />
          </div>
        </div>
        <div class="li">
          <div class="input" style="margin-left:80px">
            <el-button
              type="primary"
              @click="query"
            >查询</el-button>
            <el-button @click="empty">重置</el-button>
          </div>
        </div>
      </div>
      <div class="refund_new">
        <el-button style="margin-bottom:20px" @click="get_reportExport">导出excel</el-button>
        <table-page
          :table-loading="tableLoading"
          :table-data="tableData"
          :table-header="tableHeader"
        />
        <pagination-page
          class="pagination"
          :total="total"
          :to="pageSize"
          :current-page="pageNum"
          @handleCurrentChange="handleCurrentChange"
        />
      </div>

    </div>
  </div>
</template>
<script>
import pageMixin from '@/views/mixins/page'
import TablePage from '@/components/table/table'
import PaginationPage from '@/components/Pagination/index'
import { mapGetters, mapState } from 'vuex'
import MainTitle from '@/components/base/MainTitle'
import WrapOption from '@/components/base/WrapOption'

export default {
  components: { TablePage, PaginationPage, MainTitle, WrapOption },
  mixins: [pageMixin],
  data() {
    return {
      year: '',
      types: [], // 项目类型
      // typeList: [],
      tableLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableHeader: [
        { key: 'startDate', text: '开始时间', width: '160' },
        { key: 'endDate', text: '结束时间', width: '160' },
        { key: 'projectName', text: '项目名称', minWidth: '120' },
        { key: 'type_name', text: '类型', width: '100' },
        { key: 'area', text: '面积(㎡)', width: '100', align: 'right' },
        { key: 'hostCompanies', text: '主办方', minWidth: '120' },
        { key: 'contact', text: '联系人', width: '150' },
        { key: 'phone', text: '联系电话', width: '120' }
      ],
      tableData: []

    }
  },
  computed: {
    ...mapGetters({
      office: 'office'
    }),
    ...mapState({
      allTypes: state => state.site.allTypes,
      currentUserCodeTypes: state => state.site.currentUserCodeTypes
    }),
    typeList() {
      return this.currentUserCodeTypes.length ? this.currentUserCodeTypes : this.allTypes
    }
  },

  watch: {
  },
  created() {
    var myDate = new Date()
    this.year = myDate.getFullYear().toString()
    this.getReportProject()
  },
  methods: {
    get_json() {
      const json = {
        pageNum: this.pageNum,
        pageSize: this.pageSize

      }
      this.year !== '' ? json['year'] = Number(this.year) : ''
      Number(this.types.length) !== 0 ? json['types'] = this.types : ''
      return json
    },
    // 导出
    get_reportExport() {
      this.$api.report.reportExport(this.get_json())
    },
    query() {
      this.pageNum = 1
      this.pageSize = 10
      this.getReportProject()
    },
    getReportProject() {
      this.tableLoading = true
      this.$api.report.reportProject(this.get_json()).then(res => {
        if (res) {
          for (const i in res.list) {
            res.list[i]['type_name'] = this.get_type_name(res.list[i].type)
          }
          this.tableLoading = false
          this.tableData = res.list
          this.total = res.total
        }
      })
    },
    get_type_name(value) {
      for (const i in this.typeList) {
        if (this.typeList[i].value === value) {
          return this.typeList[i].label
        }
      }
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getReportProject()
    },
    // 重置
    empty() {
      this.types = []
      this.year = ''
      this.pageNum = 1
      this.pageSize = 10
      this.getReportProject()
    }

  }
}
</script>
<style lang="scss" scoped>
.el-date-editor{
  width: 100%;
}
.content_new{
  background: white;
}
.el-button--text{
  color: #0045FF;
}
.pagination{
  margin-top: 20px;
}
.tableList{
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  ::v-deep.el-form {
    .right_margin{
      margin-left: 68px;
    }
  }
 .table_new{
      padding: 0;
      ::v-deep .el-table{
        border-left: 1px solid #dfe6ec;
        border-top: 1px solid #dfe6ec;
        th,td{
          border-right: 1px solid #dfe6ec;
        }
      }
    }
  .ul{
    width: 100%;
    margin-bottom: 20px;
    box-sizing: border-box;
    .li{
      width: 25%;
      margin-right: 60%;
      display: flex;
      margin-bottom: 12px;
      .name{
        font-size: 14px;
        font-weight: 400;
        width: 80px;
        line-height: 36px;
      }
      .input{
        flex: 1;
      }
    }
  }
}
</style>
