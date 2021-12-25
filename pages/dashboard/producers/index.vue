<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb />
    </div>
    <div class="users-container">
      <div class="left"><sidebar-admin /></div>
      <div class="right">
        <div class="total-users container-fluid">
          <span>Tất cả nhà sản xuất: {{ producers.length }}</span>

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
            <div class="add-button">
              <button
                class="btn btn-outline-success my-2 my-sm-0 ml-2"
                @click="showModal = true"
              >
                Thêm NXS
              </button>
            </div>
          </div>
        </div>
        <div class="user-list container-fluid">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col">Tên</th>
                <th scope="col">Địa chỉ</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(producer, index) in producers"
                :key="producer.id"
                class="user-list__item"
                @click="$router.push(`producers/${producer.id}`)"
              >
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ producer.name }}</td>
                <td>{{ producer.address }}</td>
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
    <Modal v-show="showModal" @close-modal="showModal = false" />
  </div>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '~/components/Breadcrumb.vue'
import SidebarAdmin from '~/components/SidebarAdmin.vue'
import Modal from '~/components/Modal/ProducerModal.vue'
export default {
  components: { Breadcrumb, SidebarAdmin, Modal },
  middleware: 'auth',
  data() {
    return {
      showModal: false,
      // breadcrumbItems: [
      //   { name: 'Trang chủ', url: '/' },
      //   { name: 'Quản lý', url: '/dashboard' },
      //   { name: 'Nhà sản xuất', url: '/dashboard/producers' },
      // ],
      producers: [],
    }
  },
  async created() {
    const URL = '/beer/producer/'
    const authToken = this.$auth.strategy.token.get()
    const response = await axios.get(`http://localhost:8000/api/v1${URL}`, {
      headers: { Authorization: authToken },
    })
    this.producers = response.data.results
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
  display: flex;
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
.add-button {
  button {
  }
}
</style>
