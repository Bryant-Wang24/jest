<template>
  <div class="content_add">
    <div class="content">
      <div class="left">
        <div class="new">
          <row-text
            style="margin-bottom:20px"
            :text="'订单信息 ' + '('+projectName+')'"
            :background-color="'white'"
          />
          <sale-from ref="saleFrom" />
        </div>
        <div class="new" style="margin-bottom:0">
          <row-text
            style="margin-bottom:20px"
            :text="'选择明细'"
            :background-color="'white'"
          />
          <price-item
            ref="priceItems"
            :price-item-list="priceItemList"
            @get_total="get_total"
          />
        </div>
      </div>
      <div class="right">
        <row-text
          style="margin-bottom:20px"
          :text="'订单明细' + '(' + priceItemList.length + ')'"
        >
          <el-button
            style="float:right"
            type="text"
            @click="priceItemListDelete"
          >清空</el-button>
        </row-text>
        <ChangePrice
          :order-list="priceItemList"
          @deleteId="priceItemDataDeleteId"
          @get_total="get_total"
        />
      </div>
    </div>
    <div class="foot">
      <div class="num">
        应收款：<span>￥{{ total }}</span>
      </div>
      <el-button @click="submitNo">取消</el-button>
      <el-button
        type="primary"
        :loading="btnLoading"
        @click="submitFrom"
      >确定</el-button>
    </div>

  </div>
