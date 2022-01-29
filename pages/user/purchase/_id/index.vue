<template>
  <div v-if="initialLoading" class="initial-loading">Loading...</div>
  <div v-else class="purchase-detail">
    <div class="header">CHI TIẾT ĐƠN HÀNG</div>
    <div class="purchase-detail-content">
      <div class="purchase-status-bar">
        <div class="purchase-id">Mã đơn hàng: {{ orderId }}</div>
        <div class="purchase-status">
          {{ progressMapper[orderStatus].display }}
        </div>
      </div>
      <div
        v-if="orderProgress.length"
        class="purchase-deliver-progress"
        :class="{
          'order-canceled':
            orderProgress.slice(-1)[0].order_status === 'CANCELED',
        }"
      >
        <div
          v-for="progress in orderProgress"
          :key="progress.order_status"
          class="progress-status"
        >
          <div class="icon-wrapper">
            <component
              :is="progressMapper[progress.order_status].component"
              class="status-icon"
            ></component>
          </div>
          <div class="status-display">
            {{ progressMapper[progress.order_status].display }}
          </div>
          <div class="status-time">
            {{ getTimeFormat(progress.updated_at) }}
          </div>
        </div>
        <!-- we will style the progress line base on orderProgress -->
        <div
          v-if="orderProgress.length > 1"
          class="progress-line"
          :style="
            orderProgress.slice(-1)[0].order_status !== 'CANCELED' && {
              padding: `0 ${
                (16 + 20 / 4) * (5 - orderProgress.length) + 11.6
              }% 0 11.6%`,
            }
          "
        >
          <div class="foreground"></div>
        </div>
      </div>
      <div class="purchase-receiver-info">
        <div class="header-text">Thông tin người nhận hàng</div>
        <div class="info-row name">
          <div class="row-title">Tên người nhận</div>
          <div class="row-content">{{ getReceiverFullName }}</div>
        </div>
        <div class="info-row phone">
          <div class="row-title">Số điện thoại</div>
          <div class="row-content">{{ shippingPhone }}</div>
        </div>
        <div class="info-row address">
          <div class="row-title">Địa chỉ</div>
          <div class="row-content">
            {{ shippingAddress }}
          </div>
        </div>
      </div>
      <div class="purchase-items-container">
        <div class="header-category">
          <div>Sản phẩm</div>
          <div>Đơn giá</div>
          <div>Số lượng</div>
          <div>Thành tiền</div>
        </div>
        <div class="items-container">
          <div
            v-for="{
              id,
              amount,
              beer,
              total_price: itemTotalPrice,
            } in orderDetail"
            :key="id"
            class="item-card-container"
          >
            <div class="item-info">
              <nuxt-link class="img-wrapper" :to="getBeerURL(beer.id)">
                <img
                  class="item-image"
                  :src="beer.photo || require('~/assets/img/logo3.png')"
                  alt="Beer image"
                />
              </nuxt-link>
              <nuxt-link class="item-name" :to="getBeerURL(beer.id)">{{
                beer.name
              }}</nuxt-link>
            </div>
            <div class="item-price">
              <div class="origin-price">
                {{ priceFormat(beer.price) + 'đ' }}
              </div>
              <div class="after-discount">
                {{ priceFormat(beer.new_price || beer.price) + 'đ' }}
              </div>
            </div>
            <div class="item-amount">{{ amount }}</div>
            <div class="total-price">
              {{ priceFormat(itemTotalPrice) + 'đ' }}
            </div>
          </div>
        </div>
      </div>
      <div class="price-panel">
        <div class="panel-row">
          <div class="row-title">Tổng tiền hàng</div>
          <div class="row-content">
            {{ priceFormat(totalPrice + totalDiscount) + 'đ' }}
          </div>
        </div>
        <div class="panel-row">
          <div class="row-title">Tiết kiệm</div>
          <div class="row-content saving">
            {{ priceFormat(totalDiscount) + 'đ' }}
          </div>
        </div>
        <div class="panel-row">
          <div class="row-title">Tổng thanh toán</div>
          <div class="row-content after-discount">
            {{ priceFormat(totalPrice) + 'đ' }}
          </div>
        </div>
        <div class="panel-row">
          <div v-if="paymentMethod === 'PAYPAL'" class="payment-status">
            (Bạn đã thanh toán {{ priceFormat(totalPrice) + 'đ' }} qua Paypal)
          </div>
          <div v-if="paymentMethod === 'DIRECT'" class="payment-status">
            (Vui lòng thanh toán {{ priceFormat(totalPrice) + 'đ' }} khi nhận
            hàng)
          </div>
        </div>
      </div>
      <div class="action-panel">
        <button
          v-if="orderStatus === 'PENDING'"
          class="cancel-order"
          @click="cancelOrder"
        >
          Hủy đơn hàng
        </button>
        <button
          v-if="orderStatus === 'DELIVERED'"
          class="items-not-receive"
          @click="notReceivedItems"
        >
          Chưa nhận hàng
        </button>
        <button
          v-if="orderStatus === 'DELIVERED'"
          class="items-received"
          @click="confirmReceivedItems"
        >
          Đã nhận hàng
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
import { priceFormat, afterDiscount, getTimeFormat } from '~/helper/helper'
import ProgressNew from '~/components/SVG/ProgressNew.vue'
import ProgressConfirmed from '~/components/SVG/ProgressConfirmed.vue'
import ProgressDelivering from '~/components/SVG/ProgressDelivering.vue'
import ProgressDelivered from '~/components/SVG/ProgressDelivered.vue'
import ProgressCanceled from '~/components/SVG/ProgressCanceled.vue'
import ProgressCompleted from '~/components/SVG/ProgressCompleted.vue'
import BaseDialog from '~/components/Modal/BaseDialog.vue'
export default {
  components: {
    ProgressNew,
    ProgressConfirmed,
    ProgressDelivering,
    ProgressDelivered,
    ProgressCompleted,
    ProgressCanceled,
    BaseDialog,
  },
  layout: 'user',
  data() {
    return {
      initialLoading: true,
      orderId: null,
      receiverInfo: {
        firstName: null,
        lastName: null,
      },
      orderDetail: [],
      orderStatus: null,
      shippingAddress: null,
      shippingPhone: null,
      totalDiscount: null,
      totalPrice: null,
      paymentMethod: null,
      orderProgress: [],
      progressMapper: {
        PENDING: {
          display: 'Đơn hàng đã đặt',
          component: 'progress-new',
        },
        CONFIRMED: {
          display: 'Đơn hàng đã được xác nhận',
          component: 'progress-confirmed',
        },
        DELIVERING: {
          status: 'DELIVERING',
          display: 'Đơn hàng đang được vận chuyển',
          component: 'progress-delivering',
        },
        DELIVERED: {
          display: 'Đơn hàng đã giao',
          component: 'progress-delivered',
        },
        COMPLETED: {
          display: 'Đơn hàng đã hoàn thành',
          component: 'progress-completed',
        },
        NOTRECEIVED: {
          display: 'Chưa nhận được hàng',
        },
        CANCELED: {
          display: 'Đơn hàng đã hủy',
          component: 'progress-canceled',
        },
      },
      notification: {
        title: null,
        message: null,
        needConfirm: true,
      },
    }
  },
  computed: {
    purchaseDetailURL() {
      return '/api/v1/order/' + this.$router.currentRoute.params.id + '/detail'
    },
    getReceiverFullName() {
      return this.receiverInfo.lastName + ' ' + this.receiverInfo.firstName
    },
    cancelOrderApiURL() {
      return '/api/v1/order/cancel'
    },
    changeOrderStatusApiURL() {
      return '/api/v1/order/user_change_order_status'
    },
  },
  async created() {
    try {
      await this.fetchOrderData()
    } catch (err) {
      if (err.response) throw err
    }
  },
  methods: {
    async fetchOrderData() {
      // try {
      const {
        data: { detail },
      } = await this.$axios.get(this.purchaseDetailURL)
      this.orderId = detail.id || 'Default ID'
      this.receiverInfo = {
        firstName: detail.account.first_name || 'Default First',
        lastName: detail.account.last_name || 'Default Last',
      }
      this.orderDetail = detail.order_detail || []
      this.orderStatus = detail.order_status || 'Default status'
      this.shippingAddress = detail.shipping_address || 'Default address'
      this.shippingPhone = detail.shipping_phone || 'Default phone'
      this.totalDiscount = detail.total_discount || 0
      this.totalPrice = detail.total_price || 'Default price'
      // cut out not-received progress
      const progress = [...detail.progress]
      const index = progress.findIndex(
        ({ order_status: status }) => status === 'NOTRECEIVED'
      )
      if (index >= 0) {
        progress.splice(
          index,
          progress.slice(-1)[0].order_status === 'COMPLETED'
            ? progress.length - 1 - index
            : progress.length - index
        )
      }
      this.orderProgress = progress
      this.paymentMethod = detail.payment_method
      this.initialLoading = false
      // } catch (error) {
      //   console.log(error.response || error)
      //   if (error.response) throw error
      // }
    },
    priceFormat,
    afterDiscount,
    getTimeFormat,
    getBeerURL(beerId) {
      return '/beers/' + beerId
    },
    async cancelOrder() {
      try {
        const { data } = await this.$axios.put(this.cancelOrderApiURL, {
          id: this.orderId,
        })
        if (data?.detail?.success) {
          await this.fetchOrderData()
          return (this.notification = {
            ...this.notification,
            title: 'Thành công',
            message: 'Hủy đơn hàng thành công',
          })
        }
        this.notification = {
          ...this.notification,
          title: 'Thất bại',
          message: 'Hủy đơn hàng thất bại',
        }
      } catch (err) {
        console.log(err)
      }
    },
    async notReceivedItems() {
      try {
        const { data } = await this.$axios.put(this.changeOrderStatusApiURL, {
          id: this.orderId,
          key_change: 'NOTRECEIVED',
        })
        if (data?.detail?.success) {
          await this.fetchOrderData()
          return (this.notification = {
            ...this.notification,
            title: 'Thành công',
            message: 'Xác nhận thành công',
          })
        }
        this.notification = {
          ...this.notification,
          title: 'Thất bại',
          message: 'Xác nhận thất bại',
        }
      } catch (err) {
        console.log(err)
      }
    },
    async confirmReceivedItems() {
      try {
        const { data } = await this.$axios.put(this.changeOrderStatusApiURL, {
          id: this.orderId,
          key_change: 'COMPLETED',
        })
        if (data?.detail?.success) {
          await this.fetchOrderData()
          return (this.notification = {
            ...this.notification,
            title: 'Thành công',
            message: 'Xác nhận thành công',
          })
        }
        this.notification = {
          ...this.notification,
          title: 'Thất bại',
          message: 'Xác nhận thất bại',
        }
      } catch (err) {
        console.log(err)
      }
    },
    confirmNotification() {
      this.notification = { ...this.notification, title: null, message: null }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.initial-loading {
  width: 100%;
  min-height: 100vh;
  padding: 20px 25px;
  background: $white;
  text-align: center;
  margin-top: 30px;
}

.purchase-detail {
  width: 100%;
  max-width: none;
  height: fit-content;
  min-height: 100vh;
  padding: 20px 25px;
  background: $white;
}

.header {
  margin: auto 0;
  font-size: 25px;
  font-weight: 500;
  padding: 15px 0px;
  border-bottom: 1px solid rgb(230, 219, 219);
  height: 80px;
}

.purchase-status-bar {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-top: none;
  padding: 10px;
  display: flex;
  justify-content: flex-end;
}

.purchase-id {
  margin-right: 15px;
  padding-right: 15px;
  border-right: 1px solid black;
  width: fit-content;
}

.purchase-status {
  color: $red;
}

.purchase-deliver-progress {
  margin-top: 30px;
  border: 1px solid rgba(0, 0, 0, 0.09);
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  column-gap: calc(20% / 4);
  position: relative;
  overflow: hidden;

  .progress-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    aspect-ratio: 1/1.2;
    padding: 10% 5%;

    .icon-wrapper {
      box-sizing: border-box;
      width: 50%;
      aspect-ratio: 1/1;
      border: 3px solid $red;
      border-radius: 50%;
      padding: 10%;
      background: $white;
      z-index: 5;
    }

    .status-icon {
      width: 100%;
      height: 100%;
      stroke: $red;
    }

    .status-display {
      height: 30%;
      padding: 5px 0;
      text-align: center;
    }

    .status-time {
      height: 10%;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
    }
  }

  .progress-line {
    position: absolute;
    top: 25%;
    left: 0;
    padding: 0 14%;
    width: 100%;
    height: 3px;
    background: transparent;

    .foreground {
      height: 100%;
      width: 100%;
      background: $red;
      animation: progress-line 1s ease;
    }
  }
}

.purchase-deliver-progress.order-canceled {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .progress-status {
    width: 20%;
    padding: 2%;
  }
}

.purchase-receiver-info {
  margin-top: 30px;
  padding: 20px;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.09);
  display: flex;
  flex-direction: column;

  .header-text {
    text-align: left;
    font-size: 1.25rem;
    font-weight: 500;
    padding-bottom: 30px;
  }

  .info-row {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 0 5%;
    .row-title {
      width: 20%;
    }
    .row-content {
      width: 70%;
      margin: 0 5%;
    }
  }
}

.purchase-items-container {
  border: 1px solid rgba(0, 0, 0, 0.09);
  margin-top: 30px;
  padding: 20px;
  height: fit-content;
  background: $white;
  .header-category {
    display: grid;
    grid-template-columns: 2.5fr 1fr 1fr 1fr;
    div {
      border: 1px solid rgba(0, 0, 0, 0.14);
      text-align: center;
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

    a {
      text-decoration: none;
      color: $black;
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

  .item-amount {
    text-align: center;
  }

  .total-price {
    text-align: center;
    font-weight: 500;
    color: $red;
  }
}

.price-panel {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.09);
  .panel-row {
    display: grid;
    grid-template-columns: 2.5fr 1fr 1fr 1fr;
    text-align: center;
    padding-bottom: 10px;
    /* border: 1px solid rgba(0, 0, 0, 0.09); */
    border-bottom: none;

    .row-title {
      grid-column-start: 3;
      grid-column-end: 4;
      text-align: inherit;
      display: flex;
      align-items: center;
    }

    .row-content {
      grid-column-start: 4;
      grid-column-end: 5;
      text-align: inherit;
    }

    .after-discount {
      font-weight: 500;
      font-size: 25px;
      color: $red;
    }

    .payment-status {
      grid-column-start: 1;
      grid-column-end: 2;
      text-align: left;
      font-weight: 400;
      font-style: italic;
    }
  }
}

.action-panel {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  button {
    display: block;
    border: none;
    background: $red;
    color: $white2;
    padding: 10px 15px;
    border-radius: 3px;
    margin: 30px 0 0 20px;
  }
}

@keyframes progress-line {
  from {
    max-width: 0;
  }
  to {
    max-width: 100%;
  }
}
</style>
