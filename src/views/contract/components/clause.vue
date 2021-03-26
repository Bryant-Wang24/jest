<template>
  <div>
    <div class="clause_new">
      <div class="new_title">甲方</div>
      <div v-if="num === '1'" class="new_flex">
        <div class="flex_left"><div class="span">1</div></div>
        <div class="flex_right">
          甲方如在本合同签订后10个工作日至开展前
          <el-input
            v-model="clauseFrom.arr1"
            size="mini"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
            :readonly="routerStyle()"
          />
          天期间单方面减少场馆租赁面积或缩短租赁时间，甲方应按实际减少的场馆面积或租赁天数的场地租赁服务费总额的
          50% 向乙方支付违约金。甲方如在本合同签订后10个工作日至开展前
          <el-input
            v-model="clauseFrom.arr2"
            size="mini"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
            :readonly="routerStyle()"
          />天期间单方面取消场馆租赁，按合同约定的场地租赁服务费总额的 50%
          向乙方支付违约金。如因不可抗力导致本条款发生，则甲方免责
        </div>
      </div>
      <div class="new_flex">
        <div class="flex_left">
          <div class="span">{{ num === "1" ? 2 : 1 }}</div>
        </div>
        <div class="flex_right">
          甲方如在开展前
          <el-input
            v-model="clauseFrom.arr3"
            size="mini"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
            :readonly="routerStyle()"
          />
          天之后单方面减少场馆租赁面积或缩短租赁时间，甲方应按实际减少的场馆面积或租赁天数的场地租赁服务费总额的
          80% 向乙方支付违约金。甲方如在开展前<el-input
            v-model="clauseFrom.arr4"
            size="mini"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
            :readonly="routerStyle()"
          />天之后单方面取消场馆租赁，按合同约定的场地租赁服务费总额的 80%
          向乙方支付违约金。如因不可抗力导致本条款发生，则甲方免责。
        </div>
      </div>
    </div>
    <div class="clause_new">
      <div class="new_title">乙方</div>
      <div v-if="num === '1'" class="new_flex">
        <div class="flex_left"><div class="span">1</div></div>
        <div class="flex_right">
          乙方如在本合同签订后10个工作日至开展前
          <el-input
            v-model="clauseFrom.arr5"
            size="mini"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
            :readonly="routerStyle()"
          />
          天期间单方面减少场馆租赁面积或缩短租赁时间，按实际减少的场馆面积或租赁天数的场地租赁服务费总额的
          50% 向甲方支付违约金。乙方如在本合同签订后10个工作日至开展前
          <el-input
            v-model="clauseFrom.arr6"
            size="mini"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
            :readonly="routerStyle()"
          />天期间单方面取消场馆租赁，按合同约定的场地租赁服务费总额的 50%
          向甲方支付违约金。如因不可抗力导致本条款发生，则乙方免责。
        </div>
      </div>
      <div class="new_flex">
        <div class="flex_left">
          <div class="span">{{ num === "1" ? 2 : 1 }}</div>
        </div>
        <div class="flex_right">
          乙方如在开展前
          <el-input
            v-model="clauseFrom.arr7"
            size="mini"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
            :readonly="routerStyle()"
          />
          天之后单方面减少场馆租赁面积或缩短租赁时间，按实际减少的场馆面积或租赁天数的场地租赁服务费总额的
          80% 向甲方支付违约金。乙方如在开展前<el-input
            v-model="clauseFrom.arr8"
            size="mini"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
            :readonly="routerStyle()"
          />天之后单方面取消场馆租赁，按合同约定的场地租赁服务费总额的 80%
          向甲方支付违约金。如因不可抗力导致本条款发生，则乙方免责。
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    num: {
      type: String,
      default: '1'
    },
    clauseFrom: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      type: ''
    }
  },
  created() {
    this.type = this.$route.params.type
  },
  methods: {
    routerStyle() {
      return this.type === 'editNew'
    }
  }
}
</script>
<style lang="scss" scoped>
.clause_new {
  width: 100%;
  display: inline-table;
  border: 1px solid #e7eaec;
  margin-bottom: 16px;
  .new_title {
    width: 100%;
    line-height: 40px;
    padding: 0 16px;
    background: #fafafa;
    font-size: 14px;
    font-weight: 500;
  }
  .new_flex {
    width: 100%;
    display: flex;
    border-top: 1px solid #e7eaec;
    .flex_left {
      width: 64px;
      position: relative;
      border-right: 1px solid #e7eaec;
      .span {
        width: 100%;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    }
    .flex_right {
      flex: 1;
      padding: 9px 16px;
      box-sizing: border-box;
      font-size: 14px;
      line-height: 32px;
      .el-input {
        width: 50px;
        margin: 0 5px;
        ::v-deep .el-input__inner {
          padding: 0 5px;
          text-align: center;
        }
      }
    }
  }
}
</style>
