<template>
  <div>
    <div class="content">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="类型" prop="contract">
          <el-radio-group v-model="form.contract">
            <!-- <el-radio
              v-for="item in contracts[office.code ? office.code : DEPARTMENT_KEY.SALES_DEPARTMENT]"
              :key="item.value"
              :label="item.value"
              @change="handleRadioContractType"
            >{{ item.label }}</el-radio> -->
            <el-radio
              v-for="item in contracts"
              :key="item.value"
              :label="item.value"
              @change="handleRadioContractType"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="简称" prop="projectAs">
          <el-input v-model="form.projectAs" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="场地" prop="siteId">
          <el-select v-model="form.siteId" placeholder="请选择场地" multiple>
            <WrapOption
              v-for="item in sites"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围" prop="date">
          <el-date-picker
            v-model="form.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['08:30:00', '17:00:00']"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" placeholder="(选填)" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" style="text-align: center;">
      <el-button @click="handleDialogCancel">取消</el-button>
      <el-button type="primary" @click="handleDialogOk">确定</el-button>
    </div>
  </div>
</template>

<script>
import { EventBus } from '@/utils/event-bus'
import { mapState } from 'vuex'
import { SITE_TYPE_ENUM } from '@/common/site'
import { DEPARTMENT_KEY } from '@/common/user'
import moment from 'moment'
import { TIMETYPE_ARRAY } from '@/common/handoverSlipMgmt'
import WrapOption from '@/components/base/WrapOption'

export default {
  name: 'AddScheduleForm',
  components: { WrapOption },
  data() {
    return {
      DEPARTMENT_KEY,
      sites: [],
      form: {
        contract: 'EXHIBITION', // 合同类型
        projectName: '',
        projectAs: '',
        siteId: [],
        date: [],
        remarks: ''
      },
      rules: {
        projectName: [{ required: true, message: '必填项' }],
        siteId: [{ required: true, message: '必填项' }],
        date: [{ required: true, message: '必填项' }]
      }
    }
  },
  computed: {
    ...mapState({
      allTypes: state => state.site.allTypes,
      currentUserCodeTypes: state => state.site.currentUserCodeTypes
    }),
    contracts() {
      return this.currentUserCodeTypes.length ? this.currentUserCodeTypes : this.allTypes
    }
  },
  mounted() {
    this._getSiteListFromSiteType({ types: [SITE_TYPE_ENUM.PAVILION, SITE_TYPE_ENUM.AUDITORIUM].join(',') })
  },
  destroyed() {
    EventBus.$off('schedule_refresh')
  },
  methods: {
    handleRadioContractType() {
    },
    handleDialogCancel() {
      this.$emit('close')
    },
    handleDialogOk() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // alert('submit!')
          const { contract: type, projectName, projectAs, siteId, date, remarks } = this.form
          const startTime = moment(date[0]).format('YYYY-MM-DD')
          const endTime = moment(date[1]).format('YYYY-MM-DD')
          const startHm = moment(date[0]).format('HH:mm')
          const endHm = moment(date[0]).format('HH:mm')
          const isFlag = new Date().getTime()
          const siteSchedules = []
          siteId.map(item => {
            siteSchedules.push({
              siteId: item
            })
          })
          const timeInformation = []
          for (let i = 0; i < siteId.length; i++) {
            const id = siteId[i]
            for (let j = 0; j < 3; j++) { // 3个期
              const type = TIMETYPE_ARRAY[j]
              timeInformation.push({
                siteId: id,
                type,
                startTime,
                endTime,
                startHm,
                endHm,
                isFlag
              })
            }
          }
          // 请求新增预定的接口
          const params = {
            siteOrder: {
              type,
              projectName,
              projectAs,
              remarks
            },
            siteSchedules,
            linkMessage: [],
            timeInformation
          }
          this.$api.schedule.addSite(params).then(res => {
            this.$message.success('预订成功')
            // 预定成功刷新列表
            this.$emit('close')
            EventBus.$emit('schedule_refresh')
          }).catch(e => {
            this.$message.error('预订失败，请重试')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    _getSiteListFromSiteType(params) {
      console.log('_getSiteListFromSiteType', params)
      this.$api.schedule.getSiteList(params).then(res => {
        const defaultSiteId = res[0]?.id
        this.sites = res
        this.form.siteId = [defaultSiteId]
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
