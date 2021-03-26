<template>
  <div>
    <dialog-page
      :dialog-show="dialogShow"
      width="600px"
      :title="(titleName==='删除' || titleName==='批量删除') ? '':titleName==='新建同级文件夹' ? '新建文件夹':titleName"
      @handleCancel="handleCancel"
    >
      <div v-if="dialogShow">
        <div v-if="(titleName==='新建文件夹' || titleName==='新建同级文件夹')" class="add">
          <div class="title">文件夹权限默认私密，创建后可对文件夹权限进行配置。</div>
          <el-form ref="ruleForm" :model="addForm" size="small" :rules="rules" label-width="auto" class="demo-ruleForm">
            <el-form-item label="文件夹名称：" :prop="titleName==='新建文件夹'?'name':''">
              <el-input v-model="addForm.name" />
            </el-form-item>
          </el-form>
          <div class="footBtn footBtn_right">
            <el-button type="primary" @click="submit">确定</el-button>
          </div>
        </div>
        <div v-if="titleName==='删除' || titleName==='批量删除'" class="delete">
          <div class="delete_ul">
            <div class="delete_li">确定删除此素材吗</div>
            <div class="delete_li delete_li_span">删除后将无法恢复</div>
          </div>
          <div class="footBtn">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="get_datalibDelete">确定</el-button>
          </div>
        </div>
        <div v-if="titleName==='重命名'" class="add">
          <el-form ref="ruleForm" :model="addForm" size="small" :rules="rules" label-width="auto" class="demo-ruleForm">
            <el-form-item label="名称：" :prop="titleName==='重命名'?'name':''">
              <el-input v-model="addForm.name" />
            </el-form-item>
          </el-form>
          <div class="footBtn footBtn_right">
            <el-button type="primary" @click="submit">确定</el-button>
          </div>
        </div>
        <div v-if="titleName==='下载文件'" class="add">
          <div class="title">已选择{{ changeLength }}份文件，需提交下载申请，等待审核通过后才可下载。</div>
          <el-form ref="ruleForm" label-position="top" :model="addForm" size="small" :rules="rules" label-width="auto" class="demo-ruleForm">
            <el-form-item label="用途：" :prop="titleName==='下载文件'?'purpose':''">
              <el-input v-model.trim="addForm.purpose" type="textarea" :autosize="{ minRows: 5, maxRows: 10}" />
            </el-form-item>
          </el-form>
          <div class="footBtn">
            <el-button type="primary" @click="submit">提交申请</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </div>
        </div>
        <div v-if="titleName==='移动'" class="add">
          <el-tree ref="treeForm" :data="treeData" node-key="node.name" check-strictly show-checkbox :props="defaultProps" @check-change="handleClick" @node-click="handleNodeClick" />
          <div class="footBtn">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary">确定</el-button>
          </div>
        </div>
        <div v-if="titleName==='查看详情'" class="add">
          <row-text style="margin-bottom:20px" :text="'基础信息'" />
          <div class="new_ul">
            <div class="new_li new_li_content">
              <div v-if="from.node_type==='png' || from.node_type==='gif' || from.node_type==='jpg'" class="new_li_content_png" :style="{background:'url('+EncodeURIFilter(resLink)+')no-repeat'}" />
              <div v-else-if="from.node_type==='docx' || from.node_type==='doc' " class="logo_word logo_other" />
              <div v-else-if="from.node_type==='ppt' || from.node_type==='pptx' " class="logo_ppt logo_other" />
              <div v-else-if="from.node_type==='mp3' || from.node_type==='mp4'" class="logo_mp3 logo_other" />
              <div v-else-if="from.node_type==='xlsx' || from.node_type==='xls'" class="logo_excel logo_other" />
              <div v-else-if="from.node_type==='rar' || from.node_type==='zip'" class="logo_compress logo_other" />
              <div v-else-if="from.node_type==='pdf'" class="logo_pdf logo_other" />
              <div v-else-if="from.node_type==='txt'" class="logo_txt logo_other" />
              <div v-else class="logo_unknown logo_other" />
            </div>
            <div class="new_li">
              <div class="li">文件名称：<span>{{ from.node.name||'-' }}</span></div>
              <div class="li">文件大小：<span>{{ from.file_size }}</span></div>
              <div class="li">文件类型：<span>{{ from.type_name||'-' }}</span></div>
              <div class="li">创建人：<span>{{ 'createBy' in from.node ? from.node.createBy.name:'-' }}</span></div>
              <div class="li">创建时间：<span>{{ from.node.createDate||'-' }}</span></div>
              <div class="li">下载次数：<span>{{ journal.length }}次</span></div>
            </div>
          </div>
          <row-text style="margin-bottom:20px" :text="'下载记录'" />
          <div class="new_ul">
            <div class="new_li" style="width:100%">
              <div v-for="(item,index) of journal" :key="index" class="li">{{ item.operationTime }}<span class="span" /><span>{{ item.operator.name }}下载了素材</span></div>
            </div>
          </div>
        </div>
      </div>
    </dialog-page>
  </div>
