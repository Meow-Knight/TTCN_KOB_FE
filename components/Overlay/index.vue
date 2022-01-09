<template>
  <div class="overlay">
      <slot />
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: $gray;
  opacity: 0.7;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>