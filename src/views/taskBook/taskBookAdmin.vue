<template>
  <Layout :use-head="true" :use-foot="false" :auto-height="true">
    <!-- 搜索组件 -->
    <FilterForm slot="head" :search-keys="filterProp.searchKeys" :filter-keys="filterProp.filterKeys" @search="submitForm" @reset="handleReset" />
    <MainTitle title="任务书管理" />
    <!-- 数据列表组件 -->
    <DataList :data-item-list="dataItemList" :loading="loading" @parentEvent="sonClick" />
    <!-- 分页组件 -->
    <pagination-page
      :total="total"
      :to="pageSize"
      :current-page="pageNum"
      @handleCurrentChange="handleCurrentChange"
    />
    <!-- 下发任务书弹窗 -->
    <el-dialog
      :visible.sync="dialog.centerDialogVisibleIssus"
      :width="dialog.width"
      :close-on-click-modal="false"
      :title="TITLE[dialog.type]"
    >
      <template v-if="dialog.type === DIALOG_TYPE['SEND_BOOK']">
        <SendTaskBook v-if="dialog.centerDialogVisibleIssus" :is-paid="dialog.isPaid" :is-rescinded="dialog.isRescinded" :task-book-id="dialog.taskBookId" @confirm="confirm" @call="call" />
      </template>

      <!-- 交接单详情 -->
      <div v-if="dialog.type === DIALOG_TYPE['SHOW_HANDOVER'] && dialog.centerDialogVisibleIssus">
        <handoverSlipInfo :propid="handoverSlipId" />
        <div style="text-align: center;">
          <el-button @click="call">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </Layout>
</template>

<script>
import Layout from '@/components/base/Layout'
import handoverSlipInfo from '@/views/handoverSlipMgmt/components/handoverSlipInfo'
// 搜索组件
import FilterForm from '@/components/FilterForm/FilterForm2'
// 数据列表组件
import DataList from '@/views/taskBook/components/dataList'
// 分页组件
import PaginationPage from '@/components/Pagination/index'

import SendTaskBook from './components/sendTaskBook'
import pageMixin from '@/views/mixins/page'
import { DIALOG_TYPE, TASK_BOOK_STATE_OPTIONS } from '@/common/taskBook'
import MainTitle from '@/components/base/MainTitle'
// const CONTENT = {
//   PAID: '任务书将下发到各个执行部门',
//   NO_PAID: '',
//   RESCINDED: '当前项目已撤销，无法下发任务书'
// }

// const TIP = {
//   PAID: '下发任务书后将不可再进行修改',
//   NO_PAID: '当前项目款项未结清，输入口令后才可下发任务书'
// }

const TITLE = {
  [DIALOG_TYPE.SEND_BOOK]: '下发任务书',
  [DIALOG_TYPE.SHOW_HANDOVER]: '查看交接单'
}

