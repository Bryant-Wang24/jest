<template>
  <div class="taskLink">
    <div class="titleBtn">
      <el-button @click="addLink">添加环节</el-button>
      <el-button>查看交接单</el-button>
    </div>
    <div class="table">
      <el-table
        ref="linkTable"
        v-loading="tableLoading"
        :data="linkForm"
        :empty-text="emptyText"
        style="width: 80%"
        :header-cell-style="{color: '#333',fontWeight:'normal',fontSize: '16px',backgroundColor: '#FAFAFA'}"
        :cell-style="{color: '#000', fontSize: '14px'}"
        border
      >
        <el-table-column
          v-for="item in tableHeader"
          :key="item.key"
          show-overflow-tooltip
          :type="item.type"
          :prop="item.key"
          :label="item.text"
          :min-width="item.minWidth"
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
      <el-button type="primary" @click="createTaskBook">生成任务书</el-button>
      <el-button @click="back">返回列表111</el-button>
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
            <WrapOption label="筹展期" value="OUTLAWS_PERIOD" />
            <WrapOption label="布展期" value="EXHIBIT_PERIOD" />
            <WrapOption label="开展期" value="CARRY_OUT_PERIOD" />
            <WrapOption label="撤展期" value="MOVEIN_PERIOD" />
            <WrapOption label="活动布置" value="ACTIVITY_ARRANGEMENT" />
            <WrapOption label="活动彩排" value="ACTIVITY_REHEARSAL" />
            <WrapOption label="活动进行" value="ACTIVITY_FOR" />
            <WrapOption label="活动散场" value="ACTIVITY_OVER" />
          </el-select>
        </el-form-item>
        <el-form-item label="环节名称:" prop="linkName">
          <el-input v-model="addLinkForm.linkName" placeholder="请输入环节名称" />
        </el-form-item>
        <el-form-item label="日期:" prop="dateTime">
          <el-date-picker
            v-model="addLinkForm.dateTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
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
  </div>
</template>

<script>
import WrapOption from '@/components/base/WrapOption'
export default {
  components: { WrapOption },
  props: {
    // 表格数据
    linkForm: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表头数据
    tableHeader: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 加载效果
    tableLoading: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // id
    id: {
      type: String,
      default: () => {
        return ''
      }
    },
    get_taskLinkList: {
      type: Function,
      default: () => {
        return () => {}
      }
    }
  },
  data() {
    return {
      emptyText: '暂无数据', // 无数据时的显示文字
      addDialogVisible: false, // 添加&编辑弹窗状态
      addTitle: '', // 添加&编辑弹窗title
      // 添加&编辑弹框数据
      addLinkForm: {
        linkType: '',
        linkName: '',
        dateTime: null,
        remark: ''
      },
      rules_1: {
        linkType: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
        linkName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        dateTime: [{ type: 'array', required: true, message: '请选择日期', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 生成任务书
    createTaskBook() {
      this.$router.push('submitResult')
    },
    // 返回列表
    back() {
      this.$router.go(-1)
    },
    // 弹窗清空验证
    resetFields() {
      this.$refs.addLinkForm.resetFields()
    },
    // 表格操作按钮
    clickBtn(row, type) {
      var obj = JSON.stringify(row)
      var res = JSON.parse(obj)
      switch (type) {
        case '编辑':
          // console.log('编辑', res)
          this.compileLink(res)
          break
        case '任务明细':
          console.log('任务明细')
          this.taskParticulars()
          break
        case '删除环节':
          // console.log('删除环节', row)
          this.deleteLink()
          break
      }
    },
    // 添加环节
    addLink() {
      this.addDialogVisible = true
      this.addTitle = '添加环节'
      this.addLinkForm = {}
    },
    // 编辑环节
    compileLink(row) {
      console.log(row)
      this.addDialogVisible = true
      this.addTitle = '编辑环节'
      this.addLinkForm = {
        linkType: '筹展期',
        linkName: 'asdada',
        dateTime: ['2020-11-09 19:09:19', '2020-11-10 17:38:18'],
        remark: 'sadad'
      }

      // this.addLinkForm = {}
    },
    // 任务明细
    taskParticulars() {
      this.$router.push({
        name: 'TaskParticulars',
        query: this.$route.query
      })
    },
    // 删除环节
    deleteLink() {
      // this.linkForm.splice(index, 1)
    },
    // 添加接口
    addAPI() {
      const json = {
        taskBookId: this.id,
        linkType: this.addLinkForm.linkType,
        linkName: this.addLinkForm.linkName,
        startTime: this.addLinkForm.dateTime[0],
        endTime: this.addLinkForm.dateTime[1],
        remark: this.addLinkForm.remark
      }
      this.$api.taskBookList.addParticulars(json).then(res => {
        console.log('添加环节', res)
      })
    },
    // 添加&编辑弹框数据确定按钮
    // confirm() {
    //   this.$refs.addLinkForm.validate(valid => {
    //     if (valid) {
    //       this.addDialogVisible = false
    //       this.addLinkForm.id === '' ? this.addAPI() :
    //     }
    //   })
    // },
    // 添加&编辑弹框数据取消按钮
    call() {
      this.addDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .taskLink {
    padding: 20px;
    font-size: 14px;
    .titleBtn {
      margin-bottom: 20px;
    }
    .bottomBtn {
      margin-top: 40px;
    }
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
</style>
