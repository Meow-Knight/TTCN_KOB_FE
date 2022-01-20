<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb :name="order.id || ''" />
    </div>
    <div class="order-details-container">
      <div class="left">
        <div class="left__item left__order-details">
          <h5 v-if="orderStatus == 'PENDING'" class="title">
            Đang chờ xác nhận
          </h5>
          <h5 v-if="orderStatus == 'CONFIRMED'" class="title">Đã xác nhận</h5>
          <h5 v-if="orderStatus == 'DELIVERING'" class="title">
            Đang giao hàng
          </h5>
          <h5 v-if="orderStatus == 'DELIVERED'" class="title">Đã giao hàng</h5>
          <h5 v-if="orderStatus == 'NOTRECEIVED'" class="title">
            Khách hàng chưa nhận được hàng
          </h5>
          <h5 v-if="orderStatus == 'CANCELED'" class="title">Đã hủy</h5>

          <table class="product-list">
            <tr class="product-list-header">
              <th class="name-column placeholder">Sản phẩm</th>
              <th class="price-column placeholder text-right">Đơn giá</th>
              <th class="amount-column placeholder text-right">Số lượng</th>
              <th class="total-column placeholder text-right">Thành tiền</th>
            </tr>
            <div class="items-container">
              <tr
                v-for="{ id, beer, amount } in order.order_detail"
                :key="id"
                class="item-card-container"
              >
                <td class="item-info">
                  <nuxt-link
                    class="item-image-wrapper"
                    :to="getBeerURL(beer.id)"
                  >
                    <img
                      :src="beer.photo || require('~/assets/img/logo3.png')"
                      class="item-image"
                    />
                  </nuxt-link>
                  <nuxt-link :to="getBeerURL(beer.id)" class="item-name">{{
                    beer.name
                  }}</nuxt-link>
                </td>
                <td class="item-price price">
                  {{
                    priceFormat(
                      afterDiscount(beer.price, beer.discount_percent)
                    ) + 'đ'
                  }}
                </td>
                <td class="item-amount-wrapper text-center">{{ amount }}</td>
                <td class="total-price price">
                  {{
                    priceFormat(
                      afterDiscount(beer.price, beer.discount_percent) * amount
                    ) + 'đ'
                  }}
                </td>
              </tr>
            </div>
          </table>
          <div v-if="orderStatus == 'PENDING'" class="order-action">
            <button class="btn btn-primary" @click="changeStatus('CONFIRMED')">
              Xác nhận đơn hàng
            </button>
            <button class="btn btn-primary" @click="cancelOrder">
              Hủy đơn
            </button>
          </div>
          <div
            v-if="orderStatus == 'CONFIRMED' || orderStatus == 'NOTRECEIVED'"
            class="order-action"
          >
            <button class="btn btn-primary" @click="changeStatus('DELIVERING')">
              Tiến hành giao hàng
            </button>
          </div>
          <div v-if="orderStatus == 'DELIVERING'" class="order-action">
            <button class="btn btn-primary" @click="changeStatus('DELIVERED')">
              Đã giao hàng
            </button>
          </div>
        </div>
        <div v-if="order.order_detail" class="left__item left__payment-details">
          <h5 class="title">Thông tin thanh toán</h5>
          <table class="payment-details-table">
            <tr>
              <td>Tạm tính:</td>
              <td>{{ order.order_detail.length }} sản phẩm</td>
              <td class="price">{{ priceFormat(order.total_price) }}đ</td>
            </tr>
            <tr>
              <td>Vận chuyển:</td>
              <td>KOB vận chuyển</td>
              <td class="price">0đ</td>
            </tr>
            <tr>
              <th>Tổng thanh toán:</th>
              <td></td>
              <td class="price">{{ priceFormat(order.total_price) }}đ</td>
            </tr>
          </table>
        </div>
        <div class="left__item order-history">
          <h5 class="title">Lịch sử đơn hàng</h5>
          <ul class="order-history__list">
            <li
              v-for="event in order.progress"
              :key="event.id"
              class="order-history__list__item"
            >
              <span v-if="event.order_status == 'PENDING'"
                >Đơn hàng đã được đặt</span
              >
              <span v-if="event.order_status == 'CONFIRMED'"
                >Đơn hàng đã được xác nhận</span
              >
              <span v-if="event.order_status == 'DELIVERING'"
                >Đơn hàng đang được vận chuyển</span
              >
              <span v-if="event.order_status == 'DELIVERED'"
                >Đơn hàng đã đến nơi người nhận</span
              >
              <span v-if="event.order_status == 'NOTRECEIVED'"
                >Người nhận báo cáo chưa nhận được hàng</span
              >
              <span v-if="event.order_status == 'COMPLETED'"
                >Đơn hàng được hoàn thành</span
              >
              <span v-if="event.order_status == 'CANCELED'"
                >Đon hàng bị hủy</span
              >

              <span>{{ getTimeFormat(event.created_at) }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="right">
        <h5 class="title">Khách hàng</h5>
        <div class="right__item">
          <h6 class="sub-title">Thông tin liên hệ</h6>
          <p class="user-info">
            {{ order.account ? order.account.email : '' }}
          </p>
        </div>
        <div class="right__item">
          <h6 class="sub-title">Địa chỉ giao hàng</h6>
          <p class="user-info">
            {{
              order.account
                ? order.account.first_name + ' ' + order.account.last_name
                : ''
            }}
          </p>
          <p class="user-info">
            {{ order ? order.shipping_phone : '' }}
          </p>
          <p class="user-info">
            {{ order ? order.shipping_address : '' }}
          </p>
        </div>
      </div>
    </div>
    <ConfirmModal
      v-show="showConfirmModal"
      @close-modal="showConfirmModal = false"
    >
      <template #header>
        <h5>Xác nhận xóa bia</h5>
      </template>
      <template #body>
        <p>Bạn có chắc muốn xóa {{}}</p>
      </template>
    </ConfirmModal>
  </div>
</template>

<script>
import Breadcrumb from '~/components/Breadcrumb.vue'
import ConfirmModal from '~/components/Modal/ConfirmModal.vue'
import {
  priceFormat,
  afterDiscount,
  getTimeFormat,
} from '~/helper/helper'
export default {
  components: { Breadcrumb, ConfirmModal },
  layout: 'admin',
  data() {
    return {
      showConfirmModal: false,
      order: {},
      orderStatus: '',
    }
  },
  computed: {
    orderId() {
      return this.$router.currentRoute.params.id
    },
  },
  async created() {
    const URL = `/order/${this.orderId}`

    if (process.client) {
      const authToken = localStorage.getItem('auth._token.local')
      try {
        const response = await this.$axios.get(`/api/v1${URL}`, {
          headers: { Authorization: authToken },
        })
        this.order = response.data
        this.orderStatus = this.order.order_status
      } catch (err) {
        alert(err)
      }
    }
  },
  methods: {
    priceFormat,
    afterDiscount,
    getTimeFormat,
    getBeerURL(beerId) {
      return '/beers/' + beerId
    },
    async changeStatus(newStatus) {
      const URL = `/order/admin_change_order_status/`
      if (process.client) {
        const authToken = localStorage.getItem('auth._token.local')
        try {
          await this.$axios.put(
            `/api/v1${URL}`,
            {
              id: this.order.id,
              key_change: newStatus,
            },
            {
              headers: { Authorization: authToken },
            }
          )
          this.orderStatus = newStatus
        } catch (err) {
          alert(err)
        }
      }
    },
    async cancelOrder() {
      const URL = '/order/admin_cancel_order/'
      if (process.client) {
        const authToken = localStorage.getItem('auth._token.local')
        try {
          await this.$axios.put(
            `/api/v1${URL}`,
            {
              id: this.order.id,
            },
            {
              headers: { Authorization: authToken },
            }
          )
          this.orderStatus = 'CANCELED'
        } catch (err) {
          alert(err)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.order-details-container {
  display: flex;
  flex-direction: row;
  .left {
    flex-basis: 70%;

    &__item {
      background-color: $breadcrumbBgrColor;
      border-radius: 5px;
      padding: 20px;
      margin-bottom: 30px;

      .order-action {
        display: flex;
        justify-content: flex-end;
        padding-top: 10px;
        border-top: solid $white 1px;

        .btn {
          margin-right: 20px;
        }
      }
      .order-history__list {
        padding-left: 10px;
        &__item {
          display: flex;
          justify-content: space-between;
          border-left: solid $red 2px;
          padding-left: 20px;
          padding-top: 5px;
          padding-bottom: 5px;
          position: relative;
        }
        &__item::before {
          content: '';
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background-color: $red;
          position: absolute;
          top: 12px;
          left: -6px;
        }
      }
    }
  }
  .left__payment-details {
    .payment-details-table {
      width: 100%;
      tr {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        margin-top: 10px;
      }
    }
  }
  .right {
    border-radius: 5px;
    flex-basis: 30%;
    background-color: $breadcrumbBgrColor;
    margin-left: 20px;
    margin-bottom: 30px;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    &__item {
      border-bottom: solid 1px $white;
      padding-top: 10px;
      padding-left: 10px;
    }
    .user-info {
      margin-bottom: 0;
      padding-left: 10px;
    }
  }
}

.title {
  font-weight: 600;
  padding-bottom: 5px;
  border-bottom: solid $white 1px;
}

.sub-title {
  font-weight: 600;
}

.product-list {
  padding: 0 20px;
  position: relative;
  margin: 20px;
}

.product-list-header {
  display: grid;
  grid-template-columns: 3fr 1.5fr 1.2fr 1fr;
  justify-items: center;
  margin-bottom: 30px;
  margin-top: 10px;
  .placeholder {
    width: 100%;
    border: none;
  }
}

.item-card-container {
  display: grid;
  grid-template-columns: 3fr 1.5fr 1.2fr 1fr;
  align-items: center;
  margin-bottom: 50px;
  font-size: 15px;
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

.after-discount {
  color: $red;
  font-weight: 500;
}

.total-price {
  color: $red;
  font-weight: 500;
}

.price {
  color: $red;
  text-align: right;
}
</style>
