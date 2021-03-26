<template>
  <div class="progress">
    <div v-for="item in 4" :key="item" class="step">
      <div class="line"><span :class="checkState(&quot;close&quot;)" />{{ item===4?'':'______________________' }}</div>
      <div class="intro">
        <div class="publisher">发布人：杨霞</div>
        <div class="time">2020-12-12 20:00:00</div>
        <div class="remark">审核意见:不通过</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // checkState:{
      // backgroundImage:require('@/assets/billIcon/correct.png')
      // }
    }
  },
  methods: {
    checkState(state) {
      const State = {
        trail: 'trail',
        close: 'close',
        correct: 'correct'
      }
      return State[state]
    }
  }
}
</script>

<style lang='scss' scoped>
@import "~@/styles/custom-theme.scss";
.progress{
   display: flex;
   font-family: PingFang SC;
   .line{
       color: $--custom--color--primary;
       span{
           background-image: url('~@/assets/billIcon/correct.png');
           background-size: contain;
           position: relative;
           display:inline-block;
           top: 12px;
           height: 16px;
           width: 16px;
           border-radius: 50px;
       }
       .trail{
           background-image: url('~@/assets/billIcon/trail.png');
           background-size: contain;
       }
       .close{
       }
       margin-bottom: 20px;
   }
   .intro{
    //    margin-top: 30px;
     font-size: 14px;
       .publisher{

       }
       .time{
           color:#666666;
           margin:6px 0px;
       }
   }
}
</style>
