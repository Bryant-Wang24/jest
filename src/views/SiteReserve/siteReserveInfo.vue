<template>
  <div id="isteReserveInfo">
    <div class="container">
      <MainTitle :title="infoTitle" />
      <div v-if="siteOrder.state==='RESCINDED'" class="state">
        <div class="li">档期已撤销</div>
        <div class="li">撤销原因：{{ siteOrder.cancelReason }}</div>
        <div class="li">操作人：{{ 'updateBy' in siteOrder ? siteOrder.updateBy.name || '-':'-' }}</div>
      </div>

      <RowText :text="'基础信息'" />
      <!-- 基础信息 -->
      <BasiceInfo :site-order="siteOrder" />

      <RowText :text="'场地&时间安排'" />
      <!-- 场地&时间安排表格 -->
      <ScheduleForm
        ref="siteTimeArrangeForms"
        :site-time-arrange-read-only="true"
        :site-area-read-only="true"
        :is-conflict="isConflict"
        :is-lock-conflict="isLockConflict"
        :is-meeting-type="isMeetingType"
        :site-options="siteOptions"
        :conflict-list="conflictList"
        @initConflictArgs="initConflictArgs"
      />
      <RowText :text="'联系人信息'" />
      <!-- 联系人信息 -->
      <UserInfo :link-message="linkMessage" />
      <!--  审批流程 -->
      <ApprovalLine :approve-id="approveId" />
      <!-- 页面底部按钮 -->
      <div class="bottom">
        <el-button @click="hangleBack">返回</el-button>
        <ApprovalBtn v-if="source==='review'" :disabled-pass="isLockConflict" :approve-id="approveId" :visible.sync="approveVisible" @refresh="hangleBack" />
      </div>
    </div>
  </div>
</template>

<script>
import MainTitle from '@/components/base/MainTitle'
import ApprovalLine from '@/components/ApprovalLine'
import ApprovalBtn from '@/components/ApprovalOperate'
import RowText from '@/components/rowText'
import BasiceInfo from './components/BasiceInfo'
import ScheduleForm from './components/ScheduleForm'
import UserInfo from './components/UserInfo'
import moment from 'moment'
import { SITE_TYPE_ENUM } from '@/common/site'
import { deleteTagsView } from '@/utils/common'
import { TIMETYPE } from '@/common/handoverSlipMgmt'
import { mapState } from 'vuex'
moment.locale('zh-cn')

// const TIME_TYPE = {
//   1: 'exh',
//   2: 'launch',
//   3: 'move'
// }

