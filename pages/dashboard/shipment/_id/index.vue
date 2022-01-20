<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb :name="originShipment.beer.name" />
    </div>
    <div class="add-beer-container">
      <div class="right">
        <form id="needs-validation">
          <div class="right__top">
            <p class="notion required-note">(*) Bắt buộc</p>
          </div>
          <div class="form-group info">
            <label for=""
              >Ngày chuyển đến<span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <input
                type="date"
                v-model="newShipment.shipment_date"
                class="mb-2 form-control"
                disabled
              />
              <div class="invalid-feedback">
                Vui lòng nhập ngày vận chuyển đến !
              </div>
            </div>
          </div>

          <div class="form-group info">
            <label for="">Số lượng <span class="required-note">*</span>:</label>
            <div class="input-box">
              <input
                v-model="newShipment.amount"
                type="number"
                class="form-control"
                disabled
                required
              />
              <div class="invalid-feedback">Vui lòng điền số lượng !</div>
            </div>
          </div>

          <div class="form-group info">
            <label for=""
              >Giá (VNĐ) <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <input
                v-model="newShipment.price"
                type="number"
                class="form-control"
                required
                disabled
              />
              <div class="invalid-feedback">Vui lòng nhập giá tiền !</div>
            </div>
          </div>

          <div class="form-group info">
            <label for="">Bia <span class="required-note">*</span>:</label>
            <div class="input-box">
              <select
                v-model="newShipment.beer.id"
                class="form-select form-control"
                aria-label=""
                disabled
                required
              >
                <option
                  v-for="beer in beers"
                  :key="beer.id"
                  :value="beer.id"
                  :selected="originShipment.beer.id == beer.id"
                >
                  {{ beer.name }}
                </option>
              </select>
              <div class="invalid-feedback">Vui lòng chọn bia !</div>
            </div>
          </div>

          <div v-if="!editting" class="action">
            <button class="btn btn-danger" @click="removeShipment">Xóa</button>
            <button class="btn btn-primary" @click="changeState">
              Chỉnh sửa
            </button>
          </div>
          <div v-else class="action">
            <button class="btn btn-danger" @click="changeState">Hủy</button>
            <button class="btn btn-primary" @click="updateShipment">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '~/components/Breadcrumb.vue'
import { roleGuard } from '~/helper/helper'

export default {
  middleware: ['auth', roleGuard('admin')],
  components: {
    Breadcrumb,
  },
  layout: 'admin',
  computed: {
    shipmentId() {
      return this.$route.params.id
    },
  },
  watch: {
    // checkValidDate() {
    //   if(shipments.shipment_date = 'dd/mm/yy')
    // }
  },
  data() {
    return {
      breadcrumbItems: [
        { name: 'Trang chủ', url: '/' },
        { name: 'Quản lý', url: '/dashboard' },
        { name: 'Vận chuyển', url: '/dashboard/shipment' },
        {
          name: 'Chi tiết đơn vận chuyển',
          url: `/dashboard/shipment/${this.shipmentId}`,
        },
      ],
      originShipment: {
        beer: {
          id: null,
        },
      },
      newShipment: {
        beer: {
          id: null,
        },
      },
      beers: [],
      editting: false,
      SHIPMENT_URL: '/beer/shipment/',
      BEER_URL: '/beer/get_all_with_name/',
    }
  },
  async created() {
    if (process.client) {
      const authToken = this.$auth.strategy.token.get()
      try {
        const responseBeerUnit = await axios.get(`/api/v1${this.BEER_URL}`, {
          headers: { Authorization: authToken },
        })
        this.beers = responseBeerUnit.data
        const response = await axios.get(
          `/api/v1${this.SHIPMENT_URL}${this.shipmentId}`,
          {
            headers: { Authorization: authToken },
          }
        )
        this.originShipment = response.data
        Object.assign(this.newShipment, response.data)
        if (!this.newShipment.beer) {
          this.newShipment.beer = {
            id: null,
          }
        }
      } catch (err) {
        alert(err)
      }
    }
  },
  methods: {
    changeState(event) {
      event.preventDefault()
      this.editting = !this.editting
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
    async updateShipment(event) {
      const isValid = this.validate(event)
      if (isValid) {
        if (process.client) {
          const authToken = this.$auth.strategy.token.get()
          const newShipmentInput = {
            ...this.newShipment,
            beer: this.newShipment.beer.id,
          }
          try {
            await axios.patch(
              `/api/v1${this.SHIPMENT_URL}${this.shipmentId}/`,
              newShipmentInput,
              {
                headers: { Authorization: authToken },
              }
            )
            this.$router.push('/dashboard/shipment')
          } catch (err) {
            alert(err)
          }
        }
      }
    },
    async removeShipment(event) {
      event.preventDefault()
      if (process.client) {
        const authToken = localStorage.getItem('auth._token.google')
        try {
          await axios.delete(`/api/v1${this.SHIPMENT_URL}${this.shipmentId}/`, {
            headers: { Authorization: authToken },
          })
          this.$router.push('/dashboard/shipment')
        } catch (err) {
          alert(err)
        }
      }
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
    margin-bottom: 40px;

    &__top {
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
  width: 100px;
}
</style>
