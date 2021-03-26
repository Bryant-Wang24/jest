<template>
  <div class="content_add">
    <div class="content">
      <div class="left">
        <iframe ref="iframe" :src="src" :style="[obj]" />
      </div>
      <div class="right" :style="[obj]">
        <div v-if="contract">
          <MainTitle title="查看付款通知书" />
          <div class="li">
            <span>商铺名称：</span>{{ contract.projectName }}
          </div>
          <div class="li">
            <span>客户名称：</span>{{ contract.companyName }}
          </div>
          <div class="li">
            <span>应收金额：</span>￥{{ contract.payAmount }}
          </div>
          <div class="li"><span>缴费截止日期：</span>{{ contract.finalDateStr }}</div>
        </div>
        <!-- <div class="imgS">
          <div v-for="(item,index) of imgPage" :key="index" class="imgPage"><img :src="item.address" alt=""><div class="span">1/12</div></div>
        </div> -->
      </div>
    </div>
    <div v-if="contract" class="foot">
      <el-button
        @click="clickBtn('返回')"
      >返回</el-button>
      <!-- <el-button
        v-if="contract.contract.state === 'AUDITING'&&routerName ==='contractAudit'"
        @click="clickBtn('拒绝申请')"
      >拒绝申请</el-button>
      <el-button
        v-if="contract.contract.state === 'AUDITING'&&routerName ==='contractAudit'"
        type="primary"
        @click="clickBtn('审批通过')"
      >审批通过</el-button> -->
      <el-button
        @click="clickBtn('下载')"
      >下载</el-button>
      <!-- <el-button
        v-if="contract.contract.state === 'EFFECTIVE'"
        size="small"
        @click="clickBtn('打印')"
      >打印</el-button> -->
    </div>
  </div>
</template>
<script>
import base from '@/api/base'
import MainTitle from '@/components/base/MainTitle'
import { routerBack } from '@/utils/common'
import SaveRouterFrom from '@/common/mixin/saveRouterFrom'

const whites = ['payment'] // 路由白名单

const mixin = new SaveRouterFrom(whites)

// import pdf from 'vue-pdf'
export default {
  name: '',
  components: {
    MainTitle
  },
  mixins: [mixin], // before Router Enter
  data() {
    return {
      numPages: 1,
      base: base, // 默认路劲
      routerId: '',
      contract: '', // 合同全部数据
      userInfo: {}, // 账户数据
      routerName: '',
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: 'PDF', // 文件类型
      src: '',
      imgPage: [],
      obj: {
        width: '100%',
        height: document.documentElement.clientHeight - 152 + 'px'
      }

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

    //
    routerStyle() {
      this.routerName = this.$route.name
      this.routerId = this.$route.params.id
      this.get_contractInfo()
      this.get_downloadInAttachmentWay('preview')
      // this.get_downloadInImageWay()
    },
    // 合同 - 获取合同全部信息
    get_contractInfo() {
      this.$api.payment.paymentId({ id: this.routerId }).then(res => {
        if (res) {
          this.contract = res
        }
      })
    },
    // pdf模板
    get_downloadInAttachmentWay(data) {
      this.$api.payment.downloadInAttachmentWay({ id: this.routerId, type: 'DOCX' }).then(res => {
        if (res) {
          if (data === 'DOCX') {
            window.location.href = res.urlEncodedAddress
            return
          } else if (data === 'preview') {
            this.src = this.$api.file.filePreview(res.urlEncodedAddress)
          }
        }
      })
    },
    // 合同 - 以图片形式下载合同
    get_downloadInImageWay() {
      this.$api.contract.downloadInImageWay({ id: this.routerId }).then(res => {
        if (res.length > 0) {
          this.imgPage = res
        }
      })
    },
    // 操作
    clickBtn(type) {
      switch (type) {
        case '返回':
          // this.$router.go(-1)
          routerBack(this.$route)
          break
        case '拒绝申请':
          this.get_contractsApprove(type)
          break
        case '审批通过':
          this.get_contractsApprove(type)
          break
        case '下载':
          this.get_downloadInAttachmentWay('DOCX')
          break
        case '打印':
          // this.$refs.iframe.contentWindow.print()
          // document.getElementById('result').contentWindow.print()
          break
      }
    },
    // 审批
    get_contractsApprove(type) {
      this.$prompt('原因', '审批合同', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: type === '拒绝申请' ? /\S/ : '',
        inputErrorMessage: '请输入原因'
      })
        .then(({ value }) => {
          const json = {
            id: this.routerId,
            userId: this.userInfo.id,
            reason: value,
            pass: type !== '拒绝申请'
          }
          if (this.contract.contract.nextApproveBy === null) {
            return this.$message.error(
              '编号‘' + this.contract.contract.idNum + '’合同，无法执行该操作'
            )
          }
          if (this.contract.contract.nextApproveBy.id !== this.userInfo.id) {
            return this.$message.warning(
              '编号‘' + this.contract.contract.idNum + '’合同，无法执行该操作'
            )
          }
          this.$api.contract.contractsApprove(json).then(res => {
            if (res === true) {
              this.$message.success('状态修改成功')
            } else {
              this.$message.success('状态修改失败')
            }
            this.get_contractInfo()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消该操作'
          })
        })
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
  .el-button {
    width: 96px;
  }
}
</style>
