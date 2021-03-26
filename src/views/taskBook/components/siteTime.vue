<template>
  <div class="siteTime">
    <div class="formItem">
      <div class="label">展览地点: </div>
      <div class="value">
        <span v-show="isPoly">保利世贸博览馆, </span>
        <span v-for="(item,index) in timeForm.siteSchedule" :key="index">
          {{ item.siteName }}: {{ item.siteArea }}平方米,
        </span>
      </div>
    </div>
    <el-row>
      <el-col :span="8">
        <div class="formItem">
          <div class="label">筹展时间: </div>
          <div class="value">{{ timeForm.preparateStartTime }} ~ {{ timeForm.preparateEndTime }}</div>
        </div>
        <div class="formItem">
          <div class="label">撤展时间: </div>
          <div class="value">{{ timeForm.timeTypeValue.minMoveTime }} ~ {{ timeForm.timeTypeValue.maxMoveTime }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="formItem">
          <div class="label">布展时间: </div>
          <div class="value">{{ timeForm.timeTypeValue.minExhibitionTime }} ~ {{ timeForm.timeTypeValue.maxExhibitionTime }}</div>
        </div>
        <div class="formItem">
          <div class="label">送风时间: </div>
          <div class="value">{{ timeForm.supplyStartTime }} ~ {{ timeForm.supplyEndTime }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="formItem">
          <div class="label">开展时间: </div>
          <div class="value">{{ timeForm.timeTypeValue.minLaunchTime }} ~ {{ timeForm.timeTypeValue.maxLaunchTime }}</div>
        </div>
        <div class="formItem">
          <div class="label">空调时间: </div>
          <div class="value">{{ timeForm.airStartTime }} ~ {{ timeForm.airEndTime }}</div>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import base from '@/api/base'
export default {
  props: {
    timeForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      base
    }
  },
  computed: {
    isPoly() {
      return base.title.includes('保利')
    }
  }
}
</script>

<style lang="scss" scoped>
  .siteTime {
    padding: 20px;
    font-size: 14px;
    .formItem {
      display: flex;
      margin-bottom: 14px;
        .label {
          // width: 160px;
          margin-right: 10px;
          text-align: left;
          color: #666;
        }
        .value {
          flex: 1;
          word-wrap: break-word;
        }
    }
  }
</style>
