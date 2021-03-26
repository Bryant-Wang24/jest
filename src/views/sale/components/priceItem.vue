<template>
  <div>
    <div class="ul">
      <div class="li" style="width:35%">
        <div class="name">价目表：</div>
        <div class="input">
          <el-select
            v-model="priceListId"
            clearable
            placeholder="请选择价目表"
          >
            <WrapOption
              v-for="(item, index) of priceList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
      <div class="li" style="width:35%">
        <div class="name">明细项：</div>
        <div class="input">
          <el-input
            v-model="fuzzyName"
            :disabled="priceListId !== '' ? false : true"
          />
        </div>
      </div>
      <div class="li liRight">
        <el-button @click="query('查询')">查询</el-button>
        <el-button @click="query('重置')">重置</el-button>
      </div>
    </div>
    <div v-if="orderItemList.length > 0" class="list">
      <div v-for="(item, index) of orderItemList" :key="index" class="li">
        <div class="li_new">
          <div class="new_top">
            <div class="top_li">{{ item.name }}</div>
            <div class="top_li">
              <span>{{ item.price }}</span>元/{{ item.quantityUnit +'/'+item.priceUnit||'' }}
              <el-button
                type="primary"
                icon="el-icon-plus"
                circle
                size="mini"
                @click="get_priceItemList(item, item.sku)"
              />
            </div>
          </div>
          <div class="new_bottom">
            <el-tooltip class="item" effect="dark" :content="item.remark||'无备注说明'" placement="bottom">
              <el-button type="text">{{ item.remark||'无备注说明' }}</el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="data_null">暂无数据</div>
    <dialog-page
      :dialog-show="dialogShow"
      width="31.25%"
      :title="dialogTitle"
      @handleCancel="dialogShow = false"
    >
      <div class="sku_new">
        <div class="title">规格</div>
        <el-radio-group v-model="sku_radio">
          <el-radio
            v-for="(item, index) of sku_list"
            :key="index"
            :label="item.id"
            border
          >{{ item.standard||'null' }}</el-radio>
        </el-radio-group>
        <div class="footBtnRadio">
          <div v-if="sku_list.length > 0" class="price">
            价格：<span
              style="color:#FF0000"
            >￥{{ sku_list[sku_index].price || 0 }}</span>{{ sku_list[sku_index].priceUnit }}
          </div>
          <div>
            <el-button type="primary" @click="sku_submit">确定</el-button>
          </div>
        </div>
      </div>
    </dialog-page>
  </div>
