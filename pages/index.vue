<template>
  <div></div>
</template>

<script>
export default {
  layout: 'default',
  computed: {
    user() {
      return this.$auth.user
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/_variables.scss';
h1 {
  color: $red;
}
</style>
