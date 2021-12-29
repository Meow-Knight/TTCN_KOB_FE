<template>
  <with-loading :is-loading="isLoading"
    ><div class="container">
      <section class="slider">
        <img src="~assets/img/homepage-top-banner.jpg" class="top-image" />
      </section>
      <section class="main-content">
        <section class="home-policy"></section>
        <section class="random-product">
          <div class="title">SẢN PHẨM GỢI Ý</div>
          <beer-collection :beers="randoms"></beer-collection>
        </section>
        <section class="home-banner"></section>
        <section v-if="discounts.length" class="home-collection">
          <div class="title">SIÊU ƯU ĐÃI TỪ KING OF BEERS</div>
          <div class="discount-event">
            <button
              v-for="discount in discounts"
              :key="discount.id"
              class="discount-button"
              :class="{ selected: discount.id === selectedButton }"
              @click="changeDiscount(discount.id)"
            >
              {{ discount.name }}
            </button>
          </div>
          <div class="discount-collection">
            <beer-collection :beers="selectedDiscount.beers"></beer-collection>
            <div class="veil" :class="{ active: showVeil }"></div>
          </div>
        </section>
      </section></div
  ></with-loading>
</template>

<script>
import BeerCollection from '../components/BeerCollection.vue'
import WithLoading from '../components/HOC/withLoading.vue'
export default {
  components: {
    BeerCollection,
    WithLoading,
  },
  layout: 'default',
  data() {
    return {
      randoms: [],
      discounts: [],
      isLoading: true,
      selectedDiscount: null,
      selectedButton: null,
      showVeil: false,
    }
  },
  computed: {
    user() {
      return this.$auth.user
    },
  },
  async created() {
    if (this.user && this.user.is_staff) {
      return this.$router.push('/dashboard')
    }
    const URL = '/beer/homepage'
    if (process.client) {
      const authToken = localStorage.getItem('auth._token.google')
      try {
        const {
          data: { randoms, discounts },
        } = await this.$axios.get(`/api/v1${URL}?random_amount=16`, {
          headers: { Authorization: authToken },
        })
        this.isLoading = false
        this.randoms = randoms
        this.discounts = discounts
        this.selectedDiscount = discounts[0]
        this.selectedButton = discounts[0]?.id
      } catch (err) {
        console.log(err)
      }
    }
  },
  methods: {
    // change selected discount
    // we want a better "disappear and reappear" animation; this solution
    // below just delay resources loading until is "disappear"
    changeDiscount(discountId) {
      this.selectedButton = discountId
      this.showVeil = true
      setTimeout(() => {
        this.selectedDiscount = this.discounts.find(
          (discount) => discount.id === discountId
        )
      }, 500)
      setTimeout(() => {
        this.showVeil = false
      }, 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/_variables.scss';
h1 {
  color: $red;
}
.container {
  width: 100%;
  margin: 0;
  padding: 0 0 40px 0;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(245, 245, 245);
}
.slider {
  height: 90px;
  margin-bottom: 300px;
  width: 100%;
  position: relative;
}
.top-image {
  position: absolute;
  top: 0px;
  left: 0;
  height: 400px;
  width: 100%;
}
.main-content {
  margin-top: 30px;
  width: 90%;
}
.random-product {
  width: 100%;
}

.title {
  font-weight: 600;
  font-size: 30px;
  text-align: center;
  position: relative;
  margin-bottom: 40px;
  margin-top: 40px;
}

.title::after {
  position: absolute;
  content: '';
  width: 20%;
  height: 2px;
  background: $black;
  bottom: -5px;
  left: 40%;
}

.discount-event {
  padding: 0 20%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-bottom: 40px;
}

.discount-button {
  cursor: pointer;
  padding: 5px 20px;
  border: none;
  font-weight: 500;
  font-size: 20px;
}

.discount-collection {
  position: relative;
}

.veil {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgb(245, 245, 245);
  opacity: 0;
  z-index: -10;
}
.veil.active {
  z-index: 20;
  animation: showAndHideVeil 1s;
  animation-timing-function: linear;
}
.discount-button {
  transition: 0.2s ease-in-out;
}
.discount-button:hover {
  background: $red;
  color: $white;
}
.discount-button.selected {
  background: $red;
  color: $white;
  transition: 0.2s;
}

@keyframes showAndHideVeil {
  0% {
    opacity: 0;
  }

  10% {
    opacity: 0.2;
  }
  20% {
    opacity: 0.4;
  }
  30% {
    opacity: 0.6;
  }
  40% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  60% {
    opacity: 0.8;
  }
  70% {
    opacity: 0.6;
  }
  80% {
    opacity: 0.4;
  }
  90% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
  }
}
</style>
