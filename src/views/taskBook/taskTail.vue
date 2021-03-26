<template>
  <div id="taskTail">
    <div v-loading="loading" element-loading-text="拼命加载中" class="container">
      <div class="title">
        <span class="title_name">{{ projectName }}</span>
        <span v-cloak class="title_date">({{ startDate }} ~ {{ endDate }})</span>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="(item,index) in list" :key="index" :label="item.label" :name="item.value">
          <div class="table">
            <div v-if="!item.data.taskLink" class="table_text">暂无数据</div>
            <div v-for="(tableItem,tableIndex) in item.data.taskLink" :key="tableIndex" class="table_item">
              <rowText :text="tableItem.linkName" />
              <el-table
                ref="taskTailTable"
                :data="tableItem.completeTaskLinkDetail"
                style="width:100%"
                empty-text="暂无数据"
                border
              >
                <el-table-column
                  prop="taskLinkDetail.departmentName"
                  label="部门"
                  sortable
                  min-width="116px"
                />
                <el-table-column
                  label="时间"
                  min-width="127px"
                  :formatter="(row, column) => {
                    return row.taskLinkDetail.startTime + '-' + row.taskLinkDetail.endTime
                  }"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="taskLinkDetail.workItem"
                  label="工作项"
                  min-width="220px"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="taskLinkDetail.remark"
                  label="备注"
                  min-width="308px"
                />
                <el-table-column
                  label="执行状态"
                  min-width="110px"
                  sortable
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.taskLine.status === 'NOT_SEND'">待执行</span>
                    <span v-if="scope.row.taskLine.status === 'HAVE_ACCEPTED'">执行中</span>
                    <span v-if="scope.row.taskLine.status === 'HAVE_SEND'">已完成</span>
                    <span v-if="scope.row.taskLine.status === 'CANCELLED'">已取消</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="执行人"
                  show-overflow-tooltip
                  min-width="92px"
                  :formatter="(row, column) => {
                    return row.taskLine.delivererName ? row.taskLine.delivererName : '-'
                  }"
                />
                <el-table-column
                  label="执行时间"
                  min-width="178px"
                  :formatter="(row, column) => {
                    return row.taskLine.updateDate ? row.taskLine.updateDate : '-'
                  }"
                />
                <el-table-column
                  show-overflow-tooltip
                  label="说明"
                  min-width="200px"
                  :formatter="(row, column) => {
                    return row.taskLine.remarks ? row.taskLine.remarks : '-'
                  }"
                />
                <el-table-column
                  label="操作"
                  min-width="150px"
                >
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.taskLine.status === 'HAVE_SEND'" size="mini" type="text" class="imgBtn" @click="lookPicture(scope.row)">查看图片</el-button>
                    <el-popover
                      placement="bottom"
                      popper-class="popperClass"
                      trigger="click"
                    >
                      <div class="content">
                        <div class="one">
                          <span class="oneSpan" />
                          <span>{{ logs.completed.name || '' }} 完成于 {{ logs.completed.createDate || '' }}</span>
                        </div>
                        <div class="two">
                          <span class="twoSpan" />
                          <span class="twoSpan" />
                        </div>
                        <div class="three">
                          <span class="threeSpan" />
                          <span>{{ logs.begin.name || '' }} 开始于 {{ logs.begin.createDate || '' }}</span>
                        </div>
                      </div>
                      <el-button v-if="scope.row.taskLine.status === 'HAVE_SEND'" slot="reference" size="mini" type="text" @click="handRecord(scope.row)">操作记录</el-button>
                    </el-popover>

                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import rowText from '@/components/rowText'
import pageMixin from '@/views/mixins/page'
import moment from 'moment'
export default {
  name: 'Tasktail',
  components: { rowText },
  mixins: [pageMixin],
  data() {
    return {
      // visible: false,
      logs: {
        completed: {},
        begin: {}
      }, // logs 数据
      id: null, // 交接单id
      projectName: '', // 项目名字
      startDate: '', // 项目开始时间
      endDate: '', // 项目结束时间
      tableIndexType: [], // 环节数组
      // dataList: {}, // 路由传参
      loading: false, // 加载状态
      tableDataList: [], // 表格数据
      text: '',
      activeName: '',
      tabsHeader: [
      ],
      list: [] // 格式化部门数据
    }
  },
  async created() {
    await this.get_department()
    this.get_data()
  },
  methods: {
    // 查看图片
    lookPicture(row) {
      const { imageInfos } = row
      const imgArr = imageInfos.map(item => {
        return { url: item.address, alt: '' }
      })
      this.$viewer(imgArr)
    },
    // 操作记录
    handRecord(row) {
      console.log(row)
      const { logs } = row
      logs.map(item => {
        const { fromState, toState, createBy, createDate } = item
        if (fromState === 'NOT_SEND' && toState === 'HAVE_ACCEPTED') {
          this.logs.begin = {
            name: createBy.name,
            createDate: moment(createDate).format('YYYY-MM-DD HH:mm:ss')
          }
        }
        if (fromState === 'HAVE_ACCEPTED' && toState === 'HAVE_SEND') {
          this.logs.completed = {
            name: createBy.name,
            createDate: moment(createDate).format('YYYY-MM-DD HH:mm:ss')
          }
        }
      })
    },
    // 通过id获取任务跟踪
    get_data() {
      this.id = this.$route.query.id
      this.$api.taskBookList.task_UP(this.id).then(res => {
        console.log(res, '数据')
        const { department, pageModel } = res
        this.department = department
        this.projectName = pageModel.projectName
        this.startDate = pageModel.startDate
        this.endDate = pageModel.endDate
        const obj = {}
        for (let i = 0; i < department?.length; i++) {
          const { value } = department[i]
          if (!Object.prototype.hasOwnProperty.call(obj, value)) {
            obj[value] = department[i]
          } else {
            obj[value].push(department[i])
          }
        }

        const list = this.tabsHeader.map(item => {
          const { value } = item
          item['data'] = obj[value] || {}
          return item
        })
        this.list = list
        this.loading = false
      })
    },
    // 获取部门接口
    get_department() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$api.taskBookList.get_departmentList().then(res => {
          console.log(res)
          this.tabsHeader = res
          this.activeName = res[0].value
          resolve()
        }).catch(e => { reject() })
      })
    }
  }

}
</script>

<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
  #taskTail {
    padding: 20px;
    .container {
      padding: 20px;
      background-color: #fff;
      .title {
        font-size: 16px;
        padding: 20px 0;
        .title_name {
        font-weight: bold;
        }
        .title_date {
        color: #888;
        margin-left: 10px;
        }
      }
    }
  }
//   .rowTitle[data-v-2720aa0a] {
//     margin: 20px 0;
// }
.rowTitle {
  margin: 20px 0;
}
.oneSpan {
  display:inline-block;
  width: 8px;
  height: 8px;
  background-color:$--custom--color--primary;
  border-radius:4px;
  margin-right: 5px;
}
::v-deep .el-popover {
  padding:13px;
}
.twoSpan {
  display:block;
  width: 4px;
  height: 4px;
  background-color: #ccc;
  border-radius: 2px;
  margin: 5px 0;
  margin-left: 2px;
}
.threeSpan{
  display:inline-block;
  width: 8px;
  height: 8px;
  background-color:#FF8833;
  border-radius:4px;
  margin-right: 5px
}
.table_text {
  text-align: center;
}
.imgBtn {
  margin-right: 10px;
}
[v-cloak]{
  display: none;
}
.popperClass {
  min-width: 92px;
}
</style>
