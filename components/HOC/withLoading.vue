<template>
  <div class="container">
    <span v-if="isLoading">Loading</span>
    <slot v-else> â </slot>
  </div>
</template>

<script>
export default {
  props: ['isLoading'],
}
</script>

<style scoped>
.container {
  height: fit-content;
  width: fit-content;
}
</style>