export default {
  components: { RowText, ApprovalBtn, ApprovalLine, MainTitle, BasiceInfo, ScheduleForm, UserInfo },
  data() {
    return {
      approveId: null, // 审批流
      approveVisible: true, // 审批流按钮组件必传参数
      disabledPass: false,
      oldId: '', //
      state: '', // 预定状态
      totalArea: '', // 总面积
      // startTime: '', // 起始时间
      // endTime: '', // 终止时间
      infoTitle: '',
      conflictList: [], // 档期冲突数组
      isConflict: false, // 档期冲突状态
      source: '', // 页面状态
      id: null, // 场地id
      siteOrder: {}, // 基础信息
      linkMessage: [
        {
          contact: '', // 联系人
          phone: '', // 联系电话
          email: '', // 邮箱
          address: '', // 联系地址
          job: '', // 职务
          fax: '' // 传真
        }
      ],
      siteOptions: [] // 场地列表
    }
  },
  computed: {
    ...mapState({
      allTypes: state => state.site.allTypes
    }),
    showBtn() {
      return this.source === 'review'
    },
    isMeetingType() {
      return this.allTypes.some(t => {
        if (this.siteOrder.type === t.value) {
          return t.type === 'MEETING'
        }
      })
    },
    isLockConflict() {
      return this.conflictList.some(item => {
        return item.state === 1
      })
    }
  },
  async created() {
    // 获取场地
    await this.getSiteLists()
    this.routerStyle()
  },
  methods: {
    routerStyle() {
      const { id, source } = this.$route.query
      this.id = id
      this.source = source
      if (this.source === 'view') {
        this.infoTitle = '查看详情'
      } else {
        this.infoTitle = '审核场地预订'
      }
      // 根据id获取场地预定信息
      this.getSiteResID(id)
      // this.ifView()
    },
    // ifView() {
    //   if (this.source === 'view') {
    //     this.disabledPass = true
    //   }
    // },
    // 获取场地
    async getSiteLists() {
      const res = await this.$api.siteList.getSite({})
      this.siteOptions = res.list.filter(t => [SITE_TYPE_ENUM.PAVILION, SITE_TYPE_ENUM.AUDITORIUM].includes(t.siteType))
    },
    hangleBack() {
      deleteTagsView(this.$route)
      this.$router.push({ name: 'SiteReserve' })
    },
    setSiteTimeArrangeFormsData(key, data) {
      this.$refs.siteTimeArrangeForms.setData(key, data)
    },
    getSiteTimeArrangeFormsData(key) {
      return this.$refs.siteTimeArrangeForms.getData(key)
    },
    // 通过id获取场地
    getSiteResID(id) {
      this.$api.siteReserveList.getSiteReserveID(id).then(res => {
        const { siteOrder, siteSchedules, linkMessage, timeInformation } = res
        const { oldId, approvalFlowId, totalArea } = siteOrder || {}

        this.approveId = approvalFlowId
        this.siteOrder = siteOrder
        this.totalArea = totalArea
        this.oldId = oldId || ''
        linkMessage && (this.linkMessage = linkMessage)

        const obj = {}
        for (let i = 0; i < timeInformation.length; i++) {
          const timeInfo = timeInformation[i]
          const { isFlag } = timeInfo
          if (!Object.prototype.hasOwnProperty.call(obj, isFlag)) {
            obj[isFlag] = [timeInfo]
          } else {
            obj[isFlag].push(timeInfo)
          }
        }

        const siteTimeArrangeForms = []
        for (const i in obj) {
          const siteTimes = obj[i]
          const newsiteTimes = this.outRepeatSite(siteTimes)
          const objArr = {
            exh: [],
            launch: [],
            move: [],
            siteIds: []
          }
          const ids = siteTimes.map(item => {
            return item.siteId
          })
          const idsSet = Array.from(new Set(ids))

          for (let j = 0; j < newsiteTimes.length; j++) {
            const siteTime = newsiteTimes[j]
            const { type, startTime, endTime, startHm, endHm } = siteTime

            objArr[TIMETYPE[type]]?.push({
              dateList: [startTime, endTime],
              startTime: startHm.substring(0, 5),
              endTime: endHm.substring(0, 5),
              type
            })
          }
          // const item = Array.from(new Set(id))
          objArr.siteIds = idsSet
          siteTimeArrangeForms.push(objArr)
        }
        this.setSiteTimeArrangeFormsData('siteTimeArrangeForms', [...siteTimeArrangeForms])

        // 格式化siteArea
        // const siteArea = [...this.siteArea]
        const siteArea = siteSchedules.map((item) => {
          let obj = {}
          const { siteId } = item
          for (let i = 0; i < this.siteOptions.length; i++) {
            const site = this.siteOptions[i]
            const { id, siteName } = site
            if (id === siteId) {
              obj = { ...item, info: { id: siteId }, siteName }
            }
          }
          return obj
        })
        this.setSiteTimeArrangeFormsData('siteArea', [...siteArea])

        // 手动调用获取冲突数据
        this.initConflictArgs()
      })
    },
    // 去重flag相同，且时间相同的数据
    outRepeatSite(siteTimes) {
      const obj = {}
      const arr = []
      for (let i = 0; i < siteTimes.length; i++) {
        const siteTime = siteTimes[i]
        const { type, startTime, endTime, startHm, endHm } = siteTime
        const stringKey = type + startTime + endTime + startHm + endHm
        if (!Object.prototype.hasOwnProperty.call(obj, stringKey)) {
          obj[stringKey] = [siteTime]
          arr.push(siteTime)
        } else {
          continue
        }
      }
      return arr
    },
    // 格式化冲突接口需要的参数
    initConflictArgs() {
      const siteTimeArrangeForms = this.getSiteTimeArrangeFormsData('siteTimeArrangeForms')
      const rows = []
      for (let i = 0; i < siteTimeArrangeForms.length; i++) {
        const exhibition = siteTimeArrangeForms[i]
        const { siteIds, exh, launch, move } = exhibition
        const arr = [...exh, ...launch, ...move]
        const fliterArr = arr.filter(item => {
          return item.dateList?.length > 0
        })
        for (let j = 0; j < siteIds.length; j++) {
          const id = siteIds[j]
          for (let k = 0; k < fliterArr.length; k++) {
            const time = fliterArr[k]
            const { dateList, startTime, endTime } = time
            const row = {
              siteId: id,
              id: this.id,
              startTime: dateList[0],
              endTime: dateList[1],
              startHm: startTime,
              endHm: endTime
            }
            if (this.oldId !== '') {
              row['oldId'] = this.oldId
            } else {
              delete row.id
              row['oldId'] = this.id
            }

            rows.push(row)
          }
        }
      }
      this.getConflict({ conflictList: rows })
    },
    getConflict(params) {
      this.$api.siteReserveList.lookConflict(params).then(res => {
        this.isConflict = (res.length > 0)
        this.conflictList = this.initConflictList(res) || []
      })
    },
    // 初始化ConflictList
    initConflictList(array) {
      const results = []
      const sorts = array.sort((a, b) => {
        return Date.parse(new Date(a.endTime)) - Date.parse(new Date(b.endTime))
      })
      const map = new Map()
      for (let i = 0; i < sorts.length; i++) {
        const ele = sorts[i]
        const { endTime, startTime, projectName, siteName, state, siteId } = ele
        if (!map.has(ele.id) && map.set(ele.id, 1)) {
          results.push({ endTime: moment(endTime).format('YYYY-MM-DD HH:mm'), startTime: moment(startTime).format('YYYY-MM-DD HH:mm'), projectName, siteName, state, siteId })
        }
      }
      return results
    }
  }
}
</script>

