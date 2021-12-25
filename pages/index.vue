<template>
  <div>hello user</div>
</template>

<script>
export default {
  layout: 'default',
  computed: {
    user() {
      console.log(this.$auth.user)
      return this.$auth.user
    },
  },
  mounted() {
    if (this.user && this.user.role === 'Admin') {
      this.$router.push('/dashboard')
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/_variables.scss';
h1 {
  color: $red;
}
</style>
