<template>
  <div class="cart-container">
    <div v-if="cartItems.length" class="cart-content">
      <div class="header">Giỏ hàng của bạn</div>
      <div v-if="cartItems.length" class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="item">
          <!-- <nuxt-link :to="getBeerURL(item.id)"> -->
          <div class="item-img">
            <nuxt-link :to="getBeerURL(item.id)">
              <img :src="item.photo" width="75px" height="75px" />
            </nuxt-link>
          </div>

          <!-- </nuxt-link> -->
          <div class="item-name-wrapper">
            <nuxt-link :to="getBeerURL(item.id)" class="item-name">
              {{ item.name }} motherfucker what are you doung
            </nuxt-link>
          </div>
          <span class="item-price">{{ priceFormat(item.price) + 'đ' }}</span>
          <div class="action">
            <button>+</button>
            <button>-</button>
          </div>
        </div>
      </div>
      <button v-if="cartItems.length" class="to-detail">
        Chi tiết giỏ hàng
      </button>
    </div>
    <div v-else class="no-item">Chưa có sản phẩm</div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { priceFormat } from '~/helper/helper'
export default {
  computed: {
    cartItems() {
      console.log(this.$store.state.cart.items)
      return this.$store.state.cart.items
    },
  },
  methods: {
    ...mapMutations({
      changeCartAfterMutate: 'cart/changeCartAfterMutate',
    }),
    priceFormat,
    getBeerURL(beerID) {
      return '/beers/' + beerID
    },
  },
  mounted() {
    document
      .querySelector('.cart-container')
      .addEventListener('mouseover', (event) => {
        console.log(event.target)
      })
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.cart-container {
  /* z-index: 500; */
  padding: 15px 15px;
  height: fit-content;
  width: fit-content;
  background: $white;
  border: 1px solid rgb(143, 129, 129);
  border-radius: 5px;
  box-shadow: 0 0 20px 0.2px rgba(0, 0, 0, 0.4);
  font-family: sans-serif;
  /* display: flex; */
  position: relative;
}

.cart-container::before {
  position: absolute;
  content: '';
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  transform: rotate(45deg) translateX(50%);
  background: $white;
  border-top: 1px solid rgb(143, 129, 129);
  border-left: 1px solid rgb(143, 129, 129);
  top: -18px;
  right: 115px;
}

.cart-content {
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: 350px;
  width: 600px;
}

.header {
  text-align: start;
  font-size: 30px;
  /* margin-bottom: 10px; */
}

.cart-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 200px;
  /* padding: 10px 0 0 10px; */
  /* margin-bottom: 20px; */
}

.item {
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
  height: fit-content;
  width: 100%;
  /* margin-bottom: 10px; */
}

.item-img {
  height: 0;
  padding-bottom: 15%;
  width: 15%;
  img {
    border: 1px solid $red;
  }
}

.item-name-wrapper {
  width: calc(45%);
}

.item-name {
  padding: 0 10px;
  font-size: 16px;
  width: calc(100%);
  line-height: 25px;
  max-height: 25px;
  -webkit-box-orient: vertical;
  overflow: hidden !important;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-font-smoothing: antialiased;
  display: -webkit-box;
}

.item-price {
  color: $red;
  width: 15%;
}

.action {
  display: flex;
  /* align-items: center; */
  justify-content: space-evenly;
  width: 20%;
  button {
    height: 30px;
    width: 30px;
  }
}

.to-detail {
  margin-left: auto;
  margin-right: 0;
  padding: 10px 20px;
}

.no-item {
  width: 400px;
  height: fit-content;
  padding: 50px 50px;
  font-size: 30px;
  font-weight: 500;
  text-align: center;
}

a {
  text-decoration: none;
  color: $black;
}

button {
  border: none;
  background: #f0ebeb;
  color: $red;
  transition: 0.3s;
}

button:hover {
  background: $red;
  color: $white2;
  transition: 0.3s;
}
</style>