<style lang="scss" scoped>

  #isteReserveInfo {
    padding: 20px;
    margin-bottom: 64px;
    .container {
      position: relative;
      height: 100%;
      padding: 20px;
      background-color: #ffffff;
      .state{
        width: 100%;
        display: inline-table;
        background: #FDDCDC;
        border-left: 2px solid #FF0000;
        padding: 10px 15px;
        box-sizing: border-box;
        .li{
          width: 100%;
          line-height: 28px;
        }
      }
      // .title {
      //   font-size: 18px;
      // font-weight: bold;
      // margin-bottom: 24px;
      // }
    }
  }
  .valueBlue {
    color: blue;
  }
.lookBtn {
  padding: 20px;
  }
.siteArea {
  padding: 20px;
  padding-top: 0;
  font-size: 14px;
  color: #666;
}
.siteArea-content {
    margin-left: 120px;
    margin-bottom: 5px;
  }
.mySelect {
    width: 150px;
    margin-right: 10px;
  }
.myInput {
    width: 150px;
    margin-left: 10px;
  }
.mySpan {
    margin-left: 10px;
    margin-right: 20px;
  }
.siteArea-title {
  margin-bottom: 20px;
}
.totalArea {
  margin-left: 50px;
  margin-right: 8px;
}
.blockTotalArea {
  color: #000;
}
.myForm {
  ::v-deep .el-form-item__label {
    font-size: 12px;
  }
}
.siteTimeSpan {
  font-size: 12px;
  color: #666;
  margin-left: 15px;
  margin-right: 5px;
}
.approve {
      width: 100%;
      margin: 0 auto;
      padding: 20px;
      background: #fafafa;
      margin-top: 20px;
      .approveTitle {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }
    }
.description {
  padding: 10px 0;
}
.bottom {
    // width: 100%;
    // height: 72px;
    // line-height: 72px;
    // text-align: center;
    // background-color: #fff;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    height: 64px;
    padding: 0 56px;
    padding-left: 200px;
    box-sizing: border-box;
    line-height: 64px;
    background: white;
    text-align: center;
    font-size: 14px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
    z-index: 2;
  }
  .leftRequiredIcon::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
.errorText {
  position: absolute;
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
}
.mySelect {
    width: 150px;
    margin-right: 10px;
  }
  .myInput {
    width: 150px;
    margin-left: 10px;
  }
  .sites-input {
    margin-left: 50px;
    margin-right: 50px;
    margin-top: 30px;
    display: flex;
    align-items: center;
  }
  .mySpan {
    margin-right: 20px;
  }
  .siteArea-content {
    margin-left: 120px;
    margin-bottom: 5px;
  }
  .siteTimeArrange{
    padding: 20px;
    padding-top: 0;
    color: #666;
    font-size: 14px;
  }
.myForm {
  ::v-deep .el-form-item__label {
    font-size: 12px;
  }
}
.myEl {
  width: 300px;
}
.siteTimeSpan {
  font-size: 12px;
  color: #666;
  margin-left: 15px;
  margin-right: 5px;
}
.myPicker {
  width: 260px;
}
.siteTimeArrange-addForm {
  margin-left: 105px;
}
.siteSpanS {
  margin-left: 15px;
}
.FormDelete {
  margin-bottom: 0;
}
.FormDelete-btn {
  margin-left: 620px;
}
.conflict {
  padding-left: 20px;
}
.spanRed {
  color: red;
  margin-left: 20px;
}
.conflict-box {
// padding: 20px 80px ;
float: left;
margin-right: 10px;
margin-bottom: 10px;
}
.conflict-boxChild {
  width: 320px;
  // height: 75px;
  background: #D5FDD8;
  opacity: 1;
  display: block;

  border-left: 2px solid #52C15E;
  padding-top: 10px;
  padding-left: 10px;
  padding: 10px;

}
.boxChild-child{
  background: #52C15E;
  opacity: 1;
  border-radius: 2px;
  margin-right: 5px;
  padding: 1px;
}
.cnmSpan {
  color: #000;
margin-left: 20px;
margin-right: 10px;
}
.boxChild-name {
  padding-top: 3px;
}
.boxChild-clock {
  text-align: left;
}
.boxChild-clock {
  margin-top: 10px;
}
.clock-text {
  margin-left: 6px;
}
.conflict-father {
  overflow: hidden;
  margin-left: 72px;
  margin-top: 10px;
}
.siteTimeArrange-title {
  margin-bottom: 20px;
}
.conflict-boxChildT{
  border-left: 2px solid #FF7600;
  background: #FFFDEF;
}
.boxChild-childT{
  background: #FF7600;
}
</style>
