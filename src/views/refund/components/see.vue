<template>
  <div class="see_new">
    <RowText :text="'退款信息'" />
    <div class="ul">
      <div class="li">
        <div class="name">申请编号：{{ refundapply.applyNumber }}</div>
      </div>
      <div class="li">
        <div class="name">项目名称：{{ refundapply.projectName }}</div>
      </div>
      <div class="li">
        <div class="name">客户：{{ refundapply.companyName }}</div>
      </div>
      <div class="li">
        <div class="name">
          <!-- 类型：{{ refundapply.refund_type === "DEPOSIT_REFUND" ? "押金退款" : "订单退款" }} -->
          类型：{{ REFUND_TYPE[refundapply.refund_type] && REFUND_TYPE[refundapply.refund_type].label }}
        </div>
      </div>
      <div class="li">
        <div class="name">账户名称：{{ refundapply.accountTitle||'-' }}</div>
      </div>
      <div class="li">
        <div class="name">银行账号：{{ refundapply.accountNumber||'-' }}</div>
      </div>
      <div class="li">
        <div class="name">开户行：{{ refundapply.bankBranch||'-' }}</div>
      </div>
      <div class="li">
        <div class="name">备注：{{ refundapply.remark||'-' }}</div>
      </div>
      <div class="li">
        <div class="name">退款状态：{{ refundapply.refundStatusName||'-' }}</div>
      </div>
      <div class="li liF">
        <div class="name" />
        附件：
        <div class="input">
          <div v-if="imgs" class="imgs">
            <img
              v-for="(item, index) of imgs"
              :key="index"
              :src="item.url"
              @click="preview(index)"
            >
          </div>
          <div v-else class="imgsNo">暂无附件</div>
        </div>
      </div>
    </div>
    <RowText :text="'退款明细'" />
    <div class="ul">
      <TablePage
        :table-data="refundapply.deposits"
        :table-header="tableHeader"
      />
      <div class="table_title">
        退款总额：￥{{ refundapply.refundAmount||0 }}
        <span v-if="!isBaiMa">（国贸：￥{{ refundapply.gmAmount||0 }} / 物业：￥{{ refundapply.wyAmount||0 }}）</span>
      </div>
    </div>
    <!-- <div v-if="(refundapply.styleNum===1 || refundapply.styleNum===3)" class="jurisdiction"> -->
    <div v-if="!(isEdit && !isGM)" class="jurisdiction">
      <RowText :text="isBaiMa ? '退款凭证' :'国贸退款凭证'" />
      <div class="ul">
        <div class="li liU">
          <div class="name">上传凭证：</div>
          <div class="input">
            <div v-if="isEdit" slot="tip" class="tip_title">
              只能上传jpg/png/jpeg格式的图片
            </div>
            <el-upload
              v-if="isEdit"
              class="upload-demo"
              :action="`${base.hall}a/api/ossImage/upload`"
              :data="enclosure"
              :on-success="gm_uploadImgSuccess"
              :before-upload="gm_uploadBefore"
              :on-error="gm_uploadImgError"
              :on-remove="gm_remove"
              accept=".jpg, .jpeg, .png"
              :file-list="gm_fileList"
            >
              <el-button size="small" :loading="gm_btnLoading">上传图片</el-button>
            </el-upload>
            <div v-else class="upload_images">
              <div v-if="gmCertificateIds.length" class="images_new">
                <img v-for="(item,index) of gmCertificateIds" :key="index" :src="EncodeURIFilter(item.url)" alt="">
              </div>
              <div v-else>暂无附件</div>
            </div>
          </div>
        </div>
        <div class="li liU">
          <div class="name">备注：</div>
          <div class="input">
            <el-input v-if="isEdit" v-model="gmRemark" type="textarea" />
            <div v-else class="imgsNo">{{ refundapply.gmRemark }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-if="(refundapply.styleNum===2 || refundapply.styleNum===3)" class="jurisdiction"> -->
    <div v-if="!(isEdit && !isWY) && !isBaiMa" class="jurisdiction">
      <RowText :text="'物业退款凭证'" />
      <div class="ul">
        <div class="li liU">
          <div class="name">上传凭证：</div>
          <div class="input">
            <div v-if="isEdit" slot="tip" class="tip_title">
              只能上传jpg/png/jpeg格式的图片
            </div>
            <el-upload
              v-if="isEdit"
              class="upload-demo"
              :action="`${base.hall}a/api/ossImage/upload`"
              :data="enclosure"
              :on-success="wy_uploadImgSuccess"
              :before-upload="wy_uploadBefore"
              :on-error="wy_uploadImgError"
              :on-remove="wy_remove"
              accept=".jpg, .jpeg, .png"
              :file-list="wy_fileList"
            >
              <el-button size="small" :loading="wy_btnLoading">上传图片</el-button>

            </el-upload>
            <div v-else class="upload_images">
              <div v-if="wyCertificateIds.length" class="images_new">
                <img v-for="(item,index) of wyCertificateIds" :key="index" :src="item.url" alt="">
              </div>
              <div v-else>暂无附件</div>
            </div>
          </div>
        </div>
        <div class="li liU">
          <div class="name">备注：</div>
          <div class="input">
            <el-input v-if="isEdit" v-model="wyRemark" type="textarea" />
            <div v-else class="imgsNo">{{ refundapply.wyRemark }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footBtn">
      <el-button @click="dialogShowFalse">取消</el-button>
      <el-button v-if="isEdit" type="primary" @click="determine">确定</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import base from '@/api/base'
import { isBaiMa } from '@/api/base'
import RowText from '@/components/rowText'
import TablePage from '@/components/table/table'
import { REFUND_TYPE } from '@/common/refund'
import { mapGetters, mapState } from 'vuex'
import { EncodeURIFilter } from '@/utils/common'

export default {
  components: { RowText, TablePage },
  props: {
    refundapply: {
      type: Object,
      default: () => {
        return {}
      }
    },
    state: {
      type: String,
      default: () => {
        return ''
      }
    },
    imgs: {
      type: Array,
      default: () => {
        return []
      }
    },
    gmCertificateIds: {
      type: Array,
      default: () => {
        return []
      }
    },
    wyCertificateIds: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      isBaiMa,
      REFUND_TYPE,
      gmRemark: '',
      wyRemark: '',
      gm_btnLoading: false,
      wy_btnLoading: false,
      dialogVisible: false,
      dialogImageUrl: '',
      base: base, // 默认路劲
      enclosure: {
        dataId: Date.now(),
        type: 'REFUND_ATTACHMENT'
      },
      gm_fileList: [],
      wy_fileList: [],
      tableHeader: [
        { key: 'code', text: '押金编号' },
        { key: 'customerName', text: '客户名称' },
        { key: 'depositName', text: '押金类别' },
        { key: 'paymentName', text: '收款账户' },
        { key: 'receiveAmount', text: '已收金额' },
        { key: 'usedAmount', text: '已用金额' },
        { key: 'turnAmount', text: '退款金额' }
      ]
    }
  },
  computed: {
    isGM() {
      const userInfo = this.userInfo
      const refundTokenRoles = this.refundTokenRoles
      return this.isRefundRole(userInfo, refundTokenRoles, '国贸退款凭证')
    },
    isWY() {
      const userInfo = this.userInfo
      const refundTokenRoles = this.refundTokenRoles
      return this.isRefundRole(userInfo, refundTokenRoles, '物业退款凭证')
    },
    isEdit() {
      return this.state === '1'
    },
    ...mapState({ refundTokenRoles: state => state.refund.refundTokenRoles }),
    ...mapGetters({ userInfo: 'userInfo' })
  },
  created() {

  },
  methods: {
    EncodeURIFilter(str) {
      return EncodeURIFilter(str)
    },
    // 根据字典配置判断是否显示凭证区域
    isRefundRole(userInfo, refundTokenRoles, label) {
      const { roleList } = userInfo
      const roleNames = roleList.map(t => t.enname)
      const roles = []
      refundTokenRoles.forEach(el => {
        // console.log('refundTokenRoles', el.label)
        if (el.label === label) {
          roles.push(el.value)
        }
      })
      const map = [...roleNames, ...roles]
      return new Set(map).size !== map.length
    },
    preview(index) {
      this.$viewer(this.imgs, { initialViewIndex: index || 0 })
    },
    // 国贸删除图片
    gm_remove(file, fileList) {
      this.gm_fileList = fileList
    },
    // 物业删除图片
    wy_remove(file, fileList) {
      this.wy_fileList = fileList
    },
    dialogShowFalse() {
      this.$emit('dialogShowFalse')
    },
    determine() {
      const styleNum = this.refundapply.styleNum
      if (this.isGM && this.isWY) {
        // (this.wy_fileList.length !== 0 || this.gm_fileList.length !== 0) && this.$message.warning('请选择上传物业退款凭证')
        if (styleNum === 1) {
          if (this.gm_fileList.length === 0) return this.$message.warning(`请选择上传${isBaiMa ? '' : '国贸'}退款凭证`)
        } else if (styleNum === 2) {
          if (this.wy_fileList.length === 0) return this.$message.warning('请选择上传物业退款凭证')
        } else {
          if (this.wy_fileList.length === 0) return this.$message.warning('请选择上传物业退款凭证')
          if (this.gm_fileList.length === 0) return this.$message.warning(`请选择上传${isBaiMa ? '' : '国贸'}退款凭证`)
        }
      } else if (this.isGM) {
        if (this.gm_fileList.length === 0) return this.$message.warning(`请选择上传${isBaiMa ? '' : '国贸'}退款凭证`)
      } else if (this.isWY) {
        if (this.wy_fileList.length === 0) return this.$message.warning(`请选择上传${isBaiMa ? '' : '国贸'}退款凭证`)
      }

      var gm_fileList = this.gm_fileList
      var gmCertificateIds = ''

      var wy_fileList = this.wy_fileList
      var wyCertificateIds = ''

      const gmIds = this.gmCertificateIds.map(t => t.id)
      const wyIds = this.wyCertificateIds.map(t => t.id)

      if (gmIds.length > 0) {
        gmCertificateIds = gmIds.join(',') + ','
      } else {
        for (var i in gm_fileList) {
          gmCertificateIds += gm_fileList[i].response.data[0].imageId + ','
        }
      }

      if (wyIds.length > 0) {
        wyCertificateIds = wyIds.join(',') + ','
      } else {
        for (var j in wy_fileList) {
          wyCertificateIds += wy_fileList[j].response.data[0].imageId + ','
        }
      }

      const json = {
        gmCertificateIds: gmCertificateIds.substring(0, gmCertificateIds.length - 1),
        wyCertificateIds: wyCertificateIds.substring(0, wyCertificateIds.length - 1),
        wyRemark: this.wyRemark,
        gmRemark: this.gmRemark
      }
      this.$emit('determine', json)
    },
    // 国贸附件上传
    // 上传图片成功
    gm_uploadImgSuccess(response, file, fileList) {
      if (response.data !== 'null') {
        this.$message.success(response.message)
        this.gm_btnLoading = false
        this.gm_fileList = []
        this.gm_fileList = fileList
      } else {
        this.$message.error('上传失败，请重试')
        this.gm_btnLoading = false
      }
    },
    // 上传图片失败
    gm_uploadImgError() {
      this.btnLoading = false
      this.$message.error('上传失败，请重试')
    },
    // 执照上传前
    gm_uploadBefore(file) {
      this.gm_btnLoading = true
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'png'
      const extension2 = testmsg === 'jpg'
      const extension3 = testmsg === 'jpeg'
      if (!extension && !extension2 && !extension3) {
        this.gm_btnLoading = false
        this.$message.error('只能上传jpg/png/jpeg格式的图片')
        return false
      }
      this.enclosure.dataId = Date.now()
    },
    // 物业附件上传
    // 上传图片成功
    wy_uploadImgSuccess(response, file, fileList) {
      if (response.data !== 'null') {
        this.$message.success(response.message)
        this.wy_btnLoading = false
        this.wy_fileList = []
        this.wy_fileList = fileList
      } else {
        this.$message.error('上传失败，请重试')
        this.wy_btnLoading = false
      }
    },
    // 上传图片失败
    wy_uploadImgError() {
      this.wy_btnLoading = false
      this.$message.error('上传失败，请重试')
    },
    // 执照上传前
    wy_uploadBefore(file) {
      this.wy_btnLoading = true
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'png'
      const extension2 = testmsg === 'jpg'
      const extension3 = testmsg === 'jpeg'
      if (!extension && !extension2 && !extension3) {
        this.wy_btnLoading = false
        this.$message.error('只能上传jpg/png/jpeg格式的图片')
        return false
      }
      this.enclosure.dataId = Date.now()
    },
    // 查看图片
    see_img(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.tip_title{
  font-size: 14px;
  line-height: 32px;
  color: #999999;
  margin-bottom: 8px;
}
.upload-demo{
  margin-bottom: 16px;
}
.footBtn{
  width: 100%;
  text-align: center;
  display: inline-table;
  padding: 20px 0;
  box-sizing: border-box;
}
.jurisdiction{
    width: 100%;
    display: inline-table
}
.see_new {
  width: 100%;
  display: inline-table;
  .ul {
    width: 100%;
    display: inline-table;
    padding: 24px 16px;
    box-sizing: border-box;
    .li {
      font-size: 14px;
      font-weight: 400;
      width: 50%;
      float: left;
      display: flex;
      color: #666666;
      span {
        color: #000000;
      }
      .name {
        line-height: 32px;
      }
      .input {
        flex: 1;
        .imgs {
          width: 100%;
          img {
            width: 120px;
            height: 80px;
            border:1px solid #cccccc;
            margin-right: 10px;
            float: left;
          }
        }
        .imgsNo {
          line-height: 32px;
        }
      }
    }
    .liF {
      width: 100%;

    }
    .table_title {
      width: 100%;
      color: #070707;
      font-size: 14px;
      font-weight: 400;
      line-height: 32px;
      span {
        color: #666666;
      }
    }
    .liU {
      width: 60%;
      display: flex;
      .name {
        font-size: 14px;
        line-height: 32px;
        width: 110px;
        text-align: right;
      }
      .input {
        flex: 1;
        .upload_images{
            width: 100%;
            display: inline-table;
            div{
              line-height: 32px;
            }
            img{
                width: 120px;
                height: 96px;
                margin-right: 10px;
                float: left;
            }
        }

      }
    }
  }
  // .upload-demo {
  //   ::v-deep .el-upload-list {
  //     width: 100%;
  //     .el-upload-list__item {
  //       width: 120px;
  //       float: left;
  //       margin-right: 16px;
  //     }
  //   }
  // }
}
</style>
