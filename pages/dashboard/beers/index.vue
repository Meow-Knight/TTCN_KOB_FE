<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb />
    </div>
    <div class="users-container">
      <div class="left"><sidebar-admin /></div>
      <div class="right">
        <div class="total-users container-fluid">
          <span>Tất cả sản phẩm: {{ beers.length }}</span>
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
                to="/dashboard/beers/addBeer"
                class="btn btn-add-beer btn-primary"
                >Thêm bia mới</nuxt-link
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
                <th scope="col">Nồng độ cồn</th>
                <th scope="col">Dung tích</th>
                <th scope="col">Giá</th>
                <th scope="col">SL Chai</th>
                <th scope="col">NSX</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(beer, index) in beers"
                :key="beer.id"
                class="user-list__item"
                @click="$router.push(`beers/${beer.id}`)"
              >
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ beer.name }}</td>
                <td>{{ beer.alcohol_concentration }}</td>
                <td>{{ beer.capacity }}</td>
                <td>{{ beer.price }}</td>
                <td>{{ beer.bottle_amount }}</td>
                <td>{{ beer.producer.name }}</td>
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
import Breadcrumb from '~/components/Breadcrumb.vue'
import SidebarAdmin from '~/components/SidebarAdmin.vue'
import { roleGuard } from '~/helper/helper'

export default {
  components: { Breadcrumb, SidebarAdmin },
  middleware: ['auth', roleGuard('admin')],
  data() {
    return {
      beers: [],
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
    async getData(url) {
      if (!url) return
      if (process.client) {
        const authToken = this.$auth.strategy.token.get()
        const response = await this.$axios.get(`/api/v1${url}`, {
          headers: { Authorization: authToken },
        })
        this.beers = response.data.results
        this.rows = response.data.count
        this.previous = response.data.previous
        this.next = response.data.next
      }
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
  created() {
    const URL = `/beer/?page=1&page_size=${this.pageSize}`
    this.getData(URL)
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
</style>
