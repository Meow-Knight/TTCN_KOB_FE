<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 24 24"
    fill="currentColor"
    :color="color"
    :stroke="stroke"
    stroke-width="2%"
  >
    <path
      d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
    />
  </svg>
</template>

<script>
export default {
  props: ['color', 'height', 'width', 'stroke'],
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';
</style>
