<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb />
    </div>
    <div class="add-beer-container">
      <div class="left"><sidebar-admin /></div>
      <div class="right">
        <form id="needs-validation">
          <p class="notion required-note">(*) Bắt buộc</p>
          <div class="form-group info__content__name">
            <label for="">Tên bia <span class="required-note">*</span>:</label>
            <div class="input-box">
              <input
                id="name"
                v-model="newBeer.name"
                type="text"
                class="form-control"
                required
              />
              <div class="invalid-feedback">Tên bia không được bỏ trống !</div>
            </div>
          </div>
          <div class="form-group info__content__alcohol">
            <label for=""
              >Nồng độ cồn (%) <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <input
                v-model="newBeer.alcohol_concentration"
                type="number"
                class="form-control"
                required
              />
              <div class="invalid-feedback">Vui lòng nhập nồng độ cồn !</div>
            </div>
          </div>
          <div class="form-group info__content__capacity">
            <label for=""
              >Dung tích (ml) <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <input
                v-model="newBeer.capacity"
                type="number"
                class="form-control"
                required
              />
              <div class="invalid-feedback">Vui lòng nhập dung tích !</div>
            </div>
          </div>
          <div class="form-group info__content__origin select-container">
            <label for="">Xuất xứ:</label>
            <select
              v-model="newBeer.origin_nation"
              class="form-select form-control"
              aria-label=""
            >
              <option
                v-for="nation in nations"
                :key="nation.id"
                :value="nation.id"
              >
                {{ nation.name }}
              </option>
            </select>
          </div>
          <div class="form-group info__content__price">
            <label for=""
              >Giá (VNĐ) <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <input
                v-model="newBeer.price"
                type="number"
                class="form-control"
                required
              />
              <div class="invalid-feedback">Vui lòng nhập giá tiền !</div>
            </div>
          </div>
          <div class="form-group info__content__unit">
            <label for=""
              >Đơn vị (thùng, hộp,...)
              <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <select
                v-model="newBeer.beer_unit"
                class="form-select form-control"
                aria-label=""
                required
              >
                <option
                  v-for="unit in beerUnits"
                  :key="unit.id"
                  :value="unit.id"
                >
                  {{ unit.name }}
                </option>
              </select>
              <div class="invalid-feedback">Vui lòng chọn đơn vị !</div>
            </div>
          </div>
          <div class="form-group info__content__bottle-amount">
            <label for=""
              >Số lượng trong mỗi đơn vị
              <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <input
                v-model="newBeer.bottle_amount"
                type="number"
                class="form-control"
                required
              />
              <div class="invalid-feedback">Vui lòng điền số lượng !</div>
            </div>
          </div>
          <div class="form-group info__content__description">
            <label for="">Mô tả:</label>
            <textarea
              v-model="newBeer.description"
              rows="5"
              class="form-control"
              name="description"
            ></textarea>
          </div>
          <div class="form-group info__content__producer">
            <label for=""
              >Nhà sản xuất <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <select
                v-model="newBeer.producer"
                class="form-select form-control"
                aria-label=""
                required
              >
                <option
                  v-for="producer in producers"
                  :key="producer.id"
                  :value="producer.id"
                >
                  {{ producer.name }}
                </option>
              </select>
              <div class="invalid-feedback">Vui lòng chọn nhà sản xuất !</div>
            </div>
          </div>
          <div class="action">
            <nuxt-link to="/dashboard/beers" class="btn btn-danger"
              >Hủy</nuxt-link
            >
            <button class="btn btn-primary" @click="addBeer">Thêm</button>
          </div>
        </form>
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
      producers: [],
      beerUnits: [],
      nations: [],
      newBeer: {
        name: null,
        alcohol_concentration: null,
        capacity: null,
        origin_nation: null,
        price: null,
        bottle_amount: null,
        describe: null,
        producer: null,
        beer_unit: null,
      },
    }
  },
  async created() {
    const PRODUCER_URL = '/beer/producer/'
    const BEER_UNIT_URL = '/beer/unit/'
    const NATION_URL = '/beer/nation/'

    if (process.client) {
      const authToken = localStorage.getItem('auth._token.local')
      try {
        const response = await this.$axios.get(`/api/v1${PRODUCER_URL}`, {
          headers: { Authorization: authToken },
        })
        this.producers = response.data.results

        const responseBeerUnit = await this.$axios.get(
          `/api/v1${BEER_UNIT_URL}`,
          {
            headers: { Authorization: authToken },
          }
        )
        this.beerUnits = responseBeerUnit.data.results

        const responseNation = await this.$axios.get(`/api/v1${NATION_URL}`, {
          headers: { Authorization: authToken },
        })
        this.nations = responseNation.data.results
      } catch (err) {
        alert(err)
      }
    }
  },
  methods: {
    async addBeer(event) {
      const isValid = this.validate(event)
      if (isValid) {
        const URL = '/beer/'

        if (process.client) {
          const authToken = localStorage.getItem('auth._token.local')
          try {
            await this.$axios.post(`/api/v1${URL}`, this.newBeer, {
              headers: { Authorization: authToken },
            })
            this.$router.push('/dashboard/beers')
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
