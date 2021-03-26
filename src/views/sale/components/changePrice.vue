<template>
  <div>
    <div class="list">
      <div v-for="(item,index) of orderList" :key="index" class="li">
        <!-- <div class="li_new"> -->
        <div class="new_top">
          <div class="li_title">
            <div class="title">{{ item.name }}</div>
            <el-button type="text" size="small" @click="orderListDelete(index)">删除</el-button>
          </div>
          <div class="top_li">
            <div class="li_new">
              <div class="name">单价：</div>
              <div class="input">
                <el-input
                  v-model="item.price"
                  oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  size="small"
                  style="max-width:120px"
                  :disabled="entrance==='shop' ? false : true"
                  @blur="inputBlur(index,'quantity')"
                />
                <div class="span">元/{{ item.quantityUnit +'/'+item.priceUnit||'' }}</div>
              </div>

            </div>
          </div>
          <div class="top_li">
            <div class="li_new">
              <div class="name">数量：</div>
              <div class="input">
                <el-input v-model="item.quantity" oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}" size="small" @blur="inputBlur(index,'quantity')" />
              </div>
              <div class="span">{{ item.quantityUnit }}</div>
            </div>
            <div class="li_new" style="margin-left:10px">
              <div class="name">{{ item.priceUnits }}：</div>
              <div class="input" style="margin-right:10%">
                <el-input v-model="item.secondQuantity" oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}" size="small" @blur="inputBlur(index,'secondQuantity')" />
              </div>
            </div>
          </div>
        </div>
        <div class="new_bottom">
          <div class="li">
            ￥{{ (item.priceTotal-item.discount).toFixed(2) }}
            <el-popover v-model="item.visible" placement="bottom">
              <el-input
                v-model="item.setTatal"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                size="small"
                style="width:130px"
                class="popover_oeder"
                @keyup.native="keyup(index,'setTatal',item.setTatal)"
              ><template slot="prepend">￥</template></el-input>
              <i class="el-icon-sort sortLeft" />
              <el-input
                v-model="item.proportion"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                size="small"
                style="width:100px"
                class="popover_oeder"
                @keyup.native="keyup(index,'proportion',item.proportion)"
              ><template slot="prepend">%</template></el-input>
              <!-- <el-input v-model="item.proportion" oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}" size="small" style="width:100px" class="popover_oeder" @keyup.native="keyup(index,'setTatal',item.setTatal)"><template slot="append">%</template></el-input> -->

              <div style="text-align: right; margin-top: 16px">
                <el-button
                  size="mini"
                  type="text"
                  @click="item.visible = false"
                >取消</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="referenceOk(index)"
                >确定</el-button>
              </div>
              <el-button slot="reference" type="text" @click="reference(index)">改价</el-button>
            </el-popover>
          </div>
          <div v-if="item.discount!==0" class="li lijian">优惠：-￥{{ item.discount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    orderList: {
      type: Array,
      default: () => {
        return []
      }
    },
    total: {
      type: Number,
      default: () => {
        return 0
      }

    }
  },
  data() {
    return {
      visible: false,
      entrance: ''

    }
  },
  watch: {
  },
  created() {
    this.entrance = this.$route.query.entrance
  },
  methods: {
    orderListDelete(i) {
      this.orderList.splice(i, 1)
      this.$emit('deleteId', i)
      this.get_total()
    },
    // 改价
    reference(i) {
      const object = this.orderList[i]
      if (object.discount === 0) {
        object.setTatal = object.priceTotal
        object.proportion = 100
      } else {
        object.setTatal = (Number(object.priceTotal) - Number(object.discount)).toFixed(2)
        var proportion = (Number(object.setTatal) / Number(object.priceTotal)) * 100
        if ((String(proportion).indexOf('.') + 1) > 0) {
          proportion = proportion.toFixed(2)
        }
        object.proportion = proportion
      }
      this.orderList[i] = object
    },
    // 改价确定
    referenceOk(i) {
      const object = this.orderList[i]
      var discount = Number(object.priceTotal) - Number(object.setTatal)
      if ((String(discount).indexOf('.') + 1) > 0) {
        discount = discount.toFixed(2)
      }
      object.discount = discount
      object.visible = false
      this.orderList[i] = object
      this.get_total()
    },
    keyup(i, type, data) {
      if (data === '') return false
      const object = this.orderList[i]
      const priceTotal = Number(object.price) * Number(object.quantity) * Number(object.secondQuantity)
      switch (type) {
        case 'setTatal':
          if (Number(object.setTatal) > Number(priceTotal)) {
            object.setTatal = priceTotal
            this.$message.warning('改价的金额不可以超过' + object.name + '的金额')
            return
          }
          var proportion = (Number(object.setTatal) / Number(priceTotal)) * 100
          if ((String(proportion).indexOf('.') + 1) > 0) {
            proportion = proportion.toFixed(2)
          }
          object.proportion = proportion
          break
        case 'proportion':
          if (Number(object.proportion) > 100) {
            object.proportion = 100
            this.$message.warning('改价的占比不可以超过100')
          }
          object.setTatal = ((priceTotal * object.proportion) / 100).toFixed(2)
          break
      }
    },
    inputBlur(i, type) {
      const object = this.orderList[i]
      const priceTotal = Number(object.price) * Number(object.quantity) * Number(object.secondQuantity)
      object.discount = 0
      object.priceTotal = priceTotal.toFixed(2)
      this.orderList[i] = object
      this.get_total()
    },
    get_total() {
      var total = 0
      for (var i in this.orderList) {
        total = Number(total) + Number(this.orderList[i].priceTotal) - Number(this.orderList[i].discount)
      }
      this.$emit('get_total', total)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-popover{
  .popover_oeder{
    .el-input{
      padding: 0 10px;
      text-align: center;
    }
  }
}
.sortLeft{
  font-size: 20px;
  margin: 5px;
  transform: rotate(90deg);
}

.list {
  width: 100%;
  .li {
    width: 100%;
    margin-bottom: 16px;
    display: inline-table;
    border-radius: 2px;
    font-size: 14px;
    background: #fafafa;
    // .li_new {
    //   width: 100%;

    .new_top {
      padding: 16px 16px 0 16px;
      border-bottom: 1px solid #cccccc;
      .li_title {
        width: 100%;
        margin-bottom: 16px;
        .title {
          display: inline-table;
          font-size: 16px;
          line-height: 32px;
          color: #000000;
        }
        .el-button {
          float: right;
          font-size: 14px;
          color: #f56c6c;
        }
      }

      .top_li {
        width: 100%;
        display: flex;
        margin-bottom: 16px;
        .li_new {
          flex: 1;
          min-width: 140px;
          display: flex;
          .name {
            line-height: 32px;
            font-size: 14px;
            color: #888888;
            display: inline-table;
          }
          .input {
            flex: 1;
            .span {
              display: inline-table;
              margin-left: 5px;
              line-height: 32px;
              color: #000000;
            }
          }
          .span {
            display: inline-table;
            margin-left: 5px;
            line-height: 32px;
            color: #000000;
          }

        }
      }
    }
    .new_bottom {
      width: 100%;
      padding: 12px 16px;
      box-sizing: border-box;
      display: inline-table;
      .li {
        font-size: 20px;
        color: #000000;
        line-height: 28px;
        margin-bottom: 0;
        span {
          margin-left: 12px;
          font-size: 14px;
          color: #004eff;
        }
      }
      .lijian {
        color: #666666;
        font-size: 14px;
      }
    }
    // }
  }
}
</style>
