<template>
  <div id="baseInfo">
    <el-row>
      <el-col :span="8">
        <div class="formItem">
          <div class="label">展会名称：</div>
          <div class="value">{{ form.projectName }}</div>
        </div>
        <div class="formItem">
          <div class="label">主办方：</div>
          <div class="value">{{ form.hostCompany }}</div>
        </div>
        <div v-show="isShowItem('website')" class="formItem">
          <div class="label">官方网站：</div>
          <div class="value">
            <a :href="form.website" target="_blank" style="color:#0045FF;">{{
              form.website
            }}</a>
          </div>
        </div>
        <div class="formItem">
          <div class="label">展出内容：</div>
          <div class="value">{{ form.content }}</div>
        </div>
        <div v-show="isShowItem('mealTime')" class="formItem">
          <div class="label">用餐时间：</div>
          <div class="value">{{ form.mealTime }}</div>
        </div>
        <div class="formItem">
          <div class="label">档期状态：</div>
          <div class="value">{{ STATE_OBJECT_TEXT[form.state] }}</div>
        </div>
      </el-col>
      <!-- -------------- -->
      <el-col :span="8">
        <div class="formItem">
          <div class="label">展会简称：</div>
          <div class="value">{{ form.projectAs }}</div>
        </div>
        <div class="formItem">
          <div class="label">类型：</div>
          <div class="value">{{ typeText(form.type) }}</div>
        </div>
        <div class="formItem">
          <div class="label">提交人：</div>
          <div class="value">{{ form.createBy ? form.createBy.name : '' }}</div>
        </div>
        <div v-show="isShowItem('numberPeople')" class="formItem">
          <div class="label">参会人数：</div>
          <div class="value">{{ form.numberPeople }}</div>
        </div>
        <div v-show="isShowItem('tableSize')" class="formItem">
          <div class="label">餐桌围数：</div>
          <div class="value">{{ form.tableSize }}</div>
        </div>
        <div class="formItem">
          <div class="label">备注：</div>
          <div class="value">{{ form.remarks }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { STATE_OBJECT_TEXT } from '@/common/salesManagement/schedule'

const IS_SHOW_INFO_FORM_TYPE = {
  EXHIBITION: ['website'],
  MEETING: ['numberPeople'],
  CONFERENCR: ['numberPeople'],
  FEAST: ['numberPeople', 'mealTime', 'tableSize'],
  BANQUET: ['numberPeople', 'mealTime', 'tableSize']
}

export default {
  components: {},
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      STATE_OBJECT_TEXT
    }
  },
  computed: {
    ...mapState({
      allTypes: state => state.site.allTypes
    }),
    typeText() {
      return (v) => {
        const target = this.allTypes.filter(item => {
          return item.value === v
        })
        return target[0]?.label || ''
      }
    }
  },
  mounted() {
    console.log('baseInfo', this.form)
  },
  methods: {
    isShowItem(field) {
      return IS_SHOW_INFO_FORM_TYPE[this.form.type]?.includes(field)
    }
  }
}
</script>
<style lang="scss" scoped>
#baseInfo {
  padding: 20px 0;
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
      word-break: break-word;
      color: #000;
      img {
        margin-right: 6px;
      }
    }
  }
}
</style>
