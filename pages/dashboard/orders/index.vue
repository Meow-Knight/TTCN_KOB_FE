<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb />
    </div>
    <div class="users-container">
      <div class="right">
        <ul class="nav nav-tabs nav-fill">
          <li class="nav-item" @click="changeTab('PENDING')">
            <span
              :class="
                orderStatusShow == 'PENDING' ? 'nav-link active' : 'nav-link'
              "
              >Chờ xác nhận</span
            >
          </li>
          <li class="nav-item" @click="changeTab('CONFIRMED')">
            <span
              :class="
                orderStatusShow == 'CONFIRMED' ? 'nav-link active' : 'nav-link'
              "
              >Đã xác nhận</span
            >
          </li>
          <li class="nav-item" @click="changeTab('DELIVERING')">
            <span
              :class="
                orderStatusShow == 'DELIVERING' ? 'nav-link active' : 'nav-link'
              "
              >Đang giao hàng</span
            >
          </li>
          <li class="nav-item" @click="changeTab('DELIVERED')">
            <span
              :class="
                orderStatusShow == 'DELIVERED' ? 'nav-link active' : 'nav-link'
              "
              >Đã giao hàng</span
            >
          </li>
          <li class="nav-item" @click="changeTab('COMPLETED')">
            <span
              :class="
                orderStatusShow == 'COMPLETED' ? 'nav-link active' : 'nav-link'
              "
              >Hoàn thành</span
            >
          </li>
          <li class="nav-item" @click="changeTab('CANCELED')">
            <span
              :class="
                orderStatusShow == 'CANCELED' ? 'nav-link active' : 'nav-link'
              "
              >Đã hủy</span
            >
          </li>
          <li class="nav-item" @click="changeTab('NOTRECEIVED')">
            <span
              :class="
                orderStatusShow == 'NOTRECEIVED'
                  ? 'nav-link active'
                  : 'nav-link'
              "
              >Chưa nhận được</span
            >
          </li>
        </ul>
        <div class="total-users container-fluid">
          <span>Tất cả đơn hàng: {{ totalOrder }}</span>
          <div class="search-bar">
            <form class="form-inline">
              <input
                class="form-control mr-sm-2"
                type="search"
                placeholder="Tìm kiếm"
                aria-label="Search"
              />
              <button
                class="btn btn-outline-success my-2 my-sm-0"
                type="submit"
              >
                <i class="fas fa-search"></i>
              </button>
            </form>
          </div>
        </div>
        <div class="user-list container-fluid">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col" @click="sort('account')">
                  Khách hàng
                  <span v-if="sortBy.field == 'account'">
                    <i v-if="sortBy.asc" class="fas fa-caret-up"></i>
                    <i v-else class="fas fa-caret-down"></i>
                  </span>
                </th>
                <th scope="col" @click="sort('created_at')">
                  Thời gian đặt
                  <span v-if="sortBy.field == 'created_at'">
                    <i v-if="sortBy.asc" class="fas fa-caret-up"></i>
                    <i v-else class="fas fa-caret-down"></i>
                  </span>
                </th>
                <th scope="col">Thời gian hoàn thành</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(order, index) in orders"
                :key="order.id"
                class="user-list__item"
                @click="$router.push(`orders/${order.id}`)"
              >
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ order.account }}</td>
                <td>{{ getTimeFormat(order.created_at) }}</td>
                <td>
                  {{
                    order.done_at ? getTimeFormat(order.done_at) : '--------'
                  }}
                </td>
                <td>{{ order.order_status }}</td>
                <td>{{ priceFormat(order.total_price) }}đ</td>
                <td>
                  <span v-if="order.producer">{{ order.producer.name }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination">
          <div class="overflow-auto">
            <b-pagination
              v-model="currentPage"
              :total-rows="rows"
              :per-page="pageSize"
            >
              <template #first-text="{ page }"
                ><span class="text-info" @click="changePage(page)"
                  >Đầu</span
                ></template
              >
              <template #prev-text
                ><span class="text-success" @click="getData(previous)"
                  ><i class="fas fa-chevron-left"></i></span
              ></template>
              <template #next-text
                ><span class="text-success" @click="getData(next)"
                  ><i class="fas fa-chevron-right"></i></span
              ></template>
              <template #last-text="{ page }"
                ><span class="text-info" @click="changePage(page)"
                  >Cuối</span
                ></template
              >
              <template #page="{ page, active }">
                <b v-if="active">{{ page }}</b>
                <span v-else @click="changePage(page)">{{ page }}</span>
              </template>
            </b-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { priceFormat, getTimeFormat, roleGuard } from '~/helper/helper'
import Breadcrumb from '~/components/Breadcrumb.vue'

export default {
  components: { Breadcrumb },
  layout: 'admin',
  middleware: ['auth', roleGuard('admin')],
  data() {
    return {
      orders: [],
      next: null,
      previous: null,
      rows: 0,
      pageSize: 12,
      currentPage: 1,
      searchText: '',
      sortBy: {
        field: 'created_at',
        asc: true,
      },
      totalOrder: 0,
      orderStatusShow: 'PENDING',
    }
  },
  computed: {
    sortOption() {
      let sortOptionText = this.sortBy.field
      if (!this.sortBy.asc) {
        sortOptionText = '-' + this.sortBy.field
      }
      return sortOptionText
    },
  },
  methods: {
    priceFormat,
    getTimeFormat,
    async getData(url) {
      if (!url) return
      if (process.client) {
        const authToken = this.$auth.strategy.token.get()
        const response = await this.$axios.get(`/api/v1${url}`, {
          headers: { Authorization: authToken },
        })
        this.orders = response.data.results
        this.rows = response.data.count
        this.previous = response.data.previous
        this.next = response.data.next
        this.totalOrder = response.data.count
      }
    },
    changePage(pageNumber) {
      const URL = `/order/?page=${pageNumber}&page_size=${this.pageSize}&q=${this.searchText}&sort=${this.sortOption}&q=${this.orderStatusShow}`
      this.getData(URL)
    },
    search() {
      const URL = `/order/?page=1&page_size=${this.pageSize}&q=${this.searchText}&sort=${this.sortOption}&q=${this.orderStatusShow}`
      this.getData(URL)
    },
    sort(field) {
      this.sortBy.field = field
      this.sortBy.asc = !this.sortBy.asc
      const URL = `/order/?page=1&page_size=${this.pageSize}&q=${this.searchText}&sort=${this.sortOption}&q=${this.orderStatusShow}`
      this.getData(URL)
    },
    changeTab(status) {
      this.orderStatusShow = status
      const URL = `/order/?page=1&page_size=${this.pageSize}&q=${this.searchText}&sort=${this.sortOption}&q=${this.orderStatusShow}`
      this.getData(URL)
    },
  },
  created() {
    const URL = `/order/?page=1&page_size=${this.pageSize}&q=${this.orderStatusShow}`
    this.getData(URL)
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.users-container {
  display: flex;
  flex-direction: row;
  .right {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}
.nav-tabs {
  .nav-item {
    cursor: pointer;
    color: #0062cc;
  }
}
.total-users {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.search-bar {
  margin-top: 10px;
  margin-bottom: 10px;
  .form-control {
    box-shadow: none;
  }
}
.user-list__item {
  cursor: pointer;
  &:hover {
    background-color: $hoverSidebar;
  }
}
.pagination {
  display: flex;
  justify-content: center;
  .arrow-box {
    width: 100px;
    display: flex;
    justify-content: space-between;
  }
  &__arrow {
    font-size: 30px;
  }
}
</style>
