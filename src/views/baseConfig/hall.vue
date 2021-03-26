<template>
  <Layout>
    <div slot="head">
      <InlineForm
        ref="ruleForm"
        :model="ruleForm"
        label-width="70px"
        form-item-width="270px"
        form-item-content-width="200px"
      >
        <el-form-item label="展馆">
          <el-select v-model="ruleForm.exhall" clearable filterable>
            <el-option
              v-for="item in hallList"
              :key="item.id"
              :label="item.exhall"
              :value="item.exhall"
            />
          </el-select>
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="resetPage"
        >搜索</el-button>
        <el-button @click="resetForm">重置</el-button>
      </InlineForm>
    </div>
    <div>
      <MainTitle />
      <div>
        <el-button icon="el-icon-plus" @click="toAdd">添加</el-button>
      </div>
      <TablePager
        v-loading="loading"
        row-key="id"
        :current-page="page.pageNo"
        :data="tableData"
        :tree-props="{ children: 'childItems', hasChildren: 'hasChildren' }"
        :total="total"
        @page="getPage"
      >
        <el-table-column :formatter="isNull" label="展馆" prop="exhall" />
        <el-table-column :formatter="isNull" label="地址" prop="address" />
        <el-table-column :formatter="isNull" label="联系人" prop="linkman" />
        <el-table-column :formatter="isNull" label="电话" prop="phone" />
        <el-table-column
          :formatter="formatMode"
          label="打印模板"
          prop="printModel"
        />
        <el-table-column :formatter="isNull" label="备注信息" prop="remarks" />
        <el-table-column label="操作" width="270">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="toEdit(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="mini"
              @click="toDetail(scope.row)"
            >详情</el-button>
            <el-button
              type="text"
              size="mini"
              @click="openDialog(scope.row)"
            >附件</el-button>
            <el-button
              type="text"
              size="mini"
              @click="toHallConfig(scope.row)"
            >展馆号配置</el-button>
            <ConfirmButton
              size="mini"
              type="danger"
              @onConfirm="deleteRow(scope.row)"
            >删除</ConfirmButton>
          </template>
        </el-table-column>
      </TablePager>
      <el-dialog
        title="附件"
        :visible="dialogVisible"
        width="40%"
        @close="toggleDiaolog"
      >
        <div class="dialog">
          <div class="dialog-title">
            {{ curRow.exhall }}
          </div>
          <div class="dialog-desc">
            上传图片附件将用于自助机展示展馆介绍，可查看如示例图片所示
          </div>
          <div v-if="dialogVisible">
            <EmsUpload
              :data="dialogUploadData"
              :list.sync="curRow.fileList"
              :example-imgs="exampleImgs"
            />
          </div>
        </div>
      </el-dialog>
    </div>
  </Layout>
</template>

<script>
import ListMixins from '@/mixins/ems/ListMixins'
import hallMixins from '@/mixins/ems/hall'
import uploadMixins from '@/mixins/ems/upload'
import EmsUpload from '@/components/base/EmsUpload'
import api from '@/api/index'
export default {
  name: 'KeepAlive',
  components: { EmsUpload },
  mixins: [ListMixins, hallMixins, uploadMixins],
  data() {
    return {
      tableData: [],
      ruleForm: {
        exhall: ''
      },
      loading: false,
      total: 0,
      params: {},
      dialogVisible: false,
      curRow: {},
      dialogUploadData: {},
      exampleImgs: []
    }
  },
  created() {
    this.initDataFn()
  },
  methods: {
    initDataFn() {
      this.getHallList()
    },
    searchPage() {
      this.resetPage()
    },
    resetForm() {
      this.ruleForm = {
        exhall: ''
      }
    },
    getList() {
      this.params = Object.assign({}, this.ruleForm, this.page)
      this.params = JSON.parse(JSON.stringify(this.params))
      this.loading = true
      api.baseConfig.hallPage(this.params).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.loading = false
      })
    },
    toEdit(row) {
      this.toRouter('BaseConfigHallEdit', { id: row.id })
    },
    toDetail(row) {
      this.toRouter('BaseConfigHallDetail', { id: row.id })
    },
    toAdd() {
      this.toRouter('BaseConfigHallAdd')
    },
    toHallConfig(row) {
      this.toRouter('BaseConfigHallConfig', { id: row.id, name: row.exhall })
    },
    deleteRow(row) {
      api.baseConfig.deleteHall(row.id).then(res => {
        this.getList()
      })
    },
    formatMode(row) {
      let result = ''
      if (row.printModel === 'SHEN_ZHEN_PRINT') {
        result = '深圳打印模板'
      } else if (row.printModel === 'NAN_NING_PRINT') {
        result = '南宁打印模板'
      } else if (row.printModel === 'QING_DAO_PRINT') {
        result = '青岛打印模板'
      } else if (row.printModel === 'BAI_MA_PRINT') {
        result = '白马打印模板'
      } else {
        result = row.printModel || '-'
      }
      return result
    },
    openDialog(row) {
      this.getHallImgs(row.id).then(imgs => {
        row.fileList = imgs
        this.exampleImgs.length === 0 && this.getHallExampleImg()
        this.curRow = row
        this.dialogUploadData = {
          dataId: this.curRow.id,
          type: 'EXHALL_PIC'
        }
        this.toggleDiaolog()
      })
    },
    toggleDiaolog() {
      this.dialogVisible = !this.dialogVisible
    },
    getHallExampleImg() {
      api.baseConfig.getHallExampleImg().then(res => {
        if (res.resultCode === 0) {
          this.exampleImgs = this.formatImages(res.data)
        }
      })
    },
    getHallImgs(id) {
      return new Promise(resolve => {
        api.baseConfig.getHallImgs(id).then(res => {
          if (res.resultCode === 0) {
            resolve(this.formatImages(res.data.images))
          }
        })
      })
    }
  }
}
</script>

<style></style>
