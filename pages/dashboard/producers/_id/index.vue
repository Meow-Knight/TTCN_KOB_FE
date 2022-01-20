<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb :name="producer.name" />
    </div>
    <div class="add-beer-container">
      <div class="right">
        <form id="needs-validation">
          <div class="right__top">
            <p class="notion required-note">(*) Bắt buộc</p>
          </div>
          <div class="form-group info__content__name">
            <label for=""
              >Tên nhà sản xuất <span class="required-note">*</span></label
            >

            <div class="input-box">
              <input
                id="name"
                v-model="producer.name"
                type="text"
                class="form-control"
                disabled
                required
              />
              <div class="invalid-feedback">
                Tên nhà sản xuất không được bỏ trống !
              </div>
            </div>
          </div>

          <div class="form-group info__content__address">
            <label for=""
              >Địa chỉ nhà sản xuất<span class="required-note">*</span></label
            >

            <div class="input-box">
              <input
                v-model="producer.address"
                type="text"
                class="form-control"
                disabled
                required
              />
              <div class="invalid-feedback">
                Vui lòng địa chỉ nhà sản xuất !
              </div>
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
          </div>
          <div v-else class="action">
            <button class="btn btn-danger" @click="changeState">Hủy</button>
            <button class="btn btn-primary" @click="updateproducer">Lưu</button>
          </div>
        </form>
      </div>
    </div>
    <ConfirmModal
      v-show="showConfirmModal"
      @close-modal="showConfirmModal = false"
      @action-when-confirm="removeProducer"
    >
      <template v-slot:header>
        <h5>Xác nhận xóa bia</h5>
      </template>
      <template v-slot:body>
        <p>Bạn có chắc muốn xóa {{ producer.name }}</p>
      </template>
    </ConfirmModal>
  </div>
</template>

<script>
import axios from 'axios'
import Breadcrumb from '~/components/Breadcrumb.vue'
import ConfirmModal from '~/components/Modal/ConfirmModal.vue'
import { roleGuard } from '~/helper/helper'
export default {
  components: {
    Breadcrumb,
    ConfirmModal,
  },
  layout: 'admin',
  middleware: ['auth', roleGuard('admin')],
  data() {
    return {
      showConfirmModal: false,
      producer: {},
      editting: false,
      PRODUCER_URL: '/beer/producer/',
    }
  },
  computed: {
    producerId() {
      return this.$route.params.id
    },
  },
  async created() {
    if (process.client) {
      const authToken = localStorage.getItem('auth._token.local')
      try {
        const response = await axios.get(
          `/api/v1${this.PRODUCER_URL}${this.producerId}`,
          {
            headers: { Authorization: authToken },
          }
        )
        this.producer = response.data
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
    async updateproducer(event) {
      const isValid = this.validate(event)
      if (isValid) {
        if (process.client) {
          const authToken = localStorage.getItem('auth._token.local')
          try {
            await axios.patch(
              `/api/v1${this.PRODUCER_URL}${this.producerId}/`,
              this.producer,
              {
                headers: { Authorization: authToken },
              }
            )
            this.$router.push('/dashboard/producers')
          } catch (err) {
            alert(err)
          }
        }
      }
    },
    async removeProducer(event) {
      if (process.client) {
        const authToken = localStorage.getItem('auth._token.local')
        try {
          await axios.delete(`/api/v1${this.PRODUCER_URL}${this.producerId}/`, {
            headers: { Authorization: authToken },
          })
          this.$router.push('/dashboard/producers')
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
