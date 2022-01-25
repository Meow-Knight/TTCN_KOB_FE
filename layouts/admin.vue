<template>
  <div>
    <NavBar :transparent="transparent" />
    <div class="container-fluid">
      <div class="admin-layout-container">
        <div class="left">
          <SidebarAdmin class="side-bar"></SidebarAdmin>
        </div>
        <div class="right">
          <Nuxt />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import NavBar from '~/components/NavBar.vue'
import SidebarAdmin from '~/components/SidebarAdmin.vue'
import { roleGuard } from '~/helper/helper'
export default {
  components: {
    NavBar,
    SidebarAdmin,
  },
  provide() {
    return {
      setIsInErrorPage: this.setIsInErrorPage,
    }
  },
  middleware: ['auth', roleGuard('ADMIN')],
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

.container {
  display: flex;
  height: 100%;
  max-width: none;
  width: 100%;
  padding-top: 50px;
  margin-bottom: 150px;
}
.admin-layout-container {
  display: flex;
  flex-direction: row;
  .left {
    width: 300px !important;
  }
  .right {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}
</style>
