<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb />
    </div>
    <div class="add-beer-container">
      <div class="right">
        <form id="needs-validation">
          <p class="notion required-note">(*) Bắt buộc</p>
          <div class="form-group info__content__bottle-amount">
            <label for=""
              >Tên đăng nhập <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <input
                v-model="newStaff.username"
                type="text"
                class="form-control"
                required
              />
              <div class="invalid-feedback">
                Tên đăng nhập không được bỏ trống !
              </div>
            </div>
          </div>

          <div class="form-group info__content__price">
            <label for="">Mật khẩu<span class="required-note">*</span>:</label>
            <div class="input-box">
              <input
                v-model="newStaff.password"
                type="password"
                class="form-control"
                required
              />
              <div class="invalid-feedback">Mật khẩu không được để trống !</div>
            </div>
          </div>

          <!-- <div class="form-group info__content__price">
            <label for="">Nhập lại mật khẩu<span class="required-note">*</span>:</label>
            <div class="input-box">
              <input
                v-model="newStaff.price"
                type="password"
                class="form-control"
                required
              />
              <div class="invalid-feedback">Mật khẩu không hợp lệ !</div>
            </div>
          </div> -->

          <div class="form-group info__content__bottle-amount">
            <label for="">Email <span class="required-note">*</span>:</label>
            <div class="input-box">
              <input
                v-model="newStaff.email"
                type="text"
                class="form-control"
                required
              />
              <div class="invalid-feedback">Email không được bỏ trống !</div>
            </div>
          </div>

          <div class="form-group info__content__bottle-amount">
            <label for="">Địa chỉ: </label>
            <div class="input-box">
              <input
                v-model="newStaff.address"
                type="text"
                class="form-control"
              />
            </div>
          </div>

          <div class="form-group info__content__bottle-amount">
            <label for="">Số điện thoại: </label>
            <div class="input-box">
              <input
                v-model="newStaff.phone"
                type="text"
                class="form-control"
              />
            </div>
          </div>

          <div class="form-group info__content__bottle-amount">
            <label for="">Tuổi: </label>
            <div class="input-box">
              <input
                v-model="newStaff.age"
                type="number"
                class="form-control"
              />
            </div>
          </div>
          <div class="action">
            <nuxt-link to="/dashboard/shipment" class="btn btn-danger"
              >Hủy</nuxt-link
            >
            <button class="btn btn-primary" @click="addStaff">Thêm</button>
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
      newStaff: {
        username: null,
        password: null,
        email: null,
        address: null,
        phone: null,
        age: null,
      },
      roles: [],
    }
  },
  async created() {
    const roleURL = '/account/role/'

    if (process.client) {
      const authToken = this.$auth.strategy.token.get()
      try {
        const response = await axios.get(`/api/v1${roleURL}`, {
          headers: { Authorization: authToken },
        })
        this.roles = response.data.results
      } catch (err) {
        alert(err)
      }
    }
  },
  methods: {
    async addStaff(event) {
      const isValid = this.validate(event)
      if (isValid) {
        const URL = '/admin/create_staff/'

        if (process.client) {
          const authToken = this.$auth.strategy.token.get()
          try {
            await axios.post(`/api/v1${URL}`, this.newStaff, {
              headers: { Authorization: authToken },
            })
            this.$router.push('/dashboard/staffs')
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
