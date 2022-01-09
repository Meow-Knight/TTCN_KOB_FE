<template>
  <div class="cart-page-container">
    <div class="header">GIỎ HÀNG</div>
    <div v-if="cart.loadingState" class="initial-loading">Loading ...</div>
    <div v-else-if="!cart.items.length" class="no-item">
      <div class="no-item-text">Giỏ hàng của bạn còn trống</div>
      <nuxt-link to="/" class="no-item-link">Mua ngay</nuxt-link>
    </div>
    <div v-else class="outer-container">
      <div class="cart-content-container">
        <div class="cart-content-header">
          <div class="name-column placeholder">Sản phẩm</div>
          <div class="price-column placeholder">Đơn giá</div>
          <div class="amount-column placeholder">Số lượng</div>
          <div class="total-column placeholder">Thành tiền</div>
          <div class="action-column placeholder">Thao tác</div>
        </div>
        <div class="cart-items-container">
          <div
            v-for="{ id, beer, amount } in cart.items"
            :key="id"
            class="item-card-container"
          >
            <div class="item-info">
              <nuxt-link class="item-image-wrapper" :to="getBeerURL(beer.id)">
                <img
                  :src="beer.photo || require('~/assets/img/logo3.png')"
                  class="item-image"
                />
              </nuxt-link>
              <nuxt-link :to="getBeerURL(beer.id)" class="item-name">{{
                beer.name
              }}</nuxt-link>
            </div>
            <div class="item-price">
              <div class="origin-price">
                {{ priceFormat(beer.price) + 'đ' }}
              </div>
              <div class="after-discount">
                {{
                  priceFormat(
                    afterDiscount(beer.price, beer.discount_percent)
                  ) + 'đ'
                }}
              </div>
            </div>
            <div class="item-amount-wrapper">
              <div class="amount-button-wrapper">
                <button
                  class="change-amount-button"
                  @click="
                    updateItem({
                      beer: beer.id,
                      amount: amount - 1,
                      recordId: id,
                    })
                  "
                >
                  -
                </button>
              </div>
              <input
                type="text"
                class="item-amount-input"
                :value="amount"
                @input="validateInput($event, amount)"
                @blur="handleConfirmInput($event, beer.id, amount, id)"
              />
              <div class="amount-button-wrapper">
                <button
                  class="change-amount-button"
                  @click="
                    updateItem({
                      beer: beer.id,
                      amount: amount + 1,
                      recordId: id,
                    })
                  "
                >
                  +
                </button>
              </div>
            </div>
            <div class="total-price">
              {{
                priceFormat(
                  afterDiscount(beer.price, beer.discount_percent) * amount
                ) + 'đ'
              }}
            </div>
            <div class="item-action" @click="removeItem({ recordId: id })">
              Xóa khỏi giỏ hàng
            </div>
          </div>
        </div>
      </div>
      <div class="separate-zone"></div>
      <div class="checkout-panel">
        <div class="row total-before-discount">
          <div class="text">Tổng giá</div>
          <div class="value">{{ priceFormat(totalPrice) + 'đ' }}</div>
        </div>
        <div class="row total-saving">
          <div class="text">Tiết kiệm</div>
          <div class="value">{{ priceFormat(totalSaving) + 'đ' }}</div>
        </div>
        <div class="row total-after-discount">
          <div class="text">Tổng thanh toán</div>
          <div class="value">{{ priceFormat(totalAfterDiscount) + 'đ' }}</div>
        </div>
        <button class="checkout-button" @click="$router.push('/user/checkout')">
          Đặt hàng
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { priceFormat, afterDiscount } from '~/helper/helper'
export default {
  layout: 'user',
  data() {
    return {
      cart: this.$store.state.cart,
    }
  },
  computed: {
    totalPrice() {
      return this.cart.items.reduce(
        (prev, cur) => prev + cur.amount * cur.beer.price,
        0
      )
    },
    totalAfterDiscount() {
      return this.cart.items.reduce(
        (prev, cur) =>
          prev +
          afterDiscount(cur.beer.price, cur.beer.discount_percent) * cur.amount,
        0
      )
    },
    totalSaving() {
      return this.totalAfterDiscount - this.totalPrice
    },
  },
  methods: {
    priceFormat,
    afterDiscount,
    getBeerURL(beerId) {
      return '/beers/' + beerId
    },
    ...mapActions({
      removeItem: 'cart/removeItem',
      updateItem: 'cart/updateItem',
      getCartData: 'cart/getCartData',
    }),
    validateInput(event, prevAmount) {
      event.target.value = event.target.value.trim()
      const parseNumber = +event.target.value
      if (Number.isNaN(parseNumber) || parseNumber < 0) {
        event.target.value = event.target.value.slice(0, -1)
      }
    },
    handleConfirmInput(event, beerId, amount, recordId) {
      // input is blank, reset data
      if (event.target.value === '') {
        event.target.value = amount
        return
      }
      // data not change
      if (amount === +event.target.value) return
      // dispatch update action
      this.updateItem({ beer: beerId, amount: event.target.value, recordId })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.cart-page-container {
  width: 100%;
  max-width: none;
  height: fit-content;
  min-height: 70vh;
  padding: 20px 0 0 0;
  background: $white;
}

.header {
  margin: auto 20px;
  font-size: 25px;
  font-weight: 500;
  padding: 15px 0;
  border-bottom: 1px solid rgb(230, 219, 219);
  height: 80px;
}

.no-item {
  width: fit-content;
  height: fit-content;
  margin: 30px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.no-item-text {
  font-size: 25px;
  margin-bottom: 20px;
}

.no-item-link {
  text-decoration: none;
  padding: 10px 15px;
  background: $red;
  color: $white2;
  border-radius: 3px;
}

.initial-loading {
  text-align: center;
  margin-top: 20px;
}

.cart-content-container {
  padding: 0 20px;
  position: relative;
}

.cart-content-header {
  display: grid;
  grid-template-columns: 3fr 1.5fr 1.2fr 1fr 1.5fr;
  justify-items: center;
  margin-bottom: 30px;
  .placeholder {
    width: 100%;
    text-align: center;
    border: 1px solid #e6dbdb;
    border-top: none;
  }
}

.item-card-container {
  display: grid;
  grid-template-columns: 3fr 1.5fr 1.2fr 1fr 1.5fr;
  align-items: center;
  margin-bottom: 50px;
}

.item-info {
  display: flex;
}

.item-image-wrapper {
  width: 20%;
  padding-bottom: 20%;
  position: relative;
}

.item-image {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid $red;
}

.item-name {
  width: calc(70%);
  text-decoration: none;
  color: $black;
  font-weight: 500;
  line-height: 20px;
  max-height: 40px;
  margin-left: 5%;
  -webkit-box-orient: vertical;
  display: inline-block;
  overflow: hidden !important;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-font-smoothing: antialiased;
  display: -webkit-box;
}

.item-price {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: auto;
}

.origin-price {
  text-decoration: line-through;
}

.after-discount {
  color: $red;
  font-weight: 500;
}

.item-amount-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  height: fit-content;
}

.amount-button-wrapper {
  width: 100%;
  padding-bottom: 100%;
  position: relative;
}

.change-amount-button {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border: 0.5px solid rgb(173, 161, 161);
  background: $white;
  cursor: pointer;
}

.change-amount-button:hover {
  background: rgb(207, 78, 78);
  color: $white;
}

.item-amount-input {
  width: 100%;
  text-align: center;
  background: $white;
  border: 0.5px solid rgb(173, 161, 161);
  border-width: thin;
}

.item-amount-input:focus {
  outline: none;
  border: 1px solid rgb(95, 92, 92);
}

.total-price {
  text-align: center;
  color: $red;
  font-weight: 500;
}

.item-action {
  text-align: center;
  cursor: pointer;
  color: $red;
  font-weight: 500;
}

.separate-zone {
  width: 100%;
  height: 30px;
  background: $white2;
}

.checkout-panel {
  width: 100%;
  height: fit-content;
  background: $white;
  position: sticky;
  bottom: 0;
  z-index: 20;
  padding: 15px 40px;
}

.checkout-panel::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 0;
  height: 45px;
  width: 100%;
  background: linear-gradient(transparent, $white2);
}

.checkout-panel {
  .row {
    display: flex;
    width: 30%;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 10px auto;
  }
  .total-after-discount {
    color: $red;
    font-size: 20px;
    font-weight: 500;
  }
}

.checkout-button {
  display: block;
  margin: 0 0 0 auto;
  padding: 10px 20px;
  color: $white;
  background: $red;
  border-radius: 3px;
  border: none;
  cursor: pointer;
}
</style>
