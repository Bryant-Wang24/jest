<template>
  <div class="content_new">
    <div class="reportCredentials">
      <MainTitle title="证件购买统计" />
      <FilterForm
        ref="FilterForm"
        :customer-options="customerOptions"
        @searchAccount="searchAccount"
        @reset="reset"
      />
      <div class="refund_new">
        <el-button
          @click="getReportInvoiceExport"
        >导出excel</el-button>
        <TablePager
          border
          :data="list"
          :total="total"
          :to="page.pageSize"
          :current-page="page.pageNum"
          @page="getPage"
          @sort-change="changeTableSort"
        >
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
        </TablePager>
      </div>
    </div>
  </div>
</template>
<script>
import MainTitle from '@/components/base/MainTitle'
import TablePager from '@/components/base/TablePager'
import FilterForm from './components/FilterForm'
export default {
  components: { MainTitle, TablePager, FilterForm },
  data() {
    const COLLECTIVE_TYPE = {
      creationTime: 'CREATION_TIME',
      customerName: 'CUSTOMER_NAME'
    }
    const ASCENDING_ORDESCENDING = {
      ascending: true,
      descending: false
    }

    return {
      COLLECTIVE_TYPE,
      ASCENDING_ORDESCENDING,
      // 项目名称下拉框
      customerOptions: [],
      list: [
        {
          creationTime: '',
          projectName: ' ',
          customerName: '',
          customerPhone: '',
          quantity: '',
          amount: '',
          payTime: ''
        }
      ],
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      value: '',
      tableHeader: [
        {
          key: 'creationTime',
          text: '创建时间',
          sortable: 'custom'
        },
        {
          key: 'projectName',
          text: '项目名称'
        },
        {
          key: 'customerName',
          text: '公司名称',
          sortable: 'custom'
        },
        {
          key: 'customerPhone',
          text: '联系电话'
        },
        {
          key: 'quantity',
          text: '购买数量'
        },
        {
          key: 'amount',
          text: '支付金额(元)'
        },
        {
          key: 'payTime',
          text: '支付时间'
        }
      ],
      numList: '',
      orderConfigs: []
    }
  },
  created() {
    this.init()
    this.getcertificateSaleReport()
  },
  methods: {
    init() {
      const params = {
        orderConfigs: [
          {
            'field': 'CREATION_TIME',
            'ascending': false,
            'priority': 0
          }
        ]
      }
      this._getSalesDocuments(params)
    },
    changeTableSort(column) {
      this.orderConfigs = [
        {
          'field': this.COLLECTIVE_TYPE[column.prop],
          'ascending': false,
          'priority': 0
        }
      ]
      if (column.prop === 'creationTime') {
        const params = {
          orderConfigs: [
            {
              'field': this.COLLECTIVE_TYPE[column.prop],
              'ascending': this.ASCENDING_ORDESCENDING[column.order],
              'priority': 0
            }
          ]
        }
        this._getSalesDocuments(params)
      } else if (column.prop === 'customerName') {
        const params = {
          orderConfigs: [
            {
              'field': this.COLLECTIVE_TYPE[column.prop],
              'ascending': this.ASCENDING_ORDESCENDING[column.order],
              'priority': 0
            },
            {
              'field': this.COLLECTIVE_TYPE['creationTime'],
              'ascending': false,
              'priority': 1
            }
          ]
        }
        this._getSalesDocuments(params)
      }
    },
    // 查询
    searchAccount(val) {
      const params = {
        ...this.getFilterFromParams(),
        orderConfigs: [
          {
            'field': 'CREATION_TIME',
            'ascending': false,
            'priority': 0
          }
        ]
      }
      // 查询时默认初始化页码为1
      this.page.pageNum = 1
      this._getSalesDocuments(params)
      // this.getAccountList()
    },
    // 重置
    reset() {
      this.searchAccount()
      // this.page.pageNum = 1
      // this.getAccountList()
    },
    // 调用子组件的getSearchList方法---重新赋值
    getFilterFromParams() {
      return this.$refs.FilterForm.getSearchList()
    },

    getPage(page) {
      this.page.pageNum = page.currentPage
      const params = {
        orderConfigs: [
          {
            'field': 'CREATION_TIME',
            'ascending': false,
            'priority': 0
          }
        ]
      }
      this._getSalesDocuments(params)
    },
    getcertificateSaleReport() {
      this.$api.report.certificateSaleReport().then((res) => {
        this.customerOptions = res.data.data
      })
    },
    // 导出excel
    getReportInvoiceExport() {
      this.getexportReport()
    },
    // 分页
    getsalesDocuments() {
      const params = {
        page: {
          'current': '1',
          'size': '10'
        },
        orderConfigs: [
          {
            'field': 'CREATION_TIME',
            'ascending': false,
            'priority': 0
          }
        ],
        projectName: '',
        customerName: '',
        creationTime: ''
      }
      this._getSalesDocuments(params)
    },
    // 导出报表
    getexportReport() {
      const params = {
        ...this.getFilterFromParams(),
        orderConfigs: this.orderConfigs
      }
      this.$api.report.exportReport(params)
    },
    _getSalesDocuments(params) {
      const _params = {
        ...params,
        page: {
          'current': this.page.pageNum,
          'size': this.page.pageSize
        }
      }
      this.loading = true
      this.$api.report.salesDocuments(_params).then((res) => {
        this.list = res.data.records
        this.total = Number(res.data.total)
        this.page.pageSize = Number(res.data.size)
        setTimeout(() => {
          this.loading = false
        }, 300)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content_new {
  background: white;
  .reportCredentials {
    width: 100%;
    padding: 24px;
    box-sizing: border-box;
    display: inline-table;
  }
}
</style>
