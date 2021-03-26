<template>
  <div class="content_new">
    <div class="tableList">
      <MainTitle title="开票记录" />
      <div class="ul">
        <div class="li">
          <div class="name">时间：</div>
          <div class="input">
            <el-col :span="11">
              <el-date-picker
                v-model="year"
                format="yyyy 年"
                value-format="yyyy"
                type="year"
                placeholder="选择年"
              />
            </el-col>
            <el-col :span="11" :offset="2">
              <el-select v-model="month" placeholder="请选择">
                <WrapOption v-for="(item,index) of monthList" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
          </div>
        </div>
        <div class="li">
          <div class="name">项目名称：</div>
          <div class="input">
            <el-autocomplete v-model="projectName" :fetch-suggestions="querySearch" :trigger-on-focus="false" placeholder="请输入" />
          </div>
        </div>
        <div class="li">
          <div class="name">部门：</div>
          <div class="input">
            <el-select
              v-model="departmentCode"
              placeholder="请选择"
            >
              <WrapOption v-for="(item,index) of departmentList" :key="index" :label="item.name" :value="item.code" />
            </el-select>
          </div>
        </div>
        <div class="li">
          <div class="name">开票单位：</div>
          <div class="input">
            <el-select
              v-model="invoiceOffice"

              placeholder="请选择"
            >
              <WrapOption v-for="(item,index) of invoiceOfficeList" :key="index" :label="item.companyAbbreviation" :value="item.id" />
            </el-select>
          </div>
        </div>
        <div class="li" style="width:100%">
          <div class="input" style="margin-left:70px">
            <el-button
              type="primary"
              @click="query"
            >查询</el-button>
            <el-button @click="empty">重置</el-button>
          </div>
        </div>
      </div>
      <div class="refund_new">
        <el-button style="margin-bottom:20px" @click="getReportInvoiceExport">导出excel</el-button>
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
import MainTitle from '@/components/base/MainTitle'
import WrapOption from '@/components/base/WrapOption'
export default {
  components: { TablePage, PaginationPage, MainTitle, WrapOption },
  mixins: [pageMixin],
  data() {
    return {
      tableLoading: false,
      projectNameList: [], // 项目名称
      projectName: '',
      year: '',
      invoiceOffice: '', // 开票单位id
      invoiceOfficeList: [],
      departmentCode: '', // 部门Code
      departmentList: [],
      tableData: [],
      month: '0',
      monthList: [
        { label: '所有', value: '0' },
        { label: '1月份', value: '1' },
        { label: '2月份', value: '2' },
        { label: '3月份', value: '3' },
        { label: '4月份', value: '4' },
        { label: '5月份', value: '5' },
        { label: '6月份', value: '6' },
        { label: '7月份', value: '7' },
        { label: '8月份', value: '8' },
        { label: '9月份', value: '9' },
        { label: '10月份', value: '10' },
        { label: '11月份', value: '11' },
        { label: '12月份', value: '12' }
      ],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableHeader: [
        { key: 'month', text: '月份', minWidth: '60' },
        { key: 'projectName', text: '项目名称', minWidth: '120' },
        { key: 'invoiceTitle', text: '发票抬头', minWidth: '150' },
        { key: 'invoiceNo', text: '发票号码', width: '120' },
        { key: 'invoiceOffice', text: '开票单位', width: '100' },
        { key: 'invoiceTypeName', text: '发票类型', width: '100' },
        { key: 'invoiceContentName', text: '开票内容', width: '100' },
        { key: 'invoiceAmountWithoutTax', text: '不含税发票金额(元)', minWidth: '100', align: 'right' },
        { key: 'invoiceAmount', text: '发票总金额(元)', width: '140', align: 'right' },
        { key: 'invoiceDate', text: '开票日期', width: '160' },
        { key: 'remarks', text: '备注', width: '160' }
      ]
    }
  },
  computed: {

  },
  watch: {},
  mounted() {
    this.projectNameList = this.loadAll()
  },
  created() {
    var myDate = new Date()
    this.year = myDate.getFullYear().toString()
    this.getProjectName()
    this.getDepartment()
    this.getReportInvoice()
    this.getCompanyList()
  },
  methods: {
    // 开票单位
    getCompanyList() {
      this.$api.billApi.getCompanyList().then(res => {
        if (res) {
          this.invoiceOfficeList = res
        }
      })
    },
    // 导出
    getReportInvoiceExport() {
      this.$api.report.reportInvoiceExport(this.get_json())
    },
    get_json() {
      const json = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.year !== '' ? json['year'] = Number(this.year) : ''
      this.month !== '0' ? json['month'] = Number(this.month) : ''
      this.invoiceOffice !== '' ? json['invoiceOfficeId'] = this.invoiceOffice : ''
      this.projectName !== '' ? json['projectName'] = this.projectName : ''
      this.departmentCode !== '' ? json['departmentCode'] = this.departmentCode : ''
      return json
    },
    getReportInvoice() {
      this.tableLoading = true
      this.$api.report.reportInvoice(this.get_json()).then(res => {
        if (res) {
          this.tableLoading = false
          for (const i in res.list) {
            res.list[i]['invoiceTypeName'] = res.list[i].invoiceType === 'VAT_INVOICE' ? '增值税专用发票' : '普通发票'
            res.list[i]['invoiceContentName'] = res.list[i].invoiceContent === 'EXHIBITION' ? '展览服务费' : res.list[i].invoiceContent === 'MEETING' ? '会议服务费' : res.list[i].invoiceContent === 'LIGHT' ? '灯箱服务费' : res.list[i].invoiceContent === 'PAID' ? '有偿服务费' : '租金'
          }
          this.tableData = res.list
          this.total = res.total
        }
      })
    },
    query() {
      this.pageNum = 1
      this.pageSize = 10
      this.getReportInvoice()
    },
    // 重置
    empty() {
      this.month = '0'
      this.year = ''
      this.invoiceOffice = ''
      this.projectName = ''
      this.departmentCode = ''
      this.pageNum = 1
      this.pageSize = 10
      this.getReportInvoice()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getReportInvoice()
    },
    // 获取部门
    getDepartment() {
      this.$api.taskBagList.getDepartment().then(res => {
        if (res) {
          this.departmentList = res
        }
      })
    },
    getProjectName() {
      this.$api.billApi.getProjectName({}).then((res) => {
        if (res) {
          for (const i in res) {
            this.projectNameList.push({
              value: res[i].projectName,
              label: res[i].id
            })
          }
        }
      })
    },
    loadAll() {
      return this.projectNameList
    },
    querySearch(queryString, cb) {
      var restaurants = this.projectNameList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-autocomplete{
  width: 100%;
}
.el-date-editor{
  width: 100%;
}
.content_new{
  background: white;
}

.pagination{
  margin-top: 20px;
}
.refund_new{
  // display: inline-table;
  width: 100%;
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
    display: inline-table;
    margin-bottom: 20px;
    box-sizing: border-box;
    .li{
      width: 30%;
      min-width: 350px;
      margin-right: 10%;
      display: flex;
      float: left;
      margin-bottom: 12px;
      .name{
        font-size: 14px;
        font-weight: 400;
        width: 70px;
        line-height: 36px;
      }
      .input{
        flex: 1;
      }
    }
  }
}
</style>
