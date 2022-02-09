<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb :name="originDiscount.name" />
    </div>
    <div class="add-beer-container">
      <div class="right">
        <div class="right__top">
          <h5 class="subtitle">Thông tin khuyến mãi</h5>
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
                  v-model="updatedDiscount.name"
                  type="text"
                  class="form-control"
                  disabled
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
              <ul v-if="!editting" class="list-group list-group-flush">
                <li
                  v-for="beerDiscount in updatedDiscount.beer_discounts"
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
                            disabled
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
                      v-if="editting"
                      class="btn btn-danger"
                      @click="
                        (event) => {
                          event.preventDefault()
                          updatedDiscount.beer_discounts =
                            updatedDiscount.beer_discounts.filter(
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
              <ul v-else class="list-group list-group-flush">
                <li
                  v-for="beerDiscount in updatedDiscount.beer_discounts"
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
                      v-if="editting"
                      class="btn btn-danger"
                      @click="
                        (event) => {
                          event.preventDefault()
                          updatedDiscount.beer_discounts =
                            updatedDiscount.beer_discounts.filter(
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
            <div v-if="editting" class="form-group select-beer">
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
                <label for="">Ngày bắt đầu </label>
                <input
                  v-model="updatedDiscount.start_date"
                  class="form-control"
                  type="date"
                  disabled
                  required
                />
              </div>
              <div class="select-date end">
                <label for="">Ngày kết thúc </label>
                <input
                  v-model="updatedDiscount.end_date"
                  class="form-control"
                  type="date"
                  disabled
                  required
                />
              </div>
            </div>
            <div v-if="!editting" class="action">
              <button
                class="btn btn-danger"
                @click="
                  (event) => {
                    event.preventDefault()
                    showConfirmModal = true
                  }
                "
              >
                Xóa
              </button>
              <button class="btn btn-primary" @click="changeState">
                Chỉnh sửa
              </button>
              <button
                v-if="originDiscount.is_activate"
                class="btn btn-danger"
                @click="
                  (event) => {
                    event.preventDefault()
                    changeStatus(originDiscount.is_activate, originDiscount.id)
                  }
                "
              >
                Hủy kích hoạt
              </button>
              <button
                v-else
                class="btn btn-primary"
                @click="
                  changeStatus(originDiscount.is_activate, originDiscount.id)
                "
              >
                Kích hoạt
              </button>
            </div>
            <div v-else class="action">
              <button class="btn btn-danger" @click="changeState">Hủy</button>
              <button class="btn btn-primary" @click="updateDiscount">
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <ConfirmModal
      v-show="showConfirmModal"
      @close-modal="showConfirmModal = false"
      @action-when-confirm="removeDiscount"
    >
      <template #header>
        <h5>Xác nhận xóa khuyến mãi</h5>
      </template>
      <template #body>
        <p>Bạn có chắc muốn xóa {{ originDiscount.name }}</p>
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
      beersNotHaveDiscount: [],
      beers: [],
      originDiscount: {
        name: '',
      },
      updatedDiscount: {
        name: null,
        beer_discounts: [],
      },
      newBeerDiscount: {
        beer: null,
        discount_percent: null,
      },
      editting: false,
    }
  },
  computed: {
    discountId() {
      return this.$router.currentRoute.params.id
    },
  },
  async created() {
    const BEER_URL = '/beer/get_all_with_name/'
    const DISCOUNT_URL = '/beer/discount/'

    this.$store.commit('setLoadingState', true)

    if (process.client) {
      const authToken = localStorage.getItem('auth._token.local')
      try {
        const responseDiscount = await this.$axios.get(
          `/api/v1${DISCOUNT_URL}${this.discountId}`,
          {
            headers: { Authorization: authToken },
          }
        )
        this.originDiscount = responseDiscount.data
        Object.assign(this.updatedDiscount, responseDiscount.data)

        const responseBeer = await this.$axios.get(`/api/v1${BEER_URL}`, {
          headers: { Authorization: authToken },
        })
        this.beers = responseBeer.data
        this.beersNotHaveDiscount = this.beers.filter(
          (beer) =>
            !this.originDiscount.beer_discounts
              .map((element) => element.beer)
              .includes(beer.id)
        )
      } catch (err) {
        alert(err)
      }
    }
    this.$store.commit('setLoadingState', false)
  },
  methods: {
    changeState(event) {
      event.preventDefault()
      this.editting = !this.editting
      if (!this.editting) {
        Object.assign(this.updatedDiscount, this.originDiscount)
      }
      const inputs = document.getElementsByClassName('form-control')
      const notes = document.getElementsByClassName('required-note')
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = !inputs[i].disabled
      }
      for (let i = 0; i < notes.length; i++) {
        notes[i].style.visibility =
          notes[i].style.visibility === 'visible' ? 'hidden' : 'visible'
      }
    },
    validate(event) {
      const form = document.getElementById('needs-validation')
      event.preventDefault()
      form.classList.add('was-validated')

      if (form.checkValidity() === false) {
        event.stopPropagation()
        return false
      }

      return true
    },
    async updateDiscount(event) {
      this.$store.commit('setLoadingState', true)
      const isValid = this.validate(event)
      if (isValid) {
        const beerDiscountURL = '/beer/beer_discount/'
        if (process.client) {
          const authToken = localStorage.getItem('auth._token.local')

          // Updates beer_discount for voucher
          for (const discount of this.updatedDiscount.beer_discounts) {
            if (discount.id) {
              try {
                await this.$axios.patch(
                  `/api/v1${beerDiscountURL}${discount.id}/`,
                  { discount_percent: discount.discount_percent },
                  {
                    headers: { Authorization: authToken },
                  }
                )
              } catch (err) {
                alert(err)
              }
            } else {
              try {
                await this.$axios.post(
                  `/api/v1${beerDiscountURL}`,
                  {
                    ...discount,
                    discount: this.originDiscount.id,
                  },
                  {
                    headers: { Authorization: authToken },
                  }
                )
              } catch (err) {
                alert(err)
              }
            }
          }

          // Remove beer_discount out of voucher
          for (const discount of this.originDiscount.beer_discounts) {
            if (!this.updatedDiscount.beer_discounts.includes(discount)) {
              try {
                await this.$axios.delete(
                  `/api/v1${beerDiscountURL}${discount.id}/`,
                  { discount_percent: discount.discount_percent },
                  {
                    headers: { Authorization: authToken },
                  }
                )
              } catch (err) {
                alert(err)
              }
            }
          }

          // Updates name, start_date, end_date of voucher
          const discountURL = '/beer/discount/'
          const updatedDiscountInput = {
            name: this.updatedDiscount.name,
            start_date: this.updatedDiscount.start_date,
            end_date: this.updatedDiscount.end_date,
          }

          try {
            await this.$axios.patch(
              `/api/v1${discountURL}${this.discountId}/`,
              updatedDiscountInput,
              {
                headers: { Authorization: authToken },
              }
            )
          } catch (err) {
            alert(err)
          }

          window.location.reload(true)
        }
      }
      this.$store.commit('setLoadingState', false)
    },
    async removeDiscount(event) {
      const URL = '/beer/discount/'
      this.$store.commit('setLoadingState', true)

      if (process.client) {
        const authToken = localStorage.getItem('auth._token.local')
        try {
          await this.$axios.delete(`/api/v1${URL}${this.discountId}/`, {
            headers: { Authorization: authToken },
          })
          this.$router.push('/dashboard/vouchers')
        } catch (err) {
          alert(err)
        }
      }
      this.$store.commit('setLoadingState', false)
    },
    addBeerForUpdate(event) {
      event.preventDefault()
      if (this.newBeerDiscount.beer || this.newBeerDiscount.discount_percent) {
        const beerDiscountAdded = {}
        Object.assign(beerDiscountAdded, this.newBeerDiscount)
        this.updatedDiscount.beer_discounts.push(beerDiscountAdded)
        this.beersNotHaveDiscount = this.beers.filter(
          (beer) =>
            !this.updatedDiscount.beer_discounts
              .map((element) => element.beer)
              .includes(beer.id)
        )
      }
    },
    async changeStatus(currentStatus) {
      const URL = '/beer/discount/'
      this.$store.commit('setLoadingState', true)

      if (process.client) {
        const authToken = localStorage.getItem('auth._token.local')
        try {
          await this.$axios.patch(
            `/api/v1${URL}${this.discountId}/`,
            { is_activate: !currentStatus },
            {
              headers: { Authorization: authToken },
            }
          )
        } catch (err) {
          alert(err)
        }
      }
      window.location.reload(true)
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
      visibility: hidden;
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
