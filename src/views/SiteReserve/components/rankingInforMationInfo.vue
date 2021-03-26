<template>
  <div class="info">
    <div class="table">
      <rowText :text="'查看详情'" />
      <div class="basicsForm">
        <el-form label-width="140px" :model="Form">
          <el-form-item label="项目名称: " prop="projectName">
            <el-input
              v-model="Form.projectName"
              class="item"
              placeholder="请输入"
              disabled
            />
          </el-form-item>
          <el-form-item label="项目名称(英文): " prop="projectNameEn">
            <el-input
              v-model="Form.projectNameEn"
              class="item"
              placeholder="请输入"
            />
          </el-form-item>

          <el-form-item label="项目宣传图: " prop="propagandaMapId">
            <span class="imgtitle">建议尺寸1100*420px,图片大小不超过2M</span>
            <UploadImage
              accept=".jpg,.jpeg,.png,.gif"
              list-type="picture-card"
              :list.sync="fileList"
              :data="{type: 'EH_PROJECT_PROPAGANDA_MAP'}"
              :limit="1"
              @onSuccess="onSuccess"
              @onRemove="onRemove"
            />
          </el-form-item>

          <el-form-item label="展馆: " prop="projectName">
            <el-input
              v-model="Form.projectName"
              class="item"
              placeholder="请输入"
              disabled
            />
          </el-form-item>
          <el-form-item label="主办方: " prop="hostCompany">
            <el-input
              v-model="Form.hostCompany"
              class="item"
              placeholder="请输入"
              disabled
            />
          </el-form-item>
          <el-form-item v-for="(item) in linkMessage" :key="item.id + item.contact" label="联系人: " prop="contact">
            <el-input
              v-model="item.contact"
              class="item"
              placeholder="请输入"
              disabled
            />
          </el-form-item>
          <el-form-item v-for="(item) in linkMessage" :key="item.id + item.phone" label="联系方式: " prop="phone">
            <el-input
              v-model="item.phone"
              class="item"
              placeholder="请输入"
              disabled
            />
          </el-form-item>
          <el-form-item label="开展时间: " prop="launchDate">
            <el-input
              v-model="Form.launchDate"
              class="item"
              placeholder="请输入"
              disabled
            />
          </el-form-item>
          <el-form-item label="官方网站: " prop="website">
            <el-input
              v-model="Form.website"
              class="item"
              placeholder="请输入"
              disabled
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="bottom-btn">
        <el-button type="primary" @click="projectMakeFormBtn">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import rowText from '@/components/rowText'
import UploadImage from '@/components/Upload/UploadImage'
export default {
  name: 'RankingInforMationInfo',
  components: {
    rowText,
    UploadImage
  },
  data() {
    return {
      fileList: [],
      infoList: [],
      id: '',
      Form: {
        projectName: '',
        projectNameEn: '',
        hostCompany: '',
        launchDate: '',
        website: '',
        propagandaMapId: ''
      },
      linkMessage: []
    }
  },
  created() {
    this.getsalesInformation()
  },
  methods: {
    onSuccess(response, file, fileList) {
      this.Form.propagandaMapId = response.response.data[0].imageId
      // for (const i in response.response.data) {
      //   const idArray = []
      //   idArray.push(response.response.data[i].imageId)
      // }
      // this.Form.propagandaMapId = this.idArray
    },
    onRemove(file, fileList) {
      console.log('删除file', file)
      console.log('删除fileList', fileList)
    },
    getsalesInformation() {
      this.id = this.$route.params.id
      this.$api.siteReserveList.salesInformation(this.id).then(res => {
        const { siteSale, linkMessage } = res
        const { propagandaMapAddress, propagandaMapId } = siteSale
        this.Form = siteSale
        this.linkMessage = linkMessage
        this.fileList = (propagandaMapAddress && propagandaMapId) ? [
          {
            address: propagandaMapAddress,
            imageId: propagandaMapId,
            response: { data: [{ imageId: propagandaMapId }] }
          }
        ] : []
        // if (linkMessage.length > 1) {
        //   const contact = []
        //   const phone = []
        //   for (const i in linkMessage) {
        //     contact.push(linkMessage[i].contact)
        //     phone.push(linkMessage[i].phone)
        //   }
        // }
      })
    },
    projectMakeFormBtn() {
      console.log(this.Form.propagandaMapId)
      const params = {
        projectId: this.id,
        projectNameEn: this.Form.projectNameEn || null,
        propagandaMapId: this.Form.propagandaMapId || null
      }
      this.$api.siteReserveList.updateProject(params).then(res => {
        this.$router.push({
          name: `RankingInforMation`
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  padding: 20px;
  .table {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background: white;
    .basicsForm {
      margin-top: 50px;
      .item {
        width: 480px;
        height: 34px;
        background: #f1f1f1;
        border: 1px solid #e1e1e1;
        opacity: 1;
        border-radius: 2px;
      }
      .el-input {
        margin-left: 10px;
      }
      .imgtitle {
        width: 283px;
        height: 20px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 20px;
        color: #999999;
        opacity: 1;
      }
    }
    .bottom-btn{
        margin-left: 148px;
    }
  }
}
</style>
