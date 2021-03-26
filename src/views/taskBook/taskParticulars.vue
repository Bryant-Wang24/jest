<template>
  <div id="taskParticulars">
    <div class="container">
      <div class="title">
        <span class="title_name">{{ linkName }}</span>
        <span class="title_date">({{ linkDate }})</span>
      </div>
      <div class="titleBtn">
        <el-button type="primary" @click="batchSave(true)">保存</el-button>
        <el-button @click="choiceBag">选择任务包</el-button>
        <el-button @click="copyBtn">复制任务</el-button>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="(item,index) in tabsHeader" :key="index" :label="item.label" :name="item.name">
          <div class="btn">
            <el-button @click="addTask">添加任务</el-button>
            <el-button @click="batchDelete(index)">批量删除</el-button>
          </div>
          <div class="table">
            <el-form
              ref="tableForm"
              :model="item.tableForm"
            >
              <el-table
                ref="linkTable"
                v-loading="tableLoading"
                class="linkTable"
                :data="item.tableForm.tableData"
                style="width: 90%"
                :header-cell-style="{color: '#333',fontWeight:'normal',fontSize: '16px',backgroundColor: '#FAFAFA'}"
                :cell-style="{color: '#000', fontSize: '14px'}"
                border
                @select="handleChange"
                @selection-change="handleSelectionChange($event, item)"
              >
                <el-table-column
                  type="selection"
                  min-width="50px"
                />
                <el-table-column prop="departmentName" label="部门" min-width="124px" />
                <el-table-column label="时间" min-width="170px">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-time-picker
                        v-model="scope.row.TimeArr"
                        value-format="HH:mm"
                        format="HH:mm"
                        is-range
                        range-separator="~"
                        start-placeholder="-"
                        end-placeholder="-"
                        placeholder="选择时间范围"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="工作项" min-width="472px">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model.trim="scope.row.workItem" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="备注" min-width="472px">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.remark" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100px">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      @click.stop="clickBtn(scope.row, '删除',scope.$index,index)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="bottom_btn">
        <el-button @click="back">返回列表</el-button>
      </div>
      <!-- 复制任务弹窗 -->
      <el-dialog
        title="复制任务"
        :close-on-click-modal="false"
        :visible.sync="copyDialogVisible"
        width="40%"
      >
        <div class="copyTitle">复制已设置的任务环节, 批量填充任务明细</div>
        <div class="copyForm">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="环节名称:">
              <el-select v-model="form.linkName" placeholder="请选择">
                <WrapOption v-for="item in copyList" :key="item.id" :label="item.linkName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="copyConfirm">确 定</el-button>
          <el-button @click="copycall">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 选择任务包 -->
      <el-dialog
        title="选择任务包"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        width="50%"
      >
        <div v-if="!taskBagData.length" class="text-center">暂无数据</div>
        <el-tabs v-model="taskBagActiveName" class="taskBagActive">
          <el-tab-pane v-for="(item,index) in taskBagData" :key="index" :label="item.name" :name="String(item.id)">
            <div class="title">
              <div>任务明细</div>
            </div>
            <div class="table">
              <el-table
                ref="taskBag"
                v-loading="taskBagTableLoading"
                style="width: 100%"
                :data="bagData"
                :empty-text="'暂无数据'"
                :header-cell-style="{color: '#333',fontWeight:'normal',fontSize: '16px',backgroundColor: '#FAFAFA'}"
                :cell-style="{color: '#000', fontSize: '14px'}"
                border
              >
                <el-table-column prop="departmentName" label="部门" width="150" />
                <el-table-column prop="workItem" label="工作项" />
              </el-table>
            </div>
            <div class="pages">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total ? total : 1"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirm">确 定</el-button>
          <el-button @click="call">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import WrapOption from '@/components/base/WrapOption'
