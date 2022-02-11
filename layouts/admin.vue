<template>
  <div>
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
    <div v-if="loadingState" class="loading">
      <div class="icon-container">
        <i class="fas fa-wine-glass-alt"></i>
        <i class="fas fa-wine-glass"></i>
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
  middleware: ['auth', roleGuard(['ADMIN', 'STAFF'])],
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
    loadingState() {
      return this.$store.state.loadingState
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
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.7;
  background-size: cover;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;

  .icon-container {
    color: $white;
    font-size: 70px;
    .fas {
      position: absolute;
    }
    .fa-wine-glass {
      animation-name: loading;
      animation-iteration-count: infinite;
      animation-duration: 2s;
      color: yellow;
    }
  }
}

@keyframes loading {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
