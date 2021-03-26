<template>
  <Layout id="compileBook" :use-head="false" :use-foot="false" :auto-height="true">
    <!-- <div id="compileBook"> -->
    <div v-if="!result.visible" class="container">
      <MainTitle :title="projectName">
        <warning v-if="stateType === 'RESCINDED'" slot="label" />
      </MainTitle>

      <div v-if="projectPlan" class="complete">
        <span class="projectSpan">项目统筹信息 未完善</span>
        <el-button type="text" @click="goPerfect">去完善</el-button>
      </div>
      <!-- 基础信息 -->
      <RowText :text="'基础信息'" />
      <Basics :basics-form="basicsForm" />
      <!-- 场地&时间安排 -->
      <RowText :text="'场地&时间安排'" />
      <SiteTime :time-form="timeForm" />
      <!-- 定义任务环节 -->
      <RowText :text="'定义任务环节'" />
      <div class="linkTable">
        <div class="linkBtn">
          <el-button @click="addLink">添加环节</el-button>
          <el-button @click="lookDeli">查看交接单</el-button>
        </div>
        <el-table
          ref="linkTable"
          v-loading="tableLoading"
          :data="linkForm"
          :empty-text="'暂无数据'"
          style="width: 80%"
          :header-cell-style="{color: '#333',fontWeight:'normal',fontSize: '16px',backgroundColor: '#FAFAFA'}"
          :cell-style="{color: '#000', fontSize: '14px'}"
          border
        >
          <el-table-column
            prop="linkType"
            label="环节类别"
            min-width="104px"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.linkType === 'OUTLAWS_PERIOD'">筹展期</span>
              <span v-if="scope.row.linkType === 'EXHIBIT_PERIOD'">布展期</span>
              <span v-if="scope.row.linkType === 'CARRY_OUT_PERIOD'">开展期</span>
              <span v-if="scope.row.linkType === 'MOVEIN_PERIOD'">撤展期</span>
              <span v-if="scope.row.linkType === 'ACTIVITY_ARRANGEMENT'">活动布置</span>
              <span v-if="scope.row.linkType === 'ACTIVITY_REHEARSAL'">活动彩排</span>
              <span v-if="scope.row.linkType === 'ACTIVITY_FOR'">活动进行</span>
              <span v-if="scope.row.linkType === 'ACTIVITY_OVER'">活动散场</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="linkName"
            label="环节名称"
            min-width="142px"
          />
          <el-table-column
            prop="linkDate"
            label="日期"
            min-width="303px"
          />
          <el-table-column
            show-overflow-tooltip
            prop="remark"
            label="备注"
            min-width="216px"
          />
          <el-table-column label="操作" min-width="248px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="clickBtn(scope.row, '编辑')"
              >编辑</el-button>
              <el-button
                size="mini"
                type="text"
                @click="clickBtn(scope.row, '任务明细')"
              >任务明细</el-button>
              <el-button
                size="mini"
                type="text"
                @click="clickBtn(scope.row, '删除环节')"
              >删除环节</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bottomBtn">
        <el-button type="primary" :disabled="projectPlan || stateType === 'RESCINDED'" @click="createTaskBook">{{ source === 'modification' ? '重新生成任务书' : '生成任务书' }}</el-button>
        <el-button @click="back">返回列表</el-button>
      </div>
    </div>
    <!-- 添加&编辑弹窗 -->
    <el-dialog
      :title="addTitle"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      width="40%"
      @close="resetFields"
    >
      <el-form ref="addLinkForm" :model="addLinkForm" label-width="120px" :rules="rules_1">
        <el-form-item label="环节类别:" prop="linkType">
          <el-select v-model="addLinkForm.linkType" placeholder="请选择环节类别">
            <WrapOption v-for="item in TASKLINK_TYPE" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="环节名称:" prop="linkName">
          <el-input v-model="addLinkForm.linkName" placeholder="请输入环节名称" />
        </el-form-item>
        <el-form-item label="日期:" prop="dateTime">
          <el-date-picker
            v-model="addLinkForm.dateTime"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="addLinkForm.remark"
            :rows="3"
            resize="none"
            type="textarea"
            placeholder="(选填)"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="call">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹框 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      width="30%"
      center
    >
      <div class="center">
        <div><h3>确定删除此环节吗?</h3></div>
        <div>删除后将无法恢复</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialog">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 交接单 -->
    <el-dialog
      :visible.sync="deliDialogVisible"
      :close-on-click-modal="false"
      width="65%"
    >
      <div>
        <handoverSlipInfo :propid="id" />
        <div style="text-align: center;">
          <el-button @click="deliDialogVisible= false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- result -->
    <SubmitResult v-if="result.visible" :info="result.info" @back="resultBack" @view="resultView" />
    <!-- </div> -->
  </Layout>
