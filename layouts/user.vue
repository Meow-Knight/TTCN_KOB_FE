<template>
  <div class="whole">
    <NavBar :transparent="transparent" />
    <div class="container">
      <side-bar-user class="side-bar"></side-bar-user>
      <Nuxt />
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import NavBar from '~/components/NavBar.vue'
import Footer from '~/components/Footer.vue'
import SideBarUser from '~/components/SideBarUser.vue'
import { roleGuard } from '~/helper/helper'
export default {
  components: {
    NavBar,
    Footer,
    SideBarUser,
  },
  provide() {
    return {
      setIsInErrorPage: this.setIsInErrorPage,
    }
  },
  middleware: ['auth', roleGuard('CUSTOMER')],
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
  async created() {
    // we will fetch cart data here
    // const response = await this.$axios.get('/cart')
    // this.setCartData(response.data.cart)
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
    ...mapMutations({
      setCartData: 'cart/setCartData',
    }),
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/_variables.scss';
.whole {
  position: relative;
  background: $white2;
}

.container {
  display: flex;
  height: 100%;
  max-width: none;
  width: 100%;
  padding-top: 50px;
  margin-bottom: 150px;
}

.side-bar {
  margin: 20px 30px 0 105px;
}
</style>
