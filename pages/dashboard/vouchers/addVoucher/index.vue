<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb />
    </div>
    <div class="add-beer-container">
      <div class="right">
        <div class="right__top">
          <h5 class="subtitle">Thêm khuyến mãi</h5>
          <form id="needs-validation">
            <div class="notion-container">
              <p class="notion required-note">(*) Bắt buộc</p>
            </div>
            <div class="form-group info__content__name">
              <label for=""
                >Tên khuyến mãi <span class="required-note">*</span></label
              >

              <div class="input-box">
                <input
                  id="name"
                  v-model="newDiscount.name"
                  type="text"
                  class="form-control"
                  required
                />
                <div class="invalid-feedback">
                  Tên khuyến mãi không được bỏ trống !
                </div>
              </div>
            </div>
            <div class="beer-discounts">
              <label
                >Các sản phẩm được hưởng khuyến mãi
                <span class="required-note">*</span></label
              >
              <ul class="list-group list-group-flush">
                <li
                  v-for="beerDiscount in beerDiscounts"
                  :key="beerDiscount.id"
                  class="list-group-item beer-discounts__item"
                >
                  <label for="" class="beer-name">
                    {{
                      beers.find((beer) => beer.id === beerDiscount.beer)
                        ? beers.find((beer) => beer.id === beerDiscount.beer)
                            .name
                        : ''
                    }}</label
                  >
                  <div class="beer-discounts__item__right">
                    <div class="form-group">
                      <div class="input-box">
                        <div class="d-flex align-items-center">
                          <input
                            v-model="beerDiscount.discount_percent"
                            type="number"
                            min="0"
                            max="100"
                            class="form-control info__content__percent"
                            required
                          />
                          <span>%</span>
                        </div>
                        <div class="invalid-feedback">
                          Vui lòng nhập chiết khấu !
                        </div>
                      </div>
                    </div>
                    <button
                      class="btn btn-danger"
                      @click="
                        (event) => {
                          event.preventDefault()
                          beerDiscounts = beerDiscounts.filter(
                            (element) => element.beer !== beerDiscount.beer
                          )
                        }
                      "
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
            <div class="form-group select-beer">
              <label for="">Thêm sản phẩm</label>
              <div class="input-box">
                <select
                  v-model="newBeerDiscount.beer"
                  class="form-select form-control"
                  aria-label=""
                >
                  <option
                    v-for="beer in beersNotHaveDiscount"
                    :key="beer.id"
                    :value="beer.id"
                  >
                    {{ beer.name }}
                  </option>
                </select>
                <div class="invalid-feedback">Vui lòng chọn bia !</div>
              </div>
              <div class="form-group">
                <div class="input-box">
                  <div class="d-flex align-items-center mx-1">
                    <input
                      v-model="newBeerDiscount.discount_percent"
                      type="number"
                      min="0"
                      max="100"
                      class="form-control info__content__percent"
                    />
                    <span>%</span>
                  </div>
                </div>
              </div>
              <button class="btn btn-primary" @click="addBeerForUpdate">
                Thêm
              </button>
            </div>
            <div class="select-date-container">
              <div class="select-date start">
                <label for=""
                  >Ngày bắt đầu <span class="required-note">*</span></label
                >
                <div>
                  <input
                    v-model="newDiscount.start_date"
                    class="form-control"
                    type="date"
                    required
                  />
                  <div class="invalid-feedback">
                    Ngày bắt đầu không được bỏ trống !
                  </div>
                </div>
              </div>
              <div class="select-date end">
                <label for=""
                  >Ngày kết thúc <span class="required-note">*</span></label
                >
                <input
                  v-model="newDiscount.end_date"
                  class="form-control"
                  type="date"
                  required
                />
              </div>
            </div>
            <div class="action">
              <nuxt-link to="/dashboard/vouchers" class="btn btn-danger"
                >Hủy</nuxt-link
              >
              <button
                class="btn btn-primary"
                @click="
                  (event) => {
                    event.preventDefault()
                    showConfirmModal = true
                  }
                "
              >
                Thêm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <ConfirmModal
      v-show="showConfirmModal"
      @close-modal="showConfirmModal = false"
      @action-when-confirm="addDiscount"
    >
      <template #header>
        <h5>Xác nhận thêm khuyến mãi</h5>
      </template>
      <template #body>
        <p>Bạn có chắc muốn thêm khuyến mãi</p>
      </template>
    </ConfirmModal>
  </div>
