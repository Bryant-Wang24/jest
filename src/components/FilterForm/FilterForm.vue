<template>
  <div class="page-search">
    <el-form class="page-search-form">
      <el-form-item
        v-for="(item, index) in searchDemo"
        :key="index"
        :label="item.label"
        :style="{width:item.width,marginRight:item.marginRight}"
      >
        <template v-if="item.type == 'input'">
          <el-input
            v-model="item.value"
            :type="item.typeInput"
            :placeholder="item.placeholder"
            :disabled="item.disabled"
          />
        </template>
        <template v-if="item.type == 'select'">
          <el-select v-model="item.value" :placeholder="item.placeholder" filterable>
            <WrapOption
              v-for="itm in item.options"
              :key="itm.id"
              :label="itm[item.s_label]"
              :value="itm[item.s_value]"
            />
          </el-select>
        </template>
        <template v-if="item.type == 'cascader'">
          <el-cascader
            v-model="item.value"
            :placeholder="item.placeholder || '请选择'"
            :options="item.options"
            change-on-select
            :props="{ value: 'id', label: 'name', children: 'second_category' }"
          />
        </template>
        <template v-if="item.type == 'DatePicker'">
          <div class="select-time">
            <el-date-picker
              v-model="item.value"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="至"
              :start-placeholder="item.startDataText"
              :end-placeholder="item.endDataText"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            />
          </div>
        </template>
        <template v-if="item.type == 'date'">
          <div class="select-time">
            <el-date-picker
              v-model="item.value"
              type="date"
              :placeholder="item.placeholder || '选择日期'"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            />
          </div>
        </template>
        <template v-if="item.type == 'month'">
          <div class="select-time">
            <el-date-picker
              v-model="item.value"
              type="month"
              placeholder="选择月"
              value-format="yyyy-MM"
              format="yyyy-MM"
            />
          </div>
        </template>
      </el-form-item>
      <el-form-item :class="{'form_right':formRight}" class="right_margin">
        <el-button type="primary" @click="submitForm">{{
          btnText || '查询'
        }}</el-button>
        <el-button @click="handleReset">{{
          btnText || '重置'
        }}</el-button>
      </el-form-item>

      <slot />
    </el-form>

  </div>
</template>

<script>
import WrapOption from '@/components/base/WrapOption'
export default {
  name: 'PageSearch',
  components: { WrapOption },
  // props: ['searchDemo','btnText','pickerOptions':{}],
  props: {
    searchDemo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    btnText: {
      type: String,
      default: ''
    },
    formRight: {
      type: Boolean,
      default: true
    },
    pickerOptions: {
      type: Function,
      default: () => {
        return () => {}
      }
    }
  },
  data() {
    return {}
  },
  created() {
    // 生命周期钩子：组件实例创建完成，属性已绑定，但 DOM 还未生成，el 属性还不存在
    // 初始化渲染页面
  },
  methods: {
    handleReset() {
      this.$emit('handleReset', '')
    },
    submitForm() {
      const arr = {}
      for (const key in this.searchDemo) {
        if (this.searchDemo[key].type === 'DatePicker' && this.searchDemo[key].value === null) {
          this.searchDemo[key].value = []
        }
        arr[key] = this.searchDemo[key].value
      }
      this.$emit('submitForm', arr)
    }
  }
}
</script>
<style lang="scss" scoped>

.page-search {
  width: 100%;
  padding:0 20px;
  background: white;
  box-sizing: border-box;
  .page-search-form {
    display: inline-table;
    width: 100%;
    padding-top: 20px;
    box-sizing: border-box;
    // display: flex;
    // flex-wrap: wrap;
    ::v-deep .el-form-item {
      float: left;
      margin-bottom: 20px;
      display: flex;

      // align-items: center;
      .el-form-item__label {
        flex-shrink: 0;
        white-space: nowrap;
        font-size: 14px;

      }
      .el-form-item__content {
          flex:1;
          .el-cascader,.el-input,
          .el-select {
            width: 100% !important;
          }
      }
    }
    .form_right{
      float: right;
    }
  }
}
</style>