export default {
  name: 'TaskBookAdmin',
  components: { Layout, FilterForm, PaginationPage, DataList, handoverSlipInfo, SendTaskBook, MainTitle },
  mixins: [pageMixin],
  data() {
    return {
      TITLE,
      DIALOG_TYPE,
      taksID: null, // 任务书id
      handoverSlipId: null, // 交接单id
      dialog: {
        type: DIALOG_TYPE.SEND_BOOK,
        centerDialogVisibleIssus: false,
        isPaid: true,
        isRescinded: false,
        width: '30%',
        input: ''
      },
      id: null, // 列表数据id
      // 筛选项匹配数据
      siteTypeList: TASK_BOOK_STATE_OPTIONS,
      // 列表数据
      dataItemList: [],
      // 获取数据列表
      pageNum: 1, // 当前页
      pageSize: 10, // 每页数量
      total: 0, // 总条数
      loading: false, // 加载状态
      filterParams: {}
    }
  },
  computed: {
    filterProp() {
      return {
        searchKeys: [
          { value: 'projectName', label: '项目名称' },
          { value: 'coordinator', label: '统筹负责人' },
          { value: 'hostCompany', label: '主办方' }
        ],
        filterKeys: [
          { value: 'taskBookState', label: '任务书状态', children: this.siteTypeList }
        ]
      }
    }
    // content() {
    //   const { isPaid, isRescinded } = this.dialog
    //   if (isRescinded) {
    //     return CONTENT.RESCINDED
    //   }
    //   return isPaid ? CONTENT.PAID : CONTENT.NO_PAID
    // },
    // tip() {
    //   const { isPaid, isRescinded } = this.dialog
    //   if (isRescinded) {
    //     return ''
    //   }
    //   return isPaid ? TIP.PAID : TIP.NO_PAID
    // }
  },
  mounted() {
    this.get_taskBookList() // 获取任务书列表
  },
  methods: {
    // 确定按钮下发
    confirm(params) {
      // const params = {}
      // const { isPaid, input } = this.dialog

      // if (!isPaid) {
      //   params.token = input
      // }

      this.$api.taskBookList.issue_taskBook(params).then(res => {
        if (res) {
          this.$message.success('下发成功')
          this.get_taskBookList()
        }
      }).finally(() => {
        this.dialog.centerDialogVisibleIssus = false
      })
    },
    // 取消
    call() {
      this.dialog.centerDialogVisibleIssus = false
    },
    // 子组件弹窗
    sonClick(data) {
      const { type } = data
      this.dialog.centerDialogVisibleIssus = true
      this.dialog.type = type
      this.dialog.input = ''
      switch (type) {
        case DIALOG_TYPE['SEND_BOOK']: // 下发任务书
          this.taksID = data.taskBookId
          this.dialog.taskBookId = data.taskBookId
          this.dialog.isPaid = data.isPaid
          this.dialog.isRescinded = data.isRescinded
          this.dialog.width = '30%'
          break
        case DIALOG_TYPE['SHOW_HANDOVER']: // 查看交接单
          this.handoverSlipId = data.handoverSlipId
          this.dialog.width = '65%'
          break

        default:
          break
      }
    },
    // 获取数据列表
    get_taskBookList() {
      this.loading = true
      const json = {
        dataBelong: 'GZ_POLY',
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ...this.filterParams
      }
      this.$api.taskBookList.get_taskBookList(json).then(res => {
        if (res) {
          this.pageNum = res.pageNum
          this.total = res.total
          this.dataItemList = res.list
        }
        this.loading = false
      }).finally(() => {
        this.loading = false
      })
    },
    // 搜索
    submitForm(form) {
      this.filterParams = {}
      const { searchKey, searchValue, filterKey, filterValue } = form
      searchKey ? this.filterParams[searchKey] = searchValue : null
      filterKey ? this.filterParams[filterKey] = filterValue : null
      this.pageNum = 1
      this.pageSize = 10
      this.get_taskBookList()
    },
    // 筛选
    handleReset() {
      this.pageNo = 1
      this.pageSize = 10
      // this.list.search.value = ''
      // this.list.fuzzyName.value = ''
      // this.list.screen.value = ''
      // this.list.isType.value = ''
      this.filterParams = {}
      this.get_taskBookList()
    },
    // 点击页码
    handleCurrentChange(val) {
      this.pageNum = val
      this.get_taskBookList()
    }
  }
}
</script>

<style lang="scss" scoped>
#taskBookAdmin {
  padding: 20px;
  .container {
    padding: 20px;
    background-color: #fff;
    // margin-top: 20px;
  }
}
.dialogWrap {

  .content {
    padding-bottom: 20px;
    font-size: 16px;
  }
  .token {
    display: flex;
    margin-top: 20px;
    text-align: center;
    span {
      line-height: 36px;
    }
    .input {
      flex: 1;
    }
  }
  .tip{
    // text-align: center;
    color: #ccc;
    font-size: 14px;
  }
  .btn {
    margin-top: 30px;
    text-align: center;
  }
}
</style>
