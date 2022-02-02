<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb />
    </div>
    <div class="users-container">
      <div class="right">
        <div class="total-users container-fluid">
          <span>Tất cả khách hàng: {{ totalCustomer }}</span>
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
                <th scope="col">Tên đăng nhập</th>
                <th scope="col">Tên</th>
                <th scope="col">Ngày tham gia</th>
                <th scope="col">Đã kích hoạt</th>
                <th scope="col">Tổng số đơn</th>
                <th scope="col">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(customer, index) in customers"
                :key="customer.id"
                class="user-list__item"
                @click="$router.push(`customers/${customer.id}`)"
              >
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ customer.username }}</td>
                <td>{{ customer.full_name }}</td>
                <td>{{ getTimeFormat(customer.date_joined) }}</td>
                <td
                  :class="
                    customer.is_active
                      ? 'activation text-align-center actived'
                      : 'activation not-actived'
                  "
                >
                  <i class="fas fa-circle"></i>
                </td>
                <td>{{ customer.order_count }}</td>
                <td class="total-sale">
                  {{
                    customer.total_sale
                      ? priceFormat(customer.total_sale) + 'đ'
                      : '--'
                  }}
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
import { priceFormat, getTimeFormat } from '~/helper/helper'
import Breadcrumb from '~/components/Breadcrumb.vue'

export default {
  components: { Breadcrumb },
  layout: 'admin',
  data() {
    return {
      customers: [],
      next: null,
      previous: null,
      rows: 0,
      pageSize: 12,
      currentPage: 1,
      searchText: '',
      sortBy: {
        field: 'name',
        asc: true,
      },
      totalCustomer: 0,
    }
  },
  created() {
    const URL = `/account/customers/?page=1&page_size=${this.pageSize}`
    this.getData(URL)
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
        this.customers = response.data.results
        this.rows = response.data.count
        this.previous = response.data.previous
        this.next = response.data.next
        this.totalCustomer = response.data.count
      }
    },
    changePage(pageNumber) {
      const URL = `/account/?page=${pageNumber}&page_size=${this.pageSize}&q=${this.searchText}&sort=${this.sortOption}`
      this.getData(URL)
    },
    search() {
      const URL = `/account/?page=1&page_size=${this.pageSize}&q=${this.searchText}&sort=${this.sortOption}`
      this.getData(URL)
    },
    sort(field) {
      this.sortBy.field = field
      this.sortBy.asc = !this.sortBy.asc
      const URL = `/account/?page=1&page_size=${this.pageSize}&q=${this.searchText}&sort=${this.sortOption}`
      this.getData(URL)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.users-container {
  display: flex;
  flex-direction: row;
  .left {
    width: 300px;
  }
  .right {
    display: flex;
    flex-direction: column;
    width: 100%;
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
.activation {
  font-size: 13px;
  text-align: center;
}
.actived {
  color: rgb(11, 177, 105);
}
.not-actived {
  color: rgb(99, 99, 99);
}
.total-sale {
  text-align: right;
}
</style>
