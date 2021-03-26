<template>
  <div class="content_add">
    <div class="content">
      <div class="left">
        <iframe ref="iframe" :src="src" :style="[obj]" />
      </div>
      <div class="right" :style="[obj]">
        <div v-if="contract">
          <div class="title">
            查看任务书
          </div>
          <div class="li">
            <span>项目名称：</span>{{ contract.projectName }}
          </div>
          <div class="li">
            <span>统筹负责人：</span>{{ contract.coordinator }}
          </div>
          <div class="li"><span>任务书状态：</span>{{ TASK_BOOK_STATE_TEXT[contract.taskBookState] }}</div>
        </div>
      </div>
    </div>
    <div class="foot">
      <span class="diu">{{ content }}</span>
      <el-button
        v-if="contract.taskBookState === 'HAS_GENERATED' || contract.taskBookState === 'HAS_ISSUED'"
        @click="clickBtn('下载')"
      >下载</el-button>
      <el-button @click="clickBtn('打印')">打印</el-button>
      <el-button
        v-if="contract.taskBookState === 'HAS_GENERATED' && !isRescinded"
        type="primary"
        @click="clickBtn('下发任务书')"
      >下发任务书</el-button>
    </div>
    <!-- 下发弹窗 -->
    <el-dialog
      :visible.sync="centerDialogVisibleIssus"
      width="30%"
      :close-on-click-modal="false"
      center
    >
      <SendTaskBook v-if="centerDialogVisibleIssus" :is-paid="isPaid" :is-rescinded="isRescinded" :task-book-id="taskBookId" @confirm="confirm" @call="call" />
      <!-- <div class="centerTop">任务书将下发到各个执行部门</div>
      <div class="centerBottom">下发任务书后将不可再进行修改</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="call">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>
<script>
import SendTaskBook from './components/sendTaskBook'
import { TASK_BOOK_STATE, TASK_BOOK_STATE_TEXT } from '@/common/taskBook'
import base from '@/api/base'
// import pdf from 'vue-pdf'

export default {
  name: 'LookTaskBook',
  components: { SendTaskBook },
  // components: { pdf },
  data() {
    return {
      TASK_BOOK_STATE,
      TASK_BOOK_STATE_TEXT,
      taskBookId: null,
      settled: '', // 是否结清
      centerDialogVisibleIssus: false,
      id: null, // 任务书id
      numPages: 1,
      base: base, // 默认路劲
      routerId: '',
      contract: {}, // 合同全部数据
      userInfo: {}, // 账户数据
      routerName: '',
      fileId: null,
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: 'PDF', // 文件类型
      src: '',
      // imgPage: [],
      obj: {
        width: '100%',
        height: document.documentElement.clientHeight - 152 + 'px'
      },
      url: ''

    }
  },
  computed: {
    isPaid() {
      return !(!this.contract.settled && this.contract.taskBookState === TASK_BOOK_STATE['HAS_GENERATED'])
    },
    isRescinded() {
      return this.contract.stateType === 'RESCINDED'
    },
    content() {
      if (this.isRescinded) {
        return '项目已撤销'
      }
      return this.isPaid ? '' : '款项未结清'
    }
  },
  watch: {
    $route() {
      this.routerStyle()
    }
  },
  created() {
    this.routerStyle()
  },
  methods: {
    call() {
      this.centerDialogVisibleIssus = false
    },
    confirm(params) {
      this.centerDialogVisibleIssus = false
      this.$api.taskBookList.issue_taskBook(params).then(res => {
        if (res) {
          this.$message.success('下发成功')
          this.$router.push({ name: 'TaskBookAdmin' })
        }
      })
    },
    //
    routerStyle() {
      this.routerId = this.$route.query.id
      this.taskBookId = this.$route.query.taskBookId
      // this.settled = this.$route.query.settled
      this.get_contractInfo()
      this.get_downloadInAttachmentWay()
    },
    get_contractInfo() {
      this.$api.taskBookList.get_taskParticularsID(this.routerId).then(res => {
        if (res) {
          this.contract = res
        }
      })
    },
    // pdf模板
    get_downloadInAttachmentWay() {
      this.$api.taskBookList.getTaskBookFile(this.taskBookId).then(res => {
        if (res) {
          this.src = this.$api.file.filePreview(res.urlEncodedAddress)
          this.url = res.address
          this.fileId = res.fileId
        }
      })
    },
    get_DOCX_taskBook() {
      this.$api.taskBookList.DOCX_taskBook({ id: this.routerId, type: 'DOCX' }).then(res => {
        if (res) {
          window.location.href = res.urlEncodedAddress
        }
      })
    },
    // 操作
    clickBtn(type) {
      switch (type) {
        case '下发任务书':
          this.centerDialogVisibleIssus = true
          break
        case '下载': {
          window.location.href = this.url
          break
        }
        case '打印':
          this.$refs.iframe.contentWindow.print()
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.rowTitle {
  .el-button {
    display: inline-table;
    float: right;
    color: #888888;
    margin-right: 12px;
  }
}
.form_title_right {
  background: white;
  .span {
    float: right;
    color: #888888;
    font-size: 14px;
  }
}
.content_add {
  width: 100%;
  .content {
    width: 100%;
    height: auto;
    padding-bottom: 64px;
    box-sizing: border-box;
    display: flex;
    .left {
      width: 70%;
      height: 100%;
      margin-right: 16px;
    }
    .right {
      background: white;
      display: inline-table;
      padding: 24px;
      height: 100%;
      flex: 1;
      .title {
        width: 100%;
        font-size: 18px;
        font-weight: 400;
        line-height: 32px;
      }
      .li {
        width: 100%;
        line-height: 32px;
        font-size: 14px;
        span {
          color: #666666;
        }
      }
      .imgS{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .imgPage{
          width: 40%;
          img{
            width: 100%;
            height: 200px;
            border: 1px solid #D9D9D9;
          }
          .span{
            width: 100%;
            line-height: 32px;
            text-align: center;
            padding-bottom: 15px;
            box-sizing: border-box;
          }
        }
      }
    }
  }
}
.foot {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  height: 64px;
  padding: 0 56px;
  box-sizing: border-box;
  line-height: 64px;
  background: white;
  text-align: right;
  font-size: 14px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
  .num {
    display: inline-table;
    margin-right: 100px;
    span {
      font-size: 20px;
      color: #ff0000;
    }
  }
  // .el-button {
  //   width: 96px;
  // }
}
.centerTop {
    // margin: 0 auto;
    text-align: center;
    font-size: 16px;
  }
.centerBottom{
text-align: center;
color: #ccc;
font-size: 12px;
margin-top: 20px;
}
.diu {
  margin-right: 30px;
  color: red;
}
</style>