</template>
<script>
import RowText from '@/components/rowText'
import DialogPage from '@/components/dialog/dialog'
import { EncodeURIFilter } from '@/utils/common'
export default {
  components: { DialogPage, RowText },
  props: {
    titleName: {
      type: String,
      default: ''
    },
    dialogShow: {
      type: Boolean,
      default: false
    },
    parentId: {
      type: Number,
      default: 0
    },
    id: {
      type: Number,
      default: 0
    },

    changeLength: {
      type: Number,
      default: 0
    }

  },
  data() {
    return {
      treeData: [],
      journal: [],
      i: 0,
      addForm: {
        name: '',
        purpose: ''
      },
      from: {
        node: {}
      }, // 详情数据
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        purpose: [
          { required: true, message: '请输入用途', trigger: 'blur' }
        ]
      },
      resLink: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    // titleName(val) {
    //   switch (val) {
    //     case '重命名':
    //       this.get_datalibEdit()
    //       break
    //   }
    // }
  },
  created() {
  },
  methods: {
    EncodeURIFilter(str) {
      return EncodeURIFilter(str)
      // if (str !== null && str !== '') {
      //   str = str.replace(/\+/g, '%2B')
      //   str = str.replace(/\&/g, '%26')
      //   str = str.replace(/\ /g, '%20')
      //   str = str.replace(/\（/g, '%28')
      //   str = str.replace(/\）/g, '%29')
      //   str = str.replace(/\(/g, '%28')
      //   str = str.replace(/\)/g, '%29')
      //   // str = str.replace(/\&/g, '%26')
      //   // str = str.replace(/\&/g, '%26')
      // }
      // return str
    },
    // 获取文件树状
    get_treeType() {
      this.$api.content.treeType({ types: ['FOLDER'] }).then(res => {
        if (res) {
          this.treeData = res.children
        }
      })
    },

    // 管理 - 批量删除
    get_datalibDelete() {
      if (this.titleName === '批量删除') return this.$emit('get_datalibDelete')
      this.$api.content.datalibDelete([this.id]).then(res => {
        if (res) {
          this.$message.success('删除成功')
          this.$emit('refresh', 'initNum')
          this.$emit('get_datalibDelete')
        }
      })
    },
    handleClick(data, checked, node) {
      this.i++
      if (this.i % 2 === 0) {
        if (checked) {
          this.$refs.treeForm.setCheckedNodes([])
          this.$refs.treeForm.setCheckedNodes([data])
          // 交叉点击节点
        } else {
          this.$refs.treeForm.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    handleNodeClick(data, checked, node) {
      this.i++
      if (this.i % 2 === 0) {
        if (checked) {
          this.$refs.treeForm.setCheckedNodes([])
          this.$refs.treeForm.setCheckedNodes([data])
          // 交叉点击节点
        } else {
          this.$refs.treeForm.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    handleCancel() {
      this.addForm.name = ''
      this.$emit('handleCancel')
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          switch (this.titleName) {
            case '新建文件夹':
              this.get_datalibAdd()
              break
            case '新建同级文件夹':
              this.get_datalibAdd()
              break
            case '重命名':
              this.get_datalibAdd()
              break
            case '下载文件':
              this.$emit('get_applicationAdd', this.addForm.purpose)
              break
          }
        }
      })
    },
    // 文件夹新增
    get_datalibAdd() {
      const json = {}
      if (this.titleName === '新建文件夹' || this.titleName === '新建同级文件夹') {
        json['node'] = {
          name: this.addForm.name,
          type: 'FOLDER'
        }
        if (Number(this.parentId) !== 0 && this.titleName === '新建文件夹') {
          json['node']['parentId'] = this.parentId
        }
        this.$api.content.datalibAdd(json).then(res => {
          if (res) {
            res['titleName'] = this.titleName
            this.$emit('refresh', res)
            this.handleCancel()
          }
        })
      } else {
        if (this.from.node.type === 'FILE') {
          json['name'] = this.addForm.name + '.' + this.from.node_type
        } else {
          json['name'] = this.addForm.name
        }
        json['id'] = this.id
        // json['parentId'] = this.parentId
        this.$api.content.datalibReplace(json).then(res => {
          if (res) {
            res['titleName'] = this.titleName
            this.$emit('refresh', res)
            this.handleCancel()
          }
        })
      }
    },
    // 获取文件类型
    get_file_type(name) {
      if (name.includes('.')) {
        const num = name.substring(name.lastIndexOf('.') + 1)
        return num
      } else {
        return '-'
      }
    },
    // 管理 - 通过id获取详情（通过资料库结点id获取结点详情，其中depth表示递归寻找子结点的深度，0表示不寻找，1表示找到一级子代，以此类推）
    get_datalibEdit() {
      const json = {
        id: this.id,
        depth: 0
      }
      this.$api.content.datalibEdit(json).then(res => {
        if (res) {
          this.resLink = ''
          res['type_name'] = res.node.type === 'FILE' ? '文件' : '文件夹'
          res['node_type'] = 'resLink' in res ? this.get_file_type(res.resLink) : '-'
          res['file_size'] = 'size' in res.node ? this.fileSize(Number(res.node.size)) : 0
          if (res.node.type !== 'FOLDER') {
            const last_index = res.node.name.lastIndexOf('.')
            this.addForm = {
              name: res.node.name.substring(0, last_index)
            }
            // this.addForm.name = res.node.name.substring(0, last_index)
          } else {
            this.addForm = {
              name: res.node.name
            }
            // this.addForm.name = res.node.name
          }
          this.from = res
          if (this.titleName === '查看详情' && 'resLink' in res) {
            this.resLink = res.resLink
          }
        }
      })
    },
    get_operationLogBoth() {
      const json = {
        query: {
          node: {
            id: this.id
          },
          operationTypes: ['DIRECTLY_DOWNLOAD', 'APPLY_TO_DOWNLOAD']
        },
        index: 0,
        size: 0
      }
      this.$api.content.operationLog(json).then(res => {
        if (res) {
          this.journal = res.list
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.textarea_input{
  max-height: 300px;
}
.new_li_content{
  display: flex;
  flex-direction:row;
  justify-content:center;
  align-items: center;
  div{
    width: 50%;
    height: 50%;
    background-repeat: no-repeat;
    background-size: 100% 100% ;
  }
  .new_li_content_png{
    background-size: 100% 100% !important;
  }
  .logo_other{
    height: 57%;
  }
  .logo_word{
    background : url('~@/assets/gongge_images/word.png') no-repeat;
  }
  .logo_ppt{
    background : url('~@/assets/gongge_images/ppt.png') no-repeat;
  }
  .logo_mp3{
    background : url('~@/assets/gongge_images/mp3.png') no-repeat;
  }
  .logo_excel{
    background : url('~@/assets/gongge_images/excel.png') no-repeat;
  }
  .logo_compress{
    background : url('~@/assets/gongge_images/compress.png') no-repeat;
  }
  .logo_pdf{
    background : url('~@/assets/gongge_images/pdf.png') no-repeat;
  }
  .logo_txt{
    background : url('~@/assets/gongge_images/txt.png') no-repeat;
  }
  .logo_unknown{
    background : url('~@/assets/gongge_images/unknown.png') no-repeat;
  }
}
.footBtn{
  width: 100%;
  text-align: center;
  .el-button{
    width: 96px;
  }
}
.footBtn_right{
  text-align: right;
}
.el-form{
  ::v-deep .el-form-item{
    .el-form-item__label{
      font-size: 14px;
      font-weight: 400;
    }
  }
}
.add{
  .title{
    font-size: 12px;
    color:#999999;
    line-height: 20px;
    margin-bottom: 30px;
  }
  .new_ul{
    width: 100%;
    display: flex;
    justify-content: space-between;
    .new_li{
      width: 50%;
      img{
        width: 40%;
        height: auto;
        display: flex;
        flex-direction:row;
        justify-content: center;
        align-items: center;
      }
      .li{
        font-size: 14px;
        color: #666666;
        font-weight: 400;
        line-height: 32px;
        span{
          color: #000000;
        }
        .span{
          width: 8px;
          height: 8px;
          display: inline-table;
          border-radius: 50%;
          background: #CCCCCC;
          margin: 0 8px;
        }
      }
    }
  }
}
.delete{
  .delete_ul{
    width: 100%;
    // margin-top: 30px;
    .delete_li{
      width: 100%;
      font-size: 16px;
      color: #000000;
      font-weight: 400;
      line-height: 32px;
      margin-bottom: 13px;
      text-align: center;
    }
    .delete_li_span{
      font-size: 12px;
      color: #999999;
    }
  }
}
</style>
