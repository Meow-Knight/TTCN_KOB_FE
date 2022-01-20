<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb :name="order.id || ''" />
    </div>
    <div class="order-details-container">
      <div class="left">
        <div class="left__order-details">
          <h5 v-if="order.order_status == 'PENDING'" class="sub-title">Đang chờ xác nhận</h5>
          <h5 v-if="order.order_status == 'CONFIRMED'" class="sub-title">Đã xác nhận</h5>
          <h5 v-if="order.order_status == 'DELIVERING'" class="sub-title">Đang giao hàng</h5>
          <h5 v-if="order.order_status == 'DELIVERED'" class="sub-title">Đã giao hàng</h5>
          <h5 v-if="order.order_status == 'NOTRECEIVED'" class="sub-title">Khách hàng chưa nhận được hàng</h5>
          <h5 v-if="order.order_status == 'CANCELED'" class="sub-title">Đã hủy</h5>

          <table class="product-list">
            <tr class="product-list-header">
              <th class="name-column placeholder">Sản phẩm</th>
              <th class="price-column placeholder">Đơn giá</th>
              <th class="amount-column placeholder">Số lượng</th>
              <th class="total-column placeholder">Thành tiền</th>
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
                <td class="item-price">
                  <div class="after-discount">
                    {{
                      priceFormat(
                        afterDiscount(beer.price, beer.discount_percent)
                      ) + 'đ'
                    }}
                  </div>
                </td>
                <td class="item-amount-wrapper">{{ amount }}</td>
                <td class="total-price">
                  {{
                    priceFormat(
                      afterDiscount(beer.price, beer.discount_percent) * amount
                    ) + 'đ'
                  }}
                </td>
              </tr>
            </div>
          </table>
          <div v-if="order.order_status == 'PENDING'" class="order-action">
            <button class="btn btn-primary" @click="changeStatus('CONFIRMED')">
              Xác nhận đơn hàng
            </button>
            <button class="btn btn-primary" @click="cancelOrder">
              Hủy đơn
            </button>
          </div>
          <div
            v-if="
              order.order_status == 'CONFIRMED' ||
              order.order_status == 'NOTRECEIVED'
            "
            class="order-action"
          >
            <button class="btn btn-primary" @click="changeStatus('DELIVERING')">
              Tiến hành giao hàng
            </button>
          </div>
          <div v-if="order.order_status == 'DELIVERING'" class="order-action">
            <button class="btn btn-primary" @click="changeStatus('DELIVERED')">
              Đã giao hàng
            </button>
          </div>
        </div>
        <div v-if="order.order_detail" class="left__payment-details">
          <h5 class="sub-title">Thông tin thanh toán</h5>
          <table class="payment-details-table">
            <tr>
              <td>Tạm tính:</td>
              <td>{{ order.order_detail.length }} sản phẩm</td>
              <td>{{ priceFormat(order.total_price) }}đ</td>
            </tr>
            <tr>
              <td>Vận chuyển:</td>
              <td>KOB vận chuyển</td>
              <td>0đ</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="right"></div>
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
import { priceFormat, afterDiscount, roleGuard } from '~/helper/helper'
export default {
  components: { Breadcrumb, ConfirmModal },
  layout: 'admin',
  middleware: ['auth', roleGuard('admin')],
  data() {
    return {
      showConfirmModal: false,
      order: [],
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
      } catch (err) {
        alert(err)
      }
    }
  },
  methods: {
    priceFormat,
    afterDiscount,
    getBeerURL(beerId) {
      return '/beers/' + beerId
    },
    async changeStatus(newStatus) {
      const URL = `/order/admin_change_order_status/`
      if (process.client) {
        const authToken = localStorage.getItem('auth._token.local')
        try {
          await this.$axios.put(`/api/v1${URL}`, {
              id: this.order.id,
              key_change: newStatus,
          }, {
            headers: { Authorization: authToken },
          })
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
          await this.$axios.put(`/api/v1${URL}`, {
              id: this.order.id,
          }, {
            headers: { Authorization: authToken },
          })
        } catch (err) {
          alert(err)
        }
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.order-details-container {
  display: flex;
  flex-direction: row;
  .left {
    // width: 300px;
  }
  .right {
    // display: flex;
    // flex-direction: column;
    // width: 100%;
    // align-items: center;
    // margin-bottom: 40px;
  }
}

.product-list {
  padding: 0 20px;
  position: relative;
  margin: 20px;
}

.product-list-header {
  display: grid;
  grid-template-columns: 3fr 1.5fr 1.2fr 1fr 0.5fr;
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
  grid-template-columns: 3fr 1.5fr 1.2fr 1fr 0.5fr;
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

.item-amount-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
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
  background: $white;
  cursor: pointer;
  border: none;
}

.decrease-btn {
  border-right: 0.5px solid rgb(173, 161, 161);
}

.increase-btn {
  border-left: 0.5px solid rgb(173, 161, 161);
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
  font-size: 15px;
}

.item-amount-input:focus {
  outline: none;
  border: 1px solid rgb(95, 92, 92);
}

.total-price {
  color: $red;
  font-weight: 500;
}
</style>
