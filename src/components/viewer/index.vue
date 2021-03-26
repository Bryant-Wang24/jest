<template>
  <div style="display:none;">
    <ul id="previewImages">
      <li v-for="(item, index) in previewList" :key="index">
        <img :src="item.url" :alt="item.alt">
      </li>
    </ul>
  </div>
</template>

<script>
import Viewer from 'viewerjs'
import { mapGetters } from 'vuex'
import { EventBus } from '@/utils/event-bus'
export default {
  data() {
    return {
      ViewerDom: null
    }
  },
  computed: {
    ...mapGetters({
      previewList: 'previewList',
      previewOptions: 'previewOptions'
    })
  },
  mounted() {
    const ViewerDom = document.getElementById('previewImages')
    this.ViewerDom = ViewerDom
    EventBus.$on('preview_image', () => {
      this.show()
    })
  },
  methods: {
    show(options) {
      this.$nextTick(() => {
        const gallery = new Viewer(this.ViewerDom, options = {
          hidden: () => {
            gallery.destroy()
          },
          zIndex: 100000,
          ...this.previewOptions
        })
        gallery.show()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
