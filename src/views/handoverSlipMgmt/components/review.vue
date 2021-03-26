<template>
  <div class="info">
    <rowText :text="'审核意见'" />
    <el-row class="row">
      <div class="formItem">
        <div class="label">审核意见：</div>
        <div class="value">
          <el-input
            v-model.trim="textarea"
            style="width:400px"
            type="textarea"
            :rows="3"
            resize="none"
            placeholder="请输入内容"
          />
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import rowText from '@/components/rowText'
import { STATE } from '@/common/handoverSlipMgmt'

export default {
  components: { rowText },
  props: {
  },
  data() {
    return {
      STATE,
      textarea: ''
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.el-input {
  width: 130px;
}
.row{
  padding: 20px;
}
.info {
  padding: 20px 0;
  font-size: 14px;
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
    }
  }
}

</style>
