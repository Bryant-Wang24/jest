<template>
  <div class="siteTimeArrange">
    <div class="lookBtn mb-20">
      <el-button @click="toSchedule">查看排期</el-button>
    </div>
    <!--  场地与面积 -->
    <div class="siteArea mb-20">
      <div class="mb-20">场地与面积:</div>
      <div class="siteArea-form">
        <span>总面积：{{ totalArea }} 平方米</span>
        <div v-for="(items,index) in siteArea" :key="index" class="siteArea-content">
          <el-select v-model="siteArea[index].info" value-key="id" filterable placeholder="选择场地" :disabled="siteAreaReadOnly" class="mySelect" @change="siteOptionsChange($event, index)">
            <WrapOption
              v-for="site in siteOptions"
              :key="site.id"
              :disabled="!site.enable || FilterSiteAreaIds.includes(site.id)"
              :label="site.siteName"
              :value="site"
            />
          </el-select>
          <!-- <el-input v-model="items.siteArea" placeholder="填写面积" autocomplete="off" class="myInput area-input" onkeyup="value=value.replace(/[^\d]/g,'')" /><span class="pr-10">平方米</span> -->
          <el-input v-model="items.siteArea" placeholder="填写面积" class="myInput" :disabled="siteAreaReadOnly" @keyup.native="items.siteArea = limitNumberInput(items.siteArea)" /><span class="pr-10">平方米</span>
          <template v-if="isMeetingType">
            <el-input v-model="items.pitchNumber" :disabled="siteAreaReadOnly" placeholder="（选填）填写节数" class="myInput" /><span class="pr-10">节</span>
            <el-input v-model="items.sessions" :disabled="siteAreaReadOnly" placeholder="（选填）填写场次" class="myInput session-input" /><span class="pr-10">场</span>
          </template>
          <el-button v-if="index > 0 && !siteAreaReadOnly" type="text" @click="siteAareaDelete(index)">删除</el-button>
          <el-button v-if="index == 0 && !siteAreaReadOnly" type="text" @click="addSiteArea">增加场地</el-button>
        </div>
      </div>
    </div>
    <!-- 场地时间安排 -->
    <div class="siteTimeArrange mb-20">
      <div class="mb-20">场地时间安排:</div>
      <div v-if="saleDate" style="margin-left: 100px;" class="mb-10">时间范围：{{ saleDate }}</div>
      <div class="siteTimeArrange-form mb-20">
        <!-- 场地销售 场地时间安排特有数据 -->
        <el-form
          v-for="(item,index) in siteTimeArrangeForms"
          :key="index"
          ref="siteTimeArrangeForms"
          :model="item"
          label-width="100px"
          class="myForm"
          :rules="siteTimeRules"
        >
          <!-- <el-form-item v-if="index > 0" class="FormDelete"> -->
          <el-button v-if="index && !siteTimeArrangeReadOnly" type="text" class="FormDelete-btn" @click="deleteSiteTimeArrangeForm(index)">删除</el-button>
          <!-- </el-form-item> -->
          <el-form-item label="场地:" prop="siteIds">
            <el-select v-model="siteTimeArrangeForms[index].siteIds" class="siteSelect" :disabled="siteTimeArrangeReadOnly" multiple placeholder="请先选择场地" @change="siteTimeArrangeFormsSiteIdChange(index,siteTimeArrangeForms[index].siteIds)">
              <WrapOption
                v-for="(name,siteIndex) in filterSiteArea"
                :key="siteIndex"
                :label="name.siteName"
                :value="name.siteId"
                :disabled="isDisabled(siteTimeArrangeForms[index].siteIds, name.siteId)"
              />
            </el-select>
          </el-form-item>
          <!-- 布展期------------------------------------------------------------------------------------------- -->
          <el-form-item :label="isMeetingType ? '布置时间:' :'布展期:'" prop="exh">
            <div v-for="(exhItem,exhIndex) in item.exh" :key="exhIndex" :class="{'mb-20':(exhIndex !== item.exh.length - 1 )}">
              <el-date-picker
                v-model="exhItem.dateList"
                :picker-options="item.pickerOptions"
                :disabled="siteTimeArrangeReadOnly"
                :default-value="dateDefaultValue(item.exh)"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                align="right"
                class="myPicker"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="initConflictArgs"
              />
              <span class="siteTimeSpan">每天</span>
              <el-time-picker
                v-model="exhItem.startTime"
                :disabled="siteTimeArrangeReadOnly"
                format="HH:mm"
                value-format="HH:mm"
                class="timepicker"
                placeholder="开始"
                @change="initConflictArgs"
              />
              <el-time-picker
                v-model="exhItem.endTime"
                :disabled="siteTimeArrangeReadOnly"
                format="HH:mm"
                value-format="HH:mm"
                class="timepicker"
                placeholder="结束"
                @change="initConflictArgs"
              />
              <el-button v-if="exhIndex === 0 && !siteTimeArrangeReadOnly" type="text" @click="resetSiteTimeArrangeFromItem(item.exh)">重置</el-button>
              <el-button v-if="exhIndex === 0 && !siteTimeArrangeReadOnly" type="text" @click="addSiteTimeArrangeFromItem('exh', index)">增加时间</el-button>
              <el-button v-if="exhIndex && !siteTimeArrangeReadOnly" type="text" @click="deleteSiteTimeArrangeFromItem('exh', index, exhIndex)">删除</el-button>
            </div>
          </el-form-item>
          <!-- 开展期------------------------------------------------------------------------------------------- -->
          <el-form-item :label="isMeetingType ? '活动时间:' :'开展期:'" prop="launch">
            <div v-for="(launchItem,launchIndex) in item.launch" :key="launchIndex" :class="{'mb-20':(launchIndex !== item.launch.length - 1 )}">
              <el-date-picker
                v-model="launchItem.dateList"
                :picker-options="item.pickerOptions"
                :disabled="siteTimeArrangeReadOnly"
                :default-value="dateDefaultValue(item.exh)"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                align="right"
                class="myPicker"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="initConflictArgs"
              />
              <span class="siteTimeSpan">每天</span>
              <el-time-picker
                v-model="launchItem.startTime"
                :disabled="siteTimeArrangeReadOnly"
                format="HH:mm"
                value-format="HH:mm"
                class="timepicker"
                placeholder="开始"
                @change="initConflictArgs"
              />
              <el-time-picker
                v-model="launchItem.endTime"
                :disabled="siteTimeArrangeReadOnly"
                format="HH:mm"
                value-format="HH:mm"
                class="timepicker"
                placeholder="结束"
                @change="initConflictArgs"
              />
              <el-button v-if="launchIndex === 0 && !siteTimeArrangeReadOnly" type="text" @click="resetSiteTimeArrangeFromItem(item.launch)">重置</el-button>
              <el-button v-if="launchIndex === 0 && !siteTimeArrangeReadOnly" type="text" @click="addSiteTimeArrangeFromItem('launch', index)">增加时间</el-button>
              <el-button v-if="launchIndex && !siteTimeArrangeReadOnly" type="text" @click="deleteSiteTimeArrangeFromItem('launch', index, launchIndex)">删除</el-button>
            </div>
          </el-form-item>
          <!-- 撤展期------------------------------------------------------------------------------------------- -->
          <el-form-item :label="isMeetingType ? '撤场时间:' :'撤展期:'" prop="move">
            <div v-for="(moveItem,moveIndex) in item.move" :key="moveIndex" :class="{'mb-20':(moveIndex !== item.move.length - 1 )}">
              <el-date-picker
                v-model="moveItem.dateList"
                :picker-options="item.pickerOptions"
                :disabled="siteTimeArrangeReadOnly"
                :default-value="dateDefaultValue(item.exh)"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                align="right"
                class="myPicker"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="initConflictArgs"
              />
              <span class="siteTimeSpan">每天</span>
              <el-time-picker
                v-model="moveItem.startTime"
                :disabled="siteTimeArrangeReadOnly"
                format="HH:mm"
                value-format="HH:mm"
                class="timepicker"
                placeholder="开始"
                @change="initConflictArgs"
              />
              <el-time-picker
                v-model="moveItem.endTime"
                :disabled="siteTimeArrangeReadOnly"
                format="HH:mm"
                value-format="HH:mm"
                class="timepicker"
                placeholder="结束"
                @change="initConflictArgs"
              />
              <el-button v-if="moveIndex === 0 && !siteTimeArrangeReadOnly" type="text" @click="resetSiteTimeArrangeFromItem(item.move)">重置</el-button>
              <el-button v-if="moveIndex === 0 && !siteTimeArrangeReadOnly" type="text" @click="addSiteTimeArrangeFromItem('move', index)">增加时间</el-button>
              <el-button v-if="moveIndex && !siteTimeArrangeReadOnly" type="text" @click="deleteSiteTimeArrangeFromItem('move',index,moveIndex)">删除</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <SiteTimeArrangeAddBtn v-if="!siteTimeArrangeReadOnly" style="margin-left:100px;" @confirm="addSiteList" />
      <!-- <div v-if="!siteTimeArrangeReadOnly" class="siteTimeArrange-addForm">
        <span class="icon"><i class="el-icon-plus" /></span>
        <span class="addSiteBtn" @click="addSiteList">添加场地</span>
        <span class="siteSpanS">多个场地时间安排不一致时可另外添加场地</span>
      </div> -->
    </div>
    <!-- 档期冲突 -->
    <div v-if="isConflict" class="conflict">
      <div class="conflict-title">
        <span>档期冲突:</span>
      </div>
      <span v-if="isLockConflict" class="spanRed">与"锁定状态"档期存在冲突,将无法提交审核</span>
      <div class="conflict-father">
        <div v-for="(config,index) in conflictList" :key="index" class="conflict-box">
          <!-- 颜色修改 -->
          <span class="conflict-boxChild" :class="{'conflict-boxChildT' : config.state}">
            <span class="boxChild-child" :class="{'boxChild-childT' : config.state}" style="color:#fff">{{ config.state ? '锁定' : '预定' }}</span>
            <span style="color:#000" class="boxChild-name">{{ config.projectName }}</span>
            <div class="boxChild-clock" style="color:#000">
              <i class="el-icon-location-information" />
              <span class="clock-text">{{ config.siteName }}</span>
            </div>
            <div class="boxChild-clock" style="color:#000">
              <i class="el-icon-time" />
              <span class="clock-text">{{ config.startTime }}~{{ config.endTime }}</span>
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SiteTimeArrangeAddBtn from './base/SiteTimeArrangeAddBtn'
import { limitNumberInput } from '@/utils/common'
import { SiteTimeArrangeFromItemObject, SiteAreaItem } from '@/common/site'
import { TIMETYPE_OBJECT, TIMETYPE_REVERSE } from '@/common/handoverSlipMgmt'
import WrapOption from '@/components/base/WrapOption'
// const TIME_TYPE = {
//   exh: 1,
//   launch: 2,
//   move: 3
// }
function SiteTimeArrangeObject() {
  this.siteIds = [] // 场地
  // 布展期
  this.exh = [new SiteTimeArrangeFromItemObject(TIMETYPE_OBJECT.DEPLOY)]
  // 开展期
  this.launch = [new SiteTimeArrangeFromItemObject(TIMETYPE_OBJECT.OPEN)]
  // 撤展期
  this.move = [new SiteTimeArrangeFromItemObject(TIMETYPE_OBJECT.CLOSE)]
}
export default {
  components: { SiteTimeArrangeAddBtn, WrapOption },
  props: {
    siteTimeArrangeReadOnly: {
      type: Boolean,
      default: false
    },
    siteAreaReadOnly: {
      type: Boolean,
      default: false
    },
    isConflict: {
      type: Boolean,
      default: false
    },
    isLockConflict: {
      type: Boolean,
      default: false
    },
    // oldId: {
    //   type: [Number, String],
    //   default: null
    // },
    conflictList: {
      type: Array,
      default: () => []
    },
    isMeetingType: {
      type: Boolean,
      default: false
    },
    siteOptions: {
      type: Array,
      default: () => []
    },
    saleDate: {
      type: String,
      default: null
    }
  },
  data() {
    var checkDateListAndTimeList = (rule, value, callback) => {
      const result = value.every((item) => {
        const { dateList, startTime, endTime } = item
        const lenA = dateList?.length

        return lenA && (startTime && endTime)
      })
      if (result) {
        console.log('checkDateListAndTimeList', true)
        callback()
      } else {
        console.log('checkDateListAndTimeList', false)
        callback(new Error('请输入时间'))
      }
    }
    return {
      id: this.$route.query.id || null,
      // 场地与面积
      siteArea: [
        { ...new SiteAreaItem() }
      ],
      // 场地时间安排
      siteTimeArrangeForms: [
        { ...new SiteTimeArrangeObject() }
      ],
      siteTimeRules: {
        siteIds: [{ required: true, message: '请选择场地', trigger: 'change' }],
        exh: [{ validator: checkDateListAndTimeList, message: '请输入时间', required: true, trigger: 'change' }],
        launch: [{ validator: checkDateListAndTimeList, message: '请输入时间', required: true, trigger: 'change' }],
        move: [{ validator: checkDateListAndTimeList, message: '请输入时间', required: true, trigger: 'change' }]
      }
      // dateDefaultValue: ''
    }
  },
  computed: {
    totalArea() {
      let area = 0
      this.siteArea.forEach(item => {
        area += Number(item.siteArea)
      })
      return area
    },
    filterSiteArea() {
      return this.siteArea.filter(item => {
        return item.siteId
      })
    },
    FilterSiteAreaIds() {
      const siteIds = this.siteArea.map(item => item.siteId)
      return siteIds || []
    }
  },
  methods: {
    // setData(attr, key, data) {
    //   if (key) {
    //     this.$set(this[attr], key, data)
    //   } else {
    //     this[attr] = data
    //   }
    // },
    setData(key, data) {
      this[key] = data
    },
    getData(key) {
      return this[key]
    },
    clearValidate() {
      this.$refs.siteTimeArrangeForms.forEach(item => {
        item.clearValidate()
      })
    },
    validate(callback) {
      const formPromises = this.$refs.siteTimeArrangeForms.map(item => {
        return new Promise((resolve, reject) => {
          item.validate((valid) => {
            if (valid) {
              resolve(true)
            } else {
              reject(false)
            }
          })
        })
      })
      Promise.all([...formPromises]).then(callback).catch(callback)
    },
    limitNumberInput(v) {
      return limitNumberInput(v)
    },
    dateDefaultValue(exh) {
      const { dateList } = exh[0]
      return dateList?.length ? dateList[0] : null
    },
    siteTimeArrangeFormsSiteIdChange(index, siteIds) {
      if (siteIds.length > 0) {
        this.initConflictArgs()
      }
      this.$emit('siteTimeArrangeFormsSiteIdChange', { index, siteIds })
    },
    // 场地与面积下拉change
    siteOptionsChange(siteInfo, siteAreaIndex) {
      // 同步更新siteArae
      const { id, siteName } = siteInfo
      this.siteArea[siteAreaIndex].siteId = id
      this.siteArea[siteAreaIndex].siteName = siteName

      this.syncUpdateSiteTimeArrangeForms()
    },
    // 场地与面积删除按钮
    siteAareaDelete(index) {
      this.siteArea.splice(index, 1)
      this.syncUpdateSiteTimeArrangeForms()
    },
    // 同步更新SiteTimeArrangeForms
    syncUpdateSiteTimeArrangeForms() {
      const _siteIds = this.siteArea.map(item => item.siteId)

      const siteTimeArrangeForms = this.siteTimeArrangeForms
      for (let i = 0; i < siteTimeArrangeForms.length; i++) {
        const item = siteTimeArrangeForms[i]
        const { siteIds } = item
        this.siteTimeArrangeForms[i]['siteIds'] = siteIds.filter(id => _siteIds.includes(id))
      }
    },
    // 场地与面积增加按钮
    addSiteArea() {
      this.siteArea.push({ ...new SiteAreaItem() })
    },
    // 删除整个表单
    deleteSiteTimeArrangeForm(index) {
      this.siteTimeArrangeForms.splice(index, 1)
    },
    // 每次改变时间, 触发冲突校验
    initConflictArgs() {
      this.$emit('initConflictArgs')
    },
    resetSiteTimeArrangeFromItem(item) {
      for (let i = 0; i < item.length; i++) {
        item[i].dateList = []
        item[i].startTime = '08:30'
        item[i].endTime = '17:00'
      }
    },
    addSiteTimeArrangeFromItem(key, index) {
      const type = TIMETYPE_REVERSE[key]
      const data = new SiteTimeArrangeFromItemObject(type)
      this.siteTimeArrangeForms[index][key].push(data)
    },
    deleteSiteTimeArrangeFromItem(key, index, itemIndex) {
      this.siteTimeArrangeForms[index][key].splice(itemIndex, 1)
    },
    // 添加整个场地时间安排表单
    addSiteList() {
      const data = new SiteTimeArrangeObject()
      this.siteTimeArrangeForms.push(data)
    },
    isDisabled(siteids, siteid) {
      const isChoose = this.isChoose(siteids, siteid)
      if (isChoose) return true
      if (siteids.length === 0) return false
    },
    // 选项是否被选
    isChoose(siteids, siteId) {
      let arrs = []
      for (let i = 0; i < this.siteTimeArrangeForms.length; i++) {
        const siteIdArrs = this.siteTimeArrangeForms[i].siteIds
        arrs = [...arrs, ...siteIdArrs]
      }
      const arrsFilter = arrs.filter(item => {
        return !siteids.includes(item)
      })

      return arrsFilter.includes(siteId)
    },
    // 查看排期
    toSchedule() {
      this.$router.push({ name: 'ScheduleView' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
.siteArea {
  .siteArea-form {
    display: inline-block;
    margin-left: 100px;
    padding: 20px;
    background-color: #FAFAFA;
    .siteArea-content {
      .mySelect {
          width: 150px;
          margin-right: 10px;
      }
      .myInput {
        width: 150px;
        margin-right: 10px;
      }
    }
    .siteArea-content:not(:first-child) {
      margin-top: 20px;
    }
  }
}
.siteTimeArrange{

  .siteTimeArrange-form {
    position: relative;
    margin-left: 100px;
    // padding: 20px;
    .myForm {
      position: relative;
      display: inline-block;
      padding: 20px 100px 20px 20px;
      background-color: #FAFAFA;
      .FormDelete-btn {
        position: absolute;
        right: 20px;
      }
    }
    .myForm:not(:first-child) {
        margin-top:20px;
      }
    .siteSelect {
      width: 350px;
    }
    .timepicker {
      width: 150px;
      margin-right: 10px;
    }
    .siteTimeSpan {
      margin: 0 10px;
    }
  }

  // .siteTimeArrange-addForm {
  //   margin-left: 100px;
  //   .icon {
  //     display: inline-block;
  //     width: 20px;
  //     height: 20px;
  //     text-align: center;
  //     line-height: 20px;
  //     margin-right: 4px;
  //     // padding: 2px;
  //     background-color: $--custom--color--primary;
  //     color: #fff;
  //     cursor: pointer;
  //   }
  //   .addSiteBtn {
  //     margin-right: 10px;
  //     color: $--custom--color--primary;
  //     cursor: pointer;
  //   }
  // }
}
.conflict {
  .spanRed {
    color: red;
    margin-left: 100px;
  }
  .conflict-father {
    overflow: hidden;
    margin-left: 100px;
    margin-top: 10px;
    .conflict-box {
      // padding: 20px 80px ;
      float: left;
      margin-right: 10px;
      margin-bottom: 10px;
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
        .boxChild-child{
          background: #52C15E;
          opacity: 1;
          border-radius: 2px;
          margin-right: 5px;
          padding: 1px;
          .boxChild-name {
            padding-top: 3px;
          }
        }
        .boxChild-childT{
          background: #FF7600;
        }
        .boxChild-clock {
          text-align: left;
          margin-top: 10px;
          .clock-text {
            margin-left: 6px;
          }
        }
      }
      .conflict-boxChildT{
        border-left: 2px solid #FF7600;
        background: #FFFDEF;
      }
    }
  }
}
</style>
