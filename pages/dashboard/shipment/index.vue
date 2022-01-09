<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    <div class="users-container">
      <div class="left"><sidebar-admin /></div>
      <div class="right">
        <div class="total-users container-fluid">
          <span>Tất cả sản phẩm: {{ shipments.length }}</span>
          <div class="search-bar">
            <form class="form-inline">
              <input
                class="form-control mr-sm-2"
                type="search"
                placeholder="Tìm kiếm"
                aria-label="Search"
                v-model="searchText"
                @keyup="search"
              />
              <nuxt-link
                to="/dashboard/shipment/addShipment"
                class="btn btn-outline-success my-2 my-sm-0"
                >Thêm vận chuyển</nuxt-link
              >
            </form>
          </div>
        </div>
        <div class="user-list container-fluid">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col" @click="sort('name')">
                  Bia
                  <span v-if="sortBy.field == 'name'">
                    <i v-if="sortBy.asc" class="fas fa-caret-up"></i>
                    <i v-else class="fas fa-caret-down"></i>
                  </span>
                </th>
                <th scope="col">Ngày Ship</th>
                <th scope="col">Số Lượng</th>
                <th scope="col" @click="sort('price')">
                  Giá (VNĐ)
                  <span v-if="sortBy.field == 'price'">
                    <i v-if="sortBy.asc" class="fas fa-caret-up"></i>
                    <i v-else class="fas fa-caret-down"></i>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(shipment, index) in shipments"
                :key="shipment.id"
                class="user-list__item"
                @click="$router.push(`shipment/${shipment.id}`)"
              >
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ shipment.beer.name }}</td>
                <td>{{ shipment.shipment_date }}</td>
                <td>{{ shipment.amount }}</td>
                <td>{{ shipment.price }}</td>
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
import axios from 'axios'
import Breadcrumb from '~/components/Breadcrumb.vue'
import SidebarAdmin from '~/components/SidebarAdmin.vue'
import { roleGuard } from '~/helper/helper'

export default {
  components: {
    Breadcrumb,
    SidebarAdmin,
  },
  middleware: ['auth', roleGuard('admin')],
  data() {
    return {
      breadcrumbItems: [
        { name: 'Trang chủ', url: '/' },
        { name: 'Quản lý', url: '/dashboard' },
        { name: 'Vận Chuyển', url: '/dashboard/shipment' },
      ],
      shipments: [],
      showModal: false,
      next: null,
      previous: null,
      rows: 0,
      pageSize: 3,
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
        const response = await axios.get(`/api/v1${url}`, {
          headers: { Authorization: authToken },
        })
        this.shipments = response.data.results
        this.rows = response.data.count
        this.previous = response.data.previous
        this.next = response.data.next
      }
    },
    changePage(pageNumber) {
      const URL = `/beer/shipment/?page=${pageNumber}&page_size=${this.pageSize}&q=${this.searchText}&sort=${this.sortOption}`
      this.getData(URL)
    },
    search() {
      const URL = `/beer/shipment/?page=1&page_size=${this.pageSize}&q=${this.searchText}&sort=${this.sortOption}`
      this.getData(URL)
    },
    sort(field) {
      this.sortBy.field = field
      this.sortBy.asc = !this.sortBy.asc
      const URL = `/beer/shipment/?page=1&page_size=${this.pageSize}&q=${this.searchText}&sort=${this.sortOption}`
      this.getData(URL)
    },
  },
  created() {
    const URL = `/beer/shipment/?page=1&page_size=${this.pageSize}`
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
