<template>
  <div class="info">
    <rowText :text="'统筹负责人'" />
    <el-row class="row">
      <el-col :span="8">
        <div class="formItem">
          <div class="label">统筹负责人：</div>
          <div class="value">{{ planInfo.handoverSlip.coordinator }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="formItem">
          <div class="label">面积复核人：</div>
          <div class="value">{{ planInfo.handoverSlip.areaChecker }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import rowText from '@/components/rowText'

export default {
  components: { rowText },
  props: {
    planInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.info {
//   padding: 20px 0;
  font-size: 14px;
}
.row{
    padding: 20px;
}
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
    word-break: break-word;
    color: #000;
    img {
      margin-right: 6px;
    }
  }
}

</style>
