<template>
  <div class="container">
    <div class="animation">
      <img src="~/assets/gif/404Animation_fff.gif" alt="" />
    </div>
    <div class="text">
      <h1>404 <span>Error</span></h1>
      <h2>
        <span class="typed-text">{{ typeValue }}</span>
        <span class="cursor" :class="{ typing: typeStatus }">&nbsp;</span>
      </h2>
      <button class="button-50" role="button">
        <nuxt-link to="/">Quay lại trang chủ</nuxt-link>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['setIsInErrorPage'],
  layout: 'default',
  data: () => {
    return {
      typeValue: '',
      typeStatus: false,
      typeArray: [
        'Bạn say cmnr!!!',
        'Hoặc là chúng tôi ko có trang này =))))',
        'Hoặc là có thể bạn say thiệt',
      ],
      typingSpeed: 100,
      erasingSpeed: 120,
      newTextDelay: 3800,
      typeArrayIndex: 0,
      charIndex: 0,
    }
  },
  beforeDestroy() {
    this.setIsInErrorPage(false)
  },
  mounted() {
    this.setIsInErrorPage(true)
    setTimeout(this.typeText, this.newTextDelay + 200)
  },
  methods: {
    typeText() {
      if (this.charIndex < this.typeArray[this.typeArrayIndex].length) {
        if (!this.typeStatus) this.typeStatus = true
        this.typeValue += this.typeArray[this.typeArrayIndex].charAt(
          this.charIndex
        )
        this.charIndex += 1
        setTimeout(this.typeText, this.typingSpeed)
      } else {
        this.typeStatus = false
        setTimeout(this.eraseText, this.newTextDelay)
      }
    },
    eraseText() {
      if (this.charIndex > 0) {
        if (!this.typeStatus) this.typeStatus = true
        this.typeValue = this.typeArray[this.typeArrayIndex].substring(
          0,
          this.charIndex - 1
        )
        this.charIndex -= 1
        setTimeout(this.eraseText, this.erasingSpeed)
      } else {
        this.typeStatus = false
        this.typeArrayIndex += 1
        if (this.typeArrayIndex >= this.typeArray.length)
          this.typeArrayIndex = 0
        setTimeout(this.typeText, this.typingSpeed + 1000)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/_variables.scss';
.container {
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
img {
  height: 300px;
  width: fit-content;
}

h1 {
  font-size: 5rem;
  span {
    color: $red;
  }
}
.text {
  margin-left: 0px;
}
h2 {
  font-size: 2.5rem;
  font-weight: normal;
  width: 750px;
  span.typed-text {
    color: $yellow;
    overflow-wrap: break-word;
  }
  span.cursor {
    display: inline-block;
    margin-left: 3px;
    width: 4px;
    background-color: $white2;
    animation: cursorBlink 1s infinite;
  }
  span.cursor.typing {
    animation: none;
  }
}
.animation {
  img {
    pointer-events: none;
  }
}
@keyframes cursorBlink {
  49% {
    background-color: $white2;
  }
  50% {
    background-color: transparent;
  }
  99% {
    background-color: transparent;
  }
}
.button-50 {
  appearance: button;
  background-color: $red;
  background-image: none;
  border: 1px solid $black;
  border-radius: 4px;
  box-shadow: $white2 4px 4px 0 0, $black 4px 4px 0 1px;
  box-sizing: border-box;
  color: $white2;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  margin: 1.5rem 5px 10px 0;
  overflow: visible;
  padding: 12px 40px;
  text-align: center;
  text-transform: none;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  &:focus {
    text-decoration: none;
  }
  &:hover {
    text-decoration: none;
  }
  &:active {
    box-shadow: $black 0 3px 5px inset;
    outline: 0;
  }
  a {
    text-decoration: none;
    color: $white2;
    font-weight: bold;
    font-size: 1rem;
  }
}

.button-50:not([disabled]):active {
  box-shadow: #fff 2px 2px 0 0, $black 2px 2px 0 1px;
  transform: translate(2px, 2px);
}

@media (min-width: 768px) {
  .button-50 {
    padding: 12px 50px;
  }
}
</style>
