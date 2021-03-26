<template>
  <div class="content_new">
    <div class="table">
      <div class="table_title">{{ titleName }}下载申请</div>
      <rowText :text="'基础信息'" />
      <div class="ul">
        <div class="li">申请编号：{{ newData.application.no || '-' }}</div>
        <div class="li">申请人：{{ newData.application.applicant.name || '-' }}</div>
        <div class="li">申请时间：{{ newData.application.applicationTime || '-' }}</div>
        <div class="li">文件数量：{{ newData.applicationNodes.length || '-' }}</div>
        <div v-if="type!=='edit'" class="li">用途：{{ newData.application.purpose || '-' }}</div>
        <div class="li">状态：{{ newData.state_name }}</div>
      </div>
      <rowText :text="'申请下载文件'" />
      <table-page
        :table-loading="tableLoading"
        :table-data="newData.applicationNodes"
        :table-header="[]"
      >
        <el-table-column label="文件名" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tooltip class="item" :disabled="!scope.row.node.delFlag" effect="dark" content="文件已被删除，无法进行下载" placement="top">
              <span>{{ scope.row.node.name }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- <el-table-column label="文件大小">
          <template slot-scope="scope">
            {{ scope.row.node_type }}
          </template>
        </el-table-column> -->
        <el-table-column v-for="(item,index) in tableHeader" :key="index" :label="item.text" :prop="item.key" :min-width="item.minWidth" />
        <el-table-column v-if="type==='edit'" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="delete_id(scope.$index)">取消申请</el-button>
          </template>
        </el-table-column>
      </table-page>
      <el-form v-if="type==='edit'" ref="validateForm" label-position="top" :model="newData.application" label-width="100px" class="demo-ruleForm">
        <el-form-item
          label="用途"
          prop="purpose"
          :rules="[
            { required: true, message: '用途内容不可为空', trigger: 'blur' },
          ]"
        >
          <el-input v-model="newData.application.purpose" type="textarea" />
        </el-form-item>
      </el-form>
      <approval-line :vertical="vertical" :approve-id="approveId" />
      <div class="footBtn">
        <el-button @click="submitFrom('返回')">返回</el-button>
        <approvalBtn v-if="type==='audit'" :approve-id="approveId" :visible.sync="approveVisible" @refresh="submitFrom('返回')" />
        <el-button v-if="type==='edit'" type="primary" @click="submitFrom('提交')">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import ApprovalLine from '@/components/ApprovalLine/index'
import TablePage from '@/components/table/table'
import rowText from '@/components/rowText'
import approvalBtn from '@/components/ApprovalOperate/index'
export default {
  components: { rowText, TablePage, ApprovalLine, approvalBtn },
  data() {
    return {
      vertical: false,
      titleName: '',
      approveVisible: true,
      type: '',
      id: '',
      approveId: '1', // 审批id
      newData: {
        application: {
          // applicant: {}
        },
        applicationNodes: []
      },
      tableLoading: false,
      btnLoading: false,
      tableData: [],
      tableHeader: [
        { key: 'node_type', text: '文件类型', minWidth: '120' },
        { key: 'file_size', text: '文件大小', minWidth: '160' },
        { key: 'node.createBy.name', text: '创建人', width: '120' },
        { key: 'node.createDate', text: '创建时间', width: '160' }
      ],
      numberValidateForm: {

      }

    }
  },
  created() {
    this.routerStyle()
  },
  methods: {

    // 获取文件类型
    get_file_type(name) {
      if (name.includes('.')) {
        const num = name.substring(name.lastIndexOf('.') + 1)
        return num
      }
      return '-'
    },
    // 取消申请
    delete_id(index) {
      if (Number(this.newData.applicationNodes.length) === 1) return this.$message.warning('至少保留一行数据')
      this.$confirm('此操作将取消该申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.newData.applicationNodes.splice(index, 1)
        })
        .catch(() => {})
    },
    routerStyle() {
      // type-(查看--editNew,修改--edit,审核--audit)
      this.type = this.$route.params.type
      this.titleName = this.type === 'editNew' ? '查看' : this.type === 'edit' ? '修改' : '审核'
      this.id = this.$route.params.id
      this.get_applicationNew()
    },
    get_applicationNew() {
      this.$api.content.applicationNew({ id: this.id }).then(res => {
        if (res) {
          res['state_name'] = res.application.state === 'UNDER_REVIEW' ? '审核中' : res.application.state === 'APPROVED' ? '审核通过' : res.application.state === 'REJECTED' ? '审核拒绝' : res.application.state === 'OBSOLETE' ? '已取消' : '已提交'
          this.approveId = 'approvalFlow' in res.application ? res.application.approvalFlow.id : ''
          const list = res.applicationNodes
          for (const i in list) {
            list[i]['node_type'] = this.get_file_type(list[i].node.name)
            list[i]['file_size'] = this.fileSize('size' in list[i].node ? Number(list[i].node.size) : 0)
          }
          this.newData = res
          this.newData.applicationNodes = list
        }
      })
    },
    //
    get_applicationAudit(val, reason) {
      const json = {
        id: this.id,
        approved: val,
        reason: reason
      }
      this.$api.content.applicationAudit(json).then(res => {

      })
    },
    submitFrom(val) {
      switch (val) {
        case '返回':
          this.$router.push({
            name: 'download'
          })
          break
        case '提交':
          this.get_applicationAdd()
          break
      }
    },
    // 提交
    get_applicationAdd() {
      const applicationNodes = []
      const list = this.newData.applicationNodes
      for (const i in list) {
        applicationNodes.push({
          id: list[i].id

        })
      }
      const json = {
        application: {
          id: this.newData.application.id,
          purpose: this.newData.application.purpose
        },
        applicationNodes: applicationNodes
      }

      this.$api.content.applicationAdd(json).then(res => {
        if (res) {
          this.$router.push({
            name: 'download'
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-form{
  width: 30%;
  margin-top: 20px;
  ::v-deep .el-form-item__label{
    font-weight: 400;
    color: #000000;
  }
}

.footBtn {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  height: 64px;
  padding: 0 56px;
  padding-left: 200px;
  box-sizing: border-box;
  line-height: 64px;
  background: white;
  text-align: center;
  font-size: 14px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  .el-button {
    width: 96px;
  }
}
.table {
  margin-top: 16px;
  width: 100%;
  padding: 24px;
  margin-bottom: 84px;
  box-sizing: border-box;
  background: white;
  .table_title {
    width: 100%;
    font-size: 18px;
    line-height: 25px;
    margin-bottom: 23px;
  }
  .ul{
    width: 100%;
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    // align-content: flex-start;
    .li{
      width: 32%;
      color: #666666;
      line-height: 32px;
      font-size: 14px;
      font-weight: 400;
      text-align: justify;
      text-justify: newspaper;
      word-break: break-all;
    }
  }
  .table_new{
    margin-top: 20px;
    padding: 0 15px;
    ::v-deep .el-table{
      border-left: 1px solid #dfe6ec;
      border-top: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
    }
    .title{
      margin-bottom: 15px;
    }
  }
}
</style>
