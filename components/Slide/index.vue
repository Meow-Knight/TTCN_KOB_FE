<template>
  <div class="slide">
    <div id="list-scroll">
      <div v-for="(item, index) in items" :key="index" class="scroll-item">
        <div class="img">
          <img :src="item.img" alt="" />
        </div>
        <slot></slot>
      </div>
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
  props: ['items', 'itemHeight', 'itemWidth'],
  data() {
    return {
      disabledIconButton: false, // prevent click 2 sequently times
      iconBack: false,
      iconNext: true,
    }
  },
  created() {},
  beforeMount() {
    // set width and height for all scroll item
    const scrollItems = document.getElementsByClassName('scroll-item')
    for (let index = 0; index < scrollItems.length; index++) {
      scrollItems[index].style.height = this.itemHeight
      scrollItems[index].style.width = this.itemWidth
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
    top: 50%;
  }
  .icon-next {
    right: 12px;
    top: 50%;
  }
}
#list-scroll {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  scroll-behavior: smooth;
  margin: 30px;

  .scroll-item {
    margin-right: 10px;
    padding: 10px;
    display: flex;
    background-color: $breadcrumbBgrColor;

    .img {
      width: 100%;
      height: 60%;
      display: flex;
      overflow: hidden;
      justify-content: center;
    }
  }
}
</style>