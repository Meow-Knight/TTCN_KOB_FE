<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb />
    </div>
    <div class="users-container">
      <div class="right">
        <div class="total-users container-fluid">
          <span>Tất cả khuyến mãi: {{ totalDiscount }}</span>
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
              <nuxt-link
                to="/dashboard/vouchers/addVoucher"
                class="btn btn-add-beer btn-primary"
                >Thêm Khuyến mãi</nuxt-link
              >
            </form>
          </div>
        </div>
        <div class="user-list container-fluid">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col">Tên</th>
                <th scope="col">Ngày tạo</th>
                <th scope="col">Ngày bắt đầu</th>
                <th scope="col">Ngày kết thúc</th>
                <th scope="col">Đã kích hoạt</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(discount, index) in discounts"
                :key="discount.id"
                class="user-list__item"
                @click="$router.push(`vouchers/${discount.id}`)"
              >
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ discount.name }}</td>
                <td>{{ getTimeFormat(discount.created_at) }}</td>
                <td>{{ getTimeFormat(discount.start_date) }}</td>
                <td>{{ getTimeFormat(discount.end_date) }}</td>
                <td
                  :class="
                    discount.is_activate
                      ? 'activation text-align-center actived'
                      : 'activation not-actived'
                  "
                >
                  <i class="fas fa-circle"></i>
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
import { getTimeFormat } from '~/helper/helper'
import Breadcrumb from '~/components/Breadcrumb.vue'

export default {
  components: { Breadcrumb },
  layout: 'admin',
  data() {
    return {
      discounts: [],
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
      totalDiscount: 0,
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
  created() {
    const URL = `/beer/discount/?page=1&page_size=${this.pageSize}`
    this.getData(URL)
  },
  methods: {
    getTimeFormat,
    async getData(url) {
      this.$store.commit('setLoadingState', true)

      if (!url) return
      if (process.client) {
        try {
          const authToken = this.$auth.strategy.token.get()
          const response = await this.$axios.get(`/api/v1${url}`, {
            headers: { Authorization: authToken },
          })
          this.discounts = response.data.results
          this.rows = response.data.count
          this.previous = response.data.previous
          this.next = response.data.next
          this.totalDiscount = response.data.count
        } catch (err) {
          alert(err)
        }
      }
      this.$store.commit('setLoadingState', false)
    },
    changePage(pageNumber) {
      const URL = `/beer/?page=${pageNumber}&page_size=${this.pageSize}&q=${this.searchText}&sort=${this.sortOption}`
      this.getData(URL)
    },
    search() {
      const URL = `/beer/?page=1&page_size=${this.pageSize}&q=${this.searchText}&sort=${this.sortOption}`
      this.getData(URL)
    },
    sort(field) {
      this.sortBy.field = field
      this.sortBy.asc = !this.sortBy.asc
      const URL = `/beer/?page=1&page_size=${this.pageSize}&q=${this.searchText}&sort=${this.sortOption}`
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
  .btn-add-beer {
    margin-left: 20px;
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
.action {
  .btn {
    font-size: 13px;
    padding: 0 10px;
  }
}
</style>
