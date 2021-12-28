<template>
  <div></div>
</template>
<script>
import { roleGuard } from '~/helper/helper'

export default {
  middleware: ['auth', roleGuard('admin')],
  mounted() {
    this.$router.push('/dashboard/beers')
  },
}
</script>
