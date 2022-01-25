<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    <div class="add-beer-container">
      <div class="right">
        <form id="needs-validation">
          <p class="notion required-note">(*) Bắt buộc</p>

          <div class="form-group info__content__capacity">
            <label for=""
              >Ngày nhập <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <b-form-datepicker
                id="example-datepicker"
                v-model="newShipment.shipment_date"
                class="mb-2"
              ></b-form-datepicker>
              <div class="invalid-feedback">Vui lòng nhập ngày nhập !</div>
            </div>
          </div>

          <div class="form-group info__content__bottle-amount">
            <label for=""
              >Số lượng nhập <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <input
                v-model="newShipment.amount"
                type="number"
                class="form-control"
                required
              />
              <div class="invalid-feedback">Vui lòng điền số lượng !</div>
            </div>
          </div>

          <div class="form-group info__content__price">
            <label for=""
              >Giá (VNĐ) <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <input
                v-model="newShipment.price"
                type="number"
                class="form-control"
                required
              />
              <div class="invalid-feedback">Vui lòng nhập giá tiền !</div>
            </div>
          </div>

          <div class="form-group info__content__producer">
            <label for="">Bia <span class="required-note">*</span>:</label>
            <div class="input-box">
              <select
                v-model="newShipment.beer"
                class="form-select form-control"
                aria-label=""
                required
              >
                <option v-for="beer in Beers" :key="beer.id" :value="beer.id">
                  {{ beer.name }}
                </option>
              </select>
              <div class="invalid-feedback">Vui lòng chọn bia !</div>
            </div>
          </div>
          <div class="action">
            <nuxt-link to="/dashboard/shipment" class="btn btn-danger"
              >Hủy</nuxt-link
            >
            <button class="btn btn-primary" @click="addShipment">Thêm</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '~/components/Breadcrumb.vue'
export default {
  components: { Breadcrumb },
  layout: 'admin',
  data() {
    return {
      breadcrumbItems: [
        { name: 'Trang chủ', url: '/' },
        { name: 'Quản lý', url: '/dashboard' },
        { name: 'Thêm bia mới', url: '/dashboard/beers/addBeer' },
      ],
      newShipment: {
        shipment_date: null,
        amount: null,
        price: null,
        beer: null,
      },
      Beers: [],
    }
  },
  async created() {
    const BEER_URL = '/beer/get_all_with_name/'

    if (process.client) {
      const authToken = this.$auth.strategy.token.get()
      try {
        const responseBeerUnit = await axios.get(`/api/v1${BEER_URL}`, {
          headers: { Authorization: authToken },
        })
        this.Beers = responseBeerUnit.data
      } catch (err) {
        alert(err)
      }
    }
  },
  methods: {
    async addShipment(event) {
      const isValid = this.validate(event)
      if (isValid) {
        const URL = '/beer/shipment/'

        if (process.client) {
          const authToken = localStorage.getItem('auth._token.google')
          try {
            await axios.post(`/api/v1${URL}`, this.newShipment, {
              headers: { Authorization: authToken },
            })
            this.$router.push('/dashboard/shipment')
          } catch (err) {
            alert(err)
          }
        }
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
  },
}
</script>

<style lang="scss" scoped>
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
  .input-box {
    display: flex;
    flex-direction: column;
  }
}
.btn {
  width: 100px;
}
</style>
