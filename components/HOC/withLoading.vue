<template>
  <div class="container">
    <span v-if="isLoading">Loading</span>
    <slot v-else></slot>
  </div>
</template>

<script>
export default {
  props: ['isLoading'],
}
</script>

<style scoped>
.container {
  width: 100%;
  min-height: 80vh;
}
</style>
