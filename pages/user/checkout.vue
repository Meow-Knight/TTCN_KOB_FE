<template>
  <div>
    <div v-if="initialLoading" class="initial-loading">Loading ...</div>
    <div v-else-if="!cart.length" class="no-checkout-items">
      Bạn không có sản phẩm nào để thanh toán
    </div>
    <div v-else class="checkout">
      <div class="checkout-header">THANH TOÁN</div>
      <div class="checkout-address">
        <div class="address-header">
          <svg
            height="15"
            viewBox="0 0 15 15"
            width="15"
            class="address-icon"
            fill="currentColor"
          >
            <path
              d="M6 3.2c1.506 0 2.727 1.195 2.727 2.667 0 1.473-1.22 2.666-2.727 2.666S3.273 7.34 3.273 5.867C3.273 4.395 4.493 3.2 6 3.2zM0 6c0-3.315 2.686-6 6-6s6 2.685 6 6c0 2.498-1.964 5.742-6 9.933C1.613 11.743 0 8.498 0 6z"
              fill-rule="evenodd"
            ></path>
          </svg>
          <div class="header-text">Địa chỉ giao hàng</div>
        </div>
        <div class="address-content">
          <div class="receiver-info">
            <div class="input-row">
              <label for="receiver-phone">Số điện thoại</label>
              <input v-model="receiverInfo.phone" type="text" />
            </div>
          </div>
          <div class="receiver-address">
            <div class="address">
              <label for="detail-address" class="detail-address-label"
                >Địa chỉ chi tiết:
              </label>
              <input
                v-model="receiverInfo.address"
                type="text"
                class="detail-address-input"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="checkout-items-container">
        <div class="header">
          <div>Sản phẩm</div>
          <div>Đơn giá</div>
          <div>Số lượng</div>
          <div>Thành tiền</div>
        </div>
        <div class="items-container">
          <div
            v-for="{ id, amount, beer } in cart"
            :key="id"
            class="item-card-container"
          >
            <div class="item-info">
              <div class="img-wrapper">
                <img
                  class="item-image"
                  :src="beer.photo || require('~/assets/img/logo3.png')"
                  alt="Beer image"
                />
              </div>
              <div class="item-name">{{ beer.name }}</div>
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
            <div class="item-amount">{{ amount }}</div>
            <div class="total-price">
              {{
                priceFormat(
                  afterDiscount(beer.price, beer.discount_percent) * amount
                ) + 'đ'
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="checkout-panel">
        <div class="total-price-text">
          Tổng số tiền ({{ cart.length }} sản phẩm):
        </div>
        <div class="total-after-discount">
          {{ priceFormat(totalPrice) + 'đ' }}
        </div>
        <button class="confirm-button" @click="confirmCheckout()">
          Xác nhận mua hàng
        </button>
      </div>
    </div>
    <base-dialog
      v-if="notification.title"
      :title="notification.title"
      :need-confirm="notification.needConfirm"
      @close="confirmNotification"
    >
      <template #default>
        <h3>
          {{ notification.message }}
        </h3>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import { roleGuard, priceFormat, afterDiscount } from '~/helper/helper'
import UserPageDropdown from '~/components/UserPageDropdown'
import BaseDialog from '~/components/Modal/BaseDialog.vue'
export default {
  components: { BaseDialog },
  layout: 'default',
  middleware: ['auth', roleGuard('user')],
  component: {
    UserPageDropdown,
    BaseDialog,
  },
  data() {
    return {
      cart: [],
      receiverInfo: {
        phone: '',
        address: '',
      },
      initialLoading: true,
      isInitialAddress: true,
      notification: {
        title: null,
        message: null,
        needConfirm: null,
      },
    }
  },
  computed: {
    totalAfterDiscount() {
      return this.cart.reduce(
        (prev, cur) =>
          prev +
          afterDiscount(cur.beer.price, cur.beer.discount_percent) * cur.amount,
        0
      )
    },
    checkoutApiURL() {
      return '/api/v1/order/checkout'
    },
    createOrderApiURL() {
      return '/api/v1/order/create_order'
    },
    orderDetailURL() {
      return '/user/purchase/'
    },
  },
  async created() {
    // fetch checkout data goes here
    const {
      data: {
        carts,
        user,
        total_price: totalPrice,
        total_discount: totalDiscount,
      },
    } = await this.$axios.get(this.checkoutApiURL)
    this.cart = carts
    this.receiverInfo = {
      phone: user.phone,
      address: user.address,
    }
    this.totalPrice = totalPrice
    this.totalDiscount = totalDiscount
    this.initialLoading = false
  },
  methods: {
    priceFormat,
    afterDiscount,
    confirmNotification() {
      this.notification = {
        ...this.notification,
        title: null,
        message: null,
      }
      // this.
    },
    async confirmCheckout() {
      if (this.receiverInfo.address === '' || this.receiverInfo.phone === '') {
        return (this.notification = {
          ...this.notification,
          title: 'Lỗi',
          message: 'Vui lòng nhập đầy đủ số điện thoại và địa chỉ',
          needConfirm: true,
        })
      }
      try {
        const response = await this.$axios.post(this.createOrderApiURL, {
          shipping_address: this.receiverInfo.address,
          shipping_phone: this.receiverInfo.phone,
          total_price: this.totalPrice,
          total_discount: this.totalDiscount,
          carts: this.cart.map((item) => ({
            amount: item.amount,
            beer: item.beer.id,
          })),
        })
        // show notification
        this.notification = {
          ...this.notification,
          title: 'Thành công',
          message: 'Đặt hàng thành công',
        }
        // flush cart data
        this.$store.commit('cart/setCartData', [])
        // after 3s hide notification and redirect to order detail page
        setTimeout(() => {
          this.confirmNotification()
          this.$router.push(this.orderDetailURL + response.data.id)
        }, 3000)
      } catch (err) {
        console.log(err.response || err)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.initial-loading {
  width: 100%;
  min-height: 100vh;
  text-align: center;
  padding: 20px 130px;
}

.no-checkout-items {
  width: 100%;
  min-height: 100vh;
  text-align: center;
  padding: 20px 130px;
  font-size: 25px;
}

.checkout {
  width: 100%;
  min-height: 100vh;
  text-align: center;
  padding: 20px 130px;
}

.checkout-header {
  width: 100%;
  text-align: left;
  font-size: 25px;
  font-weight: 500;
  padding: 10px 20px;
  background: $white2;
  color: $red;
}

.checkout-address {
  height: fit-content;
  width: 100%;
  padding: 10px 20px;
  background: $white2;
  margin-top: 30px;
}

.address-header {
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: space-between;
}

.address-icon {
  color: $red;
  margin-right: 10px;
}

.header-text {
  font-size: 25px;
  color: $red;
}

.address-content {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1.2fr 3fr;
  align-items: center;
  justify-items: center;
}

.receiver-info {
  width: 100%;
  height: fit-content;
  div {
    text-align: left;
    height: fit-content;
    padding: 0 10px;
    height: 35px;
  }
  .input-row {
    padding: 0;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}

.receiver-address {
  height: 100%;
  width: 100%;
  text-align: center;
}

.address {
  height: 100%;
  width: 100%;
  display: flex;
  .dropdown {
    height: 35px;
    background: $white;
  }
}

.detail-address-label {
  width: 15%;
  margin-left: 10%;
}

.detail-address-input {
  width: 70%;
  margin-left: 5%;
}

label {
  padding: 0;
  margin: 0;
  height: 35px;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
}

input {
  padding: 5px 10px;
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 3px;
  height: 35px;
}

input:focus {
  outline: none;
  border: 1px solid rgba(0, 0, 0, 0.6);
}

.checkout-items-container {
  margin-top: 30px;
  padding: 10px 20px;
  height: fit-content;
  background: $white2;
  .header {
    display: grid;
    grid-template-columns: 2.5fr 1fr 1fr 1fr;
    div {
      border: 1px solid rgba(0, 0, 0, 0.14);
    }
  }
}

.item-card-container {
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr 1fr;
  margin-top: 40px;

  .item-info {
    width: 100%;
    height: 100%;
    display: flex;
    .img-wrapper {
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
    }
    .item-name {
      width: calc(75%);
      margin-left: 5%;
      text-align: left;
      font-weight: 500;
      line-height: 20px;
      max-height: 40px;
      -webkit-box-orient: vertical;
      display: inline-block;
      overflow: hidden !important;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-font-smoothing: antialiased;
      display: -webkit-box;
    }
  }

  .item-price {
    display: flex;
    padding: 0 5%;
    justify-content: space-around;

    .origin-price {
      text-decoration: line-through;
    }
    .after-discount {
      font-weight: 500;
      color: $red;
    }
  }

  .total-price {
    font-weight: 500;
    color: $red;
  }
}

.checkout-panel {
  height: fit-content;
  padding: 10px 20px;
  margin: 30px 0;
  background: $white2;
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr 1fr;

  .total-price-text {
    grid-column-start: 3;
    grid-column-end: 4;
    height: fit-content;
    margin: auto;
  }

  .total-after-discount {
    grid-column-start: 4;
    grid-column-end: 5;
    font-size: 30px;
    font-weight: 500;
    color: $red;
  }

  .confirm-button {
    grid-column-start: 4;
    grid-column-end: 5;
    height: fit-content;
    width: 80%;
    padding: 10px;
    margin: 20px auto;
    border: none;
    border-radius: 3px;
    background: $red;
    color: $white;
  }
}
</style>
