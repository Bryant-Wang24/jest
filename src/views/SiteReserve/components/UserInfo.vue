<template>
  <div class="user" style="margin:20px 0;">
    <el-row v-for="(item,index) in linkMessage" :key="index">
      <el-col :span="8">
        <div v-for="(left, leftIndex) in leftColList" :key="leftIndex" class="formItem">
          <div class="label">{{ left.label }}</div>
          <div class="value">{{ item[left.value] || '-' }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div v-for="(left, leftIndex) in rightColList" :key="leftIndex" class="formItem">
          <div class="label">{{ left.label }}</div>
          <div class="value">{{ item[left.value] || '-' }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    linkMessage: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    leftColList() {
      const leftColList = [
        { label: '联系人：', value: 'contact' },
        { label: '联系电话：', value: 'phone' },
        { label: '邮箱：', value: 'email' }
      ]
      return leftColList
    },
    rightColList() {
      const leftColList = [
        { label: '联系地址：', value: 'address' },
        { label: '职务：', value: 'job' },
        { label: '传真：', value: 'fax' }
      ]
      return leftColList
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  font-size: 14px;
  .formItem {
    display: flex;
    margin-bottom: 14px;
    .label {
      width: 160px;
      margin-right: 10px;
      text-align: right;
      color: #666;
    }
    .value {
      flex: 1;
      img {
        margin-right: 6px;
      }
    }
    .blue {
      cursor: pointer;
      color: blue;
    }
  }
}
</style>