</template>
<script>
import DialogPage from '@/components/dialog/dialog'
import WrapOption from '@/components/base/WrapOption'
export default {
  components: { DialogPage, WrapOption },
  props: {
    priceItemList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      sku_radio: '',
      sku_index: '',
      dialogShow: false,
      sku_list: [],
      dialogTitle: '',
      priceListId: '',
      fuzzyName: '',
      priceList: [],
      orderItemList: [],
      range: 0
    }
  },
  watch: {
    // 价目表下拉选择获取明细
    priceListId(val) {
      const json = {
        priceListId: Number(val),
        inTypes: [],
        pageNum: 1,
        pageSize: 0
      }
      this.get_priceListItem(json)
    },
    sku_radio(val) {
      this.sku_index = 0
      for (var i in this.sku_list) {
        if (this.sku_list[i].id === val) {
          this.sku_index = i
          return
        }
      }
    }
  },
  created() {
    this.get_priceData()
    if (this.$route.query.entrance === 'siteMarket') {
      this.set_getSiteMarketID()
    }
  },
  methods: {
    // 获取场地销售详情
    set_getSiteMarketID() {
      let id = ''
      if (this.$route.name === 'saleEdit') {
        id = this.$route.query.projectId
      } else {
        id = this.$route.params.id
      }
      this.$api.siteMarketList.getSiteMarketID(id).then(res => {
        if (res) {
          const obj = res.siteSale
          const startDate = new Date(obj.startDate)
          const endDate = new Date(obj.endDate)
          this.range = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
        }
      })
    },
    // 查询、重置
    query(val) {
      val === '重置' ? (this.fuzzyName = '') : ''
      if (this.priceListId === '') return
      const json = {
        priceListId: Number(this.priceListId),
        inTypes: [], // 暂时不传
        pageNum: 1,
        pageSize: 0
      }
      this.fuzzyName !== '' ? (json['fuzzyName'] = this.fuzzyName) : ''
      this.get_priceListItem(json)
    },
    // 获取价目表数据
    get_priceData() {
      const json = {
        pageNum: 0,
        pageSize: 0,
        enabled: true
      }
      this.$api.priceList.priceData(json).then(res => {
        if (res) {
          this.priceList = res.list
        }
      })
    },
    // 价目表明细数据
    get_priceListItem(data) {
      this.$api.priceList.priceListItem(data).then(res => {
        if (res) {
          // 根据名称和价钱进行排序去重，以名称为主，价钱为辅，整合类似商品为主，附带sku属性数据
          var arr = res.list.sort((a, b) => {
            return a.price - b.price
          }) // 排序
          var Arr = this.newList(arr)
          for (var i in Arr) {
            Arr[i]['sku'] = []
            for (var j in arr) {
              if (Arr[i].name === arr[j].name) {
                Arr[i].sku.push(arr[j])
              }
            }
          }
          this.orderItemList = Arr
        }
      })
    },
    // 数据去重
    newList(data) {
      const res = new Map()
      return data.filter(item => !res.has(item.name) && res.set(item.name, 1))
    },
    get_priceItemList(data, sku) {
      // 如果该明细有超过一种以上的类型，则会弹窗显示选择
      console.log(sku)
      if (sku.length === 1) {
        this.get_integration(data)
      } else {
        this.dialogTitle = data.name
        this.dialogShow = true
        this.sku_list = sku
        this.sku_radio = sku[0].id
      }
    },
    sku_submit() {
      this.get_integration(this.sku_list[this.sku_index])
      this.dialogShow = false
    },
    // 添加明细数据整合
    get_integration(data) {
      let secondQuantity = 1
      if (data.type === 'PAVILION' && data.priceUnit === '天') {
        secondQuantity = this.range
      }
      const json = {
        id: '',
        priceItemId: data.id,
        priceUnit: data.priceUnit,
        quantityUnit: data.quantityUnit,
        quantity: 1,
        secondQuantity: secondQuantity,
        price: data.price,
        priceUnits: data.priceUnit === '天' ? '天数' : data.priceUnit,
        priceTotal: (Number(data.price) * Number(secondQuantity)).toFixed(2),
        setTatal: Number(data.price),
        proportion: 100,
        visible: false,
        name: data.name,
        discount: 0
      }
      // if (this.priceItemList.length > 0) {
      //   for (var i in this.priceItemList) {
      //     if (this.priceItemList[i].priceItemId === json.priceItemId) {
      //       this.$message.warning('该明细已经存在订单明细中')
      //       return
      //     }
      //   }
      // }
      this.priceItemList.push(json)
      this.get_total()
    },
    get_total() {
      var total = 0
      for (var i in this.priceItemList) {
        total =
          Number(total) +
          Number(this.priceItemList[i].priceTotal) -
          Number(this.priceItemList[i].discount)
      }
      this.$emit('get_total', total)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/custom-theme.scss";
.data_null{
  width: 100%;
  line-height: 100px;
  text-align: center;
}
.el-dialog__wrapper {
  ::v-deep .el-dialog {
    .el-dialog__header {
      border-bottom: 1px solid #e5e5e5;
    }
    .el-dialog__body {
      padding-top: 0;
    }
  }
}
.sku_new {
  .title {
    width: 100%;
    text-align: left;
    font-size: 14px;
    color: #888888;
    line-height: 20px;
    padding: 16px 0;
    box-sizing: border-box;
  }
  .el-radio-group {
    ::v-deep .el-radio {
      margin: 0 12px 16px 0;
      border-radius: 2px;
      .el-radio__input {
        display: none;
      }
    }
  }
}
.footBtnRadio {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .price {
    font-size: 14px;
    line-height: 20px;
  }
}
.ul {
  width: 100%;
  display: inline-table;
  padding: 0 2%;
  box-sizing: border-box;
  margin-bottom: 24px;
  .li {
    display: flex;
    margin-right: 20px;
    float: left;
    .name {
      font-size: 14px;
      color: #000000;
      line-height: 32px;
      display: inline-table;
      margin-right: 10px;
    }
    .input {
      flex: 1;
    }
    .el-button {
      width: 60px;
      padding: 0;
      line-height: 36px;
      border-radius: 15px;
      text-align: center;
    }
  }
  .liRight{
    float: right;
    margin-right: 0;
  }
}
.list {
  width: 100%;
  display: inline-table;
  // display: flex;
  // flex-wrap: wrap;
  // justify-content: space-between;
  .li {
    width: 31%;
    float: left;
    margin-left: 2%;
    margin-bottom: 16px;
    // display: inline-table;
    border-radius: 4px;
    font-size: 14px;
    .li_new {
      // width: 100%;
      border-radius: 3px;
      border: 1px solid #cccccc;
      border-top: 6px solid $--custom--color--primary;
      .new_top {
        padding: 16px;
        border-bottom: 1px solid #cccccc;
        .top_li {
          // width: 100%;
          position: relative;
          line-height: 32px;
          span {
            color: #ff0000;
            font-size: 16px;
          }
          .el-button {
            float: right;
          }
        }
      }
      .new_bottom {
        line-height: 44px;
        height: 44px;
        padding: 0 16px;
        box-sizing: border-box;
        .el-button{
          width: 100%;
          text-align: left;
          color: #888888;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

      }
    }
  }
}
</style>
