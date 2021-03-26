<template>
  <div id="contact">
    <el-form ref="form" :model="form" :rules="rules" label-width="12px">
      <el-table
        ref="table"
        :data="form.tableData"
        :header-cell-style="tableHeaderStyle"
        :row-class-name="tableRowClassName"
        border
        empty-text="暂无数据"
      >
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <el-form-item
              :prop="`tableData.${scope.$index}.name`"
              :rules="rules.name"
              label=" "
            >
              <el-input v-if="type!=='editNew'" v-model.trim="scope.row.name" placeholder="请输入" />
              <div v-else>{{ scope.row.name }}</div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <el-form-item :prop="`tableData.${scope.$index}.gender`">

              <el-select v-if="type!=='editNew'" v-model="scope.row.gender" placeholder="请选择">
                <WrapOption
                  v-for="item in gender"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
              <div v-else>{{ scope.row.gender==='MALE'? '男':scope.row.gender==='FEMALE'?'女':'-' }}</div>

            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="联系电话">
          <template slot-scope="scope">
            <el-form-item
              :prop="`tableData.${scope.$index}.phone`"
              :rules="rules.phone"
              label=" "
            >
              <el-input v-if="type!=='editNew'" v-model.trim="scope.row.phone" placeholder="请输入" />
              <div v-else>{{ scope.row.phone }}</div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="职位">
          <template slot-scope="scope">
            <el-form-item :prop="`tableData.${scope.$index}.position`">
              <el-input
                v-if="type!=='editNew'"
                v-model.number="scope.row.position"
                placeholder="请输入"
              />
              <div v-else>{{ scope.row.position||'-' }}</div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="微信号">
          <template slot-scope="scope">
            <el-form-item :prop="`tableData.${scope.$index}.wechat`">
              <el-input
                v-if="type!=='editNew'"
                v-model.number="scope.row.wechat"
                placeholder="请输入"
              />
              <div v-else>{{ scope.row.wechat||'-' }}</div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="Email">
          <template slot-scope="scope">
            <el-form-item :prop="`tableData.${scope.$index}.email`">
              <el-input
                v-if="type!=='editNew'"
                v-model="scope.row.email"
                type="email"
                placeholder="请输入"
              />
              <div v-else>{{ scope.row.email||'-' }}</div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="固定电话">
          <template slot-scope="scope">
            <el-form-item :prop="`tableData.${scope.$index}.fixedPhone`">
              <el-input
                v-if="type!=='editNew'"
                v-model.number="scope.row.fixedPhone"
                placeholder="请输入"
              />
              <div v-else>{{ scope.row.fixedPhone||'-' }}</div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column v-if="type!='editNew'" label="操作">
          <template slot-scope="scope">
            <el-button

              size="mini"
              type="text"
              @click="del(scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <!-- 添加联系人 -->
    <div v-if="type!='editNew'" class="add">
      <el-button type="primary" @click="addContact">添加联系人</el-button>
    </div>
    <!-- <el-button type="primary" @click="check">检查</el-button> -->
  </div>
</template>

<script>
import { GENDER } from '@/common/customerMsg'
import { deepClone } from '@/utils'
import WrapOption from '@/components/base/WrapOption'
function _tableData() {
  this.name = ''
  this.gender = null
  this.phone = ''
  this.position = ''
  this.wechat = ''
  this.email = ''
  this.fixedPhone = ''
  this.isDefault = 1
  this.delFlag = 0
}

export default {
  name: 'Contact',
  components: { WrapOption },
  props: {
    model: {
      // 当有model时为编辑
      type: Array,
      default: null
    }
  },
  data() {
    return {
      type: this.$route.params.type,
      gender: GENDER,
      form: {
        tableData: [
          {
            id: null,
            name: '',
            gender: null,
            phone: '',
            position: '',
            wechat: '',
            email: '',
            fixedPhone: '',
            delFlag: 0, // 此字段为1时，代表需删除(同时不显示在页面上)，默认为0
            isDefault: 1 // 是否是默认联系人，0是，1不是
          }
        ]
      },
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请填写姓名' }],
        phone: [
          { required: true, trigger: 'blur', message: '请填写联系电话' }
          // {
          //   pattern: /^1[3456789]\d{9}$/,
          //   message: '手机号格式有误',
          //   trigger: 'blur'
          // }
        ],
        email: [
          {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          }
        ]
      }
    }
  },
  watch: {
    model(formData) {
      this.form.tableData = [...deepClone(formData)]
    }
  },
  methods: {
    getFormData() {
      const data = { ...this.form }
      // 修改第一个非删除为默认，其他改为非默认
      for (let i = 1; i < data.tableData.length; i++) {
        data.tableData[i].isDefault = 1
      }
      for (let i = 0; i < data.tableData.length; i++) {
        const item = data.tableData[i]
        if (Number(item.delFlag) !== 1) {
          item.isDefault = 0
          break
        }
      }
      // data.tableData[0].isDefault = 0
      return { ...data }
    },
    // 自定义类名，控制delFlag为1的数据隐藏
    tableRowClassName({ row }) {
      if (Number(row.delFlag) === 1) {
        return 'hiddenRow'
      }
      return ''
    },
    tableHeaderStyle() {
      return {
        'background-color': '#f5f7fa'
      }
    },
    del(index) {
      if (this.form.tableData.length !== 1) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            if (!this.form.tableData[index].id) {
              this.form.tableData.splice(index, 1)
            } else {
              this.form.tableData[index].delFlag = 1
              this.form.tableData[index].isDefault = 1
            }
            // var arr = this.form.tableData
            // var delFlag = 0
            // for (var i in arr) {
            //   if (arr[i].delFlag.toString() === '0') {
            //     delFlag++
            //   }
            // }
            // if (delFlag === 1) return this.$message.warning('请至少保留一条数据')
            // // this.form.tableData.splice(index, 1)
            // this.form.tableData[index].delFlag = 1
            // this.form.tableData[index].isDefault = 1
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(() => {})
      } else {
        this.$message({
          type: 'warning',
          message: '至少填写一行数据'
        })
      }
    },
    addContact() {
      const item = new _tableData()
      this.form.tableData.push(item)
    },
    check() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#contact {
  padding: 20px 0;
  .add {
    margin-top: 20px;
  }
  ::v-deep .hiddenRow {
  display: none;
}
}
.el-form-item {
  margin-top: 22px;
}

</style>
