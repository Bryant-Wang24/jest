<template>
  <div id="showData">
    <div class="field_area">
      <div class="title">场地与面积：</div>
      <div class="info">
        <span>总面积：30000平方米</span>
        <div class="field_div">
          <div>
            <el-select v-model="valueNum" :inline="true" disabled style="width: 120px" />
            <el-input v-model="inputNum" :inline="true" disabled style="width: 120px; margin-left: 15px;" /> 平方米
          </div>
        </div>
      </div>
    </div>
    <div class="field_time">
      <div class="title">场地时间安排：</div>
      <div class="info">
        <span>时间范围：2020-09-20 09:00 ~ 2020-09-20 17:00</span>
        <div class="field_div">
          <div class="field_div_first">
            <div class="title_tip">场地：</div>
            <el-select v-model="valueNum" :inline="true" disabled style="width: 300px" />
          </div>
          <div class="field_div_second">
            <div class="title_tip">布展期：</div>
            <el-select v-model="valueNum" :inline="true" disabled style="width: 220px" />
            <el-select v-model="valueNum" :inline="true" disabled style="width: 100px; margin-left: 10px;" />
            <span> ~ </span>
            <el-select v-model="valueNum" :inline="true" disabled style="width: 100px; margin-left: 10px;" />
          </div>
          <div class="field_div_third">
            <div class="title_tip">开展期：</div>
            <el-select v-model="valueNum" :inline="true" disabled style="width: 220px" />
            <el-select v-model="valueNum" :inline="true" disabled style="width: 100px; margin-left: 10px;" />
            <span> ~ </span>
            <el-select v-model="valueNum" :inline="true" disabled style="width: 100px; margin-left: 10px;" />
          </div>
          <div class="field_div_fourth">
            <div class="title_tip">撤展期：</div>
            <el-select v-model="valueNum" :inline="true" disabled style="width: 220px" />
            <el-select v-model="valueNum" :inline="true" disabled style="width: 100px; margin-left: 10px;" />
            <span> ~ </span>
            <el-select v-model="valueNum" :inline="true" disabled style="width: 100px; margin-left: 10px;" />
          </div>
        </div>
      </div>
    </div>
    <div class="air_time">
      <div class="title">送风时间：</div>
      <div>
        <el-select v-model="valueNum" disabled style="width: 300px;" />
      </div>
    </div>
    <div class="air_cond_time">
      <div class="title">空调时间：</div>
      <div>
        <el-select v-model="valueNum" disabled style="width: 300px;" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowData',
  data() {
    return {
      valueNum: '2号馆',
      inputNum: '20000'
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
    #showData{
        background: #ffffff;
        .field_area,.field_time,.air_time,.air_cond_time{
            .title{
                float: left;
                color: #666666;
                width: 130px;
                text-align: right;
            }
            .info{
                width: calc(100% - 130px);
                color: #000000;
                .field_div{
                    margin-top: 10px;
                    margin-left: 130px;
                    background: #FAFAFA;
                    padding: 10px;
                }
            }

        }
        .field_time{
            margin-top: 10px;
            .info{
                .field_div{
                    .field_div_first,.field_div_second,.field_div_third,.field_div_fourth{
                        display: flex;
                        margin-bottom: 10px;
                        .title_tip{
                            width: 60px;
                            text-align: right;
                            line-height: 34px;
                        }
                        span{
                            line-height: 34px;
                            margin-left: 10px;
                        }
                    }
                }
            }
        }
        .air_time,.air_cond_time{
            margin-top: 20px;
            .title{
                line-height: 34px;
            }
        }
    }
</style>
