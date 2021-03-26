import api from '@/api/index'
export default {
  data() {
    return {
      exhibitionList: []
    }
  },
  methods: {
    getExhibitionData() {
      api.systemManagement.exhibitionList().then(res => {
        this.exhibitionList = res
      })
    }

  }

}