// import { logger } from 'runjs/lib/common'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  name: 'TaskParticulars',
  components: { WrapOption },
  data() {
    return {
      beforeUnloadTime: '',
      gapTime: '',

      linkId: null, // 路由传参过来的环节id
      linkName: '', // 路由传参过来的环节名字
      linkDate: '', // 路由传参过来的环节时间
      taskBookId: null, // 任务书id
      startTime: '',
      endTime: '',
      activeName: '', // tabs绑定变量
      taskLinkDetail: [], // 部门数据
      tabsHeader: [], // tabs数据源
      copyDialogVisible: false, // 复制任务弹框状态
      // // 复制任务表单
      form: {
        linkName: ''
      },
      copyList: [], // 复制任务列表数据
      id: null,
      total: 1,
      batchSaveList: [], // 批量保存数组
      taskDetailList: {}, // 批量删除id对象数组
      taskDetailItemList: {}, // 批量删除对象数组
      dialogVisible: false, // 选择任务包弹框状态
      taskBagActiveName: '', // 任务包tabs默认值
      taskBagData: [], // 任务包数据
      taskBagTableLoading: false, // 任务包加载状态
      bagData: [],
      arr: [],
      // // 表格验证
      // rules: {
      //   workItem: [{ required: true, message: '请输入工作项', trigger: 'blur' }]
      // },
      emptyText: '暂无数据',
      tableLoading: false,
      ParticularsList: [], // 所有部门任务list
      timePreservation: '', // 定时保存
      selectionList: []// 删除数据
    }
  },
  computed: {
    ...mapGetters({
      office: 'office'
    })
  },
  watch: {
    taskBagActiveName(val) {
      this.get_pageTaskBag_Particulars(val)
    }
  },
  async created() {
    const { linkId, linkName, linkDate, taskBookId, startTime, endTime } = this.$route.query
    this.linkId = linkId
    this.linkName = linkName
    this.linkDate = linkDate
    this.taskBookId = taskBookId
    this.startTime = startTime
    this.endTime = endTime
    await this.getDepartmentList()
    this.get_taskDetail(true)
    this.set_taskBagList()
    window.addEventListener('beforeunload', e => this.updateHandler(e))
  },
  mounted() {
    this.timePreservation = setInterval(this.getTimePreservation, 30000)
    window.onbeforeunload = function(e) {
      return '浏览器关闭！'
    }
  },
  beforeDestroy() {
    window.onbeforeunload = function(e) {
      return
    }
    clearInterval(this.timePreservation)
  },
  destroyed() {
    this.batchSave(false)
    window.removeEventListener('beforeunload', e => this.updateHandler(e))
  },

  methods: {
    getTimePreservation() {
      this.batchSave(false)
    },
    updateHandler(e) {
      this.batchSave(false)
    },
    // 获取部门
    getDepartmentList() {
      return new Promise((resolve, reject) => {
        this.$api.taskBookList.get_departmentList().then(res => {
          this.taskLinkDetail = res
          this.activeName = this.taskLinkDetail[0].value
          resolve()
        }).catch(e => { reject() })
      })
    },
    // // 部门循环渲染
    forDepartment() {
      this.tabsHeader = []
      for (let i = 0; i < this.taskLinkDetail.length; i++) {
        const item = this.taskLinkDetail[i]
        this.tabsHeader.push({
          label: item.label,
          name: item.value,
          tableForm: {
            tableData: [{
              id: '',
              linkId: this.linkId,
              departmentCode: item.value,
              departmentName: item.label,
              TimeArr: [moment(this.startTime).format('HH:mm'), moment(this.endTime).format('HH:mm')],
              workItem: '',
              remark: '',
              createTime: '',
              createBy: '',
              updateTime: '',
              updateBy: ''
            }]
          }

        })
      }
    },
    taskLinkDetailName(departmentCode) {
      for (const i in this.taskLinkDetail) {
        if (this.taskLinkDetail[i].value === departmentCode) {
          return this.taskLinkDetail[i].label
        }
      }
    },
    // 环节明细列表数据整合
    taskDetailOk(list) {
      this.ParticularsList = list
      const obj = {}
      for (let i = 0; i < list?.length; i++) {
        const { departmentCode } = list[i]
        if (!Object.prototype.hasOwnProperty.call(obj, departmentCode)) {
          obj[departmentCode] = [list[i]]
        } else {
          obj[departmentCode].push(list[i])
        }
      }
      for (const key in obj) {
        obj[key]['departmentName'] = this.taskLinkDetailName(key)
        for (let j = 0; j < obj[key].length; j++) {
          obj[key][j] = {
            // filter: ,
            createBy: obj[key][j].createBy,
            createTime: obj[key][j].createTime,
            departmentCode: obj[key][j].departmentCode,
            departmentName: obj[key].departmentName,
            id: obj[key][j].id,
            linkId: obj[key][j].linkId,
            remark: obj[key][j].remark,
            updateBy: obj[key][j].updateBy,
            updateTime: obj[key][j].updateTime,
            workItem: obj[key][j].workItem,
            TimeArr: [obj[key][j].startTime, obj[key][j].endTime]
          }
        }
        for (let i = 0; i < this.tabsHeader.length; i++) {
          if (key === this.tabsHeader[i].name) {
            this.tabsHeader[i].tableForm.tableData = [...obj[key]]
          }
        }
      }
    },
    // // 获取环节明细列表
    get_taskDetail(val) {
      this.forDepartment()
      this.tableLoading = val
      const json = {
        linkId: this.linkId
      }
      this.$api.taskBookList.ParticularsList(json).then(res => {
        if (res) {
          this.tableLoading = false
          this.taskDetailOk(res.list)
        }
      })
    },
    // 返回列表
    back() {
      this.$router.go(-1)
    },
    // 任务包弹窗右上角关闭按钮
    handleClose() {
      this.dialogVisible = false
    },
    // 任务包弹窗取消
    call() {
      this.dialogVisible = false
    },
    // 获取复制任务环节
    get_copy() {
      const json = {
        id: this.linkId,
        taskBookId: this.taskBookId
      }
      this.$api.taskBookList.get_copyList(json).then(res => {
        this.copyList = res
      })
    },
    // 复制任务
    copyBtn() {
      this.copyDialogVisible = true
      this.get_copy()
    },
    // 复制确认按钮
    copyConfirm() {
      if (this.form.linkName !== '') {
        this.$api.taskBookList.ParticularsList({ linkId: this.form.linkName }).then(res => {
          const obj = {}
          const arr = res.list
          console.log(arr)
          for (let i = 0; i < arr?.length; i++) {
            const element = arr[i]
            const { departmentCode } = element
            if (!Object.prototype.hasOwnProperty.call(obj, departmentCode)) {
              obj[departmentCode] = [element]
            } else {
              obj[departmentCode].push(element)
            }
          }
          for (const key in obj) {
            for (let j = 0; j < obj[key].length; j++) {
              obj[key][j] = {
                id: '',
                linkId: this.linkId,
                departmentCode: obj[key][j].departmentCode,
                departmentName: obj[key][j].departmentName,
                createBy: obj[key][j].createBy,
                createTime: obj[key][j].createTime,
                TimeArr: [obj[key][j].startTime, obj[key][j].endTime],
                workItem: obj[key][j].workItem,
                remark: obj[key][j].remark,
                updateTime: obj[key][j].updateTime,
                updateBy: obj[key][j].updateBy
              }
              for (let i = 0; i < this.tabsHeader.length; i++) {
                if (key === this.tabsHeader[i].name) {
                  this.tabsHeader[i].tableForm.tableData.push(obj[key][j])
                }
              }
            }
          }
          this.$message.success('复制成功')
          this.copyDialogVisible = false
        })
      } else {
        this.$message.warning('请选择环节')
      }
    },
    // 复制取消按钮
    copycall() {
      this.copyDialogVisible = false
    },
    // 获取任务包
    set_taskBagList() {
      this.$api.taskBookList.get_taskBagList().then(res => {
        const taskBookList = res.filter(item => {
          return item.enable === 0 && item.departmentCode === this.office.code
        })
        this.taskBagData = taskBookList.sort((a, b) => { return new Date(a.createDate).getTime() - new Date(b.createDate).getTime() })
      })
    },
    // // 选择任务包
    choiceBag() {
      this.dialogVisible = true
      this.taskBagActiveName = String(this.taskBagData[0]?.id || '')
    },
    // 监听获取数据
    get_pageTaskBag_Particulars(id) {
      this.taskBagTableLoading = true
      this.$api.taskBookList.pageTaskBag_Particulars({ packageId: id }).then(res => {
        // 按字母排序
        this.bagData = res.list.sort((a, b) => {
          if (a.departmentCode < b.departmentCode) return -1
          if (a.departmentCode > b.departmentCode) return 1
          return 0
        })
        this.total = this.bagData?.total
      }).finally(() => {
        this.taskBagTableLoading = false
      })
    },
    handleChange(selection, row) {
      console.log(selection)
      console.log(row)
    },
    // 批量选项发生改变
    handleSelectionChange(val, item) {
      this.selectionList = []
      this.selectionList = val
      console.log('handleSelectionChange', val, item)
      // if (Object.prototype.hasOwnProperty.call(this.taskDetailList, item.name)) {
      //   this.taskDetailList[item.name] = [...val]
      // } else {
      const arr = []
      for (let i = 0; i < val.length; i++) {
        const t = val[i]
        if (t.id) {
          arr.push(t.id)
        }
      }
      // const arr = val.filter(t => !!t.id)
      this.taskDetailList[item.name] = [...arr]
      this.taskDetailItemList[item.name] = [...val]
      // }
      // this.taskDetailList = [...this.taskDetailList, ...val]
    },
    // // 添加任务
    addTask() {
      for (let i = 0; i < this.tabsHeader.length; i++) {
        const item = this.tabsHeader[i]
        if (item.name === this.activeName) {
          item.tableForm.tableData.push({
            id: '',
            linkId: this.linkId,
            departmentCode: item.name,
            departmentName: item.label,
            TimeArr: [moment(this.startTime).format('HH:mm'), moment(this.endTime).format('HH:mm')],
            workItem: '',
            remark: '',
            createTime: '',
            createBy: '',
            updateTime: '',
            updateBy: ''
          })
        }
      }
    },
    // // 操作按钮
    clickBtn(row, type, index, pindex) {
      var obj = JSON.stringify(row)
      var res = JSON.parse(obj)
      switch (type) {
        case '删除':
          this.$confirm('是否继续此操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (res.id !== '') {
              this.$api.taskBookList.delete_Particulars(res.id).then(res => {
                this.tabsHeader[pindex].tableForm.tableData.splice(index, 1)
                this.$message.success('已删除')
                // 增加初始化单条数据
                if (this.tabsHeader[pindex].tableForm.tableData.length === 0) {
                  this.tabsHeader[pindex].tableForm.tableData.push({
                    id: '',
                    linkId: this.linkId,
                    departmentCode: this.tabsHeader[pindex].name,
                    departmentName: this.tabsHeader[pindex].label,
                    TimeArr: [moment(this.startTime).format('HH:mm'), moment(this.endTime).format('HH:mm')],
                    workItem: '',
                    remark: '',
                    createTime: '',
                    createBy: '',
                    updateTime: '',
                    updateBy: ''
                  })
                }
                // this.get_taskDetail()
              })
            } else {
              if (this.tabsHeader[pindex].tableForm.tableData.length === 1 && res.id === '') {
                this.$message.warning('至少填写一条数据')
              } else {
                this.tabsHeader[pindex].tableForm.tableData.splice(index, 1)
                this.$message.success('已删除')
              }
            }
          }
          ).catch(() => {})
          break
      }
    },
    // 批量保存
    batchSave(val) {
      const arr = []
      for (let i = 0; i < this.tabsHeader.length; i++) {
        for (let j = 0; j < this.tabsHeader[i].tableForm.tableData.length; j++) {
          const element = this.tabsHeader[i].tableForm.tableData[j]
          const { id, TimeArr, departmentCode, workItem, remark } = element
          if (workItem !== '' || remark !== '') {
            arr.push({
              id,
              linkId: this.linkId,
              startTime: TimeArr[0],
              endTime: TimeArr[1],
              departmentCode,
              workItem,
              remark
            })
          }
        }
      }
      const json = {
        linkDetails: arr,
        linkId: this.linkId
      }
      this.$api.taskBookList.batch_Particulars(json).then(res => {
        if (res) {
          if (val) {
            this.$message.success('已保存')
          }
          // this.get_taskDetail()
          this.taskDetailOk(res)
        }
      })
    },
    // 批量删除
    batchDelete(index) {
      let ids = [] // 被选中的id数组
      for (const key in this.taskDetailList) {
        const detail = this.taskDetailList[key]
        ids = [...ids, ...detail]
      }
      if (Number(ids.length) === 0) return this.$message.warning('请选择要删除的数据')
      // if (this.taskDetailList.length > 0) {
      this.$confirm('是否继续此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // const tableData = this.tabsHeader[index].tableForm.tableData
        // const taskLinkDetail = []

        const noCheckAndHasIdList = this.ParticularsList.filter(t => {
          return !ids.includes(t.id)
        })
        const params = {
          linkDetails: noCheckAndHasIdList,
          linkId: this.linkId
        }
        this.$api.taskBookList.batch_Particulars(params).then(res => {
          if (res) {
            this.$message.success('已删除')
            for (let i = 0; i < this.tabsHeader.length; i++) {
              const item = this.tabsHeader[i]
              const tableData = this.tabsHeader[i].tableForm.tableData
              if (this.taskDetailItemList[item.name] && this.taskDetailItemList[item.name].length > 0) {
                const filterData = tableData.filter(item => {
                  if (this.taskDetailItemList[item.departmentCode] && this.taskDetailItemList[item.departmentCode].includes(item)) {
                    return false
                  } else {
                    return true
                  }
                  // return !this.taskDetailItemList[item.name]?.includes(item)
                })
                this.tabsHeader[i].tableForm.tableData = filterData.length > 0
                  ? filterData
                  : [{
                    id: '',
                    linkId: this.linkId,
                    departmentCode: this.tabsHeader[i].name,
                    departmentName: this.tabsHeader[i].label,
                    TimeArr: [moment(this.startTime).format('HH:mm'), moment(this.endTime).format('HH:mm')],
                    workItem: '',
                    remark: '',
                    createTime: '',
                    createBy: '',
                    updateTime: '',
                    updateBy: ''
                  }]
              }
            }
          }
        })
      }
      ).catch(() => {})
      // } else {
      //   this.$message.warning('请选择数据')
      // }
      // const hasIdList = this.tabsHeader[index].tableForm.tableData.filter(item => item.id)
    },
    // 任务包弹窗确定
    confirm() {
      const obj = {}
      const arr = this.bagData
      if (!arr.length) {
        this.dialogVisible = false
        return
      }
      try {
        for (let i = 0; i < arr.length; i++) {
          const element = arr[i]
          const { departmentCode } = element
          if (!Object.prototype.hasOwnProperty.call(obj, departmentCode)) {
            obj[departmentCode] = [arr[i]]
          } else {
            obj[departmentCode].push(arr[i])
          }
        }
        for (const key in obj) {
          for (let j = 0; j < obj[key].length; j++) {
            obj[key][j] = {
              id: '',
              linkId: this.linkId,
              departmentCode: obj[key][j].departmentCode,
              departmentName: obj[key][j].departmentName,
              createBy: obj[key][j].createBy,
              createTime: obj[key][j].createTime,
              TimeArr: [moment(this.startTime).format('HH:mm'), moment(this.endTime).format('HH:mm')],
              workItem: obj[key][j].workItem,
              remark: '',
              updateTime: obj[key][j].updateTime,
              updateBy: obj[key][j].updateBy
            }
            for (let i = 0; i < this.tabsHeader.length; i++) {
              if (key === this.tabsHeader[i].name) {
                this.tabsHeader[i].tableForm.tableData.push(obj[key][j])
              }
            }
          }
        }
        this.$message.success('操作成功')
        this.dialogVisible = false
      } catch (e) {
        //
      }
    }
    // // 任务包弹窗取消
    // call() {
    //   this.dialogVisible = false
    // },
    // // 任务包弹窗右上角关闭按钮
    // handleClose() {
    //   this.dialogVisible = false
    // },
    // table表头红色*号
    // star({ columnIndex }) {
    //   if (columnIndex === 3) {
    //     return 'star'
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
.el-dialog__wrapper{
  ::v-deep .el-dialog__body{
    padding: 10px 20px;
  }
}
.taskBagActive{
  ::v-deep .el-tabs__header{
    .el-tabs__nav-wrap::after{
      height: 0;
    }
    .el-tabs__nav-wrap{
      .el-tabs__nav-prev,.el-tabs__nav-next{
        // display: none;
      }
      .el-tabs__nav-scroll{
        // width: 100%;
        // display: inline-table;

        .el-tabs__nav{
          white-space: initial;
          .el-tabs__active-bar{
            display: none;
          }
          .el-tabs__item{
            padding: 0 16px;
            margin:0 5px;
            box-sizing: border-box;
          }
          .is-active{
            box-shadow: 0 0 0 1px $--custom--color--primary inset;
            border-radius: 20px;
            box-sizing: border-box;
          }
        }
      }
    }
  }
}
  #taskParticulars {
    padding: 20px;
    .container {
      padding: 20px;
      background-color: #fff;
      .title {
        font-size: 16px;
        padding: 16px 0;
        .title_name {
        font-weight: bold;
        }
        .title_date {
        color: #888;
        }
      }
      .titleBtn {
        padding: 20px 0;
      }
      .bottom_btn {
        margin-top: 40px;
      }
    }
  }
  .el-range-editor.el-input__inner {
    width: 100%;
}
.btn {
  margin-bottom: 20px;
}
.copyTitle {
  color: #999;
}
.copyForm {
  margin-top: 30px;
  margin-bottom: 60px;
}
::v-deep .el-dialog__footer {
    text-align: center;
  }
  .el-select {
    width: 75%;
}
::v-deep .el-form-item__label {
    margin-left: 30px;
}
::v-deep .el-table table th.star div:before{
  content: '*';
  color:red;
  }
  .el-range-editor.el-input__inner {
    width: 100%;
}
.btn {
  margin-bottom: 20px;
}
.copyTitle {
  color: #999;
}
.copyForm {
  margin-top: 30px;
  margin-bottom: 60px;
}
::v-deep .el-dialog__footer {
    text-align: center;
  }
  .el-select {
    width: 75%;
}
::v-deep .el-form-item__label {
    margin-left: 30px;
}
.el-form-item {
    margin-top: 16.5px;
    margin-bottom: 16.5px;
}
::v-deep .el-table table th.star div:before{
  content: '*';
  color:red;
  }
.linkTable{
  ::v-deep td, .el-table--border th {
    padding: 0 !important;
  }
}
.pages {
    margin-top: 20px;
  }
</style>