</template>

<script>
import Breadcrumb from '~/components/Breadcrumb.vue'
import ConfirmModal from '~/components/Modal/ConfirmModal.vue'
export default {
  components: { Breadcrumb, ConfirmModal },
  layout: 'admin',
  data() {
    return {
      showConfirmModal: false,
      beers: [],
      beersNotHaveDiscount: [],
      newDiscount: {},
      beerDiscounts: [],
      newBeerDiscount: {
        beer: '',
        discount_percent: null,
      },
    }
  },
  async created() {
    const BEER_URL = '/beer/get_all_with_name/'
    this.$store.commit('setLoadingState', true)

    if (process.client) {
      const authToken = localStorage.getItem('auth._token.local')
      try {
        const responseBeer = await this.$axios.get(`/api/v1${BEER_URL}`, {
          headers: { Authorization: authToken },
        })
        this.beers = responseBeer.data
        this.beersNotHaveDiscount = responseBeer.data
      } catch (err) {
        alert(err)
      }
    }
    this.$store.commit('setLoadingState', false)
  },
  methods: {
    validate() {
      const form = document.getElementById('needs-validation')
      form.classList.add('was-validated')

      if (form.checkValidity() === false) {
        return false
      }

      return true
    },
    async addDiscount() {
      const isValid = this.validate()
      const DISCOUNT_URL = '/beer/discount/'
      this.$store.commit('setLoadingState', true)
      if (isValid && process.client) {
        const authToken = localStorage.getItem('auth._token.local')
        try {
          await this.$axios.post(
            `/api/v1${DISCOUNT_URL}`,
            { ...this.newDiscount, beers: this.beerDiscounts },
            {
              headers: { Authorization: authToken },
            }
          )
          this.$router.push('/dashboard/vouchers')
        } catch (err) {
          alert(err)
        }
      }
      this.showConfirmModal = false
      this.$store.commit('setLoadingState', false)
    },
    addBeerForUpdate(event) {
      event.preventDefault()
      if (this.newBeerDiscount.beer || this.newBeerDiscount.discount_percent) {
        const beerDiscountAdded = {}
        Object.assign(beerDiscountAdded, this.newBeerDiscount)
        this.beerDiscounts.push(beerDiscountAdded)
        this.beersNotHaveDiscount = this.beers.filter(
          (beer) =>
            !this.beerDiscounts.map((element) => element.beer).includes(beer.id)
        )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.add-beer-container {
  display: flex;
  flex-direction: row;
  .left {
    width: 300px;
  }
  .right {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    margin-bottom: 40px;

    &__top,
    &__bottom {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 30px;
      padding-left: 20px;
      padding-right: 20px;
      background-color: $hoverSidebar;
      padding-top: 20px;
      border-radius: 10px;
      width: 100%;
    }

    .subtitle {
      width: 100%;
      text-align: left;
      padding-left: 5%;
      font-weight: 500;
      color: $black;
    }

    .notion-container {
      display: flex;
      width: 100%;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .notion {
      width: 100%;
      text-align: left;
    }
    .required-note {
      color: red;
    }
  }
}
.form-control {
  box-shadow: none;
}
.form-group {
  display: flex;
  flex-direction: row;

  label {
    width: 200px;
  }
  .form-select,
  input,
  textarea {
    width: 400px;
  }
}
.btn {
  margin-bottom: 30px;
}
.list-group-flush {
  border-radius: 5px;
  margin-bottom: 10px;
}
.beer-discounts__item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  &__right {
    display: flex;
    flex-direction: row;
    .btn-danger {
      margin-left: 10px;
      width: 50px;
    }
  }
}
.info__content__percent {
  width: 100px !important;
}
.select-beer {
  .btn-primary {
    margin-left: 10px;
  }
}
.select-date {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  width: 60%;
  input {
    width: 200px !important;
  }
}
.btn {
  white-space: nowrap !important;
  display: inline-block;
}
</style>