</template>

<script>
import MainTitle from '@/components/base/MainTitle'
import Layout from '@/components/base/Layout'
import RowText from '@/components/rowText'
import Basics from './components/basics'
import pageMixin from '@/views/mixins/page'
import SiteTime from './components/siteTime'
import SubmitResult from '@/components/submitResult'
import handoverSlipInfo from '@/views/handoverSlipMgmt/components/handoverSlipInfo'
import WrapOption from '@/components/base/WrapOption'
import { TASKLINK_TYPE } from '@/common/taskBook'
import { deleteTagsView } from '@/utils/common'
export default {
  name: 'CompileBook',
  components: { Layout, MainTitle, RowText, Basics, SiteTime, handoverSlipInfo, SubmitResult, WrapOption }, // basics, siteTime, taskLink
  mixins: [pageMixin],
  data() {
    return {
      TASKLINK_TYPE,
      projectName: '', // 项目名称
      id: null, // 交接单id
      source: '', // 页面状态
      projectPlan: false, // 项目统筹信息完善状态
      saleId: null, // 场地销售id
      taskBookId: null, // 任务书id
      taskBookCode: '', // 任务书编号
      taskBookState: '', // 任务书状态
      linkForm: [], // 任务环节列表数据
      tableLoading: false, // 加载状态
      addDialogVisible: false, // 弹窗状态
      addTitle: '', // 弹窗标题
      centerDialogVisible: false, // 删除弹框状态
      deleteId: null, // 删除环节时的当前id
      settled: '', // 是否结清
      deliDialogVisible: false, // 交接单弹窗
      stateType: null,
      // // 基础信息
      basicsForm: {
        code: '',
        // mainContractor: '',
        CONTRACTOR: '',
        CARRIER: '',
        CARPET_DEALER: '',
        projectLeader: '',
        taskBookState: '',
        hostCompany: '',
        // carpetDealer: '',
        leader: '',
        type: '',
        // homeCarrier: '',
        numberPeople: ''
      },
      // 场地&时间信息
      timeForm: {
        siteSchedule: [],
        timeTypeValue: [],
        supplyStartTime: '',
        supplyEndTime: '',
        airStartTime: '',
        airEndTime: ''
      },
      // 弹窗数据
      addLinkForm: {
        linkId: '',
        linkType: '',
        linkName: '',
        dateTime: [],
        remark: ''
      },
      // 弹窗数据验证
      rules_1: {
        linkType: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
        linkName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        dateTime: [{ type: 'array', required: true, message: '请选择日期', trigger: 'change' }]
      },
      result: {
        visible: false,
        id: null,
        taskBookId: null,
        settled: null
      }
    }
  },
  async created() {
    const { id, source } = this.$route.query
    this.id = id
    this.source = source
    await this.get_taskParticularsID()
    setTimeout(() => {
      this.get_taskLinkList()
    }, 300)
    // // 获取路由传参数据数据
    // this.get_source()
    // this.judge()
    // setTimeout(() => {
    //   // 获取任务书环节列表
    //   this.get_taskLinkList()
    // }, 500)
    // if (this.source === 'modification') {
    //   this.projectPlan = false
    // }
  },
  methods: {
    // 交接单
    lookDeli() {
      this.deliDialogVisible = true
    },
    // 通过id获取任务详情
    get_taskParticularsID() {
      return new Promise((resolve, reject) => {
        this.$api.taskBookList.get_taskParticularsID(this.id).then(res => {
          // console.log(res, '通过id获取任务详情')
          // 判断统筹信息是否完善
          if (!res.serviceProvidersMap?.CONTRACTOR?.length || !res.numberPeople || !res.preparateStartTime || !res.preparateEndTime) {
            this.projectPlan = true
          }
          this.projectName = res.projectName
          this.saleId = res.saleId
          this.settled = res.settled
          this.stateType = res.stateType
          this.basicsForm = {
            code: res.code,
            CONTRACTOR: res.serviceProvidersMap?.CONTRACTOR?.map(t => t.providerName).join(',') || '',
            CARRIER: res.serviceProvidersMap?.CARRIER?.map(t => t.providerName).join(',') || '',
            CARPET_DEALER: res.serviceProvidersMap?.CARPET_DEALER?.map(t => t.providerName).join(',') || '',
            // mainContractor: res.mainContractor,
            projectLeader: res.projectLeader,
            taskBookState: res.taskBookState,
            hostCompany: res.hostCompany,
            // carpetDealer: res.carpetDealer,
            leader: res.coordinator,
            type: res.type,
            // homeCarrier: res.homeCarrier,
            numberPeople: res.numberPeople
          }
          this.timeForm = {
            siteSchedule: res.siteSchedule,
            timeTypeValue: res.timeTypeValue,
            supplyStartTime: res.supplyStartTime,
            supplyEndTime: res.supplyEndTime,
            airStartTime: res.airStartTime,
            airEndTime: res.airEndTime,
            preparateStartTime: res.preparateStartTime,
            preparateEndTime: res.preparateEndTime
          }
          if (res.taskBookId === null || res.taskBookId === undefined) {
            this.createTaskID()
          } else {
            this.taskBookId = res.taskBookId
            this.taskBookCode = res.code
            this.taskBookState = res.taskBookState
          }
          resolve()
        }).catch(e => { reject() })
      })
    },
    // 生成任务书id
    createTaskID() {
      const json = {
        handoverId: this.id,
        taskBookState: 'NO_GENERATED'
      }
      this.$api.taskBookList.add_taskBook(json).then(res => {
        this.taskBookId = res.id
        this.taskBookCode = res.code
        this.taskBookState = res.taskBookState
      })
    },
    // 完善项目统筹信息
    goPerfect() {
      this.$router.push({
        name: 'projectData',
        query: {
          id: this.saleId,
          activeName: 'plan'
        }
      })
      // console.log('hehe')
    },
    // 表格操作按钮
    clickBtn(row, type) {
      var obj = JSON.stringify(row)
      var res = JSON.parse(obj)
      switch (type) {
        case '编辑':
          this.compileLink(res)
          break
        case '任务明细':
          console.log(this.taskBookId)
          this.taskDetail(res.linkId, res.linkName, res.linkDate, this.taskBookId, res.startTime, res.endTime)
          break
        case '删除环节':
          this.centerDialogVisible = true
          this.deleteId = res.linkId
          break
      }
    },
    // 获取任务环节列表
    get_taskLinkList() {
      this.linkForm = []
      this.tableLoading = true
      this.$api.taskBookList.get_taskLinkList({ taskBookId: this.taskBookId }).then(res => {
        this.tableLoading = false
        for (let i = 0; i < res.list.length; i++) {
          const resType = res.list[i]
          const timeArr = `${resType.startTime} ~ ${resType.endTime}`
          this.linkForm.push({
            linkId: resType.id,
            linkType: resType.linkType,
            linkName: resType.linkName,
            linkDate: timeArr,
            startTime: resType.startTime,
            endTime: resType.endTime,
            remark: resType.remark
          })
        }
      })
    },
    // 清空验证
    resetFields() {
      this.$refs.addLinkForm.resetFields()
    },
    // 添加环节
    addLink() {
      this.addDialogVisible = true
      this.addTitle = '添加环节'
      this.addLinkForm = {
        linkId: ''
      }
    },
    // 弹窗取消按钮
    call() {
      this.addDialogVisible = false
    },
    // 弹窗确认按钮
    confirm() {
      this.$refs.addLinkForm.validate(valid => {
        if (valid) {
          this.addDialogVisible = false
          this.addLinkForm.linkId === '' ? this.addAPI() : this.compileAPI()
        }
      })
    },
    // 添加成功
    addAPI() {
      const json = {
        taskBookId: this.taskBookId,
        linkType: this.addLinkForm.linkType,
        linkName: this.addLinkForm.linkName,
        startTime: this.addLinkForm.dateTime[0],
        endTime: this.addLinkForm.dateTime[1],
        remark: this.addLinkForm.remark
      }
      this.$api.taskBookList.addParticulars(json).then(res => {
        if (res) {
          this.$message.success('添加成功!')
          this.get_taskLinkList()
        }
      })
    },
    // 编辑成功
    compileAPI() {
      const id = this.addLinkForm.linkId
      const json = {
        taskBookId: this.taskBookId,
        linkType: this.addLinkForm.linkType,
        linkName: this.addLinkForm.linkName,
        startTime: this.addLinkForm.dateTime[0],
        endTime: this.addLinkForm.dateTime[1],
        remark: this.addLinkForm.remark
      }
      this.$api.taskBookList.compileParticulars(id, json).then(res => {
        console.log(res, '编辑成功')
        this.$message.success('编辑成功!')
        this.get_taskLinkList()
      })
    },
    // 编辑按钮
    compileLink(res) {
      // console.log(res, '编辑按钮信息')
      this.addDialogVisible = true
      this.addTitle = '编辑环节'
      const time = res.linkDate.split('~')
      this.addLinkForm = {
        linkId: res.linkId,
        linkType: res.linkType,
        linkName: res.linkName,
        dateTime: time,
        remark: res.remark
      }
    },
    // 删除弹框确认按钮
    centerDialog() {
      this.centerDialogVisible = false
      this.$api.taskBookList.deleteParticulars(this.deleteId).then(res => {
        this.$message.success('删除成功')
        this.get_taskLinkList()
      })
    },
    // 任务明细
    taskDetail(linkId, linkName, linkDate, taskBookId, startTime, endTime) {
      this.$router.push({
        name: 'TaskParticulars',
        query: { linkId, linkName, linkDate, taskBookId, startTime, endTime }
      })
    },
    // 返回列表
    back() {
      deleteTagsView(this.$route)
      this.$router.push({ name: 'TaskBookAdmin' })
    },
    // 生成任务书
    createTaskBook() {
      const id = this.taskBookId
      // const json = {
      //   taskBookState: 'HAS_GENERATED'
      // }
      this.$api.taskBookList.compileTaskBook(id).then(() => {
        // console.log(res, '你好啊')
        this.showSubmitResult({
          id: this.id,
          taskBookId: this.taskBookId,
          settled: this.settled
        })
      })
    },
    showSubmitResult({ id, taskBookId, settled }) {
      this.result.visible = true
      this.result.id = id
      this.result.taskBookId = taskBookId
      this.result.settled = settled
    },
    resultBack() {
      deleteTagsView(this.$route)
      this.$router.push({ name: 'TaskBookAdmin' })
    },
    resultView() {
      const { id, taskBookId, settled } = this.result
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        name: 'LookBook',
        query: { id, taskBookId, settled }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  #compileBook {

    .complete {
      border-left: 3px solid red;
      margin-bottom: 20px;
      font-size: 14px;
      line-height: 40px;
      background: #FDDBDB;
      .projectSpan {
        margin: 0 20px ;
      }
    }
  }
  .linkBtn {
    margin: 20px 0;
  }
  ::v-deep .el-dialog__body {
    padding: 30px 50px;
  }
  .el-range-editor.el-input__inner {
    width: 100%;
  }
  ::v-deep .el-dialog__footer {
    text-align: center;
  }
  .bottomBtn {
      margin-top: 40px;
    }
    .center {
      text-align: center;
    }
</style>
