<template>
  <div class="customer">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="customer"
      label-width="150px"
      label-position="right"
      class="demo-ruleForm"
      :class="{'ruleForm_editNew':type==='editNew'}"
    >
      <el-form-item label="营业执照图片：" style="width:100%">
        <UploadImage v-if="type!=='editNew'" :limit="1" class="uploadImage" accept=".jpg,.jpeg,.png" :list.sync="fileList" :data="{type: attachmentsData.type}" />
        <!-- <el-upload
          v-if="type!=='editNew'"
          style="width:37.5%"
          class="upload-demo"
          :on-preview="handlePreview"
          :action="`${base.hall}a/api/ossImage/upload`"
          :data="attachmentsData"
          :on-success="uploadImgSuccess"
          :before-upload="uploadBefore"
          :on-error="uploadImgError"
          :before-remove="beforeRemove"
          accept=".jpg, .jpeg, .png"
          :file-list="fileList"
          :limit="1"
          :on-exceed="handleExceed"
        >
          <el-button :loading="btnLoading">上传图片</el-button>
        </el-upload> -->
        <div v-else class="img_new">
          <div v-if="fileList.length!==0" class="new_ul">
            <img v-for="(item,index) of fileList" :key="index" :src="item.url" alt="" @click="handlePreviewImg(index)">
          </div>
          <div v-else class="new_null">暂无营业执照图片</div>
        </div>
      </el-form-item>
      <el-form-item label="公司名称：" prop="companyName">
        <el-input v-if="type!=='editNew'" v-model.trim="customer.companyName" />
        <div v-else class="img_span">{{ customer.companyName }}</div>
      </el-form-item>
      <el-form-item label="统一社会信用代码：" prop="registerCode" :rules="[{ required: true, validator: validateTaxCode, trigger: 'blur' }]">
        <el-input v-if="type!=='editNew'" v-model.trim="customer.registerCode" type="text" placeholder="请输入内容" maxlength="18" show-word-limit @input="linkInvoiceFormTaxCode" />
        <div v-else class="img_span">{{ customer.registerCode }}</div>
      </el-form-item>
      <el-form-item label="法人代表：">
        <el-input v-if="type!=='editNew'" v-model.trim="customer.legalPerson" />
        <div v-else class="img_span">{{ customer.legalPerson||'-' }}</div>
      </el-form-item>
      <el-form-item label="注册地址：">
        <el-input v-if="type!=='editNew'" v-model.trim="customer.registerAddress" />
        <div v-else class="img_span">{{ customer.registerAddress||'-' }}</div>
      </el-form-item>
      <el-form-item label="注册资本：">
        <el-input v-if="type!=='editNew'" v-model.trim="customer.registerCapital" />
        <div v-else class="img_span">{{ customer.registerCapital||'-' }}</div>
      </el-form-item>
      <el-form-item label="营业期限：">
        <el-input v-if="type!=='editNew'" v-model.trim="customer.businessTime" />
        <div v-else class="img_span">{{ customer.businessTime||'-' }}</div>
      </el-form-item>
      <el-form-item label="经营范围：">
        <el-input v-if="type!=='editNew'" v-model.trim="customer.businessScope" type="textarea" />
        <div v-else class="img_span">{{ customer.businessScope||'-' }}</div>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" width="80%">
      <div style="width:100%;">
        <img width="100%" :src="preview" alt="">
      </div>
    </el-dialog>
  </div>
