<template>
  <div class="whole">
    <NavBar :transparent="transparent" />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import NavBar from '~/components/NavBar.vue'
import Footer from '~/components/Footer.vue'
export default {
  components: {
    NavBar,
    Footer,
  },
  provide() {
    return {
      setIsInErrorPage: this.setIsInErrorPage,
    }
  },
  data() {
    return {
      transparentNavBar: true,
      isInErrorPage: false,
    }
  },
  computed: {
    transparent() {
      return this.transparentNavBar && !this.isInErrorPage
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    if (!this.isInErrorPage) this.calculateScroll()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    calculateScroll() {
      if (window.scrollY < 100) {
        this.transparentNavBar = true
        return
      }
      this.transparentNavBar = false
    },
    handleScroll() {
      this.calculateScroll()
    },
    setIsInErrorPage(isInErrorPage) {
      this.isInErrorPage = isInErrorPage
    },
  },
}
</script>

<style scoped>
/* * {
  background: rgb(240, 235, 235);
} */
.whole {
  position: relative;
}
</style>
