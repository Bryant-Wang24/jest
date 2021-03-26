<template>
  <el-card class="ExhibitionSum">
    <div slot="header" class="clearfix">
      <span>{{ titleList.exhibitionSumtitle }}(场)</span>
    </div>
    <div class="content">
      <!-- <div class="sum">{{ exhibitionSumData.sum }}</div> -->
      <CountTo class="sum" :start-val="0" :end-val="exhibitionSumData.current" :duration="2600" />
      <div class="other">
        <span>去年{{ exhibitionSumData.previous }}场</span>
        <span v-if="exhibitionSumData.chainRatio>0">环比 <i class="el-icon-caret-top up" />{{ proportion }}</span>
        <span v-if="exhibitionSumData.chainRatio<0">环比 <i class="el-icon-caret-bottom bottom" />{{ proportion }}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
import CountTo from 'vue-count-to'
import { toPercent } from '@/utils/common'
export default {
  components: { CountTo },
  props: {
    exhibitionSumData: {
      type: Object,
      default: () => {}
    },
    titleList: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    // 计算环比
    proportion() {
      const { chainRatio } = this.exhibitionSumData
      if (!chainRatio) return 0 + '%'
      return toPercent(chainRatio)
    }
  }
}
</script>

<style lang="scss" scoped>
.ExhibitionSum {
  width: 100%;
  .content {
    display: flex;
    align-items: center;
    justify-content:center;
    .sum {
      font-size: 60px;
      margin-right: 20px;
      // font-weight: bold;
    }
    .other {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      span {
        padding: 4px 0;
      }
      .up {
        color: red;
      }
      .bottom{
        color: green;
      }
    }
  }
}
</style>
