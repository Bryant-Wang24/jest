<template>
  <div class="info">
    <rowText :text="'交接单信息'" />
    <el-row class="row">
      <el-col :span="12">
        <div class="formItem">
          <div class="label">交接单编号：</div>
          <div class="value">{{ basicInfo.handoverSlip.handoverCode }}</div>
        </div>
        <div class="formItem">
          <div class="label">主办名称：</div>
          <div class="value">{{ basicInfo.handoverSlip.hostName }}</div>
        </div>
        <div class="formItem">
          <div class="label">主办联系电话：</div>
          <div class="value">{{ basicInfo.handoverSlip.hostPhone }}</div>
        </div>
        <div class="formItem">
          <div class="label">合同服务手册：</div>
          <div class="value">{{ basicInfo.handoverSlip.manual }}</div>
        </div>
        <div class="formItem">
          <div class="label">状态：</div>
          <div class="value">{{ STATE[basicInfo.handoverSlip.state] }}</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="formItem">
          <div class="label">项目名称：</div>
          <div class="value">{{ basicInfo.handoverSlip.projectName }}</div>
        </div>
        <div class="formItem">
          <div class="label">主办联系人：</div>
          <div class="value">{{ basicInfo.handoverSlip.hostContacts }}</div>
        </div>
        <div class="formItem">
          <div class="label">项目负责人：</div>
          <div class="value">{{ basicInfo.handoverSlip.projectLeader }}</div>
        </div>
        <div class="formItem">
          <div class="label">提交时间：</div>
          <div class="value">{{ basicInfo.handoverSlip.createDate }}</div>
        </div>
        <div class="formItem">
          <div class="label">备注：</div>
          <div class="value">{{ basicInfo.handoverSlip.remarks }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { STATE } from '@/common/handoverSlipMgmt'
import rowText from '@/components/rowText'
export default {
  components: { rowText },
  props: {
    basicInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      STATE,
      dialogVisible: false // 控制预览框显隐
      // form: {
      // companyName: '公司姓名', // 公司姓名
      // creditCode: 'SDJH123123123123PO', // 信用代码
      // customerType: 2, // 客户类型
      // country: '中国', // 国家
      // address: 'xxxxx', // 注册地址
      // legal: '卢本伟', // 法人代表
      // capital: '1000W', // 注册资本
      // industry: 1, // 所属行业
      // businessScope: '', // 经营范围
      // rate: 5, // 客户星级
      // domain: 'http://www.gamesci.com.cn/', // 网址
      // license:
      //   'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599217679520&di=d9b27ea791d07d7e758b577c13a9bb93&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20190227%2F8caece6ab73747da8bf30b615d2f2b46.jpeg', // 营业执照
      // material: [
      //   'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599217679520&di=d9b27ea791d07d7e758b577c13a9bb93&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20190227%2F8caece6ab73747da8bf30b615d2f2b46.jpeg',
      //   'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599217679520&di=d9b27ea791d07d7e758b577c13a9bb93&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20190227%2F8caece6ab73747da8bf30b615d2f2b46.jpeg',
      //   'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599217679520&di=d9b27ea791d07d7e758b577c13a9bb93&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20190227%2F8caece6ab73747da8bf30b615d2f2b46.jpeg',
      //   'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599217679520&di=d9b27ea791d07d7e758b577c13a9bb93&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20190227%2F8caece6ab73747da8bf30b615d2f2b46.jpeg'
      // ], // 附件资料
      // companyNameCut: '', // 公司简称
      // companyNameEn: '', // 公司英文名
      // area: '', // 地区
      // addressEn: '', // 英文地址
      // operatingPeriod: '', // 营业期限
      // companyType: '', // 公司性质
      // scale: '', // 公司规模
      // description: '', // 公司简介
      // status: 0, // 客户状态
      // postcode: '', // 邮编
      // Remark: '' // 备注
      // }
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
.info {
//   padding: 20px 0;
  font-size: 14px;
}
.row{
    padding: 20px;
}
.formItem {
  display: flex;
  margin-bottom: 14px;
  .label {
    // width: 160px;
    margin-right: 10px;
    text-align: left;
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
</style>
