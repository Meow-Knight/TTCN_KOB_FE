<template>
  <div class="purchase">
    <div class="header">
      <div class="header-text">LỊCH SỬ MUA HÀNG</div>
    </div>

    <div class="purchase-content">
      <div class="status-select">
        <div
          v-for="option in statusFilter.options"
          :key="option.status"
          class="status-filter-option"
          :class="{ selected: currentStatus === option.status }"
          @click="setCurrentStatus(option.status)"
        >
          {{ option.display }}
        </div>
      </div>
      <div v-if="isLoading" class="is-loading">Loading...</div>
      <div v-else-if="!allPurchase.length" class="no-purchase">
        Không có đơn hàng nào.
      </div>
      <div v-else>
        <div
          v-for="(purchase, index) in allPurchase"
          :key="index"
          class="purchase-card-container"
        >
          <div class="card-top">
            <div class="purchase-information">
              <div class="purchase-id">{{ 'Mã đơn hàng: ' + purchase.id }}</div>
              <div class="purchase-status">
                {{ getDisplayByStatus(purchase.order_status) }}
              </div>
            </div>
            <div class="purchase-items-container">
              <div class="receiver-info-row">
                <div class="receiver-info-text">Địa chỉ giao hàng</div>
                <div class="receiver-info-content">
                  {{ purchase.shipping_address }}
                </div>
              </div>
              <div class="receiver-info-row">
                <div class="receiver-info-text">Số điện thoại</div>
                <div class="receiver-info-content">
                  {{ purchase.shipping_phone }}
                </div>
              </div>
            </div>
          </div>
          <div class="card-bottom">
            <div class="purchase-total-wrapper">
              <div class="purchase-total-text">Tổng số tiền:</div>
              <div class="purchase-total">
                {{ priceFormat(purchase.total_price) + 'đ' }}
              </div>
            </div>
            <div class="purchase-action-container">
              <button
                v-if="purchase.order_status === 'PENDING'"
                class="cancel-purchase"
                @click="cancelOrder(purchase.id)"
              >
                Hủy đơn hàng
              </button>
              <nuxt-link
                :to="purchaseDetailURL(purchase.id)"
                class="purchase-detail-link"
                >Xem chi tiết đơn hàng</nuxt-link
              >
            </div>
          </div>
        </div>
        <div v-if="isLoadingMore" class="is-loading-more">...</div>
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
import BaseDialog from '~/components/Modal/BaseDialog.vue'
import { afterDiscount, priceFormat } from '~/helper/helper'
export default {
  components: { BaseDialog },
  layout: 'user',
  data() {
    return {
      currentStatus: null,
      allPurchase: [],
      isLoading: true,
      isLoadingMore: false,
      nextPage: null,
      notification: {
        title: null,
        message: null,
        needConfirm: true,
      },
    }
  },
  computed: {
    statusFilter() {
      return {
        options: [
          {
            display: 'Tất cả',
            status: 'ALL',
          },
          {
            display: 'Chờ xác nhận',
            status: 'PENDING',
          },
          {
            display: 'Đã xác nhận',
            status: 'CONFIRMED',
          },
          {
            display: 'Đang giao',
            status: 'DELIVERING',
          },
          {
            display: 'Đã giao',
            status: 'DELIVERED',
          },
          {
            display: 'Đã hoàn thành',
            status: 'COMPLETED',
          },
          {
            display: 'Chưa nhận',
            status: 'NOTRECEIVED',
          },
          {
            display: 'Đã hủy',
            status: 'CANCELED',
          },
        ],
      }
    },
    getOrderApiURL() {
      return '/api/v1/order/list?page_size=5&q='
    },
    cancelOrderApiURL() {
      return '/api/v1/order/cancel'
    },
  },
  watch: {
    $route: {
      immediate: true,
      async handler(to, from) {
        // get status query
        const statusQuery = to.query.status
        // if status query is not in filter options, set route to base path
        if (
          statusQuery &&
          !this.statusFilter.options.find(
            (option) => option.status === statusQuery
          )
        ) {
          this.$router.push('/user/purchase')
          return
        }
        // set status and fetch data
        this.currentStatus = statusQuery ? to.query.status.toUpperCase() : 'ALL'
        if (process.client) {
          const authToken = this.$auth.strategy.token.get()
          this.isLoading = true
          try {
            const { data } = await this.$axios.get(
              this.getOrderApiURL +
                (this.currentStatus === 'ALL' ? '' : this.currentStatus),
              {
                headers: { Authorization: authToken },
              }
            )
            this.isLoading = false
            this.nextPage = data.next
            this.allPurchase = data.results
          } catch (err) {
            console.log(err)
          }
        }
      },
    },
  },
  mounted() {
    window.addEventListener('scroll', this.loadMore)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.loadMore)
  },
  methods: {
    setCurrentStatus(status) {
      if (status === 'ALL') return this.$router.push('/user/purchase')
      this.$router.push('/user/purchase?status=' + status)
    },
    getDisplayByStatus(status) {
      return this.statusFilter.options.find(
        (option) => option.status === status
      ).display
    },
    getImage(source) {
      return require(source)
    },
    purchaseDetailURL(purchaseId) {
      return '/user/purchase/' + purchaseId
    },
    afterDiscount,
    priceFormat,
    shouldLoadMore() {
      // we need to load more item when scroll to the bottom of the list container, maybe
      // a bit shorter than the viewport height
      // first get the element itself
      const containerElement = document.querySelector('.purchase')
      // we will get the bottom of element client rectangle, which is the distance from
      // top of the viewport to the bottom of element including border and padding
      const distance = containerElement.getBoundingClientRect().bottom
      return distance < 0.8 * window.innerHeight
    },
    async loadMore() {
      try {
        if (!this.shouldLoadMore() || this.isLoadingMore || !this.nextPage)
          return
        // loading more item here
        this.isLoadingMore = true
        // const authToken = this.$auth.strategy.token.get()
        const { data } = await this.$axios.get(this.nextPage)
        this.allPurchase.push(...data.results)
        this.nextPage = data.next
        this.isLoadingMore = false
      } catch (err) {
        console.log(err.response || err)
      }
    },
    async cancelOrder(orderId) {
      try {
        const { data } = await this.$axios.put(this.cancelOrderApiURL, {
          id: orderId,
        })
        if (data?.detail?.success) {
          this.notification = {
            ...this.notification,
            title: 'Thành công',
            message: 'Hủy đơn hàng thành công',
            needConfirm: false,
          }
          return setTimeout(() => {
            this.confirmNotification()
            this.$router.push(this.purchaseDetailURL(orderId))
          }, 3000)
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
    confirmNotification() {
      this.notification = { ...this.notification, title: null, message: null }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.purchase {
  width: 100%;
  max-width: none;
  height: fit-content;
  min-height: 70vh;
  padding: 20px 25px;
  background: $white;
}

.header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px 0px;
  border-bottom: 1px solid rgb(230, 219, 219);
  height: 80px;
}

.header-text {
  font-size: 25px;
  font-weight: 500;
}

/* .purchase-content {
  padding-top: 10px;
} */

.status-select {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  justify-items: center;
  height: fit-content;
  margin-bottom: 20px;
}

.status-filter-option {
  padding: 10px 0;
  width: 100%;
  text-align: center;
  border: 1px solid rgb(230, 219, 219);
  border-top: none;
  cursor: pointer;
  transition: 0.3s ease-in-out;
}

.status-filter-option:hover {
  background: rgb(223, 107, 107);
  color: $white2;
  transition: 0.3s ease-in-out;
}

.status-filter-option.selected {
  background: rgb(223, 107, 107);
  color: $white2;
  border: none;
}

.purchase-card-container {
  margin-bottom: 30px;
  height: fit-content;
  background: rgba(245, 245, 245, 0.8);
}

.card-top {
  border: 1px solid #e6dbdb;
  border-radius: 0 0 8px 8px;
  margin-bottom: 3px;
  padding: 5px 10px;
}

.card-bottom {
  border: 1px solid #e6dbdb;
  border-radius: 8px 8px 0 0;
  padding: 5px 10px;
}

.purchase-information {
  width: 100%;
  height: fit-content;
  margin-bottom: 20px;
  border-bottom: 1px solid #e6dbdb;
  padding: 10px 5% 10px 0;
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
  width: fit-content;
  height: fit-content;
  /* margin: 0 0 0 auto; */
  color: $red;
}

.receiver-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 10%;
}

.receiver-info-text {
  width: 20%;
  text-align: left;
}

.receiver-info-content {
  width: 70%;
  text-align: left;
}

.purchase-item {
  display: flex;
  border-bottom: 1px solid #e6dbdb;
  margin-bottom: 20px;
}

.purchase-item.last {
  border-bottom: none;
}

.item-image-wrapper {
  width: 8%;
  padding-bottom: 8%;
  position: relative;
  margin-right: 2%;
}

.item-image {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.item-information {
  width: 60%;
  margin-right: 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.item-price {
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.origin-price {
  text-decoration: line-through;
}

.after-discount {
  color: $red;
}

.purchase-total-wrapper {
  display: flex;
  padding: 10px 5%;
  text-align: right;
  justify-content: end;
}

.purchase-total-text {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.purchase-total {
  color: $red;
  font-size: 25px;
  font-weight: 500;
}

.purchase-action-container {
  height: fit-content;
  padding: 20px 5%;
  display: flex;
  justify-content: flex-end;
}

.cancel-purchase {
  display: block;
  width: fit-content;
  text-decoration: none;
  color: $black;
  padding: 10px 15px;
  background: rgb(223, 107, 107);
  border-radius: 3px;
  margin-right: 10px;
}

.purchase-detail-link {
  display: block;
  width: fit-content;
  text-decoration: none;
  color: $black;
  padding: 10px 15px;
  background: rgb(223, 107, 107);
  border-radius: 3px;
}

.no-purchase {
  margin: 30px auto;
  font-size: 25px;
  width: fit-content;
}

.is-loading {
  margin: 30px auto;
  font-size: 25px;
  width: fit-content;
}

.is-loading-more {
  margin: 30px auto;
  font-size: 25px;
  width: fit-content;
}

button {
  border: none;
  background: rgb(216, 211, 211);
  color: $black;
  padding: 10px 15px;
  border-radius: 5px;
  transition: 0.3s ease-in-out;
}
</style>
