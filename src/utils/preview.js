import store from '@/store'
import { EventBus } from '@/utils/event-bus'

/**
 * @param urls 图片地址数组
 */
export const preview = async(urls, options) => {
  await store.dispatch('preview/setlist', { urls, options })
  EventBus.$nextTick(() => {
    EventBus.$emit('preview_image')
  })
}
