<template>
  <div class="purchase">
    <div class="header">
      <div class="header-text">LỊCH SỬ MUA HÀNG</div>
    </div>
    <div v-if="false" class="no-purchase">Bạn chưa có đơn hàng nào.</div>
    <div v-else class="purchase-content">
      <div class="status-select">
        <div
          v-for="option in statusFilter.options"
          :key="option.status"
          class="status-filter-option"
          :class="{ selected: currentStatus.status === option.status }"
          @click="setCurrentStatus(option)"
        >
          {{ option.display }}
        </div>
      </div>
      <div
        v-for="(purchase, index) in filteredPurchase"
        :key="index"
        class="purchase-card-container"
      >
        <div class="card-top">
          <div class="purchase-information">
            <div class="purchase-status">
              {{ getDisplayByStatus(purchase.status) }}
            </div>
          </div>
          <div class="purchase-items-container">
            <div
              v-for="(item, index) in purchase.items"
              :key="item.name"
              class="purchase-item"
              :class="{ last: index === purchase.items.length - 1 }"
            >
              <div class="item-image-wrapper">
                <img
                  :src="require('~/assets/img/logo3.png')"
                  class="item-image"
                />
              </div>
              <div class="item-information">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-amount">{{ item.amount }}</div>
              </div>
              <div class="item-price">
                <div class="after-discount">
                  {{
                    priceFormat(
                      afterDiscount(item.price, item.discount_percent) *
                        item.amount
                    ) + 'đ'
                  }}
                </div>
                <div class="origin-price">
                  {{ priceFormat(item.price * item.amount) + 'đ' }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-bottom">
          <div class="purchase-total-wrapper">
            <div class="purchase-total-text">Tổng số tiền:</div>
            <div class="purchase-total">
              {{
                priceFormat(
                  purchase.items.reduce(
                    (prev, cur) =>
                      prev +
                      afterDiscount(cur.price, cur.discount_percent) *
                        cur.amount,
                    0
                  )
                ) + 'đ'
              }}
            </div>
          </div>
          <div class="purchase-action-container">
            <nuxt-link
              :to="purchaseDetailPath(purchase.id)"
              class="purchase-detail-link"
              >Xem chi tiết đơn hàng</nuxt-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { afterDiscount, priceFormat } from '~/helper/helper'
export default {
  layout: 'user',
  data() {
    return {
      currentStatus: {
        display: null,
        status: null,
      },
      allPurchase: [
        {
          id: '1232',
          status: 'waiting-for-acceptance',
          items: [
            {
              image: '~/assets/img/logo3.png',
              name: 'Thùng 12 lon bia Heineken',
              amount: 1,
              price: 200000,
              discount_percent: 5,
            },
            {
              image: '~/assets/img/logo3.png',
              name: 'Thùng 14 lon bia Heineken',
              amount: 1,
              price: 250000,
              discount_percent: 3,
            },
          ],
        },
        {
          id: '12323',
          status: 'delivering',
          items: [
            {
              image: '~/assets/img/logo3.png',
              name: 'Thùng 20 lon bia Heineken',
              amount: 3,
              price: 150000,
              discount_percent: 12,
            },
          ],
        },
        {
          id: '12232',
          status: 'delivered',
          items: [
            {
              image: '~/assets/img/logo3.png',
              name: 'Thùng 8 lon bia Heineken',
              amount: 2,
              price: 95000,
              discount_percent: 25,
            },
          ],
        },
        {
          id: '123232',
          status: 'canceled',
          items: [
            {
              image: '@/assets/img/logo3.png',
              name: 'Lốc 20 lon bia Huda',
              amount: 5,
              price: 50000,
              discount_percent: 21,
            },
          ],
        },
      ],
    }
  },
  computed: {
    statusFilter() {
      return {
        options: [
          {
            display: 'Tất cả',
            status: 'all',
          },
          {
            display: 'Chờ xác nhận',
            status: 'waiting-for-acceptance',
          },
          {
            display: 'Đang giao',
            status: 'delivering',
          },
          {
            display: 'Đã giao',
            status: 'delivered',
          },
          {
            display: 'Đã hủy',
            status: 'canceled',
          },
        ],
      }
    },
    filteredPurchase() {
      return this.allPurchase.filter(
        (purchase) =>
          this.currentStatus.status === 'all' ||
          purchase.status === this.currentStatus.status
      )
    },
  },
  mounted() {
    this.currentStatus = {
      status: 'all',
    }
  },
  methods: {
    setCurrentStatus(option) {
      this.currentStatus = option
    },
    getDisplayByStatus(status) {
      return this.statusFilter.options.find(
        (option) => option.status === status
      ).display
    },
    getImage(source) {
      return require(source)
    },
    purchaseDetailPath(purchaseId) {
      return '/user/purchase/' + purchaseId
    },
    afterDiscount,
    priceFormat,
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
  grid-template-columns: repeat(5, 1fr);
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
}

.purchase-status {
  width: fit-content;
  height: fit-content;
  margin: 0 0 0 auto;
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
}

.purchase-detail-link {
  display: block;
  width: fit-content;
  text-decoration: none;
  color: $black;
  padding: 10px 15px;
  background: rgb(223, 107, 107);
  border-radius: 3px;
  margin: 0 0 0 auto;
}

.add-address-button {
  display: flex;
  align-items: center;
  width: 200px;
  justify-content: space-around;
}

.no-purchase {
  margin: 30px auto;
  font-size: 25px;
  width: fit-content;
}

.address-card-container {
  padding: 40px 0 40px 30px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.14);
  display: flex;
  justify-content: space-between;
}

.address-card-container.last {
  border: none;
}

.card-content {
  width: 70%;
}

.card-row {
  display: flex;
}

.row-name {
  width: 20%;
  text-align: right;
  margin-bottom: 10px;
}

.row-content {
  width: fit-content;
  padding: 0 20px 0 10%;
  position: relative;
}

.modify-action {
  margin-bottom: 20px;
  text-align: right;
}

.delete-button {
  background: $red;
  color: $white;
}

.address-card-container.default {
  .row-content.name::after {
    content: 'Mặc định';
    position: absolute;
    top: 10%;
    left: 100%;
    width: fit-content;
    height: 80%;
    padding: 0 5px;
    display: flex;
    align-items: center;
    color: $white;
    background: $red;
    border-radius: 5px;
  }

  .delete-button {
    display: none;
  }

  .set-default-button {
    pointer-events: none;
    opacity: 0.5;
  }
}

button {
  border: none;
  background: rgb(216, 211, 211);
  color: $black;
  padding: 10px 15px;
  border-radius: 5px;
  transition: 0.3s ease-in-out;
}

button:hover {
  background: $red;
  color: $white2;
  transition: 0.3s ease-in-out;
}
</style>