</template>
<script>
import RowText from '@/components/rowText'
import pageMixin from '@/views/mixins/page'
// import TablePage from '@/components/table/table'
import SaleFrom from './components/saleAddFrom'
import PriceItem from './components/priceItem'
import ChangePrice from './components/changePrice'
export default {
  name: 'SaleAdd',
  components: { SaleFrom, PriceItem, ChangePrice, RowText },
  mixins: [pageMixin],
  data() {
    return {
      routeId: '',
      type: '',
      btnLoading: false,
      priceList: [], // 价目表列表
      priceId: '',
      priceItemList: [], // 价目表明细列表
      priceItemName: '',
      total: 0,
      priceItemData: [], // 编辑保存
      projectName: '',
      projectId: ''
      // 订单类型

      // tableData: [{ name: "明细" }]
    }
  },
  watch: {
    $route() {
      this.get_router_id()
    }
  },
  created() {
    this.get_router_id()
    this.get_orderItem()
  },
  methods: {
    // 删除订单明细时,删除订单详情明细priceItemData的数据
    priceItemDataDeleteId(i) {
      this.priceItemData.splice(i, 1)
    },
    // 取消
    submitNo() {
      this.$router.go(-1)
    },

    get_router_id() {
      if (this.$route.name === 'SaleAdd') {
        this.projectId = this.$route.params.id
      } else {
        this.routeId = this.$route.params.id
      }
      this.projectName = this.$route.params.type
    },
    // 详情
    get_orderItem() {
      this.priceItemList = []
      if (this.$route.name === 'SaleAdd') return false
      this.$api.sale.orderItem({ id: this.routeId }).then(res => {
        if (res) {
          this.projectId = res.projectId
          this.$refs.saleFrom.$refs.ruleForm.model.contactName = res.contactName
          this.$refs.saleFrom.$refs.ruleForm.model.contactNumber = res.contactNumber
          this.$refs.saleFrom.$refs.ruleForm.model.customer_id = this.$route.query.entrance === 'siteMarket' ? res.customerId.toString() : res.customerId
          this.$refs.saleFrom.$refs.ruleForm.model.remark = res.remark
          this.$refs.saleFrom.$refs.ruleForm.model.type = res.type
          var list = res.items
          var total = 0
          for (var i in list) {
            var totalMoney = list[i].price * list[i].quantity * list[i].secondQuantity
            var proportion = ((Number(totalMoney) - Number(list[i].discount)) / totalMoney) * 100
            var count = String(proportion).indexOf('.') + 1
            if (count > 0) {
              proportion = proportion.toFixed(2)
            }
            const json = {
              // id: list[i].id,
              priceItemId: list[i].priceItemId,
              priceUnit: list[i].priceUnit,
              quantityUnit: list[i].quantityUnit,
              quantity: list[i].quantity,
              secondQuantity: Number(list[i].secondQuantity),
              price: list[i].price,
              priceUnits: list[i].priceUnit === '天' ? '天数' : list[i].priceUnit,
              priceTotal: totalMoney,
              setTatal: (totalMoney - list[i].discount).toFixed(2),
              proportion: proportion,
              visible: false,
              name: list[i].name,
              discount: list[i].discount
            }
            this.priceItemList.push(json)
            total = Number(total) + Number(json.priceTotal) - Number(json.discount)
          }
          this.priceItemData = list
          this.total = total.toFixed(2)
        }
      })
    },
    get_total(val) {
      this.total = val.toFixed(2)
    },
    // 清空操作
    priceItemListDelete() {
      this.$confirm('此操作将永久删除的订单明细的数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.priceItemList = []
          this.priceItemData = []
          this.total = 0
        })
        .catch(() => {

        })
    },
    submitFrom() {
      this.$refs.saleFrom.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.priceItemList.length === 0) return this.$message.warning('请选择价目表明细')
          var ruleForm = this.$refs.saleFrom.$refs.ruleForm.model
          var items = []
          for (var i in this.priceItemList) {
            if (isNaN(this.priceItemList[i].quantity)) return this.$message.warning('订单明细中' + this.priceItemList[i].name + '的数量必须为数字')
            if (isNaN(this.priceItemList[i].secondQuantity)) return this.$message.warning('订单明细中' + this.priceItemList[i].name + '的展期必须为数字')
            items.push({
              id: '',
              price: Number(this.priceItemList[i].price),
              priceItemId: Number(this.priceItemList[i].priceItemId),
              quantity: Number(this.priceItemList[i].quantity),
              secondQuantity: Number(this.priceItemList[i].secondQuantity),
              discount: Number(this.priceItemList[i].discount)
            })
          }

          // if(this.routeId === -1) return this.routeId = ''
          // 编辑后提交，接口返回的items数据和编辑后的数据进行比较，
          if (this.routeId !== '') {
            var arr = JSON.stringify(this.priceItemData)
            var list = JSON.parse(arr)
            for (var n in items) {
              for (var j in list) {
                n === j ? items[n].id = list[j].id : ''
              }
              if (items[n].id === '') delete items[n].id
            }
          }
          // console.log(items)
          const json = {
            projectId: this.projectId,
            type: ruleForm.type,
            customerId: ruleForm.customer_id,
            contactName: ruleForm.contactName,
            contactNumber: ruleForm.contactNumber,
            remark: ruleForm.remark,
            items: items
          }
          if (this.$route.name !== 'SaleAdd') {
            this.btnLoading = true
            // json['id'] = this.routeId
            this.get_ordersEdit({ json, id: this.routeId })
          } else {
            this.btnLoading = true
            this.get_ordersAdd(json)
          }
        }
      })
    },
    // 新增
    get_ordersAdd(json) {
      this.$api.sale.ordersAdd(json).then(res => {
        if (res) {
          this.btnLoading = false
          this.$message.success('创建成功')
          this.$router.push({ name: 'sale', params: { id: this.projectId, type: this.projectName }, query: { entrance: this.$route.query.entrance }})
        }
      })
    },
    // 编辑
    get_ordersEdit(json) {
      this.$api.sale.ordersEdit(json).then(res => {
        if (res) {
          this.btnLoading = false
          this.$message.success('修改成功')
          this.$router.push({ name: 'sale', params: { id: this.projectId, type: this.projectName }, query: { entrance: this.$route.query.entrance }})
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.rowTitle {
  .el-button {
    display: inline-table;
    float: right;
    color: #888888;
    margin-right: 12px;
  }
}
.form_title_right {
  background: white;
  .span {
    float: right;
    color: #888888;
    font-size: 14px;
  }
}
.content_add {
  width: 100%;
  display: inline-table;
  padding: 20px;
  box-sizing: border-box;
  .content {
    width: 100%;
    padding-bottom: 64px;
    box-sizing: border-box;
    display: flex;
    .left {
      width: 70%;
      height: 100%;
      margin-right: 16px;
    }
    .right {
      background: white;
      padding: 24px;
      height: auto;
      flex: 1;
    }
  }
  .new {
    width: 100%;
    padding: 20px;
    background: white;
    display: inline-table;
    margin-bottom: 16px;
    .table_title {
      width: 100%;
      font-size: 18px;
      line-height: 25px;
      margin-bottom: 23px;
    }
  }
}
.foot {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  height: 64px;
  padding: 0 56px;
  box-sizing: border-box;
  line-height: 64px;
  background: white;
  text-align: right;
  font-size: 14px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
  .num {
    display: inline-table;
    margin-right: 100px;
    span {
      font-size: 20px;
      color: #ff0000;
    }
  }
  .el-button {
    width: 96px;
  }
}
</style>
