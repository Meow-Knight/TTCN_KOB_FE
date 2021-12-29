<template>
  <div class="collection-container">
    <beer-card v-for="beer in beers" :key="beer.id" :beer="beer"> </beer-card>
  </div>
</template>

<script>
import BeerCard from './UI/BeerCard.vue'
export default {
  components: { BeerCard },
  props: {
    beers: {},
    numColumns: {
      type: Number,
      default: 4,
    },
    columnWidth: {
      type: Number,
      default: 1.5,
    },
    numRows: {
      type: Number,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$el.style.gridTemplateColumns = `repeat(${this.numColumns}, ${this.columnWidth}fr)`
    })
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/_variables.scss';

.collection-container {
  width: 100%;
  display: grid;
  /* grid-template-columns: repeat(4, 1.5fr); */
  column-gap: 25px;
  justify-items: center;
  row-gap: 40px;
  transition: 0.5s ease-in-out;
}
</style>