</template>
<script>
import base from '@/api/base'
import { mapMutations, mapGetters } from 'vuex'
import UploadImage from '@/components/Upload/UploadImage'
export default {
  components: { UploadImage },
  props: {
    customer: {
      type: Object,
      default: () => {
        return {}
      }
    }
    // fileList: {
    //   type: Array,
    //   default: () => {
    //     return []
    //   }
    // }
  },
  data() {
    return {
      id: this.$route.params.id,
      type: this.$route.params.type,
      dialogVisible: false,
      preview: '', // 预览url
      attachmentsData: { // 默认上传参数
        dataId: '',
        type: 'CUSTOMER_BUSINESS_LICENSE'
      },
      base: base,
      fileList: [],
      btnLoading: false,
      labelPosition: 'right',
      // customer: {
      //   // companyName: '',
      //   registerCode: '',
      //   legalPerson: '',
      //   registerAddress: '',
      //   registerCapital: '',
      //   businessTime: '',
      //   businessScope:''
      // },
      rules: {
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ]
        // registerCode: [{ required: true, validator: this.validateTaxCode, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters({
      gettertaxCode: 'taxCode',
      office: 'office',
      CUSTOMER_INDUSTRY: 'CUSTOMER_INDUSTRY'
    })
  },
  watch: {
    gettertaxCode: {
      handler(value) {
        this.customer.registerCode = value
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.setTaxCode('')
  },
  methods: {
    // 联动发票信息的纳税人识别号
    linkInvoiceFormTaxCode(value) {
      // trim
      if (value.includes(' ')) {
        return
      }
      this.setTaxCode(value)
    },
    // 查询taxCode是否存在
    async getTaxCodeIsExist(value) {
      // 接口
      const res = await this.$api.customerMsg.checkTaxCode(value)
      if (res) {
        return true
      }
      return false
    },
    // 自定义校验taxCode
    async validateTaxCode(rule, value, callback) {
      console.log('公司')
      if (value.length !== 18) {
        callback(new Error('请输入18位统一社会信用代码'))
      } else if (await this.getTaxCodeIsExist({ id: this.id, taxCode: value })) {
        // 通过接口检查是否已存在
        callback(new Error('统一社会信用代码已存在'))
      } else {
        callback()
      }
    },
    ...mapMutations('customerMsg', {
      setTaxCode: 'SET_TAXCODE'
    }),
    // // 点击文件列表中已上传的文件时，预览
    // handlePreview(file) {
    //   this.$viewer([{ url: file?.response?.data[0]?.address }])
    //   // this.preview = file?.response?.data[0]?.address
    //   // this.dialogVisible = true
    // },
    handlePreviewImg(index) {
      this.$viewer(this.fileList, { initialViewIndex: index || 0 })
    }
    // // 超出图片限制时的钩子
    // handleExceed(files, fileList) {
    //   this.$message.warning(`当前限制选择 1 个文件，重新上传需删除原文件`)
    // },
    // // 删除附件图片
    // beforeRemove(file, fileList) {
    //   return new Promise((resolve, reject) => {
    //     this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     })
    //       .then(() => {
    //         const imageId = file.response?.data[0]?.imageId
    //         this.$api.customerMsg.deleteImage(imageId).then(res => {
    //           if (res.resultCode === 0) {
    //             this.$message.success('删除成功')
    //             resolve(true)
    //           } else {
    //             this.$message.error('删除失败，请重试')
    //           }
    //         })
    //       })
    //       .catch(() => {
    //         reject(false)
    //       })
    //   })
    // },
    // // 上传图片成功
    // uploadImgSuccess(response, file, fileList) {
    //   console.log(file)
    //   if (response.data !== 'null' && Number(response.resultCode) === 0) {
    //     this.$message.success(response.message)
    //     this.btnLoading = false
    //   } else {
    //     this.$message.error('上传失败，请重试')
    //     this.btnLoading = false
    //   }
    //   console.log(fileList)
    //   this.fileList = []
    //   for (const i in fileList) {
    //     if (Number(fileList[i].response.resultCode) === 0) {
    //       this.fileList.push(fileList[i])
    //     }
    //   }
    // },
    // // 上传图片失败
    // uploadImgError() {
    //   this.btnLoading = false
    //   this.$message.error('上传失败，请重试')
    // },
    // // 执照上传前
    // uploadBefore(file) {
    //   this.btnLoading = true
    //   var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
    //   const extension = testmsg === 'png'
    //   const extension2 = testmsg === 'jpg'
    //   const extension3 = testmsg === 'jpeg'
    //   if (!extension && !extension2 && !extension3) {
    //     this.btnLoading = false
    //     this.$message.error('只能上传jpg/png/jpeg格式的图片')
    //     return false
    //   }
    //   this.attachmentsData.dataId = Date.now()
    // }
  }
}
</script>
<style lang="scss" scoped>
.ruleForm_editNew{
  ::v-deep .el-form-item {
    margin-bottom: 10px;
    .el-form-item__content {
      display: flex;
      flex-wrap:wrap;
      .el-radio-group{
        margin-top: 8px;
      }
      .img_new{
        width: 100%;
        .new_ul{
          display: flex;
          flex-wrap:wrap;
          img{
            width: 96px;
            height: 64px;
            border: 1px solid #EEEEEE;
            margin-right: 5px;
          }
        }
        .new_null{
          line-height: 32px;
        }

      }
      .img_span{
        line-height: 32px;
      }
    }
  }
}
.customer{
  width: 100%;
  display: inline-table;
  padding: 0 96px 20px 96px;
  box-sizing: border-box;
  .el-form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-form-item {
      width: 46%;
      // float: left;
      ::v-deep .el-form-item__label {
        color: #000000;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
}
</style>
