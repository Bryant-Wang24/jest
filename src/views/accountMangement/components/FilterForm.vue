<template>
  <el-form ref="form" v-model="searchList" :inline="true" class="searchList">

    <el-form-item class="row-item">
      <el-form-item class="inputItem" label="选择客户：" prop="customerId">
        <el-select
          v-model="searchList.customerId"
          filterable
          clearable
          placeholder="请选择"
        >
          <WrapOption
            v-for="(item, index) in customerOptions"
            :key="index"
            style="width:240px;"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="inputItem" label="到账日期：" prop="receiveTime">
        <el-date-picker
          v-model="searchList.receiveTime"
          clearable
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
        <a class="tabDate" @click="checkoutToday(true)">今天</a><i style="color:#D9D9D9">|</i>
        <a class="tabDate" @click="checkYestoday(true)">昨天</a>
      </el-form-item>
      <el-form-item class="inputItem" label="可用余额：" prop="surplus">
        <el-select
          v-model="searchList.surplus"
          filterable
          clearable
          placeholder="请选择"
          @change="surplusSelectChange"
        >
          <WrapOption
            v-for="(item, index) in surplusOptions"
            :key="index"
            style="width:240px;"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

    </el-form-item>
    <el-form-item class="row-item">

      <el-form-item class="inputItem" label="收款账户：" prop="receivableAccountId">
        <el-select
          v-model="searchList.receivableAccountId"
          clearable
          placeholder="请选择"
        >
          <WrapOption
            v-for="(item, index) in receiveAccountOptions"
            :key="index"
            style="width:240px;"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="inputItem" label="录入日期：" prop="createDate">
        <el-date-picker
          v-model="searchList.createDate"
          clearable
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
        <a class="tabDate" @click="checkoutToday(false)">今天</a><i style="color:#D9D9D9">|</i>
        <a class="tabDate" @click="checkYestoday(false)">昨天</a>
      </el-form-item>

    </el-form-item>
    <el-form-item class="row-item" style="margin-left:82px;">
      <el-button type="primary" @click="searchAccount">查询</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import WrapOption from '@/components/base/WrapOption'
export default {
  components: { WrapOption },
  props: {
    customerOptions: {
      type: Array,
      default: () => []
    },
    surplusOptions: {
      type: Array,
      default: () => []
    },
    receiveAccountOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchList: {
        customerId: '',
        receivableAccountId: '',
        receiveTime: '',
        createDate: '',
        surplus: null
      }
    }
  },
  methods: {
    getSearchList() {
      const params = { ...this.searchList }

      Reflect.deleteProperty(params, 'surplus') // 此参数前端自用，无需传给接口，在此删除
      return params
    },
    searchAccount() {
      this.$emit('searchAccount', { ...this.getSearchList() })
    },
    reset() {
      // this.$refs.form.resetFields()
      this.searchList = {
        customerId: '',
        receivableAccountId: '',
        receiveTime: '',
        createDate: '',
        surplus: null
      }
      this.$emit('reset', { ...this.getSearchList() })
    },
    checkoutToday(receTime) {
      const date = new Date()
      const myTime = date.toLocaleDateString().replace(/\//g, '-')
      if (receTime) {
        this.searchList.receiveTime = myTime
      } else {
        this.searchList.createDate = myTime
      }
    },
    checkYestoday(receTime) {
      const oldDate = Date.now() - 24 * 3600 * 1000
      const date = new Date(oldDate)
      const yy = date.getFullYear()
      const mm = date.getMonth() + 1
      const dd = date.getDate()
      const yestoday = `${yy}-${mm}-${dd}`
      if (receTime) {
        this.searchList.receiveTime = yestoday
      } else {
        this.searchList.createDate = yestoday
      }
    },
    surplusSelectChange(v) {
      switch (v) {
        case 0:
          this.searchList.minUsableAmount = null
          this.searchList.maxUsableAmount = 0
          break
        case 1:
          this.searchList.minUsableAmount = 0.01
          this.searchList.maxUsableAmount = null
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.searchList {
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  ::v-deep .el-form-item {
    margin-right: 60px;
  }
  ::v-deep .el-input {
    width: 240px;
  }
  .inputItem {
     .tabDate {
      color: #0045ff;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      margin: 12px;
    }
    .text {
      width: 100px;
    }
    span {
      display: inline-block;
      width: 40px;
    }
  }
  .row-item {
    width: 100%;
    margin-right: 0;
  }
}
</style>
