<template>
  <div class="slide" :class="{ image: itemType }">
    <!-- we will take list items from parent component and render them -->
    <div id="list-scroll">
      <slot></slot>
    </div>
    <div class="slide__icon-container">
      <div v-if="iconBack" class="icon icon-back" @click="scroll(-1)">
        <i class="fas fa-chevron-circle-left"></i>
      </div>
      <div v-if="iconNext" class="icon icon-next" @click="scroll(1)">
        <i class="fas fa-chevron-circle-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['items', 'itemHeight', 'itemWidth', 'itemType'],
  data() {
    return {
      disabledIconButton: false, // prevent click 2 sequently times
      iconBack: false,
      iconNext: true,
    }
  },
  watch: {
    itemHeight(cur, prev) {
      const scrollItems = document.getElementsByClassName('scroll-item')
      for (let index = 0; index < scrollItems.length; index++) {
        scrollItems[index].style.height = cur
        scrollItems[index].style.width = cur
      }
    },
  },
  mounted() {
    // set width and height for all scroll item
    const scrollItems = document.getElementsByClassName('scroll-item')
    for (let index = 0; index < scrollItems.length; index++) {
      scrollItems[index].style.height = this.itemHeight
      scrollItems[index].style.width = this.itemHeight
    }
  },
  methods: {
    scroll(direction) {
      const element = document.getElementById(`list-scroll`)

      // prevent click 2 sequently times
      setTimeout(() => {
        this.disabledIconButton = false
      }, 1000)
      if (this.disabledIconButton) {
        return
      }

      const itemWidth =
        parseInt(this.itemWidth.slice(0, this.itemWidth.length - 2)) + 10
      if (direction === 1) {
        // scroll back
        const newX =
          element.scrollLeft +
          itemWidth * Math.floor(element.clientWidth / itemWidth)
        element.scrollLeft = newX
        if (element.scrollWidth - Math.round(newX) <= element.clientWidth) {
          this.iconNext = false
        }
        this.iconBack = true
      }
      if (direction === -1) {
        // scroll next
        let scrollLeft = element.scrollLeft
        if (!this.iconNext) {
          scrollLeft -=
            itemWidth * Math.floor(element.clientWidth / itemWidth) +
            (itemWidth - (element.clientWidth % itemWidth))
          element.scrollLeft = scrollLeft
        } else {
          scrollLeft -= itemWidth * Math.floor(element.clientWidth / itemWidth)
          element.scrollLeft = scrollLeft
        }
        if (scrollLeft <= 0) {
          this.iconBack = false
        }
        this.iconNext = true
      }
      this.disabledIconButton = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/_variables.scss';

.slide {
  position: relative;
  /* width: 100%; */
  /* height: 100%; */
  /* padding: 5px 5px; */
  background: $breadcrumbBgrColor;
  &__icon-container {
    font-size: 40px;
    color: $red;
  }
  .icon {
    position: absolute;
    height: 40px;
    opacity: 0.7;
  }
  .icon-back {
    left: 12px;
    top: 20%;
  }
  .icon-next {
    right: 12px;
    top: 20%;
  }
}
#list-scroll {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  scroll-behavior: smooth;
  /* width: fit-content; */
  /* height: 100%; */
}
.scroll-item {
  padding: 5px;
  display: flex;
  /* background-color: $breadcrumbBgrColor; */

  .item {
    /* width: 100%;
    height: 100%; */
    display: flex;
    overflow: hidden;
    justify-content: center;
  }
  .item.selected {
    border: 1px solid $red;
  }
}
.slide.image {
  .item {
    cursor: pointer;
  }
  .scroll-item:hover {
    transform: scale(1.1);
  }
}
</style>
