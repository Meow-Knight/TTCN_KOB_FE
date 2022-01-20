<template>
  <div class="rating-wrapper" @mouseout="handleMouseOut">
    <div
      v-for="index in 5"
      :key="index"
      class="start-wrapper"
      :class="{ interactive }"
      @mouseover="handleMouseOver(index)"
      @click="handleSelectRating(index)"
    >
      <rating-star
        :color="'white'"
        class="start-wrapper__background"
        :width="width"
        :height="height"
        :stroke="'red'"
      ></rating-star>
      <div
        class="start-wrapper__foreground"
        :style="{
          width:
            currentRating >= index
              ? '100%'
              : index - currentRating < 1
              ? `${(1 - (index - currentRating)) * 100}%`
              : '0px',
        }"
      >
        <rating-star
          :color="'red'"
          :width="width"
          :height="height"
          :stroke="'none'"
        ></rating-star>
      </div>
    </div>
  </div>
</template>

<script>
import RatingStar from './SVG/RatingStar.vue'
export default {
  components: { RatingStar },
  props: ['rating', 'height', 'width', 'stroke', 'color', 'interactive'],
  emits: ['handleSelectRating'],
  data() {
    return {
      // currentRating is local rating value, used in interactive star to demonstrate
      // mouseover event
      currentRating: 0,
      // selectedRating is local rating value, used in interactive star to demonstrate
      // click (select rating) event
      selectedRating: 0,
    }
  },
  watch: {
    rating(cur, prev) {
      this.currentRating = cur
    },
  },
  // rating is property pass to this component, used on non-interactive star
  mounted() {
    this.currentRating = this.rating || 0
    this.selectedRating = this.interactive && (this.rating || 0)
  },
  methods: {
    handleMouseOver(index) {
      if (!this.interactive) return
      this.currentRating = index
    },
    handleMouseOut() {
      if (!this.interactive) return
      this.currentRating = this.selectedRating
    },
    handleSelectRating(value) {
      if (!this.interactive) return
      this.selectedRating = value
      this.$emit('handleSelectRating', value)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.rating-wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

.start-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
}

.start-wrapper.interactive {
  cursor: pointer;
}

.start-wrapper__foreground {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 2;
}
</style>
