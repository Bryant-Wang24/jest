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
      <el-form-item label="主体类型：" prop="bodyType" style="width:100%">
        <el-radio-group v-if="type!=='editNew'" v-model="customer.bodyType">
          <el-radio v-for="(item,index) of radioList" :key="index" :label="item.label">{{ item.title }}</el-radio>
        </el-radio-group>
        <div v-else class="img_span">{{ customer.bodyType==='COMPANY' ? '企业' : '个体工商户' }}</div>
      </el-form-item>
      <el-form-item label="客户名称：" prop="customerName">
        <el-input v-if="type!=='editNew'" v-model.trim="customer.customerName" />
        <div v-else class="img_span">{{ customer.customerName }}</div>
      </el-form-item>
      <el-form-item label="所属行业：">
        <el-select v-if="type!=='editNew'" v-model="customer.industry" placeholder="请选择">
          <WrapOption
            v-for="(item, index) of industryList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div v-else class="img_span">{{ customer.industry_name }}</div>
      </el-form-item>
      <el-form-item label="国家：" prop="country">
        <el-select v-if="type!=='editNew'" v-model="customer.country" filterable placeholder="请选择">
          <WrapOption
            v-for="item in countryList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <div v-else class="img_span">{{ customer.country }}</div>
      </el-form-item>
      <el-form-item v-if="customer.country!==''&&customer.country==='中国'" label="省市：">
        <div v-if="type!=='editNew'">
          <el-cascader v-model="customer.provinceArr" :options="options" clearable />
        </div>
        <div v-else class="img_span">{{ customer.provinceArrName||'-' }}</div>
      </el-form-item>
      <el-form-item label="地区：">
        <div v-if="type!=='editNew'">
          <el-input v-model.trim="customer.region" />
        </div>
        <div v-else class="img_span">{{ customer.region||'-' }}</div>
      </el-form-item>
      <el-form-item label="附件图片：">
        <UploadImage v-if="type!=='editNew'" class="uploadImage" accept=".jpg,.jpeg,.png" :list.sync="fileList" :data="{type: attachmentsData.type}" />
        <!-- <el-upload
          v-if="type!=='editNew'"
          :on-preview="handlePreview"
          class="upload-demo"
          :action="`${base.hall}a/api/ossImage/upload`"
          :data="attachmentsData"
          :on-success="uploadImgSuccess"
          :before-upload="uploadBefore"
          :on-error="uploadImgError"
          :before-remove="beforeRemove"
          accept=".jpg, .jpeg, .png"
          :file-list="fileList"
        >
          <el-button :loading="btnLoading">上传图片</el-button>
        </el-upload> -->
        <div v-else class="img_new">
          <div v-if="fileList.length!==0" class="new_ul">
            <img v-for="(item,index) of fileList" :key="index" :src="item.url" alt="" @click="handlePreviewImg(index)">
          </div>
          <div v-else class="new_null">暂无附件图片</div>
        </div>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-if="type!=='editNew'" v-model="customer.remarks" type="textarea" />
        <span v-else class="img_span">{{ customer.remarks }}</span>
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
import { mapGetters } from 'vuex'
import base from '@/api/base'
import { COUNTRY, PROVINCE } from '@/common/global'
import UploadImage from '@/components/Upload/UploadImage'
import WrapOption from '@/components/base/WrapOption'

export default {
  components: {
    UploadImage,
    WrapOption
  },
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
      dialogVisible: false,
      preview: '', // 预览url
      type: this.$route.params.type,
      countryList: COUNTRY, // 国家
      options: PROVINCE, // 中国省份市区
      attachmentsData: { // 默认上传参数
        dataId: '',
        type: 'CUSTOMER_ATTACHMENT'
      },
      base: base,
      fileList: [],
      btnLoading: false,
      radioList: [
        { label: 'COMPANY', title: '企业' },
        { label: 'INDIVIDUAL', title: '个体工商户' }
      ],
      // customer: {
      //   bodyType: '',
      //   companyName: '',
      //   industry: '',
      //   country: '',
      //   region: '',
      //   remarks: ''
      // },
      rules: {
        bodyType: [
          { required: true, message: '请选择主体类型', trigger: 'change' }
        ],
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        country: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
      // industryList: [
      //   {
      //     label: '会展行业',
      //     value: 1
      //   },
      //   {
      //     label: '其他',
      //     value: 2
      //   }
      // ]
    }
  },

  computed: {
    ...mapGetters({
      industryList: 'CUSTOMER_INDUSTRY'
    })
  },
  methods: {
    // // 点击文件列表中已上传的文件时，预览
    // handlePreviewImg(index) {
    //   this.$viewer(this.fileList, { initialViewIndex: index })
    //   // console.log(file)
    //   // this.preview = file.url
    //   // this.dialogVisible = true
    // },
    handlePreview(file) {
      this.$viewer([{ url: file?.response?.data[0]?.address }])
    }
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
    //   if (response.data !== 'null' && Number(response.resultCode) === 0) {
    //     this.$message.success(response.message)
    //     this.btnLoading = false
    //     this.fileList = fileList
    //   } else {
    //     this.$message.error('上传失败，请重试')
    //     this.btnLoading = false
    //   }
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
.el-cascader{
  width: 100%;
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
      // display: flex;
      // flex-wrap:wrap;
      ::v-deep .el-form-item__label {
        color: #000000;
        font-size: 14px;
        font-weight: 400;
      }
      // ::v-deep .el-form-item__content {
      //   display: flex;
      //   flex-wrap:wrap;
      //   .el-radio-group{
      //     margin-top: 8px;
      //   }
      //   .img_new{
      //     width: 100%;
      //     .new_ul{
      //       display: flex;
      //       flex-wrap:wrap;
      //       img{
      //          width: 96px;
      //          height: 64px;
      //          border: 1px solid #EEEEEE;
      //          margin-right: 5px;
      //       }
      //     }
      //     .new_null{
      //       line-height: 32px;
      //     }

      //   }
      // }
    }
  }
  .ruleForm_editNew{
    .el-form-item {
      margin-bottom: 10px;
      ::v-deep .el-form-item__content {
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
          text-align: justify;
          text-justify: newspaper;
          word-break: break-all;
          line-height: 32px;
        }
      }
    }
  }
}
</style>
