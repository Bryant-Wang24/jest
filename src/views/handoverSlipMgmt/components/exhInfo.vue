<template>
  <div class="info">
    <rowText v-if="isView" :text="'场地&时间安排'" />
    <el-row class="row">
      <el-col>
        <div class="formItem">
          <div class="label">场地与面积：</div>
          <div class="value">
            <template v-if="totalArea || siteAndArea.length > 0">
              <div>总面积：{{ totalArea }}平方米</div>
              <div class="siteWrapper">
                <div v-for="(item, index) in siteAndArea" :key="index" class="siteBlock">
                  <span class="siteRow">{{ item.siteName || '无名' }}<i class="el-icon-caret-bottom" /></span>
                  <span class="siteRow">{{ item.siteArea }}</span>
                  <span style="line-height:29px">平方米</span>
                  <span v-if="item.pitchNumber" class="siteRow">{{ item.pitchNumber }}</span>
                  <span v-if="item.pitchNumber" style="line-height:29px">节数</span>
                  <span v-if="item.sessions" class="siteRow">{{ item.sessions }}</span>
                  <span v-if="item.sessions" style="line-height:29px">场次</span>
                </div>
              </div>
            </template>
            <template v-else>-</template>
          </div>
        </div>
        <div class="formItem">
          <div class="label">场地时间安排：</div>
          <div class="value">
            <template v-if="exhInfo.saleMessageQuery && exhInfo.saleMessageQuery.siteTimeArrange">
              <div>时间范围：{{ time }}</div>
              <div v-if="exhInfo.saleMessageQuery.siteTimeArrange" class="timeWrapper">

                <el-form v-for="(value, key) in exhInfo.saleMessageQuery.siteTimeArrange.flagObj" :key="key" label-width="100px" :inline="false">
                  <el-form-item label="场地：">
                    <el-select v-model="value.siteNames" multiple disabled style="width:400px">
                      <WrapOption v-for="(siteName,siteNameIndex) in value.siteNames" :key="siteNameIndex" :label="siteName" :value="siteName" />
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="isMeetingType ? '布置时间:' :'布展期:'">
                    <div v-for="(exh, exhIndex) in value.exh" :key="exhIndex">
                      <el-date-picker
                        style="width:240px;margin-right:20px;"
                        :value="[exh.startTime, exh.endTime]"
                        format="yyyy-MM-dd"
                        type="daterange"
                        range-separator=" ~ "
                        disabled
                      />
                      <el-time-picker
                        style="width:240px"
                        :value="[exh.startHm, exh.endHm]"
                        is-range
                        format="HH:mm"
                        value-format="HH:mm"
                        type="date"
                        range-separator=" ~ "
                        disabled
                      />
                    </div>
                  </el-form-item>
                  <el-form-item :label="isMeetingType ? '活动时间:' :'开展期:'">
                    <div v-for="(launch, launchIndex) in value.launch" :key="launchIndex">
                      <el-date-picker
                        style="width:240px;margin-right:20px;"
                        :value="[launch.startTime, launch.endTime]"
                        format="yyyy-MM-dd"
                        type="daterange"
                        range-separator=" ~ "
                        disabled
                      />
                      <el-time-picker
                        style="width:240px"
                        :value="[launch.startHm, launch.endHm]"
                        is-range
                        format="HH:mm"
                        value-format="HH:mm"
                        type="date"
                        range-separator=" ~ "
                        disabled
                      />
                    </div>
                  </el-form-item>
                  <el-form-item :label="isMeetingType ? '撤场时间:' :'撤展期:'">
                    <div v-for="(move, moveIndex) in value.move" :key="moveIndex">
                      <el-date-picker
                        style="width:240px;margin-right:20px;"
                        :value="[move.startTime, move.endTime]"
                        format="yyyy-MM-dd"
                        type="daterange"
                        range-separator=" ~ "
                        disabled
                      />
                      <el-time-picker
                        style="width:240px"
                        :value="[move.startHm, move.endHm]"
                        is-range
                        format="HH:mm"
                        value-format="HH:mm"
                        type="date"
                        range-separator=" ~ "
                        disabled
                      />
                    </div>
                  </el-form-item>
                </el-form>

              </div>
            </template>
            <template v-else>-</template>
          </div>
        </div>
        <div v-if="isView" class="formItem">
          <div class="label">送风时间：</div>
          <div class="value">{{ supplyIime }}</div>
        </div>
        <div v-if="isView" class="formItem">
          <div class="label">空调时间：</div>
          <div class="value">{{ airTime }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <!-- <div class="formItem">
          <div class="label">项目名称：</div>
          <div class="value">{{ basicInfo.customerName }}</div>
        </div>
        <div class="formItem">
          <div class="label">主办联系人：</div>
          <div class="value">{{ basicInfo.hostContact }}</div>
        </div>
        <div class="formItem">
          <div class="label">项目负责人：</div>
          <div class="value">{{ basicInfo.projectLeader }}</div>
        </div>
        <div class="formItem">
          <div class="label">提交时间：</div>
          <div class="value">{{ basicInfo.submitTime }}</div>
        </div>
        <div class="formItem">
          <div class="label">备注：</div>
          <div class="value">{{ basicInfo.remarks }}</div>
        </div> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import WrapOption from '@/components/base/WrapOption'
import rowText from '@/components/rowText'
import { mapState } from 'vuex'
export default {
  components: { rowText, WrapOption },
  props: {
    exhInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isView: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false // 控制预览框显隐
    }
  },
  computed: {
    ...mapState({
      allTypes: state => state.site.allTypes
    }),
    supplyIime() {
      const { supplyStartTime, supplyEndTime } = this.exhInfo.handoverSlip
      if (!supplyStartTime || !supplyEndTime) {
        return ''
      }
      return `${supplyStartTime} ~ ${supplyEndTime}`
    },
    airTime() {
      const { airStartTime, airEndTime } = this.exhInfo.handoverSlip
      if (!airStartTime || !airEndTime) {
        return ''
      }
      return `${airStartTime} ~ ${airEndTime}`
    },
    totalArea() {
      const totalArea = this.exhInfo.saleMessageQuery?.siteSale?.area
      return totalArea || 0
    },
    siteAndArea() {
      return this.exhInfo.saleMessageQuery?.siteAndArea || []
    },
    time() {
      const { siteTimeArrange = {}} = this.exhInfo.saleMessageQuery
      const { startDate = '', endDate = '' } = siteTimeArrange
      return (startDate || '') + ' ~ ' + (endDate || '')
    },
    isMeetingType() {
      return this.allTypes.some(t => {
        if (this.exhInfo.saleMessageQuery?.siteSale?.type === t.value) {
          return t.type === 'MEETING'
        }
      })
    }
  },
  mounted() {
    // console.log('exhInfo', this.exhInfo)
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.el-input {
  width: 130px;
}
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
    width: 120px;
    margin-right: 10px;
    text-align: right;
    color: #666;
  }
  .value {
    flex: 1;
    word-break: break-word;
    color: #000;
    img {
      margin-right: 6px;
    }
    .siteWrapper{
      padding: 20px;
      margin-top: 20px;
      background-color: #fafafa;
      .siteBlock{
        display: flex;
        margin-bottom: 10px;
        .siteRow {
          display: flex;
          justify-content: space-between;
          margin-right: 10px;
          padding: 6px;
          width: 160px;
          border-bottom:1px solid #CCCCCC;
        }
        &:last-child{
          margin: 0;
        }
      }
    }
    .timeWrapper {
      padding: 20px;
      margin-top: 20px;
      background-color: #fafafa;
    }
  }
}
</style>
