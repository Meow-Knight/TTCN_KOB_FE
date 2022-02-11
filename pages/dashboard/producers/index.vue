<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb />
    </div>
    <div class="users-container">
      <div class="right">
        <div class="total-users container-fluid">
          <span>Tất cả nhà sản xuất: {{ totalProducer }}</span>

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
          <div class="overflow-auto">
            <b-pagination
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
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
    <Modal v-show="showModal" @close-modal="showModal = false" />
  </div>
</template>

<script>
import Breadcrumb from '~/components/Breadcrumb.vue'
import Modal from '~/components/Modal/ProducerModal.vue'
export default {
  components: { Breadcrumb, Modal },
  layout: 'admin',
  data() {
    return {
      showModal: false,
      producers: [],
      next: null,
      previous: null,
      rows: 0,
      perPage: 12,
      currentPage: 1,
      searchText: '',
      sortBy: {
        field: 'name',
        asc: true,
      },
      totalProducer: 0,
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
        this.$store.commit('setLoadingState', true)
        const authToken = this.$auth.strategy.token.get()
        try {
          const response = await this.$axios.get(`/api/v1${url}`, {
            headers: { Authorization: authToken },
          })
          this.producers = response.data.results
          this.rows = response.data.count
          this.previous = response.data.previous
          this.next = response.data.next
          this.totalProducer = response.data.count
        } catch (err) {
          alert(err)
        }
        this.$store.commit('setLoadingState', false)
      }
    },
    changePage(pageNumber) {
      const URL = `/beer/producer/?page=${pageNumber}&page_size=${this.perPage}&q=${this.searchText}&sort=${this.sortOption}`
      this.getData(URL)
    },
    search() {
      const URL = `/beer/producer/?page=1&page_size=${this.perPage}&q=${this.searchText}&sort=${this.sortOption}`
      this.getData(URL)
    },
    sort(field) {
      this.sortBy.field = field
      this.sortBy.asc = !this.sortBy.asc
      const URL = `/beer/producer/?page=1&page_size=${this.pageSize}&q=${this.searchText}&sort=${this.sortOption}`
      this.getData(URL)
    },
  },
  created() {
    const URL = `/beer/producer/?page=1&page_size=${this.perPage}`
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
