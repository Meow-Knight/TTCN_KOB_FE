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
          <div class="arrow-box">
            <span class="previos-arrow pagination__arrow"
              ><i class="far fa-arrow-alt-circle-left"></i
            ></span>
            <span class="next-arrow pagination__arrow"
              ><i class="far fa-arrow-alt-circle-right"></i
            ></span>
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
    }
  },
  async created() {
    const URL = '/beer'

    if (process.client) {
      const authToken = localStorage.getItem('auth._token.local')
      const response = await this.$axios.get(`/api/v1${URL}`, {
        headers: { Authorization: authToken },
      })
      this.beers = response.data.results
      console.log(this.beers)
    }
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
