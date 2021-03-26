<template>
  <div class="app-container">
    <switch-roles @change="handleRolesChange" />
  </div>
</template>

<script>
import SwitchRoles from './components/SwitchRoles'
import pageMixin from '@/views/mixins/page'

export default {
  name: 'PagePermission',
  components: { SwitchRoles },
  mixins: [pageMixin],
  methods: {
    handleRolesChange() {
      this.$router.push({ path: '/permission/index?' + +new Date() })
    }
  }
}
</script>
