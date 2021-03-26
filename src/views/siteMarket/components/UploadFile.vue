<template>
  <div class="project">
    <el-dialog
      title="上传文件"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      center
    >
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="文件类别: " prop="module">
          <el-select
            v-model="form.module"
            :disabled="categoryConfig.length===1?true:false"
          >
            <WrapOption
              v-for="item in categoryConfig"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="二级类别: " prop="typeInModule">
          <el-select
            v-model="form.typeInModule"
            placeholder="请选择类别"
          >
            <WrapOption
              v-for="item in typeInModuleoption"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="选择文件: " prop="name">
          <span class="uplaodTitleone">单次上传最大15M,超过请将文件分开上传</span>
          <div class="uplaod">
            <!-- @onSuccess="conso"监听上传成功事件 -->
            <UploadImage :data="data" />
            <span class="uplaodTitle">已选择2个文件</span>
          </div>
        </el-form-item>

        <el-form-item label="是否公开: " prop="isPublic">
          <el-radio-group v-model="form.isPublic">
            <el-radio label="公开" />
            <el-radio label="不公开" />
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmUpload('form')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UploadImage from '@/components/Upload/UploadImage'
import WrapOption from '@/components/base/WrapOption'
export default {
  components: { UploadImage, WrapOption },
  props: {
    categoryConfig: {
      type: Array,
      default: () => []
    },
    currentInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        name: '',
        module: '', // 一级的options
        typeInModule: '',
        isPublic: ''
      },
      data: {
        type: 'CUSTOMER_BUSINESS_LICENSE' // 图片type
      },
      rules: {
        module: [
          { required: true, message: '请选择文件类别', trigger: 'blur' }
        ],
        typeInModule: [
          { required: true, message: '请选择文件类别', trigger: 'blur' }
        ],
        // name: [
        //   { required: true, message: '请输入活动名称', trigger: 'blur' }
        // ],
        isPublic: [
          { required: true, message: '请选择是否公开', trigger: 'blur' }
        ]
      },
      typeInModuleoption: []
    }
  },
  watch: {
    categoryConfig(val) {
      this.form.module = ''
      if (val.length === 1) {
        this.form.module = val[0].value
        this.typeInModuleoption = val[0].children
      }
      // console.log(this.twoList)
    }
  },
  created() {
  },
  methods: {
    // 确定
    confirmUpload(formName) {
      console.log(formName)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(555555)
          alert('submit!')
          this.dialogVisible = false
          this.$emit('confirm', this.form)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // confirmUpload() {
    //   this.dialogVisible = false
    //   this.$emit('confirm', this.form)
    //   // console.log(this.currentInfo)
    // },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.project {
  .uplaod {
    display: flex;
    .uplaodTitle {
      margin-left: 15px;
      color: #c4c4c4;
    }
  }
  .uplaodTitleone{
    color: #c4c4c4;
  }
}
::v-deep .el-input__inner {
  width: 412px !important;
}
</style>
