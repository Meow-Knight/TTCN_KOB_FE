<template>
  <div class="breadcrumb">
    <div v-for="(item, index) in items" :key="index" class="breadcrumb__item">
      <a :href="item.url">{{ item.name }} </a>
      <span v-if="index < items.length - 1" class="breadcrumb__arraw">></span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['items'],
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

a {
  text-decoration: none !important;
  color: $black;
}
.breadcrumb {
  //   background-color: transparent;
  &__item:last-of-type {
    a {
      color: $gray !important;
    }
  }
  &__arraw {
    margin-right: 5px;
  }
}
</style>