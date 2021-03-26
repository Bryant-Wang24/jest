<template>
  <div id="filterForm">
    <div v-if="list.length > 0" class="filterContainer">
      <el-form ref="form" :model="form" :inline="true" class="form">
        <div v-for="block in list" :key="block.id" class="formItemWrapper">
          <span class="label">{{ block.label }}</span>
          <el-form-item
            v-for="(item, index) in block.components"
            :key="index"
            :prop="item.name"
            class="formItem"
          >
            <el-input
              v-if="item.type === 'input'"
              v-model="form[item.name]"
              :placeholder="item.placeholder"
            />

            <el-select
              v-else-if="item.type === 'select'"
              v-model="form[item.name]"
              :placeholder="item.placeholder"
            >
              <WrapOption
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>

            <el-cascader
              v-else-if="item.type === 'cascader'"
              v-model="form[item.name]"
              :collapse-tags="item.collapseTags"
              :placeholder="item.placeholder"
              :options="item.options"
            />
          </el-form-item>
        </div>
      </el-form>
      <div class="btnWrapper">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import WrapOption from '@/components/base/WrapOption'
export default {
  name: 'FilterForm',
  components: { WrapOption },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      form: {}
    }
  },
  created() {
    this.initData(this.list)
  },
  methods: {
    initData(data) {
      // debugger
      for (let i = 0; i < data.length; i++) {
        const item = data[i].components
        for (let j = 0; j < item.length; j++) {
          const comp = item[j]
          if (comp.type === 'cascader') {
            this.$set(this.form, comp.name, [])
          } else {
            this.$set(this.form, comp.name, '')
          }
        }
      }
    },
    onSubmit() {},
    handleSearch() {
      this.$emit('search', this.form)
    },
    handleReset() {
      this.$refs['form'].resetFields()
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss" scoped>
.formItemWrapper {
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
}
#filterForm{
  padding: 0;
}
.filterContainer {
  display: flex;
  justify-content: space-between;
  .form {
    display: flex;
    .formItemWrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      // margin-right: 24px;
      .label {
        margin-right: 12px;
        font-size: 14px;
        font-weight: 700;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
        color: #606266;
      }
      .formItem {
        width: 200px;
        ::v-deep .el-form-item__content {
          width: 100%;
        }
      }
    }
    .btnWrapper {
      min-width: 200px;
    }
  }
}
</style>
