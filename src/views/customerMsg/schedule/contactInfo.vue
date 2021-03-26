<template>
  <div id="contactInfo">
    <div v-if="form.length">
      <el-row v-for="item in form" :key="item.id" class="contactRow">
        <el-col :span="8">
          <div class="formItem">
            <div class="label">联系人：</div>
            <div class="value">{{ item.contact }}</div>
          </div>
          <div class="formItem">
            <div class="label">联系电话：</div>
            <div class="value">{{ item.phone }}</div>
          </div>
          <div class="formItem">
            <div class="label">邮箱：</div>
            <div class="value">{{ item.email }}</div>
          </div>
        </el-col>
        <!-- -------------- -->
        <el-col :span="8">
          <div class="formItem">
            <div class="label">联系地址：</div>
            <div class="value">{{ item.address }}</div>
          </div>
          <div class="formItem">
            <div class="label">职务：</div>
            <div class="value">{{ item.job }}</div>
          </div>
          <div class="formItem">
            <div class="label">传真：</div>
            <div class="value">{{ item.fax }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      暂无数据
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    form: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  created() {},
  mounted() {
    console.log('form', this.form)
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
#contactInfo {
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
.contactRow {
    padding: 20px 0;
}
.contactRow:not(:last-child) {
    border-bottom: 1px solid #eeeeee;
}
</style>
