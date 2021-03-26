<template>
  <el-form ref="form" :model="searchList" :inline="true" class="searchList">

    <el-form-item class="row-item">
      <el-form-item class="inputItem" label="项目名称：" prop="elcExhibitionId">
        <el-select
          v-model="searchList.elcExhibitionId"
          filterable
          clearable
          placeholder="请选择"
        >
          <WrapOption
            v-for="(item, index) in customerOptions"
            :key="index"
            :label="item.projectName"
            :value="item.elcExhibitionId"
          />
        </el-select>
      </el-form-item>

      <el-form-item class="inputItem" label="公司名称：" prop="customerName">
        <el-input v-model="searchList.customerName" placeholder="请输入" />
      </el-form-item>

    </el-form-item>
    <el-form-item class="row-item">
      <el-form-item class="inputItem" label="创建时间：" prop="creationTime">
        <el-date-picker
          v-model="searchList.creationTime"
          clearable
          type="date"
          format="yyyy-MM-dd"
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
import moment from 'moment'
import WrapOption from '@/components/base/WrapOption'
export default {
  components: { WrapOption },
  props: {
    customerOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchList: {
        customerName: '',
        creationTime: '',
        elcExhibitionId: ''
      }
    }
  },
  methods: {
    getSearchList() {
      const { creationTime } = this.searchList
      if (creationTime) {
        const params = { ...this.searchList, creationTime: `${creationTime} 00:00:00` }
        return params
      } else {
        const params = { ...this.searchList, creationTime: creationTime }
        return params
      }
      // const params = { ...this.searchList, creationTime: creationTime }
      // return params
    },
    searchAccount() {
      this.$emit('searchAccount', { ...this.getSearchList() })
    },
    reset() {
      this.$refs.form.resetFields()
      // this.searchList = {
      //   projectName: '',
      //   receiveTime: '',
      //   creationTime: ''
      // }
      this.$emit('reset', { ...this.getSearchList() })
    },
    // 今天
    checkoutToday(receTime) {
      const DAY = moment().endOf('week')
      console.log(DAY)
      this.searchList.creationTime = moment().format('YYYY-MM-DD')
    },
    // 昨天
    checkYestoday(receTime) {
      this.searchList.creationTime = moment().subtract(1, 'days').format('YYYY-MM-DD')
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
    width: 370px;
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
